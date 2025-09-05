import express from 'express';
import { dbService } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { validateSchema, recipeSchema } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, Recipe } from '../types';

const router = express.Router();

// Get all recipes
router.get('/', async (req, res, next) => {
  try {
    const { search, category, ingredient, limit = 50, offset = 0 } = req.query;
    
    const result = await dbService.getRecipes(
      parseInt(limit as string),
      parseInt(offset as string),
      search as string,
      category as string,
      ingredient as string
    );

    const response: ApiResponse<Recipe[]> = {
      success: true,
      data: result.data,
      pagination: {
        total: result.total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get recipe by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const recipe = await dbService.getRecipeById(parseInt(id));

    if (!recipe) {
      return next(createError('Recipe not found', 404));
    }

    const response: ApiResponse<Recipe> = {
      success: true,
      data: recipe,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get recipe ingredients
router.get('/:id/ingredients', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const ingredients = await dbService.getRecipeIngredients(parseInt(id));

    const response: ApiResponse<any[]> = {
      success: true,
      data: ingredients,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create recipe
router.post('/', authenticateToken, validateSchema(recipeSchema), async (req, res, next) => {
  try {
    const recipeData = {
      name: req.body.name,
      description: req.body.description || null,
      instructions: req.body.instructions || [],
      prep_time: req.body.prep_time || null,
      cook_time: req.body.cook_time || null,
      servings: req.body.servings || 1,
      category: req.body.category,
      difficulty: req.body.difficulty || null,
    };

    const recipe = await dbService.createRecipe(recipeData);

    const response: ApiResponse<Recipe> = {
      success: true,
      data: recipe,
      message: 'Recipe created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// Update recipe
router.put('/:id', authenticateToken, validateSchema(recipeSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const recipe = await dbService.updateRecipe(parseInt(id), req.body);

    if (!recipe) {
      return next(createError('Recipe not found', 404));
    }

    const response: ApiResponse<Recipe> = {
      success: true,
      data: recipe,
      message: 'Recipe updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Delete recipe
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await dbService.deleteRecipe(parseInt(id));

    if (!deleted) {
      return next(createError('Recipe not found', 404));
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Recipe deleted successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get recipe categories
router.get('/categories/list', async (req, res, next) => {
  try {
    const categories = await dbService.getRecipeCategories();

    const response: ApiResponse<string[]> = {
      success: true,
      data: categories,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;