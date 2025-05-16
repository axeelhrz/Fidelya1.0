import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { ServicesSection } from "@/components/services-section";
import { ProductsSection } from "@/components/products-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { MUITheme } from "@/theme/mui-theme";
export default function Home() {
  return (
    <MUITheme>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <PortfolioSection />
        <ContactSection />
      </main>
      <Footer />
    </MUITheme>
  );
}
