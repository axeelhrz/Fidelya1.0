#!/bin/bash

# Este script busca y reemplaza importaciones globales de Phosphor Icons
# por importaciones específicas para mejorar el rendimiento

echo "Optimizando importaciones de Phosphor Icons..."

# Buscar archivos con importaciones de Phosphor Icons
FILES=$(grep -l "@phosphor-icons/react" $(find src -type f -name "*.tsx" -o -name "*.ts"))

# Procesar cada archivo
for FILE in $FILES; do
  echo "Procesando $FILE..."
  
  # Extraer los iconos importados
  ICONS=$(grep -o "[A-Za-z]\+," $FILE | sed 's/,//' | sort | uniq)
  
  # Verificar si hay importaciones globales
  if grep -q "from '@phosphor-icons/react'" $FILE; then
    # Crear nuevas importaciones específicas
    NEW_IMPORTS=""
    for ICON in $ICONS; do
      NEW_IMPORTS="${NEW_IMPORTS}import { $ICON } from '@phosphor-icons/react/dist/ssr/$ICON';\n"
    done

    # Reemplazar importaciones globales por específicas
    sed -i '' -e "s|import {.*} from '@phosphor-icons/react';|${NEW_IMPORTS}|" $FILE
    
    echo "✅ Optimizado $FILE"
  else
    echo "⏭️ Saltando $FILE (no tiene importaciones globales)"
  fi
done
echo "✨ Optimización completada!"
