/**
 * Add Entry Modal Component
 * 
 * Modal dialog for adding new nutrition intake entries.
 * Supports multiple entry types:
 * - Ingredients: Food items with nutrition data
 * - Recipes: Collections of ingredients with instructions
 * - Supplements: Nutritional supplements with per-serving data
 * - Water: Hydration tracking with various units (ml, l, cup, glass)
 * 
 * Features:
 * - Dynamic form fields based on entry type
 * - Autocomplete for item selection
 * - Unit validation and conversion
 * - Recipe ingredient management
 * - Time and notes entry
 */

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { Ingredient, Recipe, Supplement } from '../types';

/**
 * Form data interface for entry creation
 * Water entries use item_id=1 by convention
 */
interface FormData {
  type: 'ingredient' | 'recipe' | 'supplement' | 'water';
  item_id: number;                           // ID of the selected item (1 for water)
  quantity: number;                          // Amount/quantity
  unit: string;                              // Unit of measurement
  entry_time: string;                        // Time of consumption (HH:mm format)
  notes: string;                             // Optional notes
}

/**
 * Recipe ingredient interface for recipe management
 */
interface RecipeIngredient {
  id: number;                                // Ingredient mapping ID
  ingredient_id: number;                     // Reference to ingredient
  ingredient_name: string;                   // Display name
  quantity: number;                          // Amount in recipe
  unit: string;                              // Unit of measurement
}

/**
 * Props interface for AddEntryModal component
 */
interface AddEntryModalProps {
  open: boolean;                             // Modal open state
  onClose: () => void;                       // Close handler
  onSubmit: () => void;                      // Form submission handler
  formData: FormData;                        // Current form data
  setFormData: (data: FormData) => void;     // Form data setter
  ingredients: Ingredient[];                 // Available ingredients
  recipes: Recipe[];                         // Available recipes
  supplements: Supplement[];                 // Available supplements
  recipeIngredients: RecipeIngredient[];     // Current recipe ingredients
  editableIngredients: RecipeIngredient[];   // Editable recipe ingredients
  setEditableIngredients: (ingredients: RecipeIngredient[]) => void; // Recipe ingredient setter
  onRecipeSelect: (recipeId: number) => void;
  onResetRecipeIngredients: () => void;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
  ingredients,
  recipes,
  supplements,
  recipeIngredients,
  editableIngredients,
  setEditableIngredients,
  onRecipeSelect,
  onResetRecipeIngredients,
}) => {
  const getItemOptions = (): (Ingredient | Recipe | Supplement)[] => {
    switch (formData.type) {
      case 'ingredient':
        return ingredients;
      case 'recipe':
        return recipes;
      case 'supplement':
        return supplements;
      case 'water':
        return []; // Water doesn't need item selection
      default:
        return [];
    }
  };

  const selectedItem = getItemOptions().find(item => item.id === formData.item_id) || null;

  const getValidUnitOptions = () => {
    const options = [];
    
    if (formData.type === 'ingredient') {
      // Limited to g and kg only as per todo requirement
      options.push(
        { value: 'g', label: 'Grams (g)' },
        { value: 'kg', label: 'Kilograms (kg)' }
      );
    } else if (formData.type === 'recipe') {
      options.push(
        { value: 'serving', label: 'Serving' },
      );
    } else if (formData.type === 'supplement') {
      if (selectedItem) {
        const supplement = selectedItem as Supplement;
        // Limit to tablet form only as per todo requirement
        if (supplement.form === 'tablet') {
          options.push(
            { value: 'tablet', label: 'Tablet' }
          );
        } else {
          // For non-tablet supplements, use original serving unit
          const servingUnit = supplement.serving_unit || 'serving';
          options.push(
            { value: servingUnit, label: supplement.serving_unit || 'Serving' }
          );
        }
      } else {
        options.push({ value: 'serving', label: 'Serving' });
      }
    } else if (formData.type === 'water') {
      options.push(
        { value: 'ml', label: 'Milliliters (ml)' },
        { value: 'l', label: 'Liters (l)' },
        { value: 'cup', label: 'Cups' },
        { value: 'glass', label: 'Glass (250ml)' }
      );
    }
    
    return options;
  };

  const validOptions = getValidUnitOptions();
  const isCurrentUnitValid = validOptions.some(option => option.value === formData.unit);

  // Auto-fix invalid unit values
  useEffect(() => {
    if (!isCurrentUnitValid && validOptions.length > 0) {
      setFormData({
        ...formData,
        unit: validOptions[0].value
      });
    }
  }, [formData.type, formData.item_id, isCurrentUnitValid]);

  const handleTypeChange = (newType: 'ingredient' | 'recipe' | 'supplement' | 'water') => {
    let defaultUnit = 'g'; // Default to grams for ingredients
    let defaultQuantity = 1;
    
    if (newType === 'recipe') {
      defaultUnit = 'serving';
    } else if (newType === 'supplement') {
      defaultUnit = 'tablet'; // Default to tablet for supplements
    } else if (newType === 'water') {
      defaultUnit = 'ml';
      defaultQuantity = 250; // Default to 250ml (standard glass)
    }
    
    const newFormData = {
      ...formData,
      type: newType,
      item_id: newType === 'water' ? 1 : 0, // Set item_id to 1 for water, 0 for others
      unit: defaultUnit,
      quantity: defaultQuantity
    };
    
    setFormData(newFormData);
    onResetRecipeIngredients();
  };

  const handleItemChange = async (value: Ingredient | Recipe | Supplement | null) => {
    let defaultUnit = 'g';
    if (formData.type === 'supplement' && value) {
      defaultUnit = (value as Supplement).serving_unit || 'serving';
    } else if (formData.type === 'recipe') {
      defaultUnit = 'serving';
    }

    setFormData({
      ...formData,
      item_id: value?.id || 0,
      unit: defaultUnit,
      quantity: formData.type === 'recipe' ? 1 : formData.quantity
    });

    // If a recipe is selected, fetch its ingredients
    if (formData.type === 'recipe' && value?.id) {
      await onRecipeSelect(value.id);
    } else {
      onResetRecipeIngredients();
    }
  };

  const handleIngredientQuantityChange = (index: number, quantity: number) => {
    const newIngredients = [...editableIngredients];
    newIngredients[index].quantity = quantity;
    setEditableIngredients(newIngredients);
  };

  const handleIngredientUnitChange = (index: number, unit: string) => {
    const newIngredients = [...editableIngredients];
    newIngredients[index].unit = unit;
    setEditableIngredients(newIngredients);
  };

  // Auto-scale recipe ingredients when serving quantity changes
  useEffect(() => {
    if (formData.type === 'recipe' && recipeIngredients.length > 0 && formData.item_id > 0) {
      const recipe = getItemOptions().find(item => item.id === formData.item_id) as Recipe | undefined;
      if (recipe) {
        const servingMultiplier = formData.quantity / recipe.servings;
        const scaledIngredients = recipeIngredients.map(ingredient => ({
          ...ingredient,
          quantity: Math.round((ingredient.quantity * servingMultiplier) * 100) / 100 // Round to 2 decimal places
        }));
        setEditableIngredients(scaledIngredients);
      }
    }
  }, [formData.quantity, formData.type, formData.item_id, recipeIngredients]);

  const rescaleIngredients = () => {
    if (formData.type === 'recipe' && recipeIngredients.length > 0 && formData.item_id > 0) {
      const recipe = getItemOptions().find(item => item.id === formData.item_id) as Recipe | undefined;
      if (recipe) {
        const servingMultiplier = formData.quantity / recipe.servings;
        const scaledIngredients = recipeIngredients.map(ingredient => ({
          ...ingredient,
          quantity: Math.round((ingredient.quantity * servingMultiplier) * 100) / 100
        }));
        setEditableIngredients(scaledIngredients);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Entry</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => handleTypeChange(e.target.value as any)}
              >
                <MenuItem value="ingredient">Ingredient</MenuItem>
                <MenuItem value="recipe">Recipe</MenuItem>
                <MenuItem value="supplement">Supplement</MenuItem>
                <MenuItem value="water">Water</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Item Selection - Hide for water */}
          {formData.type !== 'water' && (
            <Grid item xs={12}>
              <Autocomplete<Ingredient | Recipe | Supplement>
                key={formData.type} // Force re-render when type changes
                options={getItemOptions()}
                getOptionLabel={(option) => option.name}
                value={selectedItem}
                onChange={(_, value) => handleItemChange(value)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label={`Select ${formData.type}`} required />
                )}
              />
            </Grid>
          )}
          
          {/* Water Information - Show for water only */}
          {formData.type === 'water' && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                💧 Adding water to your daily intake
              </Typography>
            </Grid>
          )}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={formData.type === 'recipe' ? 'Servings' : formData.type === 'water' ? 'Amount' : 'Quantity'}
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth key={`unit-${formData.type}-${formData.item_id}`}>
              <InputLabel>Size/Unit</InputLabel>
              <Select
                value={isCurrentUnitValid ? formData.unit : (validOptions[0]?.value || '')}
                label="Size/Unit"
                onChange={(e) => {
                  console.log('Unit changed to:', e.target.value);
                  setFormData({ ...formData, unit: e.target.value });
                }}
                required
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                }}
              >
                {validOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Recipe Ingredients List */}
          {formData.type === 'recipe' && recipeIngredients.length > 0 && (
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">
                  Recipe Ingredients
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={rescaleIngredients}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Rescale to {formData.quantity} serving{formData.quantity !== 1 ? 's' : ''}
                </Button>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The following ingredients will be added to your intake (adjust quantities as needed):
              </Typography>
              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {editableIngredients.map((ingredient, index) => (
                  <ListItem key={ingredient.id} divider>
                    <ListItemText
                      primary={ingredient.ingredient_name}
                      secondary={
                        <Box display="flex" gap={2} mt={1}>
                          <TextField
                            size="small"
                            label="Quantity"
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientQuantityChange(index, parseFloat(e.target.value) || 0)}
                            sx={{ width: 100 }}
                          />
                          <TextField
                            size="small"
                            label="Unit"
                            value={ingredient.unit}
                            onChange={(e) => handleIngredientUnitChange(index, e.target.value)}
                            sx={{ width: 80 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Time"
              type="time"
              value={formData.entry_time}
              onChange={(e) => setFormData({ ...formData, entry_time: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes (optional)"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onSubmit} 
          variant="contained" 
          disabled={formData.type !== 'water' && !formData.item_id}
        >
          Add Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEntryModal;
