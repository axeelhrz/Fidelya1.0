import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "@/styles/responsive-fixes.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Pedidos - Casino Escolar",
  description: "Sistema de gestión de pedidos para el casino escolar",
}

import { UserProvider } from "@/context/UserContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="https://checkout.getnet.cl/lightbox.min.js"></script>
        <meta httpEquiv="Permissions-Policy" content="accelerometer=*, gyroscope=*" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <UserProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
