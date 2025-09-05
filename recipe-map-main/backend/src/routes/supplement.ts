import express from 'express';
import { dbService } from '../services/database';
import { authenticateToken } from '../middleware/auth';
import { validateSchema, supplementSchema } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, Supplement } from '../types';

const router = express.Router();

// Get all supplements
router.get('/', async (req, res, next) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    
    const result = await dbService.getSupplements(
      parseInt(limit as string),
      parseInt(offset as string),
      search as string
    );

    const response: ApiResponse<Supplement[]> = {
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

// Get supplement by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const supplement = await dbService.getSupplementById(parseInt(id));

    if (!supplement) {
      return next(createError('Supplement not found', 404));
    }

    const response: ApiResponse<Supplement> = {
      success: true,
      data: supplement,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Create supplement
router.post('/', authenticateToken, validateSchema(supplementSchema), async (req, res, next) => {
  try {
    const supplementData = {
      name: req.body.name,
      brand: req.body.brand || null,
      description: req.body.description || null,
      form: req.body.form,
      serving_size: req.body.serving_size,
      serving_unit: req.body.serving_unit,
      calories_per_serving: req.body.calories_per_serving || 0,
      protein_per_serving: req.body.protein_per_serving || 0,
      fat_per_serving: req.body.fat_per_serving || 0,
      saturated_fat_per_serving: req.body.saturated_fat_per_serving || 0,
      unsaturated_fat_per_serving: req.body.unsaturated_fat_per_serving || 0,
      polyunsaturated_fat_per_serving: req.body.polyunsaturated_fat_per_serving || 0,
      vitamin_a_per_serving: req.body.vitamin_a_per_serving || 0,
      vitamin_c_per_serving: req.body.vitamin_c_per_serving || 0,
      vitamin_d_per_serving: req.body.vitamin_d_per_serving || 0,
      vitamin_e_per_serving: req.body.vitamin_e_per_serving || 0,
      vitamin_k_per_serving: req.body.vitamin_k_per_serving || 0,
      thiamine_per_serving: req.body.thiamine_per_serving || 0,
      riboflavin_per_serving: req.body.riboflavin_per_serving || 0,
      niacin_per_serving: req.body.niacin_per_serving || 0,
      vitamin_b6_per_serving: req.body.vitamin_b6_per_serving || 0,
      folate_per_serving: req.body.folate_per_serving || 0,
      vitamin_b12_per_serving: req.body.vitamin_b12_per_serving || 0,
      calcium_per_serving: req.body.calcium_per_serving || 0,
      iron_per_serving: req.body.iron_per_serving || 0,
      magnesium_per_serving: req.body.magnesium_per_serving || 0,
      phosphorus_per_serving: req.body.phosphorus_per_serving || 0,
      potassium_per_serving: req.body.potassium_per_serving || 0,
      zinc_per_serving: req.body.zinc_per_serving || 0,
      sodium_per_serving: req.body.sodium_per_serving || 0,
      chloride_per_serving: req.body.chloride_per_serving || 0,
      sulfur_per_serving: req.body.sulfur_per_serving || 0,
      iodine_per_serving: req.body.iodine_per_serving || 0,
      copper_per_serving: req.body.copper_per_serving || 0,
      chromium_per_serving: req.body.chromium_per_serving || 0,
      manganese_per_serving: req.body.manganese_per_serving || 0,
      selenium_per_serving: req.body.selenium_per_serving || 0,
      fluoride_per_serving: req.body.fluoride_per_serving || 0,
      molybdenum_per_serving: req.body.molybdenum_per_serving || 0,
      cobalt_per_serving: req.body.cobalt_per_serving || 0,
      water_per_serving: req.body.water_per_serving || 0,
    };

    const supplement = await dbService.createSupplement(supplementData);

    const response: ApiResponse<Supplement> = {
      success: true,
      data: supplement,
      message: 'Supplement created successfully',
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// Update supplement
router.put('/:id', authenticateToken, validateSchema(supplementSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const supplement = await dbService.updateSupplement(parseInt(id), req.body);

    if (!supplement) {
      return next(createError('Supplement not found', 404));
    }

    const response: ApiResponse<Supplement> = {
      success: true,
      data: supplement,
      message: 'Supplement updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Delete supplement
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deleted = await dbService.deleteSupplement(parseInt(id));

    if (!deleted) {
      return next(createError('Supplement not found', 404));
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Supplement deleted successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;