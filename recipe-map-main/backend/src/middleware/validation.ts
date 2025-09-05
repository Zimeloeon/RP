import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler';

export const validateSchema = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }
    next();
  };
};

export const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  weight: Joi.number().min(20).max(300).optional(),
  height: Joi.number().min(100).max(250).optional(),
  age: Joi.number().min(10).max(120).optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  activity_level: Joi.number().min(1.2).max(2.5).optional(),
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const ingredientSchema = Joi.object({
  name: Joi.string().max(200).required(),
  brand: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  category: Joi.string().max(50).required(),
  unit: Joi.string().max(20).required(),
  calories_per_100g: Joi.number().min(0).required(),
  protein_per_100g: Joi.number().min(0).required(),
  carbs_per_100g: Joi.number().min(0).required(),
  fat_per_100g: Joi.number().min(0).required(),
  saturated_fat_per_100g: Joi.number().min(0).optional(),
  unsaturated_fat_per_100g: Joi.number().min(0).optional(),
  polyunsaturated_fat_per_100g: Joi.number().min(0).optional(),
  // Add all other nutrients as optional
}).unknown(true);

export const recipeSchema = Joi.object({
  name: Joi.string().max(200).required(),
  description: Joi.string().optional(),
  instructions: Joi.array().items(Joi.string()).min(1).required(),
  prep_time: Joi.number().min(0).optional(),
  cook_time: Joi.number().min(0).optional(),
  servings: Joi.number().min(1).required(),
  category: Joi.string().max(50).required(),
  difficulty: Joi.string().valid('easy', 'medium', 'hard').optional(),
  ingredients: Joi.array().items(
    Joi.object({
      ingredient_id: Joi.number().required(),
      quantity: Joi.number().min(0).required(),
      unit: Joi.string().max(20).required(),
    })
  ).min(1).required(),
});

export const supplementSchema = Joi.object({
  name: Joi.string().max(200).required(),
  brand: Joi.string().max(100).optional(),
  description: Joi.string().optional(),
  form: Joi.string().valid('tablet', 'capsule', 'powder', 'liquid').required(),
  serving_size: Joi.number().min(0).required(),
  serving_unit: Joi.string().max(20).required(),
  calories_per_serving: Joi.number().min(0).optional(),
  protein_per_serving: Joi.number().min(0).optional(),
  fat_per_serving: Joi.number().min(0).optional(),
  saturated_fat_per_serving: Joi.number().min(0).optional(),
  unsaturated_fat_per_serving: Joi.number().min(0).optional(),
  polyunsaturated_fat_per_serving: Joi.number().min(0).optional(),
}).unknown(true);

export const intakeSchema = Joi.object({
  entry_date: Joi.date().required(),
  entry_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  type: Joi.string().valid('ingredient', 'recipe', 'supplement', 'water').required(),
  item_id: Joi.number().required(),
  quantity: Joi.number().min(0).required(),
  unit: Joi.string().max(20).required(),
  notes: Joi.string().allow('', null).optional(),
});

export const intakeUpdateSchema = Joi.object({
  entry_date: Joi.date().optional(),
  entry_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  type: Joi.string().valid('ingredient', 'recipe', 'supplement', 'water').optional(),
  item_id: Joi.number().optional(),
  quantity: Joi.number().min(0).optional(),
  unit: Joi.string().max(20).optional(),
  notes: Joi.string().allow('', null).optional(),
});
