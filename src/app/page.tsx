"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Utensils, 
  Shield, 
  Zap, 
  Users, 
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Star
} from "lucide-react"

// Animation variants
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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.3)",
      "0 0 40px rgba(147, 51, 234, 0.4)",
      "0 0 20px rgba(59, 130, 246, 0.3)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
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
      {/* Background with animated gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 bg-blue-500/30 rounded-full"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-40 right-20 w-6 h-6 bg-purple-500/30 rotate-45"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-3 h-3 bg-blue-400/40 rounded-full"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      {/* Main content */}
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
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Sistema Inteligente de Pedidos
                </span>
              </motion.div>

              {/* Main title */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Casino
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Escolar
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Revoluciona la gestión de pedidos escolares con tecnología de vanguardia.
                <span className="block mt-2 text-lg text-gray-500">
                  Rápido • Seguro • Intuitivo
                </span>
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                >
                  <Link href="/auth/registro" className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Crear Cuenta
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-300 hover:bg-white/90 text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/auth/login" className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Iniciar Sesión
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Features section */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02,
                    y: -5
                  }}
                  className="group"
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg"
                        whileHover={{ rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {feature.icon}
                      </motion.div>
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

          {/* Stats section */}
          <motion.div variants={itemVariants} className="mb-16">
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
              <CardContent className="relative z-10 p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2"
                  >
                    <div className="text-4xl md:text-5xl font-bold">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                      >
                        99%
                      </motion.span>
                    </div>
                    <p className="text-blue-100 font-medium">Satisfacción</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2"
                  >
                    <div className="text-4xl md:text-5xl font-bold">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 1 }}
                      >
                        24/7
                      </motion.span>
                    </div>
                    <p className="text-blue-100 font-medium">Disponibilidad</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="space-y-2"
                  >
                    <div className="text-4xl md:text-5xl font-bold">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 1 }}
                      >
                        &lt;2s
                      </motion.span>
                    </div>
                    <p className="text-blue-100 font-medium">Tiempo de respuesta</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA section */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div
              variants={glowVariants}
              animate="animate"
              className="inline-block p-1 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Card className="bg-white rounded-3xl border-0 shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                    <Star className="w-6 h-6 text-yellow-500 fill-current" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    ¿Listo para comenzar?
                  </h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Únete a miles de familias que ya disfrutan de la comodidad y eficiencia 
                    de nuestro sistema de pedidos.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="h-16 px-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
                    >
                      <Link href="/auth/registro" className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6" />
                        Comenzar Ahora
                        <ArrowRight className="w-6 h-6" />
                      </Link>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
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