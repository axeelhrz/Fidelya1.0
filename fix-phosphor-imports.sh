#!/bin/bash

# This script fixes the import statements for @phosphor-icons/react
# It changes imports from dist/ssr to the main package

# Function to process a file
fix_imports() {
  local file=$1
  echo "Processing $file..."
  
  # Create a backup of the original file
  cp "$file" "${file}.bak"
  
  # Replace import statements for named imports from dist/ssr (pattern 1)
  sed -i '' -E 's/import \{ ([A-Za-z, ]+) \} from '"'"'@phosphor-icons\/react\/dist\/ssr'"'"';/import { \1 } from '"'"'@phosphor-icons\/react'"'"';/g' "$file"
  
  # Replace import statements for named imports from dist/ssr/Component (pattern 2)
  sed -i '' -E 's/import \{ ([A-Za-z]+)( as [A-Za-z]+)? \} from '"'"'@phosphor-icons\/react\/dist\/ssr\/([A-Za-z]+)'"'"';/import { \3 as \1 } from '"'"'@phosphor-icons\/react'"'"';/g' "$file"
  
  # Check if the file was modified
  if cmp -s "$file" "${file}.bak"; then
    echo "No changes made to $file"
    rm "${file}.bak"
  else
    echo "Fixed imports in $file"
  fi
}

# Find all files with phosphor imports from dist/ssr
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "@phosphor-icons/react/dist/ssr" | while read file; do
  fix_imports "$file"
done

echo "Import fixing complete!"
