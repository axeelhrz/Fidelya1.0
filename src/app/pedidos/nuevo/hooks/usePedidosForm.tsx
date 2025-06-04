"use client"

import { useState, useEffect } from 'react'
import { startOfWeek, addDays, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase/client'
import { MenuOption } from "@/components/day-cell"

// Interfaces
export interface Hijo {
  id: string
  nombre: string
  curso: string
  letra: string
  nivel: string
  tipo?: string // 'Estudiante' o 'Funcionario'
}

export interface Cliente {
  id: string
  correo_apoderado: string
  nombre_apoderado: string
  hijos: Hijo[]
}

export interface PedidoItem {
  fecha: string
  tipo: 'almuerzo' | 'colacion'
  opcion_id: string
  hijo_id: string // Agregamos el ID del hijo al que pertenece este pedido
}

export interface SelectedOption {
  almuerzo?: string
  colacion?: string
}

// Tipos de pasos en el proceso
export type OrderStep = 'seleccion' | 'resumen' | 'confirmacion'

// Datos educativos predeterminados
export const DATOS_EDUCATIVOS = {
  curso: "1",
  letra: "A",
  nivel: "Básico"
}

export function usePedidosForm() {
  // Estado general
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingMenu, setLoadingMenu] = useState<boolean>(false)
  const [guardando, setGuardando] = useState<boolean>(false)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [currentStep, setCurrentStep] = useState<OrderStep>('seleccion')
  
  // Estado para pago
  const [pedidoCreado, setPedidoCreado] = useState<boolean>(false)
  const [transactionId, setTransactionId] = useState<string>("")
  const [montoTotal, setMontoTotal] = useState<number>(0)
  const [linkPago, setLinkPago] = useState<string>("")
  const baseLinkPago = "https://www.webpay.cl/form-pay/281171"
  
  // Estado para selección de estudiantes
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  
  const { toast } = useToast()

  // Estado para la semana seleccionada
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = domingo, 6 = sábado
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1, locale: es })
  const nextWeekStart = addDays(currentWeekStart, 7) // Siguiente semana
  const defaultWeekStart = isWeekend ? nextWeekStart : currentWeekStart
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(defaultWeekStart)

  // Estado para menús disponibles
  const [menuOptions, setMenuOptions] = useState<{
    almuerzos: Record<string, MenuOption[]>
    colaciones: Record<string, MenuOption[]>
  }>({
    almuerzos: {},
    colaciones: {}
  })

  // Estado para las opciones seleccionadas por estudiante
  // {estudiante_id: {fecha: {almuerzo, colacion}}}
  const [selectedOptionsByStudent, setSelectedOptionsByStudent] = useState<{
    [studentId: string]: {
      [date: string]: {
        almuerzo?: string
        colacion?: string
      }
    }
  }>({})

  // Función para generar opciones de prueba
  const generarOpcionesDePrueba = (weekStart: Date) => {
    console.log('Generando opciones de prueba');
    const almuerzosTest: Record<string, MenuOption[]> = {};
    const colacionesTest: Record<string, MenuOption[]> = {};
    
    // Crear array con fechas de lunes a viernes
    const weekDays = [];
    for (let i = 0; i < 5; i++) { // 0 = lunes, 4 = viernes
      const currentDay = addDays(weekStart, i);
      weekDays.push(format(currentDay, 'yyyy-MM-dd'));
    }
    
    // Almuerzos de prueba
    const opcionesAlmuerzo = [
      { nombre: 'Pollo al horno con arroz', precio: 3500 },
      { nombre: 'Pescado con puré', precio: 3800 },
      { nombre: 'Pasta con salsa boloñesa', precio: 3200 },
      { nombre: 'Lentejas con ensalada', precio: 3000 },
      { nombre: 'Hamburguesa con papas fritas', precio: 3900 }
    ];
    
    // Colaciones de prueba
    const opcionesColacion = [
      { nombre: 'Fruta fresca', precio: 1200 },
      { nombre: 'Yogurt con cereal', precio: 1500 },
      { nombre: 'Sándwich integral', precio: 1800 },
      { nombre: 'Jugo natural con galletas', precio: 1400 }
    ];
    
    // Asignar opciones a cada día
    weekDays.forEach((fecha, idx) => {
      almuerzosTest[fecha] = [];
      colacionesTest[fecha] = [];
      
      // 2 opciones de almuerzo por día
      for (let i = 0; i < 2; i++) {
        const opcion = opcionesAlmuerzo[(idx + i) % opcionesAlmuerzo.length];
        almuerzosTest[fecha].push({
          id: `test-almuerzo-${fecha}-${i}`,
          descripcion: opcion.nombre,
          precio: opcion.precio,
          codigo: `A${i+1}`,
          tipo: 'almuerzo',
          fecha: fecha
        });
      }
      
      // 2 opciones de colación por día
      for (let i = 0; i < 2; i++) {
        const opcion = opcionesColacion[(idx + i) % opcionesColacion.length];
        colacionesTest[fecha].push({
          id: `test-colacion-${fecha}-${i}`,
          descripcion: opcion.nombre,
          precio: opcion.precio,
          codigo: `C${i+1}`,
          tipo: 'colacion',
          fecha: fecha
        });
      }
    });
    
    return {
      almuerzos: almuerzosTest,
      colaciones: colacionesTest
    };
  };

  // Efecto para cargar datos del cliente
  useEffect(() => {
    let isMounted = true
    
    const getClienteData = async () => {
      if (!isMounted) return
      setLoading(true)
      
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          toast({
            variant: "destructive",
            title: "No autenticado",
            description: "Debes iniciar sesión para agendar un pedido.",
          })
          return
        }
        
        // Consultar datos del cliente
        console.log('Buscando cliente con email:', user.email);
        const { data: clienteData, error: clienteError } = await supabase
          .from('clientes')
          .select('id, correo_apoderado, nombre_apoderado, hijos')
          .eq('correo_apoderado', user.email)
          .single()
          
        if (clienteError) {
          console.error('Error al buscar cliente:', clienteError)
          toast({
            variant: "destructive",
            title: "Error al cargar cliente",
            description: "No se pudo obtener la información del cliente.",
          })
          return
        }
        
        if (isMounted) {
          console.log('Datos del cliente recibidos:', clienteData);
          
          // Procesar los datos JSONB de hijos
          let hijosArray = [];
          
          console.log('Tipo de datos de hijos:', typeof clienteData.hijos);
          console.log('Valor de hijos:', clienteData.hijos);
          
          // Si hijos es una cadena JSON, intentar parsearlo
          if (typeof clienteData.hijos === 'string') {
            try {
              hijosArray = JSON.parse(clienteData.hijos);
              console.log('Hijos parseados desde cadena JSON:', hijosArray);
            } catch (e) {
              console.error('Error al parsear hijos como JSON:', e);
            }
          } 
          // Si hijos ya es un objeto (Supabase puede convertir JSONB a objeto JS)
          else if (typeof clienteData.hijos === 'object') {
            // Si es un array, usarlo directamente
            if (Array.isArray(clienteData.hijos)) {
              hijosArray = clienteData.hijos;
            } 
            // Si es un objeto con propiedades numeradas, convertirlo a array
            else if (clienteData.hijos !== null) {
              hijosArray = Object.values(clienteData.hijos);
            }
            console.log('Hijos como objeto/array:', hijosArray);
          }
          
          // Crucial: Asignar IDs a los hijos si no los tienen
          hijosArray = hijosArray.map((hijo: any, index: number) => {
            // Si no tiene ID, generar uno basado en sus datos
            if (!hijo.id) {
              const hijoConId = {
                ...hijo,
                id: `hijo-${index}-${hijo.nombre ? hijo.nombre.replace(/\s+/g, '-').toLowerCase() : 'sin-nombre'}`
              };
              console.log('Asignando ID a hijo:', hijoConId);
              return hijoConId;
            }
            return hijo;
          });
          
          const clienteInfo = {
            id: clienteData.id,
            correo_apoderado: clienteData.correo_apoderado,
            nombre_apoderado: clienteData.nombre_apoderado,
            hijos: hijosArray
          }
          
          // Para depuración: Usar datos de prueba si no hay hijos
          if (!hijosArray || hijosArray.length === 0) {
            console.log('No se encontraron hijos, agregando ejemplos para pruebas');
            clienteInfo.hijos = [
              {
                id: '1',
                nombre: 'Alain Wevar',
                curso: '12',
                letra: 'A',
                nivel: 'Media'
              },
              {
                id: '2',
                nombre: 'Bastian Wevar',
                curso: '9',
                letra: 'B',
                nivel: 'Media'
              }
            ];
          }
          
          console.log('Cliente info final:', clienteInfo);
          setCliente(clienteInfo);
          
          // Inicializar estructura para selecciones por estudiante
          const initialSelections: {[studentId: string]: {[date: string]: SelectedOption}} = {}
          clienteInfo.hijos.forEach((hijo: Hijo) => {
            if (hijo && hijo.id) {
              initialSelections[hijo.id] = {}
            }
          })
          
          // Importante: Asegurarnos de que el cliente tenga hijos para mostrar
          if (clienteInfo.hijos.length === 0) {
            console.error('No se encontraron hijos para este cliente, verifique la base de datos');
          } else {
            console.log(`Se encontraron ${clienteInfo.hijos.length} hijos:`, clienteInfo.hijos);
          }
          setSelectedOptionsByStudent(initialSelections)
        }
      } catch (e) {
        console.error('Error inesperado:', e)
        if (isMounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al cargar la información.",
          })
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    getClienteData()
    
    return () => {
      isMounted = false
    }
  }, [])
  
  // Efecto para cargar opciones de menú cuando cambia la semana seleccionada
  useEffect(() => {
  let isMounted = true
  
  const getClienteData = async () => {
    if (!isMounted) return
    setLoading(true)
    
    try {
      // Crear array con fechas de lunes a viernes
      const weekDays: string[] = []
      for (let i = 0; i < 5; i++) { // 0 = lunes, 4 = viernes
        const currentDay = addDays(selectedWeekStart, i)
        weekDays.push(format(currentDay, 'yyyy-MM-dd'))
      }
      
      console.log('Fechas a consultar:', weekDays)
      
      // Consultar opciones de almuerzos para las fechas de la semana
      const { data: almuerzosData, error: almuerzosError } = await supabase
        .from('almuerzos')
        .select('id, descripcion, fecha, dia, codigo, precio_estudiante, tipo_dia')
        .in('fecha', weekDays)
      
      if (almuerzosError) {
        console.error('Error al cargar almuerzos:', almuerzosError)
        throw almuerzosError
      }
      
      console.log('Almuerzos cargados:', almuerzosData?.length || 0)
      
      // Consultar opciones de colaciones para las fechas de la semana
      const { data: colacionesData, error: colacionesError } = await supabase
        .from('colaciones')
        .select('id, codigo, descripcion, precio')
      
      if (colacionesError) {
        console.error('Error al cargar colaciones:', colacionesError)
        throw colacionesError
      }
      
      console.log('Colaciones cargadas:', colacionesData?.length || 0)
      
      // Organizar opciones por fecha
      const almuerzosOrganizados: Record<string, MenuOption[]> = {}
      const colacionesOrganizadas: Record<string, MenuOption[]> = {}
      
      // Inicializar arrays vacíos para cada día
      weekDays.forEach(day => {
        almuerzosOrganizados[day] = []
        colacionesOrganizadas[day] = []
      })
      
      // Agregar almuerzos
      almuerzosData.forEach((almuerzo: any) => {
        // Asegurarnos de usar el formato correcto de fecha para evitar desfases
        const fecha = almuerzo.fecha
        console.log(`Almuerzo: ${almuerzo.descripcion}, Fecha en DB: ${fecha}`)
        
        // Verificar que la fecha coincida con uno de los días de la semana
        if (weekDays.includes(fecha)) {
          if (!almuerzosOrganizados[fecha]) {
            almuerzosOrganizados[fecha] = []
          }
          
          almuerzosOrganizados[fecha].push({
            id: almuerzo.id,
            descripcion: almuerzo.descripcion,
            precio: almuerzo.precio_estudiante,
            codigo: almuerzo.codigo || `A${almuerzosOrganizados[fecha].length + 1}`,
            tipo: 'almuerzo',
            fecha: fecha, // Usar la fecha exactamente como viene de la BD
            dia: almuerzo.dia,
            tipo_dia: almuerzo.tipo_dia
          })
        }
      })
      
      // Agregar colaciones - Las colaciones son las mismas para todos los días
      weekDays.forEach(fecha => {
        // Por cada día, agregamos todas las colaciones disponibles
        colacionesData.forEach((colacion: any) => {
          console.log(`Colación: ${colacion.descripcion}, asignada a fecha: ${fecha}`)
          colacionesOrganizadas[fecha].push({
            id: colacion.id,
            descripcion: colacion.descripcion,
            precio: colacion.precio,
            codigo: colacion.codigo || `C${colacionesOrganizadas[fecha].length + 1}`,
            tipo: 'colacion',
            fecha: fecha // Agregar la fecha para mantener consistencia
          })
        })
      })
      
      // Actualizar estado con opciones organizadas
      setMenuOptions({
        almuerzos: almuerzosOrganizados,
        colaciones: colacionesOrganizadas
      })
    } catch (error) {
      console.error('Error al cargar opciones de menú:', error)
      
      // Opciones de respaldo en caso de error
      const fallbackOptions: Record<string, MenuOption[]> = {}
      const weekDays = []
      
      for (let i = 0; i < 5; i++) {
        const currentDay = addDays(selectedWeekStart, i)
        const formattedDay = format(currentDay, 'yyyy-MM-dd')
        weekDays.push(formattedDay)
        fallbackOptions[formattedDay] = []
      }
      
      setMenuOptions({
        almuerzos: fallbackOptions,
        colaciones: fallbackOptions
      })
    } finally {
      setLoadingMenu(false)
    }
  }

  getClienteData()
  
  return () => {
    isMounted = false
  }
}, [selectedWeekStart])  // selectedWeekStart como dependencia para que se ejecute al cambiar la semana

// Efecto para cargar datos del cliente
useEffect(() => {
  let isMounted = true
  
  const getClienteData = async () => {
    if (!isMounted) return
    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "No autenticado",
          description: "Debes iniciar sesión para agendar un pedido.",
        })
        return
      }
      
      // Consultar datos del cliente
      console.log('Buscando cliente con email:', user.email);
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('id, correo_apoderado, nombre_apoderado, hijos')
        .eq('correo_apoderado', user.email)
        .single()
        
      if (clienteError) {
        console.error('Error al buscar cliente:', clienteError)
        toast({
          variant: "destructive",
          title: "Error al cargar cliente",
          description: "No se pudo obtener la información del cliente.",
        })
        return
      }
      
      if (isMounted) {
        console.log('Datos del cliente recibidos:', clienteData);
        
        // Procesar los datos JSONB de hijos
        let hijosArray = [];
        
        console.log('Tipo de datos de hijos:', typeof clienteData.hijos);
        console.log('Valor de hijos:', clienteData.hijos);
        
        // Si hijos es una cadena JSON, intentar parsearlo
        if (typeof clienteData.hijos === 'string') {
          try {
            hijosArray = JSON.parse(clienteData.hijos);
            console.log('Hijos parseados desde cadena JSON:', hijosArray);
          } catch (e) {
            console.error('Error al parsear hijos como JSON:', e);
          }
        } 
        // Si hijos ya es un objeto (Supabase puede convertir JSONB a objeto JS)
        else if (typeof clienteData.hijos === 'object') {
          // Si es un array, usarlo directamente
          if (Array.isArray(clienteData.hijos)) {
            hijosArray = clienteData.hijos;
          } 
          // Si es un objeto con propiedades numeradas, convertirlo a array
          else if (clienteData.hijos !== null) {
            hijosArray = Object.values(clienteData.hijos);
          }
          console.log('Hijos como objeto/array:', hijosArray);
        }
        
        // Crucial: Asignar IDs a los hijos si no los tienen
        hijosArray = hijosArray.map((hijo: any, index: number) => {
          // Si no tiene ID, generar uno basado en sus datos
          if (!hijo.id) {
            const hijoConId = {
              ...hijo,
              id: `hijo-${index}-${hijo.nombre ? hijo.nombre.replace(/\s+/g, '-').toLowerCase() : 'sin-nombre'}`
            };
            console.log('Asignando ID a hijo:', hijoConId);
            return hijoConId;
          }
          return hijo;
        });
        
        const clienteInfo = {
          id: clienteData.id,
          correo_apoderado: clienteData.correo_apoderado,
          nombre_apoderado: clienteData.nombre_apoderado,
          hijos: hijosArray
        }
        
        // Para depuración: Usar datos de prueba si no hay hijos
        if (!hijosArray || hijosArray.length === 0) {
          console.log('No se encontraron hijos, agregando ejemplos para pruebas');
          clienteInfo.hijos = [
            {
              id: '1',
              nombre: 'Alain Wevar',
              curso: '12',
              letra: 'A',
              nivel: 'Media'
            },
            {
              id: '2',
              nombre: 'Bastian Wevar',
              curso: '9',
              letra: 'B',
              nivel: 'Media'
            }
          ];
        }
        
        console.log('Cliente info final:', clienteInfo);
        setCliente(clienteInfo);
        
        // Inicializar estructura para selecciones por estudiante
        const initialSelections: {[studentId: string]: {[date: string]: SelectedOption}} = {}
        clienteInfo.hijos.forEach((hijo: Hijo) => {
          if (hijo && hijo.id) {
            initialSelections[hijo.id] = {}
          }
        })
        
        // Importante: Asegurarnos de que el cliente tenga hijos para mostrar
        if (clienteInfo.hijos.length === 0) {
          console.error('No se encontraron hijos para este cliente, verifique la base de datos');
        } else {
          console.log(`Se encontraron ${clienteInfo.hijos.length} hijos:`, clienteInfo.hijos);
        }
        setSelectedOptionsByStudent(initialSelections)
      }
    } catch (e) {
      console.error('Error inesperado:', e)
      if (isMounted) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al cargar la información.",
        })
      }
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }
  }
  
  getClienteData()
  
  return () => {
    isMounted = false
  }
}, [])  // [] como dependencia para que solo se ejecute una vez al montar

// Función para seleccionar opciones de almuerzo o colación
function handleSelectOption(studentId: string, date: string, type: 'almuerzo' | 'colacion', optionId: string) {
  if (guardando) return
  
  // Asegurarnos de que la fecha esté en formato ISO (yyyy-MM-dd)
  let fechaFormateada = date;
  if (date.includes('T')) {
    // Si la fecha incluye hora (formato ISO completo), extraer solo la parte de la fecha
    fechaFormateada = date.split('T')[0];
  }
  
  console.log(`Seleccionando para estudiante ${studentId}, fecha original ${date}, fecha formateada ${fechaFormateada}, tipo ${type}, opción ${optionId}`);
  console.log('Estado actual de selecciones:', selectedOptionsByStudent);
  
  // Crear una copia profunda del estado actual para evitar referencias compartidas
  const newSelectedOptions = JSON.parse(JSON.stringify(selectedOptionsByStudent));
  
  // Inicializar la estructura si no existe
  if (!newSelectedOptions[studentId]) {
    newSelectedOptions[studentId] = {};
  }
  
  if (!newSelectedOptions[studentId][fechaFormateada]) {
    newSelectedOptions[studentId][fechaFormateada] = {};
  }
  
  // Actualizar la selección específica
  newSelectedOptions[studentId][fechaFormateada][type] = optionId;
  
  console.log('Nuevo estado de selecciones:', newSelectedOptions);
  
  // Actualizar el estado con la nueva copia
  setSelectedOptionsByStudent(newSelectedOptions);
}

// Función para manejar la selección de almuerzo
function handleSelectAlmuerzo(studentId: string, date: string, almuerzoId: string) {
  console.log(`Seleccionando almuerzo para estudiante ${studentId}, fecha ${date}, opción ${almuerzoId}`);
  handleSelectOption(studentId, date, 'almuerzo', almuerzoId)
}

// Función para manejar la selección de colación
function handleSelectColacion(studentId: string, date: string, colacionId: string) {
  console.log(`Seleccionando colación para estudiante ${studentId}, fecha ${date}, opción ${colacionId}`);
  handleSelectOption(studentId, date, 'colacion', colacionId)
}

// Función para gestionar estudiantes seleccionados
function toggleStudentSelection(studentId: string) {
  setSelectedStudents(prev => {
    if (prev.includes(studentId)) {
      // Si ya está seleccionado, lo quitamos
      return prev.filter(id => id !== studentId)
    } else {
      // Si no está seleccionado, lo añadimos
      return [...prev, studentId]
    }
  })
}

// Pasar al paso de resumen
function goToResumen() {
  // Si no hay estudiantes seleccionados, no permitir avanzar
  if (selectedStudents.length === 0) {
    toast({
      variant: "destructive", 
      title: "Selección incompleta",
      description: "Debes seleccionar al menos un estudiante"
    })
    return
  }
  
  // Verificar que haya opciones seleccionadas para cada estudiante
  let hasSelections = false
  for (const studentId of selectedStudents) {
    const studentSelections = selectedOptionsByStudent[studentId]
    if (studentSelections && Object.keys(studentSelections).length > 0) {
      hasSelections = true
      break
    }
  }

  if (!hasSelections) {
    toast({
      variant: "destructive",
      title: "No hay opciones seleccionadas",
      description: "Debes seleccionar al menos una opción para continuar.",
    })
    return
  }
  
  // Avanzar al paso de resumen
  setCurrentStep('resumen')
}

// Función para enviar el pedido
async function handleSubmit() {
  if (!cliente || selectedStudents.length === 0) return
  
  setGuardando(true)
  
  try {
    // Obtener el usuario autenticado actual
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Debes iniciar sesión para crear un pedido")
    }
    
    // Generar un ID de transacción único para agrupar todos los registros del mismo pedido
    const uniqueTransactionId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setTransactionId(uniqueTransactionId)
    
    // Calcular el monto total y preparar los pedidos para insertar
    let total = 0
    const pedidosParaProcesar: any[] = []

    // Procesar los pedidos para cada estudiante seleccionado
    for (const studentId of selectedStudents) {
      // Obtener los datos del estudiante seleccionado
      const hijoSeleccionado = cliente.hijos.find((hijo: any) => hijo.id === studentId)
      if (!hijoSeleccionado) {
        console.error("No se encontró información del estudiante seleccionado", studentId)
        continue // Saltamos este estudiante y seguimos con los demás
      }
      
      // Extraer datos educativos del estudiante o usar valores predeterminados
      const datosEstudiante = {
        curso: hijoSeleccionado.curso || DATOS_EDUCATIVOS.curso,
        letra: hijoSeleccionado.letra || DATOS_EDUCATIVOS.letra,
        nivel: hijoSeleccionado.nivel || DATOS_EDUCATIVOS.nivel
      }
      
      // Obtener las selecciones para este estudiante
      const studentSelections = selectedOptionsByStudent[studentId] || {}
      
      // Crear un registro por cada combinación de día y tipo (almuerzo/colación)
      for (const [fecha, opciones] of Object.entries(studentSelections)) {
        // Verificar que opciones es un objeto con las propiedades correctas
        const typedOpciones = opciones as { almuerzo?: string, colacion?: string }
        
        // Si seleccionó almuerzo para este día
        if (typedOpciones.almuerzo) {
          const opcionAlmuerzo = menuOptions.almuerzos[fecha]?.find((o: any) => o.id === typedOpciones.almuerzo)
          if (opcionAlmuerzo && opcionAlmuerzo.precio !== undefined) {
            total += opcionAlmuerzo.precio
            
            // Verificar que cliente.id es un UUID válido
            if (!cliente.id || typeof cliente.id !== 'string' || !cliente.id.includes('-')) {
              console.error('ID de cliente no válido:', cliente.id)
              throw new Error('ID de cliente no válido. Debe ser un UUID.')
            }
            
            // Obtener la opción de almuerzo completa para extraer su código
            const opcionAlmuerzoCompleta = menuOptions.almuerzos[fecha]?.find((o: any) => o.id === typedOpciones.almuerzo)
            
            // Usar el código de la opción o el ID como respaldo
            const codigoAlmuerzo = opcionAlmuerzoCompleta?.codigo || typedOpciones.almuerzo
            
            pedidosParaProcesar.push({
              // Usar el ID del cliente de la tabla clientes
              cliente_id: cliente.id,
              // Datos del estudiante
              nombre_estudiante: hijoSeleccionado.nombre,
              curso: datosEstudiante.curso,
              letra: datosEstudiante.letra,
              nivel: datosEstudiante.nivel,
              // Tipo de usuario (Estudiante o Funcionario)
              tipo_usuario: hijoSeleccionado.tipo || 'Estudiante',
              // Datos del pedido
              tipo_pedido: 'almuerzo',
              opcion_elegida: codigoAlmuerzo,
              dia_entrega: fecha,
              transaction_id: uniqueTransactionId
            })
          }
        }
        
        // Si seleccionó colación para este día
        if (typedOpciones.colacion) {
          const opcionColacion = menuOptions.colaciones[fecha]?.find((o: any) => o.id === typedOpciones.colacion)
          if (opcionColacion && opcionColacion.precio !== undefined) {
            total += opcionColacion.precio
            
            // Obtener la opción de colación completa para extraer su código
            const opcionColacionCompleta = menuOptions.colaciones[fecha]?.find((o: any) => o.id === typedOpciones.colacion)
            
            // Usar el código de la opción o el ID como respaldo
            const codigoColacion = opcionColacionCompleta?.codigo || typedOpciones.colacion
            
            pedidosParaProcesar.push({
              // Usar el ID del cliente de la tabla clientes
              cliente_id: cliente.id,
              // Datos del estudiante
              nombre_estudiante: hijoSeleccionado.nombre,
              curso: datosEstudiante.curso,
              letra: datosEstudiante.letra,
              nivel: datosEstudiante.nivel,
              // Tipo de usuario (Estudiante o Funcionario)
              tipo_usuario: hijoSeleccionado.tipo || 'Estudiante',
              // Datos del pedido
              tipo_pedido: 'colacion',
              opcion_elegida: codigoColacion,
              dia_entrega: fecha,
              transaction_id: uniqueTransactionId
            })
          }
        }
      }
    }
    
    // Actualizar el monto total
    setMontoTotal(total)
    
    if (pedidosParaProcesar.length === 0) {
      throw new Error("No hay pedidos válidos para procesar")
    }
    
    console.log('Pedidos preparados para procesar:', pedidosParaProcesar)
    
    // IMPORTANTE: Volver al enfoque de insertar los pedidos con estado 'pendiente' antes de redireccionar al pago
    // Esto proporciona mejor trazabilidad y robustez en el seguimiento de pedidos
    
    // Asignar el estado 'pendiente' a todos los registros
    const pedidosConEstadoPendiente = pedidosParaProcesar.map(pedido => ({
      ...pedido,
      estado_pago: 'pendiente'
    }))
    
    // Insertar los pedidos en la base de datos con estado "pendiente"
    console.log('Insertando pedidos en base de datos con estado "pendiente":', pedidosConEstadoPendiente)
    const { data: insertedOrders, error: insertError } = await supabase
      .from('pedidos')
      .insert(pedidosConEstadoPendiente)
      .select()

    if (insertError) {
      console.error('Error al insertar pedidos:', insertError)
      throw new Error(`Error al guardar pedidos: ${insertError.message || 'Error desconocido'}`)
    }
    
    console.log('Pedidos insertados correctamente con estado "pendiente":', insertedOrders)
    
    // Guardar también en localStorage como respaldo para recuperación en caso de fallo
    localStorage.setItem('pendingOrderData', JSON.stringify(pedidosParaProcesar))
    localStorage.setItem('pendingPaymentTx', uniqueTransactionId)
    localStorage.setItem('pendingPaymentTime', Date.now().toString())
    
    setPedidoCreado(true)
    setCurrentStep('confirmacion')
    
    toast({
      title: "Pedido creado",
      description: "Tu pedido ha sido creado. Para completarlo, procede con el pago.",
    })
  } catch (error: any) {
    console.error('Error al preparar pedido:', error)
    toast({
      variant: "destructive",
      title: "Error al preparar pedido",
      description: error.message || "Ocurrió un error al procesar tu pedido.",
    })
  } finally {
    setGuardando(false)
  }
}

// Función auxiliar para añadir campos ocultos al formulario
function addHiddenField(name: string, value: string) {
  return (
    <input type="hidden" name={name} value={value} />
  )
}

return {
  // Estados
  loading,
  loadingMenu,
  guardando,
  cliente,
  currentStep,
  pedidoCreado,
  transactionId,
  montoTotal,
  linkPago,
  selectedStudents,
  selectedWeekStart,
  menuOptions,
  selectedOptionsByStudent,
  
  // Funciones
  setSelectedWeekStart,
  toggleStudentSelection,
  handleSelectAlmuerzo,
  handleSelectColacion,
  goToResumen,
  handleSubmit,
  addHiddenField,
  setCurrentStep
}
}