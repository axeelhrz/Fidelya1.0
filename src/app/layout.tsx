import { type Metadata } from 'next'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Plus_Jakarta_Sans, Work_Sans, Inter, Sora } from 'next/font/google'
import { PlanProvider } from '@/context/planContext'
import ThemeContextProvider from '@/context/themeContext'
import { AuthProvider } from '@/context/auth-context'
import './globals.css';

export const metadata: Metadata = {
  title: 'Assuriva',
  description: 'Assuriva Gestiona pólizas, clientes y tareas desde una sola plataforma pensada para corredores de seguros.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
})

const sora = Sora({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sora'
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

// Function to load non-critical resources
const loadNonCriticalResources = (callback: () => void) => {
  // Use requestIdleCallback or setTimeout as a fallback
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback);
    } else {
      setTimeout(callback, 1000);
    }
  }
};

// Function to load Google Tag Manager
const loadGTM = () => {
  if (typeof window !== 'undefined') {
    // Google Tag Manager initialization code would go here
    console.log('GTM loaded');
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Cargar GTM de forma diferida
  if (typeof window !== 'undefined') {
    loadNonCriticalResources(() => {
      loadGTM();
    });
  }
  
  return (
    <html className={`${plusJakarta.className} ${workSans.className} ${inter.className} ${sora.className}`} lang="es">
      <head>
        {/* Scripts críticos */}
        <Script
          id="performance-optimization"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Evitar FOUT (Flash of Unstyled Text)
              document.documentElement.classList.add('js-loading');
              
              // Detectar conexiones lentas
              const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
              if (connection && (connection.saveData || connection.effectiveType.includes('2g'))) {
                document.documentElement.classList.add('save-data');
              }
            `,
          }}
        />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
                    <AuthProvider>
        <ThemeContextProvider>
        <PlanProvider>
          <Analytics />
          {process.env.NODE_ENV === 'production' && <SpeedInsights />}
          {children}
        </PlanProvider>
        </ThemeContextProvider>
        </AuthProvider>
        </div>
        
        {/* Scripts no críticos cargados de forma diferida */}
        <Script
          id="non-critical-scripts"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              // Marcar que la carga de JS ha terminado
              document.documentElement.classList.remove('js-loading');
              document.documentElement.classList.add('js-loaded');
            `,
          }}
        />
      </body>
    </html>
  )
};