/**
 * Service Layer Index
 * 
 * Centralized API service definitions for the nutrition tracking application.
 * Provides organized service modules for:
 * - Nutrition analysis and recommendations
 * - Ingredient management and search
 * - Recipe operations and filtering
 * - Supplement tracking
 * - Intake entry management
 * 
 * Architecture:
 * - Consistent error handling and response typing
 * - Standardized API response format with ApiResponse wrapper
 * - Proper TypeScript typing for all service methods
 * - Modular organization by domain functionality
 * - Reusable parameter interfaces for flexible querying
 * 
 * @module Services
 */

import { api } from './api';
import { 
  Ingredient, 
  Recipe, 
  Supplement, 
  IntakeEntry,
  DailyNutritionSummary,
  NutritionRecommendation,
  ApiResponse 
} from '../types';

/**
 * Nutrition Service
 * 
 * Handles nutrition analysis, daily summaries, and dietary recommendations.
 * Provides endpoints for comprehensive nutrition tracking and analysis.
 */
export const nutritionService = {
  /**
   * Get daily nutrition summary for a specific date
   * @param date - Date string in YYYY-MM-DD format
   * @returns Complete nutrition breakdown with macros, vitamins, and minerals
   */
  async getDailyNutrition(date: string): Promise<DailyNutritionSummary> {
    const response = await api.get<ApiResponse<DailyNutritionSummary>>(`/nutrition/daily/${date}`);
    return response.data.data!;
  },

  /**
   * Get personalized nutrition recommendations based on user profile
   * @returns Recommended daily values for all nutrients
   */
  async getRecommendations(): Promise<NutritionRecommendation> {
    const response = await api.get<ApiResponse<NutritionRecommendation>>('/nutrition/recommendations');
    return response.data.data!;
  },

  /**
   * Get weekly nutrition trends and analysis
   * @param startDate - Start date for weekly analysis
   * @returns Weekly nutrition data with trends and insights
   */
  async getWeeklyNutrition(startDate: string): Promise<any> {
    const response = await api.get<ApiResponse<any>>(`/nutrition/weekly/${startDate}`);
    return response.data.data!;
  },
};

/**
 * Ingredient Service
 * 
 * Manages ingredient database operations including search, filtering, and CRUD.
 * Supports comprehensive ingredient management with nutrition data.
 */
export const ingredientService = {
  /**
   * Get all ingredients with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Array of ingredients matching criteria
   */
  async getAll(params?: { search?: string; category?: string; limit?: number; offset?: number }): Promise<Ingredient[]> {
    const response = await api.get<ApiResponse<Ingredient[]>>('/ingredients', { params });
    return response.data.data || [];
  },

  /**
   * Get single ingredient by ID
   * @param id - Ingredient ID
   * @returns Complete ingredient data with nutrition information
   */
  async getById(id: number): Promise<Ingredient> {
    const response = await api.get<ApiResponse<Ingredient>>(`/ingredients/${id}`);
    return response.data.data!;
  },

  /**
   * Create new ingredient
   * @param ingredient - Ingredient data to create
   * @returns Created ingredient with assigned ID
   */
  async create(ingredient: Partial<Ingredient>): Promise<Ingredient> {
    const response = await api.post<ApiResponse<Ingredient>>('/ingredients', ingredient);
    return response.data.data!;
  },

  /**
   * Update existing ingredient
   * @param id - Ingredient ID to update
   * @param ingredient - Updated ingredient data
   * @returns Updated ingredient data
   */
  async update(id: number, ingredient: Partial<Ingredient>): Promise<Ingredient> {
    const response = await api.put<ApiResponse<Ingredient>>(`/ingredients/${id}`, ingredient);
    return response.data.data!;
  },

  /**
   * Delete ingredient by ID
   * @param id - Ingredient ID to delete
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/ingredients/${id}`);
  },

  /**
   * Get all available ingredient categories
   * @returns Array of category names for filtering
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/ingredients/categories/list');
    return response.data.data || [];
  },
};

/**
 * Recipe Service
 * 
 * Handles recipe management including search, filtering, and ingredient relationships.
 * Supports complex recipe operations with ingredient lists and instructions.
 */
export const recipeService = {
  /**
   * Get all recipes with optional filtering and search
   * @param params - Query parameters for search and filtering
   * @returns Array of recipes matching criteria
   */
  async getAll(params?: { search?: string; category?: string; ingredient?: string; limit?: number; offset?: number }): Promise<Recipe[]> {
    const response = await api.get<ApiResponse<Recipe[]>>('/recipes', { params });
    return response.data.data || [];
  },

  /**
   * Get single recipe by ID with complete details
   * @param id - Recipe ID
   * @returns Complete recipe data including ingredients and instructions
   */
  async getById(id: number): Promise<Recipe> {
    const response = await api.get<ApiResponse<Recipe>>(`/recipes/${id}`);
    return response.data.data!;
  },

  /**
   * Create new recipe with ingredients and instructions
   * @param recipe - Recipe data to create
   * @returns Created recipe with assigned ID
   */
  async create(recipe: Partial<Recipe>): Promise<Recipe> {
    const response = await api.post<ApiResponse<Recipe>>('/recipes', recipe);
    return response.data.data!;
  },

  /**
   * Update existing recipe
   * @param id - Recipe ID to update
   * @param recipe - Updated recipe data
   * @returns Updated recipe data
   */
  async update(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
    const response = await api.put<ApiResponse<Recipe>>(`/recipes/${id}`, recipe);
    return response.data.data!;
  },

  /**
   * Delete recipe by ID
   * @param id - Recipe ID to delete
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/recipes/${id}`);
  },

  /**
   * Get all available recipe categories
   * @returns Array of category names for filtering
   */
  async getCategories(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/recipes/categories/list');
    return response.data.data || [];
  },
};

/**
 * Supplement Service
 * 
 * Handles supplement management including search, filtering, and CRUD operations.
 * Supports supplement tracking with serving information and nutritional data.
 */
export const supplementService = {
  /**
   * Get all supplements with optional filtering and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Array of supplements matching criteria
   */
  async getAll(params?: { search?: string; form?: string; limit?: number; offset?: number }): Promise<Supplement[]> {
    const response = await api.get<ApiResponse<Supplement[]>>('/supplements', { params });
    return response.data.data || [];
  },

  /**
   * Get single supplement by ID
   * @param id - Supplement ID
   * @returns Complete supplement data with serving information
   */
  async getById(id: number): Promise<Supplement> {
    const response = await api.get<ApiResponse<Supplement>>(`/supplements/${id}`);
    return response.data.data!;
  },

  /**
   * Create new supplement
   * @param supplement - Supplement data to create
   * @returns Created supplement with assigned ID
   */
  async create(supplement: Partial<Supplement>): Promise<Supplement> {
    const response = await api.post<ApiResponse<Supplement>>('/supplements', supplement);
    return response.data.data!;
  },

  /**
   * Update existing supplement
   * @param id - Supplement ID to update
   * @param supplement - Updated supplement data
   * @returns Updated supplement data
   */
  async update(id: number, supplement: Partial<Supplement>): Promise<Supplement> {
    const response = await api.put<ApiResponse<Supplement>>(`/supplements/${id}`, supplement);
    return response.data.data!;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/supplements/${id}`);
  },

  async getForms(): Promise<string[]> {
    const response = await api.get<ApiResponse<string[]>>('/supplements/forms/list');
    return response.data.data || [];
  },
};

export const intakeService = {
  async getByDate(date: string): Promise<IntakeEntry[]> {
    const response = await api.get<ApiResponse<IntakeEntry[]>>(`/intake/date/${date}`);
    return response.data.data || [];
  },

  async getByDateRange(startDate: string, endDate: string): Promise<IntakeEntry[]> {
    const response = await api.get<ApiResponse<IntakeEntry[]>>(`/intake/range/${startDate}/${endDate}`);
    return response.data.data || [];
  },

  async create(entry: Omit<IntakeEntry, 'id' | 'user_id' | 'created_at' | 'item_name' | 'item_category'>): Promise<IntakeEntry> {
    const response = await api.post<ApiResponse<IntakeEntry>>('/intake', entry);
    return response.data.data!;
  },

  async update(id: number, entry: Partial<IntakeEntry>): Promise<IntakeEntry> {
    const response = await api.put<ApiResponse<IntakeEntry>>(`/intake/${id}`, entry);
    return response.data.data!;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/intake/${id}`);
  },
};

export const userService = {
  async getProfile(): Promise<any> {
    const response = await api.get<ApiResponse<any>>('/users/profile');
    return response.data.data!;
  },

  async updateProfile(profileData: any): Promise<any> {
    const response = await api.put<ApiResponse<any>>('/users/profile', profileData);
    return response.data.data!;
  },
};
