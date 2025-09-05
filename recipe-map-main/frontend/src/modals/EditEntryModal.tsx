/**
 * Edit Entry Modal Component
 * 
 * Modal dialog for editing existing nutrition intake entries.
 * Allows users to modify:
 * - Quantity/amount consumed
 * - Unit of measurement
 * - Entry time (when consumed)
 * - Additional notes
 * 
 * Features:
 * - Simple form with essential editing fields
 * - Responsive layout for mobile and desktop
 * - Type-specific field labels (amount for water, quantity for others)
 * - Real-time form validation
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
  TextField,
} from '@mui/material';

/**
 * Form data interface for entry editing
 */
interface FormData {
  type: 'ingredient' | 'recipe' | 'supplement' | 'water';
  item_id: number;
  quantity: number;
  unit: string;
  entry_time: string;
  notes: string;
}

/**
 * Props interface for EditEntryModal component
 */
interface EditEntryModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Close modal handler */
  onClose: () => void;
  /** Submit changes handler */
  onSubmit: () => void;
  /** Current form data */
  formData: FormData;
  /** Form data setter */
  setFormData: (data: FormData) => void;
}

/**
 * Modal component for editing existing intake entries
 * Provides a simple form for modifying entry details
 */
const EditEntryModal: React.FC<EditEntryModalProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Entry</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Quantity/Amount Field */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={formData.type === 'water' ? 'Amount' : 'Quantity'}
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
            />
          </Grid>
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
        <Button onClick={onSubmit} variant="contained">
          Update Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEntryModal;
