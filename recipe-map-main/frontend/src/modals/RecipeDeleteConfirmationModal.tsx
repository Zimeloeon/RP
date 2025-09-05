/**
 * Recipe Delete Confirmation Modal Component
 * 
 * Modal dialog for confirming deletion of all ingredients from a recipe entry.
 * Features:
 * - Recipe information display with icon
 * - Count of ingredients to be deleted
 * - Clear warning message about deletion scope
 * - Styled confirmation and cancel actions
 * - Responsive design with proper spacing
 * 
 * This modal specifically handles the case where users want to delete
 * an entire recipe entry from their timeline, which removes all
 * associated ingredient entries that were added as part of that recipe.
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
  Typography,
  Box,
  Paper,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  RestaurantMenu,
} from '@mui/icons-material';
import { IntakeEntry } from '../types';

/**
 * Interface for recipe to be deleted
 */
interface RecipeToDelete {
  name: string;
  entries: IntakeEntry[];
}

interface RecipeDeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipe: RecipeToDelete | null;
}

/**
 * Modal component for confirming deletion of all ingredients from a recipe
 * Shows recipe details and number of ingredients that will be deleted
 */
const RecipeDeleteConfirmationModal: React.FC<RecipeDeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  recipe,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <DeleteIcon color="error" />
          <Typography variant="h6">
            Delete Recipe Ingredients
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {recipe && (
          <Box>
            <Typography variant="body1" mb={2}>
              Are you sure you want to delete all ingredients from this recipe?
            </Typography>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  sx={{
                    bgcolor: 'secondary.main',
                    width: 32,
                    height: 32
                  }}
                >
                  <RestaurantMenu />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {recipe.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {recipe.entries.length} ingredients will be deleted
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <Typography variant="body2" color="text.secondary" mt={2}>
              This will delete all individual ingredient entries for this recipe. This action cannot be undone.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          color="error" 
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Delete All Ingredients
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeDeleteConfirmationModal;
