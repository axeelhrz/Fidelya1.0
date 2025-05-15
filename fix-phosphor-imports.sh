#!/bin/bash

# This script fixes the import statements for @phosphor-icons/react
# It changes from default imports to named imports

# Function to process a file
fix_imports() {
  local file=$1
  echo "Processing $file..."
  
  # Create a backup of the original file
  cp "$file" "${file}.bak"
  
  # Replace import statements
  # This changes from:
  # import IconName from '@phosphor-icons/react/dist/ssr/IconName'
  # to:
  # import { IconName } from '@phosphor-icons/react'
  
  sed -i '' -E 's/import ([A-Za-z]+) from '"'"'@phosphor-icons\/react\/dist\/ssr\/\1'"'"';/import { \1 } from '"'"'@phosphor-icons\/react'"'"';/g' "$file"
  
  # Check if the file was modified
  if cmp -s "$file" "${file}.bak"; then
    echo "No changes made to $file"
    rm "${file}.bak"
  else
    echo "Fixed imports in $file"
  fi
}

# Find all files with phosphor imports
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "@phosphor-icons/react/dist/ssr" | while read file; do
  fix_imports "$file"
done

echo "Import fixing complete!"
