'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { useIntentStore } from '@/store/intentStore';

export function FailedScreen() {
  const { error, reset, setScreen, currentInput, setCurrentInput } = useIntentStore();

  const handleRetry = () => {
    const input = currentInput;
    reset();
    setCurrentInput(input);
    setScreen('dashboard');
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center"
      >
        <AlertTriangle size={32} className="text-red-400" />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-text-primary font-semibold text-xl mb-2">Something went wrong</h2>
        <p className="text-text-secondary text-sm max-w-xs">
          {error || 'The transaction could not be completed. Please try again.'}
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full flex flex-col gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleRetry}
          className="w-full py-3.5 rounded-xl bg-accent text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover transition-all"
        >
          <RotateCcw size={15} />
          Try Again
        </motion.button>
        <button
          onClick={() => { reset(); setScreen('dashboard'); }}
          className="w-full py-3 rounded-xl text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          Start over
        </button>
      </motion.div>
    </div>
  );
}
