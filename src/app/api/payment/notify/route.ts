import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/services/paymentService'

export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json()
    
    console.log('Received NetGet notification:', notificationData)

    // Procesar la notificación usando el PaymentService
    const result = await PaymentService.processNotification(notificationData)

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: result.message 
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.message 
        },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error processing payment notification:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al procesar la notificación' 
      },
      { status: 500 }
    )
  }
}

// Manejar método GET para verificaciones de webhook
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'payment-notification' 
  })
}
