import { Navbar } from "@/components/navbar";
import { ServicesSection } from "@/components/services-section";
import { Footer } from "@/components/footer";
import { MUITheme } from "@/theme/mui-theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios | Axel Hernández",
  description: "Servicios de desarrollo web y diseño digital para potenciar tu negocio y aumentar tus conversiones.",
};

export default function ServiciosPage() {
  return (
    <MUITheme>
      <Navbar />
      <main>
        <ServicesSection />
      </main>
      <Footer />
    </MUITheme>
  );
}