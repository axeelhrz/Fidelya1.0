'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { 
  AlertTriangle, 
  QrCode, 
  Calendar, 
  User, 
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export const Alerts: React.FC = () => {
  const { comercio } = useComercios();
  const { beneficios, expiredBeneficios } = useBeneficios();
  const router = useRouter();

  // Check for various alert conditions
  const alerts = [];

  // Check if QR is generated (assuming we need to check this)
  const hasQR = true; // This would come from your QR management logic
  if (!hasQR) {
    alerts.push({
      id: 'no-qr',
      type: 'warning',
      icon: QrCode,
      title: '¡Generá tu código QR!',
      message: 'Necesitas un código QR para que los socios puedan validar beneficios.',
      action: 'Generar QR',
      actionPath: '/dashboard/comercio/qr',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      textColor: 'text-amber-700'
    });
  }

  // Check for expired benefits
  if (expiredBeneficios.length > 0) {
    alerts.push({
      id: 'expired-benefits',
      type: 'error',
      icon: Calendar,
      title: 'Beneficios vencidos',
      message: `Tenés ${expiredBeneficios.length} beneficio${expiredBeneficios.length > 1 ? 's' : ''} vencido${expiredBeneficios.length > 1 ? 's' : ''}. Editalos para volver a activarlos.`,
      action: 'Editar beneficios',
      actionPath: '/dashboard/comercio/beneficios',
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-50',
      textColor: 'text-red-700'
    });
  }

  // Check for incomplete profile
  const isProfileIncomplete = !comercio?.direccion || !comercio?.telefono || !comercio?.descripcion;
  if (isProfileIncomplete) {
    alerts.push({
      id: 'incomplete-profile',
      type: 'info',
      icon: User,
      title: 'Completá tu perfil',
      message: 'Completá los datos de tu comercio para que los socios te encuentren más fácil.',
      action: 'Ir a perfil',
      actionPath: '/dashboard/comercio/perfil',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-700'
    });
  }

  // Success message if everything is good
  if (alerts.length === 0) {
    alerts.push({
      id: 'all-good',
      type: 'success',
      icon: CheckCircle,
      title: '¡Todo en orden!',
      message: 'Tu comercio está configurado correctamente y listo para recibir validaciones.',
      action: null,
      actionPath: null,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'from-emerald-50 to-green-50',
      textColor: 'text-emerald-700'
    });
  }

  const handleAction = (actionPath: string | null) => {
    if (actionPath) {
      router.push(actionPath);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'error':
        return XCircle;
      case 'success':
        return CheckCircle;
      default:
        return AlertTriangle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Alertas y recordatorios
          </h3>
          <p className="text-sm text-slate-600">
            Mantené tu comercio optimizado
          </p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert, index) => {
          const IconComponent = alert.icon;
          
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className={`p-4 rounded-xl bg-gradient-to-r ${alert.bgColor} border border-slate-200/50 hover:border-slate-300/50 transition-all duration-300`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${alert.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {alert.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-3">
                      {alert.message}
                    </p>

                    {/* Action Button */}
                    {alert.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(alert.actionPath)}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className={`${alert.textColor} border-current hover:bg-white/50`}
                      >
                        {alert.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
