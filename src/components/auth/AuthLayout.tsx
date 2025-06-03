"use client"

import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showLogo?: boolean
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showLogo = true 
}: AuthLayoutProps) {
  return (
    <div className="auth-background">
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md auth-container">
          <Card className="backdrop-blur-sm bg-white/95 shadow-xl border-0 animate-fadeIn">
            <CardHeader className="space-y-4 text-center pb-6">
              {showLogo && (
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">🏢</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900 font-heading">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {children}
            </CardContent>
          </Card>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  )
}