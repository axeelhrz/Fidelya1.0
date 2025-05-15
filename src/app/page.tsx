'use client';

import React from 'react';
import { Container, Skeleton } from '@mui/material';
import ClientLayout from './clientLayout';
import { createDynamicComponent } from '@/lib/dynamic-imports';

// Importar el Hero optimizado directamente (no usar dynamic import para el LCP)
import Hero from '@/components/optimized/hero';
// Componente de esqueleto para mostrar durante la carga
const ComponentSkeleton = ({ height }: { height: number }) => (
  <Container maxWidth="lg">
    <Skeleton 
      variant="rectangular" 
      width="100%" 
      height={height} 
      animation="wave" 
      sx={{ borderRadius: 2, my: 4 }}
    />
  </Container>
);

// Crear componentes dinámicos con opciones optimizadas
const BenefitsSection = createDynamicComponent(() => import('@/components/benefits'), {
  ssr: true,
  loading: () => <ComponentSkeleton height={400} />
});

const Features = createDynamicComponent(() => import('@/components/features'), {
  ssr: true,
  loading: () => <ComponentSkeleton height={400} />
});

const DashboardPreview = createDynamicComponent(() => import('@/components/dashboard-preview'), {
  ssr: true,
  loading: () => <ComponentSkeleton height={300} />
});
const Testimonials = createDynamicComponent(() => import('@/components/testimonials'), {
  ssr: true,
  loading: () => <ComponentSkeleton height={400} />
});

const HowItWorks = createDynamicComponent(() => import('@/components/how-it-works'), {
  ssr: true,
  loading: () => <ComponentSkeleton height={400} />
});

const SecuritySection = createDynamicComponent(() => import('@/components/security'), {
  ssr: true,
  loading: () => <ComponentSkeleton height={300} />
});

const FAQ = createDynamicComponent(() => import('@/components/faq'), {
  ssr: true,
  loading: () => <ComponentSkeleton height={400} />
});

const Cta = createDynamicComponent(() => import('@/components/cta'), {
  ssr: true,
  loading: () => <ComponentSkeleton height={200} />
});

export default function Home(): React.ReactElement {
    return (
        <>
          <ClientLayout>
            {/* Hero se carga directamente para optimizar LCP */}
            <Hero />

            {/* Secciones con carga diferida */}
            <section id='benefits' style={{ scrollMarginTop: '120px' }}>
                <BenefitsSection />
            </section>

            <section id='features' style={{ scrollMarginTop: '120px' }}>
                <Features />
            </section>

            <DashboardPreview /> {/* Load dashboard preview component */}

            <Testimonials />

            <section id='how-it-works' style={{ scrollMarginTop: '120px' }}>
                <HowItWorks />
            </section>

            <section id='security' style={{ scrollMarginTop: '120px' }}>
                <SecuritySection />
            </section>

            <section id='faq' style={{ scrollMarginTop: '120px' }}>
                <FAQ />
            </section>

            <section id='contact' style={{ scrollMarginTop: '120px' }}>
                <Cta />
            </section>
          </ClientLayout>
        </>
    );
};