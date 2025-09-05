
import React from 'react';
import {
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';

/**
 * Interface for aggregated ingredient data
 */
export interface AggregatedIngredient {
  item_id: number;
  item_name: string;
  totalQuantity: number;
  unit: string;
  occurrences: number;
  purchased?: boolean;
}

/**
 * Props for the GroceryListItem component
 */
interface GroceryListItemProps {
  /** Ingredient data to display */
  ingredient: AggregatedIngredient;
  /** Index in the list for border styling */
  index: number;
  /** Total number of items for border logic */
  totalItems: number;
  /** Handler for toggling purchase status */
  onTogglePurchased: (itemId: number) => void;
  /** Color scheme for styling */
  colorScheme: {
    mode: 'light' | 'dark';
    gradients: {
      sidebarHeader: {
        from: string;
        to: string;
      };
    };
  };
}

/**
 * GroceryListItem Component
 * 
 * Displays an individual ingredient in the grocery list with:
 * - Ingredient name and quantity information
 * - Purchase status toggle functionality
 * - Visual indicators for purchased items (strikethrough, opacity)
 * - Occurrence count for items appearing multiple times
 * - Responsive design for mobile and desktop
 * 
 * Features:
 * - Click-to-toggle purchase status
 * - Visual feedback for purchased items (strikethrough, reduced opacity)
 * - Occurrence badges for ingredients used multiple times
 * - Purchase status indicator with checkmark
 * - Mobile-optimized spacing and typography
 * - Theme-aware styling with gradient accents
 */
const GroceryListItem: React.FC<GroceryListItemProps> = ({
  ingredient,
  index,
  totalItems,
  onTogglePurchased,
  colorScheme,
}) => {
  // ============================================================================
  // RESPONSIVE DESIGN
  // ============================================================================
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Format quantity for display with proper rounding
   */
  const formatQuantity = (quantity: number, unit: string) => {
    const rounded = Math.round(quantity * 10) / 10;
    return `${rounded} ${unit}`;
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <ListItem
      component="div"
      onClick={() => onTogglePurchased(ingredient.item_id)}
      sx={{
        px: 0,
        py: isMobile ? 1 : 1.5,
        borderBottom: index < totalItems - 1 
          ? `1px solid ${colorScheme.mode === 'dark' ? '#333' : '#e0e0e0'}`
          : 'none',
        cursor: 'pointer',
        opacity: ingredient.purchased ? 0.6 : 1,
        transition: 'opacity 0.2s ease',
        '&:hover': {
          backgroundColor: colorScheme.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
        },
      }}
    >
      <ListItemText
        primary={
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {/* Ingredient Name */}
            <Typography 
              variant="body1" 
              fontWeight="medium"
              sx={{ 
                flex: 1,
                mr: 2,
                fontSize: isMobile ? '0.875rem' : '1rem',
                textDecoration: ingredient.purchased ? 'line-through' : 'none',
                color: ingredient.purchased 
                  ? (colorScheme.mode === 'dark' ? '#888' : '#666')
                  : 'inherit',
                transition: 'color 0.2s ease',
              }}
            >
              {ingredient.item_name}
            </Typography>
            
            {/* Right Side: Quantity, Occurrence Badge, Purchase Indicator */}
            <Box display="flex" alignItems="center" gap={1}>
              {/* Quantity Display */}
              <Typography
                variant="body2"
                fontWeight="bold"
                sx={{
                  color: ingredient.purchased
                    ? (colorScheme.mode === 'dark' ? '#666' : '#999')
                    : colorScheme.gradients.sidebarHeader.from,
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  textDecoration: ingredient.purchased ? 'line-through' : 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                {formatQuantity(ingredient.totalQuantity, ingredient.unit)}
              </Typography>
              
              {/* Occurrence Badge */}
              {ingredient.occurrences > 1 && (
                <Chip
                  label={`${ingredient.occurrences}×`}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: isMobile ? 20 : 24,
                    fontSize: isMobile ? '0.625rem' : '0.75rem',
                    borderColor: ingredient.purchased
                      ? (colorScheme.mode === 'dark' ? '#666' : '#999')
                      : colorScheme.gradients.sidebarHeader.from,
                    color: ingredient.purchased
                      ? (colorScheme.mode === 'dark' ? '#666' : '#999')
                      : colorScheme.gradients.sidebarHeader.from,
                    opacity: ingredient.purchased ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                  }}
                />
              )}
              
              {/* Purchase Status Indicator */}
              <Box
                sx={{
                  width: isMobile ? 16 : 20,
                  height: isMobile ? 16 : 20,
                  borderRadius: '50%',
                  border: `2px solid ${ingredient.purchased 
                    ? colorScheme.gradients.sidebarHeader.from 
                    : (colorScheme.mode === 'dark' ? '#666' : '#ccc')}`,
                  backgroundColor: ingredient.purchased 
                    ? colorScheme.gradients.sidebarHeader.from 
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                {ingredient.purchased && (
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: isMobile ? '0.75rem' : '0.875rem',
                      fontWeight: 'bold',
                    }}
                  >
                    ✓
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        }
      />
    </ListItem>
  );
};

export default GroceryListItem;
