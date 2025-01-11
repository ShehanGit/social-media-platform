// src/utils/axios.ts
import axios, { AxiosInstance } from 'axios';
import { config } from 'process';

interface ImportMeta {
  env: {
    VITE_API_URL: string;
  };
}

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;