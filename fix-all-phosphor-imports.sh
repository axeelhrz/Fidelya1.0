#!/bin/bash

echo "🔍 Buscando y corrigiendo importaciones incorrectas de @phosphor-icons/react..."

FILES=$(grep -rl "@phosphor-icons/react/dist/ssr" ./src --include \*.tsx --include \*.ts)

if [ -z "$FILES" ]; then
  echo "✅ No se encontraron archivos con problemas."
  exit 0
fi

for FILE in $FILES; do
  echo "🛠️ Corrigiendo $FILE..."

  # Backup
  cp "$FILE" "${FILE}.bak"

  # Reemplazos de patrones típicos
  sed -i '' -E 's/import ([A-Za-z]+) from '"'"'@phosphor-icons\/react\/dist\/ssr\/[A-Za-z]+'"'"';/import { \1 } from '"'"'@phosphor-icons\/react'"'"';/g' "$FILE"
  sed -i '' -E 's/import \{ ([A-Za-z, ]+) \} from '"'"'@phosphor-icons\/react\/dist\/ssr'"'"';/import { \1 } from '"'"'@phosphor-icons\/react'"'"';/g' "$FILE"

  echo "✅ Corregido: $FILE"
done

echo "🎉 ¡Importaciones corregidas exitosamente!"
