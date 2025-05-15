#!/bin/bash

# Este script busca y reemplaza importaciones específicas del icono CircleWavyCheck
# por importaciones optimizadas para mejorar el rendimiento

echo "🔍 Buscando importaciones de CircleWavyCheck..."

# Buscar archivos con importaciones de CircleWavyCheck
FILES=$(grep -l "CircleWavyCheck" $(find src -type f -name "*.tsx" -o -name "*.ts"))

# Procesar cada archivo
for FILE in $FILES; do
  echo "  Procesando $FILE..."
  
  # Verificar si hay importaciones globales
  if grep -q "CircleWavyCheck.*from '@phosphor-icons/react'" $FILE; then
    # Reemplazar importaciones globales por específicas
    sed -i '' -e "s|import { CircleWavyCheck.*} from '@phosphor-icons/react'|import { CircleWavyCheck } from '@phosphor-icons/react/dist/ssr/CircleWavyCheck'|g" $FILE
    
    echo "  ✅ Optimizado $FILE"
  else
    echo "  ⏭️ Saltando $FILE (no tiene importaciones globales de CircleWavyCheck)"
  fi
done

echo "✨ Optimización de CircleWavyCheck completada!"
