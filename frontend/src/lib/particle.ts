import { UniversalAccount, CHAIN_ID, SUPPORTED_TOKEN_TYPE } from '@particle-network/universal-account-sdk';

export const ARBITRUM_CHAIN_ID = CHAIN_ID.ARBITRUM_MAINNET_ONE;
export { SUPPORTED_TOKEN_TYPE };

export const getUniversalAccount = (ownerAddress: string): UniversalAccount => {
  if (!ownerAddress) throw new Error('Owner address required');

  return new UniversalAccount({
    projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID!,
    projectClientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY!,
    projectAppUuid: process.env.NEXT_PUBLIC_PARTICLE_APP_ID!,
    smartAccountOptions: {
      ownerAddress,
      useEIP7702: true,
    },
    tradeConfig: {
      universalGas: true,
    },
  });
};