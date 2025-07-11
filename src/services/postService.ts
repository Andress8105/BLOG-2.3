import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  // Get token from new storage format
  try {
    const authData = localStorage.getItem('authData');
    if (authData) {
      const { token } = JSON.parse(authData);
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error parsing auth data:', error);
    localStorage.removeItem('authData');
  }
  return config;
});

export const postService = {
  getAllPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUserPosts: async () => {
    const response = await api.get('/posts/user');
    return response.data;
  },

  getPost: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (formData: FormData) => {
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updatePost: async (id: string, data: any) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  downloadFile: async (postId: string, fileId: string) => {
    const response = await api.get(`/posts/${postId}/download/${fileId}`, {
      responseType: 'blob',
    });
    return response.data;
  }
};