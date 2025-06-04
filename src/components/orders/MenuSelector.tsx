"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase } from '@/lib/supabase/client'
import { Almuerzo, Colacion } from '@/lib/supabase/types'
import { useToast } from '@/components/ui/use-toast'
interface MenuSelectorProps {
  selectedDate: string
  onMenuSelect: (menu: Almuerzo | Colacion) => void
  selectedMenus: (Almuerzo | Colacion)[]
}

export default function MenuSelector({ selectedDate, onMenuSelect, selectedMenus }: MenuSelectorProps) {
  const [almuerzos, setAlmuerzos] = useState<Almuerzo[]>([])
  const [colaciones, setColaciones] = useState<Colacion[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedDate) {
      loadMenuOptions()
    }
  }, [selectedDate])

  const loadMenuOptions = async () => {
    try {
      setLoading(true)
      
      // Cargar almuerzos
      const { data: almuerzoData, error: almuerzoError } = await supabase
        .from('almuerzos')
        .select('*')
        .eq('fecha', selectedDate)
        .order('codigo')

      if (almuerzoError) {
        console.error('Error cargando almuerzos:', almuerzoError)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las opciones de almuerzo"
        })
      } else {
        setAlmuerzos(almuerzoData || [])
      }

      // Cargar colaciones
      const { data: colacionData, error: colacionError } = await supabase
        .from('colaciones')
        .select('*')
        .eq('fecha', selectedDate)
        .order('codigo')

      if (colacionError) {
        console.error('Error cargando colaciones:', colacionError)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar las opciones de colación"
        })
      } else {
        setColaciones(colacionData || [])
      }
    } catch (error) {
      console.error('Error inesperado:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error inesperado al cargar el menú"
      })
    } finally {
      setLoading(false)
    }
  }

  const isMenuSelected = (menu: Almuerzo | Colacion) => {
    return selectedMenus.some(selected => selected.id === menu.id)
  }
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  if (loading) {
    return (
          <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
            ))}
          </div>
      </div>
    )
  }

    return (
    <div className="space-y-6">
      {/* Sección de Almuerzos */}
      {almuerzos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Opciones de Almuerzo</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {almuerzos.map((almuerzo) => (
              <Card 
                key={almuerzo.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isMenuSelected(almuerzo) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => onMenuSelect(almuerzo)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium">
                      {almuerzo.codigo}
                    </CardTitle>
                    <Badge variant={almuerzo.tipo_dia === 'ESPECIAL' ? 'secondary' : 'default'}>
                      {almuerzo.tipo_dia}
                    </Badge>
                </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-3">
                    {almuerzo.descripcion}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <div>Estudiante: {formatPrice(almuerzo.precio_estudiante)}</div>
                      <div>Funcionario: {formatPrice(almuerzo.precio_funcionario)}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={isMenuSelected(almuerzo) ? "default" : "outline"}
                    >
                      {isMenuSelected(almuerzo) ? 'Seleccionado' : 'Seleccionar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
                  </div>
                      </div>
                  )}

      {/* Sección de Colaciones */}
      {colaciones.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Opciones de Colación</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {colaciones.map((colacion) => (
              <Card 
                key={colacion.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isMenuSelected(colacion) ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
                onClick={() => onMenuSelect(colacion)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium">
                      {colacion.codigo}
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-100">
                      Colación
                    </Badge>
        </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-3">
                    {colacion.descripcion}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      <div>Estudiante: {formatPrice(colacion.precio_estudiante)}</div>
                      <div>Funcionario: {formatPrice(colacion.precio_funcionario)}</div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={isMenuSelected(colacion) ? "default" : "outline"}
                    >
                      {isMenuSelected(colacion) ? 'Seleccionado' : 'Seleccionar'}
                    </Button>
                  </div>
                </CardContent>
    </Card>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje cuando no hay opciones */}
      {almuerzos.length === 0 && colaciones.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              No hay opciones de menú disponibles para la fecha seleccionada.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}