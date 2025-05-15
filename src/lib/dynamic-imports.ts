import dynamic from 'next/dynamic';
import React from 'react';

/**
 * Creates a dynamically imported component with customizable loading state and SSR options
 * @param importFunc Function that returns the import promise
 * @param options Configuration options for the dynamic import
 * @returns Dynamically imported component
 */
export const createDynamicComponent = <T extends React.ComponentType<P>, P = object>(
  importFunc: () => Promise<{ default: T } | T>,
  options?: {
    loading?: React.ReactNode | (() => React.ReactNode);
    ssr?: boolean;
    suspense?: boolean;
  }
) => {
  const { loading, ssr = false, suspense = false } = options || {};
  
  const loadingComponent = loading 
    ? typeof loading === 'function' 
      ? loading 
      : () => loading
    : () => React.createElement('div', { className: "loading-placeholder" }, null);
  
  return dynamic(importFunc, {
    loading: loadingComponent,
    ssr,
    suspense
  });
};

/**
 * Creates a dynamically imported component that only loads when it becomes visible in the viewport
 * @param importFunc Function that returns the import promise
 * @param options Configuration options for the dynamic import
 * @returns Dynamically imported component with intersection observer
 */
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T } | T>,
  options?: {
    loading?: React.ReactNode | (() => React.ReactNode);
    threshold?: number;
    rootMargin?: string;
  }
) => {
  const { loading, threshold = 0.1, rootMargin = '200px' } = options || {};
  
  // Use dynamic import with proper typing
  const DynamicComponent = dynamic(importFunc, {
    loading: loading 
      ? typeof loading === 'function' 
        ? loading 
        : () => loading
      : () => React.createElement('div', { className: "loading-placeholder" }, null),
    ssr: false
  });
  
// Create a wrapper component that uses IntersectionObserver
  // Use React.ComponentProps<T> to correctly type the props
  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  
    return (
      <div ref={ref}>
        {isVisible ? (
          <DynamicComponent {...props} />
        ) : (
          loading ? (
            typeof loading === 'function' ? loading() : loading
          ) : (
            <div style={{ height: '100px' }} />
          )
        )}
      </div>
    );
  };
  };

// Importaciones dinámicas para componentes pesados
export const DynamicChart = dynamic(
  () => import('../components/core/chart').then((mod) => mod.Chart), {
  loading: () => React.createElement('div', { className: "loading-placeholder" }, "Cargando gráfico..."),
  ssr: false, // Deshabilitar SSR para componentes que solo se necesitan en el cliente
});

// Importaciones dinámicas para componentes de dashboard
export const DynamicPoliciesChart = dynamic(
  () => import('../components/dashboard/policies-chart').then((mod) => mod.default),
  { ssr: false, loading: () => React.createElement('div', { className: "loading-placeholder" }, "Cargando...") }
);

// Importaciones dinámicas para bibliotecas de terceros
export const DynamicApexCharts = dynamic(
  () => import('react-apexcharts').then((mod) => mod.default),
  { ssr: false }
);