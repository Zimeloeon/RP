/**
 * Grocery Store Management
 * 
 * This store manages grocery list functionality and cache invalidation.
 * It tracks when intake entries change to ensure grocery lists are
 * refreshed when users add/edit/delete nutrition entries.
 * 
 * The store uses a timestamp-based approach to create invalidation keys
 * that trigger re-fetching of grocery list data when intake data changes.
 */

import { create } from 'zustand';

/**
 * Grocery Store Interface
 * Manages grocery list cache invalidation and intake change tracking
 */
interface GroceryStore {
  lastIntakeChangeTimestamp: number;              // Timestamp of last intake change
  triggerIntakeChange: () => void;                // Method to record intake changes
  getInvalidationKey: (startDate: string, endDate: string) => string; // Generate cache keys
}

/**
 * Grocery Store Implementation
 * 
 * Provides grocery list cache management by tracking intake entry changes.
 * When users add, edit, or delete nutrition entries, this store ensures
 * that grocery lists are invalidated and refreshed.
 */
export const useGroceryStore = create<GroceryStore>((set, get) => ({
  lastIntakeChangeTimestamp: Date.now(),
  
  /**
   * Trigger Intake Change
   * Called whenever intake entries are modified to invalidate grocery list cache
   */
  triggerIntakeChange: () => {
    set({ lastIntakeChangeTimestamp: Date.now() });
  },
  
  /**
   * Generate Invalidation Key
   * Creates a cache key that includes the date range and last change timestamp.
   * The timestamp is rounded to nearest minute to prevent excessive cache invalidation
   * for rapid successive changes.
   * 
   * @param startDate - Start date for grocery list period
   * @param endDate - End date for grocery list period
   * @returns Cache invalidation key
   */
  getInvalidationKey: (startDate: string, endDate: string) => {
    const { lastIntakeChangeTimestamp } = get();
    // Create a more stable key that changes less frequently
    // Round to nearest minute to reduce excessive invalidations for rapid changes
    const roundedTimestamp = Math.floor(lastIntakeChangeTimestamp / 60000) * 60000;
    return `grocery-${startDate}-${endDate}-${roundedTimestamp}`;
  },
}));
