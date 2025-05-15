#!/bin/bash

# Create optimized directories if they don't exist
mkdir -p public/assets/optimized
mkdir -p public/assets/optimized/mobile

# Optimize SVG using svgo
if command -v svgo &> /dev/null; then
  echo "Optimizing SVG files..."
  svgo -f public/assets/LandingLogo.svg -o public/assets/optimized/LandingLogo.svg --multipass
else
  echo "svgo not found. Copying original SVG files..."
  cp public/assets/LandingLogo.svg public/assets/optimized/LandingLogo.svg
fi

# Create WebP versions if cwebp is available
if command -v cwebp &> /dev/null; then
  echo "Creating WebP versions..."
  
  # Convert PNG files to WebP
  for file in public/assets/*.png; do
    if [ -f "$file" ]; then
      filename=$(basename -- "$file")
      name="${filename%.*}"
      
      # Desktop version
      cwebp -q 80 "$file" -o "public/assets/optimized/${name}.webp"
      
      # Mobile version (smaller and more compressed)
      cwebp -q 65 -resize 0 640 "$file" -o "public/assets/optimized/mobile/${name}.webp"
    fi
  done
  
  # Convert JPG files to WebP
  for file in public/assets/*.jpg public/assets/*.jpeg; do
    if [ -f "$file" ]; then
      filename=$(basename -- "$file")
      name="${filename%.*}"
      
      # Desktop version
      cwebp -q 80 "$file" -o "public/assets/optimized/${name}.webp"
      
      # Mobile version (smaller and more compressed)
      cwebp -q 65 -resize 0 640 "$file" -o "public/assets/optimized/mobile/${name}.webp"
    fi
  done
else
  echo "cwebp not found. Skipping WebP conversion."
fi

echo "Image optimization completed!"