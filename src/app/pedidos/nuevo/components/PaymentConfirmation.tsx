"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase/client'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import GetnetCheckoutButton from "@/components/GetnetCheckoutButton"

interface PaymentConfirmationProps {
  transactionId: string
  montoTotal: number
  linkPago: string
  addHiddenField: (name: string, value: string) => React.ReactNode
}

export function PaymentConfirmation({
  transactionId,
  montoTotal,
  linkPago,
  addHiddenField
}: PaymentConfirmationProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [paymentCode, setPaymentCode] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleConfirmPayment = async () => {
    if (!isVerified) {
      toast({
        variant: "destructive",
        title: "Verificación requerida",
        description: "Debes confirmar que has realizado el pago marcando la casilla.",
      })
      return
    }

    setIsUpdating(true)
    
    try {
      // Actualizar el estado de los pedidos asociados a esta transacción
      const { error } = await supabase
        .from('pedidos')
        .update({ 
          estado_pago: 'pagado',
          // Si hay código de confirmación, guardarlo
          ...(paymentCode ? { codigo_confirmacion: paymentCode } : {})
        })
        .eq('transaction_id', transactionId)
        
      if (error) throw error
      
      // Limpiar localStorage
      localStorage.removeItem('paymentVerified_' + transactionId)
      localStorage.removeItem('paymentCode_' + transactionId)
      localStorage.removeItem('pendingPaymentTx')
      localStorage.removeItem('pendingPaymentTime')
      
      toast({
        title: "¡Pago confirmado!",
        description: "Tu pedido ha sido completado exitosamente.",
      })
    } catch (error) {
      console.error("Error al confirmar pago:", error)
      toast({
        variant: "destructive",
        title: "Error al confirmar pago",
        description: "No se pudo confirmar el pago. Por favor, contacta a soporte."
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">¡Pedido Creado!</h2>
          <p className="text-gray-600">Tu pedido ha sido registrado correctamente.</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-green-800 mb-2">Instrucciones de Pago</h3>
          <p className="text-green-700 mb-4">
            Para completar tu pedido, realiza el pago de <strong>${montoTotal.toLocaleString()}</strong> a través de uno de estos métodos:
          </p>

          {/* Botón de GetNet */}
          <GetnetCheckoutButton 
            transactionId={transactionId} 
            montoTotal={montoTotal} 
          />
          
          <form action="https://www.webpay.cl/form-pay/281171" method="get" className="mb-4" target="_blank">
            {/* Campos ocultos para Webpay */}
            {addHiddenField('email', '')}
            {addHiddenField('subject', `Pedido Casino - TX: ${transactionId}`)}
            {addHiddenField('transaction_id', transactionId)}
            {addHiddenField('amount', montoTotal.toString())}
            {addHiddenField('token', transactionId)}
            
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Pagar con Webpay (${montoTotal.toLocaleString()})
            </Button>
          </form>
          
          <div className="text-sm text-green-700">
            <p>Una vez completado el pago, regresa a esta página para confirmar si pagaste con WebPay, o espera la redirección automática si pagaste con GetNet.</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Confirmación de Pago Manual (Solo WebPay)</h3>
          
          {/* Casilla de verificación */}
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox 
              id="confirm-payment" 
              checked={isVerified}
              onCheckedChange={(checked) => {
                setIsVerified(checked === true)
                // Guardar en localStorage
                localStorage.setItem('paymentVerified_' + transactionId, (checked === true).toString())
              }}
            />
            <Label htmlFor="confirm-payment" className="cursor-pointer">
              Confirmo que he completado el pago a través de Webpay
            </Label>
          </div>
          
          {/* Código de confirmación */}
          <div className="mb-4">
            <label htmlFor="codigoCompra" className="block text-sm font-medium mb-1">Código de orden (opcional):</label>
            <input 
              type="text" 
              id="codigoCompra" 
              placeholder="Ejemplo: 123456" 
              className="w-full p-2 border rounded" 
              value={paymentCode}
              onChange={(e) => {
                setPaymentCode(e.target.value)
                // Guardar en localStorage
                localStorage.setItem('paymentCode_' + transactionId, e.target.value)
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Si tienes un código de confirmación de Webpay, ingrésalo aquí para mayor seguridad.</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            disabled={isUpdating}
            onClick={handleConfirmPayment}
          >
            {isUpdating ? "Procesando..." : "Confirmar pago realizado"}
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Link href="/dashboard">
          <Button>Volver al Dashboard</Button>
        </Link>
      </CardFooter>
    </>
  )
}
