'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useIntentStore } from '@/store/intentStore';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SUGGESTIONS = [
  'Pay David $20',
  'Split $60 dinner with Alice and Bob',
  'Donate $10 to UNICEF',
  'Transfer USDC to Base',
];

export function IntentInput() {
  const { user } = useAuth();
  const {
    setScreen,
    setParsedIntent,
    setCurrentInput,
    currentInput,
  } = useIntentStore();

  const [input, setInput] = useState(currentInput || '');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [input]);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || !user) return;

    setCurrentInput(trimmed);
    setScreen('parsing');

    try {
      const { data } = await api.post('/intent/parse', { input: trimmed });
      const parsed = data.data;

      if (parsed.intent === 'unknown' || parsed.confidence < 0.3) {
        toast.error("I couldn't understand that. Try rephrasing.");
        setScreen('dashboard');
        return;
      }

      setParsedIntent(parsed);
      setScreen('preview');
    } catch (err: any) {
      toast.error(err.message || 'Failed to parse intent');
      setScreen('dashboard');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestion = (s: string) => {
    setInput(s);
    textareaRef.current?.focus();
  };

  const firstName = user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting */}
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-text-primary mb-1"
        >
          Hi, {firstName} 👋
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-text-secondary text-sm"
        >
          What do you want to do?
        </motion.p>
      </div>

      {/* Input box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          'relative rounded-2xl border transition-all duration-200',
          'bg-surface',
          isFocused
            ? 'border-accent/50 shadow-[0_0_0_3px_rgba(124,92,252,0.12)]'
            : 'border-border hover:border-border-subtle'
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder='Try "Pay Alice $25" or "Donate $5 to UNICEF"'
          rows={1}
          className={cn(
            'w-full bg-transparent text-text-primary placeholder:text-muted',
            'resize-none outline-none text-base leading-relaxed',
            'px-5 pt-4 pb-14',
            'min-h-[60px]'
          )}
        />

        {/* Bottom row */}
        <div className="absolute bottom-3 left-4 right-3 flex items-center justify-between">
          <span className="text-muted text-xs">
            {input.length > 0 ? `${input.length} chars` : 'Enter to send'}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={!input.trim()}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200',
              input.trim()
                ? 'bg-accent text-white shadow-lg shadow-accent/30 hover:bg-accent-hover'
                : 'bg-surface-elevated text-muted cursor-not-allowed'
            )}
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-2"
      >
        <p className="text-muted text-xs text-center mb-1">Try one of these</p>
        <div className="grid grid-cols-2 gap-2">
          {SUGGESTIONS.map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSuggestion(s)}
              className={cn(
                'text-left px-4 py-3 rounded-xl text-sm',
                'bg-surface border border-border-subtle',
                'text-text-secondary hover:text-text-primary hover:border-border',
                'transition-all duration-150'
              )}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
