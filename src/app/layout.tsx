import type { Metadata } from "next";
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
import ThemeRegistry from './components/ThemeRegistry';
import "./globals.css";

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
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}