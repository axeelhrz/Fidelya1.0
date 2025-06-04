"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Pedido = {
  id: string
  cliente_id: string
  nombre_estudiante: string
  curso: string
  letra: string
  nivel: string
  tipo_pedido: string
  opcion_elegida: string
  dia_entrega: string
  estado_pago: string
  created_at?: string
  updated_at?: string
}

interface Hijo {
  nombre: string
  curso: string
  letra: string
  nivel: string
  rut?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [hijos, setHijos] = useState<Hijo[]>([])
  
  // Estados para paginación y filtrado
  const [paginaActual, setPaginaActual] = useState(1)
  const [elementosPorPagina, setElementosPorPagina] = useState(5) // Por defecto 5 semanas por página
  const [filtroEstudiante, setFiltroEstudiante] = useState<string | null>(null)
  const [semanasExpandidas, setSemanasExpandidas] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let isMounted = true

    async function loadDashboardData() {
      try {
        setLoading(true)
        setError(null)

        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError('Error de sesión')
          return
        }

        if (!session) {
          router.push('/auth/login')
          return
        }

        // Load client data with better error handling
        const { data: clienteData, error: clienteError } = await supabase
          .from('clientes')
          .select('id, hijos')
          .eq('correo_apoderado', session.user.email)
          .maybeSingle()

        if (clienteError) {
          console.error('Error loading dashboard data:', clienteError)
          setError('Error al cargar datos del cliente')
          return
        }

        if (!clienteData) {
          setError('Cliente no encontrado')
          return
        }

        if (!isMounted) return

        setHijos(clienteData.hijos || [])
        // Buscar pedidos por cliente_id
        const { data: pedidosData, error: pedidosError } = await supabase
          .from("pedidos")
          .select("*")
          .eq("cliente_id", clienteData.id)
          .order("dia_entrega", { ascending: true })
        if (pedidosError) throw pedidosError
        setPedidos(pedidosData || [])
      } catch (error: any) {
        console.error('Error loading dashboard data:', error)
        setError('Error inesperado al cargar el dashboard')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isMounted = false
    }
  }, [router])

  // Filtramos los pedidos según los criterios seleccionados
  const pedidosFiltrados = pedidos
    .filter(pedido => filtroEstudiante ? pedido.nombre_estudiante === filtroEstudiante : true)
  
  // Función para agrupar pedidos por semana
  const agruparPorSemana = (pedidos: Pedido[]) => {
    const grupos: { [key: string]: { inicioSemana: Date, pedidos: Pedido[] } } = {}
    
    pedidos.forEach(pedido => {
      const fecha = new Date(pedido.dia_entrega)
      // Encontrar el lunes de la semana
      const diaSemana = fecha.getDay() // 0 es domingo, 1 lunes, etc.
      const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1 // Para que lunes sea el inicio de la semana
      const inicioSemana = new Date(fecha)
      inicioSemana.setDate(fecha.getDate() - diasHastaLunes)
      inicioSemana.setHours(0, 0, 0, 0)
      
      const claveSemana = inicioSemana.toISOString().split('T')[0]
      
      if (!grupos[claveSemana]) {
        grupos[claveSemana] = { inicioSemana, pedidos: [] }
      }
      
      grupos[claveSemana].pedidos.push(pedido)
    })
    
    // Convertir a array y ordenar por fecha (más reciente primero)
    return Object.values(grupos).sort((a, b) => 
      b.inicioSemana.getTime() - a.inicioSemana.getTime()
    )
  }
  
  // Función para formatear rango de semana
  const formatearRangoSemana = (inicioSemana: Date) => {
    const finSemana = new Date(inicioSemana)
    finSemana.setDate(inicioSemana.getDate() + 6) // Domingo (fin de semana)
    
    const formatoInicio = inicioSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
    const formatoFin = finSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
    
    // Si el inicio y fin están en el mismo mes, no repetir el mes en el rango
    if (inicioSemana.getMonth() === finSemana.getMonth()) {
      return `${inicioSemana.getDate()} al ${finSemana.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}`
    }
    
    return `${formatoInicio} al ${formatoFin}`
  }
  
  // Función para mostrar pedidos agrupados por semana
  const mostrarPedidosPorSemana = (listaPedidos: Pedido[]) => {
    if (listaPedidos.length === 0) {
      return (
        <div className="py-8 text-center text-gray-500">
          <p>No hay pedidos que coincidan con los filtros seleccionados.</p>
        </div>
      )
    }
    
    const semanas = agruparPorSemana(listaPedidos)
    const semanasPaginadas = semanas.slice(
      (paginaActual - 1) * elementosPorPagina, 
      paginaActual * elementosPorPagina
    )
    const totalPaginas = Math.ceil(semanas.length / elementosPorPagina)
    
    return (
      <div>
        <div className="divide-y">
          {semanasPaginadas.map((semana, index) => {
            const claveSemana = semana.inicioSemana.toISOString()
            const expandida = semanasExpandidas[claveSemana] || false
            
            // Calcular estadisticas
            const pedidosPagados = semana.pedidos.filter(p => p.estado_pago === 'pagado').length
            const pedidosPendientes = semana.pedidos.filter(p => p.estado_pago === 'pendiente').length
            const pedidosPorDia = semana.pedidos.reduce((acc, pedido) => {
              const fecha = pedido.dia_entrega.split('T')[0]
              if (!acc[fecha]) acc[fecha] = []
              acc[fecha].push(pedido)
              return acc
            }, {} as Record<string, Pedido[]>)
            
            return (
              <div key={claveSemana} className="border-b last:border-b-0">
                {/* Encabezado de la semana (siempre visible) */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                  onClick={() => setSemanasExpandidas(prev => ({
                    ...prev,
                    [claveSemana]: !expandida
                  }))}
                >
                  <div>
                    <p className="font-medium flex items-center">
                      Semana del {semana.inicioSemana.toLocaleDateString('es-CL', {day: 'numeric', month: 'long'})}                       
                      <span className="text-xs text-gray-500 ml-2">({formatearRangoSemana(semana.inicioSemana)})</span>
                    </p>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>
                        Total: {semana.pedidos.length} pedidos • 
                        {pedidosPagados > 0 && <span className="text-green-600"> {pedidosPagados} pagados</span>} 
                        {pedidosPendientes > 0 && <span className="text-amber-600"> {pedidosPendientes} pendientes</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform ${expandida ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Contenido expandible */}
                {expandida && (
                  <div className="bg-gray-50 border-t">
                    {/* Agrupamos pedidos por día */}
                    {Object.entries(pedidosPorDia)
                      .sort(([fechaA], [fechaB]) => fechaA.localeCompare(fechaB))
                      .map(([fecha, pedidosDia]) => {
                        const fechaObj = new Date(fecha)
                        return (
                          <div key={fecha} className="border-b last:border-b-0">
                            <div className="px-6 py-2 bg-gray-100 font-medium text-sm">
                              {fechaObj.toLocaleDateString('es-CL', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </div>
                            {pedidosDia.map(pedido => (
                              <div key={pedido.id} className="p-4 pl-8 hover:bg-gray-100 border-t">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div>
                                    <div className="font-medium flex items-center gap-2">
                                      <span>{pedido.nombre_estudiante}</span>
                                      <Badge className={pedido.estado_pago === 'pagado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                        {pedido.estado_pago === 'pagado' ? 'Pagado' : 'Pendiente'}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                      <p>
                                        <span className="font-medium">Tipo:</span> {pedido.tipo_pedido} • 
                                        <span className="font-medium">Curso:</span> {pedido.curso} {pedido.letra}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Pedido: {pedido.id.substring(0, 8)}... • 
                                        Creado: {new Date(pedido.created_at || '').toLocaleString('es-CL')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        
        {/* Control de paginación */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-medium">{(paginaActual - 1) * elementosPorPagina + 1}</span> a <span className="font-medium">{Math.min(paginaActual * elementosPorPagina, semanas.length)}</span> de <span className="font-medium">{semanas.length}</span> semanas
            </p>
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Cargando dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Panel de Control</h1>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sección de Estudiantes */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Mis Estudiantes</h2>
              {hijos.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No hay estudiantes registrados</p>
                  <p className="mt-2 text-gray-500">Puede agregar hijos desde la sección de perfil</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hijos.map((hijo, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg hover:border-green-500 transition-colors"
                    >
                      <p className="font-medium">{hijo.nombre}</p>
                      <p className="text-sm text-gray-600">Curso: {hijo.curso} {hijo.letra} - Nivel: {hijo.nivel}</p>
                    </div>
                  ))}
                  <p className="mt-2 text-gray-500 text-center">Puede gestionar sus hijos desde la sección de perfil</p>
                </div>
              )}
            </div>
            {/* Sección de Pedidos Mejorada */}
            <div className="col-span-2 mt-6 md:mt-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Mis Pedidos</h2>
                <Button
                  onClick={() => router.push("/pedidos/nuevo")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Nuevo Pedido
                </Button>
              </div>
              
              {pedidos.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No tienes pedidos registrados</p>
                  <p className="text-gray-500 mt-1">Haz un nuevo pedido para tus estudiantes</p>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <Select 
                            defaultValue="todos" 
                            onValueChange={(value) => {
                              setFiltroEstudiante(value === 'todos' ? null : value);
                              setPaginaActual(1); // Reset a primera página al filtrar
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-[200px]">
                              <SelectValue placeholder="Filtrar por estudiante" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todos">Todos los estudiantes</SelectItem>
                              {[...new Set(pedidos.map(p => p.nombre_estudiante))].map(nombre => (
                                <SelectItem key={nombre} value={nombre}>{nombre}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Mostrar:</span>
                          <Select 
                            defaultValue="10" 
                            onValueChange={(value) => {
                              setElementosPorPagina(parseInt(value));
                              setPaginaActual(1); // Reset a primera página al cambiar elementos por página
                            }}
                          >
                            <SelectTrigger className="w-[80px]">
                              <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <Tabs defaultValue="todos" className="w-full">
                      <div className="px-4 border-b">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="todos">Todos</TabsTrigger>
                          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                          <TabsTrigger value="pagados">Pagados</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="todos" className="m-0">
                        {mostrarPedidosPorSemana(pedidosFiltrados)}
                      </TabsContent>
                      
                      <TabsContent value="pendientes" className="m-0">
                        {mostrarPedidosPorSemana(pedidosFiltrados.filter(p => p.estado_pago === "pendiente"))}
                      </TabsContent>
                      
                      <TabsContent value="pagados" className="m-0">
                        {mostrarPedidosPorSemana(pedidosFiltrados.filter(p => p.estado_pago === "pagado"))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}