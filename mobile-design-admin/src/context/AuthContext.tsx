import React, { createContext, useContext, useState } from 'react';

export type Role = 'admin' | 'practitioner';

export interface AuthUser {
  name:  string;
  email: string;
  role:  Role;
}

interface AuthContextValue {
  user:            AuthUser | null;
  isAuthenticated: boolean;
  login:  (role: Role, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'irai_auth';

function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'User';
  return local.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (role: Role, email: string, _password: string): Promise<void> => {
    await new Promise(r => setTimeout(r, 900));
    const authUser: AuthUser = { name: nameFromEmail(email), email, role };
    setUser(authUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
