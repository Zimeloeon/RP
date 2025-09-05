
/**
 * Two Week Ingredients Page Component
 * 
 * Comprehensive grocery list and meal planning interface.
 * Features:
 * - Date range selection for flexible planning periods (default: 2 weeks)
 * - Aggregated ingredient list with quantities from planned meals
 * - Purchase tracking with persistent status across sessions
 * - Smart quantity change detection and automatic status reset
 * - Responsive design optimized for mobile grocery shopping
 * 
 * Key Features:
 * - Generates grocery lists from intake entries within date range
 * - Purchase status persistence using localStorage
 * - Automatic recalculation when meal plans change
 * - Mobile-responsive date range picker with drawer interface
 * - Themed styling with gradient accents matching user preferences
 * - Real-time updates when timeline entries are modified
 * - Smart grouping and aggregation of duplicate ingredients
 * 
 * Use Cases:
 * - Weekly grocery shopping preparation
 * - Meal planning for special periods (vacations, meal prep)
 * - Inventory management and shopping list optimization
 * 
 * @component
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useThemeStore } from '../stores';
import DateRangePicker from '../components/grocery/DateRangePicker';
import GroceryListCard from '../components/grocery/GroceryListCard';
import useGroceryList from '../hooks/useGroceryList';

const TwoWeekIngredientsPage: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().add(13, 'days'));
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { colorScheme } = useThemeStore();

  // ============================================================================
  // CUSTOM HOOKS
  // ============================================================================
  
  const { ingredients, loading, error, togglePurchased } = useGroceryList({
    startDate,
    endDate,
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Format date range for display
   */
  const getDateRangeText = () => {
    const sameYear = startDate.year() === endDate.year();
    const startFormat = sameYear ? 'MMM D' : 'MMM D, YYYY';
    const endFormat = 'MMM D, YYYY';
    
    return `${startDate.format(startFormat)} - ${endDate.format(endFormat)}`;
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle start date change
   */
  const handleStartDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setStartDate(newValue);
    }
  };

  /**
   * Handle end date change
   */
  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setEndDate(newValue);
    }
  };

  // ============================================================================
  // LOADING AND ERROR STATES
  // ============================================================================
  
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={isMobile ? 2 : 3}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom
          sx={{
            background: `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            mb: 1,
          }}
        >
          Grocery List
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          Ingredients needed for {getDateRangeText()}
        </Typography>

        {/* Date Range Picker */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
          colorScheme={colorScheme}
        />

        {/* Grocery List */}
        <GroceryListCard
          ingredients={ingredients}
          onTogglePurchased={togglePurchased}
          colorScheme={colorScheme}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default TwoWeekIngredientsPage;
