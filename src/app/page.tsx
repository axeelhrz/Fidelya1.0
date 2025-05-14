import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import ExamplesGallery from '@/components/landing/ExamplesGallery';
import Pricing from '@/components/landing/Pricing';
import CTASection from '@/components/landing/CTASection';
export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <HowItWorks />
      <ExamplesGallery />
      <Pricing />
      <CTASection />
    </PageLayout>
  );
}
