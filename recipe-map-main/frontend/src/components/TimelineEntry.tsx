/**
 * Timeline Entry Component
 * 
 * Displays individual food/supplement/water entries in the daily timeline.
 * Features:
 * - Type-specific icons and colors (ingredient, recipe, supplement, water)
 * - Responsive design for mobile and desktop
 * - Edit and delete functionality
 * - Special handling for recipe ingredients (indented display)
 * - Hover effects and smooth transitions
 * - Water entry support with blue theme and water emoji
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalDining,
  Restaurant,
  Medication,
} from '@mui/icons-material';
import { IntakeEntry } from '../types';

interface TimelineEntryProps {
  entry: IntakeEntry;                           // The intake entry data to display
  isRecipeIngredient: boolean;                  // Whether this is a recipe ingredient (affects styling)
  onEdit: (entry: IntakeEntry) => void;         // Callback for edit action
  onDelete: (entry: IntakeEntry) => void;       // Callback for delete action
}

/**
 * TimelineEntry Component
 * 
 * Renders a single entry in the food intake timeline with appropriate
 * styling, icons, and actions based on the entry type.
 */
const TimelineEntry: React.FC<TimelineEntryProps> = ({
  entry,
  isRecipeIngredient,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Get appropriate icon for each entry type
   * Water entries get a special emoji icon for visual distinction
   */
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'ingredient':
        return <LocalDining />;
      case 'recipe':
        return <Restaurant />;
      case 'supplement':
        return <Medication />;
      case 'water':
        return <Typography sx={{ fontSize: 16, fontWeight: 'bold' }}>💧</Typography>;
      default:
        return <LocalDining />;
    }
  };

  /**
   * Get theme color for each entry type
   * Water entries use 'info' (blue) color to match the water theme
   */
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ingredient':
        return 'primary';
      case 'recipe':
        return 'secondary';
      case 'supplement':
        return 'success';
      case 'water':
        return 'info'; // Blue color for water entries
      default:
        return 'default';
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: isMobile ? 1 : 3,
        mb: isMobile ? 1 : 2,
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        ml: isRecipeIngredient ? (isMobile ? 1 : 2) : 0,
        '&:hover': {
          elevation: 3,
          borderColor: theme.palette.primary.main,
          transform: 'translateY(-1px)',
        },
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" flexDirection={isMobile ? 'column' : 'row'} gap={isMobile ? 1 : 0}>
        <Box display="flex" alignItems="flex-start" gap={isMobile ? 0.75 : 2} flex={1} width="100%">
          <Avatar
            sx={{
              bgcolor: `${getTypeColor(entry.type)}.main`,
              width: isMobile ? 28 : 40,
              height: isMobile ? 28 : 40
            }}
          >
            {getItemIcon(entry.type)}
          </Avatar>
          <Box flex={1} minWidth={0}>
            <Box display="flex" alignItems="center" gap={isMobile ? 1 : 2} flexWrap="wrap">
              <Typography 
                variant={isMobile ? "body2" : "h6"} 
                fontWeight={600} 
                sx={{ 
                  flexShrink: 0,
                  fontSize: isMobile ? '0.875rem' : undefined
                }}
              >
                {entry.item_name}
              </Typography>
              
              {/* Show quantity inline on mobile */}
              {isMobile && (
                <Typography variant="body2" color="text.secondary">
                  • {entry.quantity} {entry.unit}
                </Typography>
              )}
            </Box>
            
            {/* Show quantity on separate line for desktop */}
            {!isMobile && (
              <Typography variant="body1" color="text.secondary" mb={0.5}>
                {entry.quantity} {entry.unit}
              </Typography>
            )}
            
            {entry.notes && (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {entry.notes}
              </Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" gap={1} alignSelf={isMobile ? 'flex-end' : 'flex-start'}>
          <IconButton
            size="small"
            onClick={() => onEdit(entry)}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.primary.main }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(entry)}
            sx={{ 
              color: theme.palette.text.secondary,
              '&:hover': { color: theme.palette.error.main }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default TimelineEntry;
