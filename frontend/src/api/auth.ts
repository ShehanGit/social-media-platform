// src/api/auth.ts
import api from '../utils/axios';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const authAPI = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/user_register', userData);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/authenticate', credentials);
    return response.data;
  },

  verifyToken: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};