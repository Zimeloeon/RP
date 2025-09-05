import { 
  getMockDataStorage, 
  getNextId, 
  resetMockData 
} from './mockData';
import { 
  Ingredient, 
  Recipe, 
  Supplement, 
  User, 
  IntakeEntry 
} from '../types';

export class MockDatabase {
  private storage = getMockDataStorage();

  // Users
  async findUserByEmail(email: string): Promise<User | null> {
    return this.storage.users.find(user => user.email === email) || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.storage.users.find(user => user.username === username) || null;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.storage.users.find(user => user.id === id) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: getNextId('users'),
      created_at: new Date(),
      updated_at: new Date()
    };
    this.storage.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
    const userIndex = this.storage.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;

    this.storage.users[userIndex] = {
      ...this.storage.users[userIndex],
      ...userData,
      updated_at: new Date()
    };
    return this.storage.users[userIndex];
  }

  // Ingredients
  async getIngredients(limit = 100, offset = 0, search?: string): Promise<{ data: Ingredient[], total: number }> {
    let filtered = this.storage.ingredients;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(ingredient => 
        ingredient.name.toLowerCase().includes(searchLower) ||
        (ingredient.brand && ingredient.brand.toLowerCase().includes(searchLower)) ||
        ingredient.category.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const data = filtered.slice(offset, offset + limit);
    
    return { data, total };
  }

  async getIngredientById(id: number): Promise<Ingredient | null> {
    return this.storage.ingredients.find(ingredient => ingredient.id === id) || null;
  }

  async createIngredient(ingredientData: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>): Promise<Ingredient> {
    const newIngredient: Ingredient = {
      ...ingredientData,
      id: getNextId('ingredients'),
      created_at: new Date(),
      updated_at: new Date()
    };
    this.storage.ingredients.push(newIngredient);
    return newIngredient;
  }

  async updateIngredient(id: number, ingredientData: Partial<Ingredient>): Promise<Ingredient | null> {
    const ingredientIndex = this.storage.ingredients.findIndex(ingredient => ingredient.id === id);
    if (ingredientIndex === -1) return null;

    this.storage.ingredients[ingredientIndex] = {
      ...this.storage.ingredients[ingredientIndex],
      ...ingredientData,
      updated_at: new Date()
    };
    return this.storage.ingredients[ingredientIndex];
  }

  async deleteIngredient(id: number): Promise<boolean> {
    const initialLength = this.storage.ingredients.length;
    this.storage.ingredients = this.storage.ingredients.filter(ingredient => ingredient.id !== id);
    return this.storage.ingredients.length < initialLength;
  }

  async getIngredientCategories(): Promise<string[]> {
    const categories = this.storage.ingredients.map(ingredient => ingredient.category);
    return [...new Set(categories)].sort();
  }

  // Recipes
  async getRecipes(limit = 100, offset = 0, search?: string, category?: string, ingredient?: string): Promise<{ data: Recipe[], total: number }> {
    let filtered = this.storage.recipes;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(searchLower) ||
        recipe.category.toLowerCase().includes(searchLower) ||
        (recipe.description && recipe.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (category) {
      const categoryLower = category.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.category.toLowerCase().includes(categoryLower)
      );
    }
    
    if (ingredient) {
      const ingredientLower = ingredient.toLowerCase();
      filtered = filtered.filter(recipe => {
        // Check if recipe has ingredients array and if any ingredient matches
        return recipe.ingredients && recipe.ingredients.some((ing: any) => 
          ing.ingredient_name && ing.ingredient_name.toLowerCase().includes(ingredientLower)
        );
      });
    }

    const total = filtered.length;
    const data = filtered.slice(offset, offset + limit);
    
    return { data, total };
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    return this.storage.recipes.find(recipe => recipe.id === id) || null;
  }

  async getRecipeIngredients(recipeId: number): Promise<{ id: number; ingredient_id: number; ingredient_name: string; quantity: number; unit: string; }[]> {
    const recipe = this.storage.recipes.find(r => r.id === recipeId);
    if (!recipe || !recipe.ingredients) return [];
    
    return recipe.ingredients.map(ing => ({
      id: ing.id,
      ingredient_id: ing.ingredient_id,
      ingredient_name: ing.ingredient_name || 'Unknown',
      quantity: ing.quantity,
      unit: ing.unit
    }));
  }

  async createRecipe(recipeData: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    const newRecipe: Recipe = {
      ...recipeData,
      id: getNextId('recipes'),
      created_at: new Date(),
      updated_at: new Date()
    };
    this.storage.recipes.push(newRecipe);
    return newRecipe;
  }

  async updateRecipe(id: number, recipeData: Partial<Recipe>): Promise<Recipe | null> {
    const recipeIndex = this.storage.recipes.findIndex(recipe => recipe.id === id);
    if (recipeIndex === -1) return null;

    this.storage.recipes[recipeIndex] = {
      ...this.storage.recipes[recipeIndex],
      ...recipeData,
      updated_at: new Date()
    };
    return this.storage.recipes[recipeIndex];
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const initialLength = this.storage.recipes.length;
    this.storage.recipes = this.storage.recipes.filter(recipe => recipe.id !== id);
    return this.storage.recipes.length < initialLength;
  }

  async getRecipeCategories(): Promise<string[]> {
    const categories = this.storage.recipes.map(recipe => recipe.category);
    return [...new Set(categories)].sort();
  }

  // Supplements
  async getSupplements(limit = 100, offset = 0, search?: string): Promise<{ data: Supplement[], total: number }> {
    let filtered = this.storage.supplements;
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(supplement => 
        supplement.name.toLowerCase().includes(searchLower) ||
        (supplement.brand && supplement.brand.toLowerCase().includes(searchLower))
      );
    }

    const total = filtered.length;
    const data = filtered.slice(offset, offset + limit);
    
    return { data, total };
  }

  async getSupplementById(id: number): Promise<Supplement | null> {
    return this.storage.supplements.find(supplement => supplement.id === id) || null;
  }

  async createSupplement(supplementData: Omit<Supplement, 'id' | 'created_at' | 'updated_at'>): Promise<Supplement> {
    const newSupplement: Supplement = {
      ...supplementData,
      id: getNextId('supplements'),
      created_at: new Date(),
      updated_at: new Date()
    };
    this.storage.supplements.push(newSupplement);
    return newSupplement;
  }

  async updateSupplement(id: number, supplementData: Partial<Supplement>): Promise<Supplement | null> {
    const supplementIndex = this.storage.supplements.findIndex(supplement => supplement.id === id);
    if (supplementIndex === -1) return null;

    this.storage.supplements[supplementIndex] = {
      ...this.storage.supplements[supplementIndex],
      ...supplementData,
      updated_at: new Date()
    };
    return this.storage.supplements[supplementIndex];
  }

  async deleteSupplement(id: number): Promise<boolean> {
    const initialLength = this.storage.supplements.length;
    this.storage.supplements = this.storage.supplements.filter(supplement => supplement.id !== id);
    return this.storage.supplements.length < initialLength;
  }

  // Intake Entries
  async getIntakeEntriesByDate(userId: number, date: string): Promise<IntakeEntry[]> {
    return this.storage.intakeEntries.filter(entry => {
      // Handle both Date objects and string dates
      const entryDate = entry.entry_date instanceof Date ? entry.entry_date : new Date(entry.entry_date);
      const entryDateStr = entryDate.toISOString().split('T')[0];
      return entry.user_id === userId && entryDateStr === date;
    }).sort((a, b) => {
      // Handle both Date objects and string dates for sorting
      const aDate = a.entry_date instanceof Date ? a.entry_date : new Date(a.entry_date);
      const bDate = b.entry_date instanceof Date ? b.entry_date : new Date(b.entry_date);
      const aTime = a.entry_time instanceof Date ? a.entry_time : new Date(`1970-01-01T${a.entry_time}`);
      const bTime = b.entry_time instanceof Date ? b.entry_time : new Date(`1970-01-01T${b.entry_time}`);
      
      const dateCompare = aDate.getTime() - bDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      return aTime.getTime() - bTime.getTime();
    });
  }

  async getIntakeEntriesByDateRange(userId: number, startDate: string, endDate: string): Promise<IntakeEntry[]> {
    return this.storage.intakeEntries.filter(entry => {
      // Handle both Date objects and string dates
      const entryDate = entry.entry_date instanceof Date ? entry.entry_date : new Date(entry.entry_date);
      const entryDateStr = entryDate.toISOString().split('T')[0];
      return entry.user_id === userId && entryDateStr >= startDate && entryDateStr <= endDate;
    }).sort((a, b) => {
      // Handle both Date objects and string dates for sorting
      const aDate = a.entry_date instanceof Date ? a.entry_date : new Date(a.entry_date);
      const bDate = b.entry_date instanceof Date ? b.entry_date : new Date(b.entry_date);
      const aTime = a.entry_time instanceof Date ? a.entry_time : new Date(`1970-01-01T${a.entry_time}`);
      const bTime = b.entry_time instanceof Date ? b.entry_time : new Date(`1970-01-01T${b.entry_time}`);
      
      const dateCompare = aDate.getTime() - bDate.getTime();
      if (dateCompare !== 0) return dateCompare;
      return aTime.getTime() - bTime.getTime();
    });
  }

  async getIntakeEntryById(id: number): Promise<IntakeEntry | null> {
    return this.storage.intakeEntries.find(entry => entry.id === id) || null;
  }

  async createIntakeEntry(entryData: Omit<IntakeEntry, 'id' | 'created_at' | 'updated_at'>): Promise<IntakeEntry> {
    // Find the item name based on type and item_id
    let itemName = '';
    switch (entryData.type) {
      case 'ingredient':
        const ingredient = this.storage.ingredients.find(i => i.id === entryData.item_id);
        itemName = ingredient?.name || 'Unknown Ingredient';
        break;
      case 'recipe':
        const recipe = this.storage.recipes.find(r => r.id === entryData.item_id);
        itemName = recipe?.name || 'Unknown Recipe';
        break;
      case 'supplement':
        const supplement = this.storage.supplements.find(s => s.id === entryData.item_id);
        itemName = supplement?.name || 'Unknown Supplement';
        break;
      case 'water':
        itemName = 'Water';
        break;
    }

    const newEntry: IntakeEntry = {
      ...entryData,
      item_name: itemName,
      id: getNextId('intakeEntries'),
      created_at: new Date(),
      updated_at: new Date()
    };
    this.storage.intakeEntries.push(newEntry);
    return newEntry;
  }

  async updateIntakeEntry(id: number, entryData: Partial<IntakeEntry>): Promise<IntakeEntry | null> {
    const entryIndex = this.storage.intakeEntries.findIndex(entry => entry.id === id);
    if (entryIndex === -1) return null;

    this.storage.intakeEntries[entryIndex] = {
      ...this.storage.intakeEntries[entryIndex],
      ...entryData,
      updated_at: new Date()
    };
    return this.storage.intakeEntries[entryIndex];
  }

  async deleteIntakeEntry(id: number): Promise<boolean> {
    const initialLength = this.storage.intakeEntries.length;
    this.storage.intakeEntries = this.storage.intakeEntries.filter(entry => entry.id !== id);
    return this.storage.intakeEntries.length < initialLength;
  }

  // Utility methods
  async reset(): Promise<void> {
    resetMockData();
    this.storage = getMockDataStorage();
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString()
    };
  }

  // Nutrition calculation methods
  async calculateDailyNutrition(userId: number, date: string): Promise<any> {
    const entries = await this.getIntakeEntriesByDate(userId, date);

    const nutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      saturated_fat: 0,
      unsaturated_fat: 0,
      polyunsaturated_fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      vitamin_a: 0,
      vitamin_c: 0,
      vitamin_d: 0,
      vitamin_e: 0,
      vitamin_k: 0,
      thiamine: 0,
      riboflavin: 0,
      niacin: 0,
      vitamin_b6: 0,
      folate: 0,
      vitamin_b12: 0,
      calcium: 0,
      iron: 0,
      magnesium: 0,
      phosphorus: 0,
      potassium: 0,
      zinc: 0,
      chloride: 0,
      sulfur: 0,
      iodine: 0,
      copper: 0,
      chromium: 0,
      manganese: 0,
      selenium: 0,
      fluoride: 0,
      molybdenum: 0,
      cobalt: 0,
      water: 0,
    };

    for (const entry of entries) {
      let multiplier = 1;

      if (entry.type === 'ingredient') {
        const ingredient = this.storage.ingredients.find(i => i.id === entry.item_id);
        if (!ingredient) continue;

        // Calculate multiplier based on quantity (per 100g)
        multiplier = entry.quantity / 100;
        
        nutrition.calories += (ingredient.calories_per_100g || 0) * multiplier;
        nutrition.protein += (ingredient.protein_per_100g || 0) * multiplier;
        nutrition.carbs += (ingredient.carbs_per_100g || 0) * multiplier;
        nutrition.fat += (ingredient.fat_per_100g || 0) * multiplier;
        nutrition.saturated_fat += (ingredient.saturated_fat_per_100g || 0) * multiplier;
        nutrition.unsaturated_fat += (ingredient.unsaturated_fat_per_100g || 0) * multiplier;
        nutrition.polyunsaturated_fat += (ingredient.polyunsaturated_fat_per_100g || 0) * multiplier;
        nutrition.fiber += (ingredient.fiber_per_100g || 0) * multiplier;
        nutrition.sugar += (ingredient.sugar_per_100g || 0) * multiplier;
        nutrition.sodium += (ingredient.sodium_per_100g || 0) * multiplier;
        nutrition.vitamin_a += (ingredient.vitamin_a_per_100g || 0) * multiplier;
        nutrition.vitamin_c += (ingredient.vitamin_c_per_100g || 0) * multiplier;
        nutrition.vitamin_d += (ingredient.vitamin_d_per_100g || 0) * multiplier;
        nutrition.vitamin_e += (ingredient.vitamin_e_per_100g || 0) * multiplier;
        nutrition.vitamin_k += (ingredient.vitamin_k_per_100g || 0) * multiplier;
        nutrition.thiamine += (ingredient.thiamine_per_100g || 0) * multiplier;
        nutrition.riboflavin += (ingredient.riboflavin_per_100g || 0) * multiplier;
        nutrition.niacin += (ingredient.niacin_per_100g || 0) * multiplier;
        nutrition.vitamin_b6 += (ingredient.vitamin_b6_per_100g || 0) * multiplier;
        nutrition.folate += (ingredient.folate_per_100g || 0) * multiplier;
        nutrition.vitamin_b12 += (ingredient.vitamin_b12_per_100g || 0) * multiplier;
        nutrition.calcium += (ingredient.calcium_per_100g || 0) * multiplier;
        nutrition.iron += (ingredient.iron_per_100g || 0) * multiplier;
        nutrition.magnesium += (ingredient.magnesium_per_100g || 0) * multiplier;
        nutrition.phosphorus += (ingredient.phosphorus_per_100g || 0) * multiplier;
        nutrition.potassium += (ingredient.potassium_per_100g || 0) * multiplier;
        nutrition.zinc += (ingredient.zinc_per_100g || 0) * multiplier;
        nutrition.chloride += (ingredient.chloride_per_100g || 0) * multiplier;
        nutrition.sulfur += (ingredient.sulfur_per_100g || 0) * multiplier;
        nutrition.iodine += (ingredient.iodine_per_100g || 0) * multiplier;
        nutrition.copper += (ingredient.copper_per_100g || 0) * multiplier;
        nutrition.chromium += (ingredient.chromium_per_100g || 0) * multiplier;
        nutrition.manganese += (ingredient.manganese_per_100g || 0) * multiplier;
        nutrition.selenium += (ingredient.selenium_per_100g || 0) * multiplier;
        nutrition.fluoride += (ingredient.fluoride_per_100g || 0) * multiplier;
        nutrition.molybdenum += (ingredient.molybdenum_per_100g || 0) * multiplier;
        nutrition.cobalt += (ingredient.cobalt_per_100g || 0) * multiplier;
        nutrition.water += (ingredient.water_per_100g || 0) * multiplier;
      } else if (entry.type === 'supplement') {
        const supplement = this.storage.supplements.find(s => s.id === entry.item_id);
        if (!supplement) continue;

        // Calculate multiplier based on servings
        multiplier = entry.quantity / supplement.serving_size;
        
        nutrition.calories += (supplement.calories_per_serving || 0) * multiplier;
        nutrition.protein += (supplement.protein_per_serving || 0) * multiplier;
        nutrition.fat += (supplement.fat_per_serving || 0) * multiplier;
        nutrition.saturated_fat += (supplement.saturated_fat_per_serving || 0) * multiplier;
        nutrition.unsaturated_fat += (supplement.unsaturated_fat_per_serving || 0) * multiplier;
        nutrition.polyunsaturated_fat += (supplement.polyunsaturated_fat_per_serving || 0) * multiplier;
        nutrition.vitamin_a += (supplement.vitamin_a_per_serving || 0) * multiplier;
        nutrition.vitamin_c += (supplement.vitamin_c_per_serving || 0) * multiplier;
        nutrition.vitamin_d += (supplement.vitamin_d_per_serving || 0) * multiplier;
        nutrition.vitamin_e += (supplement.vitamin_e_per_serving || 0) * multiplier;
        nutrition.vitamin_k += (supplement.vitamin_k_per_serving || 0) * multiplier;
        nutrition.thiamine += (supplement.thiamine_per_serving || 0) * multiplier;
        nutrition.riboflavin += (supplement.riboflavin_per_serving || 0) * multiplier;
        nutrition.niacin += (supplement.niacin_per_serving || 0) * multiplier;
        nutrition.vitamin_b6 += (supplement.vitamin_b6_per_serving || 0) * multiplier;
        nutrition.folate += (supplement.folate_per_serving || 0) * multiplier;
        nutrition.vitamin_b12 += (supplement.vitamin_b12_per_serving || 0) * multiplier;
        nutrition.calcium += (supplement.calcium_per_serving || 0) * multiplier;
        nutrition.iron += (supplement.iron_per_serving || 0) * multiplier;
        nutrition.magnesium += (supplement.magnesium_per_serving || 0) * multiplier;
        nutrition.phosphorus += (supplement.phosphorus_per_serving || 0) * multiplier;
        nutrition.potassium += (supplement.potassium_per_serving || 0) * multiplier;
        nutrition.zinc += (supplement.zinc_per_serving || 0) * multiplier;
        nutrition.chloride += (supplement.chloride_per_serving || 0) * multiplier;
        nutrition.sulfur += (supplement.sulfur_per_serving || 0) * multiplier;
        nutrition.iodine += (supplement.iodine_per_serving || 0) * multiplier;
        nutrition.copper += (supplement.copper_per_serving || 0) * multiplier;
        nutrition.chromium += (supplement.chromium_per_serving || 0) * multiplier;
        nutrition.manganese += (supplement.manganese_per_serving || 0) * multiplier;
        nutrition.selenium += (supplement.selenium_per_serving || 0) * multiplier;
        nutrition.fluoride += (supplement.fluoride_per_serving || 0) * multiplier;
        nutrition.molybdenum += (supplement.molybdenum_per_serving || 0) * multiplier;
        nutrition.cobalt += (supplement.cobalt_per_serving || 0) * multiplier;
        nutrition.water += (supplement.water_per_serving || 0) * multiplier;
      } else if (entry.type === 'water') {
        // For water entries, add directly to water total
        // Water entries use standardized units that need conversion to ml
        let waterAmount = entry.quantity;
        
        // Convert different units to ml
        switch (entry.unit) {
          case 'l':
            waterAmount = entry.quantity * 1000; // liters to ml
            break;
          case 'cup':
            waterAmount = entry.quantity * 240; // cups to ml (standard US cup)
            break;
          case 'glass':
            waterAmount = entry.quantity * 250; // glass to ml (standard glass)
            break;
          case 'ml':
          default:
            waterAmount = entry.quantity; // already in ml
            break;
        }
        
        nutrition.water += waterAmount;
      } else if (entry.type === 'recipe') {
        // TODO: Calculate recipe nutrition based on ingredients
        // This would require a more complex calculation
      }
    }

    return nutrition;
  }

  async getUserNutritionProfile(userId: number): Promise<any> {
    const user = this.storage.users.find(u => u.id === userId);
    if (!user) return null;

    return {
      weight: user.weight,
      height: user.height,
      age: user.age,
      gender: user.gender,
      activity_level: user.activity_level,
      goal: user.goal
    };
  }
}

// Singleton instance
export const mockDb = new MockDatabase();
