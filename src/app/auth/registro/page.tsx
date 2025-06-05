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

interface StudentFormData {
  name: string;
  grade: string;
  section: string;
  level: 'basica' | 'media';
  userType: 'estudiante' | 'funcionario';
  rut: string;
  dietaryRestrictions: string;
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
    fullName: "",
    phone: ""
  })
  const [students, setStudents] = useState<StudentFormData[]>([])
  const [currentStudent, setCurrentStudent] = useState<StudentFormData>({
    name: "",
    grade: "",
    section: "",
    level: "basica",
    userType: "estudiante",
    rut: "",
    dietaryRestrictions: ""
  })

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const handleStudentChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCurrentStudent(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const addStudent = () => {
    if (!currentStudent.name || !currentStudent.grade || !currentStudent.section) {
      toast({
        variant: "destructive",
        title: "Datos incompletos",
        description: "Por favor complete todos los campos obligatorios del estudiante.",
      })
      return
    }

    setStudents(prev => [...prev, { ...currentStudent }])
    setCurrentStudent({
      name: "",
      grade: "",
      section: "",
      level: "basica",
      userType: "estudiante",
      rut: "",
      dietaryRestrictions: ""
    })

    toast({
      title: "Estudiante agregado",
      description: `${currentStudent.name} ha sido agregado exitosamente.`,
    })
  }

  const removeStudent = (index: number) => {
    setStudents(prev => prev.filter((_, i) => i !== index))
  }

  const passwordValidation = {
    length: formData.password.length >= 6,
    match: formData.password === formData.confirmPassword && formData.confirmPassword !== "",
    hasContent: formData.password.length > 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const { email, password, confirmPassword, fullName, phone } = formData

      // Validaciones
      if (!email || !password || !confirmPassword || !fullName || !phone) {
        throw new Error("Por favor complete todos los campos obligatorios")
      }

      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }

      if (students.length === 0) {
        throw new Error("Debe agregar al menos un estudiante")
      }

      console.log("🚀 Iniciando registro...")

      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone
          }
        },
      })

      if (authError) {
        console.error("❌ Auth error:", authError)
        
        if (authError.message.includes("User already registered")) {
          throw new Error("Este correo electrónico ya está registrado.")
        } else if (authError.message.includes("Invalid email")) {
          throw new Error("El formato del correo electrónico no es válido.")
        } else {
          throw new Error(`Error de autenticación: ${authError.message}`)
        }
      }

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario")
      }

      console.log("✅ Usuario creado:", authData.user.id)

      // Esperar un momento para que el trigger cree el perfil
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Verificar que el perfil fue creado
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !userProfile) {
        console.error('❌ Error verificando perfil:', profileError)
        throw new Error("Error al crear el perfil de usuario")
      }

      console.log("✅ Perfil verificado:", userProfile)

      // Crear estudiantes
      const studentsToInsert = students.map(student => ({
        guardian_id: authData.user!.id,
        name: student.name,
        grade: student.grade,
        section: student.section,
        level: student.level,
        user_type: student.userType,
        rut: student.rut || null,
        dietary_restrictions: student.dietaryRestrictions || null,
        is_active: true
      }))

      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .insert(studentsToInsert)
        .select()

      if (studentsError) {
        console.error('❌ Error creando estudiantes:', studentsError)
        throw new Error(`Error al registrar los estudiantes: ${studentsError.message}`)
      }

      console.log("✅ Estudiantes creados:", studentsData)

      toast({
        title: "¡Registro exitoso!",
        description: `Tu cuenta ha sido creada con ${students.length} estudiante(s). Ahora puedes iniciar sesión.`,
      })

      router.push("/auth/login?message=registration_success")

    } catch (error: unknown) {
      console.error("❌ Error en el registro:", error)
      
      let errorMessage = "No se pudo completar el registro."
      
      if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        variant: "destructive",
        title: "Error en el registro",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white fixed inset-0 overflow-auto">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-xl bg-white/90 backdrop-blur-xl">
            <CardHeader className="space-y-4 pb-6 pt-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-600 to-blue-700 flex items-center justify-center shadow-xl">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Crear Cuenta
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Únete al Sistema Casino Escolar
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Datos del Apoderado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <User className="w-3 h-3 text-emerald-600" />
                      Nombre Completo *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange('fullName')}
                      placeholder="Juan Pérez González"
                      className="h-10 text-sm"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      placeholder="+56 9 1234 5678"
                      className="h-10 text-sm"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-600" />
                    Correo Electrónico *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="nombre@ejemplo.com"
                    className="h-10 text-sm"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Contraseñas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Contraseña *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange('password')}
                        placeholder="Mínimo 6 caracteres"
                        className="h-10 pr-10 text-sm"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-emerald-600" />
                      Confirmar Contraseña *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange('confirmPassword')}
                        placeholder="Repita su contraseña"
                        className="h-10 pr-10 text-sm"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                </div>

                {/* Agregar Estudiantes */}
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-emerald-600" />
                    Agregar Estudiantes *
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    <Input
                      placeholder="Nombre *"
                      value={currentStudent.name}
                      onChange={handleStudentChange('name')}
                      className="h-9 text-sm"
                      disabled={loading}
                    />
                    <Input
                      placeholder="Curso *"
                      value={currentStudent.grade}
                      onChange={handleStudentChange('grade')}
                      className="h-9 text-sm"
                      disabled={loading}
                    />
                    <Input
                      placeholder="Sección *"
                      value={currentStudent.section}
                      onChange={handleStudentChange('section')}
                      className="h-9 text-sm"
                      disabled={loading}
                    />
                    <select
                      value={currentStudent.level}
                      onChange={handleStudentChange('level')}
                      className="h-9 text-sm border-2 border-gray-200 rounded-lg bg-white"
                      disabled={loading}
                    >
                      <option value="basica">Básica</option>
                      <option value="media">Media</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      placeholder="RUT (opcional)"
                      value={currentStudent.rut}
                      onChange={handleStudentChange('rut')}
                      className="h-9 text-sm"
                      disabled={loading}
                    />
                    <select
                      value={currentStudent.userType}
                      onChange={handleStudentChange('userType')}
                      className="h-9 text-sm border-2 border-gray-200 rounded-lg bg-white"
                      disabled={loading}
                    >
                      <option value="estudiante">Estudiante</option>
                      <option value="funcionario">Funcionario</option>
                    </select>
                    <Input
                      placeholder="Restricciones alimentarias"
                      value={currentStudent.dietaryRestrictions}
                      onChange={handleStudentChange('dietaryRestrictions')}
                      className="h-9 text-sm"
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={addStudent}
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-xs"
                    disabled={loading}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Agregar Estudiante
                  </Button>

                  {/* Lista de Estudiantes */}
                  <AnimatePresence>
                    {students.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 max-h-40 overflow-y-auto"
                      >
                        {students.map((student, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                          >
                            <div className="flex-1">
                              <span className="text-sm font-medium text-emerald-800">
                                {student.name} - {student.grade}{student.section} ({student.level})
                              </span>
                              <div className="text-xs text-emerald-600 mt-1">
                                {student.userType} {student.rut && `• RUT: ${student.rut}`}
                                {student.dietaryRestrictions && ` • ${student.dietaryRestrictions}`}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeStudent(index)}
                              className="text-red-500 hover:text-red-700 transition-colors ml-2"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-10 bg-gradient-to-r from-emerald-600 to-blue-700 hover:from-emerald-700 hover:to-blue-800 text-white font-semibold rounded-xl text-sm"
                    disabled={loading || !passwordValidation.length || !passwordValidation.match || students.length === 0}
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
                </div>

                {/* Login Link */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-emerald-600 hover:text-blue-600 transition-colors duration-300 hover:underline"
                    >
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
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