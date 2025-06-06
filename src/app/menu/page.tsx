"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWeeklyMenu } from '@/hooks/useWeeklyMenu'
import { Navbar } from '@/components/panel/Navbar'
import { MenuHeader } from '@/components/menu/MenuHeader'
import { DayMenuCard } from '@/components/menu/DayMenuCard'
import { MenuSkeleton } from '@/components/menu/MenuSkeleton'
import { Button } from '@/components/ui/button'

export default function MenuPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { weekMenu, isLoading, error, weekRange, refreshMenu, isEmpty } = useWeeklyMenu()

  // Redireccionar si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  const handleLogout = async () => {
    try {
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  // Loading state para autenticación
  if (authLoading) {
    return (
      <div className="panel-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 text-clean">
              Verificando autenticación...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Si no hay usuario autenticado, no mostrar nada (se redirigirá)
  if (!user) {
    return null
  }

  return (
    <div className="panel-container">
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="panel-content">
        {/* Header del menú */}
        <MenuHeader 
          weekRange={weekRange}
          isLoading={isLoading}
          onRefresh={refreshMenu}
        />

        {/* Estado de carga */}
        {isLoading && <MenuSkeleton />}

        {/* Estado de error */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 p-8 text-center"
          >
            <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 text-clean">
              Error al cargar el menú
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-clean mb-6">
              {error.message}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={refreshMenu}
                className="flex items-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Reintentar</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/panel')}
                className="flex items-center space-x-2"
              >
                <span>Volver al Panel</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Estado vacío */}
        {isEmpty && !isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center"
          >
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2 text-clean">
              Menú no disponible
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-clean mb-6">
              El menú de esta semana aún no ha sido publicado por la administración.
              Por favor, vuelve a consultar más tarde.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={refreshMenu}
                className="flex items-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Verificar nuevamente</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/panel')}
                className="flex items-center space-x-2"
              >
                <span>Volver al Panel</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Menú semanal */}
        {!isLoading && !error && !isEmpty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Grid de días */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {weekMenu.map((dayMenu, index) => (
                <DayMenuCard
                  key={dayMenu.date}
                  dayMenu={dayMenu}
                  userType={user.userType}
                  index={index}
                />
              ))}
            </div>

            {/* Información adicional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Información de precios */}
              <div className="panel-card">
                <div className="panel-card-content">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 text-clean">
                    Información de Precios
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-clean">Almuerzo:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                        {user.userType === 'funcionario' ? '$4.875' : '$5.500'} CLP
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-clean">Colación:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                        {user.userType === 'funcionario' ? '$1.800' : '$2.000'} CLP
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-300 text-clean">
                      Precios especiales para {user.userType === 'funcionario' ? 'funcionarios' : 'estudiantes'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Horarios */}
              <div className="panel-card">
                <div className="panel-card-content">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 text-clean">
                    Horarios de Servicio
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-clean">Almuerzo:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                        12:00 - 14:00
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-clean">Colación:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                        15:30 - 16:30
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 text-clean">
                      Horarios de lunes a viernes
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="panel-card">
                <div className="panel-card-content">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 text-clean">
                    Acciones Rápidas
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push('/mi-pedido')}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <span>Realizar Pedido</span>
                      <ArrowRight size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/panel')}
                      className="w-full"
                    >
                      Volver al Panel
                    </Button>
                  </div>
                  <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-xs text-amber-800 dark:text-amber-300 text-clean">
                      Para realizar pedidos, dirígete a "Mi Pedido"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
