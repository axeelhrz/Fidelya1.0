"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, ArrowRight, Calendar, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWeeklyMenuData } from '@/hooks/useWeeklyMenuData'
import { MenuIntegrationService } from '@/services/menuIntegrationService'
import { Navbar } from '@/components/panel/Navbar'
import { MenuHeader } from '@/components/menu/MenuHeader'
import { DayMenuCard } from '@/components/menu/DayMenuCard'
import { MenuSkeleton } from '@/components/menu/MenuSkeleton'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export default function MenuPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { 
    weekMenu, 
    isLoading, 
    error, 
    weekInfo, 
    refetch 
  } = useWeeklyMenuData({ 
    user, 
    useAdminData: false // Solo menús publicados
  })

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

  // Separar días laborales y fines de semana
  const weekDays = weekMenu.filter((_, index) => index < 5) // Lunes a Viernes
  const weekendDays = weekMenu.filter((_, index) => index >= 5) // Sábado y Domingo

  return (
    <div className="panel-container">
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="panel-content">
        {/* Header del menú */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                  Menú Semanal
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Consulta las opciones disponibles para esta semana
                </p>
              </div>
            </div>
            
            {weekInfo && (
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {weekInfo.weekLabel}
                </Badge>
                
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Menús Publicados
                </Badge>

                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1">
                  {user.tipoUsuario === 'funcionario' ? 'Funcionario' : 'Apoderado'}
                </Badge>
              </div>
            )}
          </div>
        </motion.div>

        {/* Estado de carga */}
        {isLoading && <MenuSkeleton />}

        {/* Estado de error */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetch}
                  className="ml-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Estado vacío */}
        {!isLoading && !error && weekMenu.length === 0 && (
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
                onClick={refetch}
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
        {!isLoading && !error && weekMenu.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Días laborales */}
            {weekDays.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Días Laborales
                  </h2>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    Lunes a Viernes
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {weekDays.map((dayMenu, index) => (
                    <motion.div
                      key={dayMenu.date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <DayMenuCard
                        dayMenu={dayMenu}
                        userType={user.tipoUsuario}
                        index={index}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Fines de semana */}
            {weekendDays.length > 0 && weekendDays.some(day => day.hasItems) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Fin de Semana
                  </h2>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    Sábado y Domingo
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {weekendDays.filter(day => day.hasItems).map((dayMenu, index) => (
                    <motion.div
                      key={dayMenu.date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <DayMenuCard
                        dayMenu={dayMenu}
                        userType={user.tipoUsuario}
                        index={index + weekDays.length}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Información de precios */}
              <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 text-clean">
                    Información de Precios
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-clean">Almuerzo:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                        ${user.tipoUsuario === 'funcionario' ? '4.875' : '5.500'} CLP
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400 text-clean">Colación:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                        ${user.tipoUsuario === 'funcionario' ? '4.875' : '5.500'} CLP
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-300 text-clean">
                      Precios especiales para {user.tipoUsuario === 'funcionario' ? 'funcionarios' : 'apoderados'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Horarios */}
              <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/10 dark:border-emerald-800">
                <CardContent className="p-6">
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
                  <div className="mt-3 p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 text-clean">
                      Horarios de lunes a viernes
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Acciones rápidas */}
              <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800">
                <CardContent className="p-6">
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
                  <div className="mt-3 p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <p className="text-xs text-purple-800 dark:text-purple-300 text-clean">
                      Para realizar pedidos, dirígete a &quot;Mi Pedido&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información sobre disponibilidad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                <Clock className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  <strong>Disponibilidad:</strong> Los menús se actualizan automáticamente desde la administración. 
                  Los pedidos están disponibles para días laborales (lunes a viernes) y se pueden realizar hasta el día anterior.
                </AlertDescription>
              </Alert>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}