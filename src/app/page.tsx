'use client';

import React from 'react';
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

// Either remove LazySection if not needed or use it in the component below

export default function Home(): React.ReactElement {
  return (
    <ClientLayout>
      {/* Hero es crítico, cargarlo inmediatamente */}
      <DynamicHero />

      {/* Secciones con ID para navegación */}
      <section id="benefits" style={{ scrollMarginTop: '120px' }}>
        <DynamicBenefits />
      </section>

      <section id="features" style={{ scrollMarginTop: '120px' }}>
        <DynamicFeatures />
      </section>
        <DynamicDashboardPreview />
        <DynamicTestimonials />
      
      <section id="how-it-works" style={{ scrollMarginTop: '120px' }}>
        <DynamicHowItWorks />
      </section>
      
      <section id="security" style={{ scrollMarginTop: '120px' }}>
        <DynamicSecurity />
      </section>

      <section id="faq" style={{ scrollMarginTop: '120px' }}>
        <DynamicFAQ />
      </section>

      <section id="contact" style={{ scrollMarginTop: '120px' }}>
        <DynamicCta />
      </section>
    </ClientLayout>
  );
}
