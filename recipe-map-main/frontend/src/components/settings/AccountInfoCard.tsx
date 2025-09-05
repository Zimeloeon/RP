
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import { User } from '../../types';

/**
 * Props for the AccountInfoCard component
 */
interface AccountInfoCardProps {
  /** Current user data */
  user: User | null;
}

/**
 * AccountInfoCard Component
 * 
 * Displays read-only account information for the current user:
 * - Username (cannot be changed)
 * - Email address (cannot be changed)
 * 
 * Features:
 * - Read-only display with helper text explaining immutability
 * - Responsive grid layout
 * - Consistent styling with other settings cards
 * - Proper null safety for user data
 */
const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ user }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Account Information
        </Typography>
        
        <Grid container spacing={2}>
          {/* Username Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Username"
              value={user?.username || ''}
              disabled
              helperText="Username cannot be changed"
            />
          </Grid>
          
          {/* Email Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
              helperText="Email cannot be changed"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AccountInfoCard;
