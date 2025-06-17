import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader
} from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Utensils, 
  Coffee, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Calendar,
  DollarSign
} from 'lucide-react';

export interface MenuOption {
  id: string;
  codigo?: string;
  descripcion: string;
  precio?: number;
  tipo: 'almuerzo' | 'colacion';
  fecha?: string;
  dia?: string;
  tipo_dia?: string;
}

interface DayCellProps {
  date: Date;
  almuerzos: MenuOption[];
  colaciones: MenuOption[];
  selectedAlmuerzo?: string;
  selectedColacion?: string;
  onSelectAlmuerzo: (optionId: string) => void;
  onSelectColacion: (optionId: string) => void;
  isDisabled?: boolean;
}

export function DayCell({
  date,
  almuerzos,
  colaciones,
  selectedAlmuerzo,
  selectedColacion,
  onSelectAlmuerzo,
  onSelectColacion,
  isDisabled = false
}: DayCellProps) {
  // Capitaliza el nombre del día
  const formattedDay = format(date, 'EEEE', { locale: es })
    .charAt(0).toUpperCase() + format(date, 'EEEE', { locale: es }).slice(1);
  const dayNumber = format(date, 'd');
  const monthShort = format(date, 'MMM', { locale: es });

  // Determinar el estado del día
  const getDayStatus = () => {
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    if (isPast(date)) return 'past';
    return 'future';
  };

  const dayStatus = getDayStatus();

  // Configuración de estilos según el estado del día
  const dayConfig = {
    today: {
      bgGradient: 'from-amber-50 via-orange-50 to-amber-50',
      borderColor: 'border-amber-200',
      headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
      icon: <Star className="w-4 h-4 text-white" />,
      badge: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    tomorrow: {
      bgGradient: 'from-blue-50 via-indigo-50 to-blue-50',
      borderColor: 'border-blue-200',
      headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      icon: <Sparkles className="w-4 h-4 text-white" />,
      badge: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    past: {
      bgGradient: 'from-gray-50 via-slate-50 to-gray-50',
      borderColor: 'border-gray-200',
      headerBg: 'bg-gradient-to-r from-gray-400 to-slate-400',
      icon: <Clock className="w-4 h-4 text-white" />,
      badge: 'bg-gray-100 text-gray-600 border-gray-200'
    },
    future: {
      bgGradient: 'from-emerald-50 via-green-50 to-emerald-50',
      borderColor: 'border-emerald-200',
      headerBg: 'bg-gradient-to-r from-emerald-500 to-green-500',
      icon: <Calendar className="w-4 h-4 text-white" />,
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
  };

  const config = dayConfig[dayStatus];

  // Verificar si hay selecciones
  const hasAlmuerzoSelected = !!selectedAlmuerzo;
  const hasColacionSelected = !!selectedColacion;
  const isCompleted = hasAlmuerzoSelected && hasColacionSelected;

  // Formatear precio
  const formatPrice = (price?: number) => {
    if (!price) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className={`
        w-full h-full transition-all duration-300 border-2 rounded-2xl overflow-hidden
        bg-gradient-to-br ${config.bgGradient} ${config.borderColor}
        ${isDisabled ? 'opacity-60' : 'hover:shadow-xl'}
        ${isCompleted ? 'ring-2 ring-green-200 ring-offset-2' : ''}
      `}>
        {/* Header del día */}
        <CardHeader className="p-0 relative overflow-hidden">
          <div className={`${config.headerBg} p-4 relative`}>
            {/* Efectos de fondo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
            
            <div className="relative z-10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {config.icon}
                <div>
                  <div className="font-bold text-white text-lg">{formattedDay}</div>
                  <div className="text-white/80 text-xs">
                    {dayStatus === 'today' ? 'Hoy' : 
                     dayStatus === 'tomorrow' ? 'Mañana' : 
                     dayStatus === 'past' ? 'Pasado' : 'Próximo'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={`${config.badge} font-semibold border`}>
                  {dayNumber} {monthShort}
                </Badge>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Selector de Almuerzo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-30"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                <Utensils className="w-3 h-3 text-orange-600" />
              </div>
                            <Label 
                              htmlFor={`almuerzo-${format(date, 'yyyy-MM-dd')}`} 
                              className="text-sm font-semibold text-gray-700"
                            >
                              Almuerzo
                            </Label>
                          </div>
                          
                          <Select
                            value={selectedAlmuerzo || ''}
                            onValueChange={onSelectAlmuerzo}
                            disabled={isDisabled || almuerzos.length === 0}
                          >
                            <SelectTrigger className="w-full bg-white/80 border-orange-200 hover:border-orange-300 focus:border-orange-400">
                              <SelectValue placeholder="Seleccionar almuerzo" />
                            </SelectTrigger>
                            <SelectContent>
                              {almuerzos.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  <div className="flex justify-between items-center w-full">
                                    <span className="flex-1">{option.descripcion}</span>
                                    {option.precio && (
                                      <span className="text-sm text-green-600 font-semibold ml-2">
                                        <DollarSign className="w-3 h-3 inline mr-1" />
                                        {formatPrice(option.precio)}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
              
                        {/* Selector de Colación */}
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="relative z-20"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Coffee className="w-3 h-3 text-blue-600" />
                            </div>
                            <Label 
                              htmlFor={`colacion-${format(date, 'yyyy-MM-dd')}`} 
                              className="text-sm font-semibold text-gray-700"
                            >
                              Colación
                            </Label>
                          </div>
                          
                          <Select
                            value={selectedColacion || ''}
                            onValueChange={onSelectColacion}
                            disabled={isDisabled || colaciones.length === 0}
                          >
                            <SelectTrigger className="w-full bg-white/80 border-blue-200 hover:border-blue-300 focus:border-blue-400">
                              <SelectValue placeholder="Seleccionar colación" />
                            </SelectTrigger>
                            <SelectContent>
                              {colaciones.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                  <div className="flex justify-between items-center w-full">
                                    <span className="flex-1">{option.descripcion}</span>
                                    {option.precio && (
                                      <span className="text-sm text-green-600 font-semibold ml-2">
                                        <DollarSign className="w-3 h-3 inline mr-1" />
                                        {formatPrice(option.precio)}
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              }