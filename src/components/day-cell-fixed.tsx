import React from 'react';
import { motion } from 'framer-motion';
import { addDays, startOfWeek, format, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayCell, MenuOption } from './day-cell';
import { 
  Calendar,
  Clock,
  Star,
  Sparkles,
  Sun
} from 'lucide-react';

interface WeekViewProps {
  startDate: Date;
  menuOptions: {
    almuerzos: Record<string, MenuOption[]>;
    colaciones: Record<string, MenuOption[]>;
  };
  selectedOptions: {
    [date: string]: {
      almuerzo?: string;
      colacion?: string;
    };
  };
  onSelectOption: (date: string, type: 'almuerzo' | 'colacion', optionId: string) => void;
  isDisabled?: boolean;
}

export function WeekView({
  startDate,
  menuOptions,
  selectedOptions,
  onSelectOption,
  isDisabled = false
}: WeekViewProps) {
  // Asegurarnos que startDate sea el lunes de la semana
  const mondayOfWeek = startOfWeek(startDate, { weekStartsOn: 1, locale: es });
  
  // Crear un array de días de lunes a viernes
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(mondayOfWeek, i));

  // Función para obtener el estado del día
  const getDayStatus = (date: Date) => {
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    return 'normal';
  };

  // Función para obtener el icono del día
  const getDayIcon = (date: Date) => {
    const status = getDayStatus(date);
    switch (status) {
      case 'today':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'tomorrow':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      default:
        return <Sun className="w-4 h-4 text-gray-400" />;
    }
  };

  // Calcular estadísticas de la semana
  const getWeekStats = () => {
    let totalSlots = 0;
    let completedSlots = 0;
    
    weekDays.forEach(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayAlmuerzos = menuOptions.almuerzos[dateStr] || [];
      const dayColaciones = menuOptions.colaciones[dateStr] || [];
      const dayOptions = selectedOptions[dateStr] || {};
      
      if (dayAlmuerzos.length > 0) {
        totalSlots++;
        if (dayOptions.almuerzo) completedSlots++;
      }
      
      if (dayColaciones.length > 0) {
        totalSlots++;
        if (dayOptions.colacion) completedSlots++;
      }
    });
    
    return { totalSlots, completedSlots, percentage: totalSlots > 0 ? (completedSlots / totalSlots) * 100 : 0 };
  };

  const weekStats = getWeekStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const dayVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header de la semana */}
      <motion.div
        variants={headerVariants}
        className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl p-6 border border-blue-100/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Semana del {format(mondayOfWeek, 'd', { locale: es })} al {format(addDays(mondayOfWeek, 4), 'd MMMM', { locale: es })}
              </h3>
              <p className="text-sm text-gray-600">
                {format(mondayOfWeek, 'yyyy', { locale: es })} • Selecciona tus menús diarios
              </p>
            </div>
          </div>
          
          {/* Estadísticas de progreso */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {weekStats.completedSlots}/{weekStats.totalSlots}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Selecciones
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Progreso semanal</span>
            <span className="text-sm font-bold text-gray-900">{Math.round(weekStats.percentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${weekStats.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Días de la semana */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {weekDays.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayOptions = selectedOptions[dateStr] || {};
          const dayStatus = getDayStatus(date);
          
          // Obtener opciones de menú para este día específico o usar un array vacío
          const dayAlmuerzos = menuOptions.almuerzos[dateStr] || [];
          const dayColaciones = menuOptions.colaciones[dateStr] || [];

          // Calcular si el día está completo
          const hasAlmuerzoOptions = dayAlmuerzos.length > 0;
          const hasColacionOptions = dayColaciones.length > 0;
          const hasAlmuerzoSelected = hasAlmuerzoOptions && dayOptions.almuerzo;
          const hasColacionSelected = hasColacionOptions && dayOptions.colacion;
          
          const totalOptionsForDay = (hasAlmuerzoOptions ? 1 : 0) + (hasColacionOptions ? 1 : 0);
          const selectedOptionsForDay = (hasAlmuerzoSelected ? 1 : 0) + (hasColacionSelected ? 1 : 0);
          const isDayComplete = totalOptionsForDay > 0 && selectedOptionsForDay === totalOptionsForDay;

          return (
            <motion.div
              key={dateStr}
              variants={dayVariants}
              className="relative group"
            >
              {/* Indicador de día especial */}
              {dayStatus !== 'normal' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`
                    absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg
                    ${dayStatus === 'today' 
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }
                  `}
                >
                  {getDayIcon(date)}
                </motion.div>
              )}

              {/* Indicador de completitud */}
              {isDayComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </motion.div>
              )}

              {/* Header del día */}
              <div className={`
                mb-3 p-3 rounded-xl border-2 transition-all duration-300
                ${dayStatus === 'today' 
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
                  : dayStatus === 'tomorrow'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
                }
                ${isDayComplete ? 'ring-2 ring-emerald-200' : ''}
              `}>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 capitalize">
                    {format(date, 'EEEE', { locale: es })}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {format(date, 'd', { locale: es })}
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    {format(date, 'MMM', { locale: es })}
                  </div>
                  
                  {/* Indicador de estado del día */}
                  {dayStatus === 'today' && (
                    <div className="mt-2 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      Hoy
                    </div>
                  )}
                  {dayStatus === 'tomorrow' && (
                    <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      Mañana
                    </div>
                  )}
                </div>
              </div>

              {/* Contenido del día */}
              <div className="w-full">
                <DayCell
                  date={date}
                  almuerzos={dayAlmuerzos}
                  colaciones={dayColaciones}
                  selectedAlmuerzo={dayOptions.almuerzo}
                  selectedColacion={dayOptions.colacion}
                  onSelectAlmuerzo={(optionId) => onSelectOption(dateStr, 'almuerzo', optionId)}
                  onSelectColacion={(optionId) => onSelectOption(dateStr, 'colacion', optionId)}
                  isDisabled={isDisabled}
                />
              </div>

              {/* Indicador de progreso del día */}
              {totalOptionsForDay > 0 && (
                <div className="mt-3 px-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600">Progreso</span>
                    <span className="text-xs font-bold text-gray-800">
                      {selectedOptionsForDay}/{totalOptionsForDay}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className={`
                        h-full rounded-full transition-all duration-500
                        ${isDayComplete 
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                          : 'bg-gradient-to-r from-blue-400 to-purple-500'
                        }
                      `}
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedOptionsForDay / totalOptionsForDay) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer informativo */}
      <motion.div
        variants={headerVariants}
        className="bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-4 border border-gray-200/50"
      >
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Recordatorio:</span> Puedes cambiar tus selecciones hasta el domingo anterior a la semana elegida.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
