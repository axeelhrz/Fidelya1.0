#!/bin/bash

# Fix the CircleWavyCheck import in caracteristicas/page.tsx
# This script ensures that CircleWavyCheck is imported correctly

# Update the import statement
sed -i '' -E 's/import \{ CircleWavyCheck \} from '"'"'@phosphor-icons\/react'"'"';/import { CircleWavyCheck } from '"'"'@phosphor-icons\/react'"'"';/' src/app/caracteristicas/page.tsx

echo "Fixed CircleWavyCheck import in caracteristicas/page.tsx"
