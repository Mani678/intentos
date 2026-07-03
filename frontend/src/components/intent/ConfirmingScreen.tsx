'use client';

import { motion } from 'framer-motion';
import { useIntentStore } from '@/store/intentStore';

const STEPS = [
  { label: 'Routing via Universal Accounts', delay: 0 },
  { label: 'Optimizing gas on Arbitrum', delay: 0.8 },
  { label: 'Broadcasting transaction', delay: 1.6 },
];

export function ConfirmingScreen() {
  const { parsedIntent } = useIntentStore();

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      {/* Animated orb */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-32 h-32 bg-accent/10 rounded-full blur-2xl animate-pulse-slow" />
        <div className="relative w-20 h-20 rounded-3xl bg-surface border border-accent/30 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c5cfc" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-text-primary font-semibold text-xl mb-2">Executing your intent</h2>
        {parsedIntent?.humanReadableSummary && (
          <p className="text-text-secondary text-sm max-w-xs">
            {parsedIntent.humanReadableSummary}
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="w-full flex flex-col gap-3 max-w-sm">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-border-subtle"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: step.delay + 0.2, type: 'spring' }}
              className="w-5 h-5 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </motion.div>
            <span className="text-text-secondary text-sm">{step.label}</span>
          </motion.div>
        ))}
      </div>

      <p className="text-muted text-xs">This usually takes a few seconds</p>
    </div>
  );
}
