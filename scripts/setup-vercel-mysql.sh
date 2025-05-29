#!/bin/bash

echo "🚀 Configurando MySQL para Vercel..."

# Verificar que las variables estén configuradas
if [ -z "$MYSQL_HOST" ]; then
    echo "❌ Error: MYSQL_HOST no está configurado"
    exit 1
fi

if [ -z "$MYSQL_PASSWORD" ]; then
    echo "❌ Error: MYSQL_PASSWORD no está configurado"
    exit 1
fi

echo "✅ Variables de entorno configuradas"

# Configurar variables en Vercel
echo "📝 Configurando variables en Vercel..."

vercel env add DATABASE_TYPE production
vercel env add MYSQL_HOST production
vercel env add MYSQL_PORT production
vercel env add MYSQL_USER production
vercel env add MYSQL_PASSWORD production
vercel env add MYSQL_DATABASE production
vercel env add MYSQL_SSL production
vercel env add ADMIN_PASSWORD production

echo "✅ Variables configuradas en Vercel"
echo "🚀 Listo para deployment!"