import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getMeApi, loginApi, registerApi } from '../api/authApi';
import type { User } from '../types';
import { getErrorMessage } from '../api/http';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? (JSON.parse(saved) as User) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const syncStorage = (nextUser: User | null, nextToken: string | null) => {
    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('user');
    }

    if (nextToken) {
      localStorage.setItem('token', nextToken);
    } else {
      localStorage.removeItem('token');
    }
  };

  const refreshUser = async () => {
    if (!localStorage.getItem('token')) return;

    try {
      const data = await getMeApi();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch {
      setUser(null);
      setToken(null);
      syncStorage(null, null);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      await refreshUser();
      setLoading(false);
    };

    bootstrap();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginApi({ email, password });
    setUser(data.user);
    setToken(data.token);
    syncStorage(data.user, data.token);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerApi({ name, email, password });
    setUser(data.user);
    setToken(data.token);
    syncStorage(data.user, data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    syncStorage(null, null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login: async (email: string, password: string) => {
        try {
          await login(email, password);
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
      register: async (name: string, email: string, password: string) => {
        try {
          await register(name, email, password);
        } catch (error) {
          throw new Error(getErrorMessage(error));
        }
      },
      logout,
      refreshUser,
      setUser,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
