import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

// Direct environment variable access for scripts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  console.error('\nPlease check your .env.local file')
    process.exit(1)
  }

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

  // 3. Verify database functions
  try {
    const { data, error } = await supabase.rpc('get_orders_summary')
    if (error) throw error
    checks.push({ name: 'Database Functions', status: '✅', details: 'Functions working' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    checks.push({ name: 'Database Functions', status: '❌', details: errorMessage })
  }

  // 4. Verify GetNet configuration
  try {
    const getnetLogin = process.env.GETNET_LOGIN
    const getnetSecret = process.env.GETNET_SECRET
    const getnetBaseUrl = process.env.GETNET_BASE_URL
    
    if (!getnetLogin || !getnetSecret || !getnetBaseUrl) {
      throw new Error('GetNet credentials not configured')
    }
    checks.push({ name: 'GetNet Configuration', status: '✅', details: 'Credentials configured' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    checks.push({ name: 'GetNet Configuration', status: '❌', details: errorMessage })
  }

  // 5. Verify email service
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      checks.push({ name: 'Email Service', status: '⚠️', details: 'Optional: Email service not configured' })
    } else {
      checks.push({ name: 'Email Service', status: '✅', details: 'Resend API key configured' })
    }
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

  // 7. Check environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GETNET_LOGIN',
    'GETNET_SECRET',
    'GETNET_BASE_URL',
    'NEXT_PUBLIC_APP_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    checks.push({ 
      name: 'Environment Variables', 
      status: '❌', 
      details: `Missing: ${missingVars.join(', ')}` 
    })
  } else {
    checks.push({ 
      name: 'Environment Variables', 
      status: '✅', 
      details: 'All required variables configured' 
    })
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