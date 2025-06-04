"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Coffee, Utensils } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { formatoMoneda } from "@/lib/utils"
import { addDays, format, parseISO, startOfWeek } from "date-fns"
import { es } from "date-fns/locale"

// Interfaces para almuerzos y colaciones
interface Almuerzo {
  id: string
  descripcion: string
  fecha: string
  dia: string
  codigo: string
  precio: number
}

interface Colacion {
  id: string
  codigo: string
  descripcion: string
  precio: number
}

// Colores para las opciones del menú
const OPTION_COLORS = [
  "bg-yellow-100 border-yellow-300",
  "bg-green-100 border-green-300",
  "bg-blue-100 border-blue-300",
  "bg-purple-100 border-purple-300",
];

// Función para obtener el texto del día de la semana
function getDayName(date: Date): string {
  return format(date, 'EEEE', { locale: es }).toUpperCase();
}

// Función para formatear la fecha
function formatDate(date: Date): string {
  return format(date, 'd', { locale: es });
}

// Componente WeekSelector para seleccionar semanas
function WeekSelector({ currentDate, onWeekChange }: { currentDate: Date, onWeekChange: (date: Date) => void }) {
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Lunes como inicio de semana
  const endDate = addDays(startDate, 4); // Viernes
  
  return (
    <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-md shadow-sm">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onWeekChange(addDays(currentDate, -7))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <h2 className="text-lg font-semibold">
        {format(startDate, 'd', { locale: es })} - {format(endDate, 'd')} de {format(endDate, 'MMMM yyyy', { locale: es })}
      </h2>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onWeekChange(addDays(currentDate, 7))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Componente para mostrar un día específico con sus opciones de almuerzo
function DayColumn({ date, almuerzos }: { date: Date, almuerzos: Almuerzo[] }) {
  const dayName = getDayName(date);
  const dayNumber = formatDate(date);
  const formattedDate = format(date, 'yyyy-MM-dd');
  const optionsForDay = almuerzos.filter(almuerzo => almuerzo.fecha === formattedDate);
  
  return (
    <div className="flex flex-col">
      <div className="bg-yellow-500 text-white text-center py-2 rounded-t-md font-bold">
        {dayName} {dayNumber}
      </div>
      <div className="flex-1 p-1 bg-gray-50 rounded-b-md">
        {optionsForDay.length > 0 ? (
          <div className="space-y-2">
            {optionsForDay.map((almuerzo, index) => (
              <div 
                key={almuerzo.id} 
                className={`p-3 rounded-md border ${OPTION_COLORS[index % OPTION_COLORS.length]} transition-transform hover:scale-[1.02]`}
              >
                <div className="mb-1">
                  <span className="text-xs font-semibold bg-white px-2 py-0.5 rounded-full">
                    OPCIÓN {index + 1}
                  </span>
                </div>
                <p className="text-sm font-medium line-clamp-3">{almuerzo.descripcion}</p>
                <div className="mt-1 text-xs text-gray-500">Código: {almuerzo.codigo}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4 text-sm text-gray-500">
            No hay opciones disponibles
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar las colaciones
function SnackCard({ colacion, colorClass }: { colacion: Colacion, colorClass: string }) {
  return (
    <div className={`p-4 rounded-md border ${colorClass} transition-all hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-sm">{colacion.descripcion}</h3>
          <p className="text-xs text-gray-500 mt-1">Código: {colacion.codigo}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">${formatoMoneda(colacion.precio)}</p>
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [almuerzos, setAlmuerzos] = useState<Almuerzo[]>([]);
  const [colaciones, setColaciones] = useState<Colacion[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Obtener datos de almuerzos y colaciones
  useEffect(() => {
    async function fetchMenuData() {
      setLoading(true);
      
      // Obtener almuerzos
      const { data: almuerzosData, error: almuerzosError } = await supabase
        .from("products")
        .select("*");
      
      if (almuerzosError) {
        console.error("Error al obtener almuerzos:", almuerzosError);
      } else if (almuerzosData) {
        const transformedAlmuerzos = almuerzosData
          .filter(item => item.type === 'almuerzo')
          .map(item => ({
            id: item.id,
            descripcion: item.description || item.name,
            fecha: item.available_date,
            dia: item.day_of_week,
            codigo: item.code,
            precio: item.price_student
          }));
        setAlmuerzos(transformedAlmuerzos);
      }
      
      // Obtener colaciones
      const { data: colacionesData, error: colacionesError } = await supabase
        .from("products")
        .select("*");
      
      if (colacionesError) {
        console.error("Error al obtener colaciones:", colacionesError);
      } else if (colacionesData) {
        const transformedColaciones = colacionesData
          .filter(item => item.type === 'colacion')
          .map(item => ({
            id: item.id,
            codigo: item.code,
            descripcion: item.description || item.name,
            precio: item.price_student
          }));
        setColaciones(transformedColaciones);
      }
      
      setLoading(false);
    }
    
    fetchMenuData();
  }, []);
  
  // Generar los días de la semana
  const weekDays = Array.from({ length: 5 }).map((_, index) => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Lunes
    return addDays(startDate, index);
  });
  
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Menú del Casino</h1>
        <p className="text-muted-foreground">
          Opciones nutritivas y deliciosas para nuestros estudiantes
        </p>
      </div>
      
      <Tabs defaultValue="almuerzos" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="almuerzos" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" /> Almuerzos
          </TabsTrigger>
          <TabsTrigger value="colaciones" className="flex items-center gap-2">
            <Coffee className="h-4 w-4" /> Colaciones
          </TabsTrigger>
        </TabsList>
        
        {/* Sección de Almuerzos */}
        <TabsContent value="almuerzos" className="mt-6">
          <WeekSelector 
            currentDate={currentDate} 
            onWeekChange={(date) => setCurrentDate(date)} 
          />
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weekDays.map((day) => (
                <DayColumn 
                  key={format(day, 'yyyy-MM-dd')} 
                  date={day} 
                  almuerzos={almuerzos} 
                />
              ))}
            </div>
          )}
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Información de Almuerzos</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Los almuerzos se sirven de 12:00 a 14:00 hrs</li>
              <li>• Todos nuestros platos son preparados el mismo día</li>
              <li>• Los pedidos deben realizarse con al menos 24 horas de anticipación</li>
              <li className="pt-2 font-medium">• Precios:</li>
              <li className="pl-4">• Estudiantes: $5.500</li>
              <li className="pl-4">• Funcionarios: $4.875</li>
            </ul>
          </div>
        </TabsContent>
        
        {/* Sección de Colaciones */}
        <TabsContent value="colaciones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="h-5 w-5" /> Colaciones Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {colaciones.length > 0 ? (
                    colaciones.map((colacion, index) => (
                      <SnackCard 
                        key={colacion.id} 
                        colacion={colacion} 
                        colorClass={OPTION_COLORS[index % OPTION_COLORS.length]} 
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No hay colaciones disponibles actualmente
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Información de Colaciones</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Las colaciones están disponibles durante toda la jornada escolar</li>
              <li>• Opciones saludables y energéticas para nuestros estudiantes</li>
              <li>• Ideales para la media mañana o la tarde</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
