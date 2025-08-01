// src/hooks/useAuth.ts

'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useMemo } from 'react';
import { authApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { User, LoginCredentials } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; 

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // check for user data in localStorage
  useEffect(() => {
    const userData = auth.getUser();
    if (userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      // Save token and user data to localStorage
      auth.login(response.access_token, response.user);
      
      // Update the React state
      setUser(response.user);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    // Clear state and then redirect
    setUser(null);
    auth.logout();
  };

  // Memoize context value to prevent re-renders of consuming components
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user, 
    login,
    logout,
  }), [user, loading]);

  // show loading while checking auth
  if (loading) {
    return <LoadingSpinner fullscreen/>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
