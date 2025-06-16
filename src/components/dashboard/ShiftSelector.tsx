'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Shift } from '@/types/database'
import { 
  X, 
  Sun, 
  Moon, 
  Clock, 
  CheckCircle2,
  Loader2,
  Calendar
} from 'lucide-react'

interface ShiftSelectorProps {
  selectedShift: Shift | null
  onShiftSelect: (shift: Shift) => void
  onClose: () => void
}

export default function ShiftSelector({ selectedShift, onShiftSelect, onClose }: ShiftSelectorProps) {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tempSelectedShift, setTempSelectedShift] = useState<Shift | null>(selectedShift)

  useEffect(() => {
    fetchShifts()
  }, [])

  const fetchShifts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('is_active', true)
        .order('start_time')

      if (error) throw error
      setShifts(data || [])
    } catch (err: any) {
      setError('Error al cargar los turnos')
      console.error('Error fetching shifts:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = () => {
    if (tempSelectedShift) {
      onShiftSelect(tempSelectedShift)
      onClose()
    }
  }

  const getShiftIcon = (shiftName: string, startTime: string) => {
    const name = shiftName.toLowerCase()
    const time = startTime.toLowerCase()
    
    if (name.includes('día') || name.includes('dia') || time.includes('06:') || time.includes('6:')) {
      return Sun
    } else if (name.includes('noche') || time.includes('22:') || time.includes('10:')) {
      return Moon
    }
    return Clock
  }

  const getShiftColors = (shiftName: string, startTime: string) => {
    const name = shiftName.toLowerCase()
    const time = startTime.toLowerCase()
    
    if (name.includes('día') || name.includes('dia') || time.includes('06:') || time.includes('6:')) {
      return {
        bg: 'from-amber-500 to-orange-500',
        bgHover: 'from-amber-600 to-orange-600',
        bgLight: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        ring: 'ring-amber-500/20'
      }
    } else if (name.includes('noche') || time.includes('22:') || time.includes('10:')) {
      return {
        bg: 'from-indigo-500 to-purple-600',
        bgHover: 'from-indigo-600 to-purple-700',
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-200',
        text: 'text-indigo-800',
        ring: 'ring-indigo-500/20'
      }
    }
    return {
      bg: 'from-slate-500 to-slate-600',
      bgHover: 'from-slate-600 to-slate-700',
      bgLight: 'bg-slate-50',
      border: 'border-slate-200',
      text: 'text-slate-800',
      ring: 'ring-slate-500/20'
    }
  }

  const formatTime = (time: string) => {
    // Convertir formato 24h a formato más legible
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getShiftDescription = (shift: Shift) => {
    const name = shift.name.toLowerCase()
    if (name.includes('día') || name.includes('dia')) {
      return 'Turno matutino ideal para comenzar temprano el día'
    } else if (name.includes('noche')) {
      return 'Turno nocturno para quienes prefieren trabajar en la noche'
    }
    return 'Horario de trabajo estándar'
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  Seleccionar Turno de Trabajo
                </CardTitle>
                <p className="text-slate-200 text-sm">
                  Elige tu horario de trabajo para gestionar tus pedidos
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-4" />
                <p className="text-slate-600">Cargando turnos disponibles...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Error al cargar turnos</h3>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={fetchShifts} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : shifts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay turnos disponibles</h3>
              <p className="text-slate-600">Contacta al administrador para configurar los turnos</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Selection Info */}
              {selectedShift && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">Turno actual</p>
                      <p className="font-semibold text-slate-900">{selectedShift.name}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Shift Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Turnos Disponibles
                </h3>
                
                <div className="grid gap-4">
                  {shifts.map((shift) => {
                    const Icon = getShiftIcon(shift.name, shift.start_time)
                    const colors = getShiftColors(shift.name, shift.start_time)
                    const isSelected = tempSelectedShift?.id === shift.id
                    
                    return (
                      <div
                        key={shift.id}
                        onClick={() => setTempSelectedShift(shift)}
                        className={`
                          group relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200
                          ${isSelected 
                            ? `${colors.border} ${colors.bgLight} shadow-lg ring-4 ${colors.ring}` 
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Icon */}
                          <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200
                            ${isSelected 
                              ? `bg-gradient-to-br ${colors.bg}` 
                              : 'bg-gradient-to-br from-slate-400 to-slate-500 group-hover:from-slate-500 group-hover:to-slate-600'
                            }
                          `}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xl font-bold text-slate-900">
                                {shift.name}
                              </h4>
                              {isSelected && (
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-600">
                                  {formatTime(shift.start_time)} - {formatTime(shift.end_time)}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-slate-600">
                              {getShiftDescription(shift)}
                            </p>
                          </div>

                          {/* Selection Indicator */}
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                            ${isSelected 
                              ? `border-emerald-500 bg-emerald-500` 
                              : 'border-slate-300 group-hover:border-slate-400'
                            }
                          `}>
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <div className="text-sm text-slate-500">
                  {tempSelectedShift ? (
                    <span>Turno seleccionado: <strong>{tempSelectedShift.name}</strong></span>
                  ) : (
                    <span>Selecciona un turno para continuar</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    onClick={handleConfirm}
                    disabled={!tempSelectedShift}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirmar Turno
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}