import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url, 'with data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error: any) {
      console.error('Login service error:', error);
      throw error;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      console.log('Attempting registration with:', { username, email });
      const response = await api.post('/auth/register', { username, email, password });
      return response.data;
    } catch (error: any) {
      console.error('Registration service error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      console.error('Get profile service error:', error);
      throw error;
    }
  },

  testConnection: async () => {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error: any) {
      console.error('Test connection error:', error);
      throw error;
    }
  }
};