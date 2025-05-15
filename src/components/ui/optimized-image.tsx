'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { Box, Skeleton } from '@mui/material';
import { isMobileDevice, getOptimizedImagePath } from '@/lib/image-optimization';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  mobileSrc?: string;
  lowQualitySrc?: string;
  aspectRatio?: number | string;
  containerClassName?: string;
  loadingHeight?: number | string;
  fadeIn?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  mobileSrc,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
  quality = 80 as number,
  className,
  style,
  aspectRatio,
  containerClassName,
  loadingHeight = '100%',
  fadeIn = true,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(src);
  
  // Detect mobile device on client side
  useEffect(() => {
    setIsMobile(isMobileDevice());
    
    // Set appropriate image source based on device
    if (mobileSrc && isMobileDevice()) {
      setImageSrc(mobileSrc);
    } else {
      // Try to use optimized version if available
      setImageSrc(getOptimizedImagePath(src, isMobileDevice()));
    }
  }, [src, mobileSrc]);
  
  // Calculate aspect ratio styles
  const aspectRatioStyles = aspectRatio 
    ? {
        position: 'relative',
        paddingBottom: typeof aspectRatio === 'number' 
          ? `${(1 / aspectRatio) * 100}%` 
          : aspectRatio,
      }
    : {};
  return (
    <Box 
      className={containerClassName}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        ...aspectRatioStyles,
        ...((!aspectRatio && !fill) ? { height: 'auto' } : {}),
      }}
    >
      {!loaded && !priority && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={loadingHeight}
          sx={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
        />
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill || !!aspectRatio}
        sizes={sizes}
        quality={isMobile ? Math.min(Number(quality), 70) : Number(quality)}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        className={className}
        style={{
          opacity: fadeIn ? (loaded ? 1 : 0) : 1,
          transition: fadeIn ? 'opacity 0.3s ease-in-out' : undefined,
          objectFit: 'contain',
          ...style,
        }}
        {...props}
      />
    </Box>
  );
};

export default OptimizedImage;
