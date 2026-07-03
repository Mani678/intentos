'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useIntentStore } from '@/store/intentStore';
import { truncateAddress } from '@/lib/utils';
import { Clock, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TopBar() {
  const { user, logout } = useAuth();
  const { screen, setScreen, reset } = useIntentStore();

  const handleLogoClick = () => {
    reset();
    setScreen('dashboard');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 border-b border-border-subtle"
    >
      {/* Logo */}
      <button onClick={handleLogoClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
          <span className="text-white text-xs font-bold">I</span>
        </div>
        <span className="text-text-primary font-semibold text-sm tracking-tight">IntentOS</span>
      </button>

      {/* Nav */}
      <div className="flex items-center gap-2">
        <NavButton
          active={screen === 'history'}
          onClick={() => setScreen('history')}
          icon={<Clock size={15} />}
          label="History"
        />

        {/* Wallet badge */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border-subtle">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-text-secondary text-xs font-mono">
              {truncateAddress(user.walletAddress)}
            </span>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all"
          title="Sign out"
        >
          <LogOut size={15} />
        </button>
      </div>
    </motion.header>
  );
}

function NavButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
        active
          ? 'bg-accent/10 text-accent border border-accent/20'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
