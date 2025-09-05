import pool from './connection';
import bcrypt from 'bcryptjs';

export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create table    // Insert sample data
    await insertSampleData(client);

    console.log('Database tables created successfully');  await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        weight DECIMAL(5,2),
        height DECIMAL(5,2),
        age INTEGER,
        gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
        activity_level DECIMAL(3,2) DEFAULT 1.5,
        goal VARCHAR(20) DEFAULT 'maintain' CHECK (goal IN ('maintain', 'lose', 'gain')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        brand VARCHAR(100),
        description TEXT,
        category VARCHAR(50) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        calories_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
        protein_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
        carbs_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
        fat_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
        saturated_fat_per_100g DECIMAL(8,2) DEFAULT 0,
        unsaturated_fat_per_100g DECIMAL(8,2) DEFAULT 0,
        polyunsaturated_fat_per_100g DECIMAL(8,2) DEFAULT 0,
        fiber_per_100g DECIMAL(8,2) DEFAULT 0,
        sugar_per_100g DECIMAL(8,2) DEFAULT 0,
        sodium_per_100g DECIMAL(8,2) DEFAULT 0,
        vitamin_a_per_100g DECIMAL(8,2) DEFAULT 0,
        vitamin_c_per_100g DECIMAL(8,2) DEFAULT 0,
        vitamin_d_per_100g DECIMAL(8,2) DEFAULT 0,
        vitamin_e_per_100g DECIMAL(8,2) DEFAULT 0,
        vitamin_k_per_100g DECIMAL(8,2) DEFAULT 0,
        thiamine_per_100g DECIMAL(8,2) DEFAULT 0,
        riboflavin_per_100g DECIMAL(8,2) DEFAULT 0,
        niacin_per_100g DECIMAL(8,2) DEFAULT 0,
        vitamin_b6_per_100g DECIMAL(8,2) DEFAULT 0,
        folate_per_100g DECIMAL(8,2) DEFAULT 0,
        vitamin_b12_per_100g DECIMAL(8,2) DEFAULT 0,
        calcium_per_100g DECIMAL(8,2) DEFAULT 0,
        iron_per_100g DECIMAL(8,2) DEFAULT 0,
        magnesium_per_100g DECIMAL(8,2) DEFAULT 0,
        phosphorus_per_100g DECIMAL(8,2) DEFAULT 0,
        potassium_per_100g DECIMAL(8,2) DEFAULT 0,
        zinc_per_100g DECIMAL(8,2) DEFAULT 0,
        sodium_per_100g DECIMAL(8,2) DEFAULT 0,
        chloride_per_100g DECIMAL(8,2) DEFAULT 0,
        sulfur_per_100g DECIMAL(8,2) DEFAULT 0,
        iodine_per_100g DECIMAL(8,2) DEFAULT 0,
        copper_per_100g DECIMAL(8,2) DEFAULT 0,
        chromium_per_100g DECIMAL(8,2) DEFAULT 0,
        manganese_per_100g DECIMAL(8,2) DEFAULT 0,
        selenium_per_100g DECIMAL(8,2) DEFAULT 0,
        fluoride_per_100g DECIMAL(8,2) DEFAULT 0,
        molybdenum_per_100g DECIMAL(8,2) DEFAULT 0,
        cobalt_per_100g DECIMAL(8,2) DEFAULT 0,
        water_per_100g DECIMAL(8,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        instructions TEXT[] NOT NULL,
        prep_time INTEGER,
        cook_time INTEGER,
        servings INTEGER NOT NULL DEFAULT 1,
        category VARCHAR(50) NOT NULL,
        difficulty VARCHAR(10) CHECK (difficulty IN ('easy', 'medium', 'hard')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
        quantity DECIMAL(8,2) NOT NULL,
        unit VARCHAR(20) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS supplements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        brand VARCHAR(100),
        description TEXT,
        form VARCHAR(20) CHECK (form IN ('tablet', 'capsule', 'powder', 'liquid')),
        serving_size DECIMAL(8,2) NOT NULL,
        serving_unit VARCHAR(20) NOT NULL,
        calories_per_serving DECIMAL(8,2) DEFAULT 0,
        protein_per_serving DECIMAL(8,2) DEFAULT 0,
        fat_per_serving DECIMAL(8,2) DEFAULT 0,
        saturated_fat_per_serving DECIMAL(8,2) DEFAULT 0,
        unsaturated_fat_per_serving DECIMAL(8,2) DEFAULT 0,
        polyunsaturated_fat_per_serving DECIMAL(8,2) DEFAULT 0,
        vitamin_a_per_serving DECIMAL(8,2) DEFAULT 0,
        vitamin_c_per_serving DECIMAL(8,2) DEFAULT 0,
        vitamin_d_per_serving DECIMAL(8,2) DEFAULT 0,
        vitamin_e_per_serving DECIMAL(8,2) DEFAULT 0,
        vitamin_k_per_serving DECIMAL(8,2) DEFAULT 0,
        thiamine_per_serving DECIMAL(8,2) DEFAULT 0,
        riboflavin_per_serving DECIMAL(8,2) DEFAULT 0,
        niacin_per_serving DECIMAL(8,2) DEFAULT 0,
        vitamin_b6_per_serving DECIMAL(8,2) DEFAULT 0,
        folate_per_serving DECIMAL(8,2) DEFAULT 0,
        vitamin_b12_per_serving DECIMAL(8,2) DEFAULT 0,
        calcium_per_serving DECIMAL(8,2) DEFAULT 0,
        iron_per_serving DECIMAL(8,2) DEFAULT 0,
        magnesium_per_serving DECIMAL(8,2) DEFAULT 0,
        phosphorus_per_serving DECIMAL(8,2) DEFAULT 0,
        potassium_per_serving DECIMAL(8,2) DEFAULT 0,
        zinc_per_serving DECIMAL(8,2) DEFAULT 0,
        sodium_per_serving DECIMAL(8,2) DEFAULT 0,
        chloride_per_serving DECIMAL(8,2) DEFAULT 0,
        sulfur_per_serving DECIMAL(8,2) DEFAULT 0,
        iodine_per_serving DECIMAL(8,2) DEFAULT 0,
        copper_per_serving DECIMAL(8,2) DEFAULT 0,
        chromium_per_serving DECIMAL(8,2) DEFAULT 0,
        manganese_per_serving DECIMAL(8,2) DEFAULT 0,
        selenium_per_serving DECIMAL(8,2) DEFAULT 0,
        fluoride_per_serving DECIMAL(8,2) DEFAULT 0,
        molybdenum_per_serving DECIMAL(8,2) DEFAULT 0,
        cobalt_per_serving DECIMAL(8,2) DEFAULT 0,
        water_per_serving DECIMAL(8,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS intake_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        entry_date DATE NOT NULL,
        entry_time TIME NOT NULL,
        type VARCHAR(20) CHECK (type IN ('ingredient', 'recipe', 'supplement', 'water')),
        item_id INTEGER NOT NULL,
        quantity DECIMAL(8,2) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_ingredients_name ON ingredients(name);
      CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);
      CREATE INDEX IF NOT EXISTS idx_supplements_name ON supplements(name);
      CREATE INDEX IF NOT EXISTS idx_intake_entries_user_date ON intake_entries(user_id, entry_date);
      CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);
    `);

    // Insert some sample data
    await insertSampleData(client);

    console.log('Database tables created successfully');
  } finally {
    client.release();
  }
}

async function insertSampleData(client: any) {
  // Insert sample admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  
  await client.query(`
    INSERT INTO users (username, email, password_hash, weight, height, age, gender, activity_level, goal)
    VALUES ('admin', 'admin@nutrienttracker.com', $1, 70, 175, 30, 'male', 1.5, 'maintain')
    ON CONFLICT (username) DO NOTHING;
  `, [adminPasswordHash]);

  // Insert sample ingredients
  await client.query(`
    INSERT INTO ingredients (name, category, unit, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, saturated_fat_per_100g, unsaturated_fat_per_100g, polyunsaturated_fat_per_100g, fiber_per_100g, calcium_per_100g, iron_per_100g, vitamin_c_per_100g)
    VALUES 
      ('Chicken Breast', 'Meat', 'g', 165, 31, 0, 3.6, 1.0, 1.5, 0.8, 0, 15, 0.9, 0),
      ('Brown Rice', 'Grains', 'g', 111, 2.6, 23, 0.9, 0.2, 0.3, 0.3, 1.8, 23, 1.2, 0),
      ('Broccoli', 'Vegetables', 'g', 34, 2.8, 7, 0.4, 0.1, 0.1, 0.1, 2.6, 47, 0.7, 89.2),
      ('Banana', 'Fruits', 'g', 89, 1.1, 23, 0.3, 0.1, 0.1, 0.1, 2.6, 5, 0.3, 8.7),
      ('Whole Milk', 'Dairy', 'ml', 61, 3.2, 4.8, 3.3, 2.1, 0.8, 0.1, 0, 113, 0.1, 0),
      ('Oats', 'Grains', 'g', 389, 16.9, 66.3, 6.9, 1.2, 2.2, 2.5, 10.6, 54, 4.7, 0),
      ('Almonds', 'Nuts', 'g', 579, 21.2, 21.6, 49.9, 3.8, 31.6, 12.3, 12.5, 269, 3.7, 0),
      ('Salmon', 'Fish', 'g', 208, 20.4, 0, 12.4, 3.2, 3.8, 4.0, 0, 12, 0.8, 0),
      ('Sweet Potato', 'Vegetables', 'g', 86, 1.6, 20.1, 0.1, 0.0, 0.0, 0.0, 3, 30, 0.6, 2.4),
      ('Spinach', 'Vegetables', 'g', 23, 2.9, 3.6, 0.4, 0.1, 0.1, 0.2, 2.2, 99, 2.7, 28.1)
    ON CONFLICT DO NOTHING;
  `);

  // Insert sample supplements
  await client.query(`
    INSERT INTO supplements (name, brand, form, serving_size, serving_unit, calories_per_serving, fat_per_serving, saturated_fat_per_serving, unsaturated_fat_per_serving, polyunsaturated_fat_per_serving, vitamin_d_per_serving, calcium_per_serving, vitamin_b12_per_serving)
    VALUES 
      ('Vitamin D3', 'Nature Made', 'tablet', 1, 'tablet', 0, 0, 0, 0, 0, 25, 0, 0),
      ('Calcium + Magnesium', 'Kirkland', 'tablet', 1, 'tablet', 0, 0, 0, 0, 0, 0, 500, 0),
      ('B-Complex', 'NOW Foods', 'capsule', 1, 'capsule', 5, 0, 0, 0, 0, 0, 0, 25),
      ('Omega-3 Fish Oil', 'Nordic Naturals', 'capsule', 1, 'capsule', 10, 1, 0.3, 0.2, 0.5, 0, 0, 0),
      ('Multivitamin', 'Centrum', 'tablet', 1, 'tablet', 0, 0, 0, 0, 0, 20, 200, 6)
    ON CONFLICT DO NOTHING;
  `);

  // Insert sample recipes
  const recipeResult = await client.query(`
    INSERT INTO recipes (name, description, instructions, prep_time, cook_time, servings, category, difficulty)
    VALUES 
      ('Grilled Chicken with Rice', 'Simple and healthy meal', ARRAY['Season chicken breast', 'Grill for 6-8 minutes per side', 'Cook rice according to package instructions', 'Serve together'], 10, 20, 2, 'Main Course', 'easy'),
      ('Oatmeal with Banana', 'Nutritious breakfast', ARRAY['Cook oats with milk', 'Slice banana', 'Mix together and serve'], 5, 5, 1, 'Breakfast', 'easy')
    ON CONFLICT DO NOTHING
    RETURNING id, name;
  `);

  // Insert recipe ingredients
  if (recipeResult.rows.length > 0) {
    for (const recipe of recipeResult.rows) {
      if (recipe.name === 'Grilled Chicken with Rice') {
        await client.query(`
          INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
          SELECT $1, i.id, quantities.quantity, quantities.unit
          FROM (
            SELECT 'Chicken Breast' as name, 150.0 as quantity, 'g' as unit
            UNION ALL
            SELECT 'Brown Rice', 100.0, 'g'
          ) as quantities
          JOIN ingredients i ON i.name = quantities.name;
        `, [recipe.id]);
      } else if (recipe.name === 'Oatmeal with Banana') {
        await client.query(`
          INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
          SELECT $1, i.id, quantities.quantity, quantities.unit
          FROM (
            SELECT 'Oats' as name, 50.0 as quantity, 'g' as unit
            UNION ALL
            SELECT 'Whole Milk', 200.0, 'ml'
            UNION ALL
            SELECT 'Banana', 100.0, 'g'
          ) as quantities
          JOIN ingredients i ON i.name = quantities.name;
        `, [recipe.id]);
      }
    }
  }
}
