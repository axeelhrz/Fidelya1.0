'use client';

import { Box, Paper, Typography, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const MotionPaper = motion(Paper);

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      elevation={0}
      sx={{ 
        p: 3, 
        borderRadius: 4,
        backgroundColor: '#2C2C2E',
        boxShadow: '0px 6px 18px rgba(0,0,0,0.12)',
        border: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: '0px 8px 24px rgba(0,0,0,0.25)',
          borderColor: 'rgba(59, 130, 246, 0.2)',
          backgroundColor: 'rgba(44, 44, 46, 0.9)',
        }
      }}
    >
      {/* Layout principal usando Box con display flex */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Columna izquierda: Información del producto */}
        <Box sx={{ flex: 1, pr: 2 }}>
          <Stack spacing={1.5}>
            {/* Nombre del producto */}
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500,
                color: '#F5F5F7',
                fontSize: '1.1rem',
                lineHeight: 1.4,
                letterSpacing: '-0.01em'
              }}
            >
                {product.name}
              </Typography>
              
            {/* Descripción del producto */}
            {product.description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#A1A1AA',
                  lineHeight: 1.5,
                  fontSize: '0.875rem',
                  letterSpacing: '0.01em'
            }}
          >
          {product.description}
        </Typography>
      )}

            {/* Chips para características especiales */}
            {(product.isRecommended || product.isVegan || product.isGlutenFree) && (
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                {product.isRecommended && (
                  <Chip 
                    label="Recomendado" 
                    size="small" 
                    color="success"
                    sx={{ 
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      height: 24
                    }}
                  />
                )}
                {product.isVegan && (
                  <Chip 
                    label="Vegano" 
                    size="small" 
                    color="primary"
                    sx={{ 
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      height: 24
                    }}
                  />
                )}
                {product.isGlutenFree && (
                  <Chip 
                    label="Sin TACC" 
                    size="small" 
                    color="secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      height: 24
                    }}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Box>

        {/* Columna derecha: Precio */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          minWidth: 'fit-content'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#F59E0B', // color mostaza para el precio
              fontWeight: 600,
              fontSize: '1.25rem',
              letterSpacing: '-0.01em',
              textAlign: 'right'
            }}
          >
            {formatPrice(product.price)}
          </Typography>
          
          {/* Precio anterior si está en oferta */}
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#A1A1AA',
                textDecoration: 'line-through',
                fontSize: '0.875rem',
                mt: 0.5
              }}
            >
              {formatPrice(product.originalPrice)}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Efecto de hover sutil en el fondo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(245, 158, 11, 0.02) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          '.MuiPaper-root:hover &': {
            opacity: 1,
}
        }}
      />
    </MotionPaper>
  );
}