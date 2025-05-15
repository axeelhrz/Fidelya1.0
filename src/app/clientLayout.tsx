'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import AOS from 'aos'
import type { AosOptions } from 'aos'
import "aos/dist/aos.css"

// Optimización: Cargar componentes de header y footer con dynamic import
const Header = dynamic(() => import("@/components/ui/header"), {
  ssr: true, // Mantener SSR para el header ya que es crítico para la navegación
})
const Footer = dynamic(() => import("@/components/ui/footer"), {
  ssr: false, // Cargar el footer de forma diferida ya que no es visible inicialmente
})

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Inicializar AOS con opciones optimizadas para móviles
    const initAOS = () => {
    AOS.init({
      once: true,
      disable: window.innerWidth < 768 ? true : "phone", // Deshabilitar en móviles para mejor rendimiento
      duration: 500, // Reducido para mejor rendimiento
      easing: "ease-out",
      delay: 0, // Sin retraso para mejor rendimiento
    } as AosOptions);
    };

    // Cargar AOS de forma diferida
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(initAOS);
      } else {
        setTimeout(initAOS, 1000);
      }
    }
  }, []);

  return (
    <>
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </>
  )
}