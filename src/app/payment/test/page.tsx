"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestGetnetPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Comprobar variables de entorno disponibles en cliente
  useEffect(() => {
    const envVars = {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'No disponible',
      // No podemos acceder a GETNET_* desde el cliente
    }
    console.log('Variables de entorno cliente:', envVars)
  }, [])

  const testDirectApi = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      // Crear un ID de transacción único para pruebas
      const testTxId = `TEST-${Date.now()}`
      const testAmount = 1000 // $1,000 CLP
      
      console.log('Iniciando prueba con:', { testTxId, testAmount })
      
      // Llamar a nuestra API para crear sesión GetNet
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transactionId: testTxId,
          montoTotal: testAmount
        })
      })
      
      // Capturar la respuesta completa
      const responseText = await res.text()
      console.log('Respuesta raw:', responseText)
      
      // Intentar parsear como JSON
      try {
        const data = JSON.parse(responseText)
        setResult(data)
        
        // Si hay processUrl, mostrar botón para abrir
        if (data.processUrl) {
          console.log('URL de proceso encontrada:', data.processUrl)
        }
      } catch (e) {
        console.error('Error al parsear respuesta:', e)
        setError('Respuesta no es JSON válido')
        setResult({ rawResponse: responseText })
      }
    } catch (e: any) {
      console.error('Error en prueba:', e)
      setError(e?.message || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Prueba de Integración GetNet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={testDirectApi} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Procesando...' : 'Probar API GetNet'}
            </Button>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
              </div>
            )}
            
            {result && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-bold mb-2">Respuesta:</h3>
                <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
                
                {result.processUrl && (
                  <Button 
                    onClick={() => {
                      // @ts-ignore
                      if (window.P) window.P.init(result.processUrl)
                      else window.open(result.processUrl, '_blank')
                    }}
                    className="mt-4 w-full"
                  >
                    Abrir GetNet Checkout
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
