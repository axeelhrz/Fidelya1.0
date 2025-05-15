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

// Optimización: Cargar fuentes con display swap para evitar bloqueo de renderizado
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
})

const sora = Sora({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

// Función para cargar recursos no críticos
const loadNonCriticalResources = (callback: () => void) => {
  // Usar requestIdleCallback o setTimeout como fallback
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(callback);
    } else {
      setTimeout(callback, 1000);
    }
  }
};

// Función para cargar Google Tag Manager
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
              
              // Optimización: Precargar recursos críticos
              const preloadLinks = [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
              ];
              
              preloadLinks.forEach(link => {
                const linkEl = document.createElement('link');
                linkEl.rel = link.rel;
                linkEl.href = link.href;
                if (link.crossOrigin) linkEl.crossOrigin = link.crossOrigin;
                document.head.appendChild(linkEl);
              });
            `,
          }}
        />
      </head>
      <body>
        <div className="flex flex-col min-h-screen">
          {/* Optimización: Reducir anidamiento de contextos */}
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
  );
}
