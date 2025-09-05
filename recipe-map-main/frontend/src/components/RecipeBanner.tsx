/**
 * Recipe Banner Component
 * 
 * Displays recipe information as a banner in the timeline view.
 * Features:
 * - Recipe name with cooking icon
 * - Clickable area to view recipe instructions
 * - Delete button to remove all recipe ingredients
 * - Hover effects and responsive design
 * - Count of associated ingredient entries
 * 
 * Used in the timeline to group ingredient entries that came from
 * adding a recipe, providing context about their origin and allowing
 * users to view cooking instructions or remove the entire recipe.
 * 
 * @component
 */

import React from 'react';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  RestaurantMenu,
} from '@mui/icons-material';
import { IntakeEntry } from '../types';

/**
 * Props interface for RecipeBanner component
 */
interface RecipeBannerProps {
  /** Name of the recipe */
  recipeName: string;
  /** Array of ingredient entries that belong to this recipe */
  entries: IntakeEntry[];
  /** Handler for when banner is clicked (to view instructions) */
  onClick: () => void;
  /** Handler for when delete button is clicked */
  onDelete: (recipeName: string, entries: IntakeEntry[]) => void;
}

/**
 * Component for displaying recipe banners in the timeline
 * Shows recipe name with clickable area to view instructions and delete button
 */
const RecipeBanner: React.FC<RecipeBannerProps> = ({
  recipeName,
  entries,
  onClick,
  onDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      elevation={2}
      sx={{
        p: isMobile ? 1 : 2,
        mb: isMobile ? 1 : 2,
        bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
        border: `2px solid ${theme.palette.secondary.main}`,
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.100',
          transform: 'translateY(-1px)',
          boxShadow: theme.shadows[4],
        },
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={onClick}
    >
      <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2}>
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            width: isMobile ? 28 : 40,
            height: isMobile ? 28 : 40
          }}
        >
          <RestaurantMenu sx={{ fontSize: isMobile ? '1rem' : '1.5rem' }} />
        </Avatar>
        <Box flex={1}>
          <Typography variant={isMobile ? "body2" : "h6"} fontWeight={600} color="secondary">
            {recipeName}
          </Typography>
          {!isMobile && (
            <Typography variant="body2" color="text.secondary">
              Click to view cooking instructions • {entries.length} ingredients
            </Typography>
          )}
          {isMobile && (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {entries.length} ingredients
            </Typography>
          )}
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          {!isMobile && (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Recipe
            </Typography>
          )}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // Prevent recipe modal from opening
              onDelete(recipeName, entries);
            }}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { 
                color: theme.palette.error.main,
                bgcolor: theme.palette.error.light + '20'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default RecipeBanner;
