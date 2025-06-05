"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  ArrowRight,
  Sparkles,
  Zap,
  Shield
} from "lucide-react"

// Animaciones optimizadas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15
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

export default function Home() {
  return (
    <>
      {/* Fondo que cubre toda la pantalla */}
      <div className="fixed inset-0 w-full h-full z-0">
        {/* Fondo principal con gradiente complejo */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
        
        {/* Capa de gradiente superpuesta */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/20 via-transparent to-blue-500/10" />
        
        {/* Elementos de fondo con efectos de luz */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          
          {/* Elementos decorativos luminosos */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/40 rounded-full shadow-lg shadow-blue-400/20" />
          <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400/40 rotate-45 shadow-lg shadow-purple-400/20" />
          <div className="absolute bottom-40 left-20 w-3 h-3 bg-cyan-400/50 rounded-full shadow-lg shadow-cyan-400/20" />
          <div className="absolute top-60 right-40 w-2 h-2 bg-pink-400/60 rounded-full shadow-lg shadow-pink-400/20" />
          <div className="absolute bottom-60 right-10 w-5 h-5 bg-emerald-400/30 rounded-full shadow-lg shadow-emerald-400/20" />
          <div className="absolute top-80 left-1/3 w-3 h-3 bg-yellow-400/40 rounded-full shadow-lg shadow-yellow-400/20" />
        </div>
      </div>

      {/* Contenido principal centrado */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center">
        <motion.div
          className="text-center space-y-8 px-4 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white/90">
                Sistema Inteligente de Pedidos
              </span>
            </div>
          </motion.div>

          {/* Título principal */}
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                Casino
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Escolar
              </span>
            </h1>
          </motion.div>

          {/* Subtítulo */}
          <motion.div variants={itemVariants}>
            <p className="text-2xl md:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Revoluciona la gestión de pedidos escolares con tecnología de vanguardia.
            </p>
            <p className="text-xl md:text-2xl text-blue-200/80 mt-4">
              Rápido • Seguro • Intuitivo
            </p>
          </motion.div>

          {/* Botones de acción */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-16 px-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 border-0 hover:scale-[1.02]"
            >
              <Link href="/auth/registro" className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                Crear Cuenta
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-16 px-10 bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/30 hover:bg-white/15 text-white font-semibold text-lg rounded-2xl shadow-xl shadow-black/20 hover:shadow-black/30 transition-all duration-200 hover:scale-[1.02]"
            >
              <Link href="/auth/login" className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                Iniciar Sesión
              </Link>
            </Button>
          </motion.div>

          {/* Footer minimalista */}
          <motion.div variants={itemVariants} className="pt-16">
            <div className="flex items-center justify-center gap-2 text-sm text-blue-200/40">
              <Shield className="w-4 h-4" />
              <span>© 2025 Casino Escolar. Todos los derechos reservados.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}