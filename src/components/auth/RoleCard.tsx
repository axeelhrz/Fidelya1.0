'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Store, Users, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface RoleCardProps {
  role: 'asociacion' | 'socio' | 'comercio';
  title: string;
  description: string;
  href: string;
  popular?: boolean;
}

const roleConfig = {
  asociacion: {
    icon: Building2,
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100/50',
    iconColor: 'text-blue-600',
    features: ['Gestión completa', 'Analytics avanzados', 'Soporte premium']
  },
  socio: {
    icon: Users,
    gradient: 'from-emerald-500 to-emerald-600',
    bgGradient: 'from-emerald-50 to-emerald-100/50',
    iconColor: 'text-emerald-600',
    features: ['Beneficios exclusivos', 'Puntos de fidelidad', 'Descuentos especiales']
  },
  comercio: {
    icon: Store,
    gradient: 'from-violet-500 to-violet-600',
    bgGradient: 'from-violet-50 to-violet-100/50',
    iconColor: 'text-violet-600',
    features: ['Fidelización clientes', 'Dashboard completo', 'Campañas automáticas']
  }
};

export function RoleCard({ role, title, description, href, popular = false }: RoleCardProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <div className="relative">
      {/* Popular Badge */}
      {popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5"
        >
          <Sparkles size={12} />
          Popular
        </motion.div>
      )}

      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="group"
      >
        <Link 
          href={href}
          className="block bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group-hover:border-slate-300/50"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${config.bgGradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={28} className={config.iconColor} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Verificado</span>
                </div>
              </div>
            </div>
            
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-300">
              <ArrowRight size={20} className="text-slate-600 group-hover:translate-x-0.5 transition-transform duration-200" />
            </div>
          </div>

          {/* Description */}
          <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>

          {/* Features */}
          <div className="space-y-3">
            {config.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-6 h-6 bg-gradient-to-br ${config.bgGradient} rounded-lg flex items-center justify-center`}>
                  <CheckCircle2 size={14} className={config.iconColor} />
                </div>
                <span className="text-sm font-medium text-slate-700">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Bottom accent */}
          <div className={`mt-6 h-1 bg-gradient-to-r ${config.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
        </Link>
      </motion.div>
    </div>
  );
}