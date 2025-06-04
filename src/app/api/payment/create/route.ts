import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/client'
import { getNetClient } from '@/lib/getnet/client'
import { config } from '@/lib/config/environment'
import { z } from 'zod'

const createPaymentSchema = z.object({
  order_id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { order_id } = createPaymentSchema.parse(body)

    const supabase = createSupabaseServerClient()
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        student:students(*),
        guardian:guardians(*)
      `)
      .eq('id', order_id)
      .eq('status', 'pending')
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Pedido no encontrado o no está pendiente' },
        { status: 404 }
      )
    }

    // Verify user owns this order
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !order.guardian || order.guardian.user_id !== user.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        amount: order.total_amount,
        status: 'pending',
        payment_method: 'getnet',
      })
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json(
        { error: 'Error creando registro de pago' },
        { status: 500 }
      )
    }

    // Create GetNet payment
    const paymentRequest = {
      amount: order.total_amount,
      order_id: order.order_number,
      customer: {
        name: order.guardian.full_name,
        email: order.guardian.email,
        phone: order.guardian.phone || undefined,
      },
      return_url: `${config.app.url}/payment/result?order_id=${order.id}`,
      notify_url: `${config.app.url}/api/payment/notify`,
    }

    const getnetResponse = await getNetClient.createPayment(paymentRequest)

    // Update payment with GetNet details
    await supabase
      .from('payments')
      .update({
        transaction_id: getnetResponse.payment_id,
        gateway_response: JSON.parse(JSON.stringify(getnetResponse)),
      })
      .eq('id', payment.id)

    return NextResponse.json({
      success: true,
      data: {
        payment_id: getnetResponse.payment_id,
        checkout_url: getnetResponse.checkout_url,
        order_number: order.order_number,
      },
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}