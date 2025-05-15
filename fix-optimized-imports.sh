#!/bin/bash

# Fix the optimized-imports.ts file
sed -i '' -E 's/@phosphor-icons\/react\/dist\/ssr/@phosphor-icons\/react/g' src/lib/optimized-imports.ts

echo "Fixed optimized-imports.ts"
