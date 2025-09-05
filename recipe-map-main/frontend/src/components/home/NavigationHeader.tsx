/**
 * NavigationHeader Component
 * 
 * Responsive header component for the HomePage that handles date navigation.
 * Features different layouts for mobile (centered date with drawer picker) and 
 * desktop/tablet (week view with navigation arrows).
 * 
 * @component
 */

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  CalendarToday,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { useThemeStore } from '../../stores';

interface NavigationHeaderProps {
  /** Currently selected date in YYYY-MM-DD format */
  selectedDate: string;
  /** Callback function to update the selected date */
  onDateChange: (date: string) => void;
  /** Callback to open the mobile date picker drawer */
  onOpenDatePicker: () => void;
}

/**
 * NavigationHeader - Responsive date navigation component
 * 
 * Provides different navigation interfaces based on screen size:
 * - Mobile: Centered current date with picker button and prev/next navigation
 * - Desktop/Tablet: Week view with clickable days and navigation arrows
 */
const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  selectedDate,
  onDateChange,
  onOpenDatePicker,
}) => {
  // Theme and responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { colorScheme } = useThemeStore();

  /**
   * Generate array of 7 days for the current week
   * Starting from the beginning of the week (Sunday)
   */
  const getWeekDays = (): Dayjs[] => {
    const today = dayjs(selectedDate);
    const startOfWeek = today.startOf('week');
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, 'day'));
    }
    return days;
  };

  const weekDays = getWeekDays();

  /**
   * Check if a given date is today
   */
  const isToday = (date: Dayjs): boolean => date.isSame(dayjs(), 'day');

  /**
   * Check if a given date is the currently selected date
   */
  const isSelected = (date: Dayjs): boolean => date.isSame(dayjs(selectedDate), 'day');

  /**
   * Navigation handlers for date changes
   */
  const handlePreviousDay = () => {
    onDateChange(dayjs(selectedDate).subtract(1, 'day').format('YYYY-MM-DD'));
  };

  const handleNextDay = () => {
    onDateChange(dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD'));
  };

  const handlePreviousWeek = () => {
    onDateChange(dayjs(selectedDate).subtract(1, 'week').format('YYYY-MM-DD'));
  };

  const handleNextWeek = () => {
    onDateChange(dayjs(selectedDate).add(1, 'week').format('YYYY-MM-DD'));
  };

  const handleTodayClick = () => {
    onDateChange(dayjs().format('YYYY-MM-DD'));
  };

  const handleDayClick = (day: Dayjs) => {
    onDateChange(day.format('YYYY-MM-DD'));
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: isMobile ? 2 : 3, 
        mb: 0,
        borderRadius: 0,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper
      }}
    >
      {isMobile ? (
        /* Mobile-optimized navigation with centered date display */
        <Box>
          {/* Current date display with tap-to-open picker */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            sx={{
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
            onClick={onOpenDatePicker}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday sx={{ fontSize: '1.2rem', color: colorScheme.gradients.sidebarHeader.from }} />
              <Box textAlign="center">
                <Typography variant="h6" fontWeight={600}>
                  {dayjs(selectedDate).format('ddd, MMM D')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {isToday(dayjs(selectedDate)) ? 'Today' : dayjs(selectedDate).format('YYYY')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick navigation buttons */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <IconButton 
              onClick={handlePreviousDay}
              sx={{ 
                bgcolor: theme.palette.action.hover,
                '&:hover': { bgcolor: theme.palette.action.selected }
              }}
            >
              <ChevronLeft />
            </IconButton>
            
            <Box display="flex" gap={1}>
              <Button
                variant={isToday(dayjs(selectedDate)) ? "contained" : "outlined"}
                size="small"
                onClick={handleTodayClick}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  backgroundColor: isToday(dayjs(selectedDate)) ? colorScheme.gradients.sidebarHeader.from : 'transparent'
                }}
              >
                Today
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onOpenDatePicker}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                Pick Date
              </Button>
            </Box>

            <IconButton 
              onClick={handleNextDay}
              sx={{ 
                bgcolor: theme.palette.action.hover,
                '&:hover': { bgcolor: theme.palette.action.selected }
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
      ) : (
        /* Desktop/tablet week navigation with clickable day tiles */
        <Box display="flex" alignItems="center" justifyContent="center" gap={isTablet ? 0.5 : 1}>
          <IconButton 
            onClick={handlePreviousWeek}
            size={isTablet ? "small" : "medium"}
          >
            <ChevronLeft />
          </IconButton>
          
          <Box 
            display="flex" 
            gap={isTablet ? 0.5 : 1} 
            mx={isTablet ? 1 : 2}
          >
            {weekDays.map((day) => (
              <Paper
                key={day.format('YYYY-MM-DD')}
                elevation={isSelected(day) ? 3 : 0}
                sx={{
                  p: isTablet ? 1.5 : 2,
                  minWidth: isTablet ? 70 : 80,
                  textAlign: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  background: isSelected(day) 
                    ? `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`
                    : isToday(day) 
                    ? theme.palette.action.selected
                    : 'transparent',
                  color: isSelected(day) 
                    ? 'white'
                    : isToday(day)
                    ? colorScheme.gradients.sidebarHeader.from
                    : theme.palette.text.primary,
                  border: isToday(day) && !isSelected(day) 
                    ? `2px solid ${colorScheme.gradients.sidebarHeader.from}` 
                    : '2px solid transparent',
                  '&:hover': {
                    background: isSelected(day) 
                      ? `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.to} 0%, ${colorScheme.gradients.sidebarHeader.from} 100%)`
                      : `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from}20 0%, ${colorScheme.gradients.sidebarHeader.to}20 100%)`,
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => handleDayClick(day)}
              >
                <Typography variant="caption" display="block" sx={{ opacity: 0.8, fontSize: isTablet ? '0.7rem' : '0.75rem' }}>
                  {day.format('ddd')}
                </Typography>
                <Typography variant={isTablet ? "body2" : "h6"} fontWeight={600}>
                  {day.format('DD')}
                </Typography>
              </Paper>
            ))}
          </Box>

          <IconButton 
            onClick={handleNextWeek}
            size={isTablet ? "small" : "medium"}
          >
            <ChevronRight />
          </IconButton>
          
          <IconButton 
            onClick={handleTodayClick}
            size={isTablet ? "small" : "medium"}
            sx={{ ml: isTablet ? 1 : 2 }}
          >
            <Today />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default NavigationHeader;
