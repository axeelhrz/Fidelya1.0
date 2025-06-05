# Script para recrear el archivo .env.local con formato correcto
# Ejecutar con: .\fix-env.ps1

# Respaldar el archivo original
Copy-Item .env.local .env.local.backup -Force

# Crear nuevo archivo con formato correcto
@"
NEXT_PUBLIC_SUPABASE_URL=https://koesipeybsasrknvgntg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvZXNpcGV5YnNhc3JrbnZnbnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Mzg2MzEsImV4cCI6MjA1ODUxNDYzMX0.zLUMG6PRVJK1pEaAdO4pssFKGp8XMx9VAvwii4Xw1iU
GETNET_LOGIN=7ffbb7bf1f7361b1200b2e8d74e1d76f
GETNET_SECRET=SnZP3D63n3I9dH9O
GETNET_BASE_URL=https://checkout.test.getnet.cl
NEXT_PUBLIC_APP_URL=https://casino-pedidos-app.windsurf.build
"@ | Set-Content .env.local -NoNewline

Write-Host "Archivo .env.local recreado con formato correcto."
Write-Host "Para que los cambios surtan efecto, reinicia el servidor Next.js."
