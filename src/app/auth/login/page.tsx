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
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2, Shield } from "lucide-react"

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

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta al Sistema Casino Escolar.",
      })

      // Esperar un momento para que el auth state se actualice
      await new Promise(resolve => setTimeout(resolve, 500))

      // Redirigir según el email
      if (email.toLowerCase() === "c.wevarh@gmail.com") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }

    } catch (error: unknown) {
      console.error("Error signing in:", error)
      const errorMessage = error instanceof Error ? error.message : "No se pudo iniciar sesión."
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden fixed inset-0">
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-8 pb-8 pt-12">
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center shadow-2xl">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="text-center space-y-3">
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Bienvenido
                </CardTitle>
                <CardDescription className="text-lg font-medium text-gray-600">
                  Sistema Casino Escolar
                </CardDescription>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto" />
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
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
                      className="h-14 pl-12 pr-4 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      required
                      disabled={loading}
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
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
                      className="h-14 pl-12 pr-14 border-2 border-gray-200 rounded-2xl transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      required
                      disabled={loading}
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-blue-800 hover:to-purple-800 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Verificando credenciales...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <LogIn className="w-5 h-5" />
                        <span>Iniciar Sesión</span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Register Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{" "}
                    <Link
                      href="/auth/registro"
                      className="font-semibold text-blue-600 hover:text-purple-600 transition-colors duration-300 hover:underline"
                    >
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}