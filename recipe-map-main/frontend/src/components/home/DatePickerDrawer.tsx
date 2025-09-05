/**
 * DatePickerDrawer Component
 * 
 * Mobile-optimized bottom drawer that provides an intuitive date selection interface.
 * Displays a scrollable list of dates from past week to next week with today highlighted.
 * Features smooth animations and touch-friendly interactions.
 * 
 * @component
 */

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Chip,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useThemeStore } from '../../stores';

interface DateOption {
  value: string;
  label: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

interface DatePickerDrawerProps {
  /** Whether the drawer is open */
  open: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Callback to open the drawer (required for SwipeableDrawer) */
  onOpen: () => void;
  /** Currently selected date in YYYY-MM-DD format */
  selectedDate: string;
  /** Callback function when a date is selected */
  onDateSelect: (date: string) => void;
}

/**
 * DatePickerDrawer - Mobile bottom drawer for date selection
 * 
 * Provides an intuitive date selection interface with:
 * - Scrollable list of dates (past week + today + next week)
 * - Visual indicators for today and selected date
 * - Smooth swipe animations and touch-friendly design
 * - Automatic closing when date is selected
 */
const DatePickerDrawer: React.FC<DatePickerDrawerProps> = ({
  open,
  onClose,
  onOpen,
  selectedDate,
  onDateSelect,
}) => {
  // Theme and styling
  const theme = useTheme();
  const { colorScheme } = useThemeStore();

  /**
   * Generate array of date options for the picker
   * Includes last 7 days, today, and next 7 days with descriptive labels
   */
  const generateDateOptions = (): DateOption[] => {
    const today = dayjs();
    const options: DateOption[] = [];
    
    // Add last 7 days, today, and next 7 days
    for (let i = -7; i <= 7; i++) {
      const date = today.add(i, 'day');
      options.push({
        value: date.format('YYYY-MM-DD'),
        label: i === 0 ? 'Today' : 
               i === -1 ? 'Yesterday' :
               i === 1 ? 'Tomorrow' :
               date.format('ddd, MMM D'),
        isToday: i === 0,
        isPast: i < 0,
        isFuture: i > 0
      });
    }
    return options;
  };

  const dateOptions = generateDateOptions();

  /**
   * Handle date selection and close drawer
   */
  const handleDateSelect = (date: string) => {
    onDateSelect(date);
    onClose();
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      sx={{
        '& .MuiDrawer-paper': {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxHeight: '70vh'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* Header with title and close button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Select Date
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Scrollable date list */}
        <List sx={{ maxHeight: '50vh', overflow: 'auto' }}>
          {dateOptions.map((option) => (
            <ListItem
              key={option.value}
              onClick={() => handleDateSelect(option.value)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                mb: 0.5,
                bgcolor: option.value === selectedDate
                  ? `${colorScheme.gradients.sidebarHeader.from}20` 
                  : 'transparent',
                border: option.value === selectedDate 
                  ? `1px solid ${colorScheme.gradients.sidebarHeader.from}` 
                  : '1px solid transparent',
                '&:hover': {
                  bgcolor: option.value === selectedDate 
                    ? `${colorScheme.gradients.sidebarHeader.from}30` 
                    : theme.palette.action.hover
                }
              }}
            >
              <ListItemText
                primary={option.label}
                secondary={option.isToday ? 'Today' : dayjs(option.value).format('YYYY-MM-DD')}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: option.isToday || option.value === selectedDate ? 600 : 400,
                    color: option.isToday 
                      ? colorScheme.gradients.sidebarHeader.from 
                      : option.value === selectedDate 
                      ? colorScheme.gradients.sidebarHeader.from
                      : 'inherit'
                  }
                }}
              />
              {/* Today indicator chip */}
              {option.isToday && (
                <Chip 
                  label="Today" 
                  size="small" 
                  sx={{ 
                    bgcolor: colorScheme.gradients.sidebarHeader.from,
                    color: 'white',
                    fontSize: '0.7rem'
                  }} 
                />
              )}
            </ListItem>
          ))}
        </List>
        
        {/* Footer with cancel button */}
        <Divider sx={{ my: 2 }} />
        
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};

export default DatePickerDrawer;
