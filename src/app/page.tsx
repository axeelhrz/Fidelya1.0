"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Calendar, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  UserPlus,
  LogIn,
  Home
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🍽️ Casino Escolar
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/registro">
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Gestión de Casino Escolar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestiona pedidos, menús y usuarios de forma fácil y eficiente. 
            Accede a todas las funcionalidades sin restricciones.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          
          {/* Dashboard */}
          <Link href="/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  <span>Dashboard</span>
                </CardTitle>
                <CardDescription>
                  Vista general del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Accede al panel principal con estadísticas y resumen general.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Pedidos */}
          <Link href="/pedidos/nuevo">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  <span>Hacer Pedido</span>
                </CardTitle>
                <CardDescription>
                  Crear nuevos pedidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Realiza pedidos para la semana seleccionando menús disponibles.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Menú */}
          <Link href="/menu">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Ver Menú</span>
                </CardTitle>
                <CardDescription>
                  Menús disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Consulta los menús disponibles para cada día de la semana.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Perfil */}
          <Link href="/perfil">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span>Mi Perfil</span>
                </CardTitle>
                <CardDescription>
                  Gestionar información personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Actualiza tu información personal y gestiona tus estudiantes.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Admin */}
          <Link href="/admin">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-red-600" />
                  <span>Administración</span>
                </CardTitle>
                <CardDescription>
                  Panel de administración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Gestiona usuarios, pedidos, menús y configuración del sistema.
                </p>
              </CardContent>
            </Card>
          </Link>

          {/* Estadísticas */}
          <Link href="/admin/estadisticas">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>Estadísticas</span>
                </CardTitle>
                <CardDescription>
                  Reportes y análisis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Visualiza estadísticas de pedidos, ingresos y usuarios.
                </p>
              </CardContent>
            </Card>
          </Link>

        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acceso Rápido - Sin Autenticación
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Dashboard
              </Button>
            </Link>
            <Link href="/pedidos/nuevo">
              <Button variant="outline" className="w-full">
                Nuevo Pedido
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" className="w-full">
                Admin
              </Button>
            </Link>
            <Link href="/menu">
              <Button variant="outline" className="w-full">
                Ver Menú
              </Button>
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            🚀 Modo sin autenticación activado - Acceso libre a todas las funcionalidades
          </p>
        </div>
      </main>
    </div>
  )
}