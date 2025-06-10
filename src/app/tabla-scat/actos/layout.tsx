import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actos Subestándar - Tabla SCAT",
  description: "Análisis de actos subestándar e inseguros",
};

export default function ActosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
