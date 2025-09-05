/**
 * API Service Configuration
 * 
 * This file sets up the main HTTP client for communicating with the backend API.
 * Features:
 * - Automatic token injection for authenticated requests
 * - Global error handling for authentication failures
 * - Session management and automatic logout on token expiry
 * - Toast notifications for user feedback
 */

import axios from 'axios';
import { toast } from 'react-toastify';

// Get API base URL from environment or use development default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Main API instance with base configuration
 * All API requests should use this instance for consistency
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Store reference to logout function to avoid circular imports
 * This allows the API service to trigger logout without importing auth store directly
 */
let logoutFunction: (() => void) | null = null;

/**
 * Set logout function for use in response interceptor
 * Called from App.tsx during initialization
 */
export const setLogoutFunction = (logout: () => void) => {
  logoutFunction = logout;
};

/**
 * Request Interceptor
 * Automatically adds JWT token to all requests if available
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles authentication errors globally and manages session expiry
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors (401 Unauthorized, 403 Forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Check if error message indicates invalid/expired token
      const errorMessage = error.response?.data?.error?.toLowerCase() || '';
      if (errorMessage.includes('invalid') || errorMessage.includes('expired') || errorMessage.includes('token')) {
        // Show notification to user about session expiry
        toast.error('Your session has expired. Please log in again.');
        
        // Clear stored authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Attempt to use logout function if available (preferred method)
        if (logoutFunction) {
          logoutFunction();
        } else {
          // Fallback to hard redirect if logout function not set
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
