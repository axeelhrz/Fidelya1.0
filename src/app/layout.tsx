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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${plusJakarta.className} ${workSans.className} ${inter.className} ${sora.className}`} lang="es">
<head>
  {/* ✅ Google Tag para conversión */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-16998950708" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16998950708');
          `}
        </Script>
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
      </body>
    </html>
  )
};