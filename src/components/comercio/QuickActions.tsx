'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  QrCode, 
  FileText, 
  User, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const QuickActions: React.FC = () => {
  const router = useRouter();

  const quickActions = [
    {
      id: 'new-benefit',
      title: 'Publicar nuevo beneficio',
      description: 'Creá un beneficio para tus socios',
      icon: Plus,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50',
      path: '/dashboard/comercio/beneficios',
      hoverColor: 'hover:from-emerald-600 hover:to-green-700'
    },
    {
      id: 'qr-code',
      title: 'Ver o descargar QR',
      description: 'Gestioná tu código QR',
      icon: QrCode,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      path: '/dashboard/comercio/qr',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-700'
    },
    {
      id: 'validations',
      title: 'Ver historial completo',
      description: 'Todas las validaciones',
      icon: FileText,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50',
      path: '/dashboard/comercio/validaciones',
      hoverColor: 'hover:from-violet-600 hover:to-purple-700'
    },
    {
      id: 'profile',
      title: 'Editar perfil',
      description: 'Actualizá tu información',
      icon: User,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      path: '/dashboard/comercio/perfil',
      hoverColor: 'hover:from-amber-600 hover:to-orange-700'
    }
  ];

  const handleAction = (path: string) => {
    router.push(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Accesos rápidos
          </h3>
          <p className="text-sm text-slate-600">
            Acciones frecuentes
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 gap-4">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.path)}
              className="group w-full text-left"
            >
              <div className={`p-4 rounded-xl bg-gradient-to-r ${action.bgColor} border border-slate-200/50 hover:border-slate-300/50 hover:shadow-md transition-all duration-300`}>
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} ${action.hoverColor} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
