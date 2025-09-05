
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import GroceryListItem, { AggregatedIngredient } from './GroceryListItem';

/**
 * Props for the GroceryListCard component
 */
interface GroceryListCardProps {
  /** Array of aggregated ingredients to display */
  ingredients: AggregatedIngredient[];
  /** Handler for toggling purchase status of ingredients */
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
 * GroceryListCard Component
 * 
 * Main container for displaying the grocery list with:
 * - Header with ingredient count
 * - List of individual grocery items
 * - Empty state handling
 * - Responsive design and theming
 * 
 * Features:
 * - Gradient-styled header with ingredient count badge
 * - Individual clickable grocery list items
 * - Empty state with helpful message
 * - Mobile-responsive spacing and layout
 * - Theme-aware styling with dark/light mode support
 * - Smooth transitions and hover effects
 */
const GroceryListCard: React.FC<GroceryListCardProps> = ({
  ingredients,
  onTogglePurchased,
  colorScheme,
}) => {
  // ============================================================================
  // RESPONSIVE DESIGN
  // ============================================================================
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ============================================================================
  // RENDER
  // ============================================================================
  
  // Empty State
  if (ingredients.length === 0) {
    return (
      <Alert severity="info">
        No ingredients found for the selected date range. Add some recipes or ingredients to your timeline to see them here.
      </Alert>
    );
  }

  // Grocery List Display
  return (
    <Card
      sx={{
        background: colorScheme.mode === 'dark' 
          ? 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: colorScheme.mode === 'dark' 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(0, 0, 0, 0.1)',
        border: colorScheme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3, '&:last-child': { pb: isMobile ? 2 : 3 } }}>
        {/* Header with Title and Count */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Aggregated Ingredients
          </Typography>
          <Chip
            label={`${ingredients.length} ingredients`}
            size="small"
            sx={{
              background: `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`,
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>
        
        {/* Ingredients List */}
        <List sx={{ p: 0 }}>
          {ingredients.map((ingredient, index) => (
            <GroceryListItem
              key={`${ingredient.item_id}-${index}`}
              ingredient={ingredient}
              index={index}
              totalItems={ingredients.length}
              onTogglePurchased={onTogglePurchased}
              colorScheme={colorScheme}
            />
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default GroceryListCard;
