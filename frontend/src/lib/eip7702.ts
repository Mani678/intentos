import { Signature } from 'ethers';

export interface EIP7702Auth {
  address: string;
  chainId: number;
  nonce: number;
}

export interface AuthorizationResult {
  userOpHash: string;
  signature: string;
}

// Sign EIP-7702 authorization using Magic's provider
export const signEIP7702Authorization = async (
  magic: any,
  auth: EIP7702Auth
): Promise<string> => {
  try {
    // Get the Magic provider
    const provider = await magic.wallet.getProvider();

    // Sign the authorization
    const authMessage = {
      address: auth.address,
      chainId: auth.chainId,
      nonce: auth.nonce,
    };

    // Magic signs using eth_signTypedData_v4
    const accounts = await provider.request({ method: 'eth_accounts' });
    const from = accounts[0];

    const signature = await provider.request({
      method: 'personal_sign',
      params: [
        JSON.stringify(authMessage),
        from,
      ],
    });

    return signature;
  } catch (err) {
    console.error('EIP-7702 signing error:', err);
    throw err;
  }
};

export const serializeSignature = (sig: {
  r: string;
  s: string;
  yParity: number;
}): string => {
  return Signature.from({
    r: sig.r,
    s: sig.s,
    yParity: sig.yParity,
  }).serialized;
};