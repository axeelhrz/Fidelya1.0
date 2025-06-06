"use client"
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { StatsCards } from '@/components/admin/StatsCards'
import { QuickActions } from '@/components/admin/QuickActions'
import { SystemAlerts } from '@/components/admin/SystemAlerts'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const { adminUser } = useAdminAuth()
  const { dashboardData, isLoading, error, refreshData } = useAdminDashboard()

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="ml-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    )
  }

  if (isLoading || !dashboardData || !adminUser) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Skeleton className="h-96" />
              </div>
              <div>
                <Skeleton className="h-96" />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header del panel administrativo */}
      <AdminHeader
        adminUser={adminUser}
        lastUpdated={dashboardData.lastUpdated}
        onRefresh={refreshData}
        isRefreshing={isLoading}
      />

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Tarjetas de estadísticas principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
