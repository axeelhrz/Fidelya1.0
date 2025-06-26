'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useValidaciones } from '@/hooks/useValidaciones';
import { useBeneficios } from '@/hooks/useBeneficios';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  Users,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export const RecentValidations: React.FC = () => {
  const { validaciones } = useValidaciones();
  const { beneficios } = useBeneficios();
  const router = useRouter();

  // Get recent validations (last 5)
  const recentValidations = validaciones
    .sort((a, b) => b.fechaHora.toDate().getTime() - a.fechaHora.toDate().getTime())
    .slice(0, 5);

  const getBeneficioTitle = (beneficioId: string) => {
    const beneficio = beneficios.find(b => b.id === beneficioId);
    return beneficio?.titulo || 'Beneficio eliminado';
  };

  const getResultIcon = (resultado: string) => {
    switch (resultado) {
      case 'valido':
        return CheckCircle;
      case 'invalido':
      case 'vencido':
      case 'agotado':
      case 'no_autorizado':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getResultColor = (resultado: string) => {
    switch (resultado) {
      case 'valido':
        return 'text-emerald-600 bg-emerald-100';
      case 'invalido':
      case 'vencido':
      case 'agotado':
      case 'no_autorizado':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-amber-600 bg-amber-100';
    }
  };

  const getResultText = (resultado: string) => {
    switch (resultado) {
      case 'valido':
        return 'Válida';
      case 'invalido':
        return 'Inválida';
      case 'vencido':
        return 'Vencido';
      case 'agotado':
        return 'Agotado';
      case 'no_autorizado':
        return 'No autorizado';
      default:
        return resultado;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-slate-200/50"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Últimas validaciones
            </h3>
            <p className="text-sm text-slate-600">
              Actividad reciente de tu comercio
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/comercio/validaciones')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="text-slate-600 border-slate-300 hover:bg-slate-50"
        >
          Ver todas
        </Button>
      </div>

      {/* Validations Table */}
      {recentValidations.length > 0 ? (
        <div className="overflow-hidden">
          {/* Table Header - Hidden on mobile */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 rounded-xl mb-4 text-sm font-semibold text-slate-600">
            <div className="col-span-3">Fecha y hora</div>
            <div className="col-span-3">Socio</div>
            <div className="col-span-3">Beneficio</div>
            <div className="col-span-2">Asociación</div>
            <div className="col-span-1">Resultado</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {recentValidations.map((validacion, index) => {
              const ResultIcon = getResultIcon(validacion.resultado);
              
              return (
                <motion.div
                  key={validacion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="group"
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/50 hover:border-slate-300/50 hover:shadow-md transition-all duration-300">
                    <div className="col-span-3">
                      <p className="font-semibold text-slate-900">
                        {format(validacion.fechaHora.toDate(), 'dd/MM/yyyy')}
                      </p>
                      <p className="text-sm text-slate-600">
                        {format(validacion.fechaHora.toDate(), 'HH:mm')}
                      </p>
                    </div>
                    
                    <div className="col-span-3">
                      <p className="font-semibold text-slate-900">
                        {validacion.socioId.substring(0, 8)}...
                      </p>
                      <p className="text-sm text-slate-600">ID del socio</p>
                    </div>
                    
                    <div className="col-span-3">
                      <p className="font-semibold text-slate-900 truncate">
                        {getBeneficioTitle(validacion.beneficioId)}
                      </p>
                      {validacion.montoTransaccion && (
                        <p className="text-sm text-slate-600">
                          ${validacion.montoTransaccion.toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    <div className="col-span-2">
                      <p className="text-sm text-slate-600 truncate">
                        {validacion.asociacionId.substring(0, 12)}...
                      </p>
                    </div>
                    
                    <div className="col-span-1">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${getResultColor(validacion.resultado)}`}>
                        <ResultIcon className="w-4 h-4" />
                        <span className="hidden xl:inline">
                          {getResultText(validacion.resultado)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="lg:hidden p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/50">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {format(validacion.fechaHora.toDate(), 'dd/MM/yyyy HH:mm')}
                        </p>
                        <p className="text-sm text-slate-600">
                          Socio: {validacion.socioId.substring(0, 8)}...
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold ${getResultColor(validacion.resultado)}`}>
                        <ResultIcon className="w-4 h-4" />
                        {getResultText(validacion.resultado)}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium text-slate-900 truncate">
                        {getBeneficioTitle(validacion.beneficioId)}
                      </p>
                      <p className="text-sm text-slate-600">
                        Asociación: {validacion.asociacionId.substring(0, 15)}...
                      </p>
                      {validacion.montoTransaccion && (
                        <p className="text-sm font-semibold text-slate-700">
                          Monto: ${validacion.montoTransaccion.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900 mb-2">
            No hay validaciones aún
          </h4>
          <p className="text-slate-600 mb-6">
            Cuando los socios empiecen a usar tus beneficios, las validaciones aparecerán aquí.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard/comercio/beneficios')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Crear primer beneficio
          </Button>
        </div>
      )}
    </motion.div>
  );
};