'use client'

import { usePathname } from 'next/navigation'
import { ConditionalNavbar } from './conditional-navbar'

interface ConditionalMainProps {
  children: React.ReactNode
}

export function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname()
  
  // Páginas que no necesitan el layout principal
  const isAuthPage = pathname.startsWith('/auth/')
  
  if (isAuthPage) {
    return <>{children}</>
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ConditionalNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}