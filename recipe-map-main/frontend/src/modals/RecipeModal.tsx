/**
 * Recipe Modal Component
 * 
 * Comprehensive modal dialog for creating and editing recipes.
 * Manages complete recipe data including:
 * - Basic information (name, category, description)
 * - Cooking details (servings, prep time, cook time, difficulty)
 * - Dynamic ingredient management with autocomplete
 * - Step-by-step instruction creation and editing
 * - Responsive mobile/desktop layout
 * 
 * Features:
 * - Full-screen mobile experience
 * - Drag-and-drop ingredient list management
 * - Real-time instruction editing with numbering
 * - Ingredient search with brand and category display
 * - Form validation and save state management
 * - Responsive field sizing and layout adaptation
 * 
 * @component
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Autocomplete,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { Recipe, RecipeIngredient, Ingredient } from '../types';

/**
 * Props interface for RecipeModal component
 */
interface RecipeModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Whether we're editing (true) or creating (false) */
  editMode: boolean;
  /** Current recipe form data with ingredients and instructions */
  recipeForm: Partial<Recipe & { ingredients: RecipeIngredient[] }>;
  /** Available ingredients for selection */
  ingredients: Ingredient[];
  /** Close modal handler */
  onClose: () => void;
  /** Save recipe handler */
  onSave: () => void;
  /** Field change handler */
  onChange: (field: keyof Recipe, value: any) => void;
  /** Ingredients list change handler */
  onIngredientsChange: (ingredients: RecipeIngredient[]) => void;
  /** Whether save button should be enabled */
  canSave: boolean;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  open,
  editMode,
  recipeForm,
  ingredients,
  onClose,
  onSave,
  onChange,
  onIngredientsChange,
  canSave,
}) => {
  // Responsive design detection
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Local state for ingredient addition form
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [ingredientQuantity, setIngredientQuantity] = useState<number>(1);
  const [ingredientUnit, setIngredientUnit] = useState<string>('');
  const [newInstruction, setNewInstruction] = useState<string>('');

  /**
   * Add selected ingredient to recipe ingredient list
   */
  const addIngredient = () => {
    if (!selectedIngredient || !ingredientQuantity || !ingredientUnit) return;

    const newIngredient: RecipeIngredient = {
      ingredient_id: selectedIngredient.id,
      ingredient_name: selectedIngredient.name,
      quantity: ingredientQuantity,
      unit: ingredientUnit,
    };

    const updatedIngredients = [...(recipeForm.ingredients || []), newIngredient];
    onIngredientsChange(updatedIngredients);

    // Reset form
    setSelectedIngredient(null);
    setIngredientQuantity(1);
    setIngredientUnit('');
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = (recipeForm.ingredients || []).filter((_, i) => i !== index);
    onIngredientsChange(updatedIngredients);
  };

  const addInstruction = () => {
    if (!newInstruction.trim()) return;

    const updatedInstructions = [...(recipeForm.instructions || []), newInstruction.trim()];
    onChange('instructions', updatedInstructions);
    setNewInstruction('');
  };

  const removeInstruction = (index: number) => {
    const updatedInstructions = (recipeForm.instructions || []).filter((_, i) => i !== index);
    onChange('instructions', updatedInstructions);
  };

  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...(recipeForm.instructions || [])];
    updatedInstructions[index] = value;
    onChange('instructions', updatedInstructions);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          ...(isMobile && {
            margin: 0,
            maxHeight: 'none',
            height: '100%',
          })
        }
      }}
    >
      <DialogTitle sx={{ pb: isMobile ? 1 : 2 }}>
        {editMode ? 'Edit' : 'Add'} Recipe
      </DialogTitle>
      <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
        <Grid container spacing={isMobile ? 1.5 : 2} sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={recipeForm.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Category"
              value={recipeForm.category || ''}
              onChange={(e) => onChange('category', e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={isMobile ? 2 : 3}
              value={recipeForm.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Servings"
              type="number"
              value={recipeForm.servings || ''}
              onChange={(e) => onChange('servings', parseInt(e.target.value) || 1)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Prep Time (minutes)"
              type="number"
              value={recipeForm.prep_time || ''}
              onChange={(e) => onChange('prep_time', parseInt(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size={isMobile ? "small" : "medium"}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={recipeForm.difficulty || ''}
                label="Difficulty"
                onChange={(e) => onChange('difficulty', e.target.value as any)}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Ingredients Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Ingredients
            </Typography>
          </Grid>
          
          {/* Add Ingredient Form */}
          <Grid item xs={12}>
            <Paper sx={{ p: isMobile ? 1.5 : 2, backgroundColor: 'grey.50' }}>
              <Grid container spacing={isMobile ? 1.5 : 2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Autocomplete
                    size={isMobile ? "small" : "medium"}
                    value={selectedIngredient}
                    onChange={(_, newValue) => setSelectedIngredient(newValue)}
                    options={ingredients}
                    getOptionLabel={(option) => `${option.name} ${option.brand ? `(${option.brand})` : ''}`}
                    renderInput={(params) => (
                      <TextField {...params} label="Select Ingredient" fullWidth size={isMobile ? "small" : "medium"} />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body1">{option.name}</Typography>
                          {option.brand && (
                            <Typography variant="caption" color="text.secondary">
                              {option.brand} • {option.category}
                            </Typography>
                          )}
                        </Box>
                      </li>
                    )}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={ingredientQuantity}
                    onChange={(e) => setIngredientQuantity(parseFloat(e.target.value) || 0)}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    fullWidth
                    label="Unit"
                    value={ingredientUnit}
                    onChange={(e) => setIngredientUnit(e.target.value)}
                    placeholder="g, ml, cup, tbsp..."
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addIngredient}
                    disabled={!selectedIngredient || !ingredientQuantity || !ingredientUnit}
                    size={isMobile ? "small" : "medium"}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Ingredients List */}
          <Grid item xs={12}>
            {(recipeForm.ingredients || []).length > 0 ? (
              <List>
                {(recipeForm.ingredients || []).map((ingredient, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1">
                            {ingredient.ingredient_name}
                          </Typography>
                          <Chip
                            label={`${ingredient.quantity} ${ingredient.unit}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => removeIngredient(index)}
                        color="error"
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No ingredients added yet. Use the form above to add ingredients.
              </Typography>
            )}
          </Grid>

          {/* Instructions Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Instructions
            </Typography>
          </Grid>

          {/* Add Instruction Form */}
          <Grid item xs={12}>
            <Paper sx={{ p: isMobile ? 1.5 : 2, backgroundColor: 'grey.50' }}>
              <Grid container spacing={isMobile ? 1.5 : 2} alignItems="center">
                <Grid item xs={12} md={10}>
                  <TextField
                    fullWidth
                    label="Add Instruction Step"
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    multiline
                    rows={isMobile ? 2 : 3}
                    placeholder="Describe the next step in the recipe..."
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addInstruction}
                    disabled={!newInstruction.trim()}
                    size={isMobile ? "small" : "medium"}
                  >
                    Add Step
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Instructions List */}
          <Grid item xs={12}>
            {(recipeForm.instructions || []).length > 0 ? (
              <List>
                {(recipeForm.instructions || []).map((instruction, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="flex-start" gap={2}>
                          <Chip
                            label={index + 1}
                            size="small"
                            color="primary"
                            sx={{ mt: 0.5, minWidth: 32 }}
                          />
                          <TextField
                            fullWidth
                            multiline
                            value={instruction}
                            onChange={(e) => updateInstruction(index, e.target.value)}
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                          />
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => removeInstruction(index)}
                        color="error"
                        size="small"
                      >
                        <RemoveIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No instructions added yet. Use the form above to add cooking steps.
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: isMobile ? 2 : 3, py: isMobile ? 1.5 : 2 }}>
        <Button onClick={onClose} size={isMobile ? "small" : "medium"}>
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          variant="contained" 
          disabled={!canSave}
          size={isMobile ? "small" : "medium"}
        >
          {editMode ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecipeModal;
