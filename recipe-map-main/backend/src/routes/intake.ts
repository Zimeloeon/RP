import express from 'express';
import { dbService } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { validateSchema, intakeSchema, intakeUpdateSchema } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, IntakeEntry } from '../types';

const router = express.Router();

// Get intake entries by date
router.get('/date/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const userId = (req as any).user.id;
    
    const entries = await dbService.getIntakeEntriesByDate(userId, date);

    const response: ApiResponse<IntakeEntry[]> = {
      success: true,
      data: entries,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get intake entries by date range
router.get('/range/:startDate/:endDate', authenticateToken, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.params;
    const userId = (req as any).user.id;
    
    const entries = await dbService.getIntakeEntriesByDateRange(userId, startDate, endDate);

    const response: ApiResponse<IntakeEntry[]> = {
      success: true,
      data: entries,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get intake entry by ID
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const entry = await dbService.getIntakeEntryById(parseInt(id));

    if (!entry) {
      return next(createError('Intake entry not found', 404));
    }

    const response: ApiResponse<IntakeEntry> = {
      success: true,
      data: entry,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create intake entry
router.post('/', authenticateToken, validateSchema(intakeSchema), async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    
    const entryData = {
      user_id: userId,
      type: req.body.type,
      item_id: req.body.item_id,
      quantity: req.body.quantity,
      unit: req.body.unit,
      entry_date: req.body.entry_date,
      entry_time: req.body.entry_time,
      notes: req.body.notes || null,
    };

    const entry = await dbService.createIntakeEntry(entryData);

    const response: ApiResponse<IntakeEntry> = {
      success: true,
      data: entry,
      message: 'Intake entry created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// Create multiple intake entries from recipe ingredients
router.post('/recipe-ingredients', authenticateToken, async (req, res, next) => {
  try {
    const userId = (req as any).user.id;
    const { recipe_id, servings, entry_date, entry_time, notes } = req.body;

    // Get recipe ingredients
    const recipeIngredients = await dbService.getRecipeIngredients(recipe_id);
    
    if (recipeIngredients.length === 0) {
      return next(createError('Recipe has no ingredients', 400));
    }

    // Get recipe info for serving calculations
    const recipe = await dbService.getRecipeById(recipe_id);
    if (!recipe) {
      return next(createError('Recipe not found', 404));
    }

    const multiplier = servings / recipe.servings;
    const entries: IntakeEntry[] = [];

    // Create entries for each ingredient
    for (const ingredient of recipeIngredients) {
      const entryData = {
        user_id: userId,
        type: 'ingredient' as const,
        item_id: ingredient.ingredient_id,
        quantity: ingredient.quantity * multiplier,
        unit: ingredient.unit,
        entry_date,
        entry_time,
        notes: notes ? `${notes} (from ${recipe.name})` : `From ${recipe.name}`,
      };

      const entry = await dbService.createIntakeEntry(entryData);
      entries.push(entry);
    }

    const response: ApiResponse<IntakeEntry[]> = {
      success: true,
      data: entries,
      message: `Created ${entries.length} ingredient entries from recipe`,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// Update intake entry
router.put('/:id', authenticateToken, validateSchema(intakeUpdateSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const entry = await dbService.updateIntakeEntry(parseInt(id), req.body);

    if (!entry) {
      return next(createError('Intake entry not found', 404));
    }

    const response: ApiResponse<IntakeEntry> = {
      success: true,
      data: entry,
      message: 'Intake entry updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Delete intake entry
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await dbService.deleteIntakeEntry(parseInt(id));

    if (!deleted) {
      return next(createError('Intake entry not found', 404));
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Intake entry deleted successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;