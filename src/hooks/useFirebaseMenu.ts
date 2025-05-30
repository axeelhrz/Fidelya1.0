'use client';

import { useState, useEffect, useCallback } from 'react';
import { MenuData, Product, UseFirebaseMenuReturn } from '../app/types';
import { getDatabaseAPI } from '../lib/database';

export const useFirebaseMenu = (menuId: string): UseFirebaseMenuReturn => {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar errores
  const handleError = useCallback((error: Error | unknown, operation: string) => {
    console.error(`Error en ${operation}:`, error);
    setError(`Error en ${operation}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }, []);

  // Cargar menú inicial y configurar listener en tiempo real
  useEffect(() => {
    if (!menuId) {
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    const setupRealtimeListener = async () => {
      try {
        setLoading(true);
        setError(null);

        const DatabaseAPI = await getDatabaseAPI();
        
        // Verificar si el adaptador tiene funcionalidad en tiempo real
        if ('realtime' in DatabaseAPI && DatabaseAPI.realtime?.subscribeToMenu) {
          console.log('Configurando listener en tiempo real para menú:', menuId);
          
          unsubscribe = DatabaseAPI.realtime.subscribeToMenu(menuId, (menu) => {
            setMenuData(menu);
            setLoading(false);
            if (!menu) {
              setError('Menú no encontrado');
            }
          });
        } else {
          // Fallback para adaptadores sin tiempo real
          console.log('Cargando menú sin tiempo real:', menuId);
          const menu = await DatabaseAPI.menus.get(menuId);
          setMenuData(menu);
          setLoading(false);
          if (!menu) {
            setError('Menú no encontrado');
          }
        }
      } catch (error) {
        handleError(error, 'cargar menú');
        setLoading(false);
      }
    };

    setupRealtimeListener();

    // Cleanup
    return () => {
      if (unsubscribe) {
        console.log('Cancelando suscripción al menú:', menuId);
        unsubscribe();
      }
    };
  }, [menuId, handleError]);

  // Actualizar información del menú
  const updateMenu = useCallback(async (updates: Partial<MenuData>) => {
    if (!menuData) return;

    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      const updatedMenu = { ...menuData, ...updates };
      const success = await DatabaseAPI.menus.update(updatedMenu);
      
      if (!success) {
        throw new Error('No se pudo actualizar el menú');
      }

      console.log('Menú actualizado exitosamente');
    } catch (error) {
      handleError(error, 'actualizar menú');
    }
  }, [menuData, handleError]);

  // Agregar producto
  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    if (!menuData) return;

    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      const newProduct: Product = {
        ...product,
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const success = await DatabaseAPI.products.create(newProduct, menuData.id);
      
      if (!success) {
        throw new Error('No se pudo crear el producto');
      }

      console.log('Producto agregado exitosamente:', newProduct.id);
    } catch (error) {
      handleError(error, 'agregar producto');
    }
  }, [menuData, handleError]);

  // Actualizar producto
  const updateProduct = useCallback(async (productId: string, updates: Partial<Product>) => {
    if (!menuData) return;

    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      const existingProduct = menuData.products.find(p => p.id === productId);
      if (!existingProduct) {
        throw new Error('Producto no encontrado');
      }

      const updatedProduct = { ...existingProduct, ...updates };
      const success = await DatabaseAPI.products.update(updatedProduct, menuData.id);
      
      if (!success) {
        throw new Error('No se pudo actualizar el producto');
      }

      console.log('Producto actualizado exitosamente:', productId);
    } catch (error) {
      handleError(error, 'actualizar producto');
    }
  }, [menuData, handleError]);

  // Eliminar producto
  const deleteProduct = useCallback(async (productId: string) => {
    if (!menuData) return;

    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      const success = await DatabaseAPI.products.delete(productId, menuData.id);
      
      if (!success) {
        throw new Error('No se pudo eliminar el producto');
      }

      console.log('Producto eliminado exitosamente:', productId);
    } catch (error) {
      handleError(error, 'eliminar producto');
    }
  }, [menuData, handleError]);

  return {
    menuData,
    loading,
    error,
    updateMenu,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useFirebaseMenu;