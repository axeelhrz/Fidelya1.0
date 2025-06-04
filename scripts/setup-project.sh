#!/bin/bash

echo "🚀 Setting up Casino Escolar project..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.local.example .env.local
    echo "⚠️  Please update .env.local with your actual values"
fi

# Generate database types
echo "🔧 Generating database types..."
npm run db:generate-types

echo "✅ Project setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Supabase and GetNet credentials"
echo "2. Run the database migrations in Supabase"
echo "3. Start the development server with: npm run dev"