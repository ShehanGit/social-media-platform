import api from '../utils/axios';
import { Post } from '../types';

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}

interface CreatePostData {
  caption: string;
  media?: File;
}

export const postsAPI = {
  createPost: async (postData: CreatePostData): Promise<Post> => {
    const formData = new FormData();
    formData.append('caption', postData.caption);
    if (postData.media) {
      formData.append('media', postData.media);
    }
    const response = await api.post<Post>('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getPosts: async (
    page: number = 0, 
    size: number = 10, 
    sortBy: string = 'createdAt'
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>('/posts', {
      params: { page, size, sortBy }
    });
    return response.data;
  },

  getPostsByLikes: async (
    page: number = 0, 
    size: number = 10
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>('/posts/by-likes', {
      params: { page, size }
    });
    return response.data;
  },

  getPost: async (postId: number): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  getUserPosts: async (
    page: number = 0, 
    size: number = 10
  ): Promise<PaginatedResponse<Post>> => {
    const response = await api.get<PaginatedResponse<Post>>('/posts/user', {
      params: { page, size }
    });
    return response.data;
  },

  updatePost: async (postId: number, caption: string): Promise<Post> => {
    const response = await api.put<Post>(`/posts/${postId}`, { caption });
    return response.data;
  },

  deletePost: async (postId: number): Promise<void> => {
    await api.delete(`/posts/${postId}`);
  }
};