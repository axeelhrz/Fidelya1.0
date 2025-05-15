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
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        
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
              
              // Función para cargar recursos no críticos
              function loadNonCriticalResources() {
                // Implementación de carga diferida
                const loadResource = (src, type) => {
                  if (type === 'script') {
                    const script = document.createElement('script');
                    script.src = src;
                    script.async = true;
                    script.defer = true;
                    document.body.appendChild(script);
                  } else if (type === 'style') {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = src;
                    document.head.appendChild(link);
              }
                };
                
                // Usar Intersection Observer para cargar recursos cuando sean visibles
                if ('IntersectionObserver' in window) {
                  const loadWhenVisible = (selector, resourceSrc, resourceType) => {
                    const observer = new IntersectionObserver((entries) => {
                      entries.forEach(entry => {
                        if (entry.isIntersecting) {
                          loadResource(resourceSrc, resourceType);
                          observer.disconnect();
                        }
                      });
                    }, { rootMargin: '200px' });
                    
                    const element = document.querySelector(selector);
                    if (element) observer.observe(element);
                  };
                  
                  // Cargar recursos específicos cuando las secciones sean visibles
                  document.addEventListener('DOMContentLoaded', () => {
                    // Ejemplos de carga diferida basada en visibilidad
                    loadWhenVisible('#benefits', '/assets/benefits-scripts.js', 'script');
                    loadWhenVisible('#features', '/assets/features-scripts.js', 'script');
                    // Añadir más recursos según sea necesario
                  });
                }
              }
              
              // Registrar para cargar recursos no críticos cuando la página esté inactiva
              if ('requestIdleCallback' in window) {
                window.requestIdleCallback(loadNonCriticalResources);
              } else {
                // Fallback para navegadores que no soportan requestIdleCallback
                setTimeout(loadNonCriticalResources, 2000);
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
                {/* Cargar Analytics solo en producción y de forma diferida */}
                {process.env.NODE_ENV === 'production' && (
                  <>
                    <Analytics />
                    <SpeedInsights />
                  </>
                )}
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
              
              // Implementar carga diferida de scripts de terceros
              const loadThirdPartyScripts = () => {
                // Función para cargar scripts de forma diferida
                const loadScript = (src, id, async = true, defer = true) => {
                  if (document.getElementById(id)) return;
                  const script = document.createElement('script');
                  script.id = id;
                  script.src = src;
                  script.async = async;
                  script.defer = defer;
                  document.body.appendChild(script);
                };
                
                // Cargar scripts de terceros solo cuando sean necesarios
                // Ejemplo: Google Tag Manager
                setTimeout(() => {
                  // Cargar GTM de forma diferida
                  // loadScript('https://www.googletagmanager.com/gtm.js?id=GTM-XXXX', 'gtm-script');
                  
                  // Otros scripts de terceros
                }, 3000);
              };
              
              // Usar requestIdleCallback para cargar scripts de terceros
              if ('requestIdleCallback' in window) {
                window.requestIdleCallback(loadThirdPartyScripts, { timeout: 5000 });
              } else {
                // Fallback
                setTimeout(loadThirdPartyScripts, 5000);
}
            `,
          }}
        />
      </body>
    </html>
  )
}
