"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
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

interface Hijo {
  id: string
  nombre: string
  curso: string
  letra: string
  nivel: string
  tipo: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombreApoderado: "",
    telefono: ""
  })
  const [hijos, setHijos] = useState<Hijo[]>([])
  const [currentHijo, setCurrentHijo] = useState({
    nombre: "",
    curso: "",
    letra: "",
    nivel: "Básica",
    tipo: "Estudiante"
  })

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleHijoChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentHijo(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const addHijo = () => {
    if (!currentHijo.nombre || !currentHijo.curso || !currentHijo.letra) {
      toast({
        variant: "destructive",
        title: "Datos incompletos",
        description: "Por favor complete todos los campos del hijo.",
      })
      return
    }

    const newHijo: Hijo = {
      id: Date.now().toString(),
      ...currentHijo
    }

    setHijos(prev => [...prev, newHijo])
    setCurrentHijo({
      nombre: "",
      curso: "",
      letra: "",
      nivel: "Básica",
      tipo: "Estudiante"
    })

    toast({
      title: "Hijo agregado",
      description: `${newHijo.nombre} ha sido agregado exitosamente.`,
    })
  }

  const removeHijo = (id: string) => {
    setHijos(prev => prev.filter(hijo => hijo.id !== id))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  // Password validation
  const passwordValidation = {
    length: formData.password.length >= 6,
    match: formData.password === formData.confirmPassword && formData.confirmPassword !== "",
    hasContent: formData.password.length > 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const { email, password, confirmPassword, nombreApoderado, telefono } = formData

      if (!email || !password || !confirmPassword || !nombreApoderado || !telefono) {
        throw new Error("Por favor complete todos los campos")
      }

      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }

      if (hijos.length === 0) {
        throw new Error("Debe agregar al menos un hijo")
      }

      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      // 2. Crear registro en la tabla clientes
      const hijosData = hijos.map(hijo => ({
        nombre: hijo.nombre,
        curso: hijo.curso,
        letra: hijo.letra,
        nivel: hijo.nivel,
        tipo: hijo.tipo
      }))

      const { error: clienteError } = await supabase
        .from('clientes')
        .insert({
          correo_apoderado: email,
          nombre_apoderado: nombreApoderado,
          telefono: telefono,
          hijos: hijosData
        })

      if (clienteError) {
        console.error('Error creating client:', clienteError)
        // Si falla la creación del cliente, eliminar el usuario de auth
        if (authData.user) {
          await supabase.auth.admin.deleteUser(authData.user.id)
        }
        throw new Error("Error al crear el perfil del cliente")
      }

      toast({
        title: "Registro exitoso",
        description: "Se ha enviado un correo de confirmación a tu email.",
      })

      router.push("/auth/login")
    } catch (error: any) {
      console.error("Error signing up:", error)
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: error?.message || "No se pudo completar el registro. Inténtelo nuevamente.",
      })
    } finally {
      setLoading(false)
    }
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
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -90 },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden fixed inset-0">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #10b981 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-r from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-200/15 to-cyan-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-xl">
              {/* Card Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-blue-500/15 to-emerald-500/15 rounded-xl blur-sm" />
              <div className="absolute inset-[1px] bg-white rounded-xl" />
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />

              <div className="relative z-10">
                <CardHeader className="space-y-4 pb-6 pt-8">
                  {/* Logo Section */}
                  <motion.div 
                    className="flex justify-center"
                    variants={logoVariants}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-700 flex items-center justify-center shadow-xl relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.05,
                          rotate: 5,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <div className="absolute inset-1 bg-gradient-to-br from-emerald-400/50 to-blue-400/50 rounded-lg blur-sm" />
                        <UserPlus className="w-8 h-8 text-white relative z-10" />
                        
                        <motion.div
                          className="absolute top-1 right-1"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5
                          }}
                        >
                          <Sparkles className="w-2 h-2 text-white/80" />
                        </motion.div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Title Section */}
                  <div className="text-center space-y-2">
                    <motion.div variants={itemVariants}>
                      <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-800 bg-clip-text text-transparent">
                        Crear Cuenta
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription className="text-sm font-medium text-gray-600">
                        Únete al Sistema Casino Escolar
                      </CardDescription>
                    </motion.div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 px-6 pb-8">
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-4"
                    variants={containerVariants}
                  >
                    {/* Datos del Apoderado */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Nombre Apoderado */}
                      <div className="space-y-2">
                        <Label htmlFor="nombreApoderado" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <User className="w-3 h-3 text-emerald-600" />
                          Nombre Completo
                        </Label>
                        <Input
                          id="nombreApoderado"
                          type="text"
                          value={formData.nombreApoderado}
                          onChange={handleInputChange('nombreApoderado')}
                          placeholder="Juan Pérez"
                          className="h-10 text-sm border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                          required
                          disabled={loading}
                        />
                      </div>

                      {/* Teléfono */}
                      <div className="space-y-2">
                        <Label htmlFor="telefono" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          Teléfono
                        </Label>
                        <Input
                          id="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleInputChange('telefono')}
                          placeholder="+56 9 1234 5678"
                          className="h-10 text-sm border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                          required
                          disabled={loading}
                        />
                      </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div variants={itemVariants} className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-emerald-600" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        placeholder="nombre@ejemplo.com"
                        className="h-10 text-sm border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                        required
                        disabled={loading}
                      />
                    </motion.div>

                    {/* Contraseñas */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-600" />
                          Contraseña
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            placeholder="Mínimo 6 caracteres"
                            className="h-10 pr-10 text-sm border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {passwordValidation.hasContent && (
                          <div className="flex items-center gap-1 text-xs">
                            {passwordValidation.length ? (
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-amber-500" />
                            )}
                            <span className={passwordValidation.length ? "text-emerald-600" : "text-amber-600"}>
                              Mínimo 6 caracteres
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-emerald-600" />
                          Confirmar Contraseña
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            placeholder="Repita su contraseña"
                            className="h-10 pr-10 text-sm border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                            required
                            disabled={loading}
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={loading}
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {formData.confirmPassword.length > 0 && (
                          <div className="flex items-center gap-1 text-xs">
                            {passwordValidation.match ? (
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className={passwordValidation.match ? "text-emerald-600" : "text-red-600"}>
                              {passwordValidation.match ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Agregar Hijos */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-emerald-600" />
                        Agregar Hijos
                      </Label>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Input
                          placeholder="Nombre"
                          value={currentHijo.nombre}
                          onChange={handleHijoChange('nombre')}
                          className="h-9 text-sm border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                          disabled={loading}
                        />
                        <Input
                          placeholder="Curso"
                          value={currentHijo.curso}
                          onChange={handleHijoChange('curso')}
                          className="h-9 text-sm border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                          disabled={loading}
                        />
                        <Input
                          placeholder="Letra"
                          value={currentHijo.letra}
                          onChange={handleHijoChange('letra')}
                          className="h-9 text-sm border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                          disabled={loading}
                        />
                        <select
                          value={currentHijo.nivel}
                          onChange={handleHijoChange('nivel')}
                          className="h-9 text-sm border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 bg-white"
                          disabled={loading}
                        >
                          <option value="Básica">Básica</option>
                          <option value="Media">Media</option>
                        </select>
                      </div>

                      <Button
                        type="button"
                        onClick={addHijo}
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300"
                        disabled={loading}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Agregar Hijo
                      </Button>

                      {/* Lista de Hijos */}
                      <AnimatePresence>
                        {hijos.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2 max-h-32 overflow-y-auto"
                          >
                            {hijos.map((hijo) => (
                              <motion.div
                                key={hijo.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg border border-emerald-200"
                              >
                                <span className="text-xs font-medium text-emerald-800">
                                  {hijo.nombre} - {hijo.curso}{hijo.letra} ({hijo.nivel})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeHijo(hijo.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  disabled={loading}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="pt-2">
                      <Button
                        type="submit"
                        className="w-full h-10 bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        disabled={loading || !passwordValidation.length || !passwordValidation.match || hijos.length === 0}
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Registrando...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <UserPlus className="w-4 h-4" />
                            <span>Crear Cuenta</span>
                          </div>
                        )}
                      </Button>
                    </motion.div>

                    {/* Login Link */}
                    <motion.div variants={itemVariants} className="text-center pt-2">
                      <p className="text-xs text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                          href="/auth/login"
                          className="font-semibold text-emerald-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                        >
                          Inicia sesión
                        </Link>
                      </p>
                    </motion.div>
                  </motion.form>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4 shadow-xl border border-gray-100"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-200 rounded-full animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-gray-700">Creando tu cuenta</p>
              <p className="text-sm text-gray-500">Guardando información...</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}