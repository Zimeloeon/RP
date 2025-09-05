/**
 * Search Field Component
 * 
 * Reusable search input component with consistent styling and functionality.
 * Features:
 * - Search icon integration
 * - Mobile-responsive design
 * - Standardized placeholder and onChange handling
 * - Used across admin tables and search interfaces
 * 
 * Provides a unified search experience throughout the application
 * with consistent Material-UI styling and behavior.
 */

import React from 'react';
import { TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchFieldProps {
  /** Current search term value */
  value: string;
  /** Callback function called when search term changes */
  onChange: (value: string) => void;
  /** Placeholder text for the search field */
  placeholder: string;
  /** Whether to render in mobile-optimized view */
  isMobile?: boolean;
}

/**
 * SearchField Component
 * 
 * A reusable search input field with search icon.
 * Provides consistent styling and behavior across different admin table views
 * and search interfaces throughout the application.
 */
const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder,
  isMobile = false,
}) => {
  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: <SearchIcon sx={{ 
          mr: 1, 
          color: 'text.secondary',
          fontSize: isMobile ? 18 : 24
        }} />,
      }}
      sx={{ 
        mb: isMobile ? 1.5 : 2,
        '& .MuiInputBase-root': {
          fontSize: isMobile ? '0.875rem' : undefined
        }
      }}
      size="small"
    />
  );
};

export default SearchField;
