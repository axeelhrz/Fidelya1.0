import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader
} from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

  return (
    <Card className={`w-full h-full ${isDisabled ? 'opacity-60' : ''}`}>
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-center">
          <div className="font-semibold">{formattedDay}</div>
          <Badge variant="outline" className="font-medium">
            {dayNumber} {monthShort}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2 space-y-3">
        {/* Dropdown de almuerzo con mayor z-index */}
        <div className="relative z-30">
          <Label htmlFor={`almuerzo-${format(date, 'yyyy-MM-dd')}`} className="text-sm font-medium">
            Almuerzo
          </Label>
          <Select
            disabled={isDisabled}
            value={selectedAlmuerzo}
            onValueChange={onSelectAlmuerzo}
          >
            <SelectTrigger id={`almuerzo-${format(date, 'yyyy-MM-dd')}`} className="mt-1 w-full text-sm">
              <SelectValue placeholder="Seleccionar almuerzo" />
            </SelectTrigger>
            <SelectContent 
              className="max-h-[180px] overflow-y-auto z-[100] min-w-[220px]" 
              position="popper" 
              sideOffset={5} 
              align="start"
            >
              {almuerzos.map((option) => (
                <SelectItem key={option.id} value={option.id} className="text-xs sm:text-sm py-1">
                  {option.descripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Dropdown de colación con z-index menor */}
        <div className="relative z-20">
          <Label htmlFor={`colacion-${format(date, 'yyyy-MM-dd')}`} className="text-sm font-medium">
            Colación
          </Label>
          <Select
            disabled={isDisabled}
            value={selectedColacion}
            onValueChange={onSelectColacion}
          >
            <SelectTrigger id={`colacion-${format(date, 'yyyy-MM-dd')}`} className="mt-1 w-full text-sm">
              <SelectValue placeholder="Seleccionar colación" />
            </SelectTrigger>
            <SelectContent 
              className="max-h-[180px] overflow-y-auto z-[90] min-w-[220px]" 
              position="popper" 
              sideOffset={5} 
              align="start"
            >
              {colaciones.map((option) => (
                <SelectItem key={option.id} value={option.id} className="text-xs sm:text-sm py-1">
                  {option.descripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
