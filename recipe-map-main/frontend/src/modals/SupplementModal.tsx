/**
 * Supplement Modal Component
 * 
 * Modal dialog for creating and editing nutritional supplements.
 * Manages supplement data including:
 * - Basic information (name, brand, description)
 * - Nutritional serving details (form, size, unit)
 * - Responsive mobile/desktop layout
 * - Form validation and submission
 * 
 * Features:
 * - Full-screen mobile experience
 * - Responsive form fields and sizing
 * - Support for various supplement forms (tablet, capsule, powder, liquid)
 * - Dynamic form validation with save state management
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Supplement } from '../types';

/**
 * Props interface for SupplementModal component
 */
interface SupplementModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Whether we're editing (true) or creating (false) */
  editMode: boolean;
  /** Current supplement form data */
  supplementForm: Partial<Supplement>;
  /** Close modal handler */
  onClose: () => void;
  /** Save supplement handler */
  onSave: () => void;
  /** Field change handler */
  onChange: (field: keyof Supplement, value: any) => void;
  /** Whether save button should be enabled */
  canSave: boolean;
}

const SupplementModal: React.FC<SupplementModalProps> = ({
  open,
  editMode,
  supplementForm,
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
        {editMode ? 'Edit' : 'Add'} Supplement
      </DialogTitle>
      <DialogContent sx={{ px: isMobile ? 2 : 3 }}>
        <Grid container spacing={isMobile ? 1.5 : 2} sx={{ mt: 1 }}>
          {/* Basic Information Section */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={supplementForm.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Brand"
              value={supplementForm.brand || ''}
              onChange={(e) => onChange('brand', e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={2}
              value={supplementForm.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            <FormControl fullWidth required size={isMobile ? "small" : "medium"}>
              <InputLabel>Form</InputLabel>
              <Select
                value={supplementForm.form || ''}
                label="Form"
                onChange={(e) => onChange('form', e.target.value as any)}
              >
                <MenuItem value="tablet">Tablet</MenuItem>
                <MenuItem value="capsule">Capsule</MenuItem>
                <MenuItem value="powder">Powder</MenuItem>
                <MenuItem value="liquid">Liquid</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={4}>
            <TextField
              fullWidth
              label="Serving Size"
              type="number"
              value={supplementForm.serving_size || ''}
              onChange={(e) => onChange('serving_size', parseFloat(e.target.value) || 0)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Serving Unit"
              value={supplementForm.serving_unit || ''}
              onChange={(e) => onChange('serving_unit', e.target.value)}
              required
              size={isMobile ? "small" : "medium"}
            />
          </Grid>

          {/* Basic Nutrients */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Nutrients (per serving)
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Calories"
              type="number"
              value={supplementForm.calories_per_serving || ''}
              onChange={(e) => onChange('calories_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Protein (g)"
              type="number"
              value={supplementForm.protein_per_serving || ''}
              onChange={(e) => onChange('protein_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Total Fat (g)"
              type="number"
              value={supplementForm.fat_per_serving || ''}
              onChange={(e) => onChange('fat_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          {/* Vitamins */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>Vitamins (per serving)</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin A (μg)"
              type="number"
              value={supplementForm.vitamin_a_per_serving || ''}
              onChange={(e) => onChange('vitamin_a_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin C (mg)"
              type="number"
              value={supplementForm.vitamin_c_per_serving || ''}
              onChange={(e) => onChange('vitamin_c_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin D (μg)"
              type="number"
              value={supplementForm.vitamin_d_per_serving || ''}
              onChange={(e) => onChange('vitamin_d_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin E (mg)"
              type="number"
              value={supplementForm.vitamin_e_per_serving || ''}
              onChange={(e) => onChange('vitamin_e_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin K (μg)"
              type="number"
              value={supplementForm.vitamin_k_per_serving || ''}
              onChange={(e) => onChange('vitamin_k_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Thiamine/B1 (mg)"
              type="number"
              value={supplementForm.thiamine_per_serving || ''}
              onChange={(e) => onChange('thiamine_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Riboflavin/B2 (mg)"
              type="number"
              value={supplementForm.riboflavin_per_serving || ''}
              onChange={(e) => onChange('riboflavin_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Niacin/B3 (mg)"
              type="number"
              value={supplementForm.niacin_per_serving || ''}
              onChange={(e) => onChange('niacin_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin B6 (mg)"
              type="number"
              value={supplementForm.vitamin_b6_per_serving || ''}
              onChange={(e) => onChange('vitamin_b6_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Folate (μg)"
              type="number"
              value={supplementForm.folate_per_serving || ''}
              onChange={(e) => onChange('folate_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Vitamin B12 (μg)"
              type="number"
              value={supplementForm.vitamin_b12_per_serving || ''}
              onChange={(e) => onChange('vitamin_b12_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          {/* Minerals */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>Minerals (per serving)</Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Calcium (mg)"
              type="number"
              value={supplementForm.calcium_per_serving || ''}
              onChange={(e) => onChange('calcium_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Iron (mg)"
              type="number"
              value={supplementForm.iron_per_serving || ''}
              onChange={(e) => onChange('iron_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Magnesium (mg)"
              type="number"
              value={supplementForm.magnesium_per_serving || ''}
              onChange={(e) => onChange('magnesium_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Phosphorus (mg)"
              type="number"
              value={supplementForm.phosphorus_per_serving || ''}
              onChange={(e) => onChange('phosphorus_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Potassium (mg)"
              type="number"
              value={supplementForm.potassium_per_serving || ''}
              onChange={(e) => onChange('potassium_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Zinc (mg)"
              type="number"
              value={supplementForm.zinc_per_serving || ''}
              onChange={(e) => onChange('zinc_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Sodium (mg)"
              type="number"
              value={supplementForm.sodium_per_serving || ''}
              onChange={(e) => onChange('sodium_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Chloride (mg)"
              type="number"
              value={supplementForm.chloride_per_serving || ''}
              onChange={(e) => onChange('chloride_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Sulfur (mg)"
              type="number"
              value={supplementForm.sulfur_per_serving || ''}
              onChange={(e) => onChange('sulfur_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Iodine (μg)"
              type="number"
              value={supplementForm.iodine_per_serving || ''}
              onChange={(e) => onChange('iodine_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Copper (mg)"
              type="number"
              value={supplementForm.copper_per_serving || ''}
              onChange={(e) => onChange('copper_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Chromium (μg)"
              type="number"
              value={supplementForm.chromium_per_serving || ''}
              onChange={(e) => onChange('chromium_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Manganese (mg)"
              type="number"
              value={supplementForm.manganese_per_serving || ''}
              onChange={(e) => onChange('manganese_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Selenium (μg)"
              type="number"
              value={supplementForm.selenium_per_serving || ''}
              onChange={(e) => onChange('selenium_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Fluoride (mg)"
              type="number"
              value={supplementForm.fluoride_per_serving || ''}
              onChange={(e) => onChange('fluoride_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Molybdenum (μg)"
              type="number"
              value={supplementForm.molybdenum_per_serving || ''}
              onChange={(e) => onChange('molybdenum_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Cobalt (μg)"
              type="number"
              value={supplementForm.cobalt_per_serving || ''}
              onChange={(e) => onChange('cobalt_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          {/* Other Nutrients */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Other Nutrients (per serving)
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <TextField
              fullWidth
              label="Water (ml)"
              type="number"
              value={supplementForm.water_per_serving || ''}
              onChange={(e) => onChange('water_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          
          {/* Fat Breakdown */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, fontSize: isMobile ? '1rem' : '1.25rem' }}>Fat Breakdown (per serving)</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Saturated Fat (g)"
              type="number"
              value={supplementForm.saturated_fat_per_serving || ''}
              onChange={(e) => onChange('saturated_fat_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Unsaturated Fat (g)"
              type="number"
              value={supplementForm.unsaturated_fat_per_serving || ''}
              onChange={(e) => onChange('unsaturated_fat_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Polyunsaturated Fat (g)"
              type="number"
              value={supplementForm.polyunsaturated_fat_per_serving || ''}
              onChange={(e) => onChange('polyunsaturated_fat_per_serving', parseFloat(e.target.value) || 0)}
              size={isMobile ? "small" : "medium"}
            />
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

export default SupplementModal;
