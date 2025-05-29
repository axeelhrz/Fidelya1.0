'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, MenuData } from '../app/types';

interface DatabaseHook {
  // Estados
  loading: boolean;
  error: string | null;
  
  // Operaciones de menús
  menus: MenuData[];
  getMenu: (id: string) => Promise<MenuData | null>;
  getAllMenus: () => Promise<MenuData[]>;
  createMenu: (menu: MenuData) => Promise<boolean>;
  updateMenu: (menu: MenuData) => Promise<boolean>;
  deleteMenu: (id: string) => Promise<boolean>;
  
  // Operaciones de productos
  createProduct: (product: Product, menuId: string) => Promise<boolean>;
  updateProduct: (product: Product, menuId: string) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  // Utilidades
  initializeDatabase: (force?: boolean) => Promise<boolean>;
  refreshMenus: () => Promise<void>;
  getDatabaseInfo: () => Promise<object | null>;
}

export const useDatabase = (): DatabaseHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menus, setMenus] = useState<MenuData[]>([]);

  // Función para manejar errores
  const handleError = (error: unknown, defaultMessage: string) => {
    console.error('Database Error:', error);
    setError(error instanceof Error ? error.message : defaultMessage);
    setLoading(false);
  };

  // Función para hacer peticiones HTTP
  const apiRequest = async (url: string, options: RequestInit = {}) => {
    console.log('API Request:', url, options);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('API Response Status:', response.status);
    
    const data = await response.json();
    console.log('API Response Data:', data);
    
    if (!data.success) {
      throw new Error(data.error || 'Error en la operación');
    }
    
    return data;
  };

  // Obtener todos los menús
  const getAllMenus = useCallback(async (): Promise<MenuData[]> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Getting all menus...');
      
      const data = await apiRequest('/api/menus');
      console.log('Menus loaded:', data.data);
      setMenus(data.data);
      return data.data;
    } catch (error) {
      handleError(error, 'Error obteniendo los menús');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un menú específico
  const getMenu = async (id: string): Promise<MenuData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiRequest(`/api/menus/${id}`);
      return data.data;
    } catch (error) {
      handleError(error, 'Error obteniendo el menú');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo menú
  const createMenu = async (menu: MenuData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest('/api/menus', {
        method: 'POST',
        body: JSON.stringify(menu),
      });
      await refreshMenus();
      return true;
    } catch (error) {
      handleError(error, 'Error creando el menú');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un menú
  const updateMenu = async (menu: MenuData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest(`/api/menus/${menu.id}`, {
        method: 'PUT',
        body: JSON.stringify(menu),
      });
      
      await refreshMenus();
      return true;
    } catch (error) {
      handleError(error, 'Error actualizando el menú');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un menú
  const deleteMenu = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest(`/api/menus/${id}`, {
        method: 'DELETE',
      });
      
      await refreshMenus();
      return true;
    } catch (error) {
      handleError(error, 'Error eliminando el menú');
      return false;
    } finally {
      setLoading(false);
    }
};

  // Crear un producto
  const createProduct = async (product: Product, menuId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify({ product, menuId }),
      });
      
      await refreshMenus();
      return true;
    } catch (error) {
      handleError(error, 'Error creando el producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un producto
  const updateProduct = async (product: Product, menuId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest(`/api/products/${product.id}`, {
        method: 'PUT',
        body: JSON.stringify({ product, menuId }),
      });
      
      await refreshMenus();
      return true;
    } catch (error) {
      handleError(error, 'Error actualizando el producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un producto
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await apiRequest(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      await refreshMenus();
      return true;
    } catch (error) {
      handleError(error, 'Error eliminando el producto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Inicializar la base de datos con datos del archivo
  const initializeDatabase = async (force: boolean = false): Promise<boolean> => {
    try {
      console.log('Initializing database with force:', force);
      setLoading(true);
      setError(null);
      
      const data = await apiRequest('/api/database/seed', {
        method: 'POST',
        body: JSON.stringify({ force }),
      });
      
      console.log('Database initialized successfully:', data);
      await refreshMenus();
      return true;
    } catch (error) {
      console.error('Database initialization failed:', error);
      handleError(error, 'Error inicializando la base de datos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obtener información de la base de datos
  const getDatabaseInfo = async () => {
    try {
      const data = await apiRequest('/api/database/seed');
      return data.data;
    } catch (error) {
      console.error('Error obteniendo información de la base de datos:', error);
      return null;
    }
  };

  // Refrescar la lista de menús
  const refreshMenus = async (): Promise<void> => {
    console.log('Refreshing menus...');
    await getAllMenus();
  };

  // Cargar menús al montar el componente
  useEffect(() => {
    console.log('useDatabase mounted, loading menus...');
    getAllMenus();
  }, [getAllMenus]);

  return {
    loading,
    error,
    menus,
    getMenu,
    getAllMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    createProduct,
    updateProduct,
    deleteProduct,
    initializeDatabase,
    refreshMenus,
    getDatabaseInfo,
  };
};