'use client';

import React, { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import { Box, Skeleton, Container } from '@mui/material';
import Hero from '@/components/hero';
import ClientLayout from './clientLayout';

// Optimización: Cargar componentes pesados con dynamic import y ssr: false
const BenefitsSection = dynamic(() => import('@/components/benefits'), { 
  ssr: false,
  loading: () => <ComponentSkeleton height={400} />
});

const Features = dynamic(() => import('@/components/features'), { 
  ssr: false,
  loading: () => <ComponentSkeleton height={400} />
});

const DashboardPreview = dynamic(() => import('@/components/dashboard-preview'), { 
  ssr: false,
  loading: () => <ComponentSkeleton height={300} />
});

const Testimonials = dynamic(() => import('@/components/testimonials'), { 
  ssr: false,
  loading: () => <ComponentSkeleton height={400} />
});

const HowItWorks = dynamic(() => import('@/components/how-it-works'), { 
  ssr: false,
  loading: () => <ComponentSkeleton height={400} />
});

const SecuritySection = dynamic(() => import('@/components/security'), { 
  ssr: false,
  loading: () => <ComponentSkeleton height={300} />
});

const FAQ = dynamic(() => import('@/components/faq'), { 
  ssr: false,
  loading: () => <ComponentSkeleton height={400} />
});

const Cta = dynamic(() => import('@/components/cta'), { 
  ssr: false,
  loading: () => <ComponentSkeleton height={200} />
});

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

export default function Home(): React.ReactElement {
    return (
        <>
          <ClientLayout>
            {/* Hero se carga normalmente ya que es crítico para LCP */}
            <Hero />

            {/* Secciones con carga diferida */}
            <section id='benefits' style={{ scrollMarginTop: '120px' }}>
                <BenefitsSection />
            </section>

            <section id='features' style={{ scrollMarginTop: '120px' }}>
                <Features />
            </section>

            <DashboardPreview />

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