import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Ingredient, Recipe, Supplement, RecipeIngredient } from '../types';
import IngredientModal from '../modals/IngredientModal';
import RecipeModal from '../modals/RecipeModal';
import SupplementModal from '../modals/SupplementModal';
import IngredientsTable from '../components/admin/IngredientsTable';
import RecipesTable from '../components/admin/RecipesTable';
import SupplementsTable from '../components/admin/SupplementsTable';
import SearchField from '../components/SearchField';

/**
 * TabPanel Props Interface
 * Defines the structure for tab panel components used in the admin interface
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

/**
 * TabPanel Component
 * Renders content for a specific tab with responsive padding
 * Hides content when not the active tab for performance
 */
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: isMobile ? 0 : 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * AdminPage Component
 * 
 * A comprehensive admin interface for managing ingredients, recipes, and supplements.
 * Features:
 * - Tabbed interface for different data types
 * - Responsive design (mobile/desktop layouts)
 * - Search functionality across all data types
 * - CRUD operations (Create, Read, Update, Delete)
 * - Modal dialogs for data entry/editing
 * - Real-time data synchronization
 */
const AdminPage: React.FC = () => {
  // ============ State Management ============
  
  /** Current active tab (0: Ingredients, 1: Recipes, 2: Supplements) */
  const [tab, setTab] = useState(0);
  
  /** Responsive design detection */
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  /** Data state for all entity types */
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  
  /** Modal dialog state management */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  /** Search functionality state */
  const [searchTerm, setSearchTerm] = useState('');

  /** Form state for different entity types */
  const [ingredientForm, setIngredientForm] = useState<Partial<Ingredient>>({});
  const [recipeForm, setRecipeForm] = useState<Partial<Recipe & { ingredients: RecipeIngredient[] }>>({
    ingredients: [],
    instructions: [],
  });
  const [supplementForm, setSupplementForm] = useState<Partial<Supplement>>({});

  // ============ Effects & Data Loading ============
  
  /** Load all data on component mount */
  useEffect(() => {
    fetchAllData();
  }, []);

  /**
   * Fetches all data types in parallel for better performance
   * Loads ingredients, recipes, and supplements simultaneously
   */
  const fetchAllData = async () => {
    try {
      const [ingredientsRes, recipesRes, supplementsRes] = await Promise.all([
        api.get('/ingredients?limit=1000'),
        api.get('/recipes?limit=1000'),
        api.get('/supplements?limit=1000')
      ]);
      
      setIngredients(ingredientsRes.data.data || []);
      setRecipes(recipesRes.data.data || []);
      setSupplements(supplementsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  // ============ Event Handlers ============

  /**
   * Handles tab changes and resets search when switching tabs
   */
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setSearchTerm(''); // Clear search when switching tabs
  };

  /**
   * Opens the add dialog for creating new items
   * Resets all forms and sets up for creation mode
   */
  const openAddDialog = () => {
    setEditMode(false);
    setSelectedItem(null);
    resetForms();
    setDialogOpen(true);
  };

  /**
   * Opens the edit dialog for modifying existing items
   * Pre-populates forms with current item data
   */
  const openEditDialog = (item: any) => {
    setEditMode(true);
    setSelectedItem(item);
    
    // Populate appropriate form based on current tab
    if (tab === 0) {
      setIngredientForm(item);
    } else if (tab === 1) {
      setRecipeForm({
        ...item,
        ingredients: item.ingredients || [],
      });
    } else if (tab === 2) {
      setSupplementForm(item);
    }
    
    setDialogOpen(true);
  };

  /**
   * Resets all form states to empty/default values
   */
  const resetForms = () => {
    setIngredientForm({});
    setRecipeForm({ ingredients: [], instructions: [] });
    setSupplementForm({});
  };

  // ============ Form Change Handlers ============

  /** Updates ingredient form fields */
  const handleIngredientChange = (field: keyof Ingredient, value: any) => {
    setIngredientForm({ ...ingredientForm, [field]: value });
  };

  /** Updates recipe form fields */
  const handleRecipeChange = (field: keyof Recipe, value: any) => {
    setRecipeForm({ ...recipeForm, [field]: value });
  };

  /** Updates recipe ingredients specifically */
  const handleRecipeIngredientsChange = (ingredients: RecipeIngredient[]) => {
    setRecipeForm({ ...recipeForm, ingredients });
  };

  /** Updates supplement form fields */
  const handleSupplementChange = (field: keyof Supplement, value: any) => {
    setSupplementForm({ ...supplementForm, [field]: value });
  };

  // ============ CRUD Operations ============

  /**
   * Handles saving (create/update) operations
   * Determines endpoint and data based on current tab and edit mode
   */
  const handleSave = async () => {
    try {
      const url = tab === 0 ? '/ingredients' : tab === 1 ? '/recipes' : '/supplements';
      const data = tab === 0 ? ingredientForm : tab === 1 ? recipeForm : supplementForm;

      if (editMode && selectedItem) {
        await api.put(`${url}/${selectedItem.id}`, data);
        toast.success('Item updated successfully');
      } else {
        await api.post(url, data);
        toast.success('Item created successfully');
      }

      setDialogOpen(false);
      resetForms();
      fetchAllData(); // Refresh data after successful operation
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save item');
    }
  };

  /**
   * Handles delete operations with confirmation
   * Removes items from the appropriate endpoint
   */
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const url = tab === 0 ? '/ingredients' : tab === 1 ? '/recipes' : '/supplements';
      await api.delete(`${url}/${id}`);
      toast.success('Item deleted successfully');
      fetchAllData(); // Refresh data after successful deletion
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete item');
    }
  };

  // ============ Data Filtering & Validation ============

  /**
   * Filters data based on current search term
   * Searches in name and brand fields (if available)
   */
  const filteredData = () => {
    const data = tab === 0 ? ingredients : tab === 1 ? recipes : supplements;
    if (!searchTerm) return data;
    return data.filter((item: any) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  /**
   * Validates form data before allowing save operations
   * Each entity type has different required fields
   */
  const canSave = (): boolean => {
    if (tab === 0) {
      // Ingredients require: name, category, unit
      return !!(ingredientForm.name && ingredientForm.category && ingredientForm.unit);
    } else if (tab === 1) {
      // Recipes require: name, category, servings, ingredients, instructions
      return !!(
        recipeForm.name && 
        recipeForm.category && 
        recipeForm.servings &&
        recipeForm.ingredients && 
        recipeForm.ingredients.length > 0 &&
        recipeForm.instructions &&
        recipeForm.instructions.length > 0 &&
        recipeForm.instructions.every(instruction => instruction.trim().length > 0)
      );
    } else if (tab === 2) {
      // Supplements require: name, form, serving_size, serving_unit
      return !!(supplementForm.name && supplementForm.form && supplementForm.serving_size && supplementForm.serving_unit);
    }
    return false;
  };

  // ============ Render ============

  return (
    <Box sx={{ pb: isMobile ? 2 : 0 }}>
      {/* Header Section */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems={isMobile ? "flex-start" : "center"} 
        mb={isMobile ? 2 : 3}
        flexDirection={isMobile ? "column" : "row"}
        gap={isMobile ? 1.5 : 0}
      >
        <Typography 
          variant={isMobile ? "h6" : "h4"}
          sx={{ 
            fontSize: isMobile ? '1.1rem' : undefined,
            fontWeight: isMobile ? 600 : undefined 
          }}
        >
          Admin Panel
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddDialog}
          size="small"
          fullWidth={isMobile}
          sx={{
            fontSize: isMobile ? '0.75rem' : undefined,
            py: isMobile ? 0.75 : undefined
          }}
        >
          Add {tab === 0 ? 'Ingredient' : tab === 1 ? 'Recipe' : 'Supplement'}
        </Button>
      </Box>

      {/* Info Alert for Desktop */}
      {!isMobile && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Manage ingredients, recipes, and supplements that will be available to all users.
        </Alert>
      )}

      {/* Main Content Card */}
      <Card sx={{ 
        boxShadow: isMobile ? 1 : 3,
        borderRadius: isMobile ? 1 : 2
      }}>
        <CardContent sx={{ p: isMobile ? 0.5 : 3 }}>
          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tab} 
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile={isMobile}
              sx={{
                minHeight: isMobile ? 40 : 48,
                '& .MuiTab-root': {
                  minHeight: isMobile ? 40 : 48,
                  fontSize: isMobile ? '0.7rem' : undefined,
                  fontWeight: isMobile ? 500 : undefined,
                  py: isMobile ? 1 : undefined
                }
              }}
            >
              <Tab 
                label={isMobile ? `Ingred. (${ingredients.length})` : `Ingredients (${ingredients.length})`} 
                sx={{ minWidth: isMobile ? 'auto' : 160 }}
              />
              <Tab 
                label={isMobile ? `Recipes (${recipes.length})` : `Recipes (${recipes.length})`}
                sx={{ minWidth: isMobile ? 'auto' : 160 }}
              />
              <Tab 
                label={isMobile ? `Suppl. (${supplements.length})` : `Supplements (${supplements.length})`}
                sx={{ minWidth: isMobile ? 'auto' : 160 }}
              />
            </Tabs>
          </Box>

          {/* Search and Table Content */}
          <Box sx={{ p: isMobile ? 0.75 : 2 }}>
            <SearchField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={`Search ${tab === 0 ? 'ingredients' : tab === 1 ? 'recipes' : 'supplements'}...`}
              isMobile={isMobile}
            />

            {/* Tab Panels with Extracted Table Components */}
            <TabPanel value={tab} index={0}>
              <IngredientsTable
                ingredients={filteredData() as Ingredient[]}
                isMobile={isMobile}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <RecipesTable
                recipes={filteredData() as Recipe[]}
                isMobile={isMobile}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            </TabPanel>
            <TabPanel value={tab} index={2}>
              <SupplementsTable
                supplements={filteredData() as Supplement[]}
                isMobile={isMobile}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            </TabPanel>
          </Box>
        </CardContent>
      </Card>

      {/* Modal Dialogs for CRUD Operations */}
      <IngredientModal
        open={dialogOpen && tab === 0}
        editMode={editMode}
        ingredientForm={ingredientForm}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onChange={handleIngredientChange}
        canSave={canSave()}
      />

      <RecipeModal
        open={dialogOpen && tab === 1}
        editMode={editMode}
        recipeForm={recipeForm}
        ingredients={ingredients}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onChange={handleRecipeChange}
        onIngredientsChange={handleRecipeIngredientsChange}
        canSave={canSave()}
      />

      <SupplementModal
        open={dialogOpen && tab === 2}
        editMode={editMode}
        supplementForm={supplementForm}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onChange={handleSupplementChange}
        canSave={canSave()}
      />
    </Box>
  );
};

export default AdminPage;
