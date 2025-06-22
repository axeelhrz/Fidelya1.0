'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RoleCard } from '@/components/auth/RoleCard';
import { Button } from '@/components/ui/Button';
import { LogIn, ArrowRight, Users, Building2, Store } from 'lucide-react';

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
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
        {/* Estadísticas de Confianza */}
        <motion.div
          variants={statsVariants}
          className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200"
        >
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-xl">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-lg font-black text-gray-900">500+</div>
            <div className="text-xs font-medium text-gray-600">Asociaciones</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-xl">
              <Store className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-lg font-black text-gray-900">2K+</div>
            <div className="text-xs font-medium text-gray-600">Comercios</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-green-100 rounded-xl">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-lg font-black text-gray-900">50K+</div>
            <div className="text-xs font-medium text-gray-600">Socios</div>
          </div>
        </motion.div>

        {/* Tarjetas de Roles */}
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

        {/* Sección de Login */}
        <motion.div
          variants={itemVariants}
          className="space-y-4"
        >
          {/* Divisor */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 bg-white text-gray-500 font-semibold tracking-wide">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>
          
          {/* Botón de Login */}
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
                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-bold"
              >
                Iniciar sesión
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Beneficios Destacados */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-2 border-primary-200 rounded-2xl p-6"
        >
          <h3 className="text-sm font-bold text-primary-900 mb-3 text-center">
            ¿Por qué elegir Fidelita?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-primary-800 font-medium">Plataforma premium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-primary-800 font-medium">Soporte 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-primary-800 font-medium">Seguridad avanzada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              <span className="text-primary-800 font-medium">Analytics en tiempo real</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}