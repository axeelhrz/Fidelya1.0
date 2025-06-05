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

// Animaciones optimizadas
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo principal con gradiente complejo */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
      
      {/* Capa de gradiente superpuesta */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-blue-500/10" />
      
      {/* Elementos de fondo con efectos de luz */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        
        {/* Elementos decorativos luminosos */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/40 rounded-full shadow-lg shadow-blue-400/20" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400/40 rotate-45 shadow-lg shadow-purple-400/20" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-cyan-400/50 rounded-full shadow-lg shadow-cyan-400/20" />
        <div className="absolute top-60 right-40 w-2 h-2 bg-pink-400/60 rounded-full shadow-lg shadow-pink-400/20" />
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white/90">
                  Sistema Inteligente de Pedidos
                </span>
              </div>

              {/* Título principal */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  Casino
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Escolar
                </span>
              </h1>

              {/* Subtítulo */}
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Revoluciona la gestión de pedidos escolares con tecnología de vanguardia.
                <span className="block mt-2 text-lg text-blue-200/80">
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
                className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 border-0 hover:scale-[1.02]"
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
                className="w-full sm:w-auto h-14 px-8 bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/30 hover:bg-white/15 text-white font-semibold rounded-2xl shadow-xl shadow-black/20 hover:shadow-black/30 transition-all duration-200 hover:scale-[1.02]"
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
                  <Card className="h-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all duration-300 rounded-3xl overflow-hidden group-hover:scale-[1.02] group-hover:-translate-y-1 group-hover:bg-white/10">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 group-hover:rotate-3 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-blue-100/80 leading-relaxed">
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
            <Card className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-800/20 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30 rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
              <CardContent className="relative z-10 p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                  <div className="space-y-2 hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">99%</div>
                    <p className="text-blue-200 font-medium">Satisfacción</p>
                  </div>
                  <div className="space-y-2 hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">24/7</div>
                    <p className="text-blue-200 font-medium">Disponibilidad</p>
                  </div>
                  <div className="space-y-2 hover:scale-105 transition-transform duration-200">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">&lt;2s</div>
                    <p className="text-blue-200 font-medium">Tiempo de respuesta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sección CTA */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="relative">
              {/* Efecto de brillo de fondo */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl" />
              
              <Card className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/30">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-current drop-shadow-lg" />
                    ))}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    ¿Listo para comenzar?
                  </h2>
                  <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                    Únete a miles de familias que ya disfrutan de la comodidad y eficiencia 
                    de nuestro sistema de pedidos.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="h-16 px-12 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-200 border-0 hover:scale-105"
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
            <div className="flex items-center justify-center gap-2 text-sm text-blue-200/60">
              <Shield className="w-4 h-4" />
              <span>© 2025 Casino Escolar. Todos los derechos reservados.</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}