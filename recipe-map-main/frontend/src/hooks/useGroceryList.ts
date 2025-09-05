
/**
 * useGroceryList Hook
 * 
 * Custom React hook for comprehensive grocery list management.
 * Features:
 * - Fetches and aggregates ingredients from intake entries within date range
 * - Manages purchase status with localStorage persistence
 * - Smart quantity change detection for automatic status reset
 * - Date range-specific storage keys for data isolation
 * - Automatic cleanup of outdated storage entries
 * - Real-time updates when intake data changes via store integration
 * 
 * Purchase State Management:
 * - Persists purchase status across browser sessions
 * - Validates stored data against current quantities
 * - Automatically resets purchase status when quantities change
 * - Cleans up old storage entries to prevent memory bloat
 * 
 * Data Aggregation:
 * - Groups ingredients by ID and unit for smart consolidation
 * - Calculates total quantities across multiple meal entries
 * - Tracks occurrence count for shopping frequency insights
 * - Excludes water entries from grocery lists
 * 
 * @param {UseGroceryListProps} props - Hook configuration
 * @returns {Object} Grocery list data and functions
 */

import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { intakeService } from '../services';
import { useGroceryStore } from '../stores';

/**
 * Interface for aggregated ingredient data
 */
export interface AggregatedIngredient {
  /** Unique ingredient identifier */
  item_id: number;
  /** Display name of the ingredient */
  item_name: string;
  /** Total quantity needed across all meal entries */
  totalQuantity: number;
  /** Unit of measurement (g, ml, cup, etc.) */
  unit: string;
  /** Number of times this ingredient appears in meal plan */
  occurrences: number;
  /** Purchase status for shopping list tracking */
  purchased?: boolean;
}

/**
 * Props for the useGroceryList hook
 */
interface UseGroceryListProps {
  /** Start date for the grocery list date range */
  startDate: Dayjs;
  /** End date for the grocery list date range */
  endDate: Dayjs;
}

/**
 * Custom hook for managing grocery list data and purchase state
 * 
 * Provides comprehensive grocery list functionality:
 * - Fetches and aggregates ingredients from intake entries
 * - Manages purchase status with localStorage persistence
 * - Handles quantity change detection for smart state management
 * - Automatic cleanup of outdated storage entries
 * 
 * Features:
 * - Smart purchase state validation (resets when quantities change)
 * - Date range-specific storage keys for isolation
 * - Automatic invalidation when intake data changes
 * - Quantity aggregation by ingredient and unit
 * - Error handling and loading states
 */
const useGroceryList = ({ startDate, endDate }: UseGroceryListProps) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [ingredients, setIngredients] = useState<AggregatedIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getInvalidationKey, lastIntakeChangeTimestamp } = useGroceryStore();

  // ============================================================================
  // STORAGE MANAGEMENT
  // ============================================================================
  
  /**
   * Get storage key for purchase state based on date range and version
   */
  const getStorageKey = () => {
    const baseKey = `grocery-list-purchased-${startDate.format('YYYY-MM-DD')}-${endDate.format('YYYY-MM-DD')}`;
    const invalidationKey = getInvalidationKey(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    const timestamp = invalidationKey.split('-').slice(-1)[0];
    return `${baseKey}-v${timestamp}`;
  };

  /**
   * Load purchased state from localStorage with quantity validation
   */
  const loadPurchasedState = (currentIngredients: AggregatedIngredient[]): Record<number, boolean> => {
    try {
      const stored = localStorage.getItem(getStorageKey());
      if (!stored) return {};
      
      const storedData = JSON.parse(stored);
      
      // Handle old format conversion
      if (typeof Object.values(storedData)[0] === 'boolean') {
        return {}; // Reset old format data
      }
      
      const { purchased = {}, quantities = {} } = storedData;
      const validatedPurchased: Record<number, boolean> = {};
      const changedIngredients: string[] = [];
      const preservedIngredients: string[] = [];
      
      // Validate purchase state against current quantities
      currentIngredients.forEach(ingredient => {
        const itemId = ingredient.item_id;
        const storedQuantity = quantities[itemId];
        const wasPurchased = purchased[itemId];
        
        if (wasPurchased) {
          if (storedQuantity !== undefined && storedQuantity === ingredient.totalQuantity) {
            // Quantity unchanged - preserve purchased state
            validatedPurchased[itemId] = true;
            preservedIngredients.push(`${ingredient.item_name} (${ingredient.totalQuantity}${ingredient.unit})`);
          } else {
            // Quantity changed - reset purchased state
            changedIngredients.push(`${ingredient.item_name} (${storedQuantity || 'new'} → ${ingredient.totalQuantity}${ingredient.unit})`);
          }
        }
      });
      
      // Debug logging
      if (changedIngredients.length > 0) {
        console.log('🔄 Grocery list: Reset purchased status for changed ingredients:', changedIngredients);
      }
      if (preservedIngredients.length > 0) {
        console.log('✅ Grocery list: Preserved purchased status for:', preservedIngredients);
      }
      
      return validatedPurchased;
    } catch (error) {
      console.error('Error loading purchased state:', error);
      return {};
    }
  };

  /**
   * Save purchased state to localStorage with quantity snapshot
   */
  const savePurchasedState = (purchasedState: Record<number, boolean>, currentIngredients: AggregatedIngredient[]) => {
    try {
      // Create quantity snapshot for validation
      const quantities: Record<number, number> = {};
      currentIngredients.forEach(ingredient => {
        quantities[ingredient.item_id] = ingredient.totalQuantity;
      });
      
      const dataToStore = {
        purchased: purchasedState,
        quantities: quantities,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(getStorageKey(), JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving purchased state:', error);
    }
  };

  // ============================================================================
  // DATA FETCHING AND PROCESSING
  // ============================================================================
  
  /**
   * Fetch and aggregate ingredients from intake entries
   */
  const fetchIngredients = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDateStr = startDate.format('YYYY-MM-DD');
      const endDateStr = endDate.format('YYYY-MM-DD');

      // Fetch intake entries for date range
      const entries = await intakeService.getByDateRange(startDateStr, endDateStr);

      // Filter and aggregate ingredient entries
      const ingredientEntries = entries.filter(entry => entry.type === 'ingredient');
      const aggregatedMap = new Map<number, AggregatedIngredient>();

      ingredientEntries.forEach(entry => {
        const key = entry.item_id;
        if (aggregatedMap.has(key)) {
          const existing = aggregatedMap.get(key)!;
          // Add quantities only if units match
          if (existing.unit === entry.unit) {
            existing.totalQuantity += entry.quantity;
            existing.occurrences += 1;
          } else {
            existing.occurrences += 1;
          }
        } else {
          aggregatedMap.set(key, {
            item_id: entry.item_id,
            item_name: entry.item_name || 'Unknown Ingredient',
            totalQuantity: entry.quantity,
            unit: entry.unit,
            occurrences: 1,
          });
        }
      });

      // Convert to array and sort by quantity
      const aggregatedIngredients = Array.from(aggregatedMap.values())
        .sort((a, b) => b.totalQuantity - a.totalQuantity);

      // Apply purchase state from storage
      const purchasedState = loadPurchasedState(aggregatedIngredients);
      const ingredientsWithPurchasedState = aggregatedIngredients.map(ingredient => ({
        ...ingredient,
        purchased: purchasedState[ingredient.item_id] || false,
      }));

      setIngredients(ingredientsWithPurchasedState);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError('Failed to load ingredients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Toggle purchase status for an ingredient
   */
  const togglePurchased = (itemId: number) => {
    setIngredients(prevIngredients => {
      const updated = prevIngredients.map(ingredient => 
        ingredient.item_id === itemId 
          ? { ...ingredient, purchased: !ingredient.purchased }
          : ingredient
      );
      
      // Update localStorage
      const purchasedState: Record<number, boolean> = {};
      updated.forEach(ingredient => {
        if (ingredient.purchased) {
          purchasedState[ingredient.item_id] = true;
        }
      });
      savePurchasedState(purchasedState, updated);
      
      return updated;
    });
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  useEffect(() => {
    // Clean up old storage entries
    const baseKeyPattern = `grocery-list-purchased-${startDate.format('YYYY-MM-DD')}-${endDate.format('YYYY-MM-DD')}`;
    const currentKey = getStorageKey();
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(baseKeyPattern) && key !== currentKey) {
        localStorage.removeItem(key);
      }
    });

    fetchIngredients();
  }, [startDate, endDate, lastIntakeChangeTimestamp]);

  // ============================================================================
  // RETURN
  // ============================================================================
  
  return {
    ingredients,
    loading,
    error,
    togglePurchased,
  };
};

export default useGroceryList;
