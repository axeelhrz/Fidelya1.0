"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { 
  BookOpen, 
  Heart, 
  Users, 
  ChefHat, 
  Calendar, 
  Shield,
  ArrowRight,
  Sparkles
} from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const features = [
    {
      icon: ChefHat,
      title: "Gestión de Menús",
      description: "Planifica y administra menús nutritivos de forma intuitiva"
    },
    {
      icon: Heart,
      title: "Alimentación Saludable",
      description: "Promovemos hábitos nutricionales balanceados y saludables"
    },
    {
      icon: Users,
      title: "Comunidad Educativa",
      description: "Conecta familias, estudiantes y personal administrativo"
    },
    {
      icon: Calendar,
      title: "Planificación Inteligente",
      description: "Organiza horarios y recursos de manera eficiente"
    },
    {
      icon: Shield,
      title: "Seguridad Alimentaria",
      description: "Garantiza estándares de calidad y seguridad"
    },
    {
      icon: BookOpen,
      title: "Educación Nutricional",
      description: "Fomenta el aprendizaje sobre alimentación saludable"
    }
  ]

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Plataforma Educativa Digital
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight"
          >
            Casino
            <span className="text-gradient block">Escolar</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            Gestión inteligente de alimentación escolar para una 
            <span className="text-primary font-semibold"> comunidad educativa saludable</span>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth/login">
              <Button size="lg" className="w-full sm:w-auto group">
                Iniciar Sesión
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Link href="/auth/sign-up">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Crear Cuenta
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="glass-effect rounded-2xl p-6 h-full shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass-effect rounded-2xl p-6 shadow-elegant">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Seguridad Alimentaria</div>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 shadow-elegant">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Disponibilidad</div>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 shadow-elegant">
              <div className="text-3xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground">Posibilidades</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <div className="glass-effect rounded-3xl p-8 max-w-2xl mx-auto shadow-elegant">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
              ¿Listo para transformar tu gestión educativa?
            </h2>
            <p className="text-muted-foreground mb-6">
              Únete a la revolución digital en alimentación escolar
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" className="group">
                Comenzar Ahora
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}