'use client'

import { motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

export function WhatsAppButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  const phoneNumber = '+59892388748'
  const message = encodeURIComponent('Hola, me interesa saber más sobre los planes de Assuriva')
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  const buttonVariants = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  }

  const expandedContentVariants = {
    hidden: { 
      opacity: 0,
      x: 50,
      display: 'none'
    },
    visible: { 
      opacity: 1,
      x: 0,
      display: 'flex'
    }
  }

  const handleClick = () => {
    if (isExpanded) {
      window.open(whatsappUrl, '_blank')
    } else {
      setIsExpanded(true)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center">
      {/* Contenido expandido */}
      <motion.div
        initial="hidden"
        animate={isExpanded ? "visible" : "hidden"}
        variants={expandedContentVariants}
        className="bg-white shadow-lg rounded-lg mr-4 p-4 flex items-center"
      >
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">
            ¿Necesitás ayuda?
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            Chateá con nosotros en WhatsApp
          </p>
          <p className="text-xs text-gray-500">
            Respondemos en minutos
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="ml-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </motion.div>

      {/* Botón principal de WhatsApp */}
      <motion.button
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-colors duration-200"
      >
        <MessageCircle className="h-6 w-6" />
        <motion.span
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0
          }}
          className="whitespace-nowrap overflow-hidden"
        >
          Contactar
        </motion.span>
      </motion.button>

      {/* Indicador de notificación */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"
      >
        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
      </motion.div>
    </div>
  )
}