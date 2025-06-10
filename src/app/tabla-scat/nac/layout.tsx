import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NAC - Necesidades de Acción de Control - SCAT",
  description: "Evaluación de necesidades de acción de control en el sistema SCAT",
};

export default function NACLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
