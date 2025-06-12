import { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

export const useOptimizedData = (fetchFunction, dependencies = [], options = {}) => {
  const {
    debounceMs = 300,
    cacheKey = null,
    cacheTtl = 5 * 60 * 1000, // 5 minutos
    enableCache = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache simple en memoria
  const cache = useMemo(() => new Map(), []);

  const fetchData = useCallback(async (...args) => {
    const key = cacheKey || JSON.stringify(args);
    
    // Verificar cache
    if (enableCache && cache.has(key)) {
      const cached = cache.get(key);
      if (Date.now() - cached.timestamp < cacheTtl) {
        setData(cached.data);
        return cached.data;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(...args);
      setData(result);
      
      // Guardar en cache
      if (enableCache) {
        cache.set(key, {
          data: result,
          timestamp: Date.now()
        });
      }
      
      return result;
    } catch (err) {
      setError(err);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, cacheKey, enableCache, cacheTtl, cache]);

  // Debounced version
  const debouncedFetch = useMemo(
    () => debounce(fetchData, debounceMs),
    [fetchData, debounceMs]
  );

  useEffect(() => {
    if (dependencies.length > 0) {
      debouncedFetch(...dependencies);
    }
    
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch, dependencies]);

  const refetch = useCallback(() => {
    return fetchData(...dependencies);
  }, [fetchData, dependencies]);

  const clearCache = useCallback(() => {
    cache.clear();
  }, [cache]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
};

export const useVirtualizedList = (items, itemHeight = 50, containerHeight = 400) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    setScrollTop
  };
};