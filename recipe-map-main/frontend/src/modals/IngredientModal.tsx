/**
 * Ingredient Modal Component
 * 
 * Comprehensive modal dialog for creating and editing ingredients.
 * Manages complete ingredient nutrition data including:
 * - Basic information (name, brand, description, category, unit)
 * - Macronutrients (calories, protein, carbs, fats, fiber, sugar)
 * - Vitamins (A, C, D, E, K, B-complex vitamins)
 * - Minerals (calcium, iron, magnesium, potassium, zinc, etc.)
 * - Trace elements (selenium, fluoride, molybdenum, cobalt)
 * - Other nutrients (water content)
 * 
 * Features:
 * - Full-screen mobile experience with responsive design
 * - Organized sections for different nutrient categories
 * - Proper field validation and number input handling
 * - Responsive grid layout that adapts to screen size
 * - Per-100g nutrition data entry standard
 * 
 * @component
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Ingredient } from '../types';

/**
 * Props interface for IngredientModal component
 */
interface IngredientModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Whether we're editing (true) or creating (false) */
  editMode: boolean;
  /** Current ingredient form data */
  ingredientForm: Partial<Ingredient>;
  /** Close modal handler */
  onClose: () => void;
  /** Save ingredient handler */
  onSave: () => void;
  /** Field change handler */
  onChange: (field: keyof Ingredient, value: any) => void;
  /** Whether save button should be enabled */
  canSave: boolean;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
  open,
  editMode,
  ingredientForm,
  onClose,
  onSave,
  onChange,
  canSave,
}) => {
  // Responsive design detection
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
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
        {editMode ? 'Edit' : 'Add'} Ingredient
      </DialogTitle>
      <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
        <Grid container spacing={isMobile ? 1.5 : 2} sx={{ mt: 1 }}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={ingredientForm.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Brand"
              value={ingredientForm.brand || ''}
              onChange={(e) => onChange('brand', e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={isMobile ? 2 : 2}
              value={ingredientForm.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Category"
              value={ingredientForm.category || ''}
              onChange={(e) => onChange('category', e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Unit"
              value={ingredientForm.unit || ''}
              onChange={(e) => onChange('unit', e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          {/* Macronutrients */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Macronutrients (per 100g)
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={ingredientForm.calories_per_100g || ''}
              onChange={(e) => onChange('calories_per_100g', parseFloat(e.target.value) || 0)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              value={ingredientForm.protein_per_100g || ''}
              onChange={(e) => onChange('protein_per_100g', parseFloat(e.target.value) || 0)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Carbs (g)"
              type="number"
              value={ingredientForm.carbs_per_100g || ''}
              onChange={(e) => onChange('carbs_per_100g', parseFloat(e.target.value) || 0)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Fat (g)"
              type="number"
              value={ingredientForm.fat_per_100g || ''}
              onChange={(e) => onChange('fat_per_100g', parseFloat(e.target.value) || 0)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          {/* Fat Breakdown */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Saturated Fat (g)"
              type="number"
              value={ingredientForm.saturated_fat_per_100g || ''}
              onChange={(e) => onChange('saturated_fat_per_100g', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Unsaturated Fat (g)"
              type="number"
              value={ingredientForm.unsaturated_fat_per_100g || ''}
              onChange={(e) => onChange('unsaturated_fat_per_100g', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Polyunsaturated Fat (g)"
              type="number"
              value={ingredientForm.polyunsaturated_fat_per_100g || ''}
              onChange={(e) => onChange('polyunsaturated_fat_per_100g', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>

          {/* Other Macronutrients */}
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Fiber (g)"
              type="number"
              value={ingredientForm.fiber_per_100g || ''}
              onChange={(e) => onChange('fiber_per_100g', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Sugar (g)"
              type="number"
              value={ingredientForm.sugar_per_100g || ''}
              onChange={(e) => onChange('sugar_per_100g', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Sodium (mg)"
              type="number"
              value={ingredientForm.sodium_per_100g || ''}
              onChange={(e) => onChange('sodium_per_100g', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          {/* Vitamins */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Vitamins (per 100g)
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin A (μg)"
              type="number"
              value={ingredientForm.vitamin_a_per_100g || ''}
              onChange={(e) => onChange('vitamin_a_per_100g', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin C (mg)"
              type="number"
              value={ingredientForm.vitamin_c_per_100g || ''}
              onChange={(e) => onChange('vitamin_c_per_100g', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin D (μg)"
              type="number"
              value={ingredientForm.vitamin_d_per_100g || ''}
              onChange={(e) => onChange('vitamin_d_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin E (mg)"
              type="number"
              value={ingredientForm.vitamin_e_per_100g || ''}
              onChange={(e) => onChange('vitamin_e_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin K (μg)"
              type="number"
              value={ingredientForm.vitamin_k_per_100g || ''}
              onChange={(e) => onChange('vitamin_k_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Thiamine/B1 (mg)"
              type="number"
              value={ingredientForm.thiamine_per_100g || ''}
              onChange={(e) => onChange('thiamine_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Riboflavin/B2 (mg)"
              type="number"
              value={ingredientForm.riboflavin_per_100g || ''}
              onChange={(e) => onChange('riboflavin_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Niacin/B3 (mg)"
              type="number"
              value={ingredientForm.niacin_per_100g || ''}
              onChange={(e) => onChange('niacin_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin B6 (mg)"
              type="number"
              value={ingredientForm.vitamin_b6_per_100g || ''}
              onChange={(e) => onChange('vitamin_b6_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Folate (μg)"
              type="number"
              value={ingredientForm.folate_per_100g || ''}
              onChange={(e) => onChange('folate_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin B12 (μg)"
              type="number"
              value={ingredientForm.vitamin_b12_per_100g || ''}
              onChange={(e) => onChange('vitamin_b12_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          
          {/* Minerals */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Minerals (per 100g)</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Calcium (mg)"
              type="number"
              value={ingredientForm.calcium_per_100g || ''}
              onChange={(e) => onChange('calcium_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Iron (mg)"
              type="number"
              value={ingredientForm.iron_per_100g || ''}
              onChange={(e) => onChange('iron_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Magnesium (mg)"
              type="number"
              value={ingredientForm.magnesium_per_100g || ''}
              onChange={(e) => onChange('magnesium_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Phosphorus (mg)"
              type="number"
              value={ingredientForm.phosphorus_per_100g || ''}
              onChange={(e) => onChange('phosphorus_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Potassium (mg)"
              type="number"
              value={ingredientForm.potassium_per_100g || ''}
              onChange={(e) => onChange('potassium_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Zinc (mg)"
              type="number"
              value={ingredientForm.zinc_per_100g || ''}
              onChange={(e) => onChange('zinc_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Chloride (mg)"
              type="number"
              value={ingredientForm.chloride_per_100g || ''}
              onChange={(e) => onChange('chloride_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Sulfur (mg)"
              type="number"
              value={ingredientForm.sulfur_per_100g || ''}
              onChange={(e) => onChange('sulfur_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Iodine (μg)"
              type="number"
              value={ingredientForm.iodine_per_100g || ''}
              onChange={(e) => onChange('iodine_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Copper (mg)"
              type="number"
              value={ingredientForm.copper_per_100g || ''}
              onChange={(e) => onChange('copper_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Chromium (μg)"
              type="number"
              value={ingredientForm.chromium_per_100g || ''}
              onChange={(e) => onChange('chromium_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Manganese (mg)"
              type="number"
              value={ingredientForm.manganese_per_100g || ''}
              onChange={(e) => onChange('manganese_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Selenium (μg)"
              type="number"
              value={ingredientForm.selenium_per_100g || ''}
              onChange={(e) => onChange('selenium_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Fluoride (mg)"
              type="number"
              value={ingredientForm.fluoride_per_100g || ''}
              onChange={(e) => onChange('fluoride_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Molybdenum (μg)"
              type="number"
              value={ingredientForm.molybdenum_per_100g || ''}
              onChange={(e) => onChange('molybdenum_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Cobalt (μg)"
              type="number"
              value={ingredientForm.cobalt_per_100g || ''}
              onChange={(e) => onChange('cobalt_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
          
          {/* Other Nutrients */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Other Nutrients (per 100g)
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Water (ml)"
              type="number"
              value={ingredientForm.water_per_100g || ''}
              onChange={(e) => onChange('water_per_100g', parseFloat(e.target.value) || 0)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: isMobile ? 2 : 3, py: isMobile ? 1.5 : 2, gap: 1 }}>
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

export default IngredientModal;
