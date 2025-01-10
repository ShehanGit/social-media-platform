import axios from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/api/v1/auth/authenticate`, data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/api/v1/auth/user_register`, data);
    return response.data;
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
};