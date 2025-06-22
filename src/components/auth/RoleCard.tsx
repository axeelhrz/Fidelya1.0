'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Store, Users, ArrowRight, Star, Shield, Zap } from 'lucide-react';

interface RoleCardProps {
  role: 'asociacion' | 'socio' | 'comercio';
  title: string;
  description: string;
  href: string;
  features?: string[];
  popular?: boolean;
}

const roleConfig = {
  asociacion: {
    icon: Building2,
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100/50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    hoverShadow: 'group-hover:shadow-blue-500/25',
    accentColor: 'text-blue-600',
    features: ['Gestión completa', 'Analytics avanzados', 'Soporte premium']
  },
  socio: {
    icon: Users,
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-green-100/50',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    hoverShadow: 'group-hover:shadow-green-500/25',
    accentColor: 'text-green-600',
    features: ['Beneficios exclusivos', 'Puntos de fidelidad', 'Descuentos especiales']
  },
  comercio: {
    icon: Store,
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100/50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    hoverShadow: 'group-hover:shadow-purple-500/25',
    accentColor: 'text-purple-600',
    features: ['Fidelización clientes', 'Dashboard completo', 'Campañas automáticas']
  }
};

export function RoleCard({ role, title, description, href, popular = false }: RoleCardProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="relative"
    >
      {/* Popular Badge */}
      {popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-lg flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>Popular</span>
          </div>
        </motion.div>
      )}

      <Link
        href={href}
        className={`group relative block rounded-3xl border-2 bg-white p-8 transition-all duration-300 hover:shadow-2xl ${config.borderColor} ${config.hoverShadow}`}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* Icon Container */}
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${config.iconBg} ${config.borderColor} shadow-lg`}
              >
                <Icon className={`h-8 w-8 ${config.iconColor}`} />
              </motion.div>

              <div>
                <h3 className={`text-xl font-black text-gray-900 group-hover:${config.accentColor} transition-colors duration-300 tracking-tight`}>
                  {title}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">Verificado</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-white group-hover:shadow-lg transition-all duration-300"
            >
              <ArrowRight className={`h-5 w-5 text-gray-400 group-hover:${config.accentColor} transition-colors duration-300`} />
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6 text-base">
            {description}
          </p>

          {/* Features */}
          <div className="space-y-3">
            {config.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className={`flex h-6 w-6 items-center justify-center rounded-full ${config.iconBg}`}>
                  <Zap className={`h-3 w-3 ${config.iconColor}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Bottom Accent Line */}
          <motion.div
            className={`absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r ${config.gradient} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
            initial={false}
          />
        </div>

        {/* Hover Glow Effect */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 blur-xl`} />
      </Link>
    </motion.div>
  );
}