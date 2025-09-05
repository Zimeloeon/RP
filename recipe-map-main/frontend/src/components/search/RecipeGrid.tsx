
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import Restaurant from '@mui/icons-material/Restaurant';
import { Recipe } from '../../types';

/**
 * Props for the RecipeGrid component
 */
interface RecipeGridProps {
  /** Array of recipes to display */
  recipes: Recipe[];
  /** Whether recipes are currently loading */
  loading: boolean;
  /** Handler for when a recipe card is clicked */
  onRecipeClick: (recipe: Recipe) => void;
}

/**
 * RecipeGrid Component
 * 
 * Displays a responsive grid of recipe cards with:
 * - Recipe information (name, category, difficulty)
 * - Cooking times and servings
 * - Description preview
 * - Ingredient list preview
 * - Loading and empty states
 * 
 * Features:
 * - Responsive grid layout (1-3 columns based on screen size)
 * - Hover effects and animations
 * - Clickable cards for detailed view
 * - Truncated content with proper overflow handling
 */
const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  loading,
  onRecipeClick,
}) => {
  /**
   * Format time duration for display
   */
  const formatTime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  /**
   * Get difficulty chip color based on difficulty level
   */
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  // Loading State
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Empty State
  if (recipes.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Restaurant sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No recipes found
        </Typography>
        <Typography color="text.secondary">
          Try adjusting your search criteria or clearing the filters
        </Typography>
      </Paper>
    );
  }

  // Recipe Grid
  return (
    <Grid container spacing={3}>
      {recipes.map((recipe) => (
        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}
            onClick={() => onRecipeClick(recipe)}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              {/* Recipe Header */}
              <Box sx={{ mb: 2 }}>
                <Typography 
                  variant="h6" 
                  component="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    lineHeight: 1.3,
                    mb: 1
                  }}
                >
                  {recipe.name}
                </Typography>
                
                {/* Category and Difficulty Chips */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={recipe.category} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                  {recipe.difficulty && (
                    <Chip 
                      label={recipe.difficulty}
                      size="small"
                      color={getDifficultyColor(recipe.difficulty) as any}
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Box>
              </Box>

              {/* Recipe Description */}
              {recipe.description && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.4
                  }}
                >
                  {recipe.description}
                </Typography>
              )}

              {/* Recipe Stats Grid */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1,
                mb: 2,
                p: 1.5,
                bgcolor: 'grey.50',
                borderRadius: 1
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Prep
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {formatTime(recipe.prep_time)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Cook
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {formatTime(recipe.cook_time)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Serves
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {recipe.servings}
                  </Typography>
                </Box>
              </Box>

              {/* Ingredients Preview */}
              {recipe.ingredients && recipe.ingredients.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="600" gutterBottom sx={{ mb: 1 }}>
                    Ingredients ({recipe.ingredients.length})
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 0.5,
                    maxHeight: '80px',
                    overflow: 'hidden'
                  }}>
                    {/* Show first 6 ingredients */}
                    {recipe.ingredients.slice(0, 6).map((ing, index) => (
                      <Chip
                        key={`${recipe.id}-${ing.ingredient_id}-${index}`}
                        label={ing.ingredient_name}
                        size="small"
                        variant="outlined"
                        color="secondary"
                        sx={{ 
                          fontSize: '0.75rem',
                          height: 24,
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    ))}
                    
                    {/* Show "more" indicator if there are additional ingredients */}
                    {recipe.ingredients.length > 6 && (
                      <Chip
                        label={`+${recipe.ingredients.length - 6} more`}
                        size="small"
                        variant="filled"
                        color="default"
                        sx={{ 
                          fontSize: '0.75rem',
                          height: 24,
                          '& .MuiChip-label': {
                            px: 1
                          }
                        }}
                      />
                    )}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeGrid;
