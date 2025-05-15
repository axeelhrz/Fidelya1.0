#!/bin/bash

# Fix the CircleWavyCheck import in caracteristicas/page.tsx
# This script merges the CircleWavyCheck import with the main phosphor-icons import

# Create a backup of the original file
cp src/app/caracteristicas/page.tsx src/app/caracteristicas/page.tsx.bak

# Remove the separate CircleWavyCheck import
sed -i '' '/import { CircleWavyCheck } from '"'"'@phosphor-icons\/react'"'"';/d' src/app/caracteristicas/page.tsx

# Add CircleWavyCheck to the main import
sed -i '' 's/import {/import {\'$'\n  CircleWavyCheck,/g' src/app/caracteristicas/page.tsx

echo "Fixed CircleWavyCheck import in caracteristicas/page.tsx"
