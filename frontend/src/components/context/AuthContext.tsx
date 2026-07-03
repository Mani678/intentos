'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth2';
import { api } from '@/lib/api';

interface User {
  email: string;
  walletAddress: string;
  magicDid: string;
  displayName?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  magic: Magic | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

let magicInstance: any = null;

const getMagic = (): any => {
  if (!magicInstance && typeof window !== 'undefined') {
    magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!, {
      extensions: [new OAuthExtension()],
    });
  }
  return magicInstance!;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [magic, setMagic] = useState<Magic | null>(null);

  useEffect(() => {
    const m = getMagic();
    setMagic(m);
    checkSession(m);
  }, []);

  const checkSession = async (m: Magic) => {
    try {
      const isLoggedIn = await m.user.isLoggedIn();
      if (isLoggedIn) {
        await hydrateUser(m);
      }
    } catch (err) {
      console.error('Session check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const hydrateUser = async (m: Magic) => {
    const metadata = await m.user.getInfo();
    const accounts = await (m.wallet as any).getAccounts();
    const walletAddress = accounts[0];

    const userData: User = {
      email: metadata.email!,
      magicDid: metadata.issuer!,
      walletAddress,
      displayName: metadata.email?.split('@')[0],
    };

    // Persist to our backend
    await api.post('/users/upsert', userData);

    setUser(userData);
    return userData;
  };

  const loginWithGoogle = useCallback(async () => {
    const m = getMagic();
    try {
      await (m.oauth2 as any).loginWithRedirect({
        provider: 'google',
        redirectURI: `${window.location.origin}/auth/callback`,
      });
    } catch (err) {
      console.error('Google login failed:', err);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    const m = getMagic();
    try {
      await m.user.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        magic,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
