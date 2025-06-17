"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface MenuOption {
  codigo: string;
  descripcion: string;
  dia: string;
  fecha: string;
  precio_estudiante: number;
  precio_funcionario: number;
  tipo_dia: string;
}

interface MenuPreviewProps {
  options: MenuOption[];
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export default function MenuPreview({ options, onSave, isLoading }: MenuPreviewProps) {
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await onSave();
      toast({
        title: "Menú guardado correctamente",
        description: `Se han guardado ${options.length} opciones de menú.`,
      });
    } catch (err: any) {
      setError(err.message || "Error al guardar el menú");
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: err.message || "No se pudo guardar el menú. Intenta de nuevo.",
      });
    }
  };

  // Agrupar opciones por día
  const optionsByDay: Record<string, MenuOption[]> = {};
  options.forEach(option => {
    if (!optionsByDay[option.dia]) {
      optionsByDay[option.dia] = [];
    }
    optionsByDay[option.dia].push(option);
  });

  // Obtener el nombre de los días en español
  const getDayName = (day: string): string => {
    const days: Record<string, string> = {
      "LUNES": "Lunes",
      "MARTES": "Martes", 
      "MIERCOLES": "Miércoles",
      "JUEVES": "Jueves",
      "VIERNES": "Viernes"
    };
    return days[day] || day;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vista previa del menú</h3>
        <Button 
          onClick={handleSave} 
          disabled={isLoading || options.length === 0}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? "Guardando..." : "Guardar en base de datos"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Error al procesar</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {options.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No se ha detectado información de menú en el PDF.</p>
          <p className="text-sm text-gray-400 mt-2">Asegúrate que el PDF tenga el formato correcto.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          {Object.keys(optionsByDay).map(day => (
            <div key={day} className="mb-6">
              <div className="bg-green-50 p-3 border-b border-green-100">
                <h4 className="font-medium text-green-800">{getDayName(day)}</h4>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Opción</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="w-32 text-right">Precio Est.</TableHead>
                    <TableHead className="w-32 text-right">Precio Func.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optionsByDay[day].map((option, index) => (
                    <TableRow key={`${day}-${option.codigo}-${index}`}>
                      <TableCell className="font-medium">
                        <Badge variant="outline" className="font-mono">
                          {option.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell>{option.descripcion}</TableCell>
                      <TableCell className="text-right">${option.precio_estudiante}</TableCell>
                      <TableCell className="text-right">${option.precio_funcionario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}

      {options.length > 0 && (
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-700">
              Se encontraron <strong>{options.length}</strong> opciones de menú
            </span>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            size="sm"
          >
            Guardar en base de datos
          </Button>
        </div>
      )}
    </div>
  );
}
