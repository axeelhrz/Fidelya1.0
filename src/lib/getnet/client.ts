import axios, { AxiosInstance } from 'axios'
import { config } from '@/lib/config/environment'
import { GetNetPaymentRequest, GetNetPaymentResponse, GetNetWebhookPayload } from '@/types'

export class GetNetClient {
  private client: AxiosInstance
  private login: string
  private secret: string

  constructor() {
    this.login = config.getnet.login
    this.secret = config.getnet.secret
    
    this.client = axios.create({
      baseURL: config.getnet.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // Add request interceptor for authentication
    this.client.interceptors.request.use((config) => {
      const auth = Buffer.from(`${this.login}:${this.secret}`).toString('base64')
      config.headers.Authorization = `Basic ${auth}`
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('GetNet API Error:', error.response?.data || error.message)
        throw new Error(
          error.response?.data?.message || 
          'Error en la comunicación con GetNet'
        )
      }
    )
  }

  // Create payment session
  async createPayment(paymentData: GetNetPaymentRequest): Promise<GetNetPaymentResponse> {
    try {
      const response = await this.client.post('/checkout/create', {
        amount: paymentData.amount,
        currency: 'CLP',
        order_id: paymentData.order_id,
        description: `Pedido Casino Escolar - ${paymentData.order_id}`,
        customer: {
          name: paymentData.customer.name,
          email: paymentData.customer.email,
          phone: paymentData.customer.phone,
        },
        return_url: paymentData.return_url,
        notify_url: paymentData.notify_url,
        metadata: {
          source: 'casino_escolar',
          order_id: paymentData.order_id,
        },
      })

      return {
        payment_id: response.data.payment_id,
        checkout_url: response.data.checkout_url,
        status: response.data.status,
      }
    } catch (error) {
      console.error('Error creating GetNet payment:', error)
      throw error
    }
  }

  // Get payment status
  async getPaymentStatus(paymentId: string) {
    try {
      const response = await this.client.get(`/payment/${paymentId}/status`)
      return response.data
    } catch (error) {
      console.error('Error getting payment status:', error)
      throw error
    }
  }

  // Validate webhook signature
  validateWebhookSignature(payload: string, signature: string): boolean {
    try {
      const crypto = require('crypto')
      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(payload)
        .digest('hex')
      
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expectedSignature, 'hex')
      )
    } catch (error) {
      console.error('Error validating webhook signature:', error)
      return false
    }
  }

  // Process webhook payload
  processWebhookPayload(payload: any): GetNetWebhookPayload {
    return {
      payment_id: payload.payment_id,
      order_id: payload.order_id,
      status: payload.status,
      amount: payload.amount,
      transaction_id: payload.transaction_id,
      processed_at: payload.processed_at || new Date().toISOString(),
      gateway_response: payload,
    }
  }

  // Utility methods
  static formatAmount(amount: number): number {
    // GetNet expects amount in cents
    return Math.round(amount)
  }

  static generateOrderReference(orderId: string): string {
    return `CASINO_${orderId}_${Date.now()}`
  }
}

// Singleton instance
export const getNetClient = new GetNetClient()