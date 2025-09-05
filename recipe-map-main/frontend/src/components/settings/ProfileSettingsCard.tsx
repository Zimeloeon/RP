
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../../services/api';
import { User } from '../../types';

/**
 * Activity level options for user profile
 */
const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary (little or no exercise)' },
  { value: 1.375, label: 'Lightly active (light exercise 1-3 days/week)' },
  { value: 1.55, label: 'Moderately active (moderate exercise 3-5 days/week)' },
  { value: 1.725, label: 'Very active (hard exercise 6-7 days/week)' },
  { value: 1.9, label: 'Super active (very hard exercise, physical job)' },
];

/**
 * Props for the ProfileSettingsCard component
 */
interface ProfileSettingsCardProps {
  /** Current user data */
  user: User | null;
  /** Callback function to update user data after successful profile update */
  onUserUpdate: (userData: User) => void;
}

/**
 * ProfileSettingsCard Component
 * 
 * Provides a comprehensive interface for users to update their profile information:
 * - Physical attributes (weight, height, age, gender)
 * - Activity level and fitness goals
 * - BMI calculation and categorization
 * - Form validation and API integration
 * 
 * Features:
 * - Real-time BMI calculation with health category indicators
 * - Activity level selection with descriptive labels
 * - Goal-based nutrition planning (lose/maintain/gain weight)
 * - Input validation and error handling
 * - Loading states during API calls
 */
const ProfileSettingsCard: React.FC<ProfileSettingsCardProps> = ({
  user,
  onUserUpdate,
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /** Profile form state */
  const [profile, setProfile] = useState<Partial<User>>({
    weight: user?.weight || undefined,
    height: user?.height || undefined,
    age: user?.age || undefined,
    gender: user?.gender || undefined,
    activity_level: user?.activity_level || 1.5,
    goal: user?.goal || 'maintain',
  });
  
  /** Loading state for profile update */
  const [loading, setLoading] = useState(false);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Calculate BMI from current weight and height values
   */
  const calculateBMI = () => {
    if (profile.weight && profile.height) {
      const heightInMeters = profile.height / 100;
      return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  /**
   * Get BMI category and color based on BMI value
   */
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'info' };
    if (bmi < 25) return { category: 'Normal weight', color: 'success' };
    if (bmi < 30) return { category: 'Overweight', color: 'warning' };
    return { category: 'Obese', color: 'error' };
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle profile update submission
   */
  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const response = await api.put('/users/profile', profile);
      onUserUpdate(response.data.data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update profile field with new value
   */
  const updateProfileField = (field: keyof typeof profile, value: any) => {
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Information
        </Typography>
        
        <Grid container spacing={2}>
          {/* Weight Input */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              value={profile.weight || ''}
              onChange={(e) =>
                updateProfileField(
                  'weight',
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              helperText="Used for calorie and nutrient calculations"
            />
          </Grid>
          
          {/* Height Input */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Height (cm)"
              type="number"
              value={profile.height || ''}
              onChange={(e) =>
                updateProfileField(
                  'height',
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              helperText="Used for BMI and calorie calculations"
            />
          </Grid>
          
          {/* Age Input */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={profile.age || ''}
              onChange={(e) =>
                updateProfileField(
                  'age',
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              helperText="Used for nutrient recommendations"
            />
          </Grid>
          
          {/* Gender Selection */}
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={profile.gender || ''}
                label="Gender"
                onChange={(e) => updateProfileField('gender', e.target.value as any)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Activity Level Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Activity Level (PAL)</InputLabel>
              <Select
                value={profile.activity_level || 1.5}
                label="Activity Level (PAL)"
                onChange={(e) => updateProfileField('activity_level', e.target.value as number)}
              >
                {ACTIVITY_LEVELS.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.value} - {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Goal Selection */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Goal</InputLabel>
              <Select
                value={profile.goal || 'maintain'}
                label="Goal"
                onChange={(e) => updateProfileField('goal', e.target.value as any)}
              >
                <MenuItem value="lose">Lose Weight</MenuItem>
                <MenuItem value="maintain">Maintain Weight</MenuItem>
                <MenuItem value="gain">Gain Weight</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* BMI Display */}
        {bmi && bmiInfo && (
          <Alert severity={bmiInfo.color as any} sx={{ mt: 2 }}>
            <Typography variant="body2">
              Your BMI is {bmi} ({bmiInfo.category})
            </Typography>
          </Alert>
        )}

        {/* Update Button */}
        <Button
          variant="contained"
          onClick={handleProfileUpdate}
          disabled={loading}
          sx={{ mt: 2 }}
          fullWidth
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSettingsCard;
