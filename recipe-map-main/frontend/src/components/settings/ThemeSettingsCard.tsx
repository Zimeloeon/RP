
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Box,
  Button,
  Paper,
} from '@mui/material';
import { HexColorPicker } from 'react-colorful';
import { useThemeStore } from '../../stores';

/**
 * Predefined gradient themes for the application
 */
const PREDEFINED_GRADIENTS = [
  {
    name: 'Ocean Breeze',
    header: { from: '#667eea', to: '#764ba2' },
    sidebar: { from: '#4a90e2', to: '#50c9c3' },
    sidebarHeader: { from: '#50c9c3', to: '#667eea' },
  },
  {
    name: 'Emerald Forest',
    header: { from: '#134e5e', to: '#71b280' },
    sidebar: { from: '#2d5016', to: '#a8e6cf' },
    sidebarHeader: { from: '#71b280', to: '#134e5e' },
  },
  {
    name: 'Sunset',
    header: { from: '#ff9a56', to: '#ff6a95' },
    sidebar: { from: '#ff9a56', to: '#ff6a95' },
    sidebarHeader: { from: '#ff6a95', to: '#ff9a56' },
  },
  {
    name: 'Royal Purple',
    header: { from: '#6441a5', to: '#2a0845' },
    sidebar: { from: '#8e44ad', to: '#b19cd9' },
    sidebarHeader: { from: '#2a0845', to: '#6441a5' },
  },
  {
    name: 'Crimson Fire',
    header: { from: '#c31432', to: '#240b36' },
    sidebar: { from: '#e53e3e', to: '#fc8181' },
    sidebarHeader: { from: '#240b36', to: '#c31432' },
  },
  {
    name: 'Arctic Blue',
    header: { from: '#3182ce', to: '#63b3ed' },
    sidebar: { from: '#2b6cb0', to: '#90cdf4' },
    sidebarHeader: { from: '#63b3ed', to: '#3182ce' },
  },
  {
    name: 'Golden Hour',
    header: { from: '#f093fb', to: '#f5576c' },
    sidebar: { from: '#ffecd2', to: '#fcb69f' },
    sidebarHeader: { from: '#f5576c', to: '#f093fb' },
  },
  {
    name: 'Midnight Steel',
    header: { from: '#2c3e50', to: '#4a6741' },
    sidebar: { from: '#34495e', to: '#5d6d7e' },
    sidebarHeader: { from: '#4a6741', to: '#2c3e50' },
  },
];

/**
 * Color picker type definitions
 */
type ColorPickerType = 'headerFrom' | 'headerTo' | 'sidebarFrom' | 'sidebarTo' | 'sidebarHeaderFrom' | 'sidebarHeaderTo';

/**
 * ThemeSettingsCard Component
 * 
 * Provides comprehensive theme customization capabilities:
 * - Dark/Light mode toggle
 * - Predefined gradient theme selection
 * - Custom color picker for interface elements
 * - Real-time gradient previews
 * 
 * Features:
 * - 8 predefined gradient themes with preview
 * - Individual color customization for header, sidebar, and menu gradients
 * - Visual gradient previews for immediate feedback
 * - Compact color picker interface
 * - Theme persistence through Zustand store
 */
const ThemeSettingsCard: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const { colorScheme, setColorScheme } = useThemeStore();
  const [colorPickerOpen, setColorPickerOpen] = useState<ColorPickerType | null>(null);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  /**
   * Get the currently selected predefined theme name
   */
  const getCurrentThemeName = () => {
    return PREDEFINED_GRADIENTS.find(g => 
      g.header.from === colorScheme.gradients?.header?.from &&
      g.header.to === colorScheme.gradients?.header?.to
    )?.name || '';
  };

  /**
   * Get the current color value for the active color picker
   */
  const getCurrentPickerColor = () => {
    switch (colorPickerOpen) {
      case 'headerFrom':
        return colorScheme.gradients.header.from;
      case 'headerTo':
        return colorScheme.gradients.header.to;
      case 'sidebarFrom':
        return colorScheme.gradients.sidebar.from;
      case 'sidebarTo':
        return colorScheme.gradients.sidebar.to;
      case 'sidebarHeaderFrom':
        return colorScheme.gradients.sidebarHeader.from;
      case 'sidebarHeaderTo':
        return colorScheme.gradients.sidebarHeader.to;
      default:
        return '#000000';
    }
  };

  /**
   * Get display label for color picker type
   */
  const getPickerLabel = (type: ColorPickerType) => {
    const labels = {
      headerFrom: 'Header From Color',
      headerTo: 'Header To Color',
      sidebarFrom: 'Sidebar From Color',
      sidebarTo: 'Sidebar To Color',
      sidebarHeaderFrom: 'Menu From Color',
      sidebarHeaderTo: 'Menu To Color',
    };
    return labels[type];
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle predefined theme selection
   */
  const handleThemeSelection = (themeName: string) => {
    const selectedGradient = PREDEFINED_GRADIENTS.find(g => g.name === themeName);
    if (selectedGradient) {
      setColorScheme({ gradients: selectedGradient });
    }
  };

  /**
   * Handle color change in color picker
   */
  const handleColorChange = (color: string) => {
    if (!colorPickerOpen) return;

    const updates: any = {
      gradients: {
        ...colorScheme.gradients,
      }
    };

    switch (colorPickerOpen) {
      case 'headerFrom':
        updates.gradients.header = { ...colorScheme.gradients.header, from: color };
        break;
      case 'headerTo':
        updates.gradients.header = { ...colorScheme.gradients.header, to: color };
        break;
      case 'sidebarFrom':
        updates.gradients.sidebar = { ...colorScheme.gradients.sidebar, from: color };
        break;
      case 'sidebarTo':
        updates.gradients.sidebar = { ...colorScheme.gradients.sidebar, to: color };
        break;
      case 'sidebarHeaderFrom':
        updates.gradients.sidebarHeader = { ...colorScheme.gradients.sidebarHeader, from: color };
        break;
      case 'sidebarHeaderTo':
        updates.gradients.sidebarHeader = { ...colorScheme.gradients.sidebarHeader, to: color };
        break;
    }

    setColorScheme(updates);
  };

  /**
   * Toggle color picker visibility
   */
  const toggleColorPicker = (type: ColorPickerType) => {
    setColorPickerOpen(colorPickerOpen === type ? null : type);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Render gradient control row
   */
  const renderGradientControl = (
    label: string,
    fromColor: string,
    toColor: string,
    fromType: ColorPickerType,
    toType: ColorPickerType
  ) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" sx={{ minWidth: 50, fontSize: '0.75rem' }}>
        {label}
      </Typography>
      <Box
        sx={{
          width: 24,
          height: 24,
          background: fromColor,
          borderRadius: '50%',
          cursor: 'pointer',
          border: '1px solid #ddd',
        }}
        onClick={() => toggleColorPicker(fromType)}
      />
      <Box
        sx={{
          width: 24,
          height: 24,
          background: toColor,
          borderRadius: '50%',
          cursor: 'pointer',
          border: '1px solid #ddd',
        }}
        onClick={() => toggleColorPicker(toType)}
      />
      <Box
        sx={{
          flex: 1,
          height: 20,
          background: `linear-gradient(90deg, ${fromColor} 0%, ${toColor} 100%)`,
          borderRadius: 10,
          border: '1px solid #ddd',
        }}
      />
    </Box>
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>

        {/* Dark Mode Toggle */}
        <FormControlLabel
          control={
            <Switch
              checked={colorScheme.mode === 'dark'}
              onChange={(e) =>
                setColorScheme({ mode: e.target.checked ? 'dark' : 'light' })
              }
            />
          }
          label="Dark Mode"
          sx={{ mb: 2 }}
        />

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Interface Gradients
        </Typography>

        {/* Preset Themes */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Preset Themes
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Choose a Theme</InputLabel>
          <Select
            value={getCurrentThemeName()}
            label="Choose a Theme"
            onChange={(e) => handleThemeSelection(e.target.value)}
            renderValue={(selected) => {
              const gradient = PREDEFINED_GRADIENTS.find(g => g.name === selected);
              if (!gradient) return selected;
              
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 16,
                      background: `linear-gradient(135deg, ${gradient.header.from} 0%, ${gradient.header.to} 100%)`,
                      borderRadius: 0.5,
                      border: '1px solid #ddd',
                    }}
                  />
                  {selected}
                </Box>
              );
            }}
          >
            {PREDEFINED_GRADIENTS.map((gradient) => (
              <MenuItem 
                key={gradient.name} 
                value={gradient.name}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  '&:hover': {
                    backgroundColor: `${gradient.header.from}20`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 20,
                    background: `linear-gradient(135deg, ${gradient.header.from} 0%, ${gradient.header.to} 100%)`,
                    borderRadius: 1,
                    border: '1px solid #ddd',
                    mr: 1,
                  }}
                />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {gradient.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {gradient.header.from} → {gradient.header.to}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Custom Colors */}
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
          Custom Colors
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {/* Header Gradient */}
          {renderGradientControl(
            'Header',
            colorScheme.gradients.header.from,
            colorScheme.gradients.header.to,
            'headerFrom',
            'headerTo'
          )}

          {/* Sidebar Gradient */}
          {renderGradientControl(
            'Sidebar',
            colorScheme.gradients.sidebar.from,
            colorScheme.gradients.sidebar.to,
            'sidebarFrom',
            'sidebarTo'
          )}

          {/* Menu Gradient */}
          {renderGradientControl(
            'Menu',
            colorScheme.gradients.sidebarHeader.from,
            colorScheme.gradients.sidebarHeader.to,
            'sidebarHeaderFrom',
            'sidebarHeaderTo'
          )}
        </Box>

        {/* Color Picker Modal */}
        {colorPickerOpen && (
          <Paper sx={{ p: 2, mt: 2, maxWidth: 300 }}>
            <Typography variant="body2" gutterBottom>
              {getPickerLabel(colorPickerOpen)}
            </Typography>
            <HexColorPicker
              color={getCurrentPickerColor()}
              onChange={handleColorChange}
            />
            <Button
              size="small"
              onClick={() => setColorPickerOpen(null)}
              sx={{ mt: 1 }}
              fullWidth
            >
              Done
            </Button>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

export default ThemeSettingsCard;
