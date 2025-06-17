import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/context/UserContext"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Casino Escolar",
  description: "Sistema de gestión de casino escolar",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <UserProvider>
              {children}
            </UserProvider>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}