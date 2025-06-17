"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@supabase/supabase-js'

// Crear cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase = createClient(supabaseUrl, supabaseKey)

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading"|"success"|"error"|"pending">("loading")
  const [message, setMessage] = useState("Procesando pago...")
  
  // Procesar resultado de pago y actualizar el estado en la base de datos
  const processPaymentResult = async (reference: string, status: string) => {
    if (!reference) {
      console.error('No se encontró referencia de transacción')
      return
    }
    
    console.log(`Procesando resultado de pago: ${reference}, estado: ${status}`)
    
    // Definir el estado según la respuesta de GetNet
    let estadoPago = 'pendiente' // Estado predeterminado
    if (status === 'APPROVED') {
      estadoPago = 'pagado'
    } else if (status === 'REJECTED') {
      estadoPago = 'rechazado'
    } else if (status === 'PENDING') {
      estadoPago = 'pendiente'
    } else {
      estadoPago = 'error'
    }
    
    try {
      // Actualizar el pedido existente en la base de datos usando el transaction_id
      const { data, error } = await supabase
        .from('pedidos')
        .update({ estado_pago: estadoPago })
        .eq('transaction_id', reference)
        .select()
      
      if (error) {
        console.error('No se pudo actualizar el pedido:', error)
      } else {
        console.log('Pedido actualizado a estado', estadoPago, data)
        // Limpiar los datos pendientes después de actualizar solo si el pago fue exitoso
        if (status === 'APPROVED') {
          localStorage.removeItem('pendingOrderData')
        }
      }
    } catch (e) {
      console.error('Error procesando resultado de pago:', e)
    }
  }
  
  // Consultar el estado actual de los pedidos en la base de datos
  const checkOrdersStatus = async (txId: string) => {
    if (!txId) return
    
    console.log('Consultando estado actual de pedidos para transaction_id:', txId)
    
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('id, estado_pago, transaction_id')
        .eq('transaction_id', txId)
      
      if (error) {
        console.error('Error consultando pedidos:', error)
      } else {
        console.log('Estado actual de pedidos en base de datos:', data)
        
        // Si no hay registros, intentar buscar sin filtro para debuggear
        if (!data || (Array.isArray(data) && data.length === 0)) {
          console.log('No se encontraron pedidos con ese transaction_id, consultando los últimos 10 pedidos...')
          
          const { data: recentOrders, error: recentError } = await supabase
            .from('pedidos')
            .select('id, estado_pago, transaction_id')
            .order('created_at', { ascending: false })
            .limit(10)
          
          if (recentError) {
            console.error('Error consultando pedidos recientes:', recentError)
          } else {
            console.log('Pedidos recientes en base de datos:', recentOrders)
          }
        }
      }
    } catch (e) {
      console.error('Error en consulta de pedidos:', e)
    }
  }
  
  useEffect(() => {
    // Capturar todos los parámetros de la URL para un diagnóstico completo
    const allParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      allParams[key] = value
    })
    
    // Buscar parámetros que podrían contener los IDs de la transacción
    // GetNet puede enviarlos con diferentes nombres según la configuración
    const reference = searchParams.get("reference") // El ID que enviamos a GetNet
    const transactionId = searchParams.get("transactionId") // El que incluimos en returnUrl
    const lapTransactionState = searchParams.get("lapTransactionState") // Estado de la transacción
    const requestId = searchParams.get("requestId") // ID de solicitud de GetNet
    
    console.log('%c DIAGNÓSTICO COMPLETO DE REDIRECCIÓN GETNET:', 'background: #ffeb3b; color: #000; font-weight: bold; padding: 3px;')
    console.log('1. Todos los parámetros recibidos:', allParams)
    console.log('2. Parámetros principales:', {
      reference,
      transactionId,
      lapTransactionState,
      requestId
    })
    console.log('3. URL completa:', window.location.href)
    
    // IMPORTANTE: Recuperar el transaction_id original usando varias estrategias
    let originalTransactionId = null
    
    // Estrategia 1: Usar el requestId para recuperar el transactionId mapeado
    if (requestId) {
      const mappedTxId = localStorage.getItem(`getnet_request_${requestId}`)
      if (mappedTxId) {
        console.log('Encontrado transactionId mediante requestId:', mappedTxId)
        originalTransactionId = mappedTxId
      }
    }
    
    // Estrategia 2: Usar el reference o transactionId de la URL si están disponibles
    if (!originalTransactionId) {
      if (reference) {
        console.log('Usando reference como transactionId:', reference)
        originalTransactionId = reference
      } else if (transactionId) {
        console.log('Usando transactionId de URL:', transactionId)
        originalTransactionId = transactionId
      }
    }
    
    // Estrategia 3: Recuperar de localStorage si guardamos el ID actual
    if (!originalTransactionId) {
      const currentTxId = localStorage.getItem('current_getnet_transaction_id')
      if (currentTxId) {
        console.log('Recuperando transactionId de localStorage:', currentTxId)
        originalTransactionId = currentTxId
      }
    }
    
    // Log completo de la estrategia de recuperación
    console.log('RECUPERACIÓN DE ID DE TRANSACCIÓN:', {
      originalTransactionId,
      fuentes: {
        porRequestId: requestId ? localStorage.getItem(`getnet_request_${requestId}`) : null,
        reference,
        transactionIdURL: transactionId,
        currentStored: localStorage.getItem('current_getnet_transaction_id')
      }
    })
    
    // Si aún no tenemos un ID, mostrar advertencia
    if (!originalTransactionId) {
      console.warn('ADVERTENCIA: No se pudo recuperar un ID de transacción válido')
      setStatus("error")
      setMessage("No se pudo identificar la transacción. Por favor contacta a soporte.")
      return
    }
    
    // Verificar estado actual en la base de datos
    if (originalTransactionId) {
      checkOrdersStatus(originalTransactionId)
    }
    
    if (lapTransactionState === "APPROVED") {
      setStatus("success")
      setMessage("¡Tu pago ha sido procesado exitosamente!")
      // Actualizar en base de datos usando el transaction_id original recuperado
      if (originalTransactionId) {
        processPaymentResult(originalTransactionId, 'APPROVED')
      }
      // Limpiar localStorage
      localStorage.removeItem(`pendingPaymentTx`)
      localStorage.removeItem(`pendingPaymentTime`)
    } else if (lapTransactionState === "REJECTED") {
      setStatus("error")
      setMessage("El pago fue rechazado. Por favor intenta nuevamente.")
      // Registrar rechazo en base de datos
      if (originalTransactionId) {
        processPaymentResult(originalTransactionId, 'REJECTED')
      }
    } else if (lapTransactionState === "PENDING") {
      setStatus("pending")
      setMessage("Tu pago está pendiente de aprobación.")
      // Registrar pendiente en base de datos
      if (originalTransactionId) {
        processPaymentResult(originalTransactionId, 'PENDING')
      }
    } else {
      setStatus("error")
      setMessage("Ocurrió un error al procesar el pago.")
      // Registrar error en base de datos si hay referencia
      if (originalTransactionId) {
        processPaymentResult(originalTransactionId, 'ERROR')
      }
    }
  }, [searchParams])
  
  return (
    <div className="container max-w-lg mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {status === "success" ? "¡Pago Exitoso!" : 
             status === "pending" ? "Pago en Proceso" : 
             status === "error" ? "Pago Rechazado" : "Procesando..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">{message}</p>
          <Link href="/dashboard">
            <Button className="w-full">Volver al Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
