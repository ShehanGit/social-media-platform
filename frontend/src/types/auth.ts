export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    token: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
    captchaToken?: string;
  }
  
  export interface RegisterRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    captchaToken?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }