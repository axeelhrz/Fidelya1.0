'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import type { AosOptions } from 'aos'
import "aos/dist/aos.css"
import Header from "@/components/ui/header"
import Footer from "@/components/ui/footer"
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Inicializar AOS con opciones optimizadas para móviles
    AOS.init({
      once: true,
      disable: window.innerWidth < 768 ? true : "phone", // Deshabilitar en móviles para mejor rendimiento
      duration: 500, // Reducido para mejor rendimiento
      easing: "ease-out",
      delay: 0, // Sin retraso para mejor rendimiento
    } as AosOptions);
  }, []);

  return (
    <>
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </>
  )
}