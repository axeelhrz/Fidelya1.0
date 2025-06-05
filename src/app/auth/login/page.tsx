"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2, Sparkles, Shield } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  // Show success message if coming from registration
  useEffect(() => {
    const message = searchParams.get('message')
    if (message === 'registration_success') {
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
        variant: "default",
      })
    }
  }, [searchParams, toast])

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const { email, password } = formData

      if (!email || !password) {
        throw new Error("Por favor complete todos los campos")
      }

      console.log("Attempting login for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        
        // Provide more specific error messages
        let errorMessage = "Error de autenticación"
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciales inválidas. Verifique su email y contraseña."
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Por favor confirme su email antes de iniciar sesión."
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Demasiados intentos. Espere unos minutos antes de intentar nuevamente."
        }
        
        throw new Error(errorMessage)
      }

      if (!data.user) {
        throw new Error("No se pudo autenticar el usuario")
      }

      console.log("Login successful for user:", data.user.id)

      // Update last login
      try {
        await supabase.rpc('update_last_login', { user_email: email })
      } catch (updateError) {
        console.warn("Could not update last login:", updateError)
        // Don't fail the login for this
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta al Sistema Casino Escolar.",
      })

      // Redirect based on user role/email
      if (email.toLowerCase() === "c.wevarh@gmail.com") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error: unknown) {
      console.error("Error signing in:", error)
      const errorMessage = error instanceof Error ? error.message : "No se pudo iniciar sesión. Verifique sus credenciales."
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: errorMessage,
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
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
      rotateX: 15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, x: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.3, rotate: -180 },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: 0,
      transition: { 
        duration: 1,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  }

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.5, 0.2]
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-white relative overflow-hidden fixed inset-0">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #3b82f6 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/10 to-purple-100/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardVariants}>
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
              {/* Card Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-sm" />
              <div className="absolute inset-[1px] bg-white rounded-xl" />
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />

              <div className="relative z-10">
                <CardHeader className="space-y-8 pb-8 pt-12">
                  {/* Logo Section */}
                  <motion.div 
                    className="flex justify-center"
                    variants={logoVariants}
                  >
                    <div className="relative">
                      <motion.div
                        className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center shadow-2xl relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.05,
                          rotate: 5,
                          transition: { duration: 0.3 }
                        }}
                      >
                        {/* Inner glow */}
                        <div className="absolute inset-2 bg-gradient-to-br from-blue-400/50 to-purple-400/50 rounded-xl blur-sm" />
                        <Shield className="w-12 h-12 text-white relative z-10" />
                        
                        {/* Sparkle effects */}
                        <motion.div
                          className="absolute top-2 right-2"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: 0.5
                          }}
                        >
                          <Sparkles className="w-3 h-3 text-white/80" />
                        </motion.div>
                        <motion.div
                          className="absolute bottom-2 left-2"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: 1
                          }}
                        >
                          <Sparkles className="w-2 h-2 text-white/60" />
                        </motion.div>
                      </motion.div>
                      
                      {/* Outer ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-blue-400/30 to-purple-400/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </motion.div>

                  {/* Title Section */}
                  <div className="text-center space-y-3">
                    <motion.div variants={itemVariants}>
                      <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                        Bienvenido
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription className="text-lg font-medium text-gray-600">
                        Sistema Casino Escolar
                      </CardDescription>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto" />
                    </motion.div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-8 px-8 pb-12">
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    variants={containerVariants}
                  >
                    {/* Email Field */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Correo Electrónico
                      </Label>
                      <div className="relative group">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          placeholder="nombre@ejemplo.com"
                          className="h-14 pl-12 pr-4 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-gray-300 hover:shadow-lg bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                          required
                          disabled={loading}
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-600" />
                        
                        {/* Input glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>

                    {/* Password Field */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-600" />
                        Contraseña
                      </Label>
                      <div className="relative group">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange('password')}
                          placeholder="••••••••"
                          className="h-14 pl-12 pr-14 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-gray-300 hover:shadow-lg bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                          required
                          disabled={loading}
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-600" />
                        <motion.button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                          disabled={loading}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </motion.button>
                        
                        {/* Input glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                          disabled={loading}
                        >
                          {/* Button shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer" />
                          
                          {loading ? (
                            <div className="flex items-center space-x-3 relative z-10">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Iniciando sesión...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3 relative z-10">
                              <LogIn className="w-5 h-5" />
                              <span>Iniciar Sesión</span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Register Link */}
                    <motion.div variants={itemVariants} className="text-center pt-4">
                      <p className="text-sm text-gray-600">
                        ¿No tienes una cuenta?{" "}
                        <Link
                          href="/auth/registro"
                          className="font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-300 hover:underline relative"
                        >
                          Regístrate aquí
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
            className="bg-white rounded-3xl p-12 flex flex-col items-center space-y-6 shadow-2xl border border-gray-100"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-gray-700">Verificando credenciales</p>
              <p className="text-sm text-gray-500">Por favor espere un momento...</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
