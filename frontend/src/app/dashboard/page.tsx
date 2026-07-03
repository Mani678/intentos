'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const justLoggedIn = sessionStorage.getItem('just_logged_in');
    if (justLoggedIn) {
      sessionStorage.removeItem('just_logged_in');
      setIsReady(true);
      return;
    }

    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    const t = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(t);
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg
              className="animate-spin text-accent"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <p className="text-text-secondary text-sm">Loading IntentOS…</p>
        </motion.div>
      </div>
    );
  }

  return <DashboardShell />;
}