"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Lock
} from 'lucide-react'
import { OrderValidation } from '@/types/order'
import { PaymentService } from '@/services/paymentService'
import { useToast } from '@/hooks/use-toast'

interface PaymentButtonProps {
  validation: OrderValidation
  isReadOnly: boolean
  isSaving: boolean
  total: number
  userEmail: string
  onSaveOrder: () => Promise<string | null>
}

export function PaymentButton({
  validation,
  isReadOnly,
  isSaving,
  total,
  userEmail,
  onSaveOrder
}: PaymentButtonProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const { toast } = useToast()

  const handleConfirmAndPay = async () => {
    if (!validation.canProceedToPayment) {
      toast({
        title: "No se puede proceder",
        description: "Por favor, completa todas las selecciones requeridas.",
        variant: "destructive"
      })
      return
    }

    setIsProcessingPayment(true)

    try {
      // 1. Guardar el pedido
      const orderId = await onSaveOrder()
      
      if (!orderId) {
        throw new Error('No se pudo guardar el pedido')
      }

      // 2. Crear el pago
      const paymentRequest = {
        orderId,
        amount: total,
        currency: 'CLP' as const,
        description: `Pedido semanal Casino Escolar - ${new Date().toLocaleDateString('es-CL')}`,
        userEmail,
        returnUrl: `${window.location.origin}/mi-pedido/success?orderId=${orderId}`,
        cancelUrl: `${window.location.origin}/mi-pedido?cancelled=true`
      }

      const paymentResponse = await PaymentService.createPayment(paymentRequest)

      if (paymentResponse.success && paymentResponse.redirectUrl) {
        // Redirigir a la pasarela de pago
        window.location.href = paymentResponse.redirectUrl
      } else {
        throw new Error(paymentResponse.error || 'Error al procesar el pago')
      }

    } catch (error) {
      console.error('Error processing payment:', error)
      toast({
        title: "Error al procesar el pago",
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
        variant: "destructive"
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  if (isReadOnly) {
    return (
      <Alert variant="success">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Tu pedido ha sido confirmado y pagado exitosamente.
        </AlertDescription>
      </Alert>
    )
  }

  const isLoading = isSaving || isProcessingPayment
  const canProceed = validation.canProceedToPayment && !isLoading

  return (
    <div className="space-y-4">
      {/* Información de seguridad */}
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Lock className="w-4 h-4" />
        <span>Pago seguro procesado por GetNet</span>
      </div>

      {/* Botón principal */}
      <Button
        onClick={handleConfirmAndPay}
        disabled={!canProceed}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {isSaving ? 'Guardando pedido...' : 'Procesando pago...'}
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Confirmar y pagar ${total.toLocaleString('es-CL')} CLP
          </>
        )}
      </Button>

      {/* Información adicional */}
      {!validation.canProceedToPayment && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {validation.errors.length > 0 
              ? "Completa todas las selecciones requeridas para continuar."
              : "Revisa tu pedido antes de proceder al pago."
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        Al confirmar tu pedido, aceptas los términos y condiciones del servicio.
        <br />
        Una vez confirmado, el pedido no podrá ser modificado.
      </div>
    </div>
  )
}
