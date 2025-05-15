'use client'

import { useEffect, lazy, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Box, Skeleton } from '@mui/material'

// Import AOS types but load the library dynamically
import type { AosOptions } from 'aos'

// Optimized: Load header with SSR but footer with client-side rendering
const Header = dynamic(() => import("@/components/ui/header"), {
  ssr: true, // Keep SSR for header as it's critical for navigation
})

// Load footer with lazy loading since it's below the fold
const Footer = lazy(() => import("@/components/ui/footer"))
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize AOS with optimized options for mobile
    const initAOS = async () => {
      // Only import AOS when needed
      const AOS = (await import('aos')).default
      // Import CSS only when needed
      await import('aos/dist/aos.css')
      
    AOS.init({
      once: true,
        disable: window.innerWidth < 768 ? true : "phone", // Disable on mobile for better performance
        duration: 500, // Reduced for better performance
      easing: "ease-out",
        delay: 0, // No delay for better performance
    } as AosOptions);
    };

    // Load AOS only when the page is idle
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => initAOS());
      } else {
        setTimeout(() => initAOS(), 1000);
      }
    }
  }, []);

  return (
    <>
      <Header />
      <main className="grow">{children}</main>
      <Suspense fallback={
        <Box sx={{ height: '300px', width: '100%' }}>
          <Skeleton variant="rectangular" height="100%" width="100%" />
        </Box>
      }>
        <Footer />
      </Suspense>
    </>
  )
}