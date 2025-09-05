
import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Recipe } from '../../types';

/**
 * Props for the RecipeDetailsModal component
 */
interface RecipeDetailsModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Handler for closing the modal */
  onClose: () => void;
  /** Recipe to display (null if none selected) */
  recipe: Recipe | null;
}

/**
 * RecipeDetailsModal Component
 * 
 * A comprehensive modal dialog for displaying detailed recipe information:
 * - Recipe name, category, and difficulty
 * - Preparation and cooking times
 * - Servings information
 * - Complete ingredient list with quantities
 * - Step-by-step cooking instructions
 * - Action buttons for meal planning
 * 
 * Features:
 * - Responsive layout with grid system
 * - Color-coded difficulty indicators
 * - Formatted time display
 * - Numbered instruction steps
 * - Structured ingredient list
 */
const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  open,
  onClose,
  recipe,
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

  if (!recipe) {
    return null;
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '500px' }
      }}
    >
      {/* Modal Header */}
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h5" component="h2" gutterBottom>
              {recipe.name}
            </Typography>
            
            {/* Category and Difficulty Chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={recipe.category} 
                color="primary" 
                variant="outlined"
                size="small"
              />
              {recipe.difficulty && (
                <Chip 
                  label={recipe.difficulty}
                  color={getDifficultyColor(recipe.difficulty) as any}
                  size="small"
                />
              )}
            </Box>
          </Box>
          
          {/* Close Button */}
          <Button 
            onClick={onClose}
            sx={{ minWidth: 'auto', p: 1 }}
            aria-label="Close recipe details"
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Recipe Information Bar */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              mb: 3,
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 2,
              flexWrap: 'wrap'
            }}>
              {/* Prep Time */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="action" />
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Prep Time
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {formatTime(recipe.prep_time)}
                  </Typography>
                </Box>
              </Box>
              
              {/* Cook Time */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon color="action" />
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Cook Time
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {formatTime(recipe.cook_time)}
                  </Typography>
                </Box>
              </Box>
              
              {/* Servings */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon color="action" />
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Serves
                  </Typography>
                  <Typography variant="body2" fontWeight="600">
                    {recipe.servings}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Recipe Description */}
          {recipe.description && (
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {recipe.description}
              </Typography>
            </Grid>
          )}

          {/* Ingredients List */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Ingredients ({recipe.ingredients.length})
              </Typography>
              <List dense>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem 
                    key={`${recipe.id}-${ingredient.ingredient_id}-${index}`} 
                    sx={{ pl: 0 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={ingredient.ingredient_name}
                      secondary={`${ingredient.quantity} ${ingredient.unit}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}

          {/* Cooking Instructions */}
          <Grid item xs={12} md={recipe.ingredients?.length ? 6 : 12}>
            <Typography variant="h6" gutterBottom>
              Instructions ({recipe.instructions.length} steps)
            </Typography>
            <List>
              {recipe.instructions.map((instruction, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ pl: 0, alignItems: 'flex-start' }}>
                    {/* Step Number */}
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                      <Box sx={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}>
                        {index + 1}
                      </Box>
                    </ListItemIcon>
                    
                    {/* Instruction Text */}
                    <ListItemText 
                      primary={instruction}
                      sx={{ mt: 0 }}
                    />
                  </ListItem>
                  
                  {/* Divider between steps (except last) */}
                  {index < recipe.instructions.length - 1 && (
                    <Divider sx={{ ml: 5 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Add to Meal Plan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDetailsModal;
