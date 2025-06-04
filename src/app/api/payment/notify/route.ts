import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase/client'
import { getNetClient } from '@/lib/getnet/client'
import { EmailService } from '@/lib/notifications/emailService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-getnet-signature') || ''

    // Validate webhook signature
    if (!getNetClient.validateWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }

    const payload = JSON.parse(body)
    const webhookData = getNetClient.processWebhookPayload(payload)
    const supabase = createSupabaseServiceClient()

    // Find payment by transaction ID
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select(`
        *,
        order:orders(
          *,
          student:students(*),
          guardian:guardians(*),
          order_items(
            *,
            product:products(*)
          )
    )
      `)
      .eq('transaction_id', webhookData.payment_id)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', webhookData.payment_id)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }
    
    // Update payment status
    const newPaymentStatus = webhookData.status === 'approved' ? 'approved' : 
                            webhookData.status === 'rejected' ? 'rejected' : 'cancelled'

    await supabase
      .from('payments')
      .update({
        status: newPaymentStatus,
        processed_at: webhookData.processed_at,
        gateway_response: webhookData.gateway_response,
      })
      .eq('id', payment.id)

    // Update order status
    const newOrderStatus = webhookData.status === 'approved' ? 'paid' : 'cancelled'
    
    if (payment.order_id) {
      await supabase
        .from('orders')
        .update({ status: newOrderStatus })
        .eq('id', payment.order_id)
    }

    // Send confirmation email if payment approved
    if (webhookData.status === 'approved' && payment.order && payment.order.guardian && payment.order.student) {
      try {
        await EmailService.sendOrderConfirmation({
          guardian_name: payment.order.guardian.full_name,
          student_name: payment.order.student.name,
          order_number: payment.order.order_number,
          delivery_date: payment.order.delivery_date,
          total_amount: payment.order.total_amount,
          items: payment.order.order_items.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.unit_price,
          })),
        }, payment.order.guardian.email)
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't fail the webhook for email errors
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing payment webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
