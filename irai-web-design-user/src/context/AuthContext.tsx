import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PlanId } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'patient';
  planId?: PlanId;
  onboarded: boolean;
  onboardingStep: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (patch: Partial<AuthUser>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'irai_web_user_auth';

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'User';
  return local.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const persist = (next: AuthUser | null) => {
    setUser(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, _password: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 700));
    const existing = user?.email === email ? user : null;
    persist(existing ?? {
      id: `u-${Date.now()}`,
      name: nameFromEmail(email),
      email,
      role: 'patient',
      onboarded: false,
      onboardingStep: 0,
    });
  };

  const signup = async (email: string, _password: string, name: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 700));
    persist({
      id: `u-${Date.now()}`,
      name: name.trim() || nameFromEmail(email),
      email,
      role: 'patient',
      onboarded: false,
      onboardingStep: 0,
    });
  };

  const updateUser = (patch: Partial<AuthUser>) => {
    if (!user) return;
    persist({ ...user, ...patch });
  };

  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

export function userHomePath(u: AuthUser): string {
  if (!u.onboarded) return u.planId ? '/onboarding' : '/pricing';
  return '/user';
}
