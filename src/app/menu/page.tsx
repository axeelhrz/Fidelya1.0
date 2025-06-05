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
  Sparkles,
  ChefHat,
  Zap,
  Filter,
  Search,
  TrendingUp,
  Shield,
  Flame
} from "lucide-react"
import { format, addDays, startOfWeek, isToday, isTomorrow, addWeeks, subWeeks } from "date-fns"
import { es } from "date-fns/locale"

// Mock data mejorado con más variedad
const generateMenuForDate = (date: Date) => {
  const dateStr = format(date, 'yyyy-MM-dd')
  const dayIndex = date.getDay()
  
  const menuTemplates = [
    {
      id: `${dateStr}-1`,
      nombre: 'Salmón Teriyaki Gourmet',
      descripcion: 'Filete de salmón fresco glaseado con salsa teriyaki casera, acompañado de arroz jazmín y vegetales wok',
      precio: 6800,
      rating: 4.9,
      tiempo: '25 min',
      calorias: 420,
      categoria: 'Premium',
      ingredientes: ['Salmón atlántico', 'Arroz jazmín', 'Brócoli', 'Zanahoria', 'Salsa teriyaki'],
      alergenos: ['Pescado', 'Soja'],
      vegetariano: false,
      vegano: false,
      saludable: true,
      popular: true,
      spicy: false,
      nuevo: false
    },
    {
      id: `${dateStr}-2`,
      nombre: 'Bowl Buddha Energético',
      descripcion: 'Quinoa tricolor, garbanzos especiados, palta, tomate cherry, pepino, hummus y tahini',
      precio: 4500,
      rating: 4.8,
      tiempo: '15 min',
      calorias: 380,
      categoria: 'Vegano',
      ingredientes: ['Quinoa', 'Garbanzos', 'Palta', 'Hummus', 'Tahini'],
      alergenos: ['Sésamo'],
      vegetariano: true,
      vegano: true,
      saludable: true,
      popular: true,
      spicy: false,
      nuevo: true
    },
    {
      id: `${dateStr}-3`,
      nombre: 'Pollo Mediterráneo',
      descripcion: 'Pechuga de pollo marinada con hierbas mediterráneas, puré de camote y ratatouille',
      precio: 5200,
      rating: 4.7,
      tiempo: '30 min',
      calorias: 450,
      categoria: 'Tradicional',
      ingredientes: ['Pollo', 'Camote', 'Berenjena', 'Calabacín', 'Hierbas'],
      alergenos: [],
      vegetariano: false,
      vegano: false,
      saludable: true,
      popular: false,
      spicy: false,
      nuevo: false
    }
  ]

  // Rotar menús según el día para variedad
  return menuTemplates.map((template, index) => ({
    ...template,
    id: `${dateStr}-${index + 1}`,
    precio: template.precio + (dayIndex * 100), // Pequeña variación de precio
    rating: Math.max(4.0, template.rating - (Math.random() * 0.3))
  }))
}

const mockColaciones = [
  {
    id: 'c1',
    nombre: 'Açaí Bowl Tropical',
    descripcion: 'Base de açaí con granola artesanal, plátano, mango, coco rallado y miel de agave',
    precio: 3200,
    rating: 4.9,
    tiempo: '5 min',
    calorias: 280,
    categoria: 'Superfood',
    ingredientes: ['Açaí', 'Granola', 'Plátano', 'Mango', 'Coco'],
    alergenos: ['Frutos secos'],
    vegetariano: true,
    vegano: true,
    saludable: true,
    popular: true,
    spicy: false,
    nuevo: true
  },
  {
    id: 'c2',
    nombre: 'Wrap de Pollo Thai',
    descripcion: 'Tortilla integral con pollo marinado, vegetales crujientes y salsa de maní picante',
    precio: 3800,
    rating: 4.7,
    tiempo: '8 min',
    calorias: 420,
    categoria: 'Internacional',
    ingredientes: ['Pollo', 'Tortilla integral', 'Vegetales', 'Salsa maní'],
    alergenos: ['Gluten', 'Maní'],
    vegetariano: false,
    vegano: false,
    saludable: true,
    popular: true,
    spicy: true,
    nuevo: false
  },
  {
    id: 'c3',
    nombre: 'Smoothie Verde Detox',
    descripcion: 'Espinaca, manzana verde, apio, jengibre, limón y agua de coco natural',
    precio: 2800,
    rating: 4.5,
    tiempo: '3 min',
    calorias: 150,
    categoria: 'Detox',
    ingredientes: ['Espinaca', 'Manzana', 'Apio', 'Jengibre', 'Agua de coco'],
    alergenos: [],
    vegetariano: true,
    vegano: true,
    saludable: true,
    popular: false,
    spicy: false,
    nuevo: false
  },
  {
    id: 'c4',
    nombre: 'Tostada de Palta Premium',
    descripcion: 'Pan de masa madre tostado, palta cremosa, tomate heirloom, queso feta y microgreens',
    precio: 3500,
    rating: 4.6,
    tiempo: '6 min',
    calorias: 320,
    categoria: 'Gourmet',
    ingredientes: ['Pan masa madre', 'Palta', 'Tomate heirloom', 'Queso feta'],
    alergenos: ['Gluten', 'Lactosa'],
    vegetariano: true,
    vegano: false,
    saludable: true,
    popular: true,
    spicy: false,
    nuevo: false
  },
  {
    id: 'c5',
    nombre: 'Energy Balls Cacao',
    descripcion: 'Bolitas energéticas de dátiles, almendras, cacao crudo y semillas de chía',
    precio: 2200,
    rating: 4.4,
    tiempo: '1 min',
    calorias: 180,
    categoria: 'Snack',
    ingredientes: ['Dátiles', 'Almendras', 'Cacao', 'Chía'],
    alergenos: ['Frutos secos'],
    vegetariano: true,
    vegano: true,
    saludable: true,
    popular: false,
    spicy: false,
    nuevo: true
  },
  {
    id: 'c6',
    nombre: 'Matcha Latte Cremoso',
    descripcion: 'Té matcha premium con leche de avena espumosa y un toque de vainilla',
    precio: 2600,
    rating: 4.3,
    tiempo: '4 min',
    calorias: 120,
    categoria: 'Bebida',
    ingredientes: ['Matcha', 'Leche de avena', 'Vainilla', 'Miel'],
    alergenos: ['Avena'],
    vegetariano: true,
    vegano: true,
    saludable: true,
    popular: false,
    spicy: false,
    nuevo: true
  }
]

const categoryColors = {
  'Premium': 'from-purple-600 to-pink-600',
  'Vegano': 'from-green-500 to-emerald-600',
  'Tradicional': 'from-blue-500 to-cyan-600',
  'Superfood': 'from-pink-500 to-rose-600',
  'Internacional': 'from-orange-500 to-red-600',
  'Detox': 'from-lime-500 to-green-500',
  'Gourmet': 'from-amber-500 to-yellow-600',
  'Snack': 'from-indigo-500 to-purple-600',
  'Bebida': 'from-teal-500 to-cyan-600'
}

function WeekSelector({ currentDate, onWeekChange }: { currentDate: Date, onWeekChange: (date: Date) => void }) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const endDate = addDays(startDate, 4)
  
  const goToPreviousWeek = () => onWeekChange(subWeeks(currentDate, 1))
  const goToNextWeek = () => onWeekChange(addWeeks(currentDate, 1))
  const goToCurrentWeek = () => onWeekChange(new Date())
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 mb-8"
    >
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={goToPreviousWeek}
          className="rounded-2xl hover:bg-blue-50 h-12 w-12"
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
            onClick={goToCurrentWeek}
            className="mt-2 rounded-xl text-xs"
          >
            Ir a semana actual
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={goToNextWeek}
          className="rounded-2xl hover:bg-blue-50 h-12 w-12"
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group h-full"
    >
      <Card className={`
        h-full bg-white/90 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl 
        transition-all duration-500 rounded-3xl overflow-hidden relative
        ${itemIsToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}>
        {/* Gradient header */}
        <div className={`h-1 bg-gradient-to-r ${categoryColor}`} />
        
        {/* Badges overlay */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {item.nuevo && (
            <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              Nuevo
            </Badge>
          )}
          {item.popular && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs shadow-lg">
              <TrendingUp className="w-3 h-3 mr-1" />
              Popular
            </Badge>
          )}
          {item.spicy && (
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs shadow-lg">
              <Flame className="w-3 h-3 mr-1" />
              Picante
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-4 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-4">
              <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
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
                {item.vegano && (
                  <Badge className="bg-green-100 text-green-700 text-xs border-green-200">
                    <Leaf className="w-3 h-3 mr-1" />
                    Vegano
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-gray-700">{item.rating.toFixed(1)}</span>
              </div>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${item.precio.toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-gray-600 leading-relaxed">{item.descripcion}</p>
          
          {/* Stats grid */}
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

          {/* Ingredients */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              Ingredientes principales
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.ingredientes.slice(0, 4).map((ingrediente: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs bg-gray-100 text-gray-700 rounded-xl">
                  {ingrediente}
                </Badge>
              ))}
              {item.ingredientes.length > 4 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 rounded-xl">
                  +{item.ingredientes.length - 4} más
                </Badge>
              )}
            </div>
          </div>

          {/* Allergens */}
          {item.alergenos.length > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
              <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Alérgenos
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.alergenos.map((alergeno: string, idx: number) => (
                  <Badge key={idx} className="bg-amber-200 text-amber-800 text-xs rounded-xl">
                    {alergeno}
                  </Badge>
                ))}
              </div>
            </div>
          )}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Day header */}
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

      {/* Menu items */}
      <div className="space-y-6">
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
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300 rounded-3xl">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="font-semibold text-gray-600 mb-2">Sin menú disponible</h3>
              <p className="text-sm text-gray-500">No hay opciones para este día</p>
            </CardContent>
          </Card>
        )}
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
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null
  }

  // Generate week days with real dates
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 5 }).map((_, index) => {
    const date = addDays(startDate, index)
    return {
      key: format(date, 'yyyy-MM-dd'),
      name: format(date, 'EEEE', { locale: es }),
      date: date,
      shortDate: format(date, 'd MMM', { locale: es })
    }
  })

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
      <div className="container max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestras opciones gastronómicas preparadas con ingredientes frescos, 
            diseñadas para nutrir cuerpo y mente de nuestra comunidad educativa
          </p>
        </motion.div>

        {/* Enhanced stats cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { 
              icon: Users, 
              label: 'Estudiantes atendidos hoy', 
              value: '1,247', 
              color: 'from-blue-500 to-blue-600',
              change: '+12%',
              changeColor: 'text-emerald-600'
            },
            { 
              icon: Award, 
              label: 'Calificación promedio', 
              value: '4.8/5', 
              color: 'from-yellow-500 to-orange-500',
              change: '+0.2',
              changeColor: 'text-emerald-600'
            },
            { 
              icon: Leaf, 
              label: 'Opciones saludables', 
              value: '92%', 
              color: 'from-green-500 to-emerald-500',
              change: '+5%',
              changeColor: 'text-emerald-600'
            },
            { 
              icon: ChefHat, 
              label: 'Platos disponibles', 
              value: '28', 
              color: 'from-purple-500 to-violet-500',
              change: '+3',
              changeColor: 'text-emerald-600'
            }
          ].map((stat, index) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                  <p className={`text-xs font-semibold ${stat.changeColor} flex items-center justify-center gap-1`}>
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} vs ayer
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main content */}
        <Tabs defaultValue="almuerzos" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12"
            >
              {weekDays.map((day) => (
                <DayColumn 
                  key={day.key} 
                  day={day} 
                  almuerzos={generateMenuForDate(day.date)} 
                />
              ))}
            </motion.div>
            
            {/* Enhanced info card for almuerzos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-semibold">Horario de servicio</p>
                              <p className="text-sm">12:00 - 14:00 hrs</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-semibold">Preparación</p>
                              <p className="text-sm">Diaria y fresca</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <div>
                              <p className="font-semibold">Pedidos</p>
                              <p className="text-sm">24h de anticipación</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="font-bold text-gray-900 mb-2">Precios por categoría:</p>
                            <div className="space-y-1 text-sm">
                              <p>• Estudiantes: $4,200 - $6,800</p>
                              <p>• Funcionarios: $3,800 - $6,100</p>
                              <p>• Profesores: $4,000 - $6,500</p>
                              <p className="text-emerald-600 font-semibold">• Descuentos grupales disponibles</p>
                            </div>
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
              variants={containerVariants}
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
                      <p className="text-gray-600 mt-1">Energía y sabor para cada momento del día</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockColaciones.map((colacion, index) => (
                      <MenuCard key={colacion.id} item={colacion} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Enhanced info card for colaciones */}
              <motion.div variants={itemVariants}>
                <Card className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-purple-200 rounded-3xl shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Info className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Información de Colaciones</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="font-semibold">Disponibilidad</p>
                                <p className="text-sm">Todo el día escolar</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Heart className="w-5 h-5 text-pink-600" />
                              <div>
                                <p className="font-semibold">Enfoque</p>
                                <p className="text-sm">Saludable y energético</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Zap className="w-5 h-5 text-yellow-600" />
                              <div>
                                <p className="font-semibold">Ideal para</p>
                                <p className="text-sm">Media mañana y tarde</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <p className="font-bold text-gray-900 mb-2">Características especiales:</p>
                              <div className="space-y-1 text-sm">
                                <p>• Ingredientes frescos y naturales</p>
                                <p>• Opciones veganas y vegetarianas</p>
                                <p>• Preparación al momento</p>
                                <p>• Sin conservantes artificiales</p>
                                <p className="text-purple-600 font-semibold">• Nuevas opciones semanalmente</p>
                              </div>
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