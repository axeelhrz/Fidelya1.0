import { Navbar } from "@/components/navbar";
import { ContactSection } from "@/components/contact-section";
import { FooterSection } from "@/components/footer";
import { MUITheme } from "@/theme/mui-theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Axel Hernández",
  description: "Hablemos sobre tu proyecto y cómo puedo ayudarte a alcanzar tus objetivos digitales.",
};

export default function ContactoPage() {
  return (
    <MUITheme>
      <Navbar />
      <main>
        <ContactSection />
      </main>
      <FooterSection />
    </MUITheme>
  );
}