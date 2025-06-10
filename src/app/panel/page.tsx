"use client"

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Navbar } from '@/components/panel/Navbar'
import { GreetingCard } from '@/components/panel/dashboard/GreetingCard'
import { MyOrdersSection } from '@/components/panel/MyOrdersSection'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useOrderStore } from '@/store/orderStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, Phone, Mail } from 'lucide-react'

export default function PanelPage() {
  const router = useRouter()
  const { dashboardData, isLoading, error } = useDashboardData()
  const { clearSelections } = useOrderStore()

  const handleLogout = async () => {
    try {
      clearSelections()
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-clean">
              Cargando panel...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <Card className="shadow-soft-lg border-0 bg-white dark:bg-slate-800">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-elegant mb-2">
                  Error al cargar el panel
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-clean mb-6">
                  {error}
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Reintentar</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!dashboardData) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Contenido principal con espaciado mejorado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 mb-12"
        >
          {/* Saludo personalizado */}
          <GreetingCard user={dashboardData.user} />

          {/* Sección de Mis Pedidos */}
          <MyOrdersSection user={dashboardData.user} />
        </motion.div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Horarios */}
          <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-25 dark:from-emerald-900/20 dark:to-emerald-800/10 shadow-soft-lg hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-elegant">
                  Horarios de Servicio
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 text-clean font-medium">Almuerzo:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-clean text-lg">
                    12:00 - 14:00
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400 text-clean font-medium">Colación:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-clean text-lg">
                    15:30 - 16:30
                  </span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                <p className="text-sm text-emerald-800 dark:text-emerald-300 text-clean text-center">
                  Horarios de lunes a viernes
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-25 dark:from-purple-900/20 dark:to-purple-800/10 shadow-soft-lg hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-elegant">
                  Contacto
                </h3>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-white dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-slate-600 dark:text-slate-400 text-clean font-medium">Teléfono:</span>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-clean">
                    +56 2 2345 6789
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-slate-600 dark:text-slate-400 text-clean font-medium">Email:</span>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-clean">
                    casino@colegio.cl
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm text-purple-800 dark:text-purple-300 text-clean text-center">
                  Estamos aquí para ayudarte
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}