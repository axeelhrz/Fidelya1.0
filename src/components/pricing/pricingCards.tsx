'use client';

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Básico',
    price: '0',
    period: 'mes',
    description: 'Ideal para empezar a conocer la plataforma',
    features: [
      'Hasta 50 pólizas',
      'Soporte por email',
      'Dashboard básico',
      'Notificaciones básicas',
      'Exportación de datos básica'
    ],
    notIncluded: [
      'Acceso a reportes avanzados',
      'Automatización',
      'Integraciones personalizadas'
    ],
    buttonText: 'Probar gratis',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    name: 'Pro',
    price: '9.99',
    period: 'mes',
    description: 'Para corredores profesionales que necesitan control total',
    features: [
      'Hasta 200 pólizas',
      'Dashboard completo',
      'Seguimiento de vencimientos',
      'Estadísticas avanzadas',
      'Soporte prioritario',
      'Automatización básica',
      'Exportación avanzada'
    ],
    popular: true,
    buttonText: 'Activar plan Pro',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-700'
  },
  {
    name: 'Enterprise',
    price: '29.99',
    period: 'mes',
    description: 'Para aseguradoras o corredores con gran volumen',
    features: [
      'Pólizas ilimitadas',
      'Clientes ilimitados',
      'Reportes personalizados',
      'Integraciones avanzadas',
      'Soporte 24/7',
      'API access',
      'Automatización completa',
      'Dashboard personalizado'
    ],
    buttonText: 'Solicitar acceso',
    color: 'purple',
    gradient: 'from-purple-600 to-purple-700'
  }
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
}

export function PricingCards() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {plans.map((plan, i) => (
        <motion.div
          key={plan.name}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          className={`relative rounded-2xl border p-8 shadow-sm transition-all hover:shadow-lg ${
            plan.popular 
              ? 'border-blue-200 shadow-blue-100' 
              : 'border-gray-200'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 text-sm font-medium text-white text-center">
              ⭐ Más elegido
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-5xl font-bold tracking-tight text-gray-900">
                ${plan.price}
              </span>
              <span className="ml-1 text-xl font-semibold text-gray-500">
                /{plan.period}
              </span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
            {plan.notIncluded?.map((feature) => (
              <li key={feature} className="flex items-center text-gray-400">
                <X className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            className={`w-full bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 transition-opacity`}
            size="lg"
          >
            {plan.buttonText}
          </Button>

          {plan.popular && (
            <p className="mt-4 text-xs text-center text-gray-500">
              Incluye prueba gratuita de 14 días
            </p>
          )}
        </motion.div>
      ))}
    </div>
  )
}