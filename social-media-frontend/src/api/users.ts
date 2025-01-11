// src/api/users.ts
import api from '../utils/axios';
import { User, RelationshipStats, PaginatedResponse, UserUpdateData } from '../types';

interface UserSummary {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isFollowing: boolean;
  profilePictureUrl?: string;
}

interface RelationshipStatus {
  status: string;
  isMuted: boolean;
  isBlocked: boolean;
  isClose: boolean;
  notificationPreference: string;
  following: boolean;
  isFollowedBack: boolean;
}

export const usersAPI = {
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  getUserById: async (userId: number): Promise<User> => {
    const response = await api.get<User>(`/users/${userId}`);
    return response.data;
  },

  getUserByUsername: async (username: string): Promise<User> => {
    const response = await api.get<User>(`/users/username/${username}`);
    return response.data;
  },

  updateUser: async (updateData: UserUpdateData): Promise<User> => {
    const response = await api.put<User>('/users/me', updateData);
    return response.data;
  },

  searchUsers: async (
    query: string, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get<PaginatedResponse<User>>('/users/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  getUserStats: async (userId: number): Promise<{ [key: string]: number }> => {
    const response = await api.get<{ [key: string]: number }>(`/users/${userId}/stats`);
    return response.data;
  },

  updateProfilePicture: async (file: File): Promise<{ pictureUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ pictureUrl: string }>('/users/me/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  toggleFollow: async (userId: number): Promise<RelationshipStats> => {
    const response = await api.post<RelationshipStats>(`/users/${userId}/follow`);
    return response.data;
  },

  getRelationshipStats: async (userId: number): Promise<RelationshipStats> => {
    const response = await api.get<RelationshipStats>(`/users/${userId}/relationships`);
    return response.data;
  },

  getFollowers: async (
    userId: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<UserSummary>> => {
    const response = await api.get<PaginatedResponse<UserSummary>>(`/users/${userId}/followers`, {
      params: { page, size }
    });
    return response.data;
  },

  getFollowing: async (
    userId: number, 
    page: number = 0, 
    size: number = 20
  ): Promise<PaginatedResponse<UserSummary>> => {
    const response = await api.get<PaginatedResponse<UserSummary>>(`/users/${userId}/following`, {
      params: { page, size }
    });
    return response.data;
  },

  getRelationshipStatus: async (userId: number): Promise<RelationshipStatus> => {
    const response = await api.get<RelationshipStatus>(`/users/${userId}/relationship-status`);
    return response.data;
  },

  toggleBlock: async (userId: number): Promise<{ status: string; message: string }> => {
    const response = await api.post<{ status: string; message: string }>(`/users/${userId}/block`);
    return response.data;
  },

  toggleMute: async (userId: number): Promise<{ status: string; message: string }> => {
    const response = await api.post<{ status: string; message: string }>(`/users/${userId}/mute`);
    return response.data;
  },

  toggleCloseFriend: async (userId: number): Promise<{ status: string; message: string }> => {
    const response = await api.post<{ status: string; message: string }>(`/users/${userId}/close-friends`);
    return response.data;
  },

  deleteAccount: async (): Promise<void> => {
    await api.delete('/users/me');
  }
};