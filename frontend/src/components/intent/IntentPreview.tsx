'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, Zap } from 'lucide-react';
import { useIntentStore } from '@/store/intentStore';
import { useAuth } from '@/context/AuthContext';
import { useParticle } from '@/hooks/useParticle';
import { api } from '@/lib/api';
import { cn, formatAmount, CHAIN_NAMES, INTENT_ICONS } from '@/lib/utils';
import { toast } from 'sonner';

export function IntentPreview() {
  const {
    parsedIntent,
    isExecuting,
    setIsExecuting,
    setScreen,
    setTxHash,
    setTxId,
    setError,
    txId,
  } = useIntentStore();
  const { user } = useAuth();
  
  const { executeTransaction } = useParticle(user?.walletAddress || '');

  if (!parsedIntent) return null;

  const handleConfirm = async () => {
    if (!user || isExecuting) return;
    setIsExecuting(true);
    setScreen('confirming');

    let savedTxId = '';

    try {
      // 1. Save pending transaction to DB
      const { data: txData } = await api.post('/transactions', {
        userId: user.magicDid,
        walletAddress: user.walletAddress,
        parsedIntent,
        status: 'pending',
        chain: parsedIntent.sourceChain || 'arbitrum',
        amountUSD: parsedIntent.amount || 0,
      });
      savedTxId = txData.data._id;
      setTxId(savedTxId);

      // 2. Execute via Particle Universal Accounts
      const hash = await executeTransaction(parsedIntent);
      setTxHash(hash);

      // 3. Update DB to success
      await api.patch(`/transactions/${savedTxId}`, {
        status: 'success',
        txHash: hash,
      });

      setScreen('success');
    } catch (err: any) {
      const msg = err.message || 'Transaction failed';
      setError(msg);
      toast.error(msg);

      if (savedTxId) {
        await api.patch(`/transactions/${savedTxId}`, {
          status: 'failed',
          errorMessage: msg,
        }).catch(() => {});
      }

      setScreen('failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleBack = () => setScreen('dashboard');

  const icon = INTENT_ICONS[parsedIntent.intent] || '💫';
  const chainLabel = CHAIN_NAMES[parsedIntent.sourceChain || 'arbitrum'];
  const destChainLabel = parsedIntent.destinationChain
    ? CHAIN_NAMES[parsedIntent.destinationChain]
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-0.5">Review</p>
          <h2 className="text-text-primary font-semibold">Confirm your intent</h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-border-subtle bg-accent/5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-text-primary font-medium">{parsedIntent.humanReadableSummary}</p>
              <p className="text-text-secondary text-xs mt-0.5 italic">"{parsedIntent.rawInput}"</p>
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {parsedIntent.amount && (
            <DetailRow
              label="Amount"
              value={formatAmount(parsedIntent.amount, parsedIntent.currency || 'USDC')}
              highlight
            />
          )}
          {parsedIntent.recipient && (
            <DetailRow label="To" value={parsedIntent.recipient} />
          )}
          {parsedIntent.recipientAddress && (
            <DetailRow
              label="Address"
              value={`${parsedIntent.recipientAddress.slice(0, 8)}...${parsedIntent.recipientAddress.slice(-6)}`}
              mono
            />
          )}
          {parsedIntent.splitParticipants && parsedIntent.splitParticipants.length > 0 && (
            <DetailRow label="Split with" value={parsedIntent.splitParticipants.join(', ')} />
          )}
          <DetailRow label="Network" value={chainLabel || 'Arbitrum'} />
          {destChainLabel && (
            <DetailRow
              label="Destination"
              value={
                <span className="flex items-center gap-1.5">
                  {chainLabel} <ArrowRight size={12} className="text-muted" /> {destChainLabel}
                </span>
              }
            />
          )}
          {parsedIntent.memo && <DetailRow label="Note" value={parsedIntent.memo} />}
        </div>

        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/5 border border-green-500/10">
            <Zap size={13} className="text-green-400" />
            <span className="text-green-400 text-xs font-medium">
              Gas fees sponsored — you pay nothing extra
            </span>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full bg-surface-elevated overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all"
            style={{ width: `${(parsedIntent.confidence || 0) * 100}%` }}
          />
        </div>
        <span className="text-muted text-xs">
          {Math.round((parsedIntent.confidence || 0) * 100)}% confidence
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleBack}
          className={cn(
            'flex-1 py-3.5 rounded-xl font-medium text-sm transition-all',
            'bg-surface border border-border text-text-secondary',
            'hover:text-text-primary hover:border-border'
          )}
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleConfirm}
          disabled={isExecuting}
          className={cn(
            'flex-[2] py-3.5 rounded-xl font-semibold text-sm transition-all',
            'bg-accent text-white shadow-lg shadow-accent/25',
            'hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          Confirm & Execute
        </motion.button>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary text-sm">{label}</span>
      <span className={cn(
        'text-sm font-medium',
        highlight ? 'text-text-primary text-base' : 'text-text-primary',
        mono && 'font-mono text-xs'
      )}>
        {value}
      </span>
    </div>
  );
}