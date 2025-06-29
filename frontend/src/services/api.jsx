import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? '/api/v1'
    : 'http://localhost:3000/api/v1');

const finalApiUrl = API_BASE_URL.startsWith('/')
  ? 'https://www.oortega14.com/api/v1'
  : API_BASE_URL;

const api = axios.create({
  baseURL: finalApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

// Temporal para verificar - updated
console.log('Environment:', {
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL,
  FINAL_API_URL: finalApiUrl
});

export default api;