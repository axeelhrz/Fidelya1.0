'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, Product, MenuData } from '../app/types';
import { getDatabaseAPI } from '../lib/database';

interface DatabaseInfo {
  menusCount: number;
  productsCount: number;
  dbType: string;
  status: string;
  realtime?: boolean;
}

interface UseDatabaseReturn {
  menus: MenuData[];
  loading: boolean;
  error: string | null;
  initializeDatabase: (force?: boolean) => Promise<void>;
  getDatabaseInfo: () => Promise<DatabaseInfo>;
  refreshMenus: () => Promise<void>;
  createMenu: (menu: Omit<Menu, 'id'>) => Promise<Menu | null>;
  updateMenu: (id: string, updates: Partial<Menu>) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  exportData: () => Promise<{ menus: Menu[], products: Product[] } | null>;
}

export const useDatabase = (): UseDatabaseReturn => {
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar errores
  const handleError = useCallback((error: Error | unknown, operation: string) => {
    console.error(`Error en ${operation}:`, error);
    setError(`Error en ${operation}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }, []);

  // Cargar menús con productos
  const loadMenusWithProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const DatabaseAPI = await getDatabaseAPI();
      
      // Obtener todos los menús
      const menusData = await DatabaseAPI.menus.getAll();
      
      // Para cada menú, obtener sus productos
      const menusWithProducts = await Promise.all(
        menusData.map(async (menu) => {
          const products = await DatabaseAPI.products.getByMenu(menu.id);
          return {
            ...menu,
            products: products
          } as MenuData;
        })
      );

      setMenus(menusWithProducts);
    } catch (error) {
      handleError(error, 'cargar menús');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Cargar datos iniciales
  useEffect(() => {
    loadMenusWithProducts();
  }, [loadMenusWithProducts]);

  // Inicializar base de datos
  const initializeDatabase = useCallback(async (force: boolean = false) => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('🔄 Inicializando base de datos...');
      await DatabaseAPI.initializeDatabase();
      
      console.log('✅ Base de datos inicializada exitosamente');
      await loadMenusWithProducts();
    } catch (error) {
      handleError(error, 'inicializar base de datos');
    }
  }, [handleError, loadMenusWithProducts]);

  // Obtener información de la base de datos
  const getDatabaseInfo = useCallback(async (): Promise<DatabaseInfo> => {
    try {
      const DatabaseAPI = await getDatabaseAPI();
      
      const [menusData, products] = await Promise.all([
        DatabaseAPI.menus.getAll(),
        DatabaseAPI.products.getAll()
      ]);

      const schemaInfo = DatabaseAPI.getSchemaInfo();

      return {
        menusCount: menusData.length,
        productsCount: products.length,
        dbType: schemaInfo.provider || 'Unknown',
        status: schemaInfo.status || 'Unknown',
        realtime: schemaInfo.realtime || false
      };
    } catch (error) {
      console.error('Error obteniendo información de la base de datos:', error);
      return {
        menusCount: 0,
        productsCount: 0,
        dbType: 'Error',
        status: 'Desconectado',
        realtime: false
      };
    }
  }, []);

  // Refrescar menús
  const refreshMenus = useCallback(async () => {
    await loadMenusWithProducts();
  }, [loadMenusWithProducts]);

  // Crear menú
  const createMenu = useCallback(async (menu: Omit<Menu, 'id'>): Promise<Menu | null> => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('➕ Creando nuevo menú:', menu.name);
      const newMenu = await DatabaseAPI.menus.create(menu);
      
      console.log('✅ Menú creado exitosamente:', newMenu.id);
      await loadMenusWithProducts();
      
      return newMenu;
    } catch (error) {
      handleError(error, 'crear menú');
      return null;
    }
  }, [handleError, loadMenusWithProducts]);

  // Actualizar menú
  const updateMenu = useCallback(async (id: string, updates: Partial<Menu>) => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('📝 Actualizando menú:', id, updates);
      await DatabaseAPI.menus.update(id, updates);
      
      console.log('✅ Menú actualizado exitosamente');
      await loadMenusWithProducts();
    } catch (error) {
      handleError(error, 'actualizar menú');
    }
  }, [handleError, loadMenusWithProducts]);

  // Eliminar menú
  const deleteMenu = useCallback(async (id: string) => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('🗑️ Eliminando menú:', id);
      await DatabaseAPI.menus.delete(id);
      
      console.log('✅ Menú eliminado exitosamente');
      await loadMenusWithProducts();
    } catch (error) {
      handleError(error, 'eliminar menú');
    }
  }, [handleError, loadMenusWithProducts]);

  // Exportar datos
  const exportData = useCallback(async (): Promise<{ menus: Menu[], products: Product[] } | null> => {
    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log('📤 Exportando datos...');
      const data = await DatabaseAPI.exportData();
      
      console.log('✅ Datos exportados exitosamente');
      return data;
    } catch (error) {
      handleError(error, 'exportar datos');
      return null;
    }
  }, [handleError]);

  return {
    menus,
    loading,
    error,
    initializeDatabase,
    getDatabaseInfo,
    refreshMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    exportData
  };
};

export default useDatabase;