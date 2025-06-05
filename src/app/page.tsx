"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Utensils, 
  Clock, 
  Shield, 
  Users, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star,
  Zap
} from "lucide-react"

// Animaciones optimizadas - solo las esenciales
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.08
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
}

export default function Home() {
  const features = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Menús Variados",
      description: "Opciones nutritivas y deliciosas cada día"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Pedidos Rápidos",
      description: "Sistema optimizado para máxima eficiencia"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Pagos Seguros",
      description: "Transacciones protegidas y confiables"
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Elementos de fondo estáticos - sin animación */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/15 to-blue-600/15 rounded-full blur-3xl" />
        
        {/* Elementos decorativos estáticos */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500/20 rounded-full" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-500/20 rotate-45" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-blue-400/25 rounded-full" />
      </div>

      {/* Contenido principal */}
      <motion.div
        className="relative z-10 container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          {/* Hero section */}
          <div className="text-center space-y-8 mb-16">
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Sistema Inteligente de Pedidos
                </span>
              </div>

              {/* Título principal */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Casino
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Escolar
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Revoluciona la gestión de pedidos escolares con tecnología de vanguardia.
                <span className="block mt-2 text-lg text-gray-500">
                  Rápido • Seguro • Intuitivo
                </span>
              </p>
            </motion.div>

            {/* Botones de acción */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 border-0 hover:scale-[1.02]"
              >
                <Link href="/auth/registro" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Crear Cuenta
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 hover:bg-white/90 text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <Link href="/auth/login" className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Iniciar Sesión
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Sección de características */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group-hover:scale-[1.02] group-hover:-translate-y-1">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-3 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sección de estadísticas */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 border-0 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
              <CardContent className="relative z-10 p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                  <div className="space-y-2 hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl md:text-5xl font-bold">99%</div>
                    <p className="text-blue-100 font-medium">Satisfacción</p>
                  </div>
                  <div className="space-y-2 hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl md:text-5xl font-bold">24/7</div>
                    <p className="text-blue-100 font-medium">Disponibilidad</p>
                  </div>
                  <div className="space-y-2 hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl md:text-5xl font-bold">&lt;2s</div>
                    <p className="text-blue-100 font-medium">Tiempo de respuesta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sección CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="inline-block p-1 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600">
              <Card className="bg-white rounded-3xl border-0 shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    ¿Listo para comenzar?
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Únete a miles de familias que ya disfrutan de la comodidad y eficiencia 
                    de nuestro sistema de pedidos.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="h-16 px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 border-0 hover:scale-105"
                  >
                    <Link href="/auth/registro" className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6" />
                      Comenzar Ahora
                      <ArrowRight className="w-6 h-6" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-16 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>© 2025 Casino Escolar. Todos los derechos reservados.</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}