import cron from 'node-cron'
import { createSupabaseServiceClient } from '@/lib/supabase/client'
import { EmailService } from '@/lib/notifications/emailService'
import { format, addDays } from 'date-fns'

export class OrderReminderService {
  private static supabase = createSupabaseServiceClient()

  // Send reminders for tomorrow's orders at 6 PM
  static startReminderCron() {
    cron.schedule('0 18 * * *', async () => {
      console.log('Running order reminder job...')
      await this.sendTomorrowOrderReminders()
    })
  }

  static async sendTomorrowOrderReminders() {
    try {
      const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd')

      // Get all paid orders for tomorrow
      const { data: orders, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          student:students(*),
          guardian:guardians(*),
          order_items(
            *,
            product:products(*)
          )
        `)
        .eq('delivery_date', tomorrow)
        .eq('status', 'paid')

      if (error) {
        console.error('Error fetching tomorrow orders:', error)
        return
      }

      if (!orders || orders.length === 0) {
        console.log('No orders found for tomorrow')
        return
      }

      // Group orders by guardian
      const ordersByGuardian = orders.reduce((acc, order) => {
        if (!order.guardian) return acc
        const guardianId = order.guardian.id
        if (!acc[guardianId]) {
          acc[guardianId] = {
            guardian: order.guardian,
            orders: []
          }
        }
        acc[guardianId].orders.push(order)
        return acc
      }, {} as Record<string, { guardian: any; orders: any[] }>)

      // Send reminder emails
      for (const { guardian, orders: guardianOrders } of Object.values(ordersByGuardian)) {
        try {
          // For now, send reminder for the first order (could be enhanced to include all)
          const firstOrder = guardianOrders[0]
          
          await EmailService.sendOrderReminder({
            guardian_name: guardian.full_name,
            student_name: firstOrder.student.name,
            order_number: firstOrder.order_number,
            delivery_date: firstOrder.delivery_date,
            total_amount: firstOrder.total_amount,
            items: firstOrder.order_items.map((item: any) => ({
              name: item.product.name,
              quantity: item.quantity,
              price: item.unit_price,
            })),
          }, guardian.email)

          console.log(`Reminder sent to ${guardian.email}`)
        } catch (emailError) {
          console.error(`Error sending reminder to ${guardian.email}:`, emailError)
        }
      }

      console.log(`Sent ${Object.keys(ordersByGuardian).length} reminder emails`)
    } catch (error) {
      console.error('Error in reminder job:', error)
    }
  }
}