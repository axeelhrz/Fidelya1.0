import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selección de Contacto - Tabla SCAT",
  description: "Selección del tipo de contacto o causa del incidente",
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
