'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, ShoppingCart, Users, TrendingUp, Download } from 'lucide-react'
import { useRequireAdmin } from '@/hooks/useAuth'
import { OrderService } from '@/lib/orders/orderService'
import { DashboardStats, KitchenReport } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  isPrice?: boolean
}

function StatsCard({ title, value, icon: Icon, color, isPrice = false }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className={`text-2xl font-bold ${isPrice ? 'text-green-600' : ''}`}>
                {value}
              </p>
            </div>
            <div className={`p-3 rounded-full ${color}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { isLoading: authLoading } = useRequireAdmin()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [kitchenReport, setKitchenReport] = useState<KitchenReport[]>([])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      loadDashboardData()
    }
  }, [authLoading, selectedDate])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [statsData, kitchenData] = await Promise.all([
        OrderService.getDashboardStats(selectedDate),
        OrderService.getKitchenReport(selectedDate),
      ])
      setStats({
        ...statsData,
        orders_by_grade: (statsData.orders_by_grade as Record<string, { count: number; amount: number }>) || {}
      })
      setKitchenReport(kitchenData.map((item: any) => ({
        ...item,
        orders_by_grade: (item.orders_by_grade as Record<string, { quantity: number; students: string[] }>) || {}
      })))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Error cargando datos del dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const exportKitchenReport = () => {
    if (!kitchenReport.length) {
      toast.error('No hay datos para exportar')
      return
    }

    const csvContent = [
      ['Producto', 'Tipo', 'Cantidad Total', 'Detalles por Curso'].join(','),
      ...kitchenReport.map(item => [
        item.product_name,
        item.product_type,
        item.total_quantity,
        Object.entries(item.orders_by_grade)
          .map(([grade, data]) => `${grade}: ${data.quantity}`)
          .join('; ')
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-cocina-${selectedDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Panel Administrativo</h1>
          <p className="text-muted-foreground">
            Gestión y estadísticas del Casino Escolar
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <Button onClick={loadDashboardData} variant="outline">
            Actualizar
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pedidos"
          value={stats?.total_orders || 0}
          icon={ShoppingCart}
          color="bg-blue-500"
        />
        <StatsCard
          title="Pedidos Pagados"
          value={stats?.paid_orders || 0}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatsCard
          title="Pedidos Pendientes"
          value={stats?.pending_orders || 0}
          icon={Calendar}
          color="bg-yellow-500"
        />
        <StatsCard
          title="Total Recaudado"
          value={OrderService.formatPrice(stats?.total_amount || 0)}
          icon={DollarSign}
          color="bg-purple-500"
          isPrice
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="kitchen">Reporte Cocina</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Orders by Grade */}
          <Card>
            <CardHeader>
              <CardTitle>Pedidos por Curso</CardTitle>
              <CardDescription>
                Distribución de pedidos para {format(new Date(selectedDate), "d 'de' MMMM 'de' yyyy", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats?.orders_by_grade || {}).map(([grade, data]) => (
                  <div key={grade} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{grade}</h4>
                      <Badge variant="secondary">{data.count} pedidos</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total: {OrderService.formatPrice(data.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kitchen" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reporte para Cocina</CardTitle>
                <CardDescription>
                  Productos a preparar para {format(new Date(selectedDate), "d 'de' MMMM", { locale: es })}
                </CardDescription>
              </div>
              <Button onClick={exportKitchenReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kitchenReport.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{item.product_name}</h4>
                        <Badge variant={item.product_type === 'almuerzo' ? 'default' : 'secondary'}>
                          {item.product_type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {item.total_quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">unidades</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Object.entries(item.orders_by_grade).map(([grade, gradeData]) => (
                        <div key={grade} className="text-sm">
                          <span className="font-medium">{grade}:</span>
                          <span className="ml-1">{gradeData.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
                
                {kitchenReport.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay pedidos confirmados para esta fecha
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Pedidos</CardTitle>
              <CardDescription>
                Ver y gestionar todos los pedidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Funcionalidad de gestión de pedidos en desarrollo</p>
                <Button variant="outline" className="mt-4">
                  Ver Todos los Pedidos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}