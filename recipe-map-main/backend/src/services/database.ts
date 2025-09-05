import { mockDb } from './mockDatabase';
import pool from '../database/connection';
import { 
  Ingredient, 
  Recipe, 
  Supplement, 
  User, 
  IntakeEntry 
} from '../types';

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

export class DatabaseService {
  // Users
  async findUserByEmail(email: string): Promise<User | null> {
    if (USE_MOCK_DATA) {
      return mockDb.findUserByEmail(email);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    if (USE_MOCK_DATA) {
      return mockDb.findUserByUsername(username);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async findUserById(id: number): Promise<User | null> {
    if (USE_MOCK_DATA) {
      return mockDb.findUserById(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    if (USE_MOCK_DATA) {
      return mockDb.createUser(userData);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO users (username, email, password_hash, weight, height, age, gender, activity_level, goal)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        userData.username,
        userData.email,
        userData.password_hash,
        userData.weight,
        userData.height,
        userData.age,
        userData.gender,
        userData.activity_level,
        userData.goal
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Ingredients
  async getIngredients(limit = 100, offset = 0, search?: string): Promise<{ data: Ingredient[], total: number }> {
    if (USE_MOCK_DATA) {
      return mockDb.getIngredients(limit, offset, search);
    }

    const client = await pool.connect();
    try {
      let query = 'SELECT * FROM ingredients';
      let countQuery = 'SELECT COUNT(*) FROM ingredients';
      const params: any[] = [];
      
      if (search) {
        query += ' WHERE name ILIKE $1 OR brand ILIKE $1 OR category ILIKE $1';
        countQuery += ' WHERE name ILIKE $1 OR brand ILIKE $1 OR category ILIKE $1';
        params.push(`%${search}%`);
      }
      
      query += ` ORDER BY name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const [dataResult, countResult] = await Promise.all([
        client.query(query, params),
        client.query(countQuery, search ? [`%${search}%`] : [])
      ]);

      return {
        data: dataResult.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  async getIngredientById(id: number): Promise<Ingredient | null> {
    if (USE_MOCK_DATA) {
      return mockDb.getIngredientById(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM ingredients WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async createIngredient(ingredientData: Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>): Promise<Ingredient> {
    if (USE_MOCK_DATA) {
      return mockDb.createIngredient(ingredientData);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO ingredients (
          name, brand, description, category, unit, calories_per_100g, protein_per_100g,
          carbs_per_100g, fat_per_100g, saturated_fat_per_100g, unsaturated_fat_per_100g,
          polyunsaturated_fat_per_100g, fiber_per_100g, sugar_per_100g, sodium_per_100g,
          vitamin_a_per_100g, vitamin_c_per_100g, vitamin_d_per_100g, vitamin_e_per_100g,
          vitamin_k_per_100g, thiamine_per_100g, riboflavin_per_100g, niacin_per_100g,
          vitamin_b6_per_100g, folate_per_100g, vitamin_b12_per_100g, calcium_per_100g,
          iron_per_100g, magnesium_per_100g, phosphorus_per_100g, potassium_per_100g, zinc_per_100g,
          chloride_per_100g, sulfur_per_100g, iodine_per_100g, copper_per_100g, chromium_per_100g,
          manganese_per_100g, selenium_per_100g, fluoride_per_100g, molybdenum_per_100g, 
          cobalt_per_100g, water_per_100g
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
          $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37,
          $38, $39, $40, $41, $42
        ) RETURNING *
      `, [
        ingredientData.name, ingredientData.brand, ingredientData.description,
        ingredientData.category, ingredientData.unit, ingredientData.calories_per_100g,
        ingredientData.protein_per_100g, ingredientData.carbs_per_100g, ingredientData.fat_per_100g,
        ingredientData.saturated_fat_per_100g, ingredientData.unsaturated_fat_per_100g,
        ingredientData.polyunsaturated_fat_per_100g, ingredientData.fiber_per_100g,
        ingredientData.sugar_per_100g, ingredientData.sodium_per_100g, ingredientData.vitamin_a_per_100g,
        ingredientData.vitamin_c_per_100g, ingredientData.vitamin_d_per_100g, ingredientData.vitamin_e_per_100g,
        ingredientData.vitamin_k_per_100g, ingredientData.thiamine_per_100g, ingredientData.riboflavin_per_100g,
        ingredientData.niacin_per_100g, ingredientData.vitamin_b6_per_100g, ingredientData.folate_per_100g,
        ingredientData.vitamin_b12_per_100g, ingredientData.calcium_per_100g, ingredientData.iron_per_100g,
        ingredientData.magnesium_per_100g, ingredientData.phosphorus_per_100g, ingredientData.potassium_per_100g,
        ingredientData.zinc_per_100g, ingredientData.chloride_per_100g, ingredientData.sulfur_per_100g,
        ingredientData.iodine_per_100g, ingredientData.copper_per_100g, ingredientData.chromium_per_100g,
        ingredientData.manganese_per_100g, ingredientData.selenium_per_100g, ingredientData.fluoride_per_100g,
        ingredientData.molybdenum_per_100g, ingredientData.cobalt_per_100g, ingredientData.water_per_100g
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  // Similar methods for recipes, supplements, and intake entries...
  // For brevity, I'll implement the key ones

  async getRecipes(limit = 100, offset = 0, search?: string, category?: string, ingredient?: string): Promise<{ data: Recipe[], total: number }> {
    if (USE_MOCK_DATA) {
      return mockDb.getRecipes(limit, offset, search, category, ingredient);
    }

    const client = await pool.connect();
    try {
      let query = `
        SELECT DISTINCT r.* 
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
      `;
      let countQuery = `
        SELECT COUNT(DISTINCT r.id) 
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
      `;
      const params: any[] = [];
      const whereConditions: string[] = [];
      
      if (search) {
        whereConditions.push(`(r.name ILIKE $${params.length + 1} OR r.category ILIKE $${params.length + 1} OR r.description ILIKE $${params.length + 1})`);
        params.push(`%${search}%`);
      }
      
      if (category) {
        whereConditions.push(`r.category ILIKE $${params.length + 1}`);
        params.push(`%${category}%`);
      }
      
      if (ingredient) {
        whereConditions.push(`i.name ILIKE $${params.length + 1}`);
        params.push(`%${ingredient}%`);
      }
      
      if (whereConditions.length > 0) {
        const whereClause = ` WHERE ${whereConditions.join(' AND ')}`;
        query += whereClause;
        countQuery += whereClause;
      }
      
      query += ` ORDER BY r.name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const [dataResult, countResult] = await Promise.all([
        client.query(query, params),
        client.query(countQuery, params.slice(0, -2)) // Remove limit and offset for count query
      ]);

      return {
        data: dataResult.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  async getSupplements(limit = 100, offset = 0, search?: string): Promise<{ data: Supplement[], total: number }> {
    if (USE_MOCK_DATA) {
      return mockDb.getSupplements(limit, offset, search);
    }

    const client = await pool.connect();
    try {
      let query = 'SELECT * FROM supplements';
      let countQuery = 'SELECT COUNT(*) FROM supplements';
      const params: any[] = [];
      
      if (search) {
        query += ' WHERE name ILIKE $1 OR brand ILIKE $1';
        countQuery += ' WHERE name ILIKE $1 OR brand ILIKE $1';
        params.push(`%${search}%`);
      }
      
      query += ` ORDER BY name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const [dataResult, countResult] = await Promise.all([
        client.query(query, params),
        client.query(countQuery, search ? [`%${search}%`] : [])
      ]);

      return {
        data: dataResult.rows,
        total: parseInt(countResult.rows[0].count)
      };
    } finally {
      client.release();
    }
  }

  async getIntakeEntriesByDate(userId: number, date: string): Promise<IntakeEntry[]> {
    if (USE_MOCK_DATA) {
      return mockDb.getIntakeEntriesByDate(userId, date);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT ie.*, 
               CASE 
                 WHEN ie.type = 'ingredient' THEN i.name
                 WHEN ie.type = 'recipe' THEN r.name
                 WHEN ie.type = 'supplement' THEN s.name
                 WHEN ie.type = 'water' THEN 'Water'
               END as item_name
        FROM intake_entries ie
        LEFT JOIN ingredients i ON ie.type = 'ingredient' AND ie.item_id = i.id
        LEFT JOIN recipes r ON ie.type = 'recipe' AND ie.item_id = r.id
        LEFT JOIN supplements s ON ie.type = 'supplement' AND ie.item_id = s.id
        WHERE ie.user_id = $1 AND ie.entry_date = $2
        ORDER BY ie.entry_time
      `, [userId, date]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getIntakeEntriesByDateRange(userId: number, startDate: string, endDate: string): Promise<IntakeEntry[]> {
    if (USE_MOCK_DATA) {
      return mockDb.getIntakeEntriesByDateRange(userId, startDate, endDate);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT ie.*, 
               CASE 
                 WHEN ie.type = 'ingredient' THEN i.name
                 WHEN ie.type = 'recipe' THEN r.name
                 WHEN ie.type = 'supplement' THEN s.name
                 WHEN ie.type = 'water' THEN 'Water'
               END as item_name
        FROM intake_entries ie
        LEFT JOIN ingredients i ON ie.type = 'ingredient' AND ie.item_id = i.id
        LEFT JOIN recipes r ON ie.type = 'recipe' AND ie.item_id = r.id
        LEFT JOIN supplements s ON ie.type = 'supplement' AND ie.item_id = s.id
        WHERE ie.user_id = $1 AND ie.entry_date >= $2 AND ie.entry_date <= $3
        ORDER BY ie.entry_date, ie.entry_time
      `, [userId, startDate, endDate]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createIntakeEntry(entryData: Omit<IntakeEntry, 'id' | 'created_at' | 'updated_at'>): Promise<IntakeEntry> {
    if (USE_MOCK_DATA) {
      return mockDb.createIntakeEntry(entryData);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO intake_entries (user_id, type, item_id, quantity, unit, entry_date, entry_time, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        entryData.user_id,
        entryData.type,
        entryData.item_id,
        entryData.quantity,
        entryData.unit,
        entryData.entry_date,
        entryData.entry_time,
        entryData.notes
      ]);
      
      // Get the item name for the response
      const entry = result.rows[0];
      let itemNameResult;
      
      switch (entry.type) {
        case 'ingredient':
          itemNameResult = await client.query('SELECT name FROM ingredients WHERE id = $1', [entry.item_id]);
          break;
        case 'recipe':
          itemNameResult = await client.query('SELECT name FROM recipes WHERE id = $1', [entry.item_id]);
          break;
        case 'supplement':
          itemNameResult = await client.query('SELECT name FROM supplements WHERE id = $1', [entry.item_id]);
          break;
        case 'water':
          entry.item_name = 'Water';
          return entry;
      }
      
      entry.item_name = itemNameResult?.rows[0]?.name || 'Unknown';
      return entry;
    } finally {
      client.release();
    }
  }

  async updateIngredient(id: number, ingredientData: Partial<Ingredient>): Promise<Ingredient | null> {
    if (USE_MOCK_DATA) {
      return mockDb.updateIngredient(id, ingredientData);
    }

    const client = await pool.connect();
    try {
      const updateFields = Object.keys(ingredientData);
      const updateValues = Object.values(ingredientData);

      if (updateFields.length === 0) {
        return null;
      }

      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      const result = await client.query(
        `UPDATE ingredients SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id, ...updateValues]
      );

      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async deleteIngredient(id: number): Promise<boolean> {
    if (USE_MOCK_DATA) {
      return mockDb.deleteIngredient(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM ingredients WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  async getIngredientCategories(): Promise<string[]> {
    if (USE_MOCK_DATA) {
      return mockDb.getIngredientCategories();
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT DISTINCT category FROM ingredients ORDER BY category');
      return result.rows.map(row => row.category);
    } finally {
      client.release();
    }
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    if (USE_MOCK_DATA) {
      return mockDb.getRecipeById(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM recipes WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async getRecipeIngredients(recipeId: number): Promise<{ id: number; ingredient_id: number; ingredient_name: string; quantity: number; unit: string; }[]> {
    if (USE_MOCK_DATA) {
      return mockDb.getRecipeIngredients(recipeId);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT ri.id, ri.ingredient_id, i.name as ingredient_name, ri.quantity, ri.unit
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id = $1
        ORDER BY ri.id
      `, [recipeId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async createRecipe(recipeData: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>): Promise<Recipe> {
    if (USE_MOCK_DATA) {
      return mockDb.createRecipe(recipeData);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO recipes (name, description, instructions, prep_time, cook_time, servings, category, difficulty)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [
        recipeData.name,
        recipeData.description,
        recipeData.instructions,
        recipeData.prep_time,
        recipeData.cook_time,
        recipeData.servings,
        recipeData.category,
        recipeData.difficulty
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async createRecipeIngredient(recipeId: number, ingredientId: number, quantity: number, unit: string): Promise<void> {
    if (USE_MOCK_DATA) {
      // For mock data, we'd add to the mock storage
      return;
    }

    const client = await pool.connect();
    try {
      await client.query(`
        INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
        VALUES ($1, $2, $3, $4)
      `, [recipeId, ingredientId, quantity, unit]);
    } finally {
      client.release();
    }
  }

  async updateRecipe(id: number, recipeData: Partial<Recipe>): Promise<Recipe | null> {
    if (USE_MOCK_DATA) {
      return mockDb.updateRecipe(id, recipeData);
    }

    const client = await pool.connect();
    try {
      const updateFields = Object.keys(recipeData);
      const updateValues = Object.values(recipeData);

      if (updateFields.length === 0) {
        return null;
      }

      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      const result = await client.query(
        `UPDATE recipes SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id, ...updateValues]
      );

      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async deleteRecipe(id: number): Promise<boolean> {
    if (USE_MOCK_DATA) {
      return mockDb.deleteRecipe(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM recipes WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  async getRecipeCategories(): Promise<string[]> {
    if (USE_MOCK_DATA) {
      return mockDb.getRecipeCategories();
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT DISTINCT category FROM recipes ORDER BY category');
      return result.rows.map(row => row.category);
    } finally {
      client.release();
    }
  }

  async getSupplementById(id: number): Promise<Supplement | null> {
    if (USE_MOCK_DATA) {
      return mockDb.getSupplementById(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM supplements WHERE id = $1', [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async createSupplement(supplementData: Omit<Supplement, 'id' | 'created_at' | 'updated_at'>): Promise<Supplement> {
    if (USE_MOCK_DATA) {
      return mockDb.createSupplement(supplementData);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        INSERT INTO supplements (
          name, brand, description, form, serving_size, serving_unit,
          vitamin_d_per_serving, vitamin_c_per_serving, calcium_per_serving,
          iron_per_serving, vitamin_b12_per_serving, folate_per_serving,
          fat_per_serving, saturated_fat_per_serving, unsaturated_fat_per_serving,
          polyunsaturated_fat_per_serving
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        ) RETURNING *
      `, [
        supplementData.name,
        supplementData.brand,
        supplementData.description,
        supplementData.form,
        supplementData.serving_size,
        supplementData.serving_unit,
        supplementData.vitamin_d_per_serving,
        supplementData.vitamin_c_per_serving,
        supplementData.calcium_per_serving,
        supplementData.iron_per_serving,
        supplementData.vitamin_b12_per_serving,
        supplementData.folate_per_serving,
        supplementData.fat_per_serving,
        supplementData.saturated_fat_per_serving,
        supplementData.unsaturated_fat_per_serving,
        supplementData.polyunsaturated_fat_per_serving
      ]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  async updateSupplement(id: number, supplementData: Partial<Supplement>): Promise<Supplement | null> {
    if (USE_MOCK_DATA) {
      return mockDb.updateSupplement(id, supplementData);
    }

    const client = await pool.connect();
    try {
      const updateFields = Object.keys(supplementData);
      const updateValues = Object.values(supplementData);

      if (updateFields.length === 0) {
        return null;
      }

      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      const result = await client.query(
        `UPDATE supplements SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id, ...updateValues]
      );

      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async deleteSupplement(id: number): Promise<boolean> {
    if (USE_MOCK_DATA) {
      return mockDb.deleteSupplement(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM supplements WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  async getIntakeEntryById(id: number): Promise<IntakeEntry | null> {
    if (USE_MOCK_DATA) {
      return mockDb.getIntakeEntryById(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT ie.*, 
               CASE 
                 WHEN ie.type = 'ingredient' THEN i.name
                 WHEN ie.type = 'recipe' THEN r.name
                 WHEN ie.type = 'supplement' THEN s.name
                 WHEN ie.type = 'water' THEN 'Water'
               END as item_name
        FROM intake_entries ie
        LEFT JOIN ingredients i ON ie.type = 'ingredient' AND ie.item_id = i.id
        LEFT JOIN recipes r ON ie.type = 'recipe' AND ie.item_id = r.id
        LEFT JOIN supplements s ON ie.type = 'supplement' AND ie.item_id = s.id
        WHERE ie.id = $1
      `, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  async updateIntakeEntry(id: number, entryData: Partial<IntakeEntry>): Promise<IntakeEntry | null> {
    if (USE_MOCK_DATA) {
      return mockDb.updateIntakeEntry(id, entryData);
    }

    const client = await pool.connect();
    try {
      const updateFields = Object.keys(entryData);
      const updateValues = Object.values(entryData);

      if (updateFields.length === 0) {
        return null;
      }

      const setClause = updateFields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      
      const result = await client.query(
        `UPDATE intake_entries SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id, ...updateValues]
      );

      const entry = result.rows[0];
      if (!entry) return null;

      // Get the item name for the response
      let itemNameResult;
      switch (entry.type) {
        case 'ingredient':
          itemNameResult = await client.query('SELECT name FROM ingredients WHERE id = $1', [entry.item_id]);
          break;
        case 'recipe':
          itemNameResult = await client.query('SELECT name FROM recipes WHERE id = $1', [entry.item_id]);
          break;
        case 'supplement':
          itemNameResult = await client.query('SELECT name FROM supplements WHERE id = $1', [entry.item_id]);
          break;
        case 'water':
          entry.item_name = 'Water';
          return entry;
      }
      
      entry.item_name = itemNameResult?.rows[0]?.name || 'Unknown';
      return entry;
    } finally {
      client.release();
    }
  }

  async deleteIntakeEntry(id: number): Promise<boolean> {
    if (USE_MOCK_DATA) {
      return mockDb.deleteIntakeEntry(id);
    }

    const client = await pool.connect();
    try {
      const result = await client.query('DELETE FROM intake_entries WHERE id = $1 RETURNING id', [id]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    if (USE_MOCK_DATA) {
      return mockDb.healthCheck();
    }

    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return {
        status: 'OK',
        timestamp: new Date().toISOString()
      };
    } finally {
      client.release();
    }
  }

  // Nutrition calculation methods
  async calculateDailyNutrition(userId: number, date: string): Promise<any> {
    if (USE_MOCK_DATA) {
      return mockDb.calculateDailyNutrition(userId, date);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT 
           ie.type, ie.item_id, ie.quantity, ie.unit,
           -- Ingredient nutrition (complete profile)
           i.calories_per_100g, i.protein_per_100g, i.carbs_per_100g, i.fat_per_100g,
           i.saturated_fat_per_100g, i.unsaturated_fat_per_100g, i.polyunsaturated_fat_per_100g,
           i.fiber_per_100g, i.sugar_per_100g, i.sodium_per_100g,
           i.vitamin_a_per_100g, i.vitamin_c_per_100g, i.vitamin_d_per_100g, i.vitamin_e_per_100g,
           i.vitamin_k_per_100g, i.thiamine_per_100g, i.riboflavin_per_100g, i.niacin_per_100g,
           i.vitamin_b6_per_100g, i.folate_per_100g, i.vitamin_b12_per_100g,
           i.calcium_per_100g, i.iron_per_100g, i.magnesium_per_100g, i.phosphorus_per_100g,
           i.potassium_per_100g, i.zinc_per_100g, i.chloride_per_100g, i.sulfur_per_100g,
           i.iodine_per_100g, i.copper_per_100g, i.chromium_per_100g, i.manganese_per_100g,
           i.selenium_per_100g, i.fluoride_per_100g, i.molybdenum_per_100g, i.cobalt_per_100g,
           i.water_per_100g,
           -- Supplement nutrition (complete profile)
           s.calories_per_serving, s.protein_per_serving, s.fat_per_serving,
           s.saturated_fat_per_serving, s.unsaturated_fat_per_serving, s.polyunsaturated_fat_per_serving,
           s.vitamin_a_per_serving, s.vitamin_c_per_serving, s.vitamin_d_per_serving, s.vitamin_e_per_serving,
           s.vitamin_k_per_serving, s.thiamine_per_serving, s.riboflavin_per_serving, s.niacin_per_serving,
           s.vitamin_b6_per_serving, s.folate_per_serving, s.vitamin_b12_per_serving,
           s.calcium_per_serving, s.iron_per_serving, s.magnesium_per_serving, s.phosphorus_per_serving,
           s.potassium_per_serving, s.zinc_per_serving, s.sodium_per_serving, s.chloride_per_serving,
           s.sulfur_per_serving, s.iodine_per_serving, s.copper_per_serving, s.chromium_per_serving,
           s.manganese_per_serving, s.selenium_per_serving, s.fluoride_per_serving, s.molybdenum_per_serving,
           s.cobalt_per_serving, s.water_per_serving, s.serving_size
         FROM intake_entries ie
         LEFT JOIN ingredients i ON ie.type = 'ingredient' AND ie.item_id = i.id
         LEFT JOIN supplements s ON ie.type = 'supplement' AND ie.item_id = s.id
         WHERE ie.user_id = $1 AND ie.entry_date = $2`,
        [userId, date]
      );

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

      for (const entry of result.rows) {
        let multiplier = 1;

        if (entry.type === 'ingredient') {
          // Calculate multiplier based on quantity (per 100g)
          multiplier = entry.quantity / 100;
          
          nutrition.calories += (entry.calories_per_100g || 0) * multiplier;
          nutrition.protein += (entry.protein_per_100g || 0) * multiplier;
          nutrition.carbs += (entry.carbs_per_100g || 0) * multiplier;
          nutrition.fat += (entry.fat_per_100g || 0) * multiplier;
          nutrition.saturated_fat += (entry.saturated_fat_per_100g || 0) * multiplier;
          nutrition.unsaturated_fat += (entry.unsaturated_fat_per_100g || 0) * multiplier;
          nutrition.polyunsaturated_fat += (entry.polyunsaturated_fat_per_100g || 0) * multiplier;
          nutrition.fiber += (entry.fiber_per_100g || 0) * multiplier;
          nutrition.sugar += (entry.sugar_per_100g || 0) * multiplier;
          nutrition.sodium += (entry.sodium_per_100g || 0) * multiplier;
          nutrition.vitamin_a += (entry.vitamin_a_per_100g || 0) * multiplier;
          nutrition.vitamin_c += (entry.vitamin_c_per_100g || 0) * multiplier;
          nutrition.vitamin_d += (entry.vitamin_d_per_100g || 0) * multiplier;
          nutrition.vitamin_e += (entry.vitamin_e_per_100g || 0) * multiplier;
          nutrition.vitamin_k += (entry.vitamin_k_per_100g || 0) * multiplier;
          nutrition.thiamine += (entry.thiamine_per_100g || 0) * multiplier;
          nutrition.riboflavin += (entry.riboflavin_per_100g || 0) * multiplier;
          nutrition.niacin += (entry.niacin_per_100g || 0) * multiplier;
          nutrition.vitamin_b6 += (entry.vitamin_b6_per_100g || 0) * multiplier;
          nutrition.folate += (entry.folate_per_100g || 0) * multiplier;
          nutrition.vitamin_b12 += (entry.vitamin_b12_per_100g || 0) * multiplier;
          nutrition.calcium += (entry.calcium_per_100g || 0) * multiplier;
          nutrition.iron += (entry.iron_per_100g || 0) * multiplier;
          nutrition.magnesium += (entry.magnesium_per_100g || 0) * multiplier;
          nutrition.phosphorus += (entry.phosphorus_per_100g || 0) * multiplier;
          nutrition.potassium += (entry.potassium_per_100g || 0) * multiplier;
          nutrition.zinc += (entry.zinc_per_100g || 0) * multiplier;
          nutrition.chloride += (entry.chloride_per_100g || 0) * multiplier;
          nutrition.sulfur += (entry.sulfur_per_100g || 0) * multiplier;
          nutrition.iodine += (entry.iodine_per_100g || 0) * multiplier;
          nutrition.copper += (entry.copper_per_100g || 0) * multiplier;
          nutrition.chromium += (entry.chromium_per_100g || 0) * multiplier;
          nutrition.manganese += (entry.manganese_per_100g || 0) * multiplier;
          nutrition.selenium += (entry.selenium_per_100g || 0) * multiplier;
          nutrition.fluoride += (entry.fluoride_per_100g || 0) * multiplier;
          nutrition.molybdenum += (entry.molybdenum_per_100g || 0) * multiplier;
          nutrition.cobalt += (entry.cobalt_per_100g || 0) * multiplier;
          nutrition.water += (entry.water_per_100g || 0) * multiplier;
        } else if (entry.type === 'supplement') {
          // Calculate multiplier based on servings
          multiplier = entry.quantity / entry.serving_size;
          
          nutrition.calories += (entry.calories_per_serving || 0) * multiplier;
          nutrition.protein += (entry.protein_per_serving || 0) * multiplier;
          nutrition.fat += (entry.fat_per_serving || 0) * multiplier;
          nutrition.saturated_fat += (entry.saturated_fat_per_serving || 0) * multiplier;
          nutrition.unsaturated_fat += (entry.unsaturated_fat_per_serving || 0) * multiplier;
          nutrition.polyunsaturated_fat += (entry.polyunsaturated_fat_per_serving || 0) * multiplier;
          nutrition.vitamin_a += (entry.vitamin_a_per_serving || 0) * multiplier;
          nutrition.vitamin_c += (entry.vitamin_c_per_serving || 0) * multiplier;
          nutrition.vitamin_d += (entry.vitamin_d_per_serving || 0) * multiplier;
          nutrition.vitamin_e += (entry.vitamin_e_per_serving || 0) * multiplier;
          nutrition.vitamin_k += (entry.vitamin_k_per_serving || 0) * multiplier;
          nutrition.thiamine += (entry.thiamine_per_serving || 0) * multiplier;
          nutrition.riboflavin += (entry.riboflavin_per_serving || 0) * multiplier;
          nutrition.niacin += (entry.niacin_per_serving || 0) * multiplier;
          nutrition.vitamin_b6 += (entry.vitamin_b6_per_serving || 0) * multiplier;
          nutrition.folate += (entry.folate_per_serving || 0) * multiplier;
          nutrition.vitamin_b12 += (entry.vitamin_b12_per_serving || 0) * multiplier;
          nutrition.calcium += (entry.calcium_per_serving || 0) * multiplier;
          nutrition.iron += (entry.iron_per_serving || 0) * multiplier;
          nutrition.magnesium += (entry.magnesium_per_serving || 0) * multiplier;
          nutrition.phosphorus += (entry.phosphorus_per_serving || 0) * multiplier;
          nutrition.potassium += (entry.potassium_per_serving || 0) * multiplier;
          nutrition.zinc += (entry.zinc_per_serving || 0) * multiplier;
          nutrition.chloride += (entry.chloride_per_serving || 0) * multiplier;
          nutrition.sulfur += (entry.sulfur_per_serving || 0) * multiplier;
          nutrition.iodine += (entry.iodine_per_serving || 0) * multiplier;
          nutrition.copper += (entry.copper_per_serving || 0) * multiplier;
          nutrition.chromium += (entry.chromium_per_serving || 0) * multiplier;
          nutrition.manganese += (entry.manganese_per_serving || 0) * multiplier;
          nutrition.selenium += (entry.selenium_per_serving || 0) * multiplier;
          nutrition.fluoride += (entry.fluoride_per_serving || 0) * multiplier;
          nutrition.molybdenum += (entry.molybdenum_per_serving || 0) * multiplier;
          nutrition.cobalt += (entry.cobalt_per_serving || 0) * multiplier;
          nutrition.water += (entry.water_per_serving || 0) * multiplier;
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
          // this is not really necessary because recipes are calculated with sepereate ingredients anyways
        }
      }

      return nutrition;
    } finally {
      client.release();
    }
  }

  async getUserNutritionProfile(userId: number): Promise<any> {
    if (USE_MOCK_DATA) {
      return mockDb.getUserNutritionProfile(userId);
    }

    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT weight, height, age, gender, activity_level, goal FROM users WHERE id = $1',
        [userId]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

// Singleton instance
export const dbService = new DatabaseService();
