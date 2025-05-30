'use client';

import { useState, useEffect, useCallback } from 'react';
import { MenuData, Menu, Product } from '../app/types';
import { firebaseDB } from '../lib/firebase-database';

interface UseFirebaseMenuReturn {
  menuData: MenuData | null;
  loading: boolean;
  error: string | null;
  refreshMenu: () => Promise<void>;
}

export function useFirebaseMenu(menuId: string): UseFirebaseMenuReturn {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    if (!menuId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const menu = await firebaseDB.getMenuWithProducts(menuId);
      setMenuData(menu);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el menú';
      setError(errorMessage);
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  }, [menuId]);

  const refreshMenu = async () => {
    await fetchMenu();
  };

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return {
    menuData,
    loading,
    error,
    refreshMenu
  };
}

// Hook para menús en tiempo real
export function useRealtimeMenu(menuId: string) {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!menuId) return;

    setLoading(true);
    
    const unsubscribe = firebaseDB.realtime.subscribeToMenu(menuId, (menu) => {
      setMenuData(menu);
      setLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, [menuId]);

  return { menuData, loading, error };
}

// Hook para lista de menús
export function useFirebaseMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const menusData = await firebaseDB.getMenus();
      setMenus(menusData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los menús';
      setError(errorMessage);
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMenu = async (menuData: Omit<Menu, 'id'>) => {
    try {
      const newMenu = await firebaseDB.createMenu(menuData);
      setMenus(prev => [newMenu, ...prev]);
      return newMenu;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el menú';
      setError(errorMessage);
      throw err;
    }
  };

  const updateMenu = async (id: string, menuData: Partial<Menu>) => {
    try {
      const updatedMenu = await firebaseDB.updateMenu(id, menuData);
      setMenus(prev => prev.map(m => m.id === id ? updatedMenu : m));
      return updatedMenu;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el menú';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteMenu = async (id: string) => {
    try {
      await firebaseDB.deleteMenu(id);
      setMenus(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el menú';
      setError(errorMessage);
      throw err;
    }
  };

  const duplicateMenu = async (menuId: string, newName: string) => {
    try {
      const duplicatedMenu = await firebaseDB.duplicateMenu(menuId, newName);
      setMenus(prev => [duplicatedMenu, ...prev]);
      return duplicatedMenu;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al duplicar el menú';
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return {
    menus,
    loading,
    error,
    createMenu,
    updateMenu,
    deleteMenu,
    duplicateMenu,
    refreshMenus: fetchMenus
  };
}

// Hook para menús en tiempo real
export function useRealtimeMenus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = firebaseDB.realtime.subscribeToMenus((menusData) => {
      setMenus(menusData);
      setLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { menus, loading, error };
}