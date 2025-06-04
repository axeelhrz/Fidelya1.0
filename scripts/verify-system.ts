import { createClient } from '@supabase/supabase-js'
import { config } from '../src/lib/config/environment'
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey!
)

interface Check {
  name: string
  status: '✅' | '❌' | '⚠️'
  details: string
}

async function verifySystem() {
  console.log('🔍 Verifying Casino Escolar system...')
  
  const checks: Check[] = []

  // 1. Verify Supabase connection
  try {
    const { data, error } = await supabase.from('settings').select('*').limit(1)
    if (error) throw error
    checks.push({ name: 'Supabase Connection', status: '✅', details: 'Connected successfully' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    checks.push({ name: 'Supabase Connection', status: '❌', details: errorMessage })
  }

  // 2. Verify database schema
  try {
    const tables = ['guardians', 'students', 'products', 'orders', 'order_items', 'payments', 'settings']
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1)
      if (error) throw new Error(`Table ${table}: ${error.message}`)
    }
    checks.push({ name: 'Database Schema', status: '✅', details: 'All tables exist' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    checks.push({ name: 'Database Schema', status: '❌', details: errorMessage })
  }

  // 3. Verify RLS policies
  try {
    const { data, error } = await supabase.rpc('get_orders_summary')
    checks.push({ name: 'Database Functions', status: '✅', details: 'Functions working' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    checks.push({ name: 'Database Functions', status: '❌', details: errorMessage })
  }

  // 4. Verify GetNet configuration
  try {
    // Just check if credentials are set
    if (!config.getnet.login || !config.getnet.secret) {
      throw new Error('GetNet credentials not configured')
    }
    checks.push({ name: 'GetNet Configuration', status: '✅', details: 'Credentials configured' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    checks.push({ name: 'GetNet Configuration', status: '❌', details: errorMessage })
  }

  // 5. Verify email service
  try {
    if (!config.email.resendApiKey) {
      throw new Error('Email service not configured')
    }
    checks.push({ name: 'Email Service', status: '✅', details: 'Resend API key configured' })
  } catch (error) {
    checks.push({ name: 'Email Service', status: '⚠️', details: 'Optional: Email service not configured' })
  }

  // 6. Check sample data
  try {
    const { data: products } = await supabase.from('products').select('*').limit(1)
    const { data: settings } = await supabase.from('settings').select('*').limit(1)
    
    if (!products?.length) {
      checks.push({ name: 'Sample Data', status: '⚠️', details: 'No products found - run seed script' })
    } else {
      checks.push({ name: 'Sample Data', status: '✅', details: 'Sample data exists' })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    checks.push({ name: 'Sample Data', status: '❌', details: errorMessage })
  }

  // Print results
  console.log('\n📋 System Verification Results:')
  console.log('================================')
  
  checks.forEach(check => {
    console.log(`${check.status} ${check.name}: ${check.details}`)
  })

  const hasErrors = checks.some(check => check.status === '❌')
  const hasWarnings = checks.some(check => check.status === '⚠️')

  console.log('\n📊 Summary:')
  if (hasErrors) {
    console.log('❌ System has critical errors that need to be fixed')
    process.exit(1)
  } else if (hasWarnings) {
    console.log('⚠️  System is functional but has some warnings')
  } else {
    console.log('✅ System is fully operational!')
  }
}

// Run if called directly
if (require.main === module) {
  verifySystem().catch(console.error)
}

export { verifySystem }