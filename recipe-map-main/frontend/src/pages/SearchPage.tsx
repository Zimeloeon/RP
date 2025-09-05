
/**
 * Search Page Component
 * 
 * Comprehensive recipe search and discovery interface.
 * Features:
 * - Advanced recipe filtering by name, category, and ingredients
 * - Responsive grid layout for recipe display
 * - Detailed recipe modal with ingredients and instructions
 * - Real-time search with debouncing
 * - Category and ingredient autocomplete
 * - Loading states and error handling
 * 
 * The page serves as the main discovery interface for users to find
 * recipes they want to add to their nutrition tracking.
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { recipeService, ingredientService } from '../services';
import { Recipe, Ingredient } from '../types';
import RecipeSearchFilters from '../components/search/RecipeSearchFilters';
import RecipeGrid from '../components/search/RecipeGrid';
import RecipeDetailsModal from '../components/search/RecipeDetailsModal';

/**
 * SearchPage Component
 * 
 * Provides a comprehensive recipe search interface with filtering capabilities.
 * Users can search and filter recipes by name, category, and ingredients.
 * 
 * Key Features:
 * - Text-based recipe search with real-time filtering
 * - Category and ingredient-based filtering
 * - Recipe grid display with hover effects and actions
 * - Detailed recipe modal view with nutrition information
 * - Responsive design for mobile and desktop
 * - Loading states and error handling
 * 
 * State Management:
 * - Recipe data and loading states
 * - Search form state and applied filters
 * - Modal state for recipe details
 * - Categories and ingredients data for filter options
 */
const SearchPage: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /** Recipe data and loading state */
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  
  /** Available filter options loaded from API */
  const [categories, setCategories] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  
  /** Recipe details modal state */
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);

  /** Search form state and filters */
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');

  /** Applied filters for display */
  const [appliedFilters, setAppliedFilters] = useState<{
    search: string;
    category: string;
    ingredient: string;
  }>({
    search: '',
    category: '',
    ingredient: '',
  });

  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================
  
  useEffect(() => {
    fetchCategories();
    fetchIngredients();
    fetchRecipes(); // Load all recipes initially
  }, []);

  // ============================================================================
  // DATA FETCHING FUNCTIONS
  // ============================================================================
  
  /**
   * Fetch available recipe categories
   */
  const fetchCategories = async () => {
    try {
      const data = await recipeService.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  /**
   * Fetch available ingredients for filtering
   */
  const fetchIngredients = async () => {
    try {
      const data = await ingredientService.getAll({ limit: 1000 });
      setIngredients(data);
    } catch (error) {
      toast.error('Failed to fetch ingredients');
    }
  };

  /**
   * Fetch recipes with optional filters
   */
  const fetchRecipes = async (filters?: {
    search?: string;
    category?: string;
    ingredient?: string;
  }) => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      
      if (filters?.search) params.search = filters.search;
      if (filters?.category) params.category = filters.category;
      if (filters?.ingredient) params.ingredient = filters.ingredient;

      const data = await recipeService.getAll(params);
      setRecipes(data);
      
      // Update applied filters for display
      setAppliedFilters({
        search: filters?.search || '',
        category: filters?.category || '',
        ingredient: filters?.ingredient || '',
      });
    } catch (error) {
      toast.error('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle search button click
   */
  const handleSearch = () => {
    const filters = {
      search: searchTerm.trim(),
      category: selectedCategory,
      ingredient: selectedIngredient,
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key as keyof typeof filters]) {
        delete filters[key as keyof typeof filters];
      }
    });

    fetchRecipes(filters);
  };

  /**
   * Clear all search filters and reload recipes
   */
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedIngredient('');
    setAppliedFilters({ search: '', category: '', ingredient: '' });
    fetchRecipes(); // Fetch all recipes
  };

  /**
   * Remove a specific filter and update search
   */
  const removeFilter = (filterType: string) => {
    const newFilters = { ...appliedFilters };
    newFilters[filterType as keyof typeof appliedFilters] = '';

    // Also update the form state
    if (filterType === 'search') setSearchTerm('');
    if (filterType === 'category') setSelectedCategory('');
    if (filterType === 'ingredient') setSelectedIngredient('');

    // Remove empty filters before making the API call
    const cleanFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as any);

    fetchRecipes(Object.keys(cleanFilters).length > 0 ? cleanFilters : undefined);
  };

  /**
   * Handle recipe card click to open details modal
   */
  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setRecipeDialogOpen(true);
  };

  /**
   * Close recipe details modal
   */
  const handleCloseRecipeDialog = () => {
    setRecipeDialogOpen(false);
    setSelectedRecipe(null);
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Page Header */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Recipe Search
      </Typography>

      {/* Search Filters Component */}
      <RecipeSearchFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedIngredient={selectedIngredient}
        onIngredientChange={setSelectedIngredient}
        categories={categories}
        ingredients={ingredients}
        appliedFilters={appliedFilters}
        loading={loading}
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
        onRemoveFilter={removeFilter}
      />

      {/* Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {loading ? 'Searching...' : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} found`}
        </Typography>
      </Box>

      {/* Recipe Grid Component */}
      <RecipeGrid
        recipes={recipes}
        loading={loading}
        onRecipeClick={handleRecipeClick}
      />

      {/* Recipe Details Modal Component */}
      <RecipeDetailsModal
        open={recipeDialogOpen}
        onClose={handleCloseRecipeDialog}
        recipe={selectedRecipe}
      />
    </Box>
  );
};

export default SearchPage;
