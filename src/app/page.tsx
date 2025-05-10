'use client';

import React from 'react';
import Hero from '@/components/hero';
import BenefitsSection from '@/components/benefits';
import HowItWorks from '@/components/how-it-works';
import Testimonials from '@/components/testimonials';
import Cta from '@/components/cta';
import Features from '@/components/features';
import DashboardPreview from '@/components/dashboard-preview';
import SecuritySection from '@/components/security';
import FAQ from '@/components/faq';
import ClientLayout from './clientLayout';

export default function Home(): React.ReactElement {
    return (
        <>
          <ClientLayout>
            <Hero />

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