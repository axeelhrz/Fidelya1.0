"use client"

import { usePathname } from "next/navigation"

interface ConditionalMainProps {
  children: React.ReactNode
}

export function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname()

  // Rutas de autenticación que necesitan layout completo sin padding
  const authRoutes = ['/auth/login', '/auth/registro', '/auth/callback']
  const isAuthRoute = authRoutes.includes(pathname)

  // Si es una ruta de autenticación, no usar el container con padding
  if (isAuthRoute) {
    return <>{children}</>
  }

  // Para rutas normales, usar el layout con container y padding
  return (
    <main className="container mx-auto px-4 py-8">
      {children}
    </main>
  )
}
