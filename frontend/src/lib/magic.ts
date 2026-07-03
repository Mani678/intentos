import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth2';

const ARBITRUM_RPC = 'https://arb1.arbitrum.io/rpc';
const ARBITRUM_CHAIN_ID = 42161;

const createMagic = () => {
  if (typeof window === 'undefined') return null;
  return new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!, {
    extensions: [new OAuthExtension()],
    network: {
      rpcUrl: ARBITRUM_RPC,
      chainId: ARBITRUM_CHAIN_ID,
    },
  }) as any;
};

export const magic = createMagic();