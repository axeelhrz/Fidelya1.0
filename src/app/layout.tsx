import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import ThemeRegistry from './components/ThemeRegistry';
import "./globals.css";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "XSreset - Experiencia Nocturna Premium",
  description: "Menú digital de alta gama para una experiencia nocturna excepcional en XSreset",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={outfit.className}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}