"use client";

import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";
// Usando un div con clases similares en lugar del componente Skeleton
// para evitar problemas de importación
import { Database } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";

// Definir tipos
interface PedidoDetalle {
  id: string;
  nombre_estudiante: string;
  nivel: string; // Este es el curso (ej. "PRIMERO BÁSICO")
  letra: string;
  opcion_elegida: string;
  tipo_pedido: string;
  dia_entrega: string;
  estado_pago: string;
}

const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
const niveles = ['PRE-KINDER', 'KINDER', 'PRIMERO BÁSICO', 'SEGUNDO BÁSICO', 'TERCERO BÁSICO', 
                'CUARTO BÁSICO', 'QUINTO BÁSICO', 'SEXTO BÁSICO', 'SÉPTIMO BÁSICO', 'OCTAVO BÁSICO', 
                'PRIMERO MEDIO', 'SEGUNDO MEDIO', 'TERCERO MEDIO', 'CUARTO MEDIO', 'TODOS'];

export default function PedidosDetalle() {
  const [pedidosDetalle, setPedidosDetalle] = useState<PedidoDetalle[]>([]);
  const [nivelSeleccionado, setNivelSeleccionado] = useState<string>("TODOS");
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>("LUNES");
  const [loading, setLoading] = useState<boolean>(true);
  const [fechas, setFechas] = useState<{[key: string]: string}>({});
  const { toast } = useToast();
  
  // Función para obtener el rango de fechas de la semana actual
  const obtenerRangoSemanaActual = () => {
    // Usar fecha fija para desarrollo - 26 de mayo de 2025 (lunes)
    const fechaBase = new Date(2025, 4, 26); // Mayo es 4 (0-indexed)
    
    // Generar fechas para toda la semana a partir de la fecha base (lunes)
    const fechasSemana: {[key: string]: string} = {};
    diasSemana.forEach((dia, index) => {
      const fecha = new Date(fechaBase);
      fecha.setDate(fechaBase.getDate() + index);
      // Formato YYYY-MM-DD
      const fechaStr = fecha.toISOString().split('T')[0];
      fechasSemana[dia] = fechaStr;
    });
    
    // Imprimir fechas para debugging
    console.log('Fechas calculadas (pedidos-detalle):', fechasSemana);
    
    return fechasSemana;
  };
  
  useEffect(() => {
    const fechasSemana = obtenerRangoSemanaActual();
    setFechas(fechasSemana);
    cargarPedidosDetalle(fechasSemana);
  }, [nivelSeleccionado, diaSeleccionado]);
  
  const cargarPedidosDetalle = async (fechasSemana: {[key: string]: string}) => {
    setLoading(true);
    try {
      // Verificar que tenemos las variables de entorno
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Faltan variables de entorno para Supabase');
      }
      
      console.log('Conectando a Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      // Fecha para el día seleccionado
      const fechaSeleccionada = fechasSemana[diaSeleccionado];
      console.log('Consultando pedidos para fecha:', fechaSeleccionada);
      
      let query = supabase
        .from('pedidos')
        .select(`
          id,
          nombre_estudiante,
          nivel,
          letra,
          opcion_elegida,
          tipo_pedido,
          dia_entrega,
          estado_pago
        `)
        .eq('dia_entrega', fechaSeleccionada)
        .order('nivel')
        .order('letra')
        .order('nombre_estudiante');
        
      if (nivelSeleccionado !== 'TODOS') {
        query = query.eq('nivel', nivelSeleccionado);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setPedidosDetalle(data || []);
    } catch (error: any) {
      console.error('Error cargando detalle de pedidos:', error);
      
      // Log más detallado para ayudar a diagnosticar
      if (error.code) {
        console.error(`Código de error: ${error.code}`);
      }
      if (error.details) {
        console.error(`Detalles: ${error.details}`);
      }
      if (error.hint) {
        console.error(`Sugerencia: ${error.hint}`);
      }
      if (error.stack) {
        console.error(`Stack: ${error.stack}`);
      }
      
      // Mensaje más descriptivo para el usuario
      toast({
        variant: 'destructive',
        title: 'Error al cargar detalles',
        description: error.message || 'No se pudieron cargar los detalles de los pedidos. Verifique la conexión con la base de datos.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Agrupar pedidos por curso y letra para mejor visualización
  const pedidosPorCurso: {[curso: string]: PedidoDetalle[]} = {};
  pedidosDetalle.forEach(pedido => {
    const cursoKey = `${pedido.nivel} ${pedido.letra}`.trim();
    if (!pedidosPorCurso[cursoKey]) {
      pedidosPorCurso[cursoKey] = [];
    }
    pedidosPorCurso[cursoKey].push(pedido);
  });
  
  // Obtener cursos ordenados
  const cursos = Object.keys(pedidosPorCurso).sort((a, b) => {
    // Extraer el número del curso para ordenar correctamente
    const numA = a.match(/(\d+)/)?.[1] || "";
    const numB = b.match(/(\d+)/)?.[1] || "";
    if (numA === numB) {
      // Si los números son iguales, ordenar por letra
      const letraA = a.split(" ").pop() || "";
      const letraB = b.split(" ").pop() || "";
      return letraA.localeCompare(letraB);
    }
    return parseInt(numA) - parseInt(numB);
  });
  
  const getEstadoBadge = (estado_pago: string) => {
    switch(estado_pago) {
      case 'PAGADO':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pagado</Badge>;
      case 'PENDIENTE':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>;
      case 'CANCELADO':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{estado_pago}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-col sm:flex-row gap-4">
          <div>
            <CardTitle>Detalle de Pedidos</CardTitle>
            <CardDescription>
              Listado detallado de pedidos por estudiante
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select
              value={diaSeleccionado}
              onValueChange={setDiaSeleccionado}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Selecciona día" />
              </SelectTrigger>
              <SelectContent>
                {diasSemana.map((dia) => (
                  <SelectItem key={dia} value={dia}>
                    {dia} {fechas[dia] ? `(${fechas[dia]})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={nivelSeleccionado}
              onValueChange={setNivelSeleccionado}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selecciona nivel" />
              </SelectTrigger>
              <SelectContent>
                {niveles.map((nivel) => (
                  <SelectItem key={nivel} value={nivel}>
                    {nivel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>
        ) : (
          <div className="space-y-6">
            {cursos.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No hay pedidos para {diaSeleccionado} {fechas[diaSeleccionado]}
              </div>
            ) : (
              cursos.map(curso => (
                <div key={curso} className="space-y-2">
                  <h3 className="font-medium text-gray-800 bg-gray-100 p-2 rounded">
                    {curso} ({pedidosPorCurso[curso].length} pedidos)
                  </h3>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Estudiante</TableHead>
                          <TableHead>Opción</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pedidosPorCurso[curso].map(pedido => (
                          <TableRow key={pedido.id}>
                            <TableCell>{pedido.nombre_estudiante}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{pedido.opcion_elegida}</Badge>
                            </TableCell>
                            <TableCell>{getEstadoBadge(pedido.estado_pago)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
