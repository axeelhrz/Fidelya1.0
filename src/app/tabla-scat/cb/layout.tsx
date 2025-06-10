import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CB - Causas Básicas / Subyacentes - SCAT",
  description: "Análisis de causas básicas y subyacentes en el sistema SCAT",
};

export default function CBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
