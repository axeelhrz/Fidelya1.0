'use client'

import { useEffect, lazy, Suspense, useState } from 'react'
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
  const [aosInitialized, setAosInitialized] = useState(false);

  useEffect(() => {
    // Initialize AOS with optimized options for mobile
    const initAOS = async () => {
      try {
        // Only import AOS when needed and only once
        if (!aosInitialized) {
          const AOS = (await import('aos')).default
          // Import CSS only when needed
          await import('aos/dist/aos.css')
          
          AOS.init({
            once: true,
            disable: window.innerWidth < 768 ? true : "phone", // Disable on mobile for better performance
            duration: 400, // Reduced for better performance
            easing: "ease-out",
            delay: 0, // No delay for better performance
            offset: 80, // Reduced offset for better performance
          } as AosOptions);
          
          setAosInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize AOS:', error);
      }
    };

    // Load AOS only when the page is idle and after critical content is loaded
    if (typeof window !== 'undefined') {
      // Use requestIdleCallback for non-critical initialization
      if ('requestIdleCallback' in window) {
        // Delay AOS initialization to prioritize main content rendering
        const timeoutId = setTimeout(() => {
          window.requestIdleCallback(() => initAOS(), { timeout: 2000 });
        }, 1000);
        
        return () => clearTimeout(timeoutId);
      } else {
        // Fallback for browsers without requestIdleCallback
        const timeoutId = setTimeout(initAOS, 1500);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [aosInitialized]);

  return (
    <>
      <Header />
      <main className="grow">{children}</main>
      <Suspense fallback={
        <Box sx={{ height: '200px', width: '100%' }}>
          <Skeleton variant="rectangular" height="100%" width="100%" animation="wave" />
        </Box>
      }>
        <Footer />
      </Suspense>
    </>
  )
}