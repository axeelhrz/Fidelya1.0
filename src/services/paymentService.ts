import { PaymentRequest, PaymentResponse } from '@/types/order'

export class PaymentService {
  static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })
      
      if (!response.ok) {
        throw new Error('Error al crear el pago')
      }
      
      const data = await response.json()
      
      return {
        success: true,
        paymentId: data.paymentId,
        redirectUrl: data.redirectUrl
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido al procesar el pago'
      }
    }
  }

  static async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/payment/verify/${paymentId}`)
      
      if (!response.ok) {
        return false
      }
      
      const data = await response.json()
      return data.success && data.status === 'paid'
    } catch (error) {
      console.error('Error verifying payment:', error)
      return false
    }
  }
}
