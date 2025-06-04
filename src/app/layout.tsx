import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/context/UserContext'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Casino Escolar - Sistema de Pedidos',
  description: 'Sistema de gestión de pedidos para el casino escolar',
  keywords: ['casino escolar', 'pedidos', 'comida', 'colegio'],
  authors: [{ name: 'Casino Escolar' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
                {children}
            <Toaster />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
