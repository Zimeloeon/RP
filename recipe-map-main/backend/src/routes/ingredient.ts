import express from 'express';
import { dbService } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { validateSchema, ingredientSchema } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, Ingredient } from '../types';

const router = express.Router();

// Get all ingredients
router.get('/', async (req, res, next) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    const result = await dbService.getIngredients(
      parseInt(limit as string),
      parseInt(offset as string),
      search as string
    );

    const response: ApiResponse<Ingredient[]> = {
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

// Get ingredient by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const ingredient = await dbService.getIngredientById(parseInt(id));

    if (!ingredient) {
      return next(createError('Ingredient not found', 404));
    }

    const response: ApiResponse<Ingredient> = {
      success: true,
      data: ingredient,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create ingredient
router.post('/', authenticateToken, validateSchema(ingredientSchema), async (req, res, next) => {
  try {
    const ingredientData = {
      name: req.body.name,
      brand: req.body.brand || null,
      description: req.body.description || null,
      category: req.body.category,
      unit: req.body.unit,
      calories_per_100g: req.body.calories_per_100g || 0,
      protein_per_100g: req.body.protein_per_100g || 0,
      carbs_per_100g: req.body.carbs_per_100g || 0,
      fat_per_100g: req.body.fat_per_100g || 0,
      saturated_fat_per_100g: req.body.saturated_fat_per_100g || 0,
      unsaturated_fat_per_100g: req.body.unsaturated_fat_per_100g || 0,
      polyunsaturated_fat_per_100g: req.body.polyunsaturated_fat_per_100g || 0,
      fiber_per_100g: req.body.fiber_per_100g || 0,
      sugar_per_100g: req.body.sugar_per_100g || 0,
      sodium_per_100g: req.body.sodium_per_100g || 0,
      vitamin_a_per_100g: req.body.vitamin_a_per_100g || 0,
      vitamin_c_per_100g: req.body.vitamin_c_per_100g || 0,
      vitamin_d_per_100g: req.body.vitamin_d_per_100g || 0,
      vitamin_e_per_100g: req.body.vitamin_e_per_100g || 0,
      vitamin_k_per_100g: req.body.vitamin_k_per_100g || 0,
      thiamine_per_100g: req.body.thiamine_per_100g || 0,
      riboflavin_per_100g: req.body.riboflavin_per_100g || 0,
      niacin_per_100g: req.body.niacin_per_100g || 0,
      vitamin_b6_per_100g: req.body.vitamin_b6_per_100g || 0,
      folate_per_100g: req.body.folate_per_100g || 0,
      vitamin_b12_per_100g: req.body.vitamin_b12_per_100g || 0,
      calcium_per_100g: req.body.calcium_per_100g || 0,
      iron_per_100g: req.body.iron_per_100g || 0,
      magnesium_per_100g: req.body.magnesium_per_100g || 0,
      phosphorus_per_100g: req.body.phosphorus_per_100g || 0,
      potassium_per_100g: req.body.potassium_per_100g || 0,
      zinc_per_100g: req.body.zinc_per_100g || 0,
      chloride_per_100g: req.body.chloride_per_100g || 0,
      sulfur_per_100g: req.body.sulfur_per_100g || 0,
      iodine_per_100g: req.body.iodine_per_100g || 0,
      copper_per_100g: req.body.copper_per_100g || 0,
      chromium_per_100g: req.body.chromium_per_100g || 0,
      manganese_per_100g: req.body.manganese_per_100g || 0,
      selenium_per_100g: req.body.selenium_per_100g || 0,
      fluoride_per_100g: req.body.fluoride_per_100g || 0,
      molybdenum_per_100g: req.body.molybdenum_per_100g || 0,
      cobalt_per_100g: req.body.cobalt_per_100g || 0,
      water_per_100g: req.body.water_per_100g || 0,
    };

    const ingredient = await dbService.createIngredient(ingredientData);

    const response: ApiResponse<Ingredient> = {
      success: true,
      data: ingredient,
      message: 'Ingredient created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// Update ingredient
router.put('/:id', authenticateToken, validateSchema(ingredientSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const ingredient = await dbService.updateIngredient(parseInt(id), req.body);

    if (!ingredient) {
      return next(createError('Ingredient not found', 404));
    }

    const response: ApiResponse<Ingredient> = {
      success: true,
      data: ingredient,
      message: 'Ingredient updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Delete ingredient
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await dbService.deleteIngredient(parseInt(id));

    if (!deleted) {
      return next(createError('Ingredient not found', 404));
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Ingredient deleted successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get ingredient categories
router.get('/categories/list', async (req, res, next) => {
  try {
    const categories = await dbService.getIngredientCategories();

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