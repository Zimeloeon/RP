# Import Data Structure Documentation

This directory contains JSON files that can be imported into the recipe-map application. The import service supports both ingredients and recipes data.

## Environment Variables

Add the following to your `.env` file to configure import behavior:

```env
# Enable automatic import on server startup
AUTO_IMPORT_ON_STARTUP=true
```

## API Endpoints

- `POST /api/import/all` - Import all JSON files from the import directory
- `POST /api/import/file/:filename` - Import a specific file
- `GET /api/import/status` - Get import service status

**Note:** All import endpoints require authentication.

## JSON File Structure

### Ingredients File

Ingredients files should contain an array of ingredient objects or a single ingredient object. The file can have the following structure:

#### Multiple Ingredients
```json
{
  "ingredients": [
    {
      "name": "Chicken Breast",
      "brand": "Organic Valley",
      "description": "Boneless, skinless chicken breast",
      "category": "Meat",
      "unit": "g",
      "calories_per_100g": 165,
      "protein_per_100g": 31.0,
      "carbs_per_100g": 0,
      "fat_per_100g": 3.6,
      "saturated_fat_per_100g": 1.0,
      "unsaturated_fat_per_100g": 1.5,
      "polyunsaturated_fat_per_100g": 0.8,
      "fiber_per_100g": 0,
      "sugar_per_100g": 0,
      "sodium_per_100g": 15,
      "vitamin_a_per_100g": 0,
      "vitamin_c_per_100g": 0,
      "vitamin_d_per_100g": 0,
      "vitamin_e_per_100g": 0.2,
      "vitamin_k_per_100g": 0,
      "thiamine_per_100g": 0.07,
      "riboflavin_per_100g": 0.13,
      "niacin_per_100g": 14.8,
      "vitamin_b6_per_100g": 1.0,
      "folate_per_100g": 4,
      "vitamin_b12_per_100g": 0.3,
      "calcium_per_100g": 15,
      "iron_per_100g": 0.9,
      "magnesium_per_100g": 29,
      "phosphorus_per_100g": 220,
      "potassium_per_100g": 256,
      "zinc_per_100g": 0.9,
      "chloride_per_100g": 0,
      "sulfur_per_100g": 0,
      "iodine_per_100g": 0,
      "copper_per_100g": 0.04,
      "chromium_per_100g": 0,
      "manganese_per_100g": 0.02,
      "selenium_per_100g": 27.6,
      "fluoride_per_100g": 0,
      "molybdenum_per_100g": 0,
      "cobalt_per_100g": 0,
      "water_per_100g": 73.7
    }
  ]
}
```

#### Single Ingredient
```json
{
  "name": "Brown Rice",
  "category": "Grains",
  "unit": "g",
  "calories_per_100g": 111,
  "protein_per_100g": 2.6,
  "carbs_per_100g": 23,
  "fat_per_100g": 0.9
}
```

### Recipes File

Recipes files should contain an array of recipe objects or a single recipe object:

#### Multiple Recipes
```json
{
  "recipes": [
    {
      "name": "Grilled Chicken Salad",
      "description": "A healthy and delicious grilled chicken salad",
      "instructions": [
        "Season the chicken breast with salt and pepper",
        "Grill the chicken for 6-8 minutes per side",
        "Let chicken rest for 5 minutes, then slice",
        "Combine mixed greens, tomatoes, and cucumber in a bowl",
        "Top with sliced chicken and dressing"
      ],
      "prep_time": 15,
      "cook_time": 20,
      "servings": 2,
      "category": "Main Course",
      "difficulty": "easy",
      "ingredients": [
        {
          "ingredient_name": "Chicken Breast",
          "quantity": 200,
          "unit": "g"
        },
        {
          "ingredient_name": "Mixed Greens",
          "quantity": 100,
          "unit": "g"
        },
        {
          "ingredient_name": "Cherry Tomatoes",
          "quantity": 50,
          "unit": "g"
        }
      ]
    }
  ]
}
```

#### Single Recipe
```json
{
  "name": "Simple Oatmeal",
  "instructions": [
    "Bring water to boil",
    "Add oats and cook for 5 minutes",
    "Serve hot"
  ],
  "category": "Breakfast",
  "servings": 1,
  "ingredients": [
    {
      "ingredient_name": "Oats",
      "quantity": 50,
      "unit": "g"
    }
  ]
}
```

## Field Descriptions

### Ingredient Fields

#### Required Fields
- `name` (string): Name of the ingredient
- `category` (string): Category (e.g., "Meat", "Vegetables", "Grains")
- `unit` (string): Base unit for measurements (e.g., "g", "ml", "oz")

#### Recommended Fields
- `calories_per_100g` (number): Calories per 100g/ml
- `protein_per_100g` (number): Protein content per 100g/ml
- `carbs_per_100g` (number): Carbohydrate content per 100g/ml
- `fat_per_100g` (number): Fat content per 100g/ml

#### Optional Fields
- `brand` (string): Brand name
- `description` (string): Detailed description
- `saturated_fat_per_100g` (number): Saturated fat content
- `unsaturated_fat_per_100g` (number): Unsaturated fat content
- `polyunsaturated_fat_per_100g` (number): Polyunsaturated fat content
- `fiber_per_100g` (number): Fiber content
- `sugar_per_100g` (number): Sugar content
- `sodium_per_100g` (number): Sodium content (mg)

#### Vitamin Fields (all optional, per 100g/ml)
- `vitamin_a_per_100g` (number): Vitamin A (μg)
- `vitamin_c_per_100g` (number): Vitamin C (mg)
- `vitamin_d_per_100g` (number): Vitamin D (μg)
- `vitamin_e_per_100g` (number): Vitamin E (mg)
- `vitamin_k_per_100g` (number): Vitamin K (μg)
- `thiamine_per_100g` (number): Thiamine/B1 (mg)
- `riboflavin_per_100g` (number): Riboflavin/B2 (mg)
- `niacin_per_100g` (number): Niacin/B3 (mg)
- `vitamin_b6_per_100g` (number): Vitamin B6 (mg)
- `folate_per_100g` (number): Folate (μg)
- `vitamin_b12_per_100g` (number): Vitamin B12 (μg)

#### Mineral Fields (all optional, per 100g/ml)
- `calcium_per_100g` (number): Calcium (mg)
- `iron_per_100g` (number): Iron (mg)
- `magnesium_per_100g` (number): Magnesium (mg)
- `phosphorus_per_100g` (number): Phosphorus (mg)
- `potassium_per_100g` (number): Potassium (mg)
- `zinc_per_100g` (number): Zinc (mg)
- `chloride_per_100g` (number): Chloride (mg)
- `sulfur_per_100g` (number): Sulfur (mg)
- `iodine_per_100g` (number): Iodine (μg)
- `copper_per_100g` (number): Copper (mg)
- `chromium_per_100g` (number): Chromium (μg)
- `manganese_per_100g` (number): Manganese (mg)
- `selenium_per_100g` (number): Selenium (μg)
- `fluoride_per_100g` (number): Fluoride (mg)
- `molybdenum_per_100g` (number): Molybdenum (μg)
- `cobalt_per_100g` (number): Cobalt (μg)
- `water_per_100g` (number): Water content (g)

### Recipe Fields

#### Required Fields
- `name` (string): Name of the recipe
- `instructions` (array of strings): Step-by-step cooking instructions
- `category` (string): Recipe category (e.g., "Breakfast", "Main Course", "Dessert")

#### Recommended Fields
- `servings` (number): Number of servings (default: 1)
- `ingredients` (array): List of ingredients with quantities

#### Optional Fields
- `description` (string): Recipe description
- `prep_time` (number): Preparation time in minutes
- `cook_time` (number): Cooking time in minutes
- `difficulty` (string): One of "easy", "medium", "hard"

#### Recipe Ingredient Fields
Each ingredient in the `ingredients` array should have:
- `ingredient_name` (string): Name of the ingredient (must match an existing ingredient)
- `quantity` (number): Amount needed
- `unit` (string): Unit of measurement

## Data Validation

### Ingredient Validation
- All required fields must be present
- Numeric fields must be non-negative numbers
- `name`, `category`, and `unit` cannot be empty

### Recipe Validation
- All required fields must be present
- `servings` must be a positive number
- `difficulty` must be one of: "easy", "medium", "hard"
- `instructions` can be a string or array of strings

### Duplicate Handling
- **Ingredients**: Duplicates are detected by matching `name` and `brand` (case-insensitive)
- **Recipes**: Duplicates are detected by matching `name` (case-insensitive)
- Existing items are skipped during import

## Example Files

### Sample Ingredients File (ingredients.json)
```json
{
  "ingredients": [
    {
      "name": "Quinoa",
      "category": "Grains",
      "unit": "g",
      "calories_per_100g": 368,
      "protein_per_100g": 14.1,
      "carbs_per_100g": 64.2,
      "fat_per_100g": 6.1,
      "fiber_per_100g": 7.0,
      "iron_per_100g": 4.6,
      "magnesium_per_100g": 197
    },
    {
      "name": "Salmon Fillet",
      "category": "Fish",
      "unit": "g",
      "calories_per_100g": 208,
      "protein_per_100g": 20.4,
      "carbs_per_100g": 0,
      "fat_per_100g": 12.4,
      "vitamin_d_per_100g": 11,
      "vitamin_b12_per_100g": 3.2
    }
  ]
}
```

### Sample Recipes File (recipes.json)
```json
{
  "recipes": [
    {
      "name": "Quinoa Salmon Bowl",
      "description": "Nutritious bowl with quinoa and salmon",
      "instructions": [
        "Cook quinoa according to package directions",
        "Season salmon with lemon and herbs",
        "Pan-fry salmon for 4-5 minutes per side",
        "Serve salmon over quinoa with vegetables"
      ],
      "prep_time": 10,
      "cook_time": 20,
      "servings": 2,
      "category": "Main Course",
      "difficulty": "medium",
      "ingredients": [
        {
          "ingredient_name": "Quinoa",
          "quantity": 100,
          "unit": "g"
        },
        {
          "ingredient_name": "Salmon Fillet",
          "quantity": 200,
          "unit": "g"
        }
      ]
    }
  ]
}
```

## Usage Tips

1. **File Organization**: You can organize your data into multiple files (e.g., `vegetables.json`, `proteins.json`, `breakfast-recipes.json`)

2. **Import Order**: Import ingredients before recipes to ensure all recipe ingredients exist in the database

3. **Testing**: Use the single file import endpoint to test individual files before bulk importing

4. **Error Handling**: Check the import response for any errors or warnings about skipped items

5. **Backup**: Always backup your database before performing large imports

## Troubleshooting

### Common Issues

1. **Missing Ingredients**: If a recipe references an ingredient that doesn't exist, the ingredient reference will be skipped
2. **Invalid JSON**: Ensure your JSON files are properly formatted
3. **Numeric Fields**: All numeric values must be valid numbers (not strings)
4. **File Permissions**: Ensure the import directory is readable by the application

### Import Response

The import service returns detailed statistics:
```json
{
  "success": true,
  "message": "Ingredients: 5 added, 2 skipped of 7 processed. Recipes: 3 added, 1 skipped of 4 processed",
  "stats": {
    "ingredientsProcessed": 7,
    "ingredientsAdded": 5,
    "ingredientsSkipped": 2,
    "recipesProcessed": 4,
    "recipesAdded": 3,
    "recipesSkipped": 1,
    "errors": []
  }
}
```

Use this information to verify successful imports and identify any issues.
