import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export type UserRole = 'APPLICANT' | 'OFFICER' | 'ADMIN';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at?: string;
  is_active?: boolean;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthenticatedUser>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<AuthenticatedUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [token, setToken] = useState<string | null>(() => api.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = api.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.getProfile();
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          role: profile.role as UserRole,
          created_at: profile.created_at,
          is_active: profile.is_active,
        });
        setToken(storedToken);
      } catch (err: any) {
        const isAuthError = err?.message && (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('credentials'));
        if (isAuthError) {
          console.warn('Session expired or invalid token:', err);
          api.logout();
          setUser(null);
          setToken(null);
        } else {
          console.warn('Backend server connection pending or unreachable:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await api.login(credentials);
      const authUser: AuthenticatedUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        role: response.user.role as UserRole,
        created_at: response.user.created_at,
        is_active: response.user.is_active,
      };
      setUser(authUser);
      setToken(response.access_token);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await api.register(data);
      const authUser: AuthenticatedUser = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        role: response.user.role as UserRole,
        created_at: response.user.created_at,
        is_active: response.user.is_active,
      };
      setUser(authUser);
      setToken(response.access_token);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setToken(null);
    localStorage.removeItem('tsfms_auth_token');
  };

  const refreshUser = async () => {
    if (!api.getToken()) return;
    try {
      const profile = await api.getProfile();
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role as UserRole,
        created_at: profile.created_at,
        is_active: profile.is_active,
      });
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
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
