import pool from '../connection';

export async function migrateToAddFatFields() {
  const client = await pool.connect();
  
  try {
    console.log('Starting migration to add fat fields...');

    // Add polyunsaturated_fat_per_100g to ingredients table
    await client.query(`
      ALTER TABLE ingredients 
      ADD COLUMN IF NOT EXISTS polyunsaturated_fat_per_100g DECIMAL(8,2) DEFAULT 0;
    `);

    // Add fat fields to supplements table
    await client.query(`
      ALTER TABLE supplements 
      ADD COLUMN IF NOT EXISTS fat_per_serving DECIMAL(8,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS saturated_fat_per_serving DECIMAL(8,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS unsaturated_fat_per_serving DECIMAL(8,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS polyunsaturated_fat_per_serving DECIMAL(8,2) DEFAULT 0;
    `);

    // Update sample data with fat values if they exist
    console.log('Updating sample ingredients with polyunsaturated fat values...');
    
    // Update ingredients
    const ingredientUpdates = [
      { name: 'Chicken Breast', saturated: 1.0, unsaturated: 1.5, polyunsaturated: 0.8 },
      { name: 'Brown Rice', saturated: 0.2, unsaturated: 0.3, polyunsaturated: 0.3 },
      { name: 'Broccoli', saturated: 0.1, unsaturated: 0.1, polyunsaturated: 0.1 },
      { name: 'Banana', saturated: 0.1, unsaturated: 0.1, polyunsaturated: 0.1 },
      { name: 'Whole Milk', saturated: 2.1, unsaturated: 0.8, polyunsaturated: 0.1 },
      { name: 'Oats', saturated: 1.2, unsaturated: 2.2, polyunsaturated: 2.5 },
      { name: 'Almonds', saturated: 3.8, unsaturated: 31.6, polyunsaturated: 12.3 },
      { name: 'Salmon', saturated: 3.2, unsaturated: 3.8, polyunsaturated: 4.0 },
      { name: 'Sweet Potato', saturated: 0.0, unsaturated: 0.0, polyunsaturated: 0.0 },
      { name: 'Spinach', saturated: 0.1, unsaturated: 0.1, polyunsaturated: 0.2 }
    ];

    for (const ingredient of ingredientUpdates) {
      await client.query(`
        UPDATE ingredients 
        SET 
          saturated_fat_per_100g = $1,
          unsaturated_fat_per_100g = $2,
          polyunsaturated_fat_per_100g = $3
        WHERE name = $4
      `, [ingredient.saturated, ingredient.unsaturated, ingredient.polyunsaturated, ingredient.name]);
    }

    // Update supplements
    console.log('Updating sample supplements with fat values...');
    
    const supplementUpdates = [
      { name: 'Vitamin D3', calories: 0, fat: 0, saturated: 0, unsaturated: 0, polyunsaturated: 0 },
      { name: 'Calcium + Magnesium', calories: 0, fat: 0, saturated: 0, unsaturated: 0, polyunsaturated: 0 },
      { name: 'B-Complex', calories: 5, fat: 0, saturated: 0, unsaturated: 0, polyunsaturated: 0 },
      { name: 'Omega-3 Fish Oil', calories: 10, fat: 1, saturated: 0.3, unsaturated: 0.2, polyunsaturated: 0.5 },
      { name: 'Multivitamin', calories: 0, fat: 0, saturated: 0, unsaturated: 0, polyunsaturated: 0 }
    ];

    for (const supplement of supplementUpdates) {
      await client.query(`
        UPDATE supplements 
        SET 
          calories_per_serving = $1,
          fat_per_serving = $2,
          saturated_fat_per_serving = $3,
          unsaturated_fat_per_serving = $4,
          polyunsaturated_fat_per_serving = $5
        WHERE name = $6
      `, [supplement.calories, supplement.fat, supplement.saturated, supplement.unsaturated, supplement.polyunsaturated, supplement.name]);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateToAddFatFields()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}
