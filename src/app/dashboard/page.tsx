'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  ShoppingCart, 
  Plus, 
  Clock, 
  User, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useRequireAuth } from '@/hooks/useAuth'
import { useUser } from '@/context/UserContext'
import { useOrders } from '@/hooks/useOrders'
import { useProducts } from '@/hooks/useProducts'
import { Navbar } from '@/components/navbar'
import { OrderService } from '@/lib/orders/orderService'
import { ProductService } from '@/lib/products/productService'
import { format, addDays, isToday, isTomorrow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

export default function Dashboard() {
  const { isLoading: authLoading } = useRequireAuth()
  const { guardian, students } = useUser()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  
  const { orders, isLoading: ordersLoading } = useOrders({
    date_from: format(new Date(), 'yyyy-MM-dd'),
    date_to: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  })

  const { products, isLoading: productsLoading } = useProducts(selectedDate)

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const todayOrders = orders.filter(order => 
    format(new Date(order.delivery_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  )

  const upcomingOrders = orders.filter(order => 
    new Date(order.delivery_date) > new Date() &&
    format(new Date(order.delivery_date), 'yyyy-MM-dd') !== format(new Date(), 'yyyy-MM-dd')
  )

  const canOrderToday = products.some(p => p.can_order)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold">
            ¡Bienvenido, {guardian?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Gestiona los pedidos de almuerzo y colación para tus estudiantes
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickStatCard
            title="Estudiantes Registrados"
            value={students.length}
            icon={User}
            color="bg-blue-500"
          />
          <QuickStatCard
            title="Pedidos Hoy"
            value={todayOrders.length}
            icon={Calendar}
            color="bg-green-500"
          />
          <QuickStatCard
            title="Pedidos Próximos"
            value={upcomingOrders.length}
            icon={Clock}
            color="bg-purple-500"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Realiza pedidos y gestiona tus estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/pedidos/nuevo">
                <Button className="w-full h-20 text-left justify-start" variant="outline">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Nuevo Pedido</p>
                      <p className="text-sm text-muted-foreground">
                        Realizar pedido para tus estudiantes
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link href="/perfil">
                <Button className="w-full h-20 text-left justify-start" variant="outline">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <User className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Gestionar Estudiantes</p>
                      <p className="text-sm text-muted-foreground">
                        Agregar o editar información de estudiantes
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>

            {/* Order Status Alert */}
            {canOrderToday ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    ¡Puedes realizar pedidos!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    El sistema está abierto para recibir pedidos
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Fuera del horario de pedidos
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-300">
                    Los pedidos se pueden realizar hasta las 10:00 AM
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Orders */}
        {todayOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pedidos de Hoy</CardTitle>
              <CardDescription>
                Pedidos programados para {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Orders */}
        {upcomingOrders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Próximos Pedidos</CardTitle>
              <CardDescription>
                Pedidos programados para los próximos días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingOrders.slice(0, 5).map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
                {upcomingOrders.length > 5 && (
                  <div className="text-center pt-4">
                    <Link href="/pedidos/historial">
                      <Button variant="outline">
                        Ver todos los pedidos ({upcomingOrders.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Orders State */}
        {orders.length === 0 && !ordersLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tienes pedidos</h3>
              <p className="text-muted-foreground mb-6">
                Comienza realizando tu primer pedido para tus estudiantes
              </p>
              <Link href="/pedidos/nuevo">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Realizar Primer Pedido
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

interface QuickStatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}

function QuickStatCard({ title, value, icon: Icon, color }: QuickStatCardProps) {
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
              <p className="text-2xl font-bold">{value}</p>
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

interface OrderCardProps {
  order: any // OrderWithDetails type
}

function OrderCard({ order }: OrderCardProps) {
  const deliveryDate = new Date(order.delivery_date)
  const isOrderToday = isToday(deliveryDate)
  const isOrderTomorrow = isTomorrow(deliveryDate)
  
  let dateLabel = format(deliveryDate, "EEEE, d 'de' MMMM", { locale: es })
  if (isOrderToday) dateLabel = 'Hoy'
  if (isOrderTomorrow) dateLabel = 'Mañana'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ShoppingCart className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="font-medium">{order.student.name}</p>
          <p className="text-sm text-muted-foreground">
            {dateLabel} • {OrderService.formatOrderNumber(order.order_number)}
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <Badge className={OrderService.getOrderStatusColor(order.status)}>
          {OrderService.getOrderStatusLabel(order.status)}
        </Badge>
        <p className="text-sm font-medium mt-1">
          {OrderService.formatPrice(order.total_amount)}
        </p>
      </div>
    </motion.div>
  )
}