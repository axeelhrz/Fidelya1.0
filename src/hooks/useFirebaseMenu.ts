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
          console.log('🔄 Configurando listener en tiempo real para menú:', menuId);
          
          unsubscribe = DatabaseAPI.realtime.subscribeToMenu(menuId, (menu) => {
            console.log('📡 Datos del menú actualizados en tiempo real:', menu?.name);
            setMenuData(menu);
            setLoading(false);
            if (!menu) {
              setError('Menú no encontrado');
            } else {
              setError(null);
            }
          });
        } else {
          // Fallback para adaptadores sin tiempo real
          console.log('📄 Cargando menú sin tiempo real:', menuId);
          const menu = await DatabaseAPI.menus.get(menuId);
          if (menu) {
            // If menu exists, load products separately
            const products = await DatabaseAPI.products.getByMenu(menuId);
            setMenuData({ ...menu, products });
          } else {
            setMenuData(null);
            setError('Menú no encontrado');
          }
          setLoading(false);
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
        console.log('🔌 Cancelando suscripción al menú:', menuId);
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
      
      console.log('📝 Actualizando menú:', menuData.id, updates);
      await DatabaseAPI.menus.update(menuData.id, updates);
      
      console.log('✅ Menú actualizado exitosamente');
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

      const newProduct: Omit<Product, 'id'> = {
        ...product,
        menuId: menuData.id,
        isAvailable: product.isAvailable ?? true
      };

      console.log('➕ Agregando producto:', newProduct.name);
      await DatabaseAPI.products.create(newProduct);
      
      console.log('✅ Producto agregado exitosamente');
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

      console.log('📝 Actualizando producto:', productId, updates);
      await DatabaseAPI.products.update(productId, updates);
      
      console.log('✅ Producto actualizado exitosamente');
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
      
      console.log('🗑️ Eliminando producto:', productId);
      await DatabaseAPI.products.delete(productId);
      
      console.log('✅ Producto eliminado exitosamente');
    } catch (error) {
      handleError(error, 'eliminar producto');
    }
  }, [menuData, handleError]);

  // Actualizar disponibilidad de múltiples productos
  const updateProductsAvailability = useCallback(async (productIds: string[], isAvailable: boolean) => {
    if (!menuData) return;

    try {
      setError(null);
      const DatabaseAPI = await getDatabaseAPI();
      
      console.log(`🔄 Actualizando disponibilidad de ${productIds.length} productos:`, isAvailable);
      
      if ('updateAvailability' in DatabaseAPI.products) {
        await DatabaseAPI.products.updateAvailability(productIds, isAvailable);
      } else {
        // Fallback para actualizaciones individuales
        await Promise.all(
          productIds.map(id => DatabaseAPI.products.update(id, { isAvailable }))
        );
      }
      
      console.log('✅ Disponibilidad actualizada exitosamente');
    } catch (error) {
      handleError(error, 'actualizar disponibilidad');
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
    updateProductsAvailability
  };
};

export default useFirebaseMenu;