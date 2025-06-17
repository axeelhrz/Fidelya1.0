"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2,
  GraduationCap,
  Calendar,
  Users,
  Shield,
  Star,
  Award,
  BookOpen,
  Heart,
  Settings,
  Briefcase,
  UserCheck,
  Baby
} from "lucide-react"

// Interfaces
interface Estudiante {
  id: string;
  nombre: string;
  curso: string;
  letra: string;
  nivel: string;
  userType: 'estudiante' | 'funcionario';
  fechaNacimiento: string;
  activo: boolean;
}

interface Estadisticas {
  pedidosRealizados: number;
  montoTotal: number;
  calificacionPromedio: number;
  estudiantesActivos: number;
  funcionariosActivos?: number;
}

interface UserData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  fechaRegistro: string;
  rol: string;
  isStaff: boolean;
  estudiantes: Estudiante[];
  estadisticas: Estadisticas;
}

// Mock data estructurado con funcionarios y estudiantes
const mockUserData: UserData = {
  id: '1',
  nombre: 'María Elena Rodríguez',
  email: 'maria.rodriguez@email.com',
  telefono: '+56 9 8765 4321',
  direccion: 'Av. Las Condes 1234, Las Condes, Santiago',
  fechaRegistro: '2024-01-15',
  rol: 'Apoderado',
  isStaff: true, // Es funcionario
  estudiantes: [
    {
      id: 'est-1',
      nombre: 'Ana Sofía Rodríguez',
      curso: '5',
      letra: 'A',
      nivel: 'Básica',
      userType: 'estudiante',
      fechaNacimiento: '2014-03-15',
      activo: true
    },
    {
      id: 'est-2',
      nombre: 'Carlos Andrés Rodríguez',
      curso: '3',
      letra: 'B',
      nivel: 'Básica',
      userType: 'estudiante',
      fechaNacimiento: '2016-08-22',
      activo: true
    },
    {
      id: 'func-1',
      nombre: 'María Elena Rodríguez',
      curso: 'Secretaría',
      letra: 'Administrativa',
      nivel: 'Básica',
      userType: 'funcionario',
      fechaNacimiento: '1985-05-10',
      activo: true
    }
  ],
  estadisticas: {
    pedidosRealizados: 47,
    montoTotal: 234500,
    calificacionPromedio: 4.8,
    estudiantesActivos: 2,
    funcionariosActivos: 1
  }
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
    }
  }
}

function ProfileHeader({ userData }: { userData: UserData }) {
  return (
    <motion.div
      variants={animations.card}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
      
      <div className="relative z-10 p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl">
            {userData.isStaff ? (
              <Briefcase className="w-12 h-12 text-white" />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{userData.nombre}</h1>
            <div className="flex items-center gap-4 text-blue-100">
              <Badge className="bg-white/20 text-white border-white/30">
                <Shield className="w-3 h-3 mr-1" />
                {userData.rol}
              </Badge>
              {userData.isStaff && (
                <Badge className="bg-emerald-500/80 text-white border-emerald-400/50">
                  <Briefcase className="w-3 h-3 mr-1" />
                  Funcionario
                </Badge>
              )}
              <span className="text-sm">
                Miembro desde {new Date(userData.fechaRegistro).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-xl font-bold">{userData.estadisticas.calificacionPromedio}</span>
            </div>
            <p className="text-sm text-blue-100">Calificación promedio</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function StatsCards({ stats, isStaff }: { stats: Estadisticas, isStaff: boolean }) {
  const statsData = [
    {
      icon: BookOpen,
      label: 'Pedidos realizados',
      value: stats.pedidosRealizados,
      color: 'from-blue-500 to-blue-600',
      suffix: ''
    },
    {
      icon: Heart,
      label: 'Monto total',
      value: `$${stats.montoTotal.toLocaleString()}`,
      color: 'from-emerald-500 to-emerald-600',
      suffix: ''
    },
    {
      icon: Users,
      label: isStaff ? 'Estudiantes activos' : 'Estudiantes',
      value: stats.estudiantesActivos,
      color: 'from-purple-500 to-purple-600',
      suffix: ''
    },
    ...(isStaff ? [{
      icon: Briefcase,
      label: 'Como funcionario',
      value: stats.funcionariosActivos || 0,
      color: 'from-orange-500 to-red-500',
      suffix: ''
    }] : []),
    {
      icon: Award,
      label: 'Calificación',
      value: stats.calificacionPromedio,
      color: 'from-yellow-500 to-orange-500',
      suffix: '/5'
    }
  ]

  return (
    <motion.div
      variants={animations.container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statsData.map((stat) => (
        <motion.div key={stat.label} variants={animations.item}>
          <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-6 text-center">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}{stat.suffix}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

function PersonalInfoCard({ userData, isEditing, onEdit, onSave, onCancel }: {
  userData: UserData,
  isEditing: boolean,
  onEdit: () => void,
  onSave: () => void,
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(userData)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev: UserData) => ({ ...prev, [field]: value }))
  }

  return (
    <motion.div variants={animations.item}>
      <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Información Personal
            </CardTitle>
            <p className="text-gray-600 mt-1">Datos de contacto y personales</p>
          </div>
          <Button
            variant={isEditing ? "destructive" : "outline"}
            size="sm"
            onClick={isEditing ? onCancel : onEdit}
            className="rounded-xl"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="isStaff"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={formData.isStaff || false}
                    onChange={(e) => handleInputChange('isStaff', e.target.checked)}
                  />
                  <Label htmlFor="isStaff" className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Soy funcionario del colegio
                  </Label>
                </div>
                <div className="flex justify-end">
                  <Button onClick={onSave} className="rounded-xl">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar cambios
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viewing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-900">{userData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Teléfono</p>
                      <p className="text-gray-900">{userData.telefono}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Dirección</p>
                    <p className="text-gray-900">{userData.direccion}</p>
                  </div>
                </div>
                {userData.isStaff && (
                  <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tipo de usuario</p>
                      <p className="text-gray-900 font-medium">Funcionario del colegio</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function StudentsCard({ estudiantes, isStaff }: { estudiantes: Estudiante[], isStaff: boolean }) {
  const [students, setStudents] = useState(estudiantes)
  const [isEditing, setIsEditing] = useState(false)

  const addStudent = () => {
    const newStudent: Estudiante = {
      id: `est-${Date.now()}`,
      nombre: '',
      curso: '',
      letra: '',
      nivel: 'Básica',
      userType: 'estudiante' as const,
      fechaNacimiento: '',
      activo: true
    }
    setStudents([...students, newStudent])
    setIsEditing(true)
  }

  const addStaffMember = () => {
    const newStaff: Estudiante = {
      id: `func-${Date.now()}`,
      nombre: '',
      curso: '',
      letra: '',
      nivel: 'Básica',
      userType: 'funcionario' as const,
      fechaNacimiento: '',
      activo: true
    }
    setStudents([...students, newStaff])
    setIsEditing(true)
  }

  const removeStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id))
  }

  const updateStudent = (id: string, field: string, value: string) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, [field]: value } : student
    ))
  }

  const studentCount = students.filter(s => s.userType === 'estudiante').length
  const staffCount = students.filter(s => s.userType === 'funcionario').length

  return (
    <motion.div variants={animations.item}>
      <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Gestión de Usuarios ({students.length})
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Baby className="w-4 h-4 text-blue-500" />
                <span>{studentCount} estudiantes</span>
              </div>
              {isStaff && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 text-orange-500" />
                  <span>{staffCount} funcionarios</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addStudent}
              className="rounded-xl"
              title="Agregar estudiante (hijo)"
            >
              <Baby className="w-4 h-4 mr-1" />
              <Plus className="w-4 h-4" />
            </Button>
            {isStaff && (
              <Button
                variant="outline"
                size="sm"
                onClick={addStaffMember}
                className="rounded-xl bg-orange-50 hover:bg-orange-100 border-orange-200"
                title="Agregarse como funcionario"
              >
                <Briefcase className="w-4 h-4 mr-1" />
                <Plus className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant={isEditing ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-xl"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {students.map((student, index) => {
              const isStaffMember = student.userType === 'funcionario'
              
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-2xl border ${
                    isStaffMember 
                      ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' 
                      : 'bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        isStaffMember 
                          ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-600'
                      }`}>
                        {isStaffMember ? (
                          <Briefcase className="w-6 h-6" />
                        ) : (
                          student.nombre ? student.nombre.charAt(0).toUpperCase() : index + 1
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {student.nombre || (isStaffMember ? 'Funcionario' : `Estudiante ${index + 1}`)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              isStaffMember 
                                ? 'bg-orange-100 text-orange-700 border-orange-300' 
                                : 'bg-blue-100 text-blue-700 border-blue-300'
                            }`}
                          >
                            {isStaffMember ? (
                              <>
                                <Briefcase className="w-3 h-3 mr-1" />
                                {student.curso} - {student.letra}
                              </>
                            ) : (
                              <>
                                <GraduationCap className="w-3 h-3 mr-1" />
                                {student.curso}° {student.letra} - {student.nivel}
                              </>
                            )}
                          </Badge>
                          {student.activo && (
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                              Activo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {isEditing && students.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeStudent(student.id)}
                        className="rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor={`nombre-${student.id}`}>Nombre</Label>
                          <Input
                            id={`nombre-${student.id}`}
                            value={student.nombre}
                            onChange={(e) => updateStudent(student.id, 'nombre', e.target.value)}
                            className="rounded-xl"
                            placeholder={isStaffMember ? "Nombre del funcionario" : "Nombre completo"}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`curso-${student.id}`}>
                            {isStaffMember ? 'Área/Departamento' : 'Curso'}
                          </Label>
                          <Input
                            id={`curso-${student.id}`}
                            value={student.curso}
                            onChange={(e) => updateStudent(student.id, 'curso', e.target.value)}
                            className="rounded-xl"
                            placeholder={isStaffMember ? "Ej: Secretaría, Biblioteca" : "1-12"}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`letra-${student.id}`}>
                            {isStaffMember ? 'Cargo/Función' : 'Letra'}
                          </Label>
                          <Input
                            id={`letra-${student.id}`}
                            value={student.letra}
                            onChange={(e) => updateStudent(student.id, 'letra', e.target.value)}
                            className="rounded-xl"
                            placeholder={isStaffMember ? "Ej: Administrativa, Docente" : "A, B, C..."}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`fecha-${student.id}`}>Fecha Nacimiento</Label>
                          <Input
                            id={`fecha-${student.id}`}
                            type="date"
                            value={student.fechaNacimiento}
                            onChange={(e) => updateStudent(student.id, 'fechaNacimiento', e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                      
                      {isStaffMember && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm text-amber-800">
                            <strong>Funcionario:</strong> Este usuario tendrá acceso a precios especiales para personal del colegio.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Nacimiento: {new Date(student.fechaNacimiento).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isStaffMember ? (
                          <Briefcase className="w-4 h-4 text-gray-500" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-600">
                          {isStaffMember ? 'Área:' : 'Nivel:'} {student.nivel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isStaffMember ? (
                          <UserCheck className="w-4 h-4 text-gray-500" />
                        ) : (
                          <GraduationCap className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-600">
                          {isStaffMember ? 'Cargo:' : 'Curso:'} {student.curso} {student.letra}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end pt-4"
            >
              <Button onClick={() => setIsEditing(false)} className="rounded-xl">
                <Save className="w-4 h-4 mr-2" />
                Guardar cambios
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false)
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleSavePersonal = () => {
    // Aquí iría la lógica para guardar
    setIsEditingPersonal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="bg-white/90 backdrop-blur-xl border-white/30 shadow-xl rounded-3xl overflow-hidden">
            <ProfileHeader userData={mockUserData} />
          </Card>
        </motion.div>

        {/* Stats */}
        <StatsCards stats={mockUserData.estadisticas} isStaff={mockUserData.isStaff} />

        {/* Main content */}
        <motion.div
          variants={animations.container}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Personal info */}
          <PersonalInfoCard
            userData={mockUserData}
            isEditing={isEditingPersonal}
            onEdit={() => setIsEditingPersonal(true)}
            onSave={handleSavePersonal}
            onCancel={() => setIsEditingPersonal(false)}
          />

          {/* Students and Staff */}
          <StudentsCard estudiantes={mockUserData.estudiantes} isStaff={mockUserData.isStaff} />

          {/* Quick actions */}
          <motion.div variants={animations.item}>
            <Card className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-blue-200 rounded-2xl shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Acciones Rápidas</h3>
                    <p className="text-gray-600">Gestiona tu cuenta y configuraciones</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl">
                      <Settings className="w-4 h-4 mr-2" />
                      Configuración
                    </Button>
                    <Button className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Nuevo Pedido
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}