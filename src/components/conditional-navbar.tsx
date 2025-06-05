"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Navbar } from "@/components/navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Rutas donde NO debe aparecer el navbar
  const excludedRoutes = [
    '/', // página principal
    '/auth/login', 
    '/auth/registro', 
    '/auth/callback'
  ]
  
  // Verificar si es una ruta de admin (cualquier ruta que empiece con /admin)
  const isAdminRoute = pathname.startsWith('/admin')
  
  // Verificar si es una ruta excluida
  const isExcludedRoute = excludedRoutes.includes(pathname)
  
  // No mostrar navbar si es ruta de admin o ruta excluida
  const shouldHideNavbar = isAdminRoute || isExcludedRoute

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Auth state changed
      }
    )

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // No mostrar navbar en rutas excluidas o admin
  if (shouldHideNavbar) {
    return null
  }

  // Mostrar navbar en todas las demás rutas
  return <Navbar />
}