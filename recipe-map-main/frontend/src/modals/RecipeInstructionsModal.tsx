/**
 * Recipe Instructions Modal Component
 * 
 * Modal dialog for displaying recipe cooking instructions and consumed ingredients.
 * Shows:
 * - Recipe name and details
 * - Actual consumed quantities from timeline (not recipe defaults)
 * - Step-by-step cooking instructions
 * - Ingredient list with consumed amounts
 * 
 * Features:
 * - Responsive layout for mobile and desktop
 * - Clear instruction numbering and formatting
 * - Actual vs recipe quantity display
 * - Easy-to-read ingredient list
 * 
 * @component
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  RestaurantMenu,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Recipe } from '../types';

/**
 * Props interface for RecipeInstructionsModal component
 */
interface RecipeInstructionsModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Close modal handler */
  onClose: () => void;
  /** Recipe to display (null if none selected) */
  recipe: Recipe | null;
  /** Actual consumed ingredients with quantities from timeline */
  ingredients: Array<{
    id: number;
    ingredient_id: number;
    ingredient_name: string;
    quantity: number;
    unit: string;
  }>;
}

/**
 * Modal component for displaying recipe cooking instructions and ingredients
 * Shows actual consumed quantities from timeline rather than recipe defaults
 */
const RecipeInstructionsModal: React.FC<RecipeInstructionsModalProps> = ({
  open,
  onClose,
  recipe,
  ingredients,
}) => {
  if (!recipe) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <RestaurantMenu color="secondary" />
            <Typography variant="h6">
              {recipe.name} - Cooking Instructions
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box>
          {/* Recipe Details */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                <strong>Servings:</strong> {(() => {
                  // Calculate actual servings from timeline ingredients
                  if (ingredients.length > 0 && recipe) {
                    // For timeline ingredients, we show that these are actual consumed quantities
                    // since they represent what was actually added, not the recipe base amounts
                    return `Actual consumed (from timeline)`;
                  }
                  return recipe.servings; // Fallback to recipe default
                })()}
              </Typography>
            </Grid>
            {recipe.prep_time && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Prep Time:</strong> {recipe.prep_time} minutes
                </Typography>
              </Grid>
            )}
            {recipe.cook_time && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cook Time:</strong> {recipe.cook_time} minutes
                </Typography>
              </Grid>
            )}
            {recipe.difficulty && (
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Difficulty:</strong> {recipe.difficulty}
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Description */}
          {recipe.description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {recipe.description}
              </Typography>
            </Box>
          )}

          {/* Recipe Ingredients */}
          {ingredients.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Ingredients (Actual Consumed)
              </Typography>
              <List sx={{ pl: 0, bgcolor: 'grey.50', borderRadius: 1 }}>
                {ingredients.map((ingredient, index) => (
                  <ListItem 
                    key={index} 
                    sx={{ 
                      pl: 2, 
                      py: 1,
                      borderBottom: index < ingredients.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight={500}>
                            {ingredient.ingredient_name}
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight={600}>
                            {ingredient.quantity} {ingredient.unit}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Instructions */}
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Cooking Instructions
          </Typography>
          <List sx={{ pl: 0 }}>
            {recipe.instructions.map((instruction, index) => (
              <ListItem key={index} sx={{ pl: 0, alignItems: 'flex-start' }}>
                <ListItemText
                  primary={
                    <Box display="flex" gap={2}>
                      <Typography variant="body2" color="primary" fontWeight={600} sx={{ minWidth: 24 }}>
                        {index + 1}.
                      </Typography>
                      <Typography variant="body2">
                        {instruction}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeInstructionsModal;
