'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, ProductCategory, AdminStatistics } from '../../types';
import { firebaseDB } from '../../../lib/firebase-database';

interface UseAdminDataReturn {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
  statistics: AdminStatistics | null;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProductsAvailability: (productIds: string[], isAvailable: boolean) => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshStatistics: () => Promise<void>;
}

export function useAdminData(): UseAdminDataReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [categories] = useState<ProductCategory[]>([
    'Bebidas', 'Sin Alcohol', 'Tapas', 'Principales', 'Postres', 'Café', 'Promociones'
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const productsData = await firebaseDB.getProducts();
      setProducts(productsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const stats = await firebaseDB.getStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  }, []);

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newProduct = await firebaseDB.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      await fetchStatistics(); // Actualizar estadísticas
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedProduct = await firebaseDB.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      await fetchStatistics(); // Actualizar estadísticas
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
}
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await firebaseDB.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      await fetchStatistics(); // Actualizar estadísticas
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProductsAvailability = async (productIds: string[], isAvailable: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseDB.updateProductsAvailability(productIds, isAvailable);
      
      // Actualizar estado local
      setProducts(prev => prev.map(product => 
        productIds.includes(product.id) 
          ? { ...product, isAvailable }
          : product
      ));
      
      await fetchStatistics(); // Actualizar estadísticas
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar disponibilidad';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const refreshStatistics = async () => {
    await fetchStatistics();
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchProducts();
    fetchStatistics();
  }, [fetchProducts, fetchStatistics]);

  return {
    products,
    categories,
    loading,
    error,
    statistics,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductsAvailability,
    refreshProducts,
    refreshStatistics,
  };
}

// Hook para datos en tiempo real
export function useRealtimeAdminData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Suscribirse a todos los productos (sin filtro de menú específico)
    const unsubscribe = firebaseDB.realtime.subscribeToProducts('', (productsData) => {
      setProducts(productsData);
      setLoading(false);
      setError(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { products, loading, error };
}

// Hook para estadísticas en tiempo real
export function useRealtimeStatistics() {
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await firebaseDB.getStatistics();
        setStatistics(stats);
      } catch (err) {
        console.error('Error fetching real-time statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Actualizar estadísticas cada 30 segundos
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { statistics, loading };
}

// Hook adicional para estadísticas del admin
export function useAdminStats(products: Product[]) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    recommendedProducts: 0,
    veganProducts: 0,
    productsByCategory: {} as Record<string, number>
  });

  useEffect(() => {
    const totalProducts = products.length;
    const availableProducts = products.filter(p => p.isAvailable).length;
    const recommendedProducts = products.filter(p => p.isRecommended).length;
    const veganProducts = products.filter(p => p.isVegan).length;
    
    const productsByCategory = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    setStats({
      totalProducts,
      availableProducts,
      recommendedProducts,
      veganProducts,
      productsByCategory
    });
  }, [products]);

  return stats;
}

// Hook para manejar filtros de productos
export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'Todas',
    showOnlyAvailable: false,
    showOnlyRecommended: false,
    showOnlyVegan: false
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesCategory = filters.category === 'Todas' || product.category === filters.category;
    
    const matchesAvailable = !filters.showOnlyAvailable || product.isAvailable;
    
    const matchesRecommended = !filters.showOnlyRecommended || product.isRecommended;
    
    const matchesVegan = !filters.showOnlyVegan || product.isVegan;

    return matchesSearch && matchesCategory && matchesAvailable && matchesRecommended && matchesVegan;
  });

  const updateFilter = (key: keyof typeof filters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'Todas',
      showOnlyAvailable: false,
      showOnlyRecommended: false,
      showOnlyVegan: false
    });
  };

  return {
    filters,
    filteredProducts,
    updateFilter,
    clearFilters,
    hasActiveFilters: filters.searchTerm !== '' || 
                     filters.category !== 'Todas' || 
                     filters.showOnlyAvailable || 
                     filters.showOnlyRecommended || 
                     filters.showOnlyVegan
  };
}