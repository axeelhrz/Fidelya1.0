import React from 'react';
import { motion } from 'framer-motion';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  ChevronRight,
  Sparkles,
  CalendarDays
} from 'lucide-react';

interface WeekSelectorProps {
  currentWeekStart: Date;
  onSelectWeek: (weekStart: Date) => void;
}

export function WeekSelector({ currentWeekStart, onSelectWeek }: WeekSelectorProps) {
  // Obtener fecha de inicio de la semana actual (lunes)
  const today = new Date();
  const currentWeek = startOfWeek(today, { weekStartsOn: 1, locale: es });
  // Próxima semana
  const nextWeek = addWeeks(currentWeek, 1);

  // Formatear las fechas para mostrar
  const formatWeekRange = (date: Date) => {
    const weekStart = format(date, 'd MMM', { locale: es });
    const weekEnd = format(addWeeks(date, 1).valueOf() - 24 * 60 * 60 * 1000, 'd MMM', { locale: es });
    return `${weekStart} - ${weekEnd}`;
  };

  const formatWeekYear = (date: Date) => {
    return format(date, 'yyyy', { locale: es });
  };

  const isCurrentWeekSelected = format(currentWeekStart, 'yyyy-MM-dd') === format(currentWeek, 'yyyy-MM-dd');
  const isNextWeekSelected = format(currentWeekStart, 'yyyy-MM-dd') === format(nextWeek, 'yyyy-MM-dd');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="mb-6 border-0 shadow-xl bg-gradient-to-r from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-2xl overflow-hidden">
        {/* Header con gradiente */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]" />
          
          <CardContent className="relative z-10 p-6 pb-4">
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Selecciona la semana</h3>
                <p className="text-sm text-gray-600">Elige el período para hacer tus pedidos</p>
              </div>
            </motion.div>
          </CardContent>
        </div>

        <CardContent className="p-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Semana Actual */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className={`
                  w-full h-auto p-0 rounded-2xl overflow-hidden border-2 transition-all duration-300
                  ${isCurrentWeekSelected 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }
                `}
                onClick={() => onSelectWeek(currentWeek)}
              >
                <div className="w-full p-6 text-left">
                  {/* Header de la card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${isCurrentWeekSelected 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-lg text-gray-900">Semana actual</span>
                    </div>
                    
                    {isCurrentWeekSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Badge className="bg-blue-500 text-white border-0">
                          Seleccionada
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Información de fechas */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-lg font-semibold text-gray-800">
                        {formatWeekRange(currentWeek)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatWeekYear(currentWeek)}
                    </div>
                  </div>

                  {/* Indicador visual */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Disponible ahora
                    </span>
                    <ChevronRight className={`
                      w-5 h-5 transition-colors duration-200
                      ${isCurrentWeekSelected ? 'text-blue-500' : 'text-gray-400'}
                    `} />
                  </div>
                </div>
              </Button>
            </motion.div>

            {/* Próxima Semana */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className={`
                  w-full h-auto p-0 rounded-2xl overflow-hidden border-2 transition-all duration-300
                  ${isNextWeekSelected 
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/50'
                  }
                `}
                onClick={() => onSelectWeek(nextWeek)}
              >
                <div className="w-full p-6 text-left">
                  {/* Header de la card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${isNextWeekSelected 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-lg text-gray-900">Próxima semana</span>
                    </div>
                    
                    {isNextWeekSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Badge className="bg-purple-500 text-white border-0">
                          Seleccionada
                        </Badge>
                      </motion.div>
                    )}
                  </div>

                  {/* Información de fechas */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-lg font-semibold text-gray-800">
                        {formatWeekRange(nextWeek)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatWeekYear(nextWeek)}
                    </div>
                  </div>

                  {/* Indicador visual */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Planifica con tiempo
                    </span>
                    <ChevronRight className={`
                      w-5 h-5 transition-colors duration-200
                      ${isNextWeekSelected ? 'text-purple-500' : 'text-gray-400'}
                    `} />
                  </div>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* Información adicional */}
          <motion.div
            variants={itemVariants}
            className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border border-blue-100/50"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  💡 Consejo
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Puedes hacer pedidos para la semana actual hasta el domingo anterior, 
                  y para la próxima semana con mayor anticipación.
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
