"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/panel/Navbar'
import { GreetingCard } from '@/components/panel/dashboard/GreetingCard'
import { OrderStatusCard } from '@/components/panel/dashboard/OrderStatusCard'
import { EconomicSummaryCard } from '@/components/panel/dashboard/EconomicSummaryCard'
import { WeeklyMenuInfoCard } from '@/components/panel/dashboard/WeeklyMenuInfoCard'
import { QuickActionsCard } from '@/components/panel/dashboard/QuickActionsCard'
import { AlertsCard } from '@/components/panel/dashboard/AlertsCard'
import { WeeklyMenu } from '@/components/panel/WeeklyMenu'
import { OrderSummary } from '@/components/panel/OrderSummary'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useOrderStore } from '@/store/orderStore'
import { DayMenu } from '@/types/panel'
import { startOfWeek, format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'

export default function PanelPage() {
  const router = useRouter()
  const { dashboardData, isLoading, error } = useDashboardData()
  const [weekMenu, setWeekMenu] = useState<DayMenu[]>([])
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [showFullMenu, setShowFullMenu] = useState(false)
  const { clearSelections, getOrderSummary } = useOrderStore()

  // Cargar menú de la semana
  useEffect(() => {
    const loadWeekMenu = async () => {
      if (!dashboardData?.user) return

      try {
        const today = new Date()
        const weekStart = startOfWeek(today, { weekStartsOn: 1 })

        // Generar datos de ejemplo (en producción vendría de Firestore)
        const mockWeekMenu: DayMenu[] = []
        
        for (let i = 0; i < 5; i++) {
          const currentDay = addDays(weekStart, i)
          const dayMenu: DayMenu = {
            date: format(currentDay, 'yyyy-MM-dd'),
            day: format(currentDay, 'EEEE', { locale: es }),
            almuerzos: [
              {
                id: `almuerzo-${i}-1`,
                code: 'A1',
                name: 'Pollo al horno con papas',
                description: 'Pollo al horno con papas doradas, ensalada mixta y postre',
                type: 'almuerzo',
                price: dashboardData.user.userType === 'funcionario' ? 4875 : 5500,
                available: true
              },
              {
                id: `almuerzo-${i}-2`,
                code: 'A2',
                name: 'Pescado a la plancha',
                description: 'Pescado fresco a la plancha con arroz y verduras al vapor',
                type: 'almuerzo',
                price: dashboardData.user.userType === 'funcionario' ? 4875 : 5500,
                available: true
              },
              {
                id: `almuerzo-${i}-3`,
                code: 'A3',
                name: 'Pasta con salsa boloñesa',
                description: 'Pasta fresca con salsa boloñesa casera y queso parmesano',
                type: 'almuerzo',
                price: dashboardData.user.userType === 'funcionario' ? 4875 : 5500,
                available: true
              }
            ],
            colaciones: [
              {
                id: `colacion-${i}-1`,
                code: 'C1',
                name: 'Sándwich de pavo',
                description: 'Sándwich integral con pavo, palta y tomate',
                type: 'colacion',
                price: dashboardData.user.userType === 'funcionario' ? 1800 : 2000,
                available: true
              },
              {
                id: `colacion-${i}-2`,
                code: 'C2',
                name: 'Ensalada de frutas',
                description: 'Mix de frutas frescas de temporada con yogurt',
                type: 'colacion',
                price: dashboardData.user.userType === 'funcionario' ? 1800 : 2000,
                available: true
              }
            ]
          }
          mockWeekMenu.push(dayMenu)
        }

        setWeekMenu(mockWeekMenu)
      } catch (error) {
        console.error('Error al cargar el menú:', error)
      }
    }

    if (dashboardData?.user) {
      loadWeekMenu()
    }
  }, [dashboardData?.user])

  const handleLogout = async () => {
    try {
      clearSelections()
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  const handleProceedToPayment = async () => {
    if (!dashboardData?.user) return

    setIsProcessingPayment(true)
    
    try {
      const summary = getOrderSummary()
      
      // Crear orden en Firestore
      const orderData = {
        userId: dashboardData.user.id,
        weekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        selections: summary.selections,
        total: summary.total,
        status: 'pending',
        createdAt: new Date()
      }

      await addDoc(collection(db, 'orders'), orderData)
      
      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const paymentSuccess = Math.random() > 0.1 // 90% de éxito
      
      if (paymentSuccess) {
        alert('¡Pago realizado con éxito! Tu pedido ha sido confirmado.')
        clearSelections()
      } else {
        throw new Error('Error en el procesamiento del pago')
      }
      
    } catch (error) {
      console.error('Error al procesar el pago:', error)
      alert('Hubo un error al procesar el pago. Por favor, intenta nuevamente.')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="panel-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
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
      <div className="panel-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-clean mb-2">
              Error al cargar el panel
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-clean mb-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-panel-primary"
            >
              Reintentar
            </button>
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
    <div className="panel-container">
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Contenido principal */}
      <div className="panel-content">
        {/* Dashboard Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-8"
        >
          {/* Saludo personalizado */}
          <GreetingCard user={dashboardData.user} />

          {/* Grid de tarjetas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <OrderStatusCard orderStatus={dashboardData.orderStatus} />
            <EconomicSummaryCard economicSummary={dashboardData.economicSummary} />
            <WeeklyMenuInfoCard weeklyMenuInfo={dashboardData.weeklyMenuInfo} />
          </div>

          {/* Acciones rápidas y alertas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickActionsCard />
            <AlertsCard alerts={dashboardData.alerts} />
          </div>
        </motion.div>

        {/* Toggle para mostrar menú completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 text-clean">
              Gestión de Pedidos
            </h2>
            <button
              onClick={() => setShowFullMenu(!showFullMenu)}
              className="btn-panel-secondary text-sm"
            >
              {showFullMenu ? 'Ocultar menú' : 'Mostrar menú completo'}
            </button>
          </div>
        </motion.div>

        {/* Menú completo y resumen (condicional) */}
        {showFullMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="panel-grid"
          >
            {/* Área principal - Menú semanal */}
            <div className="panel-main">
              <WeeklyMenu 
                weekMenu={weekMenu} 
                isLoading={false}
              />
            </div>

            {/* Sidebar - Resumen del pedido */}
            <div className="panel-sidebar">
              <OrderSummary 
                onProceedToPayment={handleProceedToPayment}
                isProcessingPayment={isProcessingPayment}
              />
            </div>
          </motion.div>
        )}

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
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
                    ${dashboardData.user.userType === 'funcionario' ? '4.875' : '5.500'} CLP
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400 text-clean">Colación:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                    ${dashboardData.user.userType === 'funcionario' ? '1.800' : '2.000'} CLP
                  </span>
                </div>
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
            </div>
          </div>

          {/* Contacto */}
          <div className="panel-card">
            <div className="panel-card-content">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3 text-clean">
                Contacto
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-clean">Teléfono:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                    +56 2 2345 6789
                  </p>
                </div>
                <div>
                  <span className="text-slate-600 dark:text-slate-400 text-clean">Email:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                    casino@colegio.cl
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}