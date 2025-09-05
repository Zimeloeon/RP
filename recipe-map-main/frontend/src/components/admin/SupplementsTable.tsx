import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  Card,
  CardContent,
  Box,
  Typography,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Supplement } from '../../types';

interface SupplementsTableProps {
  /** Array of supplements to display in the table */
  supplements: Supplement[];
  /** Whether to render in mobile-optimized view */
  isMobile: boolean;
  /** Callback function called when edit button is clicked */
  onEdit: (supplement: Supplement) => void;
  /** Callback function called when delete button is clicked */
  onDelete: (supplementId: number) => void;
}

/**
 * SupplementsTable Component
 * 
 * A responsive table component that displays supplements with their details.
 * Automatically switches between card layout (mobile) and table layout (desktop).
 * Provides edit and delete actions for each supplement.
 */
const SupplementsTable: React.FC<SupplementsTableProps> = ({
  supplements,
  isMobile,
  onEdit,
  onDelete,
}) => {
  // Mobile card layout for better touch interaction
  if (isMobile) {
    return (
      <Stack spacing={1}>
        {supplements.map((supplement: Supplement) => (
          <Card key={supplement.id} variant="outlined" sx={{ 
            borderRadius: 1,
            '& .MuiCardContent-root': { 
              padding: '8px !important',
              '&:last-child': { paddingBottom: '8px !important' }
            }
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                  {/* Supplement name */}
                  <Typography 
                    variant="subtitle2" 
                    component="div" 
                    sx={{ 
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {supplement.name}
                  </Typography>
                  
                  {/* Brand name (optional) */}
                  {supplement.brand && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.75rem',
                        lineHeight: 1,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {supplement.brand}
                    </Typography>
                  )}
                  
                  {/* Form and serving size info */}
                  <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap" alignItems="center">
                    <Chip 
                      label={supplement.form} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.65rem',
                        '& .MuiChip-label': { px: 0.5 }
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.65rem',
                        alignSelf: 'center'
                      }}
                    >
                      {supplement.serving_size} {supplement.serving_unit}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Action buttons */}
                <Box display="flex" flexDirection="column" gap={0.25}>
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(supplement)}
                    sx={{ padding: '2px', minWidth: 24, height: 24 }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => onDelete(supplement.id)} 
                    color="error"
                    sx={{ padding: '2px', minWidth: 24, height: 24 }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  // Desktop table layout for comprehensive data view
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Form</TableCell>
            <TableCell>Serving Size</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {supplements.map((supplement: Supplement) => (
            <TableRow key={supplement.id}>
              <TableCell>{supplement.name}</TableCell>
              <TableCell>{supplement.brand || '-'}</TableCell>
              <TableCell>
                <Chip label={supplement.form} size="small" />
              </TableCell>
              <TableCell>{supplement.serving_size} {supplement.serving_unit}</TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => onEdit(supplement)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(supplement.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SupplementsTable;
