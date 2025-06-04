'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Plus, Minus, Clock, AlertCircle } from 'lucide-react'
import { ProductWithAvailability, ProductType } from '@/types'
import { ProductService } from '@/lib/products/productService'
import { cn } from '@/lib/utils'

interface ProductSelectorProps {
  products: ProductWithAvailability[]
  selectedProducts: { product_id: string; quantity: number }[]
  onProductSelect: (productId: string, quantity: number) => void
  disabled?: boolean
  className?: string
}

export function ProductSelector({
  products,
  selectedProducts,
  onProductSelect,
  disabled = false,
  className,
}: ProductSelectorProps) {
  const [selectedType, setSelectedType] = useState<ProductType | 'all'>('all')

  const filteredProducts = products.filter(product => 
    selectedType === 'all' || product.type === selectedType
  )

  const getProductQuantity = (productId: string) => {
    const selected = selectedProducts.find(p => p.product_id === productId)
    return selected?.quantity || 0
  }

  const handleQuantityChange = (productId: string, change: number) => {
    const currentQuantity = getProductQuantity(productId)
    const newQuantity = Math.max(0, currentQuantity + change)
    onProductSelect(productId, newQuantity)
  }

  const productTypes = [
    { value: 'all' as const, label: 'Todos' },
    { value: 'almuerzo' as const, label: 'Almuerzos' },
    { value: 'colacion' as const, label: 'Colaciones' },
  ]

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.type]) {
      acc[product.type] = []
    }
    acc[product.type].push(product)
    return acc
  }, {} as Record<ProductType, ProductWithAvailability[]>)

  return (
    <div className={cn('space-y-6', className)}>
      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        {productTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType(type.value)}
            className="transition-all duration-200"
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        {Object.entries(groupedProducts).map(([type, typeProducts]) => (
          <div key={type} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">
                {ProductService.getProductTypeLabel(type as ProductType)}
              </h3>
              <Badge variant="secondary">
                {typeProducts.length} {typeProducts.length === 1 ? 'producto' : 'productos'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {typeProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    quantity={getProductQuantity(product.id)}
                    onQuantityChange={(change) => handleQuantityChange(product.id, change)}
                    disabled={disabled || !product.can_order}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay productos disponibles</h3>
          <p className="text-muted-foreground">
            No se encontraron productos para la fecha seleccionada.
          </p>
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: ProductWithAvailability
  quantity: number
  onQuantityChange: (change: number) => void
  disabled?: boolean
}

function ProductCard({ product, quantity, onQuantityChange, disabled }: ProductCardProps) {
  const isSelected = quantity > 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        'transition-all duration-200 hover:shadow-md',
        isSelected && 'ring-2 ring-primary',
        disabled && 'opacity-50 cursor-not-allowed'
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">{product.name}</CardTitle>
              {product.description && (
                <CardDescription className="text-sm">
                  {product.description}
                </CardDescription>
              )}
            </div>
            <Badge variant={product.type === 'almuerzo' ? 'default' : 'secondary'}>
              {ProductService.getProductTypeLabel(product.type)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Precio:</span>
            <span className="font-semibold">
              {ProductService.formatPrice(product.price_student)}
            </span>
          </div>

          {/* Availability Status */}
          {!product.can_order && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Clock className="h-4 w-4" />
              <span>Fuera del horario de pedidos</span>
            </div>
          )}

          <Separator />

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cantidad:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(-1)}
                disabled={disabled || quantity === 0}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <span className="w-8 text-center font-medium">
                {quantity}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQuantityChange(1)}
                disabled={disabled}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subtotal */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 border-t"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold text-primary">
                  {ProductService.formatPrice(product.price_student * quantity)}
                </span>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}