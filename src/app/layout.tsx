import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Centro Psicológico | Plataforma Profesional de Gestión',
  description: 'Plataforma inteligente y profesional para la gestión integral de centros psicológicos. Diseñada para optimizar la atención al paciente y mejorar la eficiencia operativa.',
  keywords: 'psicología, terapia, gestión, pacientes, sesiones, centro psicológico, salud mental, profesional',
  authors: [{ name: 'Centro Psicológico Team' }],
  creator: 'Centro Psicológico',
  publisher: 'Centro Psicológico',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://centro-psicologico.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Centro Psicológico | Plataforma Profesional',
    description: 'Gestión inteligente para centros psicológicos profesionales',
    url: 'https://centro-psicologico.com',
    siteName: 'Centro Psicológico',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Centro Psicológico - Plataforma Profesional',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Centro Psicológico | Plataforma Profesional',
    description: 'Gestión inteligente para centros psicológicos profesionales',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5D4FB0' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1B2E' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="es" 
      className={`${outfit.variable} ${inter.variable}`} 
      suppressHydrationWarning
    >
      <head>
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldUseDark = theme === 'dark' || (!theme && systemPrefersDark);
                  
                  if (shouldUseDark) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.warn('Theme initialization failed:', e);
                }
              })();
            `,
          }}
        />

        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      </head>
      <body 
        className={`${outfit.className} antialiased`} 
        suppressHydrationWarning
      >
        {/* Loading screen */}
        <div id="loading-screen" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #F2EDEA 0%, #F8F6F4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #5D4FB0',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
        </div>

        {/* Main app */}
        <AuthProvider>
          <ThemeProvider>
            <div id="app-root">
              {children}
            </div>
          </ThemeProvider>
        </AuthProvider>

        {/* Hide loading screen after app loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                setTimeout(function() {
                  var loadingScreen = document.getElementById('loading-screen');
                  if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(function() {
                      loadingScreen.style.display = 'none';
                    }, 500);
                  }
                }, 100);
              });
            `,
          }}
        />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}