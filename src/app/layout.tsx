import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ConditionalMain } from "@/components/conditional-main";

export const metadata: Metadata = {
  title: "Casino Escolar",
  description: "Sistema de pedidos para casino escolar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <ConditionalMain>
              {children}
            </ConditionalMain>
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}