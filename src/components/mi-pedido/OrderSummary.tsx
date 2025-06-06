"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ShoppingCart, 
  Utensils, 
  Coffee, 
  AlertTriangle, 
  CheckCircle,
  Clock
} from 'lucide-react'
import { OrderSummary as OrderSummaryType, UserType } from '@/types/panel'
import { OrderValidation } from '@/types/order'
import { MenuService } from '@/services/menuService'

interface OrderSummaryProps {
  orderSummary: OrderSummaryType
  validation: OrderValidation
  userType: UserType
  isReadOnly: boolean
}

export function OrderSummary({ 
  orderSummary, 
  validation, 
  userType,
  isReadOnly 
}: OrderSummaryProps) {
  const { selections, totalAlmuerzos, totalColaciones, subtotalAlmuerzos, subtotalColaciones, total } = orderSummary

  const userTypeLabel = userType === 'funcionario' ? 'Funcionario' : 'Apoderado'
  const userTypeBadgeClass = userType === 'funcionario' 
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'

  return (
    <div className="space-y-6">
      {/* Resumen del pedido */}
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Resumen del pedido
          </CardTitle>
          <Badge className={userTypeBadgeClass}>
            {userTypeLabel}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          {selections.length === 0 ? (
            <div className="text-center py-6 text-slate-500 dark:text-slate-400">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay selecciones aún</p>
              <p className="text-xs">Selecciona tus menús para ver el resumen</p>
            </div>
          ) : (
            <>
              {/* Lista de selecciones por día */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Selecciones por día
                </h4>
                {selections.map((selection) => (
                  <SelectionDayItem key={selection.date} selection={selection} />
                ))}
              </div>

              <Separator />

              {/* Totales */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  Totales
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-slate-500" />
                      <span>Almuerzos ({totalAlmuerzos})</span>
                    </div>
                    <span className="font-medium">
                      ${subtotalAlmuerzos.toLocaleString('es-CL')}
                    </span>
                  </div>
                  
                  {totalColaciones > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-slate-500" />
                        <span>Colaciones ({totalColaciones})</span>
                      </div>
                      <span className="font-medium">
                        ${subtotalColaciones.toLocaleString('es-CL')}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ${total.toLocaleString('es-CL')} CLP
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Validaciones y alertas */}
      <ValidationAlerts validation={validation} isReadOnly={isReadOnly} />
    </div>
  )
}

interface SelectionDayItemProps {
  selection: {
    date: string
    almuerzo?: {
      code: string
      price: number
    }
    colacion?: {
      code: string
      price: number
    }
  }
}

function SelectionDayItem({ selection }: SelectionDayItemProps) {
  const dayName = MenuService.getDayDisplayName(selection.date)

  return (
    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-2">
      <div className="font-medium text-sm text-slate-900 dark:text-slate-100 capitalize">
        {dayName}
      </div>
      
      {selection.almuerzo && (
        <div className="flex items-center gap-2 text-sm">
          <Utensils className="w-3 h-3 text-slate-500" />
          <span className="text-slate-600 dark:text-slate-400">
            {selection.almuerzo.code}
          </span>
          <span className="text-xs text-slate-500">
            ${selection.almuerzo.price.toLocaleString('es-CL')}
          </span>
        </div>
      )}
      
      {selection.colacion && (
        <div className="flex items-center gap-2 text-sm">
          <Coffee className="w-3 h-3 text-slate-500" />
          <span className="text-slate-600 dark:text-slate-400">
            {selection.colacion.code}
          </span>
          <span className="text-xs text-slate-500">
            ${selection.colacion.price.toLocaleString('es-CL')}
          </span>
        </div>
      )}
    </div>
  )
}

interface ValidationAlertsProps {
  validation: OrderValidation
  isReadOnly: boolean
}

function ValidationAlerts({ validation, isReadOnly }: ValidationAlertsProps) {
  if (isReadOnly) {
    return (
      <Alert variant="info">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Tu pedido ha sido confirmado y no puede ser modificado.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-3">
      {/* Errores */}
      {validation.errors.map((error, index) => (
        <Alert key={`error-${index}`} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}

      {/* Advertencias */}
      {validation.warnings.map((warning, index) => (
        <Alert key={`warning-${index}`} variant="warning">
          <Clock className="h-4 w-4" />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      ))}

      {/* Éxito */}
      {validation.isValid && validation.canProceedToPayment && (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Tu pedido está completo y listo para confirmar.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
