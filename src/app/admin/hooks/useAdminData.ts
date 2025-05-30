'use client';

import { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types';

interface UseAdminDataReturn {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export function useAdminData(): UseAdminDataReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories] = useState<ProductCategory[]>([
    'Bebidas', 'Sin Alcohol', 'Tapas', 'Principales', 'Postres', 'Café', 'Promociones'
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error || 'Error al cargar productos');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => [...prev, data.data]);
      } else {
        setError(data.error || 'Error al crear producto');
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Error al crear producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...productData }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === id ? data.data : p));
      } else {
        setError(data.error || 'Error al actualizar producto');
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Error al actualizar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        setError(data.error || 'Error al eliminar producto');
        throw new Error(data.error);
      }
    } catch (err) {
      setError('Error al eliminar producto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    categories,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
  };
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