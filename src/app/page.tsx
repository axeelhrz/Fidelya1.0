'use client';

import React, { Suspense } from 'react';
import ClientLayout from './clientLayout';
import { 
  DynamicHero,
  DynamicBenefits,
  DynamicFeatures,
  DynamicDashboardPreview,
  DynamicTestimonials,
  DynamicHowItWorks,
  DynamicSecurity,
  DynamicFAQ,
  DynamicCta
} from '@/lib/dynamic-imports';

// Componente de carga para secciones
const SectionLoader = () => (
  <div className="section-loader" style={{ 
    height: '300px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }}>
    Cargando sección...
  </div>
);

// Componente de sección con carga diferida
const LazySection = ({ id, component: Component }: { id: string, component: React.ComponentType }) => (
  <section id={id} style={{ scrollMarginTop: '120px' }}>
    <Suspense fallback={<SectionLoader />}>
      <Component />
    </Suspense>
  </section>
);

export default function Home(): React.ReactElement {
  return (
    <ClientLayout>
      {/* Hero es crítico, cargarlo inmediatamente */}
      <DynamicHero />

      {/* Usar Intersection Observer para cargar componentes cuando sean visibles */}
      <LazySection id="benefits" component={DynamicBenefits} />
      <LazySection id="features" component={DynamicFeatures} />
      
      {/* Cargar el preview del dashboard cuando sea visible */}
      <Suspense fallback={<SectionLoader />}>
        <DynamicDashboardPreview />
      </Suspense>
      
      <Suspense fallback={<SectionLoader />}>
        <DynamicTestimonials />
      </Suspense>
      
      <LazySection id="how-it-works" component={DynamicHowItWorks} />
      <LazySection id="security" component={DynamicSecurity} />
      <LazySection id="faq" component={DynamicFAQ} />
      <LazySection id="contact" component={DynamicCta} />
    </ClientLayout>
  );
}
