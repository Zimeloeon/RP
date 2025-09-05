/**
 * Type Definitions for Recipe Map Application
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the nutrition tracking application. It defines the data structures for:
 * 
 * - User profiles and authentication
 * - Food ingredients with comprehensive nutrition data
 * - Recipes and recipe ingredients
 * - Supplements and serving information
 * - Daily intake entries (including water tracking)
 * - Nutrition summaries and recommendations
 * - API request/response types
 * - UI theme configuration
 * 
 * All interfaces follow consistent naming conventions and include
 * optional fields for flexible data modeling.
 */

/**
 * User Profile Interface
 * Represents a registered user with optional physical characteristics
 * for nutrition calculation and personalized recommendations
 */
export interface User {
  id: number;                                    // Unique user identifier
  username: string;                              // Login username
  email: string;                                 // Contact email
  weight?: number;                               // Weight in kg (optional)
  height?: number;                               // Height in cm (optional)
  age?: number;                                  // Age in years (optional)
  gender?: 'male' | 'female' | 'other';         // Gender for nutrition calculations
  activity_level?: number;                       // Physical Activity Level (PAL)
  goal?: 'maintain' | 'lose' | 'gain';          // Nutrition goal
  created_at: string;                            // Account creation timestamp
  updated_at: string;                            // Last profile update timestamp
}

/**
 * Ingredient Interface
 * Comprehensive food ingredient data with nutrition information per 100g
 * Includes macronutrients, micronutrients, vitamins, and minerals
 */
export interface Ingredient {
  id: number;                                    // Unique ingredient identifier
  name: string;                                  // Ingredient display name
  brand?: string;                                // Brand name (optional)
  description?: string;                          // Additional description
  category: string;                              // Food category classification
  unit: string;                                  // Base unit of measurement
  
  // Macronutrients (required)
  calories_per_100g: number;                     // Energy content in kcal
  protein_per_100g: number;                      // Protein content in grams
  carbs_per_100g: number;                        // Carbohydrate content in grams
  fat_per_100g: number;                          // Total fat content in grams
  
  // Fat breakdown (optional)
  saturated_fat_per_100g?: number;               // Saturated fat in grams
  unsaturated_fat_per_100g?: number;             // Unsaturated fat in grams
  polyunsaturated_fat_per_100g?: number;         // Polyunsaturated fat in grams
  
  // Other macronutrients (optional)
  fiber_per_100g?: number;                       // Dietary fiber in grams
  sugar_per_100g?: number;                       // Sugar content in grams
  sodium_per_100g?: number;                      // Sodium content in mg
  
  // Vitamins (optional, in various units)
  vitamin_a_per_100g?: number;                   // Vitamin A in μg
  vitamin_c_per_100g?: number;                   // Vitamin C in mg
  vitamin_d_per_100g?: number;                   // Vitamin D in μg
  vitamin_e_per_100g?: number;                   // Vitamin E in mg
  vitamin_k_per_100g?: number;                   // Vitamin K in μg
  thiamine_per_100g?: number;                    // Thiamine (B1) in mg
  riboflavin_per_100g?: number;                  // Riboflavin (B2) in mg
  niacin_per_100g?: number;                      // Niacin (B3) in mg
  vitamin_b6_per_100g?: number;                  // Vitamin B6 in mg
  folate_per_100g?: number;                      // Folate in μg
  vitamin_b12_per_100g?: number;                 // Vitamin B12 in μg
  
  // Minerals (optional, in mg unless noted)
  calcium_per_100g?: number;                     // Calcium in mg
  iron_per_100g?: number;                        // Iron in mg
  magnesium_per_100g?: number;                   // Magnesium in mg
  phosphorus_per_100g?: number;                  // Phosphorus in mg
  potassium_per_100g?: number;                   // Potassium in mg
  zinc_per_100g?: number;                        // Zinc in mg
  chloride_per_100g?: number;                    // Chloride in mg
  sulfur_per_100g?: number;                      // Sulfur in mg
  iodine_per_100g?: number;                      // Iodine in μg
  copper_per_100g?: number;
  chromium_per_100g?: number;
  manganese_per_100g?: number;
  selenium_per_100g?: number;
  fluoride_per_100g?: number;
  molybdenum_per_100g?: number;
  cobalt_per_100g?: number;
  water_per_100g?: number;
  created_at: string;
  updated_at: string;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  instructions: string[];
  prep_time?: number;
  cook_time?: number;
  servings: number;
  category: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  ingredients?: RecipeIngredient[];
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id?: number;
  recipe_id?: number;
  ingredient_id: number;
  ingredient_name?: string;
  quantity: number;
  unit: string;
}

export interface Supplement {
  id: number;
  name: string;
  brand?: string;
  description?: string;
  form: 'tablet' | 'capsule' | 'powder' | 'liquid';
  serving_size: number;
  serving_unit: string;
  calories_per_serving?: number;
  protein_per_serving?: number;
  fat_per_serving?: number;
  saturated_fat_per_serving?: number;
  unsaturated_fat_per_serving?: number;
  polyunsaturated_fat_per_serving?: number;
  vitamin_a_per_serving?: number;
  vitamin_c_per_serving?: number;
  vitamin_d_per_serving?: number;
  vitamin_e_per_serving?: number;
  vitamin_k_per_serving?: number;
  thiamine_per_serving?: number;
  riboflavin_per_serving?: number;
  niacin_per_serving?: number;
  vitamin_b6_per_serving?: number;
  folate_per_serving?: number;
  vitamin_b12_per_serving?: number;
  calcium_per_serving?: number;
  iron_per_serving?: number;
  magnesium_per_serving?: number;
  phosphorus_per_serving?: number;
  potassium_per_serving?: number;
  zinc_per_serving?: number;
  sodium_per_serving?: number;
  chloride_per_serving?: number;
  sulfur_per_serving?: number;
  iodine_per_serving?: number;
  copper_per_serving?: number;
  chromium_per_serving?: number;
  manganese_per_serving?: number;
  selenium_per_serving?: number;
  fluoride_per_serving?: number;
  molybdenum_per_serving?: number;
  cobalt_per_serving?: number;
  water_per_serving?: number;
  created_at: string;
  updated_at: string;
}

export interface IntakeEntry {
  id: number;
  user_id: number;
  entry_date: string;
  entry_time: string;
  type: 'ingredient' | 'recipe' | 'supplement' | 'water';
  item_id: number;
  item_name?: string;
  item_category?: string;
  quantity: number;
  unit: string;
  notes?: string;
  created_at: string;
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  saturated_fat?: number;
  unsaturated_fat?: number;
  polyunsaturated_fat?: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e?: number;
  vitamin_k?: number;
  thiamine?: number;
  riboflavin?: number;
  niacin?: number;
  vitamin_b6?: number;
  folate: number;
  vitamin_b12: number;
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus?: number;
  potassium: number;
  zinc: number;
  chloride?: number;
  sulfur?: number;
  iodine?: number;
  copper?: number;
  chromium?: number;
  manganese?: number;
  selenium?: number;
  fluoride?: number;
  molybdenum?: number;
  cobalt?: number;
  water?: number;
}

export interface NutritionRecommendation {
  user_id: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  saturated_fat: number;
  unsaturated_fat: number;
  polyunsaturated_fat: number;
  fiber: number;
  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e: number;
  vitamin_k: number;
  thiamine: number;
  riboflavin: number;
  niacin: number;
  vitamin_b6: number;
  folate: number;
  vitamin_b12: number;
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  zinc: number;
  sodium: number;
  chloride: number;
  sulfur: number;
  iodine: number;
  copper: number;
  chromium: number;
  manganese: number;
  selenium: number;
  fluoride: number;
  molybdenum: number;
  cobalt: number;
  water: number;
  sugar: number;
}

export interface DailyNutritionSummary {
  entries: IntakeEntry[];
  totalNutrition: NutritionData;
  recommendations: NutritionRecommendation;
  percentages: Record<string, number>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activity_level?: number;
}

export interface ColorScheme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  gradients: {
    header: {
      from: string;
      to: string;
    };
    sidebar: {
      from: string;
      to: string;
    };
    sidebarHeader: {
      from: string;
      to: string;
    };
  };
}
