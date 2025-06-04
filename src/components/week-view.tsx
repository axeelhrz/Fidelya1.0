import React from 'react';
import { addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { DayCell, MenuOption } from './day-cell';

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

  return (
    <div className="flex flex-col space-y-6 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
      {weekDays.map((date) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayOptions = selectedOptions[dateStr] || {};
        
        // Obtener opciones de menú para este día específico o usar un array vacío
        const dayAlmuerzos = menuOptions.almuerzos[dateStr] || [];
        const dayColaciones = menuOptions.colaciones[dateStr] || [];
        
        return (
          <div key={dateStr} className="w-full">
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
        );
      })}
    </div>
  );
}
