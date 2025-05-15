import { type Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Plus_Jakarta_Sans, Work_Sans, Inter, Sora } from 'next/font/google'
import './globals.css';

export const metadata: Metadata = {
  title: 'Assuriva',
  description: 'Assuriva Gestiona pólizas, clientes y tareas desde una sola plataforma pensada para corredores de seguros.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover',
}

// Font optimization: Load only essential weights and use display swap
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  preload: true,
})

const sora = Sora({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  preload: false, // Only preload primary fonts
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-work-sans',
  preload: false, // Only preload primary fonts
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
  preload: false, // Only preload primary fonts
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      className={`${plusJakarta.variable} ${workSans.variable} ${inter.variable} ${sora.variable}`} 
      lang="es"
    >
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical hero image */}
        <link 
          rel="preload" 
          href="/assets/LandingLogo.svg" 
          as="image" 
          type="image/svg+xml"
        />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        
        {/* Non-critical scripts loaded with lazyOnload strategy */}
        <Script
          id="performance-optimization"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              // Detect mobile devices
              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
              if (isMobile) {
                document.documentElement.classList.add('mobile-device');
              }
              
              // Detect slow connections
              const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
              if (connection && (connection.saveData || connection.effectiveType.includes('2g'))) {
                document.documentElement.classList.add('save-data');
              }
              
              // Optimization for mobile: Reduce animations
              if (isMobile) {
                document.documentElement.style.setProperty('--animation-reduced', '0.7');
                  }
            `,
          }}
        />
        
        {/* Analytics loaded with lazyOnload strategy */}
        <Script strategy="lazyOnload">
          {`
            window.addEventListener('load', () => {
              if (typeof window !== 'undefined') {
                const Analytics = require('@vercel/analytics/react').Analytics;
                const SpeedInsights = require('@vercel/speed-insights/react').SpeedInsights;
                
                if (process.env.NODE_ENV === 'production') {
                  Analytics();
                  SpeedInsights();
}
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
