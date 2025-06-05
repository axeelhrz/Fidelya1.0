"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  UserPlus, 
  Loader2, 
  Sparkles, 
  Shield,
  CheckCircle,
  AlertCircle,
  Phone,
  Plus,
  Trash2,
  User,
  GraduationCap
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase/client"
import type { Hijo } from "@/lib/supabase/types"

interface FormData {
  email: string
  password: string
  confirmPassword: string
  nombreApoderado: string
  telefono: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
}

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    nombreApoderado: "",
    telefono: ""
  })
  
  const [hijos, setHijos] = useState<Hijo[]>([])
  const [currentHijo, setCurrentHijo] = useState<Omit<Hijo, 'id'>>({
    nombre: "",
    curso: "",
    letra: "",
    nivel: "",
    tipo: "Estudiante"
  })
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleHijoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentHijo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addHijo = () => {
    if (!currentHijo.nombre || !currentHijo.curso || !currentHijo.letra || !currentHijo.nivel) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description: "Por favor completa todos los campos del hijo/a."
      })
      return
    }

    const newHijo: Hijo = {
      ...currentHijo,
      id: Date.now().toString()
    }

    setHijos(prev => [...prev, newHijo])
    setCurrentHijo({
      nombre: "",
      curso: "",
      letra: "",
      nivel: "",
      tipo: "Estudiante"
    })

    toast({
      title: "Hijo/a agregado",
      description: `${newHijo.nombre} ha sido agregado a la lista.`
    })
  }

  const removeHijo = (id: string) => {
    setHijos(prev => prev.filter(hijo => hijo.id !== id))
    toast({
      title: "Hijo/a eliminado",
      description: "El hijo/a ha sido eliminado de la lista."
    })
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  // Password validation
  const passwordValidation = {
    length: formData.password.length >= 6,
    match: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.nombreApoderado) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios."
      })
      return
    }

    if (!passwordValidation.length) {
      toast({
        variant: "destructive",
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres."
      })
      return
    }

    if (!passwordValidation.match) {
      toast({
        variant: "destructive",
        title: "Contraseñas no coinciden",
        description: "Las contraseñas ingresadas no coinciden."
      })
      return
    }

    if (hijos.length === 0) {
      toast({
        variant: "destructive",
        title: "Debe agregar al menos un hijo/a",
        description: "Es necesario agregar al menos un hijo/a para continuar."
      })
      return
    }

    setLoading(true)

    try {
      console.log('Iniciando proceso de registro...')
      
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.nombreApoderado,
            phone: formData.telefono
          }
        }
      })

      if (authError) {
        console.error('Error en autenticación:', authError)
        throw new Error(`Error de autenticación: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('No se pudo crear el usuario')
      }

      console.log('Usuario creado en Auth:', authData.user.id)

      // 2. Wait a moment for auth to settle
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 3. Create client profile in database
      const clientData = {
        user_id: authData.user.id,
        correo_apoderado: formData.email,
        nombre_apoderado: formData.nombreApoderado,
        telefono: formData.telefono || null,
        hijos: hijos,
        rol: 'user' as const,
        is_active: true
      }

      console.log('Insertando datos del cliente:', clientData)

      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .insert(clientData)
        .select()
        .single()

      if (clienteError) {
        console.error('Error al crear perfil del cliente:', clienteError)
        
        // If client creation fails, try to clean up the auth user
        try {
          await supabase.auth.admin.deleteUser(authData.user.id)
        } catch (cleanupError) {
          console.error('Error al limpiar usuario de auth:', cleanupError)
        }
        
        // Provide more specific error messages
        if (clienteError.code === '23505') {
          throw new Error('Ya existe una cuenta con este correo electrónico')
        } else if (clienteError.code === '42501') {
          throw new Error('Error de permisos. Por favor intenta nuevamente')
        } else {
          throw new Error(`Error al crear el perfil del cliente: ${clienteError.message}`)
        }
      }

      console.log('Cliente creado exitosamente:', clienteData)

      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada. Por favor verifica tu correo electrónico."
      })

      // Redirect to login page
      router.push('/auth/login?message=Registro exitoso. Por favor inicia sesión.')

    } catch (error: any) {
      console.error('Error en el registro:', error)
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: error.message || "Ocurrió un error durante el registro. Por favor intenta nuevamente."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <motion.div
        className="w-full max-w-2xl relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={logoVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema Casino Escolar</h1>
          <p className="text-gray-600">Crea tu cuenta para gestionar los pedidos de tus hijos</p>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <UserPlus className="w-6 h-6 text-blue-600" />
                Registro de Apoderado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Información Personal
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombreApoderado">Nombre Completo *</Label>
                      <Input
                        id="nombreApoderado"
                        name="nombreApoderado"
                        type="text"
                        placeholder="Ingresa tu nombre completo"
                        value={formData.nombreApoderado}
                        onChange={handleInputChange}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="telefono"
                          name="telefono"
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Account Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Información de Cuenta
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="tu@correo.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Contraseña *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="flex items-center gap-2 text-sm">
                            {passwordValidation.length ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={passwordValidation.length ? "text-green-600" : "text-red-600"}>
                              Mínimo 6 caracteres
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repite tu contraseña"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formData.confirmPassword && (
                          <div className="flex items-center gap-2 text-sm">
                            {passwordValidation.match ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className={passwordValidation.match ? "text-green-600" : "text-red-600"}>
                              Las contraseñas coinciden
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Children Information */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    Información de Hijos/as
                  </h3>
                  
                  {/* Add Child Form */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          type="text"
                          placeholder="Nombre del hijo/a"
                          value={currentHijo.nombre}
                          onChange={handleHijoChange}
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="curso">Curso</Label>
                        <Input
                          id="curso"
                          name="curso"
                          type="text"
                          placeholder="Ej: 1°, 2°, 3°"
                          value={currentHijo.curso}
                          onChange={handleHijoChange}
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="letra">Letra</Label>
                        <Input
                          id="letra"
                          name="letra"
                          type="text"
                          placeholder="Ej: A, B, C"
                          value={currentHijo.letra}
                          onChange={handleHijoChange}
                          className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nivel">Nivel</Label>
                        <select
                          id="nivel"
                          name="nivel"
                          value={currentHijo.nivel}
                          onChange={handleHijoChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Básica">Básica</option>
                          <option value="Media">Media</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={addHijo}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar Hijo/a
                      </Button>
                    </div>
                  </div>

                  {/* Children List */}
                  {hijos.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Hijos/as agregados:</h4>
                      <div className="space-y-2">
                        {hijos.map((hijo) => (
                          <div
                            key={hijo.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{hijo.nombre}</p>
                                <p className="text-sm text-gray-500">
                                  {hijo.curso}° {hijo.letra} - {hijo.nivel}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => removeHijo(hijo.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Crear Cuenta
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Login Link */}
                <motion.div variants={itemVariants} className="text-center">
                  <p className="text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Creando tu cuenta</h3>
            <p className="text-gray-600">Por favor espera mientras procesamos tu registro...</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}