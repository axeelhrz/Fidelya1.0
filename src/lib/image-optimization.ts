import { useState, useEffect } from 'react';

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
    (window as any).requestIdleCallback(() => {
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