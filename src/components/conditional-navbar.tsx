"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"

export function ConditionalNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  // Rutas donde NO debe aparecer el navbar (páginas de autenticación)
  const authRoutes = ['/auth/login', '/auth/registro', '/auth/callback']
  const isAuthRoute = authRoutes.includes(pathname)

  useEffect(() => {
    // Función para verificar el estado de autenticación
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setIsAuthenticated(!!session)
      } catch (error) {
        console.error('Error checking auth status:', error)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    // Verificar estado inicial
    checkAuthStatus()

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session)
        setLoading(false)
      }
    )

    // Cleanup subscription
    return () => subscription.unsubscribe()
  }, [])

  // No mostrar navbar si:
  // 1. Estamos en una ruta de autenticación
  // 2. El usuario no está autenticado
  // 3. Aún estamos cargando el estado de autenticación
  if (isAuthRoute || !isAuthenticated || loading) {
    return null
  }

  return <Navbar />
}
