// src/app/models/user.ts
export interface User {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer' | 'company';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}