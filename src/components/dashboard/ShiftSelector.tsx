'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { Shift } from '@/types/database'
import { Clock, Users, CheckCircle } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface ShiftSelectorProps {
  selectedShift: Shift | null
  onShiftSelect: (shift: Shift) => void
  onClose: () => void
}

export default function ShiftSelector({ selectedShift, onShiftSelect, onClose }: ShiftSelectorProps) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShifts()
  }, [])

  const fetchShifts = async () => {
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('is_active', true)
        .order('start_time')

      if (error) throw error
      setShifts(data || [])
    } catch (error) {
      console.error('Error fetching shifts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShiftSelect = (shift: Shift) => {
    onShiftSelect(shift)
    onClose()
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando turnos...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Selecciona tu Turno
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Elige el turno para el cual realizarás tus pedidos
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {shifts.map((shift) => (
            <div
              key={shift.id}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedShift?.id === shift.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleShiftSelect(shift)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedShift?.id === shift.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{shift.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                    </p>
                  </div>
                </div>
                
                {selectedShift?.id === shift.id && (
                  <CheckCircle className="w-6 h-6 text-orange-500" />
                )}
              </div>
              
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                <span>Turno disponible</span>
              </div>
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={onClose}
              disabled={!selectedShift}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Confirmar Selección
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
