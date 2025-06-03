import { supabase } from '@/lib/supabase/client'
import { Guardian, Order, Student } from '@/lib/supabase/types'

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export class EmailService {
  /**
   * Enviar email de confirmación de pago
   */
  static async sendPaymentConfirmation(
    guardianId: string, 
    orderId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar si las notificaciones están habilitadas
      const { data: setting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'email_notifications_enabled')
        .single()

      if (setting?.value !== 'true') {
        return { success: true } // No enviar si está deshabilitado
      }

      // Obtener datos del pedido y guardian
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          students (
            name,
            grade,
            section
          ),
          guardians (
            full_name,
            email
          ),
          order_items (
            quantity,
            unit_price,
            total_price,
            products (
              codigo,
              descripcion
            )
          )
        `)
        .eq('id', orderId)
        .single()

      if (orderError || !order) {
        return { success: false, error: 'Pedido no encontrado' }
      }

      const guardian = order.guardians
      const student = order.students

      if (!guardian?.email) {
        return { success: false, error: 'Email del guardian no encontrado' }
      }

      // Generar template del email
      const template = this.generatePaymentConfirmationTemplate(order as any)

      // Aquí integrarías con tu servicio de email preferido
      // Ejemplo con Resend, SendGrid, etc.
      
      console.log('📧 Email de confirmación generado:', {
        to: guardian.email,
        subject: template.subject,
        orderId: orderId.substring(0, 8)
      })

      // Simular envío exitoso por ahora
      // En producción, reemplazar con llamada real al servicio de email
      
      /*
      // Ejemplo con Resend:
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'casino@colegio.cl',
          to: guardian.email,
          subject: template.subject,
          html: template.html
        })
      })

      if (!response.ok) {
        throw new Error('Error enviando email')
      }
      */

      return { success: true }

    } catch (error) {
      console.error('Error sending payment confirmation email:', error)
      return { success: false, error: 'Error enviando email' }
    }
  }

  /**
   * Enviar recordatorio de pedido
   */
  static async sendOrderReminder(
    guardianEmail: string,
    studentName: string,
    deliveryDate: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const template = this.generateOrderReminderTemplate(studentName, deliveryDate)

      console.log('📧 Recordatorio de pedido generado:', {
        to: guardianEmail,
        subject: template.subject,
        deliveryDate
      })

      // Implementar envío real aquí

      return { success: true }

    } catch (error) {
      console.error('Error sending order reminder:', error)
      return { success: false, error: 'Error enviando recordatorio' }
    }
  }

  /**
   * Generar template de confirmación de pago
   */
  private static generatePaymentConfirmationTemplate(order: any): EmailTemplate {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(price)
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const subject = `Confirmación de pago - Pedido #${order.id.substring(0, 8)}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .order-details { background-color: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .success { color: #059669; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Pago Confirmado!</h1>
          </div>
          
          <div class="content">
            <p>Estimado/a <strong>${order.guardians?.full_name}</strong>,</p>
            
            <p class="success">✅ Su pago ha sido procesado exitosamente.</p>
            
            <div class="order-details">
              <h3>Detalles del Pedido</h3>
              <p><strong>Número de pedido:</strong> #${order.id.substring(0, 8)}</p>
              <p><strong>Estudiante:</strong> ${order.students?.name}</p>
              <p><strong>Curso:</strong> ${order.students?.grade} ${order.students?.section}</p>
              <p><strong>Fecha de entrega:</strong> ${formatDate(order.fecha_pedido)}</p>
              <p><strong>Día:</strong> ${order.dia_entrega}</p>
              
              <h4>Productos:</h4>
              <ul>
                ${order.order_items?.map((item: any) => `
                  <li>${item.products?.descripcion} - ${item.quantity}x ${formatPrice(item.unit_price)} = ${formatPrice(item.total_price)}</li>
                `).join('') || ''}
              </ul>
              
              <p><strong>Total pagado:</strong> ${formatPrice(order.total_amount)}</p>
            </div>
            
            <p>El almuerzo será preparado y estará disponible en la fecha indicada.</p>
            
            <p>Si tiene alguna consulta, puede contactarnos respondiendo a este email.</p>
            
            <p>Gracias por usar nuestro sistema de casino escolar.</p>
          </div>
          
          <div class="footer">
            <p>Este es un email automático, por favor no responder.</p>
            <p>Casino Escolar - Sistema de Pedidos</p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      ¡Pago Confirmado!
      
      Estimado/a ${order.guardians?.full_name},
      
      Su pago ha sido procesado exitosamente.
      
      Detalles del Pedido:
      - Número: #${order.id.substring(0, 8)}
      - Estudiante: ${order.students?.name}
      - Curso: ${order.students?.grade} ${order.students?.section}
      - Fecha de entrega: ${formatDate(order.fecha_pedido)}
      - Total: ${formatPrice(order.total_amount)}
      
      Gracias por usar nuestro sistema de casino escolar.
    `

    return { subject, html, text }
  }

  /**
   * Generar template de recordatorio
   */
  private static generateOrderReminderTemplate(
    studentName: string, 
    deliveryDate: string
  ): EmailTemplate {
    const subject = `Recordatorio: Pedido pendiente para ${studentName}`

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
      </head>
      <body>
        <h2>Recordatorio de Pedido</h2>
        <p>Estimado apoderado,</p>
        <p>Le recordamos que aún no ha realizado el pedido de almuerzo para <strong>${studentName}</strong> para el día <strong>${deliveryDate}</strong>.</p>
        <p>Recuerde que los pedidos deben realizarse antes de las 10:00 AM del día de entrega.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/pedidos/nuevo">Realizar pedido ahora</a></p>
      </body>
      </html>
    `

    const text = `
      Recordatorio de Pedido
      
      Estimado apoderado,
      
      Le recordamos que aún no ha realizado el pedido de almuerzo para ${studentName} para el día ${deliveryDate}.
      
      Recuerde que los pedidos deben realizarse antes de las 10:00 AM del día de entrega.
    `

    return { subject, html, text }
  }
}