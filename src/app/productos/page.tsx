import { Navbar } from "@/components/navbar";
import { ProductsSection } from "@/components/products-section";
import { FooterSection } from "@/components/footer";
import { MUITheme } from "@/theme/mui-theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos | Axel Hernández",
  description: "Productos digitales premium para acelerar tus proyectos y maximizar resultados.",
};

export default function ProductosPage() {
  return (
    <MUITheme>
      <Navbar />
      <main>
        <ProductsSection />
      </main>
      <FooterSection />
    </MUITheme>
  );
}