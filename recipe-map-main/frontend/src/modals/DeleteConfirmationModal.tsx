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
  LocalDining,
  Restaurant,
  Medication,
} from '@mui/icons-material';
import { IntakeEntry } from '../types';

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entry: IntakeEntry | null;
}

/**
 * Modal component for confirming deletion of individual intake entries
 * Shows entry details and requires user confirmation before deletion
 */
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  entry,
}) => {
  const theme = useTheme();

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'ingredient':
        return <LocalDining />;
      case 'recipe':
        return <Restaurant />;
      case 'supplement':
        return <Medication />;
      default:
        return <LocalDining />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ingredient':
        return 'primary';
      case 'recipe':
        return 'secondary';
      case 'supplement':
        return 'success';
      default:
        return 'default';
    }
  };

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
            Delete Entry
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        {entry && (
          <Box>
            <Typography variant="body1" mb={2}>
              Are you sure you want to delete this entry?
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
                    bgcolor: `${getTypeColor(entry.type)}.main`,
                    width: 32,
                    height: 32
                  }}
                >
                  {getItemIcon(entry.type)}
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {entry.item_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.quantity} {entry.unit}
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <Typography variant="body2" color="text.secondary" mt={2}>
              This action cannot be undone.
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
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
