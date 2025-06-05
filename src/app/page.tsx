"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/30 to-cyan-900/20" />
        
        {/* Dynamic gradient that follows mouse */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 25%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)`
          }}
        />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.3, 0.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute top-1/2 right-20 w-80 h-80 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 rounded-full blur-2xl"
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -60, 0],
            scale: [1, 0.7, 1.4, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-500/12 to-pink-500/8 rounded-full blur-3xl"
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -70, 30, 0],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 120, 240, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
            animate={{
              backgroundPosition: ['0px 0px', '60px 60px', '0px 0px'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Particle system */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Scanning lines effect */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(59, 130, 246, 0.1) 2px, rgba(59, 130, 246, 0.1) 4px)'
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Main Title with Special Typography */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <motion.h1
            className="text-7xl md:text-9xl lg:text-[12rem] font-black mb-8 leading-none tracking-tight"
            style={{
              fontFamily: "'Orbitron', 'Inter', sans-serif",
              background: 'linear-gradient(45deg, #ffffff, #3b82f6, #8b5cf6, #06b6d4, #ffffff)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(59, 130, 246, 0.5)',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            CASINO
          </motion.h1>
          
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] mb-6"
            style={{
              fontFamily: "'Orbitron', 'Inter', sans-serif",
              background: 'linear-gradient(45deg, #64748b, #94a3b8, #cbd5e1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          >
            ESCOLAR
          </motion.h2>

          {/* Subtitle with glitch effect */}
          <motion.p
            className="text-xl md:text-2xl text-slate-300 font-light tracking-wide max-w-3xl mx-auto"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: '0 0 20px rgba(148, 163, 184, 0.3)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
          >
            &gt; Sistema de gestión del futuro_
          </motion.p>

          {/* Decorative elements */}
          <motion.div
            className="flex justify-center items-center mt-8 space-x-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-8"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2, ease: "easeOut" }}
        >
          {/* Login Button */}
          <Link href="/auth/login">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <Button
                size="lg"
                className="relative px-12 py-6 text-xl font-bold bg-transparent border-2 border-blue-500 text-blue-400 hover:text-white rounded-none transition-all duration-500 overflow-hidden"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '0.1em',
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 20px 100%)',
                }}
              >
                <span className="relative z-10">INICIAR SESIÓN</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-blue-500/20 group-hover:bg-blue-500/40 transition-all duration-300" />
              </Button>
            </motion.div>
          </Link>

          {/* Register Button */}
          <Link href="/auth/registro">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <Button
                size="lg"
                className="relative px-12 py-6 text-xl font-bold bg-transparent border-2 border-purple-500 text-purple-400 hover:text-white rounded-none transition-all duration-500 overflow-hidden"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: '0.1em',
                  clipPath: 'polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)',
                }}
              >
                <span className="relative z-10">CREAR CUENTA</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600"
                  initial={{ x: '100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                <div className="absolute inset-0 bg-purple-500/20 group-hover:bg-purple-500/40 transition-all duration-300" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Bottom accent with animated elements */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
        >
          <motion.div
            className="flex space-x-3 mb-4"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
          </motion.div>
          
          <motion.div
            className="text-xs text-slate-500 font-mono tracking-wider"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            [ SISTEMA INICIADO ]
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}