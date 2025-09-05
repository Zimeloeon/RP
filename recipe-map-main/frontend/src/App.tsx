/**
 * Main Application Component
 * 
 * This is the root component for the Nutrition Tracker application.
 * It handles:
 * - Authentication state and token persistence
 * - Theme configuration and Material-UI setup
 * - Routing for authenticated and unauthenticated users
 * - Global scrollbar styling
 */

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useAuthStore, useThemeStore } from './stores';
import { setLogoutFunction } from './services/api';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import NutritionPage from './pages/NutritionPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import TwoWeekIngredientsPage from './pages/TwoWeekIngredientsPage';

/**
 * App Component
 * 
 * Root component that sets up the application structure including:
 * - Authentication state management
 * - Theme provider configuration
 * - Route protection
 * - Auto-login from stored tokens
 */
function App() {
  // Get authentication state and functions from the auth store
  const { isAuthenticated, login, logout } = useAuthStore();
  // Get current theme configuration from the theme store
  const { colorScheme } = useThemeStore();

  /**
   * Effect hook to handle application initialization
   * - Sets up logout function for API service to use
   * - Attempts to restore authentication state from localStorage
   * - Handles token/user data parsing errors gracefully
   */
  useEffect(() => {
    // Set logout function for API service to use when token expires
    setLogoutFunction(logout);
    
    // Check for existing authentication data on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    // If we have stored credentials but aren't authenticated, restore the session
    if (storedToken && storedUser && !isAuthenticated) {
      try {
        const user = JSON.parse(storedUser);
        login(user, storedToken);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        // Clean up corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [isAuthenticated, login, logout]);

  /**
   * Create Material-UI theme based on user's color scheme preferences
   * Includes custom scrollbar styling for both light and dark modes
   */
  const theme = createTheme({
    palette: {
      mode: colorScheme.mode, // Light or dark mode
      primary: {
        main: colorScheme.primary, // Primary brand color
      },
      secondary: {
        main: colorScheme.secondary, // Secondary accent color
      },
    },
    components: {
      // Global CSS baseline overrides
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // Custom scrollbar styling for better UX
            scrollbarColor: "#6b6b6b #2b2b2b",
            // Webkit scrollbar styles (Chrome, Safari, Edge)
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: colorScheme.mode === 'dark' ? '#2b2b2b' : '#f1f1f1',
              width: 8,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: colorScheme.mode === 'dark' ? '#6b6b6b' : '#c1c1c1',
              minHeight: 24,
            },
            // Hover and active states for scrollbar thumb
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
              backgroundColor: colorScheme.mode === 'dark' ? '#959595' : '#a8a8a8',
            },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
              backgroundColor: colorScheme.mode === 'dark' ? '#959595' : '#a8a8a8',
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
              backgroundColor: colorScheme.mode === 'dark' ? '#959595' : '#a8a8a8',
            },
          },
        },
      },
    },
  });

  /**
   * Render unauthenticated app state
   * Shows only login page and redirects all other routes to login
   */
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Redirect all other routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ThemeProvider>
    );
  }

  /**
   * Render authenticated app state
   * Shows all protected routes wrapped in the main layout component
   */
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          {/* Main application routes - all require authentication */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/two-week-ingredients" element={<TwoWeekIngredientsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Fallback route redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
