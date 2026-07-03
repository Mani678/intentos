'use client';

import { useState, useCallback } from 'react';
import { CHAIN_ID, SUPPORTED_TOKEN_TYPE } from '@particle-network/universal-account-sdk';
import { getAddress } from 'ethers';
import { getUniversalAccount } from '@/lib/particle';
import { magic } from '@/lib/magic';
import { ParsedIntent } from '@/store/intentStore';

export const useParticle = (ownerAddress: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeTransaction = useCallback(async (
    parsedIntent: ParsedIntent
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const checksummedAddress = getAddress(ownerAddress);
      const ua = getUniversalAccount(checksummedAddress);
      const provider = magic?.rpcProvider;
      if (!provider) throw new Error('Magic provider not available');

      const recipientAddress = parsedIntent.recipientAddress
        ? getAddress(parsedIntent.recipientAddress)
        : checksummedAddress;

      const amount = (parsedIntent.amount || 0).toString();

    

      const transaction = await ua.createUniversalTransaction({
        chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE,
        expectTokens: [
          {
            type: SUPPORTED_TOKEN_TYPE.USDC,
            amount,
          },
        ],
        transactions: [
          {
            to: recipientAddress,
            data: '0x',
            value: '0x0',
          },
        ],
      });


      const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
      const from = accounts[0];

      // Handle EIP-7702 authorizations using Magic's dedicated method
      const authorizations: { userOpHash: string; signature: string }[] = [];

      for (const userOp of transaction.userOps || []) {
        if (userOp.eip7702Auth && !userOp.eip7702Delegated) {

          const auth = await (magic as any).wallet.sign7702Authorization({
            contractAddress: userOp.eip7702Auth.address,
            chainId: userOp.eip7702Auth.chainId,
            nonce: userOp.eip7702Auth.nonce,
          });


          const vHex = auth.v === 27 ? '1b' : '1c';
          const signature = auth.r + auth.s.slice(2) + vHex;

          authorizations.push({
            userOpHash: userOp.userOpHash,
            signature,
          });
        }
      }

      // Sign root hash
      const signature = await provider.request({
        method: 'personal_sign',
        params: [transaction.rootHash, from],
      }) as string;

      // Send transaction
      const result = await ua.sendTransaction(transaction, signature, authorizations);


      // Extract real on-chain tx hash from result
      const onChainHash =
        result.lendingUserOperations?.[0]?.txHash ||
        result.settlementUserOperations?.[0]?.txHash ||
        result.transactionId;

      return onChainHash;
    } catch (err: any) {
      console.error('UA Transaction error:', err);
      setError(err.message || 'Transaction failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ownerAddress]);

  return { executeTransaction, isLoading, error };
};