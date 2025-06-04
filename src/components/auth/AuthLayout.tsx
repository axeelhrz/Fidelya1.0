"use client"
import { ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { GraduationCap, Users, Utensils } from "lucide-react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  showIllustration?: boolean
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showIllustration = true 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
          
          {/* Ilustración y mensaje empático - Solo en desktop */}
          {showIllustration && (
            <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
              <div className="text-center space-y-6">
                <div className="flex justify-center space-x-4 mb-8">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <GraduationCap className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="p-4 bg-green-100 rounded-full">
                    <Utensils className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="p-4 bg-purple-100 rounded-full">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-800 leading-tight">
                  Casino Escolar
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-md mx-auto">
                  Gestiona los pedidos de comida de tus hijos de manera fácil y segura
                </p>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <p className="text-gray-700 font-medium">
                    "Una alimentación saludable es la base del aprendizaje"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <div className="flex justify-center lg:justify-start">
            <Card className="w-full max-w-md p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {title}
                </h2>
                <p className="text-gray-600">
                  {subtitle}
                </p>
              </div>
              
              {children}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}