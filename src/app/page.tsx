"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

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
      title: "Gestión de Menús",
      description: "Planifica y administra menús nutritivos de forma intuitiva",
      icon: "🍽️"
    },
    {
      title: "Alimentación Saludable", 
      description: "Promovemos hábitos nutricionales balanceados y saludables",
      icon: "❤️"
    },
    {
      title: "Comunidad Educativa",
      description: "Conecta familias, estudiantes y personal administrativo", 
      icon: "👥"
    },
    {
      title: "Planificación Inteligente",
      description: "Organiza horarios y recursos de manera eficiente",
      icon: "📅"
    },
    {
      title: "Seguridad Alimentaria",
      description: "Garantiza estándares de calidad y seguridad",
      icon: "🛡️"
    },
    {
      title: "Educación Nutricional",
      description: "Fomenta el aprendizaje sobre alimentación saludable",
      icon: "📚"
    }
  ]

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f0f9ff 50%, #ecfdf5 75%, #f8fafc 100%)',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.15) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)',
          }}
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
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 100%)',
          }}
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
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #059669 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Hero Section */}
        <div className="text-center mb-20" style={{ maxWidth: '800px', margin: '0 auto 5rem auto' }}>
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                color: '#059669',
              }}
            >
              <span style={{ fontSize: '16px' }}>✨</span>
              Plataforma Educativa Digital
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 leading-tight"
            style={{
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              color: '#1e293b',
              lineHeight: 1.1,
            }}
          >
            Casino
            <span 
              className="block"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Escolar
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-8 leading-relaxed"
            style={{
              fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
              color: '#64748b',
              fontFamily: "'Inter', sans-serif",
              maxWidth: '600px',
              margin: '0 auto 2rem auto',
            }}
          >
            Gestión inteligente de alimentación escolar para una 
            <span style={{ color: '#059669', fontWeight: 600 }}> comunidad educativa saludable</span>
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/auth/login">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-white transition-all duration-300 group flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
                  fontSize: '1.1rem',
                  minWidth: '200px',
                }}
              >
                Iniciar Sesión
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.button>
            </Link>
            
            <Link href="/auth/sign-up">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(5, 150, 105, 0.2)',
                  color: '#059669',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  fontSize: '1.1rem',
                  minWidth: '200px',
                }}
              >
                Crear Cuenta
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group h-full"
            >
              <div 
                className="h-full p-6 rounded-2xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{
                    background: 'rgba(5, 150, 105, 0.1)',
                    fontSize: '1.5rem',
                  }}
                >
                  {feature.icon}
                </div>
                
                <h3 
                  className="mb-2"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="leading-relaxed"
                  style={{
                    color: '#64748b',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div 
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div 
                className="mb-2"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#059669',
                }}
              >
                100%
              </div>
              <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Seguridad Alimentaria
              </div>
            </div>
            
            <div 
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div 
                className="mb-2"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#059669',
                }}
              >
                24/7
              </div>
              <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Disponibilidad
              </div>
            </div>
            
            <div 
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div 
                className="mb-2"
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#059669',
                }}
              >
                ∞
              </div>
              <div style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Posibilidades
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={itemVariants}
          className="text-center"
        >
          <div 
            className="p-8 rounded-3xl"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <h2 
              className="mb-4"
              style={{
                fontSize: '1.75rem',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                color: '#1e293b',
              }}
            >
              ¿Listo para transformar tu gestión educativa?
            </h2>
            <p 
              className="mb-6"
              style={{
                color: '#64748b',
                fontSize: '1.1rem',
                lineHeight: 1.6,
              }}
            >
              Únete a la revolución digital en alimentación escolar
            </p>
            <Link href="/auth/sign-up">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl font-medium text-white transition-all duration-300 group flex items-center justify-center gap-2 mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)',
                  fontSize: '1.1rem',
                  minWidth: '200px',
                }}
              >
                Comenzar Ahora
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ fontSize: '1.2rem' }}
                >
                  ✨
                </motion.span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}