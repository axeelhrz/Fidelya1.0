'use client';

import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Carlos Rodríguez',
    role: 'Corredor de Seguros Independiente',
    image: '/assets/testimonials/testimonial-1.jpg',
    content: 'Desde que empecé a usar Assuriva, mi productividad aumentó un 40%. La gestión de pólizas es mucho más eficiente.',
  },
  {
    name: 'María González',
    role: 'Directora de Agencia de Seguros',
    image: '/assets/testimonials/testimonial-2.jpg',
    content: 'La mejor inversión para mi agencia. El seguimiento de vencimientos automático nos ahorra horas de trabajo.',
  },
  {
    name: 'Juan Martínez',
    role: 'Broker de Seguros',
    image: '/assets/testimonials/testimonial-3.jpg',
    content: 'Excelente plataforma. El soporte técnico es increíble y las actualizaciones constantes mejoran la experiencia.',
  },
]

const partners = [
  {
    name: 'Google Cloud',
    logo: '/assets/logos/google-cloud.svg',
    alt: 'Google Cloud Logo'
  },
  {
    name: 'Firebase',
    logo: '/assets/logos/firebase.svg',
    alt: 'Firebase Logo'
  },
  {
    name: 'PayPal',
    logo: '/assets/logos/paypal.svg',
    alt: 'PayPal Logo'
  },
  {
    name: 'Stripe',
    logo: '/assets/logos/stripe.svg',
    alt: 'Stripe Logo'
  }
]

const securityFeatures = [
  {
    icon: '🔒',
    title: 'Encriptación de datos',
    description: 'Tus datos están protegidos con encriptación de nivel bancario'
  },
  {
    icon: '🛡️',
    title: 'Cumplimiento GDPR',
    description: 'Cumplimos con las normativas de protección de datos'
  },
  {
    icon: '🔐',
    title: 'Autenticación segura',
    description: 'Acceso protegido con autenticación de dos factores'
  }
]

export function TrustSection() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16 px-4"
    >
      {/* Sección de Testimonios */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Lo que dicen nuestros usuarios
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">&quot;{testimonial.content}&quot;</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sección de Seguridad */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tu seguridad es nuestra prioridad
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-6"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sección de Partners */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Respaldado por las mejores tecnologías
          </h2>
          <p className="text-gray-600">
            Utilizamos servicios de clase mundial para garantizar la mejor experiencia
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-32 h-12"
            >
              <Image
                src={partner.logo}
                alt={partner.alt}
                fill
                className="object-contain filter grayscale hover:grayscale-0 transition-all"
              />
            </motion.div>
          ))}
        </div>

        {/* Mensaje de Confianza */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center gap-2 bg-green-50 px-4 py-2 rounded-full text-green-700">
            <svg 
              className="w-5 h-5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <span className="font-medium">Pagos 100% seguros</span>
          </div>
          <p className="mt-4 text-gray-600">
            Sin compromiso. Cancelá en cualquier momento.
          </p>
        </div>
      </div>
    </motion.section>
  )
}