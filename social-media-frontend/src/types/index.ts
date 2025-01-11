export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    bio: string | null;
    profilePictureUrl: string | null;
    website: string | null;
    phone: string | null;
    location: string | null;
  }
  
  export interface Post {
    id: number;
    user: {
      id: number;
      username: string;
      profilePictureUrl: string | null;
      firstname: string;
      lastname: string;
      email: string;
    };
    caption: string;
    mediaUrl: string | null;
    mediaType?: 'IMAGE' | 'VIDEO';
    createdAt: string;
    updatedAt: string;
    likes: Like[];
    comments: Comment[];
  }
  
  export interface Comment {
    id: number;
    content: string;
    userEmail: string;
    userName: string;
    createdAt: string;
    updatedAt: string;
    isAuthor: boolean;
  }
  
  export interface Like {
    id: number;
    user: User;
    post: Post;
    createdAt: string;
  }
  
  export interface RelationshipStats {
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
  }
  
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
  
  export interface AuthResponse {
    token: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }
  
  export interface UserUpdateData {
    username?: string;
    firstname?: string;
    lastname?: string;
    bio?: string;
    website?: string;
    phone?: string;
    location?: string;
  }