import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Test backend connection first
        await authService.testConnection();
        console.log('Backend connection successful');

        const token = localStorage.getItem('token');
        if (token) {
          console.log('Token found, getting profile...');
          const userData = await authService.getProfile();
          setUser(userData);
          console.log('User profile loaded:', userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process');
      const response = await authService.login(email, password);
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        console.log('AuthContext: Login successful', response.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('AuthContext: Login failed', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      console.log('AuthContext: Starting registration process');
      const response = await authService.register(username, email, password);
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        console.log('AuthContext: Registration successful', response.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('AuthContext: Registration failed', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};