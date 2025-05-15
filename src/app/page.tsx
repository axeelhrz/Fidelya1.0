'use client';

import React, { Suspense } from 'react';
import { Container, Skeleton } from '@mui/material';
import dynamic from 'next/dynamic';

// Import the Hero component directly (not using dynamic import for LCP)
import Hero from '@/components/optimized/hero';

// Skeleton component for loading state
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

// ClientLayout loaded with dynamic import but with SSR enabled
const ClientLayout = dynamic(() => import('./clientLayout'), {
  ssr: true,
});

// Create dynamic components with optimized options and increased loading priority
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

export default function Home(): React.ReactElement {
  return (
    <ClientLayout>
      {/* Hero is loaded directly for LCP optimization */}
      <Hero />

      {/* Sections with deferred loading and reduced priority */}
      <Suspense fallback={<ComponentSkeleton height={400} />}>
        <section id='benefits' style={{ scrollMarginTop: '120px' }}>
          <BenefitsSection />
        </section>
      </Suspense>

      <Suspense fallback={<ComponentSkeleton height={400} />}>
        <section id='features' style={{ scrollMarginTop: '120px' }}>
          <Features />
        </section>
      </Suspense>

      <Suspense fallback={<ComponentSkeleton height={300} />}>
        <DashboardPreview />
      </Suspense>

      <Suspense fallback={<ComponentSkeleton height={400} />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<ComponentSkeleton height={400} />}>
        <section id='how-it-works' style={{ scrollMarginTop: '120px' }}>
          <HowItWorks />
        </section>
      </Suspense>

      <Suspense fallback={<ComponentSkeleton height={300} />}>
        <section id='security' style={{ scrollMarginTop: '120px' }}>
          <SecuritySection />
        </section>
      </Suspense>

      <Suspense fallback={<ComponentSkeleton height={400} />}>
        <section id='faq' style={{ scrollMarginTop: '120px' }}>
          <FAQ />
        </section>
      </Suspense>

      <Suspense fallback={<ComponentSkeleton height={200} />}>
        <section id='contact' style={{ scrollMarginTop: '120px' }}>
          <Cta />
        </section>
      </Suspense>
    </ClientLayout>
  );
}