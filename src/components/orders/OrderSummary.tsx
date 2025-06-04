'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, User, ShoppingCart, CreditCard } from 'lucide-react'
import { Student, ProductWithAvailability } from '@/types'
import { ProductService } from '@/lib/products/productService'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrderSummaryProps {
  student: Student
  deliveryDate: string
  selectedProducts: { product_id: string; quantity: number }[]
  products: ProductWithAvailability[]
  notes?: string
  onConfirm: () => void
  onEdit: () => void
  isLoading?: boolean
  className?: string
}

export function OrderSummary({
  student,
  deliveryDate,
  selectedProducts,
  products,
  notes,
  onConfirm,
  onEdit,
  isLoading = false,
  className,
}: OrderSummaryProps) {
  const orderItems = selectedProducts
    .filter(sp => sp.quantity > 0)
    .map(sp => {
      const product = products.find(p => p.id === sp.product_id)
      return product ? { ...sp, product } : null
    })
    .filter(Boolean) as Array<{ product_id: string; quantity: number; product: ProductWithAvailability }>

  const totalAmount = orderItems.reduce(
    (total, item) => total + (item.product.price_student * item.quantity),
    0
  )

  const formattedDate = format(new Date(deliveryDate), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Resumen del Pedido
          </CardTitle>
          <CardDescription>
            Revisa los detalles antes de confirmar tu pedido
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Student and Date Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estudiante</p>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                  {student.grade} - {student.section}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de entrega</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h4 className="font-medium">Productos seleccionados</h4>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{item.product.name}</p>
                      <Badge variant={item.product.type === 'almuerzo' ? 'default' : 'secondary'}>
                        {ProductService.getProductTypeLabel(item.product.type)}
                      </Badge>
                    </div>
                    {item.product.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.product.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {ProductService.formatPrice(item.product.price_student)}
                    </p>
                    <p className="font-medium">
                      {ProductService.formatPrice(item.product.price_student * item.quantity)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Notas adicionales</h4>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  {notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total a pagar:</span>
            <span className="text-primary">
              {ProductService.formatPrice(totalAmount)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onEdit}
              disabled={isLoading}
              className="flex-1"
            >
              Editar Pedido
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading || orderItems.length === 0}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isLoading ? 'Procesando...' : 'Confirmar y Pagar'}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <p className="font-medium mb-1">Importante:</p>
            <ul className="space-y-1">
              <li>• El pago se procesará a través de GetNet</li>
              <li>• Una vez confirmado el pago, el pedido no se puede cancelar</li>
              <li>• Recibirás una confirmación por email</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}