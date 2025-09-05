/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls including:
 * - User login with credentials
 * - User registration
 * - Logout cleanup
 * 
 * All methods use the configured API instance for consistent
 * error handling and token management.
 */

import { api } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../types';

export const authService = {
  /**
   * User Login
   * Authenticates user with username/password and returns user data + JWT token
   * 
   * @param credentials - Username and password
   * @returns Promise with user data and authentication token
   * @throws API error if login fails
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  },

  /**
   * User Registration
   * Creates new user account with provided data
   * 
   * @param userData - Complete user registration data including profile info
   * @returns Promise with user data and authentication token
   * @throws API error if registration fails (e.g., username/email already exists)
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  },

  /**
   * User Logout
   * Cleans up local authentication data
   * Note: Server-side token invalidation would happen via API interceptor
   */
  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
