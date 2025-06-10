import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Factores Personales - Tabla SCAT",
  description: "Análisis de factores personales",
};

export default function PersonalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
