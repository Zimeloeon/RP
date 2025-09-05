
import React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterList from '@mui/icons-material/FilterList';
import { Ingredient } from '../../types';

/**
 * Interface for applied filters state
 */
interface AppliedFilters {
  search: string;
  category: string;
  ingredient: string;
}

/**
 * Props for the RecipeSearchFilters component
 */
interface RecipeSearchFiltersProps {
  /** Current search term value */
  searchTerm: string;
  /** Handler for search term changes */
  onSearchTermChange: (value: string) => void;
  /** Currently selected category */
  selectedCategory: string;
  /** Handler for category selection changes */
  onCategoryChange: (value: string) => void;
  /** Currently selected ingredient */
  selectedIngredient: string;
  /** Handler for ingredient selection changes */
  onIngredientChange: (value: string) => void;
  /** Available categories list */
  categories: string[];
  /** Available ingredients list */
  ingredients: Ingredient[];
  /** Currently applied filters for display */
  appliedFilters: AppliedFilters;
  /** Whether search is currently loading */
  loading: boolean;
  /** Handler for performing search */
  onSearch: () => void;
  /** Handler for clearing all filters */
  onClearFilters: () => void;
  /** Handler for removing specific filter */
  onRemoveFilter: (filterType: string) => void;
}

/**
 * RecipeSearchFilters Component
 * 
 * Provides a comprehensive search interface for filtering recipes by:
 * - Text search (recipe name)
 * - Category selection
 * - Ingredient selection
 * 
 * Features:
 * - Active filter display with removal chips
 * - Responsive grid layout
 * - Loading state support
 * - Enter key search functionality
 */
const RecipeSearchFilters: React.FC<RecipeSearchFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onCategoryChange,
  selectedIngredient,
  onIngredientChange,
  categories,
  ingredients,
  appliedFilters,
  loading,
  onSearch,
  onClearFilters,
  onRemoveFilter,
}) => {
  /**
   * Count active filters for display purposes
   */
  const getActiveFiltersCount = () => {
    return Object.values(appliedFilters).filter(Boolean).length;
  };

  /**
   * Handle Enter key press in search field
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Search Form Grid */}
      <Grid container spacing={2} alignItems="center">
        {/* Search Text Field */}
        <Grid item xs={12} lg={4}>
          <TextField
            fullWidth
            label="Search recipes"
            placeholder="Enter recipe name..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        
        {/* Category Filter */}
        <Grid item xs={12} sm={6} lg={2.5}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Ingredient Filter */}
        <Grid item xs={12} sm={6} lg={2.5}>
          <FormControl fullWidth>
            <InputLabel>Ingredient</InputLabel>
            <Select
              value={selectedIngredient}
              label="Ingredient"
              onChange={(e) => onIngredientChange(e.target.value)}
            >
              <MenuItem value="">All Ingredients</MenuItem>
              {ingredients.map((ingredient) => (
                <MenuItem key={ingredient.id} value={ingredient.name}>
                  {ingredient.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} lg={3}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            width: '100%'
          }}>
            <Button
              variant="contained"
              onClick={onSearch}
              startIcon={<SearchIcon />}
              sx={{ 
                flex: 1,
                minHeight: '56px'
              }}
              disabled={loading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              onClick={onClearFilters}
              startIcon={<ClearIcon />}
              sx={{ 
                flex: 1,
                minHeight: '56px'
              }}
              disabled={loading}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Active Filters Display */}
      {getActiveFiltersCount() > 0 && (
        <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <FilterList sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Active filters:
            </Typography>
            
            {appliedFilters.search && (
              <Chip
                label={`Name: "${appliedFilters.search}"`}
                onDelete={() => onRemoveFilter('search')}
                size="small"
                color="primary"
              />
            )}
            
            {appliedFilters.category && (
              <Chip
                label={`Category: ${appliedFilters.category}`}
                onDelete={() => onRemoveFilter('category')}
                size="small"
                color="secondary"
              />
            )}
            
            {appliedFilters.ingredient && (
              <Chip
                label={`Ingredient: ${appliedFilters.ingredient}`}
                onDelete={() => onRemoveFilter('ingredient')}
                size="small"
                color="info"
              />
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default RecipeSearchFilters;
