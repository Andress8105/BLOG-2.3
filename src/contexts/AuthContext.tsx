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

// Session duration: 30 minutes
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const isTokenExpired = (timestamp: number) => {
  return Date.now() - timestamp > SESSION_DURATION;
};

const setTokenWithTimestamp = (token: string) => {
  const tokenData = {
    token,
    timestamp: Date.now()
  };
  localStorage.setItem('authData', JSON.stringify(tokenData));
};

const getValidToken = () => {
  try {
    const authData = localStorage.getItem('authData');
    if (!authData) return null;
    
    const { token, timestamp } = JSON.parse(authData);
    
    if (isTokenExpired(timestamp)) {
      localStorage.removeItem('authData');
      return null;
    }
    
    return token;
  } catch (error) {
    localStorage.removeItem('authData');
    return null;
  }
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

        const token = getValidToken();
        if (token) {
          console.log('Token found, getting profile...');
          // Update localStorage with current token format
          setTokenWithTimestamp(token);
          const userData = await authService.getProfile();
          setUser(userData);
          console.log('User profile loaded:', userData);
        } else {
          console.log('No valid token found or token expired');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('authData');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Check token expiration every minute
    const interval = setInterval(() => {
      const token = getValidToken();
      if (!token && user) {
        console.log('Token expired, logging out user');
        setUser(null);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting login process');
      const response = await authService.login(email, password);
      
      if (response.token && response.user) {
        setTokenWithTimestamp(response.token);
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
        setTokenWithTimestamp(response.token);
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
    localStorage.removeItem('authData');
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