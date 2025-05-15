import dynamic from 'next/dynamic';
import React from 'react';

/**
 * Creates a dynamically imported component with customizable loading state and SSR options
 * @param importFunc Function that returns the import promise
 * @param options Configuration options for the dynamic import
 * @returns Dynamically imported component
 */
export const createDynamicComponent = <T extends React.ComponentType<unknown>>(
  importFunc: () => Promise<{ default: T } | T>,
  options?: {
    loading?: React.ReactNode | (() => React.ReactNode);
    ssr?: boolean;
    suspense?: boolean;
  }
) => {
  const { loading, ssr = false } = options || {};
  
  const loadingComponent = loading 
    ? typeof loading === 'function' 
      ? loading 
      : () => loading
    : () => React.createElement('div', { className: "loading-placeholder" }, "Cargando...");
  
  return dynamic(importFunc, {
    loading: loadingComponent,
    ssr
  });
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