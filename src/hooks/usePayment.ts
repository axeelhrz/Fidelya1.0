'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPayment = async (orderId: string) => {
    try {
      setIsProcessing(true)
      setError(null)

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error creating payment')
      }

      // Redirect to GetNet checkout
      window.location.href = data.data.checkout_url

      return data.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error processing payment'
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setIsProcessing(false)
    }
  }

  return {
    createPayment,
    isProcessing,
    error,
  }
}