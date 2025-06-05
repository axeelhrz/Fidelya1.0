"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Utensils,
  Star,
  ArrowRight,
  Activity,
  PieChart,
  Target
} from 'lucide-react'

// Mock data
const mockStats = {
  totalUsers: 156,
  todayOrders: 23,
  weeklyRevenue: 45231,
  activeMenus: 12,
  completedOrders: 89,
  pendingOrders: 7,
  satisfaction: 4.8,
  growth: 12.5
}

const mockRecentOrders = [
  { id: 1, student: "Ana García", menu: "Menú Saludable", time: "12:30", status: "completed" },
  { id: 2, student: "Carlos López", menu: "Menú Tradicional", time: "12:45", status: "preparing" },
  { id: 3, student: "María Rodríguez", menu: "Menú Vegetariano", time: "13:00", status: "pending" },
  { id: 4, student: "José Martínez", menu: "Menú del Día", time: "13:15", status: "completed" },
]

const mockWeeklyData = [
  { day: "Lun", orders: 45, revenue: 1250 },
  { day: "Mar", orders: 52, revenue: 1450 },
  { day: "Mié", orders: 38, revenue: 1100 },
  { day: "Jue", orders: 61, revenue: 1680 },
  { day: "Vie", orders: 48, revenue: 1320 },
]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                  ← Inicio
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-500">Casino Escolar</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  {currentTime.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  {currentTime.toLocaleTimeString('es-ES')}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">AD</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  ¡Bienvenido de vuelta!
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  Gestiona el casino escolar de manera eficiente y moderna
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/pedidos/nuevo">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Nuevo Pedido
                    </Button>
                  </Link>
                  <Link href="/menu">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      <Calendar className="w-4 h-4 mr-2" />
                      Ver Menú
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Usuarios
                </CardTitle>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{mockStats.totalUsers}</div>
                <p className="text-xs text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{mockStats.growth}% este mes
                </p>
              </CardContent>
            </Card>

            {/* Today Orders */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Pedidos Hoy
                </CardTitle>
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{mockStats.todayOrders}</div>
                <p className="text-xs text-slate-500 mt-1">
                  {mockStats.completedOrders} completados, {mockStats.pendingOrders} pendientes
                </p>
              </CardContent>
            </Card>

            {/* Weekly Revenue */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Ingresos Semana
                </CardTitle>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  ${mockStats.weeklyRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-emerald-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% vs semana anterior
                </p>
              </CardContent>
            </Card>

            {/* Satisfaction */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Satisfacción
                </CardTitle>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{mockStats.satisfaction}/5</div>
                <p className="text-xs text-slate-500 mt-1">
                  Basado en {mockStats.completedOrders} evaluaciones
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Weekly Performance Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Rendimiento Semanal</span>
                  </CardTitle>
                  <CardDescription>
                    Pedidos e ingresos por día
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockWeeklyData.map((day, index) => (
                      <div key={day.day} className="flex items-center space-x-4">
                        <div className="w-12 text-sm font-medium text-slate-600">{day.day}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-600">{day.orders} pedidos</span>
                            <span className="text-sm font-medium text-slate-800">${day.revenue}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${(day.orders / 70) * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Orders */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/70 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span>Pedidos Recientes</span>
                  </CardTitle>
                  <CardDescription>
                    Actividad en tiempo real
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockRecentOrders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50/50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          order.status === 'completed' ? 'bg-emerald-500' :
                          order.status === 'preparing' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {order.student}
                          </p>
                          <p className="text-xs text-slate-500">{order.menu}</p>
                        </div>
                        <div className="text-xs text-slate-400">{order.time}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span>Acciones Rápidas</span>
                </CardTitle>
                <CardDescription>
                  Accede a las funciones principales del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Quick Action Cards */}
                  {[
                    { 
                      title: "Gestionar Menús", 
                      description: "Crear y editar menús semanales",
                      icon: Utensils,
                      href: "/admin/menu",
                      color: "from-blue-500 to-blue-600"
                    },
                    { 
                      title: "Ver Pedidos", 
                      description: "Administrar pedidos activos",
                      icon: ShoppingCart,
                      href: "/admin/pedidos",
                      color: "from-emerald-500 to-emerald-600"
                    },
                    { 
                      title: "Usuarios", 
                      description: "Gestionar usuarios del sistema",
                      icon: Users,
                      href: "/admin/usuarios",
                      color: "from-purple-500 to-purple-600"
                    },
                    { 
                      title: "Estadísticas", 
                      description: "Reportes y análisis detallados",
                      icon: PieChart,
                      href: "/admin/estadisticas",
                      color: "from-amber-500 to-amber-600"
                    }
                  ].map((action, index) => (
                    <Link key={action.title} href={action.href}>
                      <motion.div
                        className="group p-4 rounded-xl bg-gradient-to-br from-white/50 to-white/30 border border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        whileHover={{ y: -2 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-1">{action.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{action.description}</p>
                        <div className="flex items-center text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                          <span>Acceder</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}