import { type Metadata } from 'next'
import Script from 'next/script'
import { Plus_Jakarta_Sans, Work_Sans, Inter, Sora } from 'next/font/google'
import { PlanProvider } from '@/context/planContext'
import ThemeContextProvider from '@/context/themeContext'
import { AuthProvider } from '@/context/auth-context'
import './globals.css';

// Importar Analytics y SpeedInsights solo en producción
let Analytics: React.ComponentType<object> = () => null;
let SpeedInsights: React.ComponentType<object> = () => null;

if (process.env.NODE_ENV === 'production') {
  // Importaciones dinámicas solo en producción
  import('@vercel/analytics/react').then((mod) => {
    Analytics = mod.Analytics;
  });
  import('@vercel/speed-insights/react').then((mod) => {
    SpeedInsights = mod.SpeedInsights;
  });
}

export const metadata: Metadata = {
  title: 'Assuriva',
  description: 'Assuriva Gestiona pólizas, clientes y tareas desde una sola plataforma pensada para corredores de seguros.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

// Optimizar carga de fuentes
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  preload: true,
  variable: '--font-plus-jakarta',
})

const sora = Sora({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-sora'
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
  variable: '--font-work-sans',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${plusJakarta.variable} ${workSans.variable} ${inter.variable} ${sora.variable}`} lang="es">
      <head>
        {/* Preconectar con dominios críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Precargar recursos críticos */}
        <link rel="preload" as="image" href="/assets/LandingLogo.svg" />
        
        {/* Scripts críticos - Optimizados */}
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
              
              // Optimización para dispositivos móviles
              if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                document.documentElement.classList.add('mobile-device');
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
        
        {/* Añadir componentes de Analytics */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
