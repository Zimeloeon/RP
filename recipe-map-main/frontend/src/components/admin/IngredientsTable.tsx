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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Ingredient } from '../../types';

interface IngredientsTableProps {
  /** Array of ingredients to display in the table */
  ingredients: Ingredient[];
  /** Whether to render in mobile-optimized view */
  isMobile: boolean;
  /** Callback function called when edit button is clicked */
  onEdit: (ingredient: Ingredient) => void;
  /** Callback function called when delete button is clicked */
  onDelete: (id: number) => void;
}

/**
 * IngredientsTable Component
 * 
 * A responsive table component that displays ingredients with their nutritional details.
 * Automatically switches between card layout (mobile) and table layout (desktop).
 * Provides edit and delete actions for each ingredient.
 */
const IngredientsTable: React.FC<IngredientsTableProps> = ({
  ingredients,
  isMobile,
  onEdit,
  onDelete,
}) => {

  if (isMobile) {
    return (
      <Stack spacing={1}>
        {ingredients.map((ingredient) => (
          <Card 
            key={ingredient.id} 
            variant="outlined" 
            sx={{ 
              borderRadius: 1,
              '& .MuiCardContent-root': { 
                padding: '8px !important',
                '&:last-child': { paddingBottom: '8px !important' }
              }
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
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
                    {ingredient.name}
                  </Typography>
                  {ingredient.brand && (
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
                      {ingredient.brand}
                    </Typography>
                  )}
                  <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                    <Chip 
                      label={ingredient.category} 
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
                      {ingredient.calories_per_100g}cal | {ingredient.protein_per_100g}g
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" gap={0.25}>
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(ingredient)}
                    sx={{ padding: '2px', minWidth: 24, height: 24 }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => onDelete(ingredient.id)} 
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Calories/100g</TableCell>
            <TableCell>Protein/100g</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell>{ingredient.name}</TableCell>
              <TableCell>{ingredient.brand || '-'}</TableCell>
              <TableCell>
                <Chip label={ingredient.category} size="small" />
              </TableCell>
              <TableCell>{ingredient.calories_per_100g}</TableCell>
              <TableCell>{ingredient.protein_per_100g}g</TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => onEdit(ingredient)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(ingredient.id)} color="error">
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

export default IngredientsTable;
