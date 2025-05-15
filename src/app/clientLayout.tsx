'use client'

import { useEffect, useState } from 'react'
import AOS from 'aos'
import type { AosOptions } from 'aos'
import "aos/dist/aos.css"
import Header from "@/components/ui/header"
import Footer from "@/components/ui/footer"
import { Box, CircularProgress } from '@mui/material'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Inicializar AOS con opciones optimizadas para móviles
    AOS.init({
      once: true,
      disable: window.innerWidth < 768 ? true : "phone", // Deshabilitar en móviles para mejor rendimiento
      duration: 500, // Reducido para mejor rendimiento
      easing: "ease-out",
      delay: 0, // Sin retraso para mejor rendimiento
    } as AosOptions);
    
    // Simular carga completa después de que los componentes críticos estén listos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Mostrar un indicador de carga mientras se inicializan los componentes críticos
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <main className="grow">{children}</main>
      <Footer />
    </>
  )
}