import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tabla SCAT - Técnica de Análisis Sistemático de las Causas",
  description: "Sistema de evaluación y análisis de incidentes laborales",
};

export default function TablaSCATLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
