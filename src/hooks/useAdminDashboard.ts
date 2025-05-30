'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, Product } from '../app/types';
import { getDatabaseAPI } from '../lib/database';

interface AdminStatistics {
  totalMenus: number;
  totalProducts: number;
  productsByCategory: Record<string, number>;
  availableProducts: number;
  recommendedProducts: number;
  veganProducts: number;
}

interface UseAdminDashboardReturn {
  menus: Menu[];
  statistics: AdminStatistics | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  createMenu: (menu: Omit<Menu, 'id'>) => Promise<Menu | null>;
  updateMenu: (id: string, updates: Partial<Menu>) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  duplicateMenu: (menuId: string, newName: string) => Promise<Menu | null>;
  initializeDatabase: () => Promise<void>;
  exportData: () => Promise<{ menus: Menu[], products: Product[] } | null>;
}

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar errores
  const handleError = useCallback((error: Error | unknown, operation: string) => {
    console.error(`Error en ${operation}:`, error);
    setError(`Error en ${operation}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }, []);

  // Cargar estadísticas
  const loadStatistics = useCallback(async () => {
    try {
      const DatabaseAPI = await getDatabaseAPI();
      
      if ('getStatistics' in DatabaseAPI) {
        const stats = await DatabaseAPI.getStatistics();
        setStatistics(stats);
      } else {
        // Calcular estadísticas manualmente
        const menusData = await DatabaseAPI.menus.getAll();
        const products = menusData.flatMap(menu => DatabaseAPI.products.getByMenu(menu.id));

        const productsByCategory = products.reduce((acc, product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setStatistics({
          totalMenus: menusData.length,
          totalProducts: products.length,
          productsByCategory,
          availableProducts: products.filter(p => p.isAvailable).length,
          recommendedProducts: products.filter(p => p.isRecommended).length,
          veganProducts: products.filter(p => p.isVegan).length
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }, []);

  // Cargar datos iniciales y configurar listeners
  useEffect(() => {
    const setupData = async () => {
      try {
        setLoading(true);
        setError(null);

        const DatabaseAPI = await getDatabaseAPI();
        
        // Cargar menús iniciales
        const menusData = await DatabaseAPI.menus.getAll();
        setMenus(menusData);
        
        // Cargar estadísticas
        await loadStatistics();
        
      } catch (error) {
        handleError(error, 'cargar datos iniciales');
      } finally {
        setLoading(false);
      }
    };

    setupData();
  }, [handleError, loadStatistics]);

  // Refrescar datos
  const refreshData = useCallback(async () => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      const menusData = await DatabaseAPI.menus.getAll();
      setMenus(menusData);
      
      await loadStatistics();
      
      console.log('✅ Datos del dashboard actualizados');
    } catch (error) {
      handleError(error, 'refrescar datos');
    }
  }, [handleError, loadStatistics]);

  // Crear menú
  const createMenu = useCallback(async (menu: Omit<Menu, 'id'>): Promise<Menu | null> => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('➕ Creando nuevo menú:', menu.name);
      const newMenu = await DatabaseAPI.menus.create(menu);
      
      if (newMenu && typeof newMenu === 'object') {
        console.log('✅ Menú creado exitosamente:', newMenu.id);
        await loadStatistics();
        return newMenu;
      } else {
        throw new Error('Error al crear el menú');
      }
    } catch (error) {
      handleError(error, 'crear menú');
      return null;
    }
  }, [handleError, loadStatistics]);

  // Actualizar menú
  const updateMenu = useCallback(async (id: string, updates: Partial<Menu>) => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('📝 Actualizando menú:', id, updates);
      await DatabaseAPI.menus.update(id, updates);
      
      console.log('✅ Menú actualizado exitosamente');
      await loadStatistics();
    } catch (error) {
      handleError(error, 'actualizar menú');
    }
  }, [handleError, loadStatistics]);

  // Eliminar menú
  const deleteMenu = useCallback(async (id: string) => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('🗑️ Eliminando menú:', id);
      await DatabaseAPI.menus.delete(id);
      
      console.log('✅ Menú eliminado exitosamente');
      await loadStatistics();
    } catch (error) {
      handleError(error, 'eliminar menú');
    }
  }, [handleError, loadStatistics]);

  // Duplicar menú
  const duplicateMenu = useCallback(async (menuId: string, newName: string): Promise<Menu | null> => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('📋 Duplicando menú:', menuId, 'como:', newName);
      
      if ('duplicate' in DatabaseAPI.menus) {
        const duplicatedMenu = await DatabaseAPI.menus.duplicate(menuId, newName);
        console.log('✅ Menú duplicado exitosamente:', duplicatedMenu.id);
        await loadStatistics();
        return duplicatedMenu;
      } else {
        throw new Error('Función de duplicación no disponible');
      }
    } catch (error) {
      handleError(error, 'duplicar menú');
      return null;
    }
  }, [handleError, loadStatistics]);

  // Inicializar base de datos
  const initializeDatabase = useCallback(async () => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('🔄 Inicializando base de datos...');
      if ('initializeDatabase' in DatabaseAPI) {
        await DatabaseAPI.initializeDatabase();
      } else {
        console.warn('initializeDatabase no está disponible en esta implementación de base de datos');
      }
      
      console.log('✅ Base de datos inicializada exitosamente');
      await refreshData();
    } catch (error) {
      handleError(error, 'inicializar base de datos');
    }
  }, [handleError, refreshData]);

  // Exportar datos
  const exportData = useCallback(async (): Promise<{ menus: Menu[], products: Product[] } | null> => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('📤 Exportando datos...');
      
      if ('exportData' in DatabaseAPI) {
        const data = await DatabaseAPI.exportData();
        console.log('✅ Datos exportados exitosamente');
        return data;
      } else {
        // Fallback: export data manually
        const menus = await DatabaseAPI.menus.getAll();
        const products = menus.flatMap(menu => DatabaseAPI.products.getByMenu(menu.id));
        const data = { menus, products };
        console.log('✅ Datos exportados exitosamente (fallback)');
        return data;
      }
    } catch (error) {
      handleError(error, 'exportar datos');
      return null;
    }
  }, [handleError]);

  return {
    menus,
    statistics,
    loading,
    error,
    refreshData,
    createMenu,
    updateMenu,
    deleteMenu,
    duplicateMenu,
    initializeDatabase,
    exportData
  };
};

export default useAdminDashboard;