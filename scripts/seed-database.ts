import { createClient } from '@supabase/supabase-js'
import { config } from '../src/lib/config/environment'
import { addDays, format } from 'date-fns'

const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey!
)

async function seedDatabase() {
  console.log('🌱 Seeding database...')

  try {
    // Seed products for the next week
    const products = []
    const productTypes = ['almuerzo', 'colacion'] as const
    const menuItems = {
      almuerzo: [
        { name: 'Pollo al Horno con Papas', description: 'Pollo al horno con papas doradas y ensalada', price_student: 3500, price_staff: 4000 },
        { name: 'Pescado a la Plancha', description: 'Pescado fresco con arroz y verduras', price_student: 4000, price_staff: 4500 },
        { name: 'Pasta Boloñesa', description: 'Pasta con salsa boloñesa casera', price_student: 3000, price_staff: 3500 },
        { name: 'Cazuela de Pollo', description: 'Cazuela tradicional chilena', price_student: 3500, price_staff: 4000 },
        { name: 'Lomo Saltado', description: 'Lomo saltado con papas fritas', price_student: 4500, price_staff: 5000 },
      ],
      colacion: [
        { name: 'Sandwich Italiano', description: 'Pan con palta, tomate y mayo', price_student: 2000, price_staff: 2500 },
        { name: 'Empanada de Pino', description: 'Empanada casera de pino', price_student: 1800, price_staff: 2200 },
        { name: 'Completo Italiano', description: 'Completo con palta, tomate y mayo', price_student: 2200, price_staff: 2700 },
        { name: 'Sandwich de Pollo', description: 'Sandwich de pollo con lechuga', price_student: 2500, price_staff: 3000 },
        { name: 'Sopaipillas', description: 'Sopaipillas con pebre', price_student: 1500, price_staff: 2000 },
      ]
    }

    // Generate products for next 7 days (excluding weekends)
    for (let i = 1; i <= 7; i++) {
      const date = addDays(new Date(), i)
      const dayOfWeek = date.getDay()
      
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue

      const dateStr = format(date, 'yyyy-MM-dd')
      const dayName = format(date, 'EEEE')

      for (const type of productTypes) {
        const items = menuItems[type]
        const randomItem = items[Math.floor(Math.random() * items.length)]
        
        products.push({
          code: `${type.toUpperCase()}_${dateStr}_${Math.random().toString(36).substr(2, 9)}`,
          name: randomItem.name,
          description: randomItem.description,
          type,
          price_student: randomItem.price_student,
          price_staff: randomItem.price_staff,
          available_date: dateStr,
          day_of_week: dayName,
          is_active: true,
        })
      }
    }

    const { error: productsError } = await supabase
      .from('products')
      .insert(products)

    if (productsError) {
      console.error('Error seeding products:', productsError)
      return
    }

    console.log(`✅ Seeded ${products.length} products`)

    // Seed sample admin user (if not exists)
    const { data: existingAdmin } = await supabase
      .from('guardians')
      .select('id')
      .eq('email', 'admin@casinoescolar.cl')
      .single()

    if (!existingAdmin) {
      // Create auth user first
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'admin@casinoescolar.cl',
        password: 'admin123456',
        email_confirm: true,
        user_metadata: {
          full_name: 'Administrador Casino'
        }
      })

      if (authError) {
        console.error('Error creating admin auth user:', authError)
      } else {
        // Create guardian profile
        const { error: guardianError } = await supabase
          .from('guardians')
          .insert({
            user_id: authUser.user.id,
            full_name: 'Administrador Casino',
            email: 'admin@casinoescolar.cl',
            role: 'admin',
            phone: '+56912345678'
          })

        if (guardianError) {
          console.error('Error creating admin guardian:', guardianError)
        } else {
          console.log('✅ Created admin user: admin@casinoescolar.cl / admin123456')
        }
      }
    }

    console.log('🎉 Database seeding completed!')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
}

export { seedDatabase }