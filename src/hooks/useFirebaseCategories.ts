'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FirebaseDatabase } from '../lib/firebase-database';
import { Category } from '../app/types';

export interface UseFirebaseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  refreshData: () => Promise<void>;
  createCategory: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCategory: (id: string, categoryData: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useFirebaseCategories(menuId?: string, realtime: boolean = true): UseFirebaseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  
  const unsubscribeCategories = useRef<(() => void) | null>(null);

  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    setError(errorMessage);
    setConnected(false);
    console.error('Firebase categories error:', err);
  }, []);

  const setupRealtimeListeners = useCallback(() => {
    if (!realtime) return;

    try {
      unsubscribeCategories.current = FirebaseDatabase.subscribeToCategories(
        (categoriesData) => {
          setCategories(categoriesData);
          setConnected(true);
          setError(null);
          if (loading) setLoading(false);
        },
        menuId,
        handleError
      );
    } catch (err) {
      handleError(err);
      setLoading(false);
    }
  }, [realtime, menuId, loading, handleError]);

  const cleanupListeners = useCallback(() => {
    if (unsubscribeCategories.current) {
      unsubscribeCategories.current();
      unsubscribeCategories.current = null;
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (realtime) return;

    try {
      setLoading(true);
      setError(null);
      
      const categoriesData = await FirebaseDatabase.getCategories(menuId);
      setCategories(categoriesData);
      setConnected(true);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [realtime, menuId, handleError]);

  useEffect(() => {
    if (realtime) {
      setupRealtimeListeners();
    } else {
      refreshData();
    }

    return cleanupListeners;
  }, [realtime, setupRealtimeListeners, refreshData, cleanupListeners]);

  const createCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const id = await FirebaseDatabase.createCategory(categoryData);
      if (!realtime) await refreshData();
      return id;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const updateCategory = useCallback(async (id: string, categoryData: Partial<Category>) => {
    try {
      setError(null);
      await FirebaseDatabase.updateCategory(id, categoryData);
      if (!realtime) await refreshData();
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      setError(null);
      await FirebaseDatabase.deleteCategory(id);
      if (!realtime) await refreshData();
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [realtime, refreshData, handleError]);

  return {
    categories,
    loading,
    error,
    connected,
    refreshData,
    createCategory,
    updateCategory,
    deleteCategory
  };
}