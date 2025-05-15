/** @jsxRuntime classic */
/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import dynamic from 'next/dynamic';
import React from 'react';

// Componente de carga genérico para reducir duplicación
const LoadingPlaceholder = ({ message = "Cargando..." }: { message?: string }): React.ReactElement => (
  React.createElement("div", { className: "loading-placeholder" }, message)
);

// Importaciones dinámicas para componentes pesados
export const DynamicChart = dynamic(
  () => import('../components/core/chart').then((mod) => mod.Chart),
  {
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder, { message: "Cargando gráfico..." })
  }
);

// Importaciones dinámicas para componentes de dashboard
export const DynamicPoliciesChart = dynamic(
  () => import('../components/dashboard/policies-chart'),
  {
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder)
  }
);

// Importaciones dinámicas para bibliotecas de terceros
export const DynamicApexCharts = dynamic(
  () => import('react-apexcharts'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder)
  }
);

// Nuevas importaciones dinámicas para componentes de la página principal
export const DynamicHero = dynamic(
  () => import('../components/hero'),
  { 
    ssr: true,
    loading: () => React.createElement(LoadingPlaceholder)
  }
);

export const DynamicBenefits = dynamic(
  () => import('../components/benefits'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder) 
  }
);

export const DynamicFeatures = dynamic(
  () => import('../components/features'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder) 
  }
);

export const DynamicTestimonials = dynamic(
  () => import('../components/testimonials'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder) 
  }
);

export const DynamicHowItWorks = dynamic(
  () => import('../components/how-it-works'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder) 
  }
);

export const DynamicSecurity = dynamic(
  () => import('../components/security'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder) 
  }
);

export const DynamicFAQ = dynamic(
  () => import('../components/faq'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder) 
  }
);

export const DynamicCta = dynamic(
  () => import('../components/cta'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder) 
  }
);

export const DynamicDashboardPreview = dynamic(
  () => import('../components/dashboard-preview'),
  { 
    ssr: false,
    loading: () => React.createElement(LoadingPlaceholder) 
  }
);