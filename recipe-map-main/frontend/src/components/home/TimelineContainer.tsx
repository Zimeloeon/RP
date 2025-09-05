/**
 * TimelineContainer Component
 * 
 * Main timeline rendering component that displays intake entries grouped by time.
 * Features a visual timeline with time indicators and grouped entries.
 * Handles recipe grouping, swipe navigation on mobile, and empty states.
 * 
 * @component
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { IntakeEntry, Recipe } from '../../types';
import { useThemeStore } from '../../stores';
import TimelineEntry from '../TimelineEntry';
import RecipeBanner from '../RecipeBanner';
import { api } from '../../services/api';

interface TimelineContainerProps {
  /** Array of intake entries to display */
  entries: IntakeEntry[];
  /** Array of available recipes for recipe lookup */
  recipes: Recipe[];
  /** Whether data is currently loading */
  loading: boolean;
  /** Callback when an entry should be edited */
  onEditEntry: (entry: IntakeEntry) => void;
  /** Callback when an entry should be deleted */
  onDeleteEntry: (entry: IntakeEntry) => void;
  /** Callback when a recipe (and all its ingredients) should be deleted */
  onDeleteRecipe: (recipeName: string, entries: IntakeEntry[]) => void;
  /** Callback when recipe instructions should be shown */
  onShowRecipeInstructions: (recipe: Recipe, ingredients: any[]) => void;
  /** Callback for swipe left navigation (mobile) */
  onSwipeLeft?: () => void;
  /** Callback for swipe right navigation (mobile) */
  onSwipeRight?: () => void;
}

/**
 * TimelineContainer - Main timeline display component
 * 
 * Renders a visual timeline with:
 * - Time indicators as circular badges
 * - Grouped entries by time slot
 * - Recipe banners with ingredients grouped together
 * - Individual entries for non-recipe items
 * - Mobile swipe navigation support
 * - Loading and empty states
 */
const TimelineContainer: React.FC<TimelineContainerProps> = ({
  entries,
  recipes,
  loading,
  onEditEntry,
  onDeleteEntry,
  onDeleteRecipe,
  onShowRecipeInstructions,
  onSwipeLeft,
  onSwipeRight,
}) => {
  // Theme and responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { colorScheme } = useThemeStore();

  /**
   * Check if an entry is from a recipe based on notes pattern
   */
  const isRecipeEntry = (entry: IntakeEntry): boolean => {
    return Boolean(entry.notes && (entry.notes.includes('from ') || entry.notes.startsWith('From ')));
  };

  /**
   * Extract recipe name from entry notes
   * Handles formats: "From [Recipe Name]" or "notes (from [Recipe Name])"
   */
  const extractRecipeName = (notes: string): string => {
    // Handle "From Recipe Name" format
    if (notes.startsWith('From ')) {
      return notes.substring(5); // Remove "From "
    }
    // Handle "notes (from Recipe Name)" format
    const match = notes.match(/\(from (.+)\)$/);
    if (match) {
      return match[1];
    }
    // Fallback to original pattern
    const fallbackMatch = notes.match(/from (.+)/);
    return fallbackMatch ? fallbackMatch[1] : '';
  };

  /**
   * Group entries by time for timeline display
   */
  const groupedEntries = entries.reduce((acc, entry) => {
    const time = entry.entry_time.substring(0, 5); // HH:MM format
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(entry);
    return acc;
  }, {} as Record<string, IntakeEntry[]>);

  const timeSlots = Object.keys(groupedEntries).sort();

  /**
   * Group entries by recipe within each time slot
   * Separates recipe ingredients from individual entries
   */
  const groupEntriesByRecipe = (entries: IntakeEntry[]) => {
    const recipeGroups: { [recipeName: string]: IntakeEntry[] } = {};
    const nonRecipeEntries: IntakeEntry[] = [];
    
    entries.forEach(entry => {
      if (isRecipeEntry(entry)) {
        const recipeName = extractRecipeName(entry.notes!);
        if (!recipeGroups[recipeName]) {
          recipeGroups[recipeName] = [];
        }
        recipeGroups[recipeName].push(entry);
      } else {
        nonRecipeEntries.push(entry);
      }
    });
    
    return { recipeGroups, nonRecipeEntries };
  };

  /**
   * Handle recipe banner click - show recipe instructions with actual consumed quantities
   */
  const handleRecipeBannerClick = async (recipeName: string, recipeEntries: IntakeEntry[]) => {
    const recipe = recipes.find(r => r.name === recipeName);
    if (recipe) {
      if (recipeEntries && recipeEntries.length > 0) {
        // Use actual consumed quantities from timeline
        const timelineIngredients = recipeEntries.map((entry: IntakeEntry) => ({
          id: entry.id,
          ingredient_id: entry.item_id,
          ingredient_name: entry.item_name || 'Unknown Ingredient',
          quantity: entry.quantity,
          unit: entry.unit
        }));
        onShowRecipeInstructions(recipe, timelineIngredients);
      } else {
        // Fallback to recipe database ingredients
        try {
          const response = await api.get(`/recipes/${recipe.id}/ingredients`);
          onShowRecipeInstructions(recipe, response.data.data || []);
        } catch (error) {
          console.error('Failed to fetch recipe ingredients:', error);
          onShowRecipeInstructions(recipe, []);
        }
      }
    }
  };

  /**
   * Mobile swipe gesture handlers
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    e.currentTarget.setAttribute('data-start-x', touch.clientX.toString());
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const startX = parseFloat(e.currentTarget.getAttribute('data-start-x') || '0');
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0 && onSwipeLeft) {
        // Swiped left - next day
        onSwipeLeft();
      } else if (diff < 0 && onSwipeRight) {
        // Swiped right - previous day
        onSwipeRight();
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          Loading your timeline...
        </Typography>
      </Box>
    );
  }

  // Empty state
  if (timeSlots.length === 0) {
    return null; // Empty state is handled by parent component
  }

  return (
    <Box 
      sx={{ 
        maxWidth: 800, 
        mx: 'auto', 
        p: isMobile ? 2 : 3,
        // Add touch support for mobile swipe navigation
        ...(isMobile && {
          touchAction: 'pan-y',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            pointerEvents: 'none',
            background: 'transparent'
          }
        })
      }}
      // Add swipe gesture support on mobile
      {...(isMobile && {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd
      })}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Timeline line */}
        <Box
          sx={{
            position: 'absolute',
            left: isMobile ? 24 : 28, // Center the line with time indicators
            top: 0,
            bottom: 0,
            width: 2,
            bgcolor: theme.palette.divider,
            zIndex: 0
          }}
        />
        
        {/* Timeline entries grouped by time */}
        {timeSlots.map((time) => (
          <Box key={time} sx={{ position: 'relative', mb: isMobile ? 6 : 8 }}>
            {/* Time indicator circle */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 8,
                display: 'flex',
                alignItems: 'center',
                zIndex: 1
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  width: isMobile ? 48 : 56,
                  height: isMobile ? 48 : 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(135deg, ${colorScheme.gradients.sidebarHeader.from} 0%, ${colorScheme.gradients.sidebarHeader.to} 100%)`,
                  color: 'white',
                  borderRadius: '50%'
                }}
              >
                <Typography variant="caption" fontWeight={600} fontSize={isMobile ? "0.65rem" : "0.75rem"}>
                  {time}
                </Typography>
              </Paper>
            </Box>

            {/* Entries for this time slot */}
            <Box sx={{ 
              ml: isMobile ? 7 : 8, // Increase left margin to provide clear separation from time indicator
              pl: isMobile ? 1 : 2,
              mt: isMobile ? 3 : 3 // Increase vertical spacing to clear time indicator
            }}>
              {(() => {
                const { recipeGroups, nonRecipeEntries } = groupEntriesByRecipe(groupedEntries[time]);
                const allItems: Array<{ type: 'recipe' | 'entry'; data: any; entries?: IntakeEntry[] }> = [];

                // Add recipe groups (each recipe becomes a banner + ingredients)
                Object.entries(recipeGroups).forEach(([recipeName, recipeEntries]) => {
                  allItems.push({ type: 'recipe', data: recipeName, entries: recipeEntries });
                  recipeEntries.forEach(entry => {
                    allItems.push({ type: 'entry', data: entry });
                  });
                });
                
                // Add individual non-recipe entries
                nonRecipeEntries.forEach(entry => {
                  allItems.push({ type: 'entry', data: entry });
                });
                
                return allItems.map((item) => {
                  if (item.type === 'recipe') {
                    // Recipe Banner Component
                    return (
                      <RecipeBanner
                        key={`recipe-${item.data}`}
                        recipeName={item.data}
                        entries={item.entries || []}
                        onClick={() => handleRecipeBannerClick(item.data, item.entries || [])}
                        onDelete={(recipeName: string, entries: IntakeEntry[]) => onDeleteRecipe(recipeName, entries)}
                      />
                    );
                  } else {
                    // Individual Entry Component
                    const entry = item.data;
                    const isRecipeIngredient = isRecipeEntry(entry);
                    
                    return (
                      <TimelineEntry
                        key={entry.id}
                        entry={entry}
                        isRecipeIngredient={isRecipeIngredient}
                        onEdit={onEditEntry}
                        onDelete={onDeleteEntry}
                      />
                    );
                  }
                });
              })()}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TimelineContainer;
