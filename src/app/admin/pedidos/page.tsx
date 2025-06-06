"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { OrdersHeader } from '@/components/admin/pedidos/OrdersHeader'
import { OrdersFilters } from '@/components/admin/pedidos/OrdersFilters'
import { OrdersMetrics } from '@/components/admin/pedidos/OrdersMetrics'
import { OrdersTable } from '@/components/admin/pedidos/OrdersTable'
import { OrderDetailModal } from '@/components/admin/pedidos/OrderDetailModal'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useAdminOrders } from '@/hooks/useAdminOrders'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminPedidosPage() {
  const { adminUser, isLoading: authLoading } = useAdminAuth()
  const {
    orders,
    metrics,
    isLoading,
    error,
    filters,
    updateFilters,
    refreshOrders,
    updateOrderStatus,
    deleteOrder
  } = useAdminOrders()

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleViewDetail = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setSelectedOrderId(null)
    setIsDetailModalOpen(false)
  }

  const handleStatusUpdate = async (orderId: string, status: 'pending' | 'paid' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, status)
    } catch (error) {
      console.error('Error updating order status:', error)
      // Aquí podrías mostrar un toast de error
    }
  }

  if (authLoading) {
    return <AdminLayout><div>Cargando...</div></AdminLayout>
  }

  if (!adminUser) {
    return <AdminLayout><div>No autorizado</div></AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Encabezado */}
          <OrdersHeader
            selectedWeek={filters.weekStart || ''}
            metrics={metrics}
            orders={orders}
            filters={filters}
            onRefresh={refreshOrders}
            isLoading={isLoading}
          />

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshOrders}
                    className="ml-4"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reintentar
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Métricas */}
          <OrdersMetrics 
            metrics={metrics} 
            isLoading={isLoading} 
          />

          {/* Filtros */}
          <OrdersFilters
            filters={filters}
            onFiltersChange={updateFilters}
            totalResults={orders.length}
          />

          {/* Tabla de pedidos */}
          <OrdersTable
            orders={orders}
            isLoading={isLoading}
            onViewDetail={handleViewDetail}
            onUpdateStatus={handleStatusUpdate}
          />

          {/* Modal de detalle */}
          <OrderDetailModal
            orderId={selectedOrderId}
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetail}
            onStatusUpdate={handleStatusUpdate}
          />
        </div>
      </div>
    </AdminLayout>
  )
}
