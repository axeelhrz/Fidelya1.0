import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function PricingHero() {
  return (
    <section className="relative pt-24 pb-16 text-center overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            Planes de Suscripción
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
            Elige el plan que mejor se adapte a tu gestión como corredor.
            Comienza con 7 días de prueba gratuita.
          </p>

          <Badge 
            variant="secondary" 
            className="py-2 px-4 text-base font-semibold rounded-full"
          >
            <Clock className="mr-2 h-4 w-4" />
            7 días de prueba gratis en todos los planes
          </Badge>
        </motion.div>
      </div>

      {/* Efecto de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-50 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]" />
    </section>
  )
}