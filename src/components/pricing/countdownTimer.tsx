'use client';

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer() {
  // Fecha final de la promoción (7 días desde ahora)
  const [endDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date
  })

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime()
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })

        // Activar parpadeo cuando queden menos de 24 horas
        if (difference < (1000 * 60 * 60 * 24)) {
          setIsBlinking(true)
        }
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  const timeBoxVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    blink: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  }

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      initial="initial"
      animate={isBlinking ? "blink" : "animate"}
      variants={timeBoxVariants}
      className="flex flex-col items-center bg-white rounded-lg shadow-md p-3 min-w-[80px]"
    >
      <span className="text-2xl font-bold text-gray-900">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-600 mt-1">{label}</span>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mb-12 text-center"
    >
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡No te pierdas esta oferta!
        </h3>
        
        <p className="text-gray-600 mb-6">
          La promoción de lanzamiento termina en:
        </p>

        <div className="flex justify-center items-center gap-4">
          <TimeBox value={timeLeft.days} label="Días" />
          <span className="text-2xl font-bold text-gray-400">:</span>
          <TimeBox value={timeLeft.hours} label="Horas" />
          <span className="text-2xl font-bold text-gray-400">:</span>
          <TimeBox value={timeLeft.minutes} label="Minutos" />
          <span className="text-2xl font-bold text-gray-400">:</span>
          <TimeBox value={timeLeft.seconds} label="Segundos" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <p className="text-sm text-gray-600">
            * Los precios volverán a su valor normal cuando termine la cuenta regresiva
          </p>
        </motion.div>

        {/* Indicador de urgencia */}
        {isBlinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium"
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" 
                clipRule="evenodd" 
              />
            </svg>
            ¡Últimas 24 horas de la promoción!
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}