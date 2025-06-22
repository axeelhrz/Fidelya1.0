'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RoleCard } from '@/components/auth/RoleCard';
import { LogIn, ArrowRight, Users, Building2, Store, TrendingUp, Award, Shield } from 'lucide-react';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Únete a Fidelita"
      subtitle="Elige el tipo de cuenta que mejor se adapte a tus necesidades"
    >
      <div className="space-y-8">
        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Building2 size={24} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Asociaciones</div>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Store size={24} className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">2K+</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Comercios</div>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Users size={24} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Socios</div>
            </div>
          </div>
        </motion.div>

        {/* Role Cards */}
        <div className="space-y-4">
          <RoleCard
            role="asociacion"
            title="Asociación"
            description="Para organizaciones que gestionan programas de fidelidad y beneficios comunitarios"
            href="/auth/register/asociacion"
          />
          
          <RoleCard
            role="socio"
            title="Socio"
            description="Para personas que quieren acceder a beneficios exclusivos y programas de fidelidad"
            href="/auth/register/socio"
            popular={true}
          />
          
          <RoleCard
            role="comercio"
            title="Comercio"
            description="Para negocios que desean ofrecer beneficios únicos y fidelizar a sus clientes"
            href="/auth/register/comercio"
          />
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">
              ¿Ya tienes cuenta?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link
          href="/auth/login"
          className="w-full flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold text-gray-700 bg-gray-100 border-2 border-gray-200 rounded-xl hover:bg-gray-200 hover:border-gray-300 transition-all duration-200"
        >
          <LogIn size={16} />
          Iniciar sesión
          <ArrowRight size={16} />
        </Link>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6"
        >
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award size={24} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-indigo-900 mb-2">
              ¿Por qué elegir Fidelita?
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Plataforma premium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Soporte 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Seguridad avanzada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-indigo-800 font-medium">Analytics en tiempo real</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AuthLayout>
  );
}