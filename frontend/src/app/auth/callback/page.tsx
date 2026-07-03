'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { magic } from '@/lib/magic';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finish = async () => {
      try {
        if (!magic) throw new Error('Magic not initialized');

        const result = await (magic as any).oauth2.getRedirectResult();

        const walletAddress =
          result.magic.userMetadata?.wallets?.ethereum?.publicAddress ||
          result.magic.userMetadata?.publicAddress ||
          '0x0000000000000000000000000000000000000000';

        const email =
          result.magic.userMetadata.email ||
          result.oauth?.userInfo?.email ||
          '';

        await api.post('/users/upsert', {
          email,
          magicDid: result.magic.userMetadata.issuer,
          walletAddress,
          displayName: email.split('@')[0],
        });

        router.replace('/dashboard');
      } catch (err) {
        console.error('Auth callback error:', err);
        router.replace('/?error=auth_failed');
      }
    };

    finish();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5"
      >
        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg className="animate-spin text-accent" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-text-primary font-medium mb-1">Signing you in...</p>
          <p className="text-text-secondary text-sm">Setting up your account</p>
        </div>
      </motion.div>
    </div>
  );
}