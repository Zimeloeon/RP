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
import { Recipe } from '../../types';

interface RecipesTableProps {
  /** Array of recipes to display in the table */
  recipes: Recipe[];
  /** Whether to render in mobile-optimized view */
  isMobile: boolean;
  /** Callback function called when edit button is clicked */
  onEdit: (recipe: Recipe) => void;
  /** Callback function called when delete button is clicked */
  onDelete: (recipeId: number) => void;
}

/**
 * RecipesTable Component
 * 
 * A responsive table component that displays recipes with their details.
 * Automatically switches between card layout (mobile) and table layout (desktop).
 * Provides edit and delete actions for each recipe.
 */
const RecipesTable: React.FC<RecipesTableProps> = ({
  recipes,
  isMobile,
  onEdit,
  onDelete,
}) => {
  // Mobile card layout for better touch interaction
  if (isMobile) {
    return (
      <Stack spacing={1}>
        {recipes.map((recipe: Recipe) => (
          <Card key={recipe.id} variant="outlined" sx={{ 
            borderRadius: 1,
            '& .MuiCardContent-root': { 
              padding: '8px !important',
              '&:last-child': { paddingBottom: '8px !important' }
            }
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                  {/* Recipe name */}
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
                    {recipe.name}
                  </Typography>
                  
                  {/* Category and difficulty chips */}
                  <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap" alignItems="center">
                    <Chip 
                      label={recipe.category} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.65rem',
                        '& .MuiChip-label': { px: 0.5 }
                      }} 
                    />
                    {recipe.difficulty && (
                      <Chip 
                        label={recipe.difficulty} 
                        size="small" 
                        color={recipe.difficulty === 'easy' ? 'success' : recipe.difficulty === 'medium' ? 'warning' : 'error'}
                        sx={{ 
                          height: 20, 
                          fontSize: '0.65rem',
                          '& .MuiChip-label': { px: 0.5 }
                        }} 
                      />
                    )}
                  </Box>
                  
                  {/* Servings and prep time info */}
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.65rem',
                      display: 'block',
                      mt: 0.25
                    }}
                  >
                    {recipe.servings} servings
                    {recipe.prep_time && ` • ${recipe.prep_time}min`}
                  </Typography>
                </Box>
                
                {/* Action buttons */}
                <Box display="flex" flexDirection="column" gap={0.25}>
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(recipe)}
                    sx={{ padding: '2px', minWidth: 24, height: 24 }}
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => onDelete(recipe.id)} 
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
            <TableCell>Category</TableCell>
            <TableCell>Servings</TableCell>
            <TableCell>Prep Time</TableCell>
            <TableCell>Difficulty</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipes.map((recipe: Recipe) => (
            <TableRow key={recipe.id}>
              <TableCell>{recipe.name}</TableCell>
              <TableCell>
                <Chip label={recipe.category} size="small" />
              </TableCell>
              <TableCell>{recipe.servings}</TableCell>
              <TableCell>{recipe.prep_time || '-'} min</TableCell>
              <TableCell>
                {recipe.difficulty && (
                  <Chip 
                    label={recipe.difficulty} 
                    size="small" 
                    color={recipe.difficulty === 'easy' ? 'success' : recipe.difficulty === 'medium' ? 'warning' : 'error'}
                  />
                )}
              </TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => onEdit(recipe)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(recipe.id)} color="error">
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

export default RecipesTable;
