// Script para verificar variables de entorno
console.log('🔍 Verificando variables de entorno...\n')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

let allGood = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  const status = value ? '✅' : '❌'
  console.log(`${status} ${varName}: ${value ? 'configurada' : 'NO CONFIGURADA'}`)
  
  if (!value) {
    allGood = false
  }
})

if (!allGood) {
  console.log('\n❌ Faltan variables de entorno requeridas')
  console.log('Crea un archivo .env.local en la raíz del proyecto con:')
  console.log(`
NEXT_PUBLIC_SUPABASE_URL=https://koesipeybsasrknvgntg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZXNpcGV5YnNhc3JrbnZnbnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Mzg2MzEsImV4cCI6MjA1ODUxNDYzMX0.zLUMG6PRVJK1pEaAdO4pssFKGp8XMx9VAvwii4Xw1iU
  `)
} else {
  console.log('\n✅ Todas las variables requeridas están configuradas')
}