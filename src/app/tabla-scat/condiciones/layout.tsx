import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Condiciones Subestándar - Tabla SCAT",
  description: "Análisis de condiciones subestándar e inseguras",
};

export default function CondicionesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
