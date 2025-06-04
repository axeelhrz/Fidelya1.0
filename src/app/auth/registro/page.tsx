"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, UserPlus, Loader2, Sparkles, Shield, CheckCircle, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
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
      const { email, password, confirmPassword } = formData

      if (!email || !password || !confirmPassword) {
        throw new Error("Por favor complete todos los campos")
      }

      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

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

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full opacity-20"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -25, 0],
        x: [0, 15, 0],
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.6, 0.2]
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 3
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-white relative overflow-hidden fixed inset-0">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #10b981 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-emerald-100/10 to-blue-100/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

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
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 rounded-xl blur-sm" />
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
                        className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-blue-700 flex items-center justify-center shadow-2xl relative overflow-hidden"
                        whileHover={{ 
                          scale: 1.05,
                          rotate: 5,
                          transition: { duration: 0.3 }
                        }}
                      >
                        {/* Inner glow */}
                        <div className="absolute inset-2 bg-gradient-to-br from-emerald-400/50 to-blue-400/50 rounded-xl blur-sm" />
                        <UserPlus className="w-12 h-12 text-white relative z-10" />
                        
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
                        className="absolute inset-0 rounded-2xl border-2 border-gradient-to-r from-emerald-400/30 to-blue-400/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </motion.div>

                  {/* Title Section */}
                  <div className="text-center space-y-3">
                    <motion.div variants={itemVariants}>
                      <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-blue-800 bg-clip-text text-transparent">
                        Crear Cuenta
                      </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription className="text-lg font-medium text-gray-600">
                        Únete al Sistema Casino Escolar
                      </CardDescription>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mx-auto" />
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
                        <Mail className="w-4 h-4 text-emerald-600" />
                        Correo Electrónico
                      </Label>
                      <div className="relative group">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange('email')}
                          placeholder="nombre@ejemplo.com"
                          className="h-14 pl-12 pr-4 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-gray-300 hover:shadow-lg bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                          required
                          disabled={loading}
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-600" />
                        
                        {/* Input glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </motion.div>

                    {/* Password Field */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        Contraseña
                      </Label>
                      <div className="relative group">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={handleInputChange('password')}
                          placeholder="Mínimo 6 caracteres"
                          className="h-14 pl-12 pr-14 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-gray-300 hover:shadow-lg bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                          required
                          disabled={loading}
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-600" />
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
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                      
                      {/* Password strength indicator */}
                      {passwordValidation.hasContent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-2 text-xs"
                        >
                          {passwordValidation.length ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          )}
                          <span className={passwordValidation.length ? "text-emerald-600" : "text-amber-600"}>
                            Mínimo 6 caracteres
                          </span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Confirm Password Field */}
                    <motion.div variants={itemVariants} className="space-y-3">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        Confirmar Contraseña
                      </Label>
                      <div className="relative group">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleInputChange('confirmPassword')}
                          placeholder="Repita su contraseña"
                          className="h-14 pl-12 pr-14 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-gray-300 hover:shadow-lg bg-gray-50/50 focus:bg-white text-gray-900 placeholder:text-gray-400"
                          required
                          disabled={loading}
                        />
                        <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-emerald-600" />
                        <motion.button
                          type="button"
                          onClick={toggleConfirmPasswordVisibility}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                          disabled={loading}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </motion.button>
                        
                        {/* Input glow effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-blue-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                      
                      {/* Password match indicator */}
                      {formData.confirmPassword.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-2 text-xs"
                        >
                          {passwordValidation.match ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={passwordValidation.match ? "text-emerald-600" : "text-red-600"}>
                            {passwordValidation.match ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                          </span>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="pt-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="submit"
                          className="w-full h-14 bg-gradient-to-r from-emerald-600 via-emerald-700 to-blue-700 hover:from-emerald-700 hover:via-emerald-800 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                          disabled={loading || !passwordValidation.length || !passwordValidation.match}
                        >
                          {/* Button shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer" />
                          
                          {loading ? (
                            <div className="flex items-center space-x-3 relative z-10">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Registrando...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3 relative z-10">
                              <UserPlus className="w-5 h-5" />
                              <span>Crear Cuenta</span>
                            </div>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Login Link */}
                    <motion.div variants={itemVariants} className="text-center pt-4">
                      <p className="text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                          href="/auth/login"
                          className="font-semibold text-emerald-600 hover:text-blue-600 transition-colors duration-300 hover:underline relative"
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
            className="bg-white rounded-3xl p-12 flex flex-col items-center space-y-6 shadow-2xl border border-gray-100"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-emerald-600" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-200 rounded-full animate-pulse" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold text-gray-700">Creando tu cuenta</p>
              <p className="text-sm text-gray-500">Por favor espere un momento...</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}