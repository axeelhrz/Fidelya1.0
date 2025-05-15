import dynamic from 'next/dynamic';
import React from 'react';

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