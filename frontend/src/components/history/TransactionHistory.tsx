'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIntentStore } from '@/store/intentStore';
import { api } from '@/lib/api';
import { formatDate, formatAmount, INTENT_ICONS, CHAIN_NAMES } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TxRecord {
  _id: string;
  parsedIntent: {
    intent: string;
    recipient?: string;
    amount?: number;
    currency?: string;
    sourceChain?: string;
    humanReadableSummary?: string;
    rawInput: string;
  };
  status: 'pending' | 'confirming' | 'success' | 'failed';
  txHash?: string;
  chain: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  success: 'text-green-400 bg-green-500/10 border-green-500/20',
  failed: 'text-red-400 bg-red-500/10 border-red-500/20',
  pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  confirming: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export function TransactionHistory() {
  const { user } = useAuth();
  const { setScreen } = useIntentStore();
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.walletAddress) return;
      try {
        const { data } = await api.get(`/transactions/user/${user.walletAddress}`);
        setTxs(data.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-0.5">Activity</p>
          <h2 className="text-text-primary font-semibold">Transaction History</h2>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl shimmer" />
          ))}
        </div>
      ) : txs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <p className="text-4xl mb-4">🌑</p>
          <p className="text-text-secondary text-sm">No transactions yet.</p>
          <button
            onClick={() => setScreen('dashboard')}
            className="mt-4 text-accent text-sm hover:underline"
          >
            Make your first intent →
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2">
          {txs.map((tx, i) => (
            <motion.div
              key={tx._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-surface border border-border-subtle rounded-2xl p-4 flex items-center gap-4"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center flex-shrink-0 text-lg">
                {INTENT_ICONS[tx.parsedIntent.intent] || '💫'}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm font-medium truncate">
                  {tx.parsedIntent.humanReadableSummary || tx.parsedIntent.rawInput}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-muted text-xs">{formatDate(tx.createdAt)}</span>
                  <span className="text-border text-xs">·</span>
                  <span className="text-muted text-xs">{CHAIN_NAMES[tx.chain] || tx.chain}</span>
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {tx.parsedIntent.amount && (
                  <span className="text-text-primary text-sm font-semibold">
                    {formatAmount(tx.parsedIntent.amount, tx.parsedIntent.currency || 'USDC')}
                  </span>
                )}
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full border font-medium',
                      STATUS_STYLES[tx.status]
                    )}
                  >
                    {tx.status}
                  </span>
                  {tx.txHash && (
                    <a
                      href={`https://arbiscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-text-secondary transition-colors"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
