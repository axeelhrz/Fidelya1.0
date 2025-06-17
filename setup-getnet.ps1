# Configuración de GetNet para aplicación Next.js
# Script para PowerShell en Windows

# 1. Creando directorios de API y componentes
Write-Host "🔧 1. Creando directorios de API y componentes..."
New-Item -ItemType Directory -Force -Path src\app\api\payment\create | Out-Null
New-Item -ItemType Directory -Force -Path src\app\api\payment\notify | Out-Null
New-Item -ItemType Directory -Force -Path src\app\payment\result | Out-Null

# 2. Endpoint CREATE
Write-Host "🔧 2. Endpoint CREATE (src\app\api\payment\create\route.ts)..."
@'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { transactionId, montoTotal } = await req.json()
    const seed  = new Date().toISOString()
    const nonce = Buffer.from(Math.random().toString()).toString('base64')
    const tranKey = crypto
      .createHash('sha256')
      .update(nonce + seed + process.env.GETNET_SECRET!)
      .digest()
      .toString('base64')

    const payload = {
      auth: { login: process.env.GETNET_LOGIN, tranKey, nonce, seed },
      payment: {
        reference: transactionId,
        description: `Pedido Casino TX ${transactionId}`,
        amount: { currency: 'CLP', total: montoTotal }
      },
      expiration: new Date(Date.now() + 900_000).toISOString(),
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/result`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent')
    }

    const resp = await fetch(
      `${process.env.GETNET_BASE_URL}/api/session/`,
      { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) }
    )
    if (!resp.ok) throw await resp.json()
    const data = await resp.json()
    return NextResponse.json({ processUrl: data.processUrl, requestId: data.requestId })
  } catch (e: any) {
    console.error("Getnet CREATE error:", e)
    return NextResponse.json({ error: e }, { status: 500 })
  }
}
'@ | Out-File -Encoding utf8 src\app\api\payment\create\route.ts

# 3. Endpoint NOTIFY
Write-Host "🔧 3. Endpoint NOTIFY (src\app\api\payment\notify\route.ts)..."
@'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase/client'

export async function POST(req: NextRequest) {
  try {
    const { requestId, status, reference, date } = await req.json()
    // (Opcional) validar firma:
    // const sig = req.headers.get('x-getnet-signature')
    // const expected = crypto.createHash('sha1')
    //   .update(requestId + status.status + date + process.env.GETNET_SECRET)
    //   .digest('hex')
    // if (sig !== expected) return NextResponse.json({}, { status:400 })

    if (status.status === 'APPROVED') {
      // Actualiza tu tabla de pedidos según `reference`...
      const { error } = await supabase
        .from('pedidos')
        .update({ 
          estado_pago: 'pagado',
          metodo_pago: 'getnet',
          codigo_confirmacion: requestId
        })
        .eq('transaction_id', reference)
      
      if (error) console.error("Error actualizando pedido:", error)
    }
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    console.error("Getnet NOTIFY error:", e)
    return NextResponse.json({}, { status: 200 }) // siempre 200 para que no reintente
  }
}
'@ | Out-File -Encoding utf8 src\app\api\payment\notify\route.ts

# 4. Página de RESULT
Write-Host "🔧 4. Página de RESULT (src\app\payment\result\page.tsx)..."
@'
"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentResultPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading"|"success"|"error"|"pending">("loading")
  const [message, setMessage] = useState("Procesando pago...")
  
  useEffect(() => {
    const reference = searchParams.get("reference")
    const lapTransactionState = searchParams.get("lapTransactionState")
    
    if (lapTransactionState === "APPROVED") {
      setStatus("success")
      setMessage("¡Tu pago ha sido procesado exitosamente!")
      // Limpiar localStorage
      localStorage.removeItem(`pendingPaymentTx`)
      localStorage.removeItem(`pendingPaymentTime`)
    } else if (lapTransactionState === "REJECTED") {
      setStatus("error")
      setMessage("El pago fue rechazado. Por favor intenta nuevamente.")
    } else if (lapTransactionState === "PENDING") {
      setStatus("pending")
      setMessage("Tu pago está pendiente de aprobación.")
    } else {
      setStatus("error")
      setMessage("Ocurrió un error al procesar el pago.")
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
'@ | Out-File -Encoding utf8 src\app\payment\result\page.tsx

# 5. Componente GetnetCheckoutButton
Write-Host "🔧 5. Componente GetnetCheckoutButton (src\components\GetnetCheckoutButton.tsx)..."
@'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

interface Props {
  transactionId: string
  montoTotal: number
}

export default function GetnetCheckoutButton({ transactionId, montoTotal }: Props) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, montoTotal })
      })
      const { processUrl } = await res.json()
      // @ts-ignore
      window.P.init(processUrl)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 mb-4">
      {loading ? 'Redirigiendo…' : `Pagar con GetNet (CLP ${montoTotal.toLocaleString()})`}
    </Button>
  )
}
'@ | Out-File -Encoding utf8 src\components\GetnetCheckoutButton.tsx

# 6. Instalar axios
Write-Host "🔧 6. Instalando axios..."
npm install axios --save

Write-Host "✅ Configuración completada. Ahora necesitas:"
Write-Host "   1. Agregar el script de lightbox en src\app\layout.tsx:"
Write-Host "      <script src='https://checkout.getnet.cl/lightbox.min.js'></script>"
Write-Host "   2. Modificar PaymentConfirmation.tsx para incluir el botón de GetNet"
Write-Host "      import GetnetCheckoutButton from '@/components/GetnetCheckoutButton'"
