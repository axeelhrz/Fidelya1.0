"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Clock, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Product, Student } from '@/lib/supabase/types'
import { OrderService } from '@/lib/orders/orderHelpers'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface MenuSelectorProps {
  student: Student
  selectedDate: string
  dayOfWeek: string
  onSelectionChange: (products: { productId: string; quantity: number }[]) => void
  onTotalChange: (total: number) => void
}

export default function MenuSelector({
  student,
  selectedDate,
  dayOfWeek,
  onSelectionChange,
  onTotalChange
}: MenuSelectorProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(true)
  const [canOrder, setCanOrder] = useState(true)
  const [cutoffTime, setCutoffTime] = useState<string>('10:00')
  const { toast } = useToast()

  // Cargar productos disponibles para la fecha
  useEffect(() => {
    loadProducts()
    checkOrderAvailability()
  }, [selectedDate, dayOfWeek])

  // Actualizar selección cuando cambien los productos seleccionados
  useEffect(() => {
    const selection = Object.entries(selectedProducts)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ productId, quantity }))
    
    onSelectionChange(selection)
    
    // Calcular total
    const total = Object.entries(selectedProducts).reduce((sum, [productId, quantity]) => {
      const product = products.find(p => p.id === productId)
      if (!product || quantity <= 0) return sum
      
      const price = student.tipo === 'Funcionario' 
        ? product.precio_funcionario 
        : product.precio_estudiante
      
      return sum + (price * quantity)
    }, 0)
    
    onTotalChange(total)
  }, [selectedProducts, products, student.tipo])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('fecha', selectedDate)
        .eq('dia', dayOfWeek)
        .eq('is_active', true)
        .order('codigo')

      if (error) {
        console.error('Error loading products:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los productos disponibles'
        })
        return
      }

      setProducts(data || [])
      setSelectedProducts({}) // Limpiar selección al cambiar fecha
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkOrderAvailability = async () => {
    try {
      // Verificar si se puede hacer pedido
      const { data: canMakeOrder } = await supabase
        .rpc('can_make_order', { delivery_date: selectedDate })

      setCanOrder(canMakeOrder || false)

      // Obtener hora de corte
      const { data: settings } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'order_cutoff_time')
        .single()

      if (settings?.value) {
        setCutoffTime(settings.value.substring(0, 5)) // HH:MM
      }
    } catch (error) {
      console.error('Error checking order availability:', error)
    }
  }

  const updateQuantity = (productId: string, change: number) => {
    setSelectedProducts(prev => {
      const currentQuantity = prev[productId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      
      return {
        ...prev,
        [productId]: newQuantity
      }
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando menú...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!canOrder) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pedidos cerrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Ya pasó la hora límite para hacer pedidos para este día (hasta las {cutoffTime}).
              Los pedidos deben realizarse antes de las {cutoffTime} del día de entrega.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No hay menú disponible</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No hay opciones de menú disponibles para {dayOfWeek.toLowerCase()} {selectedDate}.
              Por favor selecciona otra fecha.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Menú para {dayOfWeek.toLowerCase()} {selectedDate}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Pedidos hasta las {cutoffTime}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map(product => {
            const quantity = selectedProducts[product.id] || 0
            const price = student.tipo === 'Funcionario' 
              ? product.precio_funcionario 
              : product.precio_estudiante

            return (
              <div
                key={product.id}
                className={`border rounded-lg p-4 transition-colors ${
                  quantity > 0 ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{product.codigo}</Badge>
                      <span className="font-medium">{formatPrice(price)}</span>
                    </div>
                    <p className="text-sm text-gray-600">{product.descripcion}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, -1)}
                      disabled={quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="w-8 text-center font-medium">
                      {quantity}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {quantity > 0 && (
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPrice(price * quantity)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {quantity} × {formatPrice(price)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}