'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Store, Users, ArrowRight } from 'lucide-react';

interface RoleCardProps {
  role: 'asociacion' | 'socio' | 'comercio';
  title: string;
  description: string;
  href: string;
}

const roleIcons = {
  asociacion: Building2,
  socio: Users,
  comercio: Store
};

const roleColors = {
  asociacion: {
    icon: 'text-blue-600 bg-blue-50 border-blue-200',
    gradient: 'from-blue-500 to-blue-600',
    hover: 'group-hover:border-blue-300 group-hover:shadow-blue-100'
  },
  socio: {
    icon: 'text-green-600 bg-green-50 border-green-200',
    gradient: 'from-green-500 to-green-600',
    hover: 'group-hover:border-green-300 group-hover:shadow-green-100'
  },
  comercio: {
    icon: 'text-purple-600 bg-purple-50 border-purple-200',
    gradient: 'from-purple-500 to-purple-600',
    hover: 'group-hover:border-purple-300 group-hover:shadow-purple-100'
  }
};

export function RoleCard({ role, title, description, href }: RoleCardProps) {
  const Icon = roleIcons[role];
  const colors = roleColors[role];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className={`group relative rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-xl block ${colors.hover}`}
      >
        {/* Efecto de gradiente en hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10 flex items-center space-x-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${colors.icon} group-hover:scale-110`}>
            <Icon className="h-7 w-7" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 tracking-tight">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 group-hover:bg-indigo-100 transition-all duration-300">
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all duration-300" />
          </div>
        </div>

        {/* Línea decorativa inferior */}
        <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${colors.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
      </Link>
    </motion.div>
  );
}