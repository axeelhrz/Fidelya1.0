'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RoleCard } from '@/components/auth/RoleCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Únete a Fidelita"
      subtitle="Elige el tipo de cuenta que mejor se adapte a tus necesidades"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.div variants={itemVariants}>
          <RoleCard
            role="asociacion"
            title="Asociación"
            description="Para organizaciones que gestionan programas de fidelidad y beneficios comunitarios"
            href="/auth/register/asociacion"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <RoleCard
            role="socio"
            title="Socio"
            description="Para personas que quieren acceder a beneficios exclusivos y programas de fidelidad"
            href="/auth/register/socio"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <RoleCard
            role="comercio"
            title="Comercio"
            description="Para negocios que desean ofrecer beneficios y fidelizar a sus clientes"
            href="/auth/register/comercio"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">¿Ya tienes cuenta?</span>
          </div>
        </div>
        
        <div className="mt-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full h-12 px-6 text-sm font-semibold text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 tracking-wide uppercase"
          >
            Iniciar sesión
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  );
}