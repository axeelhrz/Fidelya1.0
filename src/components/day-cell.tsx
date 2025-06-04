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
          <div className="font-semibold text-base">{formattedDay}</div>
          <Badge variant="outline" className="font-medium text-xs sm:text-sm">
            {dayNumber} {monthShort}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2 space-y-4">
        {/* Dropdown de almuerzo con mayor z-index */}
        <div className="relative z-30">
          <Label htmlFor={`almuerzo-${format(date, 'yyyy-MM-dd')}`} className="text-sm font-medium mb-1 block">
            Almuerzo
          </Label>
          <Select
            disabled={isDisabled}
            value={selectedAlmuerzo || ""}
            onValueChange={onSelectAlmuerzo}
          >
            <SelectTrigger 
              id={`almuerzo-${format(date, 'yyyy-MM-dd')}`} 
              className="w-full text-sm min-h-[44px] py-2 px-3"
            >
              <SelectValue placeholder="Seleccionar almuerzo" className="text-sm sm:text-base" />
            </SelectTrigger>
            <SelectContent 
              className="max-h-[40vh] overflow-y-auto bg-white shadow-md border-2 border-gray-200" 
              position="popper" 
              sideOffset={5} 
              align="center"
            >
              {almuerzos && almuerzos.length > 0 ? (
                almuerzos.map((option) => (
                  <SelectItem 
                    key={option.id} 
                    value={option.id} 
                    className="py-3 px-3 text-sm sm:text-base hover:bg-blue-50"
                  >
                    <div className="line-clamp-2">
                      {option.descripcion} {option.precio ? `($${option.precio})` : ''}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-options" disabled className="py-3 px-3 text-gray-400">
                  No hay menú disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        {/* Dropdown de colación con z-index menor */}
        <div className="relative z-20">
          <Label htmlFor={`colacion-${format(date, 'yyyy-MM-dd')}`} className="text-sm font-medium mb-1 block">
            Colación
          </Label>
          <Select
            disabled={isDisabled}
            value={selectedColacion || ""}
            onValueChange={onSelectColacion}
          >
            <SelectTrigger 
              id={`colacion-${format(date, 'yyyy-MM-dd')}`} 
              className="w-full text-sm min-h-[44px] py-2 px-3"
            >
              <SelectValue placeholder="Seleccionar colación" className="text-sm sm:text-base" />
            </SelectTrigger>
            <SelectContent 
              className="max-h-[40vh] overflow-y-auto bg-white shadow-md border-2 border-gray-200" 
              position="popper" 
              sideOffset={5} 
              align="center"
            >
              {colaciones && colaciones.length > 0 ? (
                colaciones.map((option) => (
                  <SelectItem 
                    key={option.id} 
                    value={option.id} 
                    className="py-3 px-3 text-sm sm:text-base hover:bg-blue-50"
                  >
                    <div className="line-clamp-2">
                      {option.descripcion} {option.precio ? `($${option.precio})` : ''}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-options" disabled className="py-3 px-3 text-gray-400">
                  No hay menú disponible
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
