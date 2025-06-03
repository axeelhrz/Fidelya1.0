import React from 'react';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

  const isCurrentWeekSelected = format(currentWeekStart, 'yyyy-MM-dd') === format(currentWeek, 'yyyy-MM-dd');
  const isNextWeekSelected = format(currentWeekStart, 'yyyy-MM-dd') === format(nextWeek, 'yyyy-MM-dd');

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="text-lg font-medium mb-3">Selecciona la semana:</div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant={isCurrentWeekSelected ? "default" : "outline"}
            className="flex-1 justify-start"
            onClick={() => onSelectWeek(currentWeek)}
          >
            <div className="flex flex-col items-start">
              <span>Semana actual</span>
              <span className="text-sm opacity-80">{formatWeekRange(currentWeek)}</span>
            </div>
          </Button>
          
          <Button
            variant={isNextWeekSelected ? "default" : "outline"}
            className="flex-1 justify-start"
            onClick={() => onSelectWeek(nextWeek)}
          >
            <div className="flex flex-col items-start">
              <span>Próxima semana</span>
              <span className="text-sm opacity-80">{formatWeekRange(nextWeek)}</span>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
