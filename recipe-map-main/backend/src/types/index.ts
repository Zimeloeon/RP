export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activity_level?: number; // PAL value
  goal?: 'maintain' | 'lose' | 'gain';
  created_at: Date;
  updated_at: Date;
}

export interface Ingredient {
  id: number;
  name: string;
  brand?: string;
  description?: string;
  category: string;
  unit: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  saturated_fat_per_100g?: number;
  unsaturated_fat_per_100g?: number;
  polyunsaturated_fat_per_100g?: number;
  fiber_per_100g?: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  vitamin_a_per_100g?: number;
  vitamin_c_per_100g?: number;
  vitamin_d_per_100g?: number;
  vitamin_e_per_100g?: number;
  vitamin_k_per_100g?: number;
  thiamine_per_100g?: number;
  riboflavin_per_100g?: number;
  niacin_per_100g?: number;
  vitamin_b6_per_100g?: number;
  folate_per_100g?: number;
  vitamin_b12_per_100g?: number;
  calcium_per_100g?: number;
  iron_per_100g?: number;
  magnesium_per_100g?: number;
  phosphorus_per_100g?: number;
  potassium_per_100g?: number;
  zinc_per_100g?: number;
  chloride_per_100g?: number;
  sulfur_per_100g?: number;
  iodine_per_100g?: number;
  copper_per_100g?: number;
  chromium_per_100g?: number;
  manganese_per_100g?: number;
  selenium_per_100g?: number;
  fluoride_per_100g?: number;
  molybdenum_per_100g?: number;
  cobalt_per_100g?: number;
  water_per_100g?: number;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface RecipeIngredient {
  id: number;
  recipe_id: number;
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
  created_at: Date;
  updated_at: Date;
}

export interface IntakeEntry {
  id: number;
  user_id: number;
  entry_date: Date;
  entry_time: Date;
  type: 'ingredient' | 'recipe' | 'supplement' | 'water';
  item_id: number;
  quantity: number;
  unit: string;
  notes?: string;
  item_name?: string; // Added for API responses
  created_at: Date;
  updated_at: Date; // Added missing field
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

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password_hash'>;
}
