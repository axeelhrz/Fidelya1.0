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

  const dayVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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
    <div className="space-y-6">
      {/* Header de la semana con estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl p-6 border border-blue-100/50 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Semana del {format(mondayOfWeek, 'd', { locale: es })} al {format(addDays(mondayOfWeek, 4), 'd MMMM', { locale: es })}
              </h3>
              <p className="text-sm text-gray-600">
                {format(mondayOfWeek, 'yyyy', { locale: es })}
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
            <span className="text-sm font-medium text-gray-700">Progreso de la semana</span>
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

      {/* Vista de días */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {weekDays.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const dayOptions = selectedOptions[dateStr] || {};
          const dayStatus = getDayStatus(date);
          
          // Obtener opciones de menú para este día específico o usar un array vacío
          const dayAlmuerzos = menuOptions.almuerzos[dateStr] || [];
          const dayColaciones = menuOptions.colaciones[dateStr] || [];

          // Verificar si el día está completo
          const hasAlmuerzoOptions = dayAlmuerzos.length > 0;
          const hasColacionOptions = dayColaciones.length > 0;
          const isAlmuerzoSelected = hasAlmuerzoOptions && dayOptions.almuerzo;
          const isColacionSelected = hasColacionOptions && dayOptions.colacion;
          
          let completionStatus = 'empty';
          if (hasAlmuerzoOptions || hasColacionOptions) {
            const requiredSelections = (hasAlmuerzoOptions ? 1 : 0) + (hasColacionOptions ? 1 : 0);
            const madeSelections = (isAlmuerzoSelected ? 1 : 0) + (isColacionSelected ? 1 : 0);
            
            if (madeSelections === requiredSelections) {
              completionStatus = 'complete';
            } else if (madeSelections > 0) {
              completionStatus = 'partial';
            } else {
              completionStatus = 'pending';
            }
          }

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
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="absolute -top-2 -right-2 z-10"
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shadow-lg
                    ${dayStatus === 'today' 
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                      : 'bg-gradient-to-br from-blue-400 to-blue-600'
                    }
                  `}>
                    {getDayIcon(date)}
                  </div>
                </motion.div>
              )}

              {/* Indicador de completitud */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="absolute -top-1 -left-1 z-10"
              >
                <div className={`
                  w-4 h-4 rounded-full border-2 border-white shadow-sm
                  ${completionStatus === 'complete' 
                    ? 'bg-emerald-500' 
                    : completionStatus === 'partial'
                    ? 'bg-amber-500'
                    : completionStatus === 'pending'
                    ? 'bg-red-500'
                    : 'bg-gray-300'
                  }
                `} />
              </motion.div>

              {/* Header del día */}
              <div className={`
                mb-3 p-3 rounded-xl border-2 transition-all duration-300
                ${dayStatus === 'today' 
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' 
                  : dayStatus === 'tomorrow'
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                  : 'bg-gray-50 border-gray-200'
                }
                ${!isDisabled && 'group-hover:border-blue-300 group-hover:shadow-md'}
              `}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    {getDayIcon(date)}
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                      {format(date, 'EEEE', { locale: es })}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {format(date, 'd', { locale: es })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(date, 'MMM', { locale: es })}
                  </div>
                </div>
              </div>

              {/* Componente DayCell */}
              <motion.div
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>

              {/* Etiqueta de estado del día */}
              {dayStatus !== 'normal' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.7 }}
                  className="mt-2 text-center"
                >
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                    ${dayStatus === 'today' 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }
                  `}>
                    <Clock className="w-3 h-3" />
                    {dayStatus === 'today' ? 'Hoy' : 'Mañana'}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Leyenda de estados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
      >
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Leyenda de estados</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Completo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600">Parcial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-gray-600">Sin opciones</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
