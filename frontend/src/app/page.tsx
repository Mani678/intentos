'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { LoginButton } from '@/components/auth/LoginButton';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const INTENT_EXAMPLES = [
  { text: 'Pay David $20', result: 'Sending 20 USDC → David · Arbitrum', emoji: '💸' },
  { text: 'Split dinner with Alice and Bob', result: 'Splitting $60 USDC · 3 ways', emoji: '✂️' },
  { text: 'Donate $10 to UNICEF', result: 'Donating 10 USDC → UNICEF', emoji: '❤️' },
  { text: 'Transfer USDC to Base', result: 'Bridging USDC · Arbitrum → Base', emoji: '🔀' },
];

const COMMANDS = [
  { cmd: '/pay', desc: 'anyone, anywhere' },
  { cmd: '/split', desc: 'divide any bill' },
  { cmd: '/donate', desc: 'support causes' },
  { cmd: '/transfer', desc: 'cross-chain' },
  { cmd: '/swap', desc: 'any token' },
];

const FEATURES = [
  { icon: <Zap size={16} />, text: 'Gas always sponsored' },
  { icon: <Shield size={16} />, text: 'Non-custodial wallet' },
  { icon: <Globe size={16} />, text: '5+ chains supported' },
];

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeExample, setActiveExample] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const cycle = () => {
      setShowResult(false);
      setTimeout(() => setShowResult(true), 800);
      setTimeout(() => {
        setShowResult(false);
        setTimeout(() => {
          setActiveExample((prev) => (prev + 1) % INTENT_EXAMPLES.length);
          setShowResult(true);
        }, 500);
      }, 3000);
    };

    setShowResult(true);
    const interval = setInterval(cycle, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-accent/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-purple/5 rounded-full blur-[100px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border-subtle">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
            <span className="text-white text-sm font-bold font-display">I</span>
          </div>
          <span className="text-text-primary font-semibold text-lg tracking-tight">IntentOS</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Live on Arbitrum</span>
          </div>
          <LoginButton className="!min-w-0 !px-5 !py-2.5 !text-sm !rounded-xl" />
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-16 sm:pt-24 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Left */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8"
            >
              <span className="text-accent text-xs font-semibold tracking-wide uppercase">Intent Execution Engine</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6">
                <span className="text-text-primary">Send</span>
                <br />
                <span className="gradient-text-blue">money.</span>
                <br />
                <span className="text-text-primary">Just </span>
                <span className="gradient-text">say it.</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-text-secondary text-lg sm:text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              No wallets to set up. No gas to buy. No chains to think about.
              Just describe what you want — IntentOS handles everything.
            </motion.p>

            {/* Commands */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-10 justify-center lg:justify-start"
            >
              {COMMANDS.map((c, i) => (
                <motion.div
                  key={c.cmd}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle hover:border-accent/30 hover:bg-accent/5 transition-all cursor-default"
                >
                  <span className="text-accent text-sm font-semibold font-mono">{c.cmd}</span>
                  <span className="text-text-secondary text-xs">{c.desc}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start"
            >
              <LoginButton />
              <div className="flex flex-col gap-2">
                {FEATURES.map((f) => (
                  <div key={f.text} className="flex items-center gap-2 text-text-secondary text-sm">
                    <span className="text-accent">{f.icon}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Demo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex-1 max-w-[420px] w-full animate-float"
          >
            {/* Main card */}
            <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl shadow-black/60 glow-blue">
              {/* Header */}
              <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-elevated">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-text-secondary text-xs font-mono">intentos.app</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-text-secondary text-xs">live</span>
                </div>
              </div>

              {/* Chat */}
              <div className="p-5 space-y-3 min-h-[260px] flex flex-col justify-center">

                {/* User bubble */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`user-${activeExample}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex justify-end"
                  >
                    <div className="bg-accent text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-lg shadow-accent/20">
                      <p className="text-sm font-medium">"{INTENT_EXAMPLES[activeExample].text}"</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Thinking */}
                <AnimatePresence>
                  {!showResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-surface-elevated border border-border-subtle px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                        <span className="text-text-secondary text-xs">Parsing intent...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Result */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-start">
                        <div className="bg-surface-elevated border border-border-subtle px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                          <p className="text-text-secondary text-xs mb-1">IntentOS · Arbitrum</p>
                          <p className="text-text-primary text-sm font-medium">
                            {INTENT_EXAMPLES[activeExample].emoji} {INTENT_EXAMPLES[activeExample].result}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="text-green-400 text-xs">✓</span>
                          </div>
                          <span className="text-green-400 text-xs font-semibold">Executed on-chain</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted text-xs font-mono">0x84f2...52fe</span>
                          <ArrowRight size={10} className="text-muted" />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-elevated border border-border hover:border-accent/30 transition-colors">
                  <span className="text-muted text-sm flex-1">Try "Pay Alice $5"...</span>
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-md shadow-accent/30">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'Networks', value: '5+', color: 'text-accent' },
                { label: 'Gas fees', value: '$0', color: 'text-green-400' },
                { label: 'Setup', value: '0s', color: 'text-accent-purple' },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-3 py-3 rounded-xl bg-surface border border-border-subtle hover:border-border transition-colors">
                  <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-border-subtle px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-muted text-xs">© 2026 IntentOS — Built for Encode UXMaxx Hackathon</span>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {['Particle Universal Accounts', 'Magic Embedded Wallets', 'Arbitrum', 'EIP-7702'].map((t, i, arr) => (
            <span key={t} className="flex items-center gap-3">
              <span className="text-muted text-xs">{t}</span>
              {i < arr.length - 1 && <span className="text-border">·</span>}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}