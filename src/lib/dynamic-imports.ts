import dynamic from 'next/dynamic';
import React from 'react';

// Componente de carga genérico para reducir duplicación
const LoadingPlaceholder = ({ message = "Cargando..." }) => (
  <div className="loading-placeholder">{message}</div>
);

// Opciones de carga comunes para reducir duplicación
const commonOptions = {
  ssr: false,
  loading: () => <LoadingPlaceholder />
};

// Importaciones dinámicas para componentes pesados
export const DynamicChart = dynamic(
  () => import('../components/core/chart').then((mod) => mod.Chart), 
  {
    ...commonOptions,
    loading: () => <LoadingPlaceholder message="Cargando gráfico..." />
  }
);

// Importaciones dinámicas para componentes de dashboard
export const DynamicPoliciesChart = dynamic(
  () => import('../components/dashboard/policies-chart').then((mod) => mod.default),
  commonOptions
);

// Importaciones dinámicas para bibliotecas de terceros
export const DynamicApexCharts = dynamic(
  () => import('react-apexcharts').then((mod) => mod.default),
  commonOptions
);

// Nuevas importaciones dinámicas para componentes de la página principal
export const DynamicHero = dynamic(
  () => import('../components/hero').then((mod) => mod.default),
  { ssr: true } // Este componente es crítico, usar SSR
);

export const DynamicBenefits = dynamic(
  () => import('../components/benefits').then((mod) => mod.default),
  { loading: () => <LoadingPlaceholder /> }
);

export const DynamicFeatures = dynamic(
  () => import('../components/features').then((mod) => mod.default),
  { loading: () => <LoadingPlaceholder /> }
);

export const DynamicTestimonials = dynamic(
  () => import('../components/testimonials').then((mod) => mod.default),
  { loading: () => <LoadingPlaceholder /> }
);

export const DynamicHowItWorks = dynamic(
  () => import('../components/how-it-works').then((mod) => mod.default),
  { loading: () => <LoadingPlaceholder /> }
);

export const DynamicSecurity = dynamic(
  () => import('../components/security').then((mod) => mod.default),
  { loading: () => <LoadingPlaceholder /> }
);

export const DynamicFAQ = dynamic(
  () => import('../components/faq').then((mod) => mod.default),
  { loading: () => <LoadingPlaceholder /> }
);

export const DynamicCta = dynamic(
  () => import('../components/cta').then((mod) => mod.default),
  { loading: () => <LoadingPlaceholder /> }
);

export const DynamicDashboardPreview = dynamic(
  () => import('../components/dashboard-preview').then((mod) => mod.default),
  { loading: () => <LoadingPlaceholder /> }
);