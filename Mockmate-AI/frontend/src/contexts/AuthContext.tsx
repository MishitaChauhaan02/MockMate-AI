import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mockmate_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mockmate_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('mockmate_token');
      if (savedToken) {
        try {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('mockmate_user', JSON.stringify(currentUser));
        } catch (error) {
          console.error('Session expired or invalid:', error);
          localStorage.removeItem('mockmate_token');
          localStorage.removeItem('mockmate_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem('mockmate_token', res.access_token);
    localStorage.setItem('mockmate_user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (fullName: string, email: string, password: string) => {
    const res = await authApi.register(fullName, email, password);
    localStorage.setItem('mockmate_token', res.access_token);
    localStorage.setItem('mockmate_user', JSON.stringify(res.user));
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem('mockmate_token');
    localStorage.removeItem('mockmate_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('mockmate_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error('Failed to refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
