
/**
 * Settings Page Component
 * 
 * Comprehensive user settings and customization interface.
 * Features:
 * - Profile information management (weight, height, age, activity level, goals)
 * - Theme and appearance customization (dark mode, gradients, colors)
 * - Account information display (username, email, registration date)
 * - Real-time BMI calculation and health categorization
 * - Advanced theme customization with predefined and custom options
 * 
 * Architecture:
 * - Modular component design with dedicated setting cards
 * - Responsive grid layout for optimal viewing on all devices
 * - Integration with Zustand stores for persistent state management
 * - Real-time updates and instant visual feedback
 * 
 * @component
 */

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useAuthStore } from '../stores';
import ProfileSettingsCard from '../components/settings/ProfileSettingsCard';
import ThemeSettingsCard from '../components/settings/ThemeSettingsCard';
import AccountInfoCard from '../components/settings/AccountInfoCard';

/**
 * SettingsPage Component
 * 
 * Provides a comprehensive settings interface for user customization:
 * - Profile information management (weight, height, age, activity level, goals)
 * - Theme and appearance customization (dark mode, gradients, colors)
 * - Account information display (username, email)
 * 
 * Features:
 * - Modular component architecture for maintainability
 * - Real-time BMI calculation and health categorization
 * - Advanced theme customization with predefined and custom options
 * - Responsive grid layout for optimal viewing on all devices
 * - Integration with Zustand stores for state management
 */
const SettingsPage: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const { user, updateUser } = useAuthStore();

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Box>
      {/* Page Header */}
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Settings Section */}
        <Grid item xs={12} md={6}>
          <ProfileSettingsCard user={user} onUserUpdate={updateUser} />
        </Grid>

        {/* Theme Settings Section */}
        <Grid item xs={12} md={6}>
          <ThemeSettingsCard />
        </Grid>

        {/* Account Information Section */}
        <Grid item xs={12}>
          <AccountInfoCard user={user} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
