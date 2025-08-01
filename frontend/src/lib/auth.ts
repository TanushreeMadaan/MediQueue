import type { User } from './types';

const AUTH_TOKEN_KEY = 'access_token'; 
const USER_KEY = 'user_data';

export const auth = {
  setToken: (token: string): void => {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  },

  getToken: (): string | null => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  setUser: (user: User): void => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },

  getUser: (): User | null => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const user = localStorage.getItem(USER_KEY);
      return !!(token && user);
    } catch (error) {
      console.error('Failed to check auth status:', error);
      return false;
    }
  },

  getCurrentUser: (): User | null => {
    if (!auth.isAuthenticated()) return null;
    return auth.getUser();
  },


  hasRole: (role: string): boolean => {
    const user = auth.getUser();
    return user?.role === role;
  },


  logout: (redirectTo: string = '/login'): void => {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      
      // Clear any other app-specific storage
      localStorage.removeItem('lastVisitedPage');
      
      window.location.href = redirectTo;
    } catch (error) {
      console.error('Failed to logout:', error);
      window.location.href = redirectTo;
    }
  },

  login: (token: string, user: User): void => {
    auth.setToken(token);
    auth.setUser(user);
  },

  hasValidToken: (): boolean => {
    const token = auth.getToken();
    if (!token) return false;
    
    try {
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  },
};
