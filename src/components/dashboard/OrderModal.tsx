'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Order, Shift, Menu } from '@/types/database'
import { X, Save, Trash2, Loader2, ChefHat } from 'lucide-react'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  selectedShift: Shift
  existingOrder?: Order | null
  onOrderSaved: () => void
  availableMenus: Menu[]
}

export default function OrderModal({
  isOpen,
  onClose,
  selectedDate,
  selectedShift,
  existingOrder,
  onOrderSaved,
  availableMenus
}: OrderModalProps) {
  const { user, profile } = useAuth()
  const [selectedMenuId, setSelectedMenuId] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existingOrder) {
      // Buscar el menú correspondiente al pedido existente
      const matchingMenu = availableMenus.find(menu => 
        menu.descripcion_opcion === existingOrder.menu_item
      )
      setSelectedMenuId(matchingMenu?.id.toString() || '')
      setNotes(existingOrder.notes || '')
    } else {
      setSelectedMenuId('')
      setNotes('')
    }
    setError('')
  }, [existingOrder, isOpen, availableMenus])

  const handleSave = async () => {
    if (!user || !profile || !selectedMenuId.trim()) {
      setError('Por favor selecciona un plato')
      return
    }

    const selectedMenu = availableMenus.find(menu => menu.id.toString() === selectedMenuId)
    if (!selectedMenu) {
      setError('Menú no válido')
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderData = {
        trabajador_id: profile.id,
        shift_id: selectedShift.id,
        order_date: selectedDate.toISOString().split('T')[0],
        menu_item: selectedMenu.descripcion_opcion,
        notes: notes.trim() || null,
        status: 'pending' as const
      }

      if (existingOrder) {
        // Update existing order
        const { error } = await supabase
          .from('orders')
          .update({
            menu_item: orderData.menu_item,
            notes: orderData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingOrder.id)

        if (error) throw error
      } else {
        // Create new order
        const { error } = await supabase
          .from('orders')
          .insert([orderData])

        if (error) throw error
      }

      onOrderSaved()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el pedido')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!existingOrder) return

    if (!confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', existingOrder.id)

      if (error) throw error

      onOrderSaved()
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el pedido')
    } finally {
      setLoading(false)
    }
  }

  const groupMenusByCategory = () => {
    const grouped: { [key: string]: Menu[] } = {}
    availableMenus.forEach(menu => {
      if (!grouped[menu.categoria]) {
        grouped[menu.categoria] = []
      }
      grouped[menu.categoria].push(menu)
    })
    return grouped
  }

  if (!isOpen) return null

  const dateStr = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const groupedMenus = groupMenusByCategory()

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-6 h-6" />
              <CardTitle className="text-xl">
                {existingOrder ? 'Editar Pedido' : 'Nuevo Pedido'}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-orange-100">
            <p className="capitalize">{dateStr}</p>
            <p>Turno: {selectedShift.name}</p>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {availableMenus.length === 0 ? (
            <div className="text-center py-8">
              <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay menú disponible
              </h3>
              <p className="text-gray-600">
                No se ha configurado menú para este día
              </p>
            </div>
          ) : (
            <>
              {/* Menu Selection */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                  <ChefHat className="w-4 h-4" />
                  <span>Selecciona tu plato</span>
                </label>
                
                <div className="space-y-4">
                  {Object.entries(groupedMenus).map(([categoria, menus]) => (
                    <div key={categoria} className="space-y-2">
                      <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide border-b border-gray-200 pb-1">
                        {categoria}
                      </h4>
                      <div className="grid gap-2">
                        {menus.map((menu) => (
                          <label
                            key={menu.id}
                            className={`
                              flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                              ${selectedMenuId === menu.id.toString()
                                ? 'border-orange-500 bg-orange-50 shadow-md'
                                : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name="menu"
                              value={menu.id}
                              checked={selectedMenuId === menu.id.toString()}
                              onChange={(e) => setSelectedMenuId(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">
                                  {menu.descripcion_opcion}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                  {menu.codigo_opcion}
                                </span>
                              </div>
                            </div>
                            <div className={`
                              w-5 h-5 rounded-full border-2 ml-3 flex items-center justify-center
                              ${selectedMenuId === menu.id.toString()
                                ? 'border-orange-500 bg-orange-500'
                                : 'border-gray-300'
                              }
                            `}>
                              {selectedMenuId === menu.id.toString() && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Sin cebolla, extra salsa..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {existingOrder && (
              <Button
                onClick={handleDelete}
                disabled={loading}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            )}
            
            <div className="flex items-center space-x-3 ml-auto">
              <Button
                onClick={onClose}
                variant="outline"
                disabled={loading}
              >
                Cancelar
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={loading || !selectedMenuId.trim() || availableMenus.length === 0}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {existingOrder ? 'Actualizar' : 'Guardar'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}