import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factores Laborales - Tabla SCAT",
  description: "Análisis de factores laborales",
};

export default function LaboralesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
