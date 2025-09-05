/**
 * Nutrition Page Component
 * 
 * Comprehensive nutrition tracking and analysis page that displays:
 * - Daily nutrition summary with macro/micronutrients
 * - Dedicated water intake tracking section
 * - Visual charts and progress indicators
 * - Nutritional recommendations vs. actual intake
 * - Date-based navigation for historical data
 * 
 * Features:
 * - Real-time nutrition calculation from intake entries
 * - Water hydration status with color-coded feedback
 * - Responsive design for mobile and desktop
 * - Interactive pie charts for macronutrient breakdown
 * - Progress bars with percentage indicators
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Paper,
  Divider,
  Stack,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { toast } from 'react-toastify';
import { useAppStore } from '../stores';
import { api } from '../services/api';
import { DailyNutritionSummary } from '../types';

/**
 * NutritionPage Component
 * 
 * Main nutrition analysis page with water tracking integration.
 * Fetches and displays comprehensive nutrition data including
 * dedicated water intake section with hydration status.
 */
const NutritionPage: React.FC = () => {
  const theme = useTheme();
  const { selectedDate, setSelectedDate } = useAppStore();
  const [nutritionData, setNutritionData] = useState<DailyNutritionSummary | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch nutrition data when selected date changes
  useEffect(() => {
    fetchNutritionData();
  }, [selectedDate]);

  /**
   * Fetch daily nutrition data from API
   * Includes all macronutrients, micronutrients, and water intake
   */
  const fetchNutritionData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/nutrition/daily/${selectedDate}`);
      setNutritionData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch nutrition data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper function to get status color based on percentage of recommendation
   * Used for progress bars and status indicators
   */
  const getStatusColor = (percentage: number): { color: string; label: string } => {
    if (percentage >= 90 && percentage <= 110) {
      return { color: theme.palette.success.main, label: 'Optimal' };
    } else if (percentage >= 70 && percentage <= 130) {
      return { color: theme.palette.warning.main, label: 'Moderate' };
    } else {
      return { color: theme.palette.error.main, label: 'Needs Attention' };
    }
  };

  // Nutrient display component
  const NutrientDisplay: React.FC<{
    name: string;
    actual: number;
    target: number;
    unit: string;
    showBar?: boolean;
  }> = ({ name, actual, target, unit, showBar = true }) => {
    const percentage = target > 0 ? (actual / target) * 100 : 0;
    const status = getStatusColor(percentage);

    return (
      <Paper 
        sx={{ 
          p: 2, 
          height: '100%',
          backgroundColor: `${status.color}08`, // Very faint background
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="body1" fontWeight="medium">
            {name}
          </Typography>
        </Box>
        <Typography variant="h6" color="primary" fontWeight="bold">
          {actual.toFixed(1)} {unit}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={showBar ? 1 : 0}>
          Target: {target} {unit} ({percentage.toFixed(0)}%)
        </Typography>
        {showBar && (
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: status.color,
              },
            }}
          />
        )}
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Nutrition Overview
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (!nutritionData) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Nutrition Overview
        </Typography>
        <Typography>No nutrition data available</Typography>
      </Box>
    );
  }

  const { totalNutrition, recommendations } = nutritionData;

  // Prepare macronutrient data for Part 1
  const macronutrients = [
    { name: 'Calories', actual: totalNutrition.calories, target: recommendations.calories, unit: 'kcal' },
    { name: 'Protein', actual: totalNutrition.protein, target: recommendations.protein, unit: 'g' },
    { name: 'Carbohydrates', actual: totalNutrition.carbs, target: recommendations.carbs, unit: 'g' },
    { name: 'Total Fat', actual: totalNutrition.fat, target: recommendations.fat, unit: 'g' },
    { name: 'Fiber', actual: totalNutrition.fiber, target: recommendations.fiber, unit: 'g' },
    { name: 'Sugar', actual: totalNutrition.sugar || 0, target: recommendations.sugar || 0, unit: 'g' },
  ];

  // Fat breakdown data
  const fatBreakdown = [
    { name: 'Saturated Fat', actual: totalNutrition.saturated_fat || 0, target: recommendations.saturated_fat || 0, unit: 'g' },
    { name: 'Unsaturated Fat', actual: totalNutrition.unsaturated_fat || 0, target: recommendations.unsaturated_fat || 0, unit: 'g' },
    { name: 'Polyunsaturated Fat', actual: totalNutrition.polyunsaturated_fat || 0, target: recommendations.polyunsaturated_fat || 0, unit: 'g' },
  ];

  // Calorie distribution for pie chart
  const calorieDistribution = [
    { name: 'Protein', value: totalNutrition.protein * 4, color: '#8884d8' },
    { name: 'Carbs', value: totalNutrition.carbs * 4, color: '#82ca9d' },
    { name: 'Fat', value: totalNutrition.fat * 9, color: '#ffc658' },
  ];

  // Prepare micronutrient data for Part 2 (excluding water)
  const micronutrients = [
    // Vitamins
    { name: 'Vitamin A', actual: totalNutrition.vitamin_a, target: recommendations.vitamin_a, unit: 'μg' },
    { name: 'Vitamin C', actual: totalNutrition.vitamin_c, target: recommendations.vitamin_c, unit: 'mg' },
    { name: 'Vitamin D', actual: totalNutrition.vitamin_d, target: recommendations.vitamin_d, unit: 'μg' },
    { name: 'Vitamin E', actual: totalNutrition.vitamin_e || 0, target: recommendations.vitamin_e || 0, unit: 'mg' },
    { name: 'Vitamin K', actual: totalNutrition.vitamin_k || 0, target: recommendations.vitamin_k || 0, unit: 'μg' },
    { name: 'Thiamine (B1)', actual: totalNutrition.thiamine || 0, target: recommendations.thiamine || 0, unit: 'mg' },
    { name: 'Riboflavin (B2)', actual: totalNutrition.riboflavin || 0, target: recommendations.riboflavin || 0, unit: 'mg' },
    { name: 'Niacin (B3)', actual: totalNutrition.niacin || 0, target: recommendations.niacin || 0, unit: 'mg' },
    { name: 'Vitamin B6', actual: totalNutrition.vitamin_b6 || 0, target: recommendations.vitamin_b6 || 0, unit: 'mg' },
    { name: 'Folate', actual: totalNutrition.folate, target: recommendations.folate, unit: 'μg' },
    { name: 'Vitamin B12', actual: totalNutrition.vitamin_b12, target: recommendations.vitamin_b12, unit: 'μg' },
    
    // Minerals
    { name: 'Calcium', actual: totalNutrition.calcium, target: recommendations.calcium, unit: 'mg' },
    { name: 'Iron', actual: totalNutrition.iron, target: recommendations.iron, unit: 'mg' },
    { name: 'Magnesium', actual: totalNutrition.magnesium, target: recommendations.magnesium, unit: 'mg' },
    { name: 'Phosphorus', actual: totalNutrition.phosphorus || 0, target: recommendations.phosphorus || 0, unit: 'mg' },
    { name: 'Potassium', actual: totalNutrition.potassium, target: recommendations.potassium, unit: 'mg' },
    { name: 'Zinc', actual: totalNutrition.zinc, target: recommendations.zinc, unit: 'mg' },
    { name: 'Sodium', actual: totalNutrition.sodium || 0, target: recommendations.sodium || 0, unit: 'mg' },
    { name: 'Chloride', actual: totalNutrition.chloride || 0, target: recommendations.chloride || 0, unit: 'mg' },
    { name: 'Sulfur', actual: totalNutrition.sulfur || 0, target: recommendations.sulfur || 0, unit: 'mg' },
    { name: 'Iodine', actual: totalNutrition.iodine || 0, target: recommendations.iodine || 0, unit: 'μg' },
    { name: 'Copper', actual: totalNutrition.copper || 0, target: recommendations.copper || 0, unit: 'mg' },
    { name: 'Chromium', actual: totalNutrition.chromium || 0, target: recommendations.chromium || 0, unit: 'μg' },
    { name: 'Manganese', actual: totalNutrition.manganese || 0, target: recommendations.manganese || 0, unit: 'mg' },
    { name: 'Selenium', actual: totalNutrition.selenium || 0, target: recommendations.selenium || 0, unit: 'μg' },
    { name: 'Fluoride', actual: totalNutrition.fluoride || 0, target: recommendations.fluoride || 0, unit: 'mg' },
    { name: 'Molybdenum', actual: totalNutrition.molybdenum || 0, target: recommendations.molybdenum || 0, unit: 'μg' },
    { name: 'Cobalt', actual: totalNutrition.cobalt || 0, target: recommendations.cobalt || 0, unit: 'μg' },
  ].filter(nutrient => nutrient.target > 0); // Only show nutrients with defined targets

  // Water data for dedicated water section
  const waterData = {
    name: 'Water',
    actual: totalNutrition.water || 0,
    target: recommendations.water || 0,
    unit: 'ml'
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Nutrition Overview
        </Typography>
        <DatePicker
          value={dayjs(selectedDate)}
          onChange={(newValue: Dayjs | null) => {
            if (newValue) {
              setSelectedDate(newValue.format('YYYY-MM-DD'));
            }
          }}
          slotProps={{
            textField: {
              size: 'small',
              sx: { width: 150 }
            }
          }}
        />
      </Box>

      {/* SUMMARY STATISTICS */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            backgroundColor: theme.palette.success.light, 
            color: 'white',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" fontWeight="bold">
              {micronutrients.filter(n => {
                const percentage = n.target > 0 ? (n.actual / n.target) * 100 : 0;
                return percentage >= 90 && percentage <= 110;
              }).length}
            </Typography>
            <Typography variant="body2">
              Nutrients in Optimal Range (90-110%)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            backgroundColor: theme.palette.warning.light, 
            color: 'white',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" fontWeight="bold">
              {micronutrients.filter(n => {
                const percentage = n.target > 0 ? (n.actual / n.target) * 100 : 0;
                return (percentage >= 70 && percentage < 90) || (percentage > 110 && percentage <= 130);
              }).length}
            </Typography>
            <Typography variant="body2">
              Nutrients in Moderate Range (70-130%)
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            textAlign: 'center', 
            backgroundColor: theme.palette.error.light, 
            color: 'white',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Typography variant="h6" fontWeight="bold">
              {micronutrients.filter(n => {
                const percentage = n.target > 0 ? (n.actual / n.target) * 100 : 0;
                return percentage < 70 || percentage > 130;
              }).length}
            </Typography>
            <Typography variant="body2">
              Nutrients Needing Attention (&lt;70% or &gt;130%)
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* PART 1: MACRONUTRIENTS, FAT BREAKDOWN & CALORIE DISTRIBUTION */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
            Part 1: Macronutrients & Energy Distribution
          </Typography>
          
          {/* Macronutrients */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
            Primary Macronutrients
          </Typography>
          <Grid container spacing={2} mb={3}>
            {macronutrients.map((nutrient) => (
              <Grid item xs={6} sm={3} md={2.4} lg={2} xl={1.7} key={nutrient.name}>
                <NutrientDisplay {...nutrient} />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {/* Fat Breakdown */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Fat Type Breakdown
              </Typography>
              <Stack spacing={2} sx={{ flexGrow: 1 }}>
                {fatBreakdown.map((fat) => (
                  <NutrientDisplay key={fat.name} {...fat} showBar={false} />
                ))}
              </Stack>
            </Grid>

            {/* Calorie Distribution */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>
                Calorie Distribution
              </Typography>
              <Paper sx={{ 
                p: 2, 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: { xs: 300, md: 0 },
                maxHeight: { xs: 400, md: 'none' }
              }}>
                <Box sx={{ 
                  flexGrow: 1, 
                  width: '100%',
                  height: '100%',
                  minHeight: 250,
                  maxHeight: { xs: 300, md: 450 }
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calorieDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius="80%"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {calorieDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${Math.round(value)} kcal`]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box mt={2} sx={{ flexShrink: 0 }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Total Calories: {Math.round(totalNutrition.calories)} kcal
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* WATER SECTION */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="info.main" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            💧 Water Intake
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                backgroundColor: `${theme.palette.info.main}08`,
                border: `2px solid ${theme.palette.info.main}20`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="medium" color="info.main">
                    Daily Water Intake
                  </Typography>
                </Box>
                
                <Typography variant="h4" color="info.main" fontWeight="bold" mb={1}>
                  {(waterData.actual / 1000).toFixed(1)} L
                </Typography>
                
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {waterData.actual.toFixed(0)} ml of {waterData.target.toFixed(0)} ml
                </Typography>
                
                <Box mb={2}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((waterData.actual / waterData.target) * 100, 100)}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: theme.palette.info.main,
                        borderRadius: 6,
                      },
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {((waterData.actual / waterData.target) * 100).toFixed(0)}% of recommended daily intake
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ 
                p: 3, 
                backgroundColor: `${theme.palette.info.main}05`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <Typography variant="h6" fontWeight="medium" color="info.main" mb={2}>
                  Hydration Status
                </Typography>
                
                {(() => {
                  const percentage = (waterData.actual / waterData.target) * 100;
                  let status, color, message;
                  
                  if (percentage >= 90) {
                    status = 'Well Hydrated';
                    color = theme.palette.success.main;
                    message = 'Great job! You\'re meeting your hydration goals.';
                  } else if (percentage >= 60) {
                    status = 'Moderately Hydrated';
                    color = theme.palette.warning.main;
                    message = 'You\'re on track, but try to drink a bit more water.';
                  } else {
                    status = 'Needs More Water';
                    color = theme.palette.error.main;
                    message = 'Consider increasing your water intake throughout the day.';
                  }
                  
                  return (
                    <>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          backgroundColor: `${color}15`,
                          border: `1px solid ${color}30`,
                          mb: 2
                        }}
                      >
                        <Typography variant="body1" fontWeight="bold" sx={{ color }}>
                          {status}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {message}
                      </Typography>
                      
                      <Box mt={2}>
                        <Typography variant="body2" color="text.secondary">
                          Remaining: {Math.max(0, waterData.target - waterData.actual).toFixed(0)} ml
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ≈ {Math.max(0, Math.ceil((waterData.target - waterData.actual) / 250))} glasses
                        </Typography>
                      </Box>
                    </>
                  );
                })()}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* PART 2: MICRONUTRIENTS */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
            Part 2: Micronutrients & Essential Nutrients
          </Typography>
          
          <Grid container spacing={2}>
            {micronutrients.map((nutrient) => (
              <Grid item xs={6} sm={3} md={2.4} lg={2} xl={1.7} key={nutrient.name}>
                <NutrientDisplay {...nutrient} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NutritionPage;
