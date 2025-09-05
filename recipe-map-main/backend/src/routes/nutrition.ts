import express from 'express';
import { dbService } from '../services/database';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, NutritionRecommendation } from '../types';

const router = express.Router();

// Calculate nutrition recommendations for user
router.get('/recommendations', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const user = await dbService.getUserNutritionProfile(req.user!.id);

    if (!user) {
      return next(createError('User not found', 404));
    }

    const recommendations = calculateNutritionRecommendations(user);

    const response: ApiResponse<NutritionRecommendation> = {
      success: true,
      data: recommendations,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get daily nutrition summary for a specific date
router.get('/daily/:date', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { date } = req.params;
    
    // Get all intake entries for the date
    const entries = await dbService.getIntakeEntriesByDate(req.user!.id, date);

    // Calculate total nutrition
    const totalNutrition = await dbService.calculateDailyNutrition(req.user!.id, date);
    
    // Get user recommendations
    const user = await dbService.getUserNutritionProfile(req.user!.id);
    
    const recommendations = user 
      ? calculateNutritionRecommendations(user)
      : getDefaultRecommendations();

    const response: ApiResponse = {
      success: true,
      data: {
        entries: entries,
        totalNutrition,
        recommendations,
        percentages: calculatePercentages(totalNutrition, recommendations),
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Get weekly nutrition summary
router.get('/weekly/:startDate', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { startDate } = req.params;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const weeklyData = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      const dateString = currentDate.toISOString().split('T')[0];
      const dailyNutrition = await dbService.calculateDailyNutrition(req.user!.id, dateString);
      
      weeklyData.push({
        date: dateString,
        nutrition: dailyNutrition,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate weekly averages
    const weeklyAverages = calculateWeeklyAverages(weeklyData);

    const response: ApiResponse = {
      success: true,
      data: {
        daily: weeklyData,
        averages: weeklyAverages,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * Calculate daily water needs based on age, gender, PAL value, and weight
 * Based on EFSA recommendations and scientific literature
 */
function calculateWaterNeeds(age: number, gender: string, activityLevel: number, weight: number): number {
  let baseWater: number;
  
  // Age-based base water requirements (ml)
  if (age < 1) {
    baseWater = 800; // Infants 6-12 months
  } else if (age < 3) {
    baseWater = 1300; // Toddlers 1-2 years
  } else if (age < 9) {
    baseWater = 1600; // Children 2-8 years
  } else if (age < 14) {
    baseWater = gender === 'male' ? 2100 : 1900; // Children 9-13 years
  } else if (age < 19) {
    baseWater = gender === 'male' ? 2600 : 1900; // Adolescents 14-18 years
  } else if (age < 51) {
    baseWater = gender === 'male' ? 2500 : 2000; // Adults 19-50 years
  } else if (age < 71) {
    baseWater = gender === 'male' ? 2500 : 2000; // Adults 51-70 years
  } else {
    baseWater = gender === 'male' ? 2300 : 1900; // Elderly 70+ years
  }
  
  // Activity level adjustments based on PAL
  let activityMultiplier = 1.0;
  if (activityLevel >= 2.0) {
    activityMultiplier = 1.4; // Very active - additional 40%
  } else if (activityLevel >= 1.8) {
    activityMultiplier = 1.3; // Active - additional 30%
  } else if (activityLevel >= 1.6) {
    activityMultiplier = 1.2; // Moderately active - additional 20%
  } else if (activityLevel >= 1.4) {
    activityMultiplier = 1.1; // Lightly active - additional 10%
  }
  
  // Weight adjustment (additional 35ml per kg for adults)
  let weightAdjustment = 0;
  if (age >= 18 && weight > 70) {
    weightAdjustment = (weight - 70) * 35;
  }
  
  // Calculate total water needs
  const totalWater = Math.round(baseWater * activityMultiplier + weightAdjustment);
  
  // Ensure minimum and maximum bounds
  return Math.max(1500, Math.min(4000, totalWater));
}

function calculateNutritionRecommendations(user: any): NutritionRecommendation {
  const { weight = 70, height = 170, age = 30, gender = 'male', activity_level = 1.5, goal = 'maintain' } = user;

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Calculate TDEE
  let tdee = bmr * activity_level;

  // Adjust based on goal
  if (goal === 'lose') {
    tdee *= 0.85; // 15% deficit
  } else if (goal === 'gain') {
    tdee *= 1.15; // 15% surplus
  }

  // Calculate macronutrient recommendations
  const protein = weight * 1.6; // 1.6g per kg body weight (EU recommendation for active adults)
  const fat = tdee * 0.30 / 9; // 30% of calories from fat (EU recommendation range 20-35%)
  const carbs = (tdee - (protein * 4) - (fat * 9)) / 4; // Remaining calories from carbs

  // Calculate fat type recommendations based on total fat
  const saturatedFat = fat * 0.33; // ~33% of total fat (≤10% of total calories as per EU guidelines)
  const unsaturatedFat = fat * 0.50; // ~50% of total fat (monounsaturated preference)
  const polyunsaturatedFat = fat * 0.17; // ~17% of total fat (6-11% of total calories as per EU guidelines)

  // Micronutrient recommendations based on EU NRVs with gender and age adjustments
  let vitaminD = 15; // μg base
  let calcium = 800; // mg base
  let iron = gender === 'male' ? 10 : 18; // mg - EU NRV differs by gender
  let folate = 200; // μg base
  let vitaminB12 = 2.5; // μg base
  
  // Age adjustments for key nutrients
  if (age > 50) {
    vitaminD = 20; // Higher requirement for older adults
    calcium = 1000; // Higher requirement for bone health
    vitaminB12 = 4.0; // Higher requirement due to absorption issues
  }
  
  if (age > 70) {
    vitaminD = 25; // Even higher for elderly
    calcium = 1200; // Maximum for bone health
  }

  // Activity level adjustments for key nutrients
  let magnesium = 375; // mg base
  let potassium = 3500; // mg base
  let zinc = 10; // mg base
  
  if (activity_level > 1.6) { // Active individuals
    magnesium = 400; // Higher for active adults
    potassium = 4000; // Higher for active adults
    zinc = 12; // Higher for active adults
  }

  return {
    user_id: user.id,
    calories: Math.round(tdee),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    saturated_fat: Math.round(saturatedFat * 10) / 10, // Round to 1 decimal
    unsaturated_fat: Math.round(unsaturatedFat * 10) / 10, // Round to 1 decimal
    polyunsaturated_fat: Math.round(polyunsaturatedFat * 10) / 10, // Round to 1 decimal
    fiber: age > 50 ? 30 : 25, // Higher fiber for older adults
    vitamin_a: gender === 'male' ? 900 : 700, // μg - EU NRV varies by gender
    vitamin_c: 80, // mg - EU NRV
    vitamin_d: vitaminD, // μg - age adjusted
    vitamin_e: 12, // mg α-TE - EU NRV
    vitamin_k: gender === 'male' ? 75 : 60, // μg - slight gender difference
    thiamine: Math.max(1.1, tdee * 0.0004), // mg - EU NRV, adjusted for energy intake
    riboflavin: Math.max(1.4, tdee * 0.0006), // mg - EU NRV, adjusted for energy intake
    niacin: Math.max(16, tdee * 0.0066), // mg NE - EU NRV, adjusted for energy intake
    vitamin_b6: Math.max(1.4, protein * 0.015), // mg - EU NRV, adjusted for protein intake
    folate: folate, // μg - age adjusted
    vitamin_b12: vitaminB12, // μg - age adjusted
    calcium: calcium, // mg - age adjusted
    iron: iron, // mg - gender specific
    magnesium: magnesium, // mg - activity adjusted
    phosphorus: 700, // mg - EU NRV
    potassium: potassium, // mg - activity adjusted
    zinc: zinc, // mg - activity adjusted
    sodium: 2300, // mg - WHO/EU upper limit
    chloride: 3400, // mg - EU adequate intake (closely related to sodium)
    sulfur: 850, // mg - estimated adequate intake (protein-dependent)
    iodine: 150, // μg - EU NRV
    copper: 1, // mg - EU NRV
    chromium: 40, // μg - EU adequate intake
    manganese: 2, // mg - EU adequate intake
    selenium: 55, // μg - EU NRV
    fluoride: 3.5, // mg - EU adequate intake (adult male reference)
    molybdenum: 50, // μg - EU adequate intake
    cobalt: 5, // μg - estimated adequate intake (as part of B12)
    water: calculateWaterNeeds(age, gender, activity_level, weight), // ml - calculated based on age, gender, PAL, and weight
    sugar: Math.round(tdee * 0.05 / 4), // g - 5% of calories (stricter than WHO's <10%)
  };
}

function getDefaultRecommendations(): NutritionRecommendation {
  // Based on EU Regulation (EU) No 1169/2011 and EFSA guidelines, with USA DRI as secondary reference
  // EU reference intakes prioritized as requested
  const totalFat = 70; // EU reference intake (35% of 2000 kcal, upper limit)
  
  return {
    user_id: 0,
    calories: 2000, // EU reference intake for average adult
    protein: 50, // EU reference intake (10% of 2000 kcal)
    carbs: 260, // EU reference intake (52% of 2000 kcal)
    fat: totalFat, // EU reference intake (35% of 2000 kcal, upper limit)
    saturated_fat: Math.round((totalFat * 0.33) * 10) / 10, // ~33% of total fat
    unsaturated_fat: Math.round((totalFat * 0.50) * 10) / 10, // ~50% of total fat
    polyunsaturated_fat: Math.round((totalFat * 0.17) * 10) / 10, // ~17% of total fat
    fiber: 25, // EU adequate intake
    vitamin_a: 800, // μg - EU NRV (Nutrient Reference Value)
    vitamin_c: 80, // mg - EU NRV
    vitamin_d: 15, // μg - EU NRV (higher than previous 20μg, following latest EFSA recommendations)
    vitamin_e: 12, // mg α-TE - EU NRV
    vitamin_k: 75, // μg - EU adequate intake
    thiamine: 1.1, // mg - EU NRV
    riboflavin: 1.4, // mg - EU NRV
    niacin: 16, // mg NE - EU NRV
    vitamin_b6: 1.4, // mg - EU NRV
    folate: 200, // μg - EU NRV
    vitamin_b12: 2.5, // μg - EU NRV
    calcium: 800, // mg - EU NRV
    iron: 14, // mg - EU NRV (average between male 10mg and female 18mg)
    magnesium: 375, // mg - EU NRV
    phosphorus: 700, // mg - EU NRV
    potassium: 3500, // mg - EU adequate intake
    zinc: 10, // mg - EU NRV
    sodium: 2300, // mg - EU upper limit (6g salt = 2.4g sodium, rounded to WHO recommendation)
    chloride: 3400, // mg - EU adequate intake
    sulfur: 850, // mg - estimated adequate intake
    iodine: 150, // μg - EU NRV
    copper: 1, // mg - EU NRV
    chromium: 40, // μg - EU adequate intake
    manganese: 2, // mg - EU adequate intake
    selenium: 55, // μg - EU NRV
    fluoride: 3.5, // mg - EU adequate intake
    molybdenum: 50, // μg - EU adequate intake
    cobalt: 5, // μg - estimated adequate intake
    water: 2500, // ml - EU adequate intake for average adult
    sugar: 50, // g - WHO recommendation (<10% of total energy)
  };
}

function calculatePercentages(actual: any, recommended: any) {
  const percentages: any = {};
  
  for (const key in recommended) {
    if (key !== 'user_id' && recommended[key] > 0) {
      percentages[key] = Math.round((actual[key] / recommended[key]) * 100);
    }
  }
  
  return percentages;
}

function calculateWeeklyAverages(weeklyData: any[]) {
  const totals: any = {};
  const nutrients = [
    'calories', 'protein', 'carbs', 'fat', 'fiber', 
    'vitamin_a', 'vitamin_c', 'vitamin_d', 'vitamin_e', 'vitamin_k',
    'thiamine', 'riboflavin', 'niacin', 'vitamin_b6', 'folate', 'vitamin_b12',
    'calcium', 'iron', 'magnesium', 'phosphorus', 'potassium', 'zinc',
    'sodium', 'chloride', 'sulfur', 'iodine', 'copper', 'chromium', 
    'manganese', 'selenium', 'fluoride', 'molybdenum', 'cobalt', 'water'
  ];

  nutrients.forEach(nutrient => {
    totals[nutrient] = weeklyData.reduce((sum, day) => sum + (day.nutrition[nutrient] || 0), 0) / 7;
  });

  return totals;
}

export default router;
