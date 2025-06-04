import { Resend } from 'resend'
import { config } from '@/lib/config/environment'
import { OrderConfirmationEmailData } from '@/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const resend = new Resend(config.email.resendApiKey)
export class EmailService {
  static async sendOrderConfirmation(
    orderData: OrderConfirmationEmailData,
    recipientEmail: string
  ) {
    if (!config.email.resendApiKey) {
      console.warn('Resend API key not configured, skipping email')
      return
    }

    const formattedDate = format(new Date(orderData.delivery_date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
    const formattedAmount = new Intl.NumberFormat('es-CL', {
        style: 'currency',
      currency: 'CLP',
    }).format(orderData.total_amount / 100)
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Pedido - ${config.casino.name}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0ea5e9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-weight: bold; font-size: 1.2em; color: #0ea5e9; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
              <h1>${config.casino.name}</h1>
              <p>Confirmación de Pedido</p>
          </div>
          
          <div class="content">
              <h2>¡Hola ${orderData.guardian_name}!</h2>
              <p>Tu pedido ha sido confirmado y el pago procesado exitosamente.</p>
            <div class="order-details">
              <h3>Detalles del Pedido</h3>
                <p><strong>Número de Pedido:</strong> #${orderData.order_number}</p>
                <p><strong>Estudiante:</strong> ${orderData.student_name}</p>
                <p><strong>Fecha de Entrega:</strong> ${formattedDate}</p>
              <h4>Productos:</h4>
                ${orderData.items.map(item => `
                  <div class="item">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price * item.quantity / 100)}</span>
                  </div>
                `).join('')}
              
                <div class="item total">
                  <span>Total Pagado:</span>
                  <span>${formattedAmount}</span>
            </div>
          </div>
          
              <p><strong>Importante:</strong></p>
              <ul>
                <li>El pedido será entregado el día indicado durante el horario de almuerzo/colación</li>
                <li>Si tienes alguna consulta, puedes contactarnos a ${config.casino.email}</li>
                <li>Guarda este email como comprobante de tu pedido</li>
              </ul>
          </div>
            
            <div class="footer">
              <p>${config.casino.name}</p>
              <p>Email: ${config.casino.email} | Teléfono: ${config.casino.phone}</p>
        </div>
          </div>
      </body>
      </html>
    `

    const text = `
      ${config.casino.name} - Confirmación de Pedido
      
      Hola ${orderData.guardian_name},
      
      Tu pedido ha sido confirmado y el pago procesado exitosamente.
      Detalles del Pedido:
      - Número de Pedido: #${orderData.order_number}
      - Estudiante: ${orderData.student_name}
      - Fecha de Entrega: ${formattedDate}
      - Total Pagado: ${formattedAmount}
      
      Productos:
      ${orderData.items.map(item => 
        `- ${item.name} (x${item.quantity}): ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(item.price * item.quantity / 100)}`
      ).join('\n')}
      
      Contacto: ${config.casino.email} | ${config.casino.phone}
    `

    try {
      const result = await resend.emails.send({
        from: `${config.casino.name} <noreply@casinoescolar.cl>`,
        to: recipientEmail,
        subject: `Confirmación de Pedido #${orderData.order_number} - ${config.casino.name}`,
        html,
        text,
      })

      console.log('Email sent successfully:', result)
      return result
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
  }
  }

  static async sendOrderReminder(
    orderData: OrderConfirmationEmailData,
    recipientEmail: string
  ) {
    if (!config.email.resendApiKey) {
      console.warn('Resend API key not configured, skipping email')
      return
    }

    const formattedDate = format(new Date(orderData.delivery_date), "EEEE, d 'de' MMMM", { locale: es })
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recordatorio de Pedido - ${config.casino.name}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .reminder-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
            <div class="header">
              <h1>${config.casino.name}</h1>
              <p>Recordatorio de Pedido</p>
            </div>
            
            <div class="content">
              <h2>¡Hola ${orderData.guardian_name}!</h2>
              
              <div class="reminder-box">
                <h3>🍽️ Recordatorio: Pedido para mañana</h3>
                <p><strong>Estudiante:</strong> ${orderData.student_name}</p>
                <p><strong>Fecha de Entrega:</strong> ${formattedDate}</p>
                <p><strong>Número de Pedido:</strong> #${orderData.order_number}</p>
              </div>
              
              <p>Te recordamos que tienes un pedido confirmado para mañana. El almuerzo/colación será entregado durante el horario correspondiente.</p>
              
              <p>Si tienes alguna consulta, puedes contactarnos a ${config.casino.email}</p>
            </div>
          </div>
      </body>
      </html>
    `

    try {
      const result = await resend.emails.send({
        from: `${config.casino.name} <noreply@casinoescolar.cl>`,
        to: recipientEmail,
        subject: `Recordatorio: Pedido para mañana - ${config.casino.name}`,
        html,
      })

      return result
    } catch (error) {
      console.error('Error sending reminder email:', error)
      throw error
    }
  }
}
