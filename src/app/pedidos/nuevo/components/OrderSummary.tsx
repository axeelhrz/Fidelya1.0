"use client"

import React, { useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { format, parseISO, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import type { MenuOption } from "@/components/day-cell"
import type { Hijo } from '../hooks/usePedidosForm'

interface OrderSummaryProps {
  hijos: any[]
  selectedStudents: string[]
  selectedOptionsByStudent: Record<string, Record<string, { almuerzo?: string, colacion?: string }>>
  menuOptions: {
    almuerzos: Record<string, MenuOption[]>
    colaciones: Record<string, MenuOption[]>
  }
  total: number
  isGuardando: boolean
  onGoBack: () => void
  onSubmit: () => Promise<void>
}

interface OpcionDetalle {
  descripcion: string
  precio: number
}

export function OrderSummary({
  isGuardando,
  hijos,
  selectedStudents,
  menuOptions,
  selectedOptionsByStudent,
  total,
  onGoBack,
  onSubmit
}: OrderSummaryProps) {
  // Crear un mapa plano de todas las opciones para acceso O(1)
  const opcionesMap = useMemo(() => {
    const mapa: Record<string, OpcionDetalle> = {}
    
    // Agregar todas las opciones de almuerzo
    Object.values(menuOptions.almuerzos).forEach(opcionesDia => {
      opcionesDia.forEach(opcion => {
        if (opcion.id) {
          mapa[opcion.id] = {
            descripcion: opcion.descripcion || 'Sin descripción',
            precio: opcion.precio || 0
          }
        }
      })
    })
    
    // Agregar todas las opciones de colación
    Object.values(menuOptions.colaciones).forEach(opcionesDia => {
      opcionesDia.forEach(opcion => {
        if (opcion.id) {
          mapa[opcion.id] = {
            descripcion: opcion.descripcion || 'Sin descripción',
            precio: opcion.precio || 0
          }
        }
      })
    })
    
    return mapa
  }, [menuOptions])
  
  // Función optimizada para obtener detalles de una opción (O(1) lookup)
  const getDetallesOpcion = (opcionId: string | undefined): OpcionDetalle => {
    if (!opcionId || !opcionesMap[opcionId]) {
      return { descripcion: 'Opción no disponible', precio: 0 }
    }
    return opcionesMap[opcionId]
  }
  
  // Calcular el total del pedido (optimizado)
  const calcularTotal = (): number => {
    let suma = 0
    
    for (const studentId of selectedStudents) {
      const selecciones = selectedOptionsByStudent[studentId] || {}
      
      for (const fecha in selecciones) {
        const opcionesDia = selecciones[fecha] || {}
        
        if (opcionesDia.almuerzo) {
          suma += getDetallesOpcion(opcionesDia.almuerzo).precio
        }
        
        if (opcionesDia.colacion) {
          suma += getDetallesOpcion(opcionesDia.colacion).precio
        }
      }
    }
    
    return suma
  }
  
  // Usar el total proporcionado o calcularlo si es necesario
  const totalFinal = total > 0 ? total : calcularTotal()
  
  // Obtener nombre del estudiante por su ID
  const getNombreEstudiante = (studentId: string): string => {
    const estudiante = hijos.find(h => h.id === studentId)
    return estudiante?.nombre || 'Estudiante'
  }
  
  // Formatear fecha en formato uniforme
  const formatearFecha = (fechaStr: string): string => {
    try {
      // Formatear directamente con parseISO como se solicitó
      return format(parseISO(fechaStr), "EEEE d 'de' MMMM", { locale: es })
    } catch (error) {
      return fechaStr
    }
  }
  
  // Si no hay opciones seleccionadas, mostrar mensaje
  if (selectedStudents.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No hay opciones seleccionadas</p>
          </CardContent>
        </Card>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onGoBack}>
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
      
      {selectedStudents.map(studentId => {
        const selecciones = selectedOptionsByStudent[studentId] || {}
        const nombreEstudiante = getNombreEstudiante(studentId)
        
        // Obtener fechas seleccionadas, excluyendo domingos usando parseISO y getDay
        const fechasSeleccionadas = Object.keys(selecciones).filter(fecha => {
          const diaSemana = getDay(parseISO(fecha))
          return diaSemana !== 0 // Excluir domingo (día 0)
        })
        
        if (fechasSeleccionadas.length === 0) return null
        
        // Ordenar cronológicamente usando parseISO como se especificó
        const fechasOrdenadas = [...fechasSeleccionadas].sort(
          (a, b) => parseISO(a).getTime() - parseISO(b).getTime()
        )
        
        return (
          <Card key={studentId} className="mb-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">{nombreEstudiante}</h3>
              
              {fechasOrdenadas.map(fecha => {
                const opcionesDia = selecciones[fecha] || {}
                const fechaFormateada = formatearFecha(fecha)
                
                return (
                  <div key={fecha} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                    <h4 className="font-medium capitalize text-gray-700 mb-2">
                      {fechaFormateada}
                    </h4>
                    
                    <div className="space-y-2">
                      {opcionesDia.almuerzo && (
                        <div className="flex justify-between">
                          <div>
                            <span className="text-sm text-gray-500">Almuerzo:</span>
                            <p>{getDetallesOpcion(opcionesDia.almuerzo).descripcion}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${getDetallesOpcion(opcionesDia.almuerzo).precio.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                      
                      {opcionesDia.colacion && (
                        <div className="flex justify-between">
                          <div>
                            <span className="text-sm text-gray-500">Colación:</span>
                            <p>{getDetallesOpcion(opcionesDia.colacion).descripcion}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${getDetallesOpcion(opcionesDia.colacion).precio.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Total:</span>
          <span className="font-bold text-xl">${totalFinal.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onGoBack} disabled={isGuardando}>
          Volver
        </Button>
        <Button onClick={onSubmit} disabled={isGuardando}>
          {isGuardando ? 'Guardando...' : 'Confirmar Pedido'}
        </Button>
      </div>
    </div>
  )
}