import { useState, useEffect } from 'react';
import { ImageProps } from 'next/image';

// Hook para cargar imágenes de forma diferida
export const useLazyImage = (src: string, placeholder: string = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Crear un nuevo objeto Image
    const img = new Image();
    
    // Configurar los manejadores de eventos
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    
    // Iniciar la carga de la imagen
    img.src = src;
    
    // Limpieza
    return () => {
      img.onload = null;
    };
  }, [src]);

  return { imageSrc, imageLoaded };
};

// Función para determinar el tamaño óptimo de imagen según el dispositivo
export const getOptimalImageSize = (
  imageSizes: { width: number; path: string }[],
  containerWidth: number
) => {
  // Ordenar tamaños de menor a mayor
  const sortedSizes = [...imageSizes].sort((a, b) => a.width - b.width);
  
  // Encontrar el primer tamaño que sea mayor que el contenedor
  // o usar el tamaño más grande disponible
  const optimalSize = sortedSizes.find(size => size.width >= containerWidth) || 
                      sortedSizes[sortedSizes.length - 1];
  
  return optimalSize.path;
};

// Función para generar atributo srcSet para imágenes responsivas
export const generateSrcSet = (
  basePath: string,
  fileName: string,
  extension: string,
  sizes: number[]
) => {
  return sizes
    .map(size => `${basePath}/${fileName}-${size}.${extension} ${size}w`)
    .join(', ');
};

// Función para precargar imágenes críticas
export const preloadCriticalImages = (imagePaths: string[]) => {
  if (typeof window === 'undefined') return;
  
  const preloadImage = (src: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  };
  
  // Usar requestIdleCallback para no bloquear el renderizado
  if ('requestIdleCallback' in window) {
    (window as Window & typeof globalThis & { requestIdleCallback: (callback: () => void) => number }).requestIdleCallback(() => {
      imagePaths.forEach(preloadImage);
    });
  } else {
    // Fallback
    setTimeout(() => {
      imagePaths.forEach(preloadImage);
    }, 1000);
  }
};

// Función para cargar imágenes de forma progresiva
export const loadProgressiveImage = (
  lowQualitySrc: string,
  highQualitySrc: string,
  callback: (src: string, isHighQuality: boolean) => void
) => {
  // Cargar primero la imagen de baja calidad
  const lowQualityImg = new Image();
  lowQualityImg.onload = () => {
    callback(lowQualitySrc, false);
    
    // Luego cargar la imagen de alta calidad
    const highQualityImg = new Image();
    highQualityImg.onload = () => {
      callback(highQualitySrc, true);
    };
    highQualityImg.src = highQualitySrc;
  };
  lowQualityImg.src = lowQualitySrc;
};

/**
 * Checks if the current device supports WebP
 * @returns Boolean indicating if WebP is supported
 */
export const isWebPSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for WebP support
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  
  return false;
};

/**
 * Gets the appropriate image path based on device and format support
 * @param path Base image path
 * @param isMobile Whether the device is mobile
 * @returns Optimized image path
 */
export const getOptimizedImagePath = (path: string, isMobile = false): string => {
  if (!path) return '';
  
  // Extract file name and extension
  const lastSlashIndex = path.lastIndexOf('/');
  const fileName = path.substring(lastSlashIndex + 1);
  
  // Check if it's already an optimized path
  if (path.includes('/optimized/')) {
    return path;
  }
  
  // For SVG files, return the original path (SVGs are already optimized)
  if (path.endsWith('.svg')) {
    return path;
  }
  
  // Determine the appropriate path based on device
  const devicePath = isMobile ? 'mobile/' : '';
  
  // Create the optimized path
  return `/assets/optimized/${devicePath}${fileName}`;
};

/**
 * Generates optimized image props for Next.js Image component
 * @param src Image source path
 * @param options Additional options
 * @returns Optimized image props
 */
export const getOptimizedImageProps = (
  src: string,
  options: {
    width?: number;
    height?: number;
    priority?: boolean;
    quality?: number;
    isMobile?: boolean;
  } = {}
): Partial<ImageProps> => {
  const {
    width,
    height,
    priority = false,
    quality = 80,
    isMobile = false,
  } = options;
  
  // Determine if this is a critical image (above the fold)
  const isCritical = priority;
  
  return {
    src: getOptimizedImagePath(src, isMobile),
    width: width,
    height: height,
    priority: isCritical,
    quality: isMobile ? Math.min(quality, 70) : quality, // Lower quality for mobile
    loading: isCritical ? 'eager' : 'lazy',
    sizes: getResponsiveSizes(),
  };
};

/**
 * Detects if the current device is mobile
 * @returns Boolean indicating if the device is mobile
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
};

/**
 * Generates responsive size hints for images
 * @returns String with responsive size breakpoints
 */
export const getResponsiveSizes = (): string => {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};