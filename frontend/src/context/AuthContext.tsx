'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { magic } from '@/lib/magic';
import { api } from '@/lib/api';

interface User {
  email: string;
  walletAddress: string;
  magicDid: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      if (!magic) return;
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        await hydrateUser();
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const hydrateUser = async () => {
    if (!magic) return;
    const metadata = await magic.user.getInfo();
    

    const walletAddress =
      (metadata as any)?.wallets?.ethereum?.publicAddress ||
      (metadata as any)?.publicAddress ||
      '0x0000000000000000000000000000000000000000';

    const userData: User = {
      email: metadata.email!,
      magicDid: metadata.issuer!,
      walletAddress,
      displayName: metadata.email?.split('@')[0],
    };

    await api.post('/users/upsert', userData);
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = useCallback(async () => {
    if (!magic) return;
    await (magic as any).oauth2.loginWithRedirect({
      provider: 'google',
      redirectURI: `${window.location.origin}/auth/callback`,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      if (magic) await magic.user.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      loginWithGoogle,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};