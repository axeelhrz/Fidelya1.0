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
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";

// Definir tipos
interface PedidoAgrupado {
  dia: string;
  fecha: string;
  opcion: string;
  cantidad: number;
  nivel: string;
}

// Niveles educativos para las necesidades de logística y cocina
const NIVELES = {
  PREESCOLAR: 'PREESCOLAR',
  BASICA: 'BÁSICA',
  MEDIA: 'MEDIA',
  FUNCIONARIO: 'FUNCIONARIO',
  EXTRAS: 'EXTRAS',
  TODOS: 'TODOS'
};

// Mapeo de cursos a niveles educativos para la logística de cocina
const NIVELES_MAPPING: {[key: string]: string} = {
  // Preescolar
  'PRE-KINDER': NIVELES.PREESCOLAR,
  'KINDER': NIVELES.PREESCOLAR,
  'PLAY GROUP': NIVELES.PREESCOLAR,
  // Básica
  'PRIMERO BÁSICO': NIVELES.BASICA,
  'SEGUNDO BÁSICO': NIVELES.BASICA,
  'TERCERO BÁSICO': NIVELES.BASICA,
  'CUARTO BÁSICO': NIVELES.BASICA,
  'QUINTO BÁSICO': NIVELES.BASICA,
  'SEXTO BÁSICO': NIVELES.BASICA,
  'SÉPTIMO BÁSICO': NIVELES.BASICA,
  'OCTAVO BÁSICO': NIVELES.BASICA,
  // Media
  'PRIMERO MEDIO': NIVELES.MEDIA,
  'SEGUNDO MEDIO': NIVELES.MEDIA,
  'TERCERO MEDIO': NIVELES.MEDIA,
  'CUARTO MEDIO': NIVELES.MEDIA,
  // Funcionarios
  'FUNCIONARIO': NIVELES.FUNCIONARIO
};

const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

// Opciones de almuerzo estándar
const OPCIONES = ['OPC 1', 'OPC 2', 'OPC 3'];

// Función para obtener el color de fondo según el nivel
const getNivelBgColor = (nivel: string): string => {
  switch(nivel) {
    case NIVELES.PREESCOLAR:
      return 'bg-green-100';
    case NIVELES.BASICA:
      return 'bg-yellow-100';
    case NIVELES.MEDIA:
      return 'bg-red-500 text-white';
    case NIVELES.FUNCIONARIO:
      return 'bg-blue-600 text-white';
    case NIVELES.EXTRAS:
      return 'bg-blue-400 text-white';
    default:
      return 'bg-gray-100';
  }
};

// Función para exportar a Excel (por implementar)
const exportToExcel = () => {
  alert('Función de exportar a Excel en implementación');
};

// Definir la estructura para pedidos detallados por estudiante
interface PedidoDetallado {
  id: string;
  nombre_estudiante: string;
  nivel: string; // Corresponde al curso (como "PRIMERO BÁSICO")
  letra: string;
  opcion_elegida: string;
  tipo_pedido: string;
  dia_entrega: string;
  estado_pago: string;
}

export default function PedidosPorNivel() {
  const [pedidosPorNivel, setPedidosPorNivel] = useState<{[nivel: string]: {[opcion: string]: number}}>({});
  const [nivelSeleccionado, setNivelSeleccionado] = useState<string>(NIVELES.TODOS);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string>(diasSemana[0]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");
  const [pedidosDetallados, setPedidosDetallados] = useState<PedidoDetallado[]>([]);
  const [pedidosPorDia, setPedidosPorDia] = useState<{[dia: string]: {[opcion: string]: number}}>({});
  const [todasOpciones, setTodasOpciones] = useState<string[]>([]);
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
    console.log('Fechas calculadas:', fechasSemana);
    
    return fechasSemana;
  };
  
  useEffect(() => {
    const fechasSemana = obtenerRangoSemanaActual();
    setFechas(fechasSemana);
    setFechaSeleccionada(fechasSemana[diaSeleccionado] || "");
    cargarPedidos(diaSeleccionado, fechasSemana[diaSeleccionado] || "");
  }, [diaSeleccionado]);
  
  const cargarPedidos = async (dia: string, fecha: string) => {
    if (!fecha) return;
    
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
      
      // Consulta directa a pedidos para el día seleccionado
      console.log('Consultando pedidos para fecha:', fecha);
      
      let query = supabase
        .from('pedidos')
        .select('id, nombre_estudiante, nivel, letra, opcion_elegida, tipo_pedido, dia_entrega, estado_pago')
        .eq('dia_entrega', fecha)
        .eq('estado_pago', 'PAGADO');
        
      // Si hay un nivel seleccionado diferente de TODOS, filtrar por ese nivel
      if (nivelSeleccionado !== NIVELES.TODOS) {
        // Buscar todos los cursos que pertenecen a este nivel
        const cursosDelNivel = Object.entries(NIVELES_MAPPING)
          .filter(([_, nivel]) => nivel === nivelSeleccionado)
          .map(([curso]) => curso);
          
        if (cursosDelNivel.length > 0) {
          query = query.in('nivel', cursosDelNivel);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Para almacenar detalles de estudiantes para la entrega
      const detallesEstudiantes: PedidoDetallado[] = [];
      
      // Agrupamos pedidos por nivel y opción para la cocina
      const porNivel: {[nivel: string]: {[opcion: string]: number}} = {};
      
      // Inicializar estructura para todos los niveles con todas las opciones en 0
      Object.values(NIVELES).forEach(nivel => {
        if (nivel !== NIVELES.TODOS) {
          porNivel[nivel] = {};
          OPCIONES.forEach(opcion => {
            porNivel[nivel][opcion] = 0;
          });
        }
      });
      
      // También inicializar pedidosPorDia para la vista semanal
      const nuevoPedidosPorDia: {[dia: string]: {[opcion: string]: number}} = {};
      diasSemana.forEach(d => {
        nuevoPedidosPorDia[d] = {};
        OPCIONES.forEach(opcion => {
          nuevoPedidosPorDia[d][opcion] = 0;
        });
      });
      
      // Conjunto para almacenar todas las opciones únicas
      const opcionesUnicas = new Set<string>();
      
      // Procesar datos
      data?.forEach(pedido => {
        // Mapear el curso al nivel educativo para la cocina
        let nivelMapped = NIVELES.EXTRAS; // Default
        
        if (NIVELES_MAPPING[pedido.nivel]) {
          nivelMapped = NIVELES_MAPPING[pedido.nivel];
        } else if (pedido.nivel.includes('FUNCIONARIO')) {
          nivelMapped = NIVELES.FUNCIONARIO;
        }
        
        // Añadir a pedidos detallados para la entrega
        detallesEstudiantes.push({
          id: pedido.id,
          nombre_estudiante: pedido.nombre_estudiante || 'Sin nombre',
          nivel: pedido.nivel, // El campo nivel es realmente el curso (ej: "PRIMERO BÁSICO")
          letra: pedido.letra || '',
          opcion_elegida: pedido.opcion_elegida,
          tipo_pedido: pedido.tipo_pedido || '',
          dia_entrega: pedido.dia_entrega,
          estado_pago: pedido.estado_pago
        });
        
        // Agregar la opción al conjunto de opciones únicas
        opcionesUnicas.add(pedido.opcion_elegida);
        
        // Asegurar que la estructura existe para pedidos por nivel
        if (!porNivel[nivelMapped]) {
          porNivel[nivelMapped] = {};
          OPCIONES.forEach(opcion => {
            porNivel[nivelMapped][opcion] = 0;
          });
        }
        
        // Incrementar contador por nivel
        if (!porNivel[nivelMapped][pedido.opcion_elegida]) {
          porNivel[nivelMapped][pedido.opcion_elegida] = 0;
        }
        porNivel[nivelMapped][pedido.opcion_elegida]++;
        
        // Incrementar contador por día para la vista semanal
        if (dia === diaSeleccionado) {
          if (!nuevoPedidosPorDia[dia][pedido.opcion_elegida]) {
            nuevoPedidosPorDia[dia][pedido.opcion_elegida] = 0;
          }
          nuevoPedidosPorDia[dia][pedido.opcion_elegida]++;
        }
      });
      
      // Actualizar estados
      setPedidosPorNivel(porNivel);
      setPedidosDetallados(detallesEstudiantes);
      setPedidosPorDia(nuevoPedidosPorDia);
      setTodasOpciones(Array.from(opcionesUnicas));
    } catch (error: any) {
      console.error('Error cargando pedidos:', error);
      
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
        title: 'Error al cargar pedidos',
        description: error.message || 'No se pudieron cargar los pedidos. Verifique la conexión con la base de datos.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calcular el total de pedidos por opción
  const calcularTotalPorOpcion = (opcion: string): number => {
    return Object.values(pedidosPorNivel).reduce((total, opciones) => {
      return total + (opciones[opcion] || 0);
    }, 0);
  };
  
  // Calcular el total de pedidos por nivel
  const calcularTotalPorNivel = (nivel: string): number => {
    if (!pedidosPorNivel[nivel]) return 0;
    
    return Object.values(pedidosPorNivel[nivel]).reduce((sum, count) => sum + count, 0);
  };
  
  // Calcular el total general de pedidos
  const calcularTotalGeneral = (): number => {
    return Object.values(pedidosPorNivel).reduce((total, opciones) => {
      return total + Object.values(opciones).reduce((sum, count) => sum + count, 0);
    }, 0);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pedidos por Nivel</CardTitle>
              <CardDescription>
                Resumen de pedidos agrupados por nivel y opción
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
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
                  {Object.entries(NIVELES).map(([key, nivel]) => (
                    <SelectItem key={key} value={nivel}>
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
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={() => exportToExcel()}>
                  Exportar a Excel
                </Button>
              </div>
              <div className="grid gap-6">
                {/* Tabla de resumen completo para todos los niveles, similar al primer ejemplo */}
                {nivelSeleccionado === NIVELES.TODOS && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center bg-gray-300 p-2">
                        RESUMEN PEDIDOS {diaSeleccionado} {fechas[diaSeleccionado]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(pedidosPorNivel).map(([nivel, opciones]) => {
                          // Calcular total por nivel
                          const totalNivel = Object.values(opciones).reduce((sum, cantidad) => sum + cantidad, 0);
                          const bgColor = getNivelBgColor(nivel);
                          
                          return (
                            <div key={nivel} className={`border rounded ${bgColor}`}>
                              <div className={`text-center font-bold p-2 ${nivel === NIVELES.MEDIA ? "text-white" : ""}`}>
                                {nivel}
                              </div>
                              <Table>
                                <TableBody>
                                  {Object.entries(opciones).map(([opcion, cantidad]) => (
                                    <TableRow key={`${nivel}-${opcion}`}>
                                      <TableCell className="py-1">{opcion}</TableCell>
                                      <TableCell className="py-1 text-center">{cantidad}</TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow className="font-bold">
                                    <TableCell className="py-1">TOTAL</TableCell>
                                    <TableCell className="py-1 text-center">{totalNivel}</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 text-center bg-gray-300 p-2 font-bold">
                        TOTAL PEDIDOS: {Object.values(pedidosPorNivel).reduce((sum, opciones) => {
                          return sum + Object.values(opciones).reduce((subtotal, cantidad) => subtotal + cantidad, 0);
                        }, 0)}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Tabla detallada por día y opción */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Opción</TableHead>
                        {diasSemana.map((dia, index) => (
                          <TableHead key={dia} className="text-center">
                            <div>{dia}</div>
                            <div className="text-xs font-normal text-gray-500">
                              {fechas[dia] || ""}
                            </div>
                          </TableHead>
                        ))}
                        <TableHead className="text-center">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todasOpciones.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                            No hay pedidos para esta semana
                          </TableCell>
                        </TableRow>
                      ) : (
                        todasOpciones.map(opcion => {
                          // Calcular total por opción
                          const totalOpcion = diasSemana.reduce((acc, dia) => {
                            return acc + (pedidosPorDia[dia][opcion] || 0);
                          }, 0);
                          
                          return (
                            <TableRow key={opcion}>
                              <TableCell className="font-medium">
                                <Badge variant="outline">{opcion}</Badge>
                              </TableCell>
                              {diasSemana.map(dia => (
                                <TableCell key={`${dia}-${opcion}`} className="text-center">
                                  {pedidosPorDia[dia][opcion] || 0}
                                </TableCell>
                              ))}
                              <TableCell className="text-center font-medium">
                                {totalOpcion}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                  
                      {/* Fila de totales */}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-medium">Total</TableCell>
                        {diasSemana.map(dia => {
                          const totalDia = todasOpciones.reduce(
                            (acc, opcion) => acc + (pedidosPorDia[dia][opcion] || 0), 
                            0
                          );
                          return (
                            <TableCell key={`total-${dia}`} className="text-center font-medium">
                              {totalDia}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center font-bold">
                          {todasOpciones.reduce(
                            (acc, opcion) => acc + diasSemana.reduce(
                              (diaAcc, dia) => diaAcc + (pedidosPorDia[dia][opcion] || 0), 
                              0
                            ), 
                            0
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Nueva sección para mostrar los detalles de estudiantes para entrega */}
      {!loading && pedidosDetallados.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Detalle de Pedidos para Entrega</CardTitle>
            <CardDescription>
              Lista de estudiantes con sus pedidos para el día {diaSeleccionado} ({fechaSeleccionada})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre Estudiante</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Letra</TableHead>
                    <TableHead>Opción Elegida</TableHead>
                    <TableHead>Nivel para Cocina</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosDetallados.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell>{pedido.nombre_estudiante}</TableCell>
                      <TableCell>{pedido.nivel}</TableCell>
                      <TableCell>{pedido.letra}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pedido.opcion_elegida}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${getNivelBgColor(NIVELES_MAPPING[pedido.nivel] || NIVELES.EXTRAS)}`}
                        >
                          {NIVELES_MAPPING[pedido.nivel] || NIVELES.EXTRAS}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
