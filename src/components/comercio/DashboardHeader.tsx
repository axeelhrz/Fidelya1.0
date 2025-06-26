'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useComercios } from '@/hooks/useComercios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Store, Calendar } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { comercio } = useComercios();
  
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Welcome Section */}
        <div className="flex items-center gap-4">
          {/* Logo/Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {comercio?.logoUrl ? (
              <img
                src={comercio.logoUrl}
                alt={`Logo de ${comercio.nombreComercio}`}
                className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Store className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </motion.div>

          {/* Welcome Text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl lg:text-4xl font-black text-slate-900 mb-2"
            >
              Hola, {comercio?.nombreComercio || 'Comercio'} 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-600 font-medium"
            >
              Este es el resumen de tu actividad en Fidelitá.
            </motion.p>
          </div>
        </div>

        {/* Date Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-soft border border-slate-200/50"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Hoy
            </p>
            <p className="text-lg font-bold text-slate-900">
              {capitalizedToday}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
