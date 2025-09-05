/**
 * HomePage Component
 * 
 * Main page for tracking daily nutrition intake with timeline view.
 * Features responsive navigation, entry management, and modal interactions.
 * Supports mobile swipe gestures and desktop/tablet week navigation.
 * 
 * @component
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

// Store imports
import { useAppStore, useThemeStore, useGroceryStore } from '../stores';

// Service imports
import { api } from '../services/api';

// Type imports
import { IntakeEntry, Ingredient, Recipe, Supplement } from '../types';

// Modal imports
import AddEntryModal from '../modals/AddEntryModal';
import EditEntryModal from '../modals/EditEntryModal';
import RecipeInstructionsModal from '../modals/RecipeInstructionsModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import RecipeDeleteConfirmationModal from '../modals/RecipeDeleteConfirmationModal';

// Component imports
import NavigationHeader from '../components/home/NavigationHeader';
import DatePickerDrawer from '../components/home/DatePickerDrawer';
import TimelineContainer from '../components/home/TimelineContainer';
import EmptyTimelineState from '../components/home/EmptyTimelineState';

/**
 * HomePage - Main nutrition tracking page
 * 
 * Provides a timeline interface for tracking daily nutrition intake.
 * Features include:
 * - Responsive date navigation (mobile drawer, desktop week view)
 * - Timeline display with time-grouped entries
 * - Recipe and ingredient entry management
 * - Modal-based editing and deletion
 * - Mobile swipe navigation support
 */
const HomePage: React.FC = () => {
  // Theme and responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Store hooks
  const { selectedDate, setSelectedDate } = useAppStore();
  const { colorScheme } = useThemeStore();
  const { triggerIntakeChange } = useGroceryStore();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Timeline entries and loading state
  const [entries, setEntries] = useState<IntakeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showRecipeInstructions, setShowRecipeInstructions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteRecipeConfirmOpen, setDeleteRecipeConfirmOpen] = useState(false);
  
  // Selected items for modals
  const [selectedEntry, setSelectedEntry] = useState<IntakeEntry | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeIngredients, setSelectedRecipeIngredients] = useState<any[]>([]);
  const [entryToDelete, setEntryToDelete] = useState<IntakeEntry | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<{ name: string; entries: IntakeEntry[] } | null>(null);

  // Form data for entry creation/editing
  const [formData, setFormData] = useState({
    type: 'ingredient' as 'ingredient' | 'recipe' | 'supplement' | 'water',
    item_id: 0,
    quantity: 1,
    unit: 'g',
    entry_time: dayjs().format('HH:mm'),
    notes: '',
  });

  // Recipe ingredients state for recipe entries
  const [recipeIngredients, setRecipeIngredients] = useState<{
    id: number;
    ingredient_id: number;
    ingredient_name: string;
    quantity: number;
    unit: string;
  }[]>([]);
  const [editableIngredients, setEditableIngredients] = useState<{
    id: number;
    ingredient_id: number;
    ingredient_name: string;
    quantity: number;
    unit: string;
  }[]>([]);

  // Autocomplete options
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  useEffect(() => {
    fetchEntries();
    fetchOptions();
  }, [selectedDate]);

  /**
   * Fetch timeline entries for the selected date
   */
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/intake/date/${selectedDate}`);
      setEntries(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch entries');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch autocomplete options for ingredients, recipes, and supplements
   */
  const fetchOptions = async () => {
    try {
      const [ingredientsRes, recipesRes, supplementsRes] = await Promise.all([
        api.get('/ingredients?limit=100'),
        api.get('/recipes?limit=100'),
        api.get('/supplements?limit=100'),
      ]);
      
      setIngredients(ingredientsRes.data.data || []);
      setRecipes(recipesRes.data.data || []);
      setSupplements(supplementsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch options');
    }
  };

  /**
   * Fetch ingredients for a specific recipe
   */
  const fetchRecipeIngredients = async (recipeId: number) => {
    try {
      const response = await api.get(`/recipes/${recipeId}/ingredients`);
      const ingredients = response.data.data || [];
      setRecipeIngredients(ingredients);
      setEditableIngredients(ingredients.map((ing: any) => ({ ...ing })));
    } catch (error) {
      toast.error('Failed to fetch recipe ingredients');
      setRecipeIngredients([]);
      setEditableIngredients([]);
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle date changes from navigation components
   */
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  /**
   * Handle mobile swipe navigation
   */
  const handleSwipeLeft = () => {
    setSelectedDate(dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD'));
  };

  const handleSwipeRight = () => {
    setSelectedDate(dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD'));
  };

  /**
   * Handle recipe instructions modal display
   */
  const handleShowRecipeInstructions = (recipe: Recipe, ingredients: any[]) => {
    setSelectedRecipe(recipe);
    setSelectedRecipeIngredients(ingredients);
    setShowRecipeInstructions(true);
  };

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  /**
   * Handle adding a new entry (ingredient, recipe, or supplement)
   */
  const handleAddEntry = async () => {
    try {
      if (formData.type === 'recipe') {
        // For recipes, create entries for each ingredient individually
        const recipe = recipes.find(r => r.id === formData.item_id);
        if (!recipe) {
          toast.error('Recipe not found');
          return;
        }

        if (editableIngredients.length === 0) {
          toast.error('No ingredients found for this recipe');
          return;
        }

        // editableIngredients are already scaled in the modal, so use them directly
        const newEntries: IntakeEntry[] = [];

        // Create individual entries for each ingredient
        for (const ingredient of editableIngredients) {
          const entryData = {
            type: 'ingredient' as const,
            item_id: ingredient.ingredient_id,
            quantity: ingredient.quantity, // Already scaled in modal
            unit: ingredient.unit,
            entry_date: selectedDate,
            entry_time: formData.entry_time,
            notes: formData.notes.trim() ? `${formData.notes.trim()} (from ${recipe.name})` : `From ${recipe.name}`,
          };

          const response = await api.post('/intake', entryData);
          newEntries.push(response.data.data);
        }

        setEntries([...entries, ...newEntries]);
        toast.success(`Added ${newEntries.length} ingredients from ${recipe.name}`);
        triggerIntakeChange(); // Trigger grocery list update
      } else if (formData.type === 'water') {
        // For water entries, create a simple entry with item_id 1 (generic water)
        const entryData = {
          type: 'water' as const,
          item_id: 1, // Use ID 1 for generic water
          quantity: formData.quantity,
          unit: formData.unit,
          entry_date: selectedDate,
          entry_time: formData.entry_time,
          notes: formData.notes.trim() || null,
        };

        const response = await api.post('/intake', entryData);
        setEntries([...entries, response.data.data]);
        toast.success('Water entry added successfully');
        triggerIntakeChange(); // Trigger grocery list update
      } else {
        // For ingredients and supplements, create single entry
        const entryData = {
          ...formData,
          entry_date: selectedDate,
          notes: formData.notes.trim() || null, // Convert empty string to null
        };

        const response = await api.post('/intake', entryData);
        setEntries([...entries, response.data.data]);
        toast.success('Entry added successfully');
        triggerIntakeChange(); // Trigger grocery list update
      }

      setAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add entry');
    }
  };

  /**
   * Handle editing an existing entry
   */
  const handleEditEntry = async () => {
    if (!selectedEntry) return;

    try {
      const response = await api.put(`/intake/${selectedEntry.id}`, {
        quantity: formData.quantity,
        unit: formData.unit,
        entry_time: formData.entry_time,
        entry_date: selectedEntry.entry_date, // Include the current entry date
        notes: formData.notes.trim() || null, // Convert empty string to null
      });

      setEntries(entries.map(entry => 
        entry.id === selectedEntry.id ? response.data.data : entry
      ));
      toast.success('Entry updated successfully');
      triggerIntakeChange(); // Trigger grocery list update
      setEditDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update entry');
    }
  };

  /**
   * Handle individual entry deletion
   */
  const handleDeleteEntry = (entry: IntakeEntry) => {
    setEntryToDelete(entry);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteEntry = async () => {
    if (!entryToDelete) return;

    try {
      await api.delete(`/intake/${entryToDelete.id}`);
      setEntries(entries.filter(entry => entry.id !== entryToDelete.id));
      toast.success('Entry deleted successfully');
      triggerIntakeChange(); // Trigger grocery list update
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete entry');
    } finally {
      setDeleteConfirmOpen(false);
      setEntryToDelete(null);
    }
  };

  /**
   * Handle recipe deletion (all ingredients from a recipe)
   */
  const handleDeleteRecipe = (recipeName: string, recipeEntries: IntakeEntry[]) => {
    setRecipeToDelete({ name: recipeName, entries: recipeEntries });
    setDeleteRecipeConfirmOpen(true);
  };

  const confirmDeleteRecipe = async () => {
    if (!recipeToDelete) return;

    try {
      // Delete all recipe entries
      await Promise.all(
        recipeToDelete.entries.map(entry => api.delete(`/intake/${entry.id}`))
      );
      
      // Update the entries state by filtering out the deleted entries
      const deletedEntryIds = recipeToDelete.entries.map(entry => entry.id);
      setEntries(entries.filter(entry => !deletedEntryIds.includes(entry.id)));
      
      toast.success(`Deleted all ${recipeToDelete.entries.length} ingredients from ${recipeToDelete.name}`);
      triggerIntakeChange(); // Trigger grocery list update
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete recipe ingredients');
    } finally {
      setDeleteRecipeConfirmOpen(false);
      setRecipeToDelete(null);
    }
  };

  /**
   * Reset form data to initial state
   */
  const resetForm = () => {
    setFormData({
      type: 'ingredient',
      item_id: 0,
      quantity: 1,
      unit: 'g',
      entry_time: dayjs().format('HH:mm'),
      notes: '',
    });
    setSelectedEntry(null);
    setRecipeIngredients([]);
    setEditableIngredients([]);
  };

  /**
   * Open edit dialog with entry data pre-filled
   */
  const openEditDialog = (entry: IntakeEntry) => {
    setSelectedEntry(entry);
    setFormData({
      type: entry.type,
      item_id: entry.item_id,
      quantity: entry.quantity,
      unit: entry.unit,
      entry_time: entry.entry_time,
      notes: entry.notes || '',
    });
    setEditDialogOpen(true);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
      p: 0
    }}>
      {/* Navigation Header */}
      <NavigationHeader
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onOpenDatePicker={() => setShowDatePicker(true)}
      />

      {/* Mobile Date Picker Drawer */}
      <DatePickerDrawer
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onOpen={() => setShowDatePicker(true)}
        selectedDate={selectedDate}
        onDateSelect={handleDateChange}
      />

      {/* Main Content Area */}
      {entries.length === 0 && !loading ? (
        <EmptyTimelineState onAddEntry={() => setAddDialogOpen(true)} />
      ) : (
        <TimelineContainer
          entries={entries}
          recipes={recipes}
          loading={loading}
          onEditEntry={openEditDialog}
          onDeleteEntry={handleDeleteEntry}
          onDeleteRecipe={handleDeleteRecipe}
          onShowRecipeInstructions={handleShowRecipeInstructions}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      )}
      {/* Main FAB */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: isMobile ? 16 : 24, 
          right: isMobile ? 16 : 24,
          width: isMobile ? 56 : 64,
          height: isMobile ? 56 : 64,
          background: `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`,
          color: 'white',
          boxShadow: theme.shadows[8],
          zIndex: theme.zIndex.fab,
          '&:hover': {
            background: `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.to} 0%, ${colorScheme.gradients.sidebarHeader.from} 100%)`,
            transform: 'scale(1.05)',
            boxShadow: theme.shadows[12],
          },
          transition: 'all 0.2s ease-in-out'
        }}
        onClick={() => setAddDialogOpen(true)}
      >
        <AddIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
      </Fab>

      {/* Add Entry Modal */}
      <AddEntryModal
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddEntry}
        formData={formData}
        setFormData={setFormData}
        ingredients={ingredients}
        recipes={recipes}
        supplements={supplements}
        recipeIngredients={recipeIngredients}
        editableIngredients={editableIngredients}
        setEditableIngredients={setEditableIngredients}
        onRecipeSelect={fetchRecipeIngredients}
        onResetRecipeIngredients={() => {
          setRecipeIngredients([]);
          setEditableIngredients([]);
        }}
      />

      {/* Edit Entry Modal */}
      <EditEntryModal
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={handleEditEntry}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Recipe Instructions Modal */}
      <RecipeInstructionsModal
        open={showRecipeInstructions}
        onClose={() => setShowRecipeInstructions(false)}
        recipe={selectedRecipe}
        ingredients={selectedRecipeIngredients}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteEntry}
        entry={entryToDelete}
      />

      {/* Recipe Delete Confirmation Modal */}
      <RecipeDeleteConfirmationModal
        open={deleteRecipeConfirmOpen}
        onClose={() => setDeleteRecipeConfirmOpen(false)}
        onConfirm={confirmDeleteRecipe}
        recipe={recipeToDelete}
      />
    </Box>
  );
};

export default HomePage;
