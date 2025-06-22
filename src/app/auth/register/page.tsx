'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RoleCard } from '@/components/auth/RoleCard';
import { Button } from '@/components/ui/Button';
import { LogIn, ArrowRight, Users, Building2, Store, Star, Shield, Zap, Crown, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Únete a Fidelita"
      subtitle="Elige el tipo de cuenta que mejor se adapte a tus necesidades y comienza a disfrutar de beneficios exclusivos"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Estadísticas de Confianza premium */}
        <motion.div
          variants={statsVariants}
          className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-slate-50 via-white to-indigo-50/30 rounded-2xl border-2 border-slate-200 relative overflow-hidden shadow-sm"
        >
          {/* Línea decorativa superior */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
          
          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border-2 border-blue-200 shadow-sm">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight mb-1">500+</div>
            <div className="text-xs font-bold text-slate-600 tracking-[0.1em] uppercase">Asociaciones</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl border-2 border-purple-200 shadow-sm">
              <Store className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight mb-1">2K+</div>
            <div className="text-xs font-bold text-slate-600 tracking-[0.1em] uppercase">Comercios</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border-2 border-emerald-200 shadow-sm">
              <Users className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight mb-1">50K+</div>
            <div className="text-xs font-bold text-slate-600 tracking-[0.1em] uppercase">Socios</div>
          </div>
        </motion.div>

        {/* Tarjetas de Roles premium */}
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <RoleCard
              role="asociacion"
              title="Asociación"
              description="Para organizaciones que gestionan programas de fidelidad y beneficios comunitarios de manera profesional"
              href="/auth/register/asociacion"
              popular={false}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <RoleCard
              role="socio"
              title="Socio"
              description="Para personas que quieren acceder a beneficios exclusivos y programas de fidelidad premium"
              href="/auth/register/socio"
              popular={true}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <RoleCard
              role="comercio"
              title="Comercio"
              description="Para negocios que desean ofrecer beneficios únicos y fidelizar a sus clientes de manera efectiva"
              href="/auth/register/comercio"
              popular={false}
            />
          </motion.div>
        </div>

        {/* Sección de Login premium */}
        <motion.div
          variants={itemVariants}
          className="space-y-6"
        >
          {/* Divisor premium */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 bg-white text-slate-500 font-semibold tracking-tight">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>
          
          {/* Botón de Login premium */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                leftIcon={<LogIn />}
                rightIcon={<ArrowRight />}
                className="bg-gradient-to-r from-slate-50 to-slate-100/50 hover:from-slate-100 hover:to-slate-200/50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold shadow-sm hover:shadow-md"
              >
                Iniciar sesión
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Beneficios Destacados premium */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-indigo-50 via-indigo-100/50 to-purple-50/30 border-2 border-indigo-200 rounded-2xl p-8 relative overflow-hidden shadow-sm"
        >
          {/* Línea decorativa superior */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
          
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200/50 rounded-2xl border-2 border-indigo-200 shadow-sm">
              <Crown className="w-7 h-7 text-indigo-600" />
            </div>
          </div>
          
          <h3 className="text-lg font-black text-indigo-900 mb-6 text-center tracking-tight">
            ¿Por qué elegir Fidelita?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-sm" />
              <span className="text-indigo-800 font-bold tracking-tight">Plataforma premium</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-sm" />
              <span className="text-indigo-800 font-bold tracking-tight">Soporte 24/7</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-sm" />
              <span className="text-indigo-800 font-bold tracking-tight">Seguridad avanzada</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-sm" />
              <span className="text-indigo-800 font-bold tracking-tight">Analytics en tiempo real</span>
            </div>
          </div>

          {/* Elementos decorativos internos */}
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-indigo-200/30 to-purple-200/20 rounded-2xl blur-sm" />
          <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-blue-100/40 to-indigo-100/30 rounded-xl blur-sm" />
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}