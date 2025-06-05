"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  ChevronRight, 
  Coffee, 
  Utensils, 
  Star,
  Clock,
  Users,
  Leaf,
  Heart,
  Award,
  Calendar,
  Info,
  ChefHat,
  Zap,
  TrendingUp
} from "lucide-react"
import { format, addDays, startOfWeek, isToday, isTomorrow, addWeeks, subWeeks } from "date-fns"
import { es } from "date-fns/locale"

// Datos estructurados y realistas
const menuData = {
  almuerzos: {
    lunes: [
      {
        id: 'alm-lun-1',
        nombre: 'Pollo al Horno con Quinoa',
        descripcion: 'Pechuga de pollo marinada con hierbas, acompañada de quinoa tricolor y verduras asadas',
        precio: 5200,
        rating: 4.7,
        tiempo: '25 min',
        calorias: 420,
        categoria: 'Proteína',
        saludable: true,
        popular: true
      },
      {
        id: 'alm-lun-2',
        nombre: 'Pasta Integral Boloñesa',
        descripcion: 'Pasta integral con salsa boloñesa casera y queso parmesano',
        precio: 4800,
        rating: 4.5,
        tiempo: '20 min',
        calorias: 480,
        categoria: 'Tradicional',
        saludable: false,
        popular: false
      }
    ],
    martes: [
      {
        id: 'alm-mar-1',
        nombre: 'Salmón a la Plancha',
        descripcion: 'Filete de salmón fresco con puré de camote y espárragos',
        precio: 6200,
        rating: 4.9,
        tiempo: '30 min',
        calorias: 380,
        categoria: 'Pescado',
        saludable: true,
        popular: true
      }
    ],
    miercoles: [
      {
        id: 'alm-mie-1',
        nombre: 'Bowl Vegano Mediterráneo',
        descripcion: 'Garbanzos especiados, hummus, tabulé y vegetales frescos',
        precio: 4500,
        rating: 4.6,
        tiempo: '15 min',
        calorias: 350,
        categoria: 'Vegano',
        saludable: true,
        popular: false
      }
    ]
  },
  colaciones: [
    {
      id: 'col-1',
      nombre: 'Sándwich de Pavo Integral',
      descripcion: 'Pan integral con pavo natural, palta y tomate',
      precio: 2800,
      rating: 4.6,
      tiempo: '5 min',
      calorias: 320,
      categoria: 'Sándwich',
      saludable: true,
      popular: true
    },
    {
      id: 'col-2',
      nombre: 'Yogurt con Granola',
      descripcion: 'Yogurt griego natural con granola casera y berries',
      precio: 2200,
      rating: 4.8,
      tiempo: '2 min',
      calorias: 280,
      categoria: 'Lácteo',
      saludable: true,
      popular: true
    },
    {
      id: 'col-3',
      nombre: 'Smoothie Verde',
      descripcion: 'Espinaca, manzana, apio y jengibre con agua de coco',
      precio: 2500,
      rating: 4.3,
      tiempo: '3 min',
      calorias: 150,
      categoria: 'Bebida',
      saludable: true,
      popular: false
    }
  ]
}

const categoryColors = {
  'Proteína': 'from-red-500 to-pink-500',
  'Tradicional': 'from-blue-500 to-cyan-500',
  'Pescado': 'from-teal-500 to-blue-500',
  'Vegano': 'from-green-500 to-emerald-500',
  'Sándwich': 'from-yellow-500 to-orange-500',
  'Lácteo': 'from-purple-500 to-violet-500',
  'Bebida': 'from-pink-500 to-rose-500'
}

// Animaciones optimizadas
const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  },
  item: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  },
  card: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4 }
    }
  }
}

function WeekSelector({ currentDate, onWeekChange }: { currentDate: Date, onWeekChange: (date: Date) => void }) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const endDate = addDays(startDate, 4)
  
  return (
    <motion.div
      variants={animations.fadeIn}
      initial="hidden"
      animate="visible"
      className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 mb-8"
    >
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onWeekChange(subWeeks(currentDate, 1))}
          className="rounded-2xl hover:bg-blue-50 h-12 w-12 transition-colors duration-200"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {format(startDate, 'd', { locale: es })} - {format(endDate, 'd')} de {format(endDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <p className="text-sm text-gray-600">Semana del menú escolar</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onWeekChange(new Date())}
            className="mt-2 rounded-xl text-xs transition-all duration-200"
          >
            Ir a semana actual
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onWeekChange(addWeeks(currentDate, 1))}
          className="rounded-2xl hover:bg-blue-50 h-12 w-12 transition-colors duration-200"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  )
}

function MenuCard({ item, index, isToday: itemIsToday }: { item: any, index: number, isToday?: boolean }) {
  const categoryColor = categoryColors[item.categoria as keyof typeof categoryColors] || 'from-gray-500 to-slate-500'
  
  return (
    <motion.div
      variants={animations.card}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="group h-full"
    >
      <Card className={`
        h-full bg-white/90 backdrop-blur-xl border-white/30 shadow-xl 
        transition-shadow duration-300 rounded-3xl overflow-hidden relative
        ${itemIsToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}>
        <div className={`h-1 bg-gradient-to-r ${categoryColor}`} />
        
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {item.popular && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs shadow-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-4">
              <CardTitle className="text-xl font-bold text-gray-900 leading-tight mb-2">
                {item.nombre}
              </CardTitle>
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  variant="outline" 
                  className={`text-xs bg-gradient-to-r ${categoryColor} text-white border-0`}
                >
                  {item.categoria}
                </Badge>
                {item.saludable && (
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs border-emerald-200">
                    <Heart className="w-3 h-3 mr-1" />
                    Saludable
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${item.precio.toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600 leading-relaxed">{item.descripcion}</p>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-blue-700">{item.tiempo}</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl">
              <Zap className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-emerald-700">{item.calorias} cal</p>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <ChefHat className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-purple-700">Gourmet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function DayColumn({ day, almuerzos }: { day: any, almuerzos: any[] }) {
  const dayAlmuerzos = almuerzos || []
  const isDayToday = isToday(day.date)
  const isDayTomorrow = isTomorrow(day.date)
  
  const getDayLabel = () => {
    if (isDayToday) return 'Hoy'
    if (isDayTomorrow) return 'Mañana'
    return day.name
  }
  
  return (
    <motion.div
      variants={animations.item}
      className="space-y-6"
    >
      <div className={`
        text-white text-center py-6 rounded-3xl shadow-xl relative overflow-hidden
        ${isDayToday 
          ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600' 
          : isDayTomorrow
          ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600'
          : 'bg-gradient-to-r from-slate-600 via-gray-600 to-slate-600'
        }
      `}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
        <div className="relative z-10">
          <h3 className="font-bold text-xl mb-1">{getDayLabel()}</h3>
          <p className="text-sm opacity-90">{format(day.date, 'd MMM', { locale: es })}</p>
          {isDayToday && (
            <Badge className="mt-2 bg-white/20 text-white border-white/30">
              <Clock className="w-3 h-3 mr-1" />
              Disponible ahora
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {dayAlmuerzos.length > 0 ? (
            dayAlmuerzos.map((almuerzo, index) => (
              <MenuCard 
                key={almuerzo.id} 
                item={almuerzo} 
                index={index} 
                isToday={isDayToday}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300 rounded-3xl">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="font-semibold text-gray-600 mb-2">Sin menú disponible</h3>
                  <p className="text-sm text-gray-500">No hay opciones para este día</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function MenuPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null
  }

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 5 }).map((_, index) => {
    const date = addDays(startDate, index)
    const dayName = format(date, 'EEEE', { locale: es }).toLowerCase()
    
    return {
      key: format(date, 'yyyy-MM-dd'),
      name: format(date, 'EEEE', { locale: es }),
      date: date,
      shortDate: format(date, 'd MMM', { locale: es }),
      almuerzos: menuData.almuerzos[dayName as keyof typeof menuData.almuerzos] || []
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          variants={animations.fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold text-gray-900 mb-2">Menú del Casino</h1>
              <p className="text-xl text-gray-600">
                {format(currentTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </p>
              <p className="text-sm text-gray-500">
                Última actualización: {format(currentTime, 'HH:mm', { locale: es })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { 
              icon: Users, 
              label: 'Estudiantes atendidos', 
              value: '342', 
              color: 'from-blue-500 to-blue-600'
            },
            { 
              icon: Award, 
              label: 'Calificación promedio', 
              value: '4.6/5', 
              color: 'from-yellow-500 to-orange-500'
            },
            { 
              icon: Leaf, 
              label: 'Opciones saludables', 
              value: '75%', 
              color: 'from-green-500 to-emerald-500'
            },
            { 
              icon: ChefHat, 
              label: 'Platos disponibles', 
              value: '12', 
              color: 'from-purple-500 to-violet-500'
            }
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={animations.item}>
              <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-3xl group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main content */}
        <Tabs defaultValue="almuerzos" className="w-full">
          <motion.div
            variants={animations.fadeIn}
            initial="hidden"
            animate="visible"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white/90 backdrop-blur-xl border border-white/30 rounded-3xl p-2 shadow-xl">
              <TabsTrigger 
                value="almuerzos" 
                className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Utensils className="h-5 w-5" /> 
                <span className="font-semibold">Almuerzos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="colaciones" 
                className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Coffee className="h-5 w-5" /> 
                <span className="font-semibold">Colaciones</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>
          
          {/* Almuerzos tab */}
          <TabsContent value="almuerzos" className="mt-8">
            <WeekSelector 
              currentDate={currentDate} 
              onWeekChange={(date) => setCurrentDate(date)} 
            />
            
            <motion.div
              variants={animations.container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12"
            >
              {weekDays.map((day) => (
                <DayColumn 
                  key={day.key} 
                  day={day} 
                  almuerzos={day.almuerzos} 
                />
              ))}
            </motion.div>
            
            {/* Info card */}
            <motion.div
              variants={animations.fadeIn}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-blue-200 rounded-3xl shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Info className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Información de Almuerzos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                        <div className="space-y-3">
                          <p className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span><strong>Horario:</strong> 12:00 - 14:00 hrs</span>
                          </p>
                          <p className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <span><strong>Pedidos:</strong> 24h de anticipación</span>
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 mb-2">Precios:</p>
                          <div className="space-y-1 text-sm">
                            <p>• Estudiantes: $4,500 - $6,200</p>
                            <p>• Funcionarios: $4,000 - $5,600</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
          
          {/* Colaciones tab */}
          <TabsContent value="colaciones" className="mt-8">
            <motion.div
              variants={animations.container}
              initial="hidden"
              animate="visible"
            >
              <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-xl rounded-3xl mb-12">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <Coffee className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-left">
                      <CardTitle className="text-3xl font-bold text-gray-900">Colaciones Disponibles</CardTitle>
                      <p className="text-gray-600 mt-1">Opciones saludables para recargar energías</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menuData.colaciones.map((colacion, index) => (
                      <MenuCard key={colacion.id} item={colacion} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Info card */}
              <motion.div variants={animations.item}>
                <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-purple-200 rounded-3xl shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Info className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Información de Colaciones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                          <div className="space-y-3">
                            <p className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-purple-600" />
                              <span><strong>Disponible:</strong> Todo el día</span>
                            </p>
                            <p className="flex items-center gap-3">
                              <Heart className="w-5 h-5 text-pink-600" />
                              <span><strong>Enfoque:</strong> Saludable y nutritivo</span>
                            </p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 mb-2">Características:</p>
                            <div className="space-y-1 text-sm">
                              <p>• Ingredientes frescos</p>
                              <p>• Opciones vegetarianas</p>
                              <p>• Preparación al momento</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}