"use client"

import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight, Clock, CheckCircle, Edit, CreditCard, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OrderStatus } from '@/types/dashboard'
import { getOrderStatusInfo, getProgressPercentage } from '@/lib/dashboardUtils'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrderStatusCardProps {
  orderStatus: OrderStatus
}

const StatusIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  const icons = {
    Clock: Clock,
    Edit: Edit,
    CheckCircle: CheckCircle,
    CreditCard: CreditCard,
    AlertTriangle: AlertTriangle
  }
  
  const IconComponent = icons[iconName as keyof typeof icons] || Clock
  return <IconComponent className={className} />
}

export function OrderStatusCard({ orderStatus }: OrderStatusCardProps) {
  const statusInfo = getOrderStatusInfo(orderStatus)
  const progressPercentage = getProgressPercentage(orderStatus.daysSelected, orderStatus.totalDays)

  // Verificar si la fecha límite ha pasado
  const now = new Date()
  const isDeadlinePassed = orderStatus.paymentDeadline && now > orderStatus.paymentDeadline
  const isNearDeadline = orderStatus.paymentDeadline && 
    now < orderStatus.paymentDeadline && 
    (orderStatus.paymentDeadline.getTime() - now.getTime()) < 24 * 60 * 60 * 1000 // 24 horas

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="panel-card"
    >
      <div className="panel-card-content">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-clean">
              Estado del Pedido
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-clean">
              Semana actual
            </p>
          </div>
        </div>

        {/* Estado actual */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon 
                iconName={isDeadlinePassed ? 'AlertTriangle' : statusInfo.iconName} 
                className={`w-6 h-6 ${isDeadlinePassed ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`} 
              />
              <div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isDeadlinePassed ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : statusInfo.color
                }`}>
                  {isDeadlinePassed ? 'Fecha límite vencida' : statusInfo.label}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-clean mt-1">
                  {isDeadlinePassed ? 'Contacta al administrador para cambios' : statusInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          {orderStatus.status !== 'not_started' && !isDeadlinePassed && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400 text-clean">
                  Progreso semanal
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-100 text-clean">
                  {orderStatus.daysSelected}/{orderStatus.totalDays} días
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-2 rounded-full ${
                    orderStatus.status === 'paid' 
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                      : 'bg-gradient-to-r from-blue-500 to-emerald-500'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-clean">
                {progressPercentage}% completado
              </p>
            </div>
          )}

          {/* Información de fecha límite */}
          {orderStatus.paymentDeadline && (
            <div className={`flex items-center space-x-2 text-sm p-3 rounded-lg ${
              isDeadlinePassed 
                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : isNearDeadline
                ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            }`}>
              <Clock className="w-4 h-4" />
              <div>
                <p className="font-medium text-clean">
                  {isDeadlinePassed ? 'Fecha límite vencida' : 'Fecha límite para cambios'}
                </p>
                <p className="text-xs text-clean opacity-90">
                  {format(orderStatus.paymentDeadline, "EEEE dd 'de' MMMM 'a las' HH:mm", { locale: es })}
                </p>
              </div>
            </div>
          )}

          {/* Información adicional */}
          {orderStatus.lastModified && (
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-clean">
                Última modificación: {format(orderStatus.lastModified, "dd/MM/yyyy 'a las' HH:mm", { locale: es })}
              </span>
            </div>
          )}

          {/* Botón de acción */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/panel" className="block">
              <Button 
                className={`w-full ${
                  isDeadlinePassed 
                    ? 'bg-slate-400 hover:bg-slate-500 text-white cursor-not-allowed'
                    : orderStatus.status === 'paid'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                disabled={isDeadlinePassed}
              >
                <span>
                  {isDeadlinePassed 
                    ? 'Fecha límite vencida' 
                    : orderStatus.status === 'paid' 
                    ? 'Ver detalles del pedido'
                    : statusInfo.actionText
                  }
                </span>
                {!isDeadlinePassed && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}