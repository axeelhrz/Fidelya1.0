import { Navbar } from "@/components/navbar";
import { PortfolioSection } from "@/components/portfolio-section";
import { FooterSection } from "@/components/footer-section";
import { MUITheme } from "@/theme/mui-theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portafolio | Axel Hernández",
  description: "Proyectos destacados que han generado resultados excepcionales para mis clientes.",
};

export default function PortafolioPage() {
  return (
    <MUITheme>
      <Navbar />
      <main>
        <PortfolioSection />
      </main>
      <FooterSection />
    </MUITheme>
  );
}