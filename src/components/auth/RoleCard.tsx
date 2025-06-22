'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Store, Users, ArrowRight, Star, Shield, Zap, Crown, CheckCircle2, Sparkles } from 'lucide-react';

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
    bgGradient: 'from-blue-50 via-blue-100/50 to-blue-50/30',
    borderColor: 'border-blue-200',
    iconBg: 'from-blue-50 to-blue-100/50',
    iconColor: 'text-blue-600',
    hoverShadow: 'hover:shadow-blue-500/20',
    accentColor: 'text-blue-600',
    features: ['Gestión completa', 'Analytics avanzados', 'Soporte premium']
  },
  socio: {
    icon: Users,
    gradient: 'from-emerald-500 to-emerald-600',
    bgGradient: 'from-emerald-50 via-emerald-100/50 to-emerald-50/30',
    borderColor: 'border-emerald-200',
    iconBg: 'from-emerald-50 to-emerald-100/50',
    iconColor: 'text-emerald-600',
    hoverShadow: 'hover:shadow-emerald-500/20',
    accentColor: 'text-emerald-600',
    features: ['Beneficios exclusivos', 'Puntos de fidelidad', 'Descuentos especiales']
  },
  comercio: {
    icon: Store,
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 via-purple-100/50 to-purple-50/30',
    borderColor: 'border-purple-200',
    iconBg: 'from-purple-50 to-purple-100/50',
    iconColor: 'text-purple-600',
    hoverShadow: 'hover:shadow-purple-500/20',
    accentColor: 'text-purple-600',
    features: ['Fidelización clientes', 'Dashboard completo', 'Campañas automáticas']
  }
};

export function RoleCard({ role, title, description, href, popular = false }: RoleCardProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Popular Badge premium */}
      {popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white px-5 py-2 rounded-full text-xs font-bold tracking-[0.1em] uppercase shadow-lg shadow-indigo-500/30 flex items-center space-x-2 border border-indigo-500/20">
            <Crown className="w-4 h-4" />
            <span>Popular</span>
            <Sparkles className="w-3 h-3" />
          </div>
        </motion.div>
      )}

      <Link
        href={href}
        className={`group relative block rounded-3xl border-2 bg-white/80 backdrop-blur-sm p-8 transition-all duration-500 hover:shadow-2xl ${config.borderColor} ${config.hoverShadow} overflow-hidden shadow-sm hover:bg-white`}
      >
        {/* Background Gradient premium */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Línea decorativa superior premium */}
        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-30 ${config.accentColor}`} />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header premium */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-5">
              {/* Icon Container premium */}
              <motion.div
                whileHover={{ rotate: 8, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className={`flex h-18 w-18 items-center justify-center rounded-3xl bg-gradient-to-br ${config.iconBg} border-2 ${config.borderColor} shadow-lg relative overflow-hidden`}
              >
                <Icon className={`h-9 w-9 ${config.iconColor} relative z-10`} />
                {/* Shimmer effect premium */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </motion.div>

              <div>
                <h3 className={`text-xl font-black text-slate-900 group-hover:${config.accentColor} transition-colors duration-300 tracking-tight mb-2`}>
                  {title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-500 tracking-tight">Verificado</span>
                </div>
              </div>
            </div>

            {/* Arrow premium */}
            <motion.div
              whileHover={{ x: 6, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 group-hover:from-white group-hover:to-white/80 group-hover:shadow-lg transition-all duration-300 border-2 border-slate-200 group-hover:border-slate-300"
            >
              <ArrowRight className={`h-6 w-6 text-slate-400 group-hover:${config.accentColor} transition-colors duration-300`} />
            </motion.div>
          </div>

          {/* Description premium */}
          <p className="text-slate-600 leading-relaxed mb-8 text-base font-medium">
            {description}
          </p>

          {/* Features premium */}
          <div className="space-y-4">
            {config.features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br ${config.iconBg} border-2 ${config.borderColor} shadow-sm`}>
                  <CheckCircle2 className={`h-4 w-4 ${config.iconColor}`} />
                </div>
                <span className="text-sm font-bold text-slate-700 tracking-tight">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Bottom Accent Line premium */}
          <motion.div
            className={`absolute bottom-0 left-8 right-8 h-1.5 bg-gradient-to-r ${config.gradient} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-sm`}
            initial={false}
          />
        </div>

        {/* Hover Glow Effect premium */}
        <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 blur-2xl`} />
        
        {/* Elementos decorativos internos premium */}
        <div className={`absolute bottom-6 right-6 w-16 h-16 bg-gradient-to-br ${config.bgGradient} rounded-3xl blur-sm opacity-50`} />
        <div className={`absolute top-6 left-6 w-10 h-10 bg-gradient-to-br ${config.bgGradient} rounded-2xl blur-sm opacity-30`} />
        
        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div 
            className="absolute inset-0 rounded-3xl" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} 
          />
        </div>
      </Link>
    </motion.div>
  );
}