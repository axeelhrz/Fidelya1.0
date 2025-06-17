"use client";

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Clock, 
  GraduationCap,
  ArrowRight,
  Info,
  Calendar,
  Utensils,
  Coffee,
  ShoppingCart,
  Star,
  ArrowLeft,
  Check
} from 'lucide-react'

// Types
interface Student {
  id: string;
  nombre: string;
  curso: string;
  letra: string;
  nivel: string;
  avatar: string;
}

interface MenuOption {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  rating: number;
}

interface DayMenuOptions {
  almuerzo: MenuOption[];
  colacion: MenuOption[];
}

interface MockMenuOptions {
  [key: string]: DayMenuOptions;
}

// Mock data
const mockStudents: Student[] = [
  {
    id: '1',
    nombre: 'Ana García Rodríguez',
    curso: '5',
    letra: 'A',
    nivel: 'Básica',
    avatar: 'AG'
  },
  {
    id: '2',
    nombre: 'Carlos López Martínez',
    curso: '3',
    letra: 'B',
    nivel: 'Básica',
    avatar: 'CL'
  },
  {
    id: '3',
    nombre: 'María Fernández Silva',
    curso: '7',
    letra: 'A',
    nivel: 'Media',
    avatar: 'MF'
  }
]

const mockMenuOptions: MockMenuOptions = {
  '2024-01-15': {
    almuerzo: [
      { id: 'a1', nombre: 'Pollo al horno con verduras', precio: 3500, descripcion: 'Pollo jugoso con mix de verduras asadas', rating: 4.8 },
      { id: 'a2', nombre: 'Pasta con salsa boloñesa', precio: 3200, descripcion: 'Pasta fresca con salsa de carne casera', rating: 4.6 },
      { id: 'a3', nombre: 'Ensalada César completa', precio: 2800, descripcion: 'Lechuga, pollo, crutones y aderezo César', rating: 4.4 }
    ],
    colacion: [
      { id: 'c1', nombre: 'Sándwich de pavo', precio: 1800, descripcion: 'Pan integral con pavo, palta y tomate', rating: 4.7 },
      { id: 'c2', nombre: 'Yogurt con granola', precio: 1500, descripcion: 'Yogurt natural con granola y frutas', rating: 4.5 },
      { id: 'c3', nombre: 'Fruta de temporada', precio: 1200, descripcion: 'Selección de frutas frescas del día', rating: 4.3 }
    ]
  },
  '2024-01-16': {
    almuerzo: [
      { id: 'a4', nombre: 'Pescado a la plancha', precio: 3800, descripcion: 'Salmón fresco con quinoa y vegetales', rating: 4.9 },
      { id: 'a5', nombre: 'Arroz con pollo', precio: 3300, descripcion: 'Arroz amarillo con pollo y verduras', rating: 4.5 },
      { id: 'a6', nombre: 'Hamburguesa saludable', precio: 3600, descripcion: 'Carne magra con pan integral y ensalada', rating: 4.2 }
    ],
    colacion: [
      { id: 'c4', nombre: 'Wrap de atún', precio: 1900, descripcion: 'Tortilla integral con atún y vegetales', rating: 4.6 },
      { id: 'c5', nombre: 'Smoothie de frutas', precio: 1600, descripcion: 'Batido natural de frutas mixtas', rating: 4.8 },
      { id: 'c6', nombre: 'Galletas integrales', precio: 1300, descripcion: 'Galletas caseras con avena y pasas', rating: 4.1 }
    ]
  }
}

const weekDays = [
  { key: '2024-01-15', name: 'Lunes', date: '15 Ene' },
  { key: '2024-01-16', name: 'Martes', date: '16 Ene' },
  { key: '2024-01-17', name: 'Miércoles', date: '17 Ene' },
  { key: '2024-01-18', name: 'Jueves', date: '18 Ene' },
  { key: '2024-01-19', name: 'Viernes', date: '19 Ene' }
]

export default function NuevoPedidoPage() {
  const [currentStep, setCurrentStep] = useState<'selection' | 'menu' | 'summary' | 'confirmation'>('selection')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedMenus, setSelectedMenus] = useState<{[studentId: string]: {[date: string]: {almuerzo?: string, colacion?: string}}}>({})
  const [currentStudentMenu, setCurrentStudentMenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const getStudentCompletionStatus = (studentId: string) => {
    const selections = selectedMenus[studentId] || {}
    const hasSelections = Object.keys(selections).length > 0
    
    if (!hasSelections) return 'pending'
    
    const hasAnySelection = Object.values(selections).some(daySelections => 
      daySelections.almuerzo || daySelections.colacion
    )
    
    return hasAnySelection ? 'completed' : 'pending'
  }

  const getProgressStats = () => {
    const total = selectedStudents.length
    const completed = selectedStudents.filter(id => 
      getStudentCompletionStatus(id) === 'completed'
    ).length
    
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 }
  }

  const calculateTotal = () => {
    let total = 0
    Object.values(selectedMenus).forEach(studentMenus => {
      Object.values(studentMenus).forEach(dayMenus => {
        if (dayMenus.almuerzo) {
          // Find price in mock data
          Object.values(mockMenuOptions).forEach(dayOptions => {
            const almuerzoOption = dayOptions.almuerzo.find(opt => opt.id === dayMenus.almuerzo)
            if (almuerzoOption) total += almuerzoOption.precio
          })
        }
        if (dayMenus.colacion) {
          Object.values(mockMenuOptions).forEach(dayOptions => {
            const colacionOption = dayOptions.colacion.find(opt => opt.id === dayMenus.colacion)
            if (colacionOption) total += colacionOption.precio
          })
        }
      })
    })
    return total
  }

  const selectMenu = (studentId: string, date: string, type: 'almuerzo' | 'colacion', menuId: string) => {
    setSelectedMenus(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: {
          ...prev[studentId]?.[date],
          [type]: menuId
        }
      }
    }))
  }

  const progressStats = getProgressStats()

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
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
              
              <CardHeader className="relative z-10 text-white py-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      {currentStep === 'selection' && "Nuevo Pedido"}
                      {currentStep === 'menu' && "Seleccionar Menús"}
                      {currentStep === 'summary' && "Resumen del Pedido"}
                      {currentStep === 'confirmation' && "Pedido Confirmado"}
                    </CardTitle>
                    <p className="text-blue-100 mt-1">
                      {currentStep === 'selection' && "Selecciona los estudiantes para el pedido"}
                      {currentStep === 'menu' && "Elige los menús para cada día"}
                      {currentStep === 'summary' && "Revisa tu pedido antes de confirmar"}
                      {currentStep === 'confirmation' && "Tu pedido ha sido procesado exitosamente"}
                    </p>
                  </div>
                </motion.div>

                {/* Progress bar */}
                {currentStep === 'selection' && selectedStudents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-100">
                        Progreso del pedido
                      </span>
                      <span className="text-sm font-bold text-white">
                        {progressStats.completed}/{progressStats.total} estudiantes
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressStats.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center mt-6 space-x-4"
                >
                  {[
                    { key: 'selection', label: 'Estudiantes', icon: GraduationCap },
                    { key: 'menu', label: 'Menús', icon: Utensils },
                    { key: 'summary', label: 'Resumen', icon: CheckCircle },
                    { key: 'confirmation', label: 'Confirmación', icon: Check }
                  ].map((step, index) => {
                    const isActive = currentStep === step.key
                    const isCompleted = ['selection', 'menu', 'summary', 'confirmation'].indexOf(currentStep) > index
                    
                    return (
                      <div key={step.key} className="flex items-center">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                          ${isActive ? 'bg-white text-blue-600' : 
                            isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white/60'}
                        `}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`ml-2 text-sm font-medium ${isActive ? 'text-white' : 'text-white/60'}`}>
                          {step.label}
                        </span>
                        {index < 3 && (
                          <div className={`w-8 h-px mx-4 ${isCompleted ? 'bg-emerald-400' : 'bg-white/20'}`} />
                        )}
                      </div>
                    )
                  })}
                </motion.div>
              </CardHeader>
            </div>

            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Student Selection */}
                {currentStep === 'selection' && (
                  <motion.div
                    key="selection"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    {/* Info card */}
                    <motion.div
                      variants={itemVariants}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <Info className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">¿Cómo funciona?</h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            Selecciona los estudiantes para los que deseas hacer pedidos. Luego podrás elegir 
                            los menús específicos para cada día de la semana.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Students list */}
                    <div className="space-y-4">
                      {mockStudents.map((student) => {
                        const isSelected = selectedStudents.includes(student.id)
                        const completionStatus = getStudentCompletionStatus(student.id)

                        return (
                          <motion.div
                            key={student.id}
                            variants={itemVariants}
                            className="group"
                          >
                            <Card className={`
                              transition-all duration-300 hover:shadow-xl border-2 rounded-2xl overflow-hidden cursor-pointer
                              ${isSelected 
                                ? completionStatus === 'completed'
                                  ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50'
                                  : 'border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                              }
                            `}>
                              <div
                                className="flex items-center justify-between p-6 transition-all duration-200 hover:bg-white/50"
                                onClick={() => toggleStudentSelection(student.id)}
                              >
                                <div className="flex items-center gap-4">
                                  {/* Custom checkbox */}
                                  <motion.div
                                    className={`
                                      w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer
                                      ${isSelected 
                                        ? 'bg-blue-600 border-blue-600' 
                                        : 'border-gray-300 hover:border-blue-400'
                                      }
                                    `}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <CheckCircle className="w-4 h-4 text-white" />
                                      </motion.div>
                                    )}
                                  </motion.div>

                                  {/* Student avatar */}
                                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {student.avatar}
                                  </div>

                                  {/* Student info */}
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                      {student.nombre}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                      {student.curso}° {student.letra} • {student.nivel}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {/* Status badge */}
                                  {isSelected && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.1 }}
                                    >
                                      <Badge 
                                        variant={completionStatus === 'completed' ? 'default' : 'secondary'}
                                        className={`
                                          flex items-center gap-1 font-medium
                                          ${completionStatus === 'completed' 
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                          }
                                        `}
                                      >
                                        {completionStatus === 'completed' ? (
                                          <>
                                            <CheckCircle className="w-3 h-3" />
                                            Menús seleccionados
                                          </>
                                        ) : (
                                          <>
                                            <Clock className="w-3 h-3" />
                                            Pendiente
                                          </>
                                        )}
                                      </Badge>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>

                    {/* Continue button */}
                    {selectedStudents.length > 0 && (
                      <motion.div
                        variants={itemVariants}
                        className="flex justify-center pt-8"
                      >
                        <Button 
                          onClick={() => setCurrentStep('menu')}
                          size="lg"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                        >
                          <span className="flex items-center gap-2">
                            Continuar a menús
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Menu Selection */}
                {currentStep === 'menu' && (
                  <motion.div
                    key="menu"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    {/* Student selector */}
                    <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                      {selectedStudents.map(studentId => {
                        const student = mockStudents.find(s => s.id === studentId)
                        if (!student) return null
                        
                        const isActive = currentStudentMenu === studentId
                        const hasSelections = selectedMenus[studentId] && Object.keys(selectedMenus[studentId]).length > 0
                        
                        return (
                          <Button
                            key={studentId}
                            variant={isActive ? "default" : "outline"}
                            onClick={() => setCurrentStudentMenu(studentId)}
                            className={`
                              relative px-4 py-2 rounded-xl transition-all duration-300
                              ${isActive 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'hover:bg-blue-50 hover:border-blue-300'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                {student.avatar.charAt(0)}
                              </div>
                              <span>{student.nombre.split(' ')[0]}</span>
                              {hasSelections && (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                          </Button>
                        )
                      })}
                    </motion.div>

                    {/* Menu selection for current student */}
                    {currentStudentMenu && (
                      <motion.div
                        variants={itemVariants}
                        className="space-y-6"
                      >
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Selecciona menús para {mockStudents.find(s => s.id === currentStudentMenu)?.nombre}
                          </h3>
                          <p className="text-gray-600">
                            Elige almuerzo y/o colación para cada día de la semana
                          </p>
                        </div>

                        {/* Week days */}
                        <div className="space-y-6">
                          {weekDays.map(day => (
                            <Card key={day.key} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden">
                              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 py-4">
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-5 h-5 text-blue-600" />
                                  <div>
                                    <CardTitle className="text-lg">{day.name}</CardTitle>
                                    <p className="text-sm text-gray-600">{day.date}</p>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-6 space-y-6">
                                {/* Almuerzo options */}
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <Utensils className="w-5 h-5 text-orange-600" />
                                    <h4 className="font-semibold text-gray-900">Almuerzo</h4>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {mockMenuOptions[day.key]?.almuerzo.map(option => {
                                      const isSelected = selectedMenus[currentStudentMenu]?.[day.key]?.almuerzo === option.id
                                      
                                      return (
                                        <motion.div
                                          key={option.id}
                                          whileHover={{ y: -2 }}
                                          className={`
                                            p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                                            ${isSelected 
                                              ? 'border-blue-500 bg-blue-50 shadow-lg' 
                                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                            }
                                          `}
                                          onClick={() => selectMenu(currentStudentMenu, day.key, 'almuerzo', option.id)}
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <h5 className="font-medium text-gray-900 text-sm">{option.nombre}</h5>
                                            <div className="flex items-center gap-1">
                                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                              <span className="text-xs text-gray-600">{option.rating}</span>
                                            </div>
                                          </div>
                                          <p className="text-xs text-gray-600 mb-3">{option.descripcion}</p>
                                          <div className="flex items-center justify-between">
                                            <span className="font-bold text-blue-600">${option.precio.toLocaleString()}</span>
                                            {isSelected && (
                                              <CheckCircle className="w-5 h-5 text-blue-600" />
                                            )}
                                          </div>
                                        </motion.div>
                                      )
                                    })}
                                  </div>
                                </div>

                                {/* Colación options */}
                                <div>
                                  <div className="flex items-center gap-2 mb-4">
                                    <Coffee className="w-5 h-5 text-purple-600" />
                                    <h4 className="font-semibold text-gray-900">Colación</h4>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {mockMenuOptions[day.key]?.colacion.map(option => {
                                      const isSelected = selectedMenus[currentStudentMenu]?.[day.key]?.colacion === option.id
                                      
                                      return (
                                        <motion.div
                                          key={option.id}
                                          whileHover={{ y: -2 }}
                                          className={`
                                            p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                                            ${isSelected 
                                              ? 'border-purple-500 bg-purple-50 shadow-lg' 
                                              : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                                            }
                                          `}
                                          onClick={() => selectMenu(currentStudentMenu, day.key, 'colacion', option.id)}
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <h5 className="font-medium text-gray-900 text-sm">{option.nombre}</h5>
                                            <div className="flex items-center gap-1">
                                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                              <span className="text-xs text-gray-600">{option.rating}</span>
                                            </div>
                                          </div>
                                          <p className="text-xs text-gray-600 mb-3">{option.descripcion}</p>
                                          <div className="flex items-center justify-between">
                                            <span className="font-bold text-purple-600">${option.precio.toLocaleString()}</span>
                                            {isSelected && (
                                              <CheckCircle className="w-5 h-5 text-purple-600" />
                                            )}
                                          </div>
                                        </motion.div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation buttons */}
                    <motion.div
                      variants={itemVariants}
                      className="flex justify-between pt-8"
                    >
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('selection')}
                        className="px-6 py-3 rounded-xl"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                      </Button>
                      
                      <Button
                        onClick={() => setCurrentStep('summary')}
                        disabled={Object.keys(selectedMenus).length === 0}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl"
                      >
                        Ver resumen
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 3: Summary */}
                {currentStep === 'summary' && (
                  <motion.div
                    key="summary"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants}>
                      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 rounded-2xl">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-2">Resumen del Pedido</h3>
                              <p className="text-gray-600">Revisa tu selección antes de confirmar</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total</p>
                              <p className="text-3xl font-bold text-emerald-600">${calculateTotal().toLocaleString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Order details */}
                    <motion.div variants={itemVariants} className="space-y-4">
                      {Object.entries(selectedMenus).map(([studentId, studentMenus]) => {
                        const student = mockStudents.find(s => s.id === studentId)
                        if (!student) return null

                        return (
                          <Card key={studentId} className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl">
                            <CardHeader className="pb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                  {student.avatar.charAt(0)}
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{student.nombre}</CardTitle>
                                  <p className="text-sm text-gray-600">{student.curso}° {student.letra}</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {Object.entries(studentMenus).map(([date, dayMenus]) => {
                                const dayInfo = weekDays.find(d => d.key === date)
                                if (!dayInfo) return null

                                return (
                                  <div key={date} className="bg-slate-50 rounded-xl p-4">
                                    <h5 className="font-medium text-gray-900 mb-2">{dayInfo.name} - {dayInfo.date}</h5>
                                    <div className="space-y-2">
                                      {dayMenus.almuerzo && (
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-gray-600">
                                            🍽️ {mockMenuOptions[date]?.almuerzo.find(opt => opt.id === dayMenus.almuerzo)?.nombre}
                                          </span>
                                          <span className="font-medium text-blue-600">
                                            ${mockMenuOptions[date]?.almuerzo.find(opt => opt.id === dayMenus.almuerzo)?.precio.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                      {dayMenus.colacion && (
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="text-gray-600">
                                            ☕ {mockMenuOptions[date]?.colacion.find(opt => opt.id === dayMenus.colacion)?.nombre}
                                          </span>
                                          <span className="font-medium text-purple-600">
                                            ${mockMenuOptions[date]?.colacion.find(opt => opt.id === dayMenus.colacion)?.precio.toLocaleString()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </motion.div>

                    {/* Navigation buttons */}
                    <motion.div
                      variants={itemVariants}
                      className="flex justify-between pt-8"
                    >
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('menu')}
                        className="px-6 py-3 rounded-xl"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Modificar
                      </Button>
                      
                      <Button
                        onClick={() => setCurrentStep('confirmation')}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 rounded-xl shadow-xl"
                      >
                        Confirmar Pedido
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 'confirmation' && (
                  <motion.div
                    key="confirmation"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="text-center space-y-6"
                  >
                    <motion.div variants={itemVariants}>
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Confirmado!</h3>
                      <p className="text-gray-600 mb-6">Tu pedido ha sido procesado exitosamente</p>
                      
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <p className="text-sm text-gray-600">Número de Pedido</p>
                            <p className="text-lg font-bold text-emerald-600">#PED-2024-001</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-lg font-bold text-emerald-600">${calculateTotal().toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex justify-center gap-4">
                      <Button
                        onClick={() => {
                          setCurrentStep('selection')
                          setSelectedStudents([])
                          setSelectedMenus({})
                          setCurrentStudentMenu(null)
                        }}
                        variant="outline"
                        className="px-6 py-3 rounded-xl"
                      >
                        Nuevo Pedido
                      </Button>
                      
                      <Button
                        onClick={() => window.location.href = '/dashboard'}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl"
                      >
                        Volver al Dashboard
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}