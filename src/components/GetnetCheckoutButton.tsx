"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface GetnetCheckoutButtonProps {
  transactionId: string
  montoTotal: number
  className?: string
}

declare global {
  interface Window {
    P?: any
  }
}

export default function GetnetCheckoutButton({ transactionId, montoTotal, className }: GetnetCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string>("Tu pedido ha sido creado con estado 'pendiente' y se actualizará cuando el pago sea confirmado.")

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Iniciando pago GetNet:', { transactionId, montoTotal })
      
      // Obtener los datos del pedido desde localStorage
      const pendingOrderDataJSON = localStorage.getItem('pendingOrderData')
      const orderData = pendingOrderDataJSON ? JSON.parse(pendingOrderDataJSON) : null
      
      if (!orderData || !Array.isArray(orderData) || orderData.length === 0) {
        console.warn('No se encontraron datos de pedido en localStorage')
      } else {
        console.log(`Enviando ${orderData.length} registros de pedido junto con la solicitud de pago`)
      }
      
      // Llamar a nuestra API para crear la sesión (manejo de autenticación en el servidor)
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, montoTotal, orderData })
      })
      
      // Capturar la respuesta completa para mejor diagnóstico
      const responseText = await res.text()
      console.log('Respuesta completa:', responseText)
      
      // Parsear la respuesta como JSON
      let data
      try {
        // Comprobar si la respuesta parece HTML (contiene <!DOCTYPE o <html)
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
          console.error('La respuesta parece ser HTML en lugar de JSON');
          console.log('Primeros 150 caracteres de la respuesta:', responseText.substring(0, 150));
          throw new Error('La API devolvió HTML en lugar de JSON. Posible error del servidor.');
        }
        
        // Intentar parsear como JSON
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error al parsear respuesta:', e);
        setError('Error de comunicación con el servidor. Por favor intenta más tarde.');
        setLoading(false);
        return; // Terminamos la ejecución aquí para evitar errores adicionales
      }
      
      // Verificar si hay error en la respuesta
      if (!res.ok) {
        let errorMessage = 'Error al crear sesión de pago'
        
        if (data.error) {
          errorMessage = typeof data.error === 'string' 
            ? data.error 
            : JSON.stringify(data.error)
        }
        
        console.error('Error de API:', data)
        throw new Error(errorMessage)
      }
      
      // Verificar que tenemos URL de procesamiento
      if (!data.processUrl) {
        console.error('Respuesta sin URL de procesamiento:', data)
        throw new Error('URL de procesamiento no disponible')
      }
      
      console.log('URL de procesamiento obtenida:', data.processUrl)
      
      // IMPORTANTE: Almacenar la relación entre nuestro transaction_id y el requestId de GetNet
      if (data.requestId) {
        // 1. Guardar el mapeo de IDs para poder actualizar correctamente después
        localStorage.setItem(`getnet_request_${data.requestId}`, transactionId)
        
        // 2. También guardamos el requestId actual para poder recuperarlo en caso de que
        // la redirección no incluya todos los parámetros esperados
        localStorage.setItem('current_getnet_request_id', data.requestId)
        localStorage.setItem('current_getnet_transaction_id', transactionId)
        
        console.log('MAPEO DE IDS GUARDADO:', {
          requestId: data.requestId,
          transactionId: transactionId,
          mapKey: `getnet_request_${data.requestId}`
        })
      } else {
        console.warn('ADVERTENCIA: No se recibió requestId de GetNet')
      }
      
      // Usar lightbox o redireccionar según disponibilidad
      if (window.P) {
        console.log('Usando lightbox GetNet')
        window.P.init(data.processUrl)
      } else {
        console.log('Redireccionando a GetNet')
        window.open(data.processUrl, '_blank')
      }
    } catch (e: any) {
      console.error('Error en checkout GetNet:', e)
      setError(e.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      {/* Mensaje informativo sobre la creación del pedido */}
      <div className="mb-3 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
        <p className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {infoMessage}
        </p>
      </div>

      <Button 
        onClick={handleCheckout}
        className={`w-full ${className || ''}`}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="mr-2 animate-spin">⟳</span>
            Procesando...
          </>
        ) : (
          `Pagar con GetNet (CLP ${montoTotal.toLocaleString()})`
        )}
      </Button>
      {error && (
        <div className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
