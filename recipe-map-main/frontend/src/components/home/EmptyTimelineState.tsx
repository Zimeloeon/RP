/**
 * EmptyTimelineState Component
 * 
 * Displays an engaging empty state when no timeline entries exist for the selected date.
 * Provides a call-to-action button to add the first entry with attractive styling
 * and motivational messaging.
 * 
 * @component
 */

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useThemeStore } from '../../stores';

interface EmptyTimelineStateProps {
  /** Callback when the "Add Your First Entry" button is clicked */
  onAddEntry: () => void;
}

/**
 * EmptyTimelineState - Engaging empty state component
 * 
 * Shows when no timeline entries exist for the selected date.
 * Features:
 * - Motivational messaging to encourage first entry
 * - Prominent call-to-action button with gradient styling
 * - Responsive design with proper spacing
 * - Theme-aware colors and hover effects
 */
const EmptyTimelineState: React.FC<EmptyTimelineStateProps> = ({
  onAddEntry,
}) => {
  // Theme and styling
  const theme = useTheme();
  const { colorScheme } = useThemeStore();

  return (
    <Box 
      sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: 3,
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          p: 8, 
          textAlign: 'center',
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        {/* Main heading */}
        <Typography variant="h5" color="text.secondary" mb={2} fontWeight={500}>
          Your day is wide open
        </Typography>
        
        {/* Subtitle with encouragement */}
        <Typography variant="body1" color="text.secondary" mb={4}>
          Start building your timeline by adding your first meal, ingredient, or supplement.
        </Typography>
        
        {/* Call-to-action button */}
        <Button 
          variant="contained" 
          size="medium" 
          startIcon={<AddIcon />}
          onClick={onAddEntry}
          sx={{ 
            borderRadius: 2, 
            px: 3, 
            py: 1,
            background: `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`,
            color: 'white',
            fontWeight: 600,
            '&:hover': {
              background: `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.to} 0%, ${colorScheme.gradients.sidebarHeader.from} 100%)`,
              transform: 'translateY(-1px)',
              boxShadow: theme.shadows[8],
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          Add Your First Entry
        </Button>
      </Paper>
    </Box>
  );
};

export default EmptyTimelineState;
