/**
 * Global State Management Stores
 * 
 * This file contains all Zustand stores for managing global application state:
 * - Authentication state (user, token, login/logout)
 * - Theme configuration (colors, mode, gradients)
 * - Application state (selected date, loading)
 * 
 * All stores use Zustand with persistence middleware to maintain state
 * across browser sessions.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, ColorScheme } from '../types';

/**
 * Authentication Store Interface
 * Manages user authentication state and operations
 */
interface AuthState {
  user: User | null;                                    // Currently authenticated user
  token: string | null;                                 // JWT authentication token
  isAuthenticated: boolean;                             // Authentication status flag
  login: (user: User, token: string) => void;           // Login action
  logout: () => void;                                   // Logout action
  updateUser: (userData: Partial<User>) => void;        // Update user profile
}

/**
 * Authentication Store
 * 
 * Manages user authentication state with automatic persistence.
 * Handles login/logout operations and token management.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      /**
       * Login function
       * Sets user data, token, and authentication status
       * Also stores token in localStorage for API requests
       */
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      
      /**
       * Logout function
       * Clears all authentication data from state and localStorage
       */
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      /**
       * Update user profile
       * Merges new user data with existing user object
       */
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      // Only persist essential auth data
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

/**
 * Theme Store Interface
 * Manages application theme and color scheme
 */
interface ThemeState {
  colorScheme: ColorScheme;                             // Complete color scheme configuration
  setColorScheme: (scheme: Partial<ColorScheme>) => void; // Update color scheme
}

/**
 * Theme Store
 * 
 * Manages application theme configuration including:
 * - Light/dark mode
 * - Primary/secondary colors
 * - Gradient configurations for various UI elements
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: {
        mode: 'light',                                  // Default to light mode
        primary: '#1976d2',                             // Material-UI default blue
        secondary: '#dc004e',                           // Material-UI default pink
        gradients: {
          header: {
            from: '#4f63d2',
            to: '#5a67d8',
          },
          sidebar: {
            from: '#4f63d2',
            to: '#5a67d8',
          },
          sidebarHeader: {
            from: '#667eea',
            to: '#5a67d8',
          },
        },
      },
      
      /**
       * Update color scheme
       * Merges new scheme properties with existing configuration
       */
      setColorScheme: (scheme) =>
        set((state) => ({
          colorScheme: { ...state.colorScheme, ...scheme },
        })),
    }),
    {
      name: 'theme-storage',
    }
  )
);

/**
 * Application Store Interface
 * Manages general application state
 */
interface AppState {
  selectedDate: string;                                 // Currently selected date for entries
  setSelectedDate: (date: string) => void;             // Update selected date
  isLoading: boolean;                                   // Global loading state
  setLoading: (loading: boolean) => void;               // Update loading state
}

/**
 * Application Store
 * 
 * Manages general application state that doesn't require persistence.
 * Includes date selection and loading states.
 */
export const useAppStore = create<AppState>((set) => ({
  selectedDate: new Date().toISOString().split('T')[0], // Default to today
  setSelectedDate: (date) => set({ selectedDate: date }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

// Export grocery store from separate file
export { useGroceryStore } from './groceryStore';
