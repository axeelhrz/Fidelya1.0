'use client';

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Efecto de brillo para el texto de descuento
  const [isShining, setIsShining] = useState(false)

  useEffect(() => {
    // Efecto de brillo cada 3 segundos
    const shiningInterval = setInterval(() => {
      setIsShining(true)
      setTimeout(() => setIsShining(false), 1000)
    }, 3000)

    return () => clearInterval(shiningInterval)
  }, [])

  const bannerVariants = {
    hidden: { 
      y: -100,
      opacity: 0 
    },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: { 
      y: -100,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  }

  const shineVariants = {
    inactive: {
      background: "linear-gradient(90deg, #22c55e, #16a34a)",
    },
    active: {
      background: "linear-gradient(90deg, #4ade80, #22c55e, #16a34a, #22c55e, #4ade80)",
      backgroundSize: "200% 100%",
      transition: {
        duration: 1,
        repeat: 0
      }
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={bannerVariants}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <motion.div
            className="bg-gradient-to-r from-emerald-600 to-green-500 text-white py-3 px-4 flex items-center justify-center relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
              backgroundColor: "#059669",
              transition: { duration: 0.3 }
            }}
          >
            {/* Icono de celebración */}
            <span className="text-2xl mr-2 animate-bounce">🎉</span>

            {/* Contenido principal */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
              <p className="font-medium">
                Promoción de lanzamiento:
              </p>
              
              <motion.span
                variants={shineVariants}
                animate={isShining ? "active" : "inactive"}
                className="font-bold px-2 py-1 rounded"
              >
                50% OFF
              </motion.span>
              
              <p className="font-medium hidden sm:block">
                por tiempo limitado
              </p>

              {/* Botón de acción */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-emerald-700 px-4 py-1 rounded-full text-sm font-semibold hover:bg-emerald-50 transition-colors"
              >
                ¡Aprovechá ahora!
              </motion.button>
            </div>

            {/* Botón para cerrar */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-emerald-700/20 rounded-full transition-colors"
              aria-label="Cerrar banner promocional"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Indicador de tiempo limitado */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full bg-white text-emerald-700 text-xs font-medium px-3 py-1 rounded-b-lg shadow-lg"
              >
                ¡Oferta por tiempo limitado!
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}