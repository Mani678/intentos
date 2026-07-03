'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Plus } from 'lucide-react';
import { useIntentStore } from '@/store/intentStore';
import { formatAmount, CHAIN_NAMES, INTENT_ICONS } from '@/lib/utils';

export function SuccessScreen() {
  const { parsedIntent, txHash, reset, setScreen } = useIntentStore();

  const handleNewIntent = () => {
    reset();
    setScreen('dashboard');
  };

  const handleViewHistory = () => {
    reset();
    setScreen('history');
  };

  const explorerUrl = txHash
    ? txHash.length > 20
      ? `https://arbiscan.io/tx/${txHash}`
      : `https://universalx.app/activity/details?id=${txHash}`
    : null;

  const icon = parsedIntent ? INTENT_ICONS[parsedIntent.intent] || '✅' : '✅';

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Success animation */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="text-4xl"
          >
            {icon}
          </motion.span>
        </motion.div>

        {/* Sparkles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((i * 60 * Math.PI) / 180) * 60,
              y: Math.sin((i * 60 * Math.PI) / 180) * 60,
              opacity: [0, 1, 0],
            }}
            transition={{ delay: 0.3 + i * 0.05, duration: 0.8 }}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-accent"
          />
        ))}
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-text-primary font-semibold text-2xl mb-2">Done! ✨</h2>
        {parsedIntent?.humanReadableSummary && (
          <p className="text-text-secondary text-sm">{parsedIntent.humanReadableSummary}</p>
        )}
      </motion.div>

      {/* Receipt card */}
      {parsedIntent && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full bg-surface border border-border rounded-2xl p-5 flex flex-col gap-3"
        >
          {parsedIntent.amount && (
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">Amount</span>
              <span className="text-text-primary font-semibold">
                {formatAmount(parsedIntent.amount, parsedIntent.currency || 'USDC')}
              </span>
            </div>
          )}
          {parsedIntent.recipient && (
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">To</span>
              <span className="text-text-primary text-sm">{parsedIntent.recipient}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Network</span>
            <span className="text-text-primary text-sm">
              {CHAIN_NAMES[parsedIntent.sourceChain || 'arbitrum']}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary text-sm">Gas paid</span>
            <span className="text-green-400 text-sm font-medium">Sponsored ✓</span>
          </div>
          {txHash && (
            <div className="pt-2 border-t border-border-subtle">
              <a
                href={explorerUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-accent text-xs hover:underline"
              >
                <span className="font-mono">
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </span>
                <ExternalLink size={11} />
              </a>
            </div>
          )}
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full flex flex-col gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleNewIntent}
          className="w-full py-3.5 rounded-xl bg-accent text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-accent-hover transition-all shadow-lg shadow-accent/25"
        >
          <Plus size={16} />
          New Intent
        </motion.button>
        <button
          onClick={handleViewHistory}
          className="w-full py-3 rounded-xl text-text-secondary text-sm hover:text-text-primary transition-colors"
        >
          View history
        </button>
      </motion.div>
    </div>
  );
}
