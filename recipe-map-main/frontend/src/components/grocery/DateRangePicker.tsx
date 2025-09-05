
import React from 'react';
import {
  Typography,
  Box,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

/**
 * Props for the DateRangePicker component
 */
interface DateRangePickerProps {
  /** Start date value */
  startDate: Dayjs;
  /** End date value */
  endDate: Dayjs;
  /** Handler for start date changes */
  onStartDateChange: (date: Dayjs | null) => void;
  /** Handler for end date changes */
  onEndDateChange: (date: Dayjs | null) => void;
  /** Color scheme for styling */
  colorScheme: {
    mode: 'light' | 'dark';
  };
}

/**
 * DateRangePicker Component
 * 
 * Provides a user-friendly interface for selecting date ranges for grocery list generation:
 * - Start and end date selection with validation
 * - Responsive design for mobile and desktop
 * - Themed styling that adapts to light/dark mode
 * - Automatic end date minimum constraint based on start date
 * 
 * Features:
 * - Mobile-responsive layout (column on mobile, row on desktop)
 * - Gradient background styling with theme support
 * - Date validation to ensure end date is not before start date
 * - Consistent Material-UI styling
 */
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  colorScheme,
}) => {
  // ============================================================================
  // RESPONSIVE DESIGN
  // ============================================================================
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: isMobile ? 2 : 3,
        mb: 3,
        background: colorScheme.mode === 'dark' 
          ? 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: colorScheme.mode === 'dark' ? '1px solid #333' : '1px solid #e0e0e0',
      }}
    >
      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        gutterBottom
        sx={{ mb: 2 }}
      >
        Date Range
      </Typography>
      
      <Box 
        display="flex" 
        gap={2} 
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'stretch' : 'center'}
      >
        {/* Start Date Picker */}
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={onStartDateChange}
          sx={{ flex: 1 }}
        />
        
        {/* End Date Picker */}
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={onEndDateChange}
          minDate={startDate}
          sx={{ flex: 1 }}
        />
      </Box>
    </Paper>
  );
};

export default DateRangePicker;
