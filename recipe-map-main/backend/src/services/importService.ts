import { promises as fs } from 'fs';
import path from 'path';
import { dbService } from './database';
import { Ingredient, Recipe, RecipeIngredient } from '../types';

export interface ImportIngredient extends Omit<Ingredient, 'id' | 'created_at' | 'updated_at'> {
  // All properties from Ingredient interface except id, created_at, updated_at
}

export interface ImportRecipe extends Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'ingredients'> {
  ingredients: ImportRecipeIngredient[];
}

export interface ImportRecipeIngredient {
  ingredient_name: string;
  quantity: number;
  unit: string;
}

export interface ImportResult {
  success: boolean;
  message: string;
  stats: {
    ingredientsProcessed: number;
    ingredientsAdded: number;
    ingredientsSkipped: number;
    recipesProcessed: number;
    recipesAdded: number;
    recipesSkipped: number;
    errors: string[];
  };
}

export class ImportService {
  private importDir: string;

  constructor() {
    this.importDir = path.join(process.cwd(), 'import');
  }

  /**
   * Import all JSON files from the import directory
   */
  async importAllFiles(): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      message: '',
      stats: {
        ingredientsProcessed: 0,
        ingredientsAdded: 0,
        ingredientsSkipped: 0,
        recipesProcessed: 0,
        recipesAdded: 0,
        recipesSkipped: 0,
        errors: []
      }
    };

    try {
      // Ensure import directory exists
      await this.ensureImportDirectory();

      // Get all JSON files from import directory
      const files = await this.getJsonFiles();
      
      if (files.length === 0) {
        result.message = 'No JSON files found in import directory';
        return result;
      }

      console.log(`Found ${files.length} JSON files to process`);

      // Process each file
      for (const file of files) {
        try {
          await this.processFile(file, result);
        } catch (error) {
          const errorMsg = `Error processing file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(errorMsg);
          result.stats.errors.push(errorMsg);
          result.success = false;
        }
      }

      // Generate summary message
      result.message = this.generateSummaryMessage(result.stats);
      
      console.log('Import completed:', result.message);
      return result;

    } catch (error) {
      const errorMsg = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      result.success = false;
      result.message = errorMsg;
      result.stats.errors.push(errorMsg);
      return result;
    }
  }

  /**
   * Import a specific file by name
   */
  async importFile(filename: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      message: '',
      stats: {
        ingredientsProcessed: 0,
        ingredientsAdded: 0,
        ingredientsSkipped: 0,
        recipesProcessed: 0,
        recipesAdded: 0,
        recipesSkipped: 0,
        errors: []
      }
    };

    try {
      const filePath = path.join(this.importDir, filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        throw new Error(`File ${filename} not found in import directory`);
      }

      await this.processFile(filename, result);
      result.message = this.generateSummaryMessage(result.stats);
      
      return result;

    } catch (error) {
      const errorMsg = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMsg);
      result.success = false;
      result.message = errorMsg;
      result.stats.errors.push(errorMsg);
      return result;
    }
  }

  /**
   * Ensure the import directory exists
   */
  private async ensureImportDirectory(): Promise<void> {
    try {
      await fs.access(this.importDir);
    } catch {
      await fs.mkdir(this.importDir, { recursive: true });
      console.log(`Created import directory: ${this.importDir}`);
    }
  }

  /**
   * Get all JSON files from the import directory
   */
  private async getJsonFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.importDir);
      return files.filter(file => path.extname(file).toLowerCase() === '.json');
    } catch (error) {
      console.error('Error reading import directory:', error);
      return [];
    }
  }

  /**
   * Process a single JSON file
   */
  private async processFile(filename: string, result: ImportResult): Promise<void> {
    const filePath = path.join(this.importDir, filename);
    
    console.log(`Processing file: ${filename}`);
    
    try {
      // Read and parse JSON file
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      // Determine file type and process accordingly
      if (data.ingredients && Array.isArray(data.ingredients)) {
        await this.processIngredients(data.ingredients, result);
      }
      
      if (data.recipes && Array.isArray(data.recipes)) {
        await this.processRecipes(data.recipes, result);
      }
      
      // Handle single ingredient/recipe objects
      if (data.name && data.category && !data.instructions) {
        // Single ingredient
        await this.processIngredients([data], result);
      }
      
      if (data.name && data.instructions) {
        // Single recipe
        await this.processRecipes([data], result);
      }
      
      console.log(`Completed processing: ${filename}`);
      
    } catch (error) {
      throw new Error(`Failed to process ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process ingredients array
   */
  private async processIngredients(ingredients: any[], result: ImportResult): Promise<void> {
    for (const ingredientData of ingredients) {
      try {
        result.stats.ingredientsProcessed++;
        
        // Validate ingredient data
        this.validateIngredientData(ingredientData);
        
        // Check if ingredient already exists
        const existingIngredients = await dbService.getIngredients(100, 0, ingredientData.name);
        const exists = existingIngredients.data.some(ing => 
          ing.name.toLowerCase().trim() === ingredientData.name.toLowerCase().trim() &&
          (ing.brand || '').toLowerCase().trim() === (ingredientData.brand || '').toLowerCase().trim()
        );
        
        if (exists) {
          console.log(`Skipping existing ingredient: ${ingredientData.name} ${ingredientData.brand || ''}`);
          result.stats.ingredientsSkipped++;
          continue;
        }
        
        // Create the ingredient
        const newIngredient: ImportIngredient = {
          name: ingredientData.name,
          brand: ingredientData.brand || null,
          description: ingredientData.description || null,
          category: ingredientData.category,
          unit: ingredientData.unit,
          calories_per_100g: ingredientData.calories_per_100g || 0,
          protein_per_100g: ingredientData.protein_per_100g || 0,
          carbs_per_100g: ingredientData.carbs_per_100g || 0,
          fat_per_100g: ingredientData.fat_per_100g || 0,
          saturated_fat_per_100g: ingredientData.saturated_fat_per_100g || 0,
          unsaturated_fat_per_100g: ingredientData.unsaturated_fat_per_100g || 0,
          polyunsaturated_fat_per_100g: ingredientData.polyunsaturated_fat_per_100g || 0,
          fiber_per_100g: ingredientData.fiber_per_100g || 0,
          sugar_per_100g: ingredientData.sugar_per_100g || 0,
          sodium_per_100g: ingredientData.sodium_per_100g || 0,
          vitamin_a_per_100g: ingredientData.vitamin_a_per_100g || 0,
          vitamin_c_per_100g: ingredientData.vitamin_c_per_100g || 0,
          vitamin_d_per_100g: ingredientData.vitamin_d_per_100g || 0,
          vitamin_e_per_100g: ingredientData.vitamin_e_per_100g || 0,
          vitamin_k_per_100g: ingredientData.vitamin_k_per_100g || 0,
          thiamine_per_100g: ingredientData.thiamine_per_100g || 0,
          riboflavin_per_100g: ingredientData.riboflavin_per_100g || 0,
          niacin_per_100g: ingredientData.niacin_per_100g || 0,
          vitamin_b6_per_100g: ingredientData.vitamin_b6_per_100g || 0,
          folate_per_100g: ingredientData.folate_per_100g || 0,
          vitamin_b12_per_100g: ingredientData.vitamin_b12_per_100g || 0,
          calcium_per_100g: ingredientData.calcium_per_100g || 0,
          iron_per_100g: ingredientData.iron_per_100g || 0,
          magnesium_per_100g: ingredientData.magnesium_per_100g || 0,
          phosphorus_per_100g: ingredientData.phosphorus_per_100g || 0,
          potassium_per_100g: ingredientData.potassium_per_100g || 0,
          zinc_per_100g: ingredientData.zinc_per_100g || 0,
          chloride_per_100g: ingredientData.chloride_per_100g || 0,
          sulfur_per_100g: ingredientData.sulfur_per_100g || 0,
          iodine_per_100g: ingredientData.iodine_per_100g || 0,
          copper_per_100g: ingredientData.copper_per_100g || 0,
          chromium_per_100g: ingredientData.chromium_per_100g || 0,
          manganese_per_100g: ingredientData.manganese_per_100g || 0,
          selenium_per_100g: ingredientData.selenium_per_100g || 0,
          fluoride_per_100g: ingredientData.fluoride_per_100g || 0,
          molybdenum_per_100g: ingredientData.molybdenum_per_100g || 0,
          cobalt_per_100g: ingredientData.cobalt_per_100g || 0,
          water_per_100g: ingredientData.water_per_100g || 0
        };
        
        await dbService.createIngredient(newIngredient);
        console.log(`Added ingredient: ${newIngredient.name} ${newIngredient.brand || ''}`);
        result.stats.ingredientsAdded++;
        
      } catch (error) {
        const errorMsg = `Error processing ingredient ${ingredientData.name || 'unknown'}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        result.stats.errors.push(errorMsg);
      }
    }
  }

  /**
   * Process recipes array
   */
  private async processRecipes(recipes: any[], result: ImportResult): Promise<void> {
    for (const recipeData of recipes) {
      try {
        result.stats.recipesProcessed++;
        
        // Validate recipe data
        this.validateRecipeData(recipeData);
        
        // Check if recipe already exists
        const existingRecipes = await dbService.getRecipes(100, 0, recipeData.name);
        const exists = existingRecipes.data.some(recipe => 
          recipe.name.toLowerCase().trim() === recipeData.name.toLowerCase().trim()
        );
        
        if (exists) {
          console.log(`Skipping existing recipe: ${recipeData.name}`);
          result.stats.recipesSkipped++;
          continue;
        }
        
        // Create the recipe (without ingredients first)
        const newRecipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'ingredients'> = {
          name: recipeData.name,
          description: recipeData.description || null,
          instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : [recipeData.instructions],
          prep_time: recipeData.prep_time || null,
          cook_time: recipeData.cook_time || null,
          servings: recipeData.servings || 1,
          category: recipeData.category,
          difficulty: recipeData.difficulty || null
        };
        
        const createdRecipe = await dbService.createRecipe(newRecipe);
        
        // Process recipe ingredients if they exist
        if (recipeData.ingredients && Array.isArray(recipeData.ingredients)) {
          await this.processRecipeIngredients(createdRecipe.id, recipeData.ingredients);
        }
        
        console.log(`Added recipe: ${newRecipe.name}`);
        result.stats.recipesAdded++;
        
      } catch (error) {
        const errorMsg = `Error processing recipe ${recipeData.name || 'unknown'}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        result.stats.errors.push(errorMsg);
      }
    }
  }

  /**
   * Process recipe ingredients
   */
  private async processRecipeIngredients(recipeId: number, ingredients: ImportRecipeIngredient[]): Promise<void> {
    for (const ingredientData of ingredients) {
      try {
        // Find the ingredient by name
        const existingIngredients = await dbService.getIngredients(10, 0, ingredientData.ingredient_name);
        const matchingIngredient = existingIngredients.data.find(ing => 
          ing.name.toLowerCase().trim() === ingredientData.ingredient_name.toLowerCase().trim()
        );
        
        if (!matchingIngredient) {
          console.warn(`Warning: Ingredient '${ingredientData.ingredient_name}' not found for recipe. Skipping.`);
          continue;
        }
        
        // Create the recipe ingredient association
        await dbService.createRecipeIngredient(
          recipeId,
          matchingIngredient.id,
          ingredientData.quantity,
          ingredientData.unit
        );
        
        console.log(`Added recipe ingredient: ${ingredientData.ingredient_name} - ${ingredientData.quantity}${ingredientData.unit}`);
        
      } catch (error) {
        console.error(`Error processing recipe ingredient ${ingredientData.ingredient_name}:`, error);
      }
    }
  }

  /**
   * Validate ingredient data
   */
  private validateIngredientData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Ingredient name is required and must be a string');
    }
    
    if (!data.category || typeof data.category !== 'string') {
      throw new Error('Ingredient category is required and must be a string');
    }
    
    if (!data.unit || typeof data.unit !== 'string') {
      throw new Error('Ingredient unit is required and must be a string');
    }
    
    // Validate numeric fields
    const numericFields = [
      'calories_per_100g', 'protein_per_100g', 'carbs_per_100g', 'fat_per_100g'
    ];
    
    for (const field of numericFields) {
      if (data[field] !== undefined && data[field] !== null && (isNaN(Number(data[field])) || Number(data[field]) < 0)) {
        throw new Error(`${field} must be a non-negative number`);
      }
    }
  }

  /**
   * Validate recipe data
   */
  private validateRecipeData(data: any): void {
    if (!data.name || typeof data.name !== 'string') {
      throw new Error('Recipe name is required and must be a string');
    }
    
    if (!data.instructions) {
      throw new Error('Recipe instructions are required');
    }
    
    if (!data.category || typeof data.category !== 'string') {
      throw new Error('Recipe category is required and must be a string');
    }
    
    if (data.servings !== undefined && (isNaN(Number(data.servings)) || Number(data.servings) <= 0)) {
      throw new Error('Recipe servings must be a positive number');
    }
    
    if (data.difficulty && !['easy', 'medium', 'hard'].includes(data.difficulty)) {
      throw new Error('Recipe difficulty must be one of: easy, medium, hard');
    }
  }

  /**
   * Generate summary message
   */
  private generateSummaryMessage(stats: ImportResult['stats']): string {
    const parts = [];
    
    if (stats.ingredientsProcessed > 0) {
      parts.push(`Ingredients: ${stats.ingredientsAdded} added, ${stats.ingredientsSkipped} skipped of ${stats.ingredientsProcessed} processed`);
    }
    
    if (stats.recipesProcessed > 0) {
      parts.push(`Recipes: ${stats.recipesAdded} added, ${stats.recipesSkipped} skipped of ${stats.recipesProcessed} processed`);
    }
    
    if (stats.errors.length > 0) {
      parts.push(`${stats.errors.length} errors occurred`);
    }
    
    return parts.length > 0 ? parts.join('. ') : 'No data processed';
  }
}

// Export singleton instance
export const importService = new ImportService();