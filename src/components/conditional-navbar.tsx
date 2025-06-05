'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'

export function ConditionalNavbar() {
  const pathname = usePathname()
  
  // Ocultar navbar en páginas de autenticación
  const hideNavbar = pathname.startsWith('/auth/')
  
  if (hideNavbar) {
    return null
  }
  
  return <Navbar />
}