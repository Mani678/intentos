'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useIntentStore } from '@/store/intentStore';
import { TopBar } from '@/components/dashboard/TopBar';
import { IntentInput } from '@/components/intent/IntentInput';
import { IntentPreview } from '@/components/intent/IntentPreview';
import { ConfirmingScreen } from '@/components/intent/ConfirmingScreen';
import { SuccessScreen } from '@/components/intent/SuccessScreen';
import { FailedScreen } from '@/components/intent/FailedScreen';
import { TransactionHistory } from '@/components/history/TransactionHistory';

export function DashboardShell() {
  const { screen } = useIntentStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {screen === 'dashboard' && (
            <ScreenWrapper key="dashboard">
              <IntentInput />
            </ScreenWrapper>
          )}
          {screen === 'parsing' && (
            <ScreenWrapper key="parsing">
              <ParsingScreen />
            </ScreenWrapper>
          )}
          {screen === 'preview' && (
            <ScreenWrapper key="preview">
              <IntentPreview />
            </ScreenWrapper>
          )}
          {screen === 'confirming' && (
            <ScreenWrapper key="confirming">
              <ConfirmingScreen />
            </ScreenWrapper>
          )}
          {screen === 'success' && (
            <ScreenWrapper key="success">
              <SuccessScreen />
            </ScreenWrapper>
          )}
          {screen === 'failed' && (
            <ScreenWrapper key="failed">
              <FailedScreen />
            </ScreenWrapper>
          )}
          {screen === 'history' && (
            <ScreenWrapper key="history">
              <TransactionHistory />
            </ScreenWrapper>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-xl"
    >
      {children}
    </motion.div>
  );
}

function ParsingScreen() {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
          <svg className="animate-spin text-accent" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>
        <div className="absolute -inset-2 bg-accent/5 rounded-3xl blur-xl animate-pulse-slow" />
      </div>
      <div className="text-center">
        <p className="text-text-primary font-medium mb-1">Understanding your intent…</p>
        <p className="text-text-secondary text-sm">Gemini is parsing your request</p>
      </div>
    </div>
  );
}
