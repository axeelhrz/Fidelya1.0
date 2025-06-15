'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Order, Shift } from '@/types/database'
import { X, Save, Trash2 } from 'lucide-react'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  selectedShift: Shift
  existingOrder?: Order | null
  onOrderSaved: () => void
}

const menuItems = [
  'Pollo a la plancha con arroz',
  'Pescado al horno con verduras',
  'Pasta con salsa boloñesa',
  'Ensalada César con pollo',
  'Hamburguesa completa',
  'Pizza margherita',
  'Sopa de lentejas',
  'Arroz con pollo',
  'Tacos de carne',
  'Sandwich de jamón y queso'
]

export default function OrderModal({
  isOpen,
  onClose,
  selectedDate,
  selectedShift,
  existingOrder,
  onOrderSaved
}: OrderModalProps) {
  const { user } = useAuth()
  const [menuItem, setMenuItem] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (existingOrder) {
      setMenuItem(existingOrder.menu_item)
      setNotes(existingOrder.notes || '')
    } else {
      setMenuItem('')
      setNotes('')
    }
    setError('')
  }, [existingOrder, isOpen])

  const handleSave = async () => {
    if (!user || !menuItem.trim()) {
      setError('Por favor selecciona un plato')
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderData = {
        user_id: user.id,
        shift_id: selectedShift.id,
        order_date: selectedDate.toISOString().split('T')[0],
        menu_item: menuItem.trim(),
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
    } catch (err: any) {
      setError(err.message || 'Error al guardar el pedido')
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
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el pedido')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const dateStr = selectedDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {existingOrder ? 'Editar Pedido' : 'Nuevo Pedido'}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            <p>{dateStr}</p>
            <p>Turno: {selectedShift.name}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="menu-item" className="text-sm font-medium text-gray-700">
              Selecciona tu plato
            </label>
            <select
              id="menu-item"
              value={menuItem}
              onChange={(e) => setMenuItem(e.target.value)}
              className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Selecciona un plato...</option>
              {menuItems.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notas adicionales (opcional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Sin cebolla, extra salsa..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            {existingOrder && (
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar</span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !menuItem.trim()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>{existingOrder ? 'Actualizar' : 'Guardar'}</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
