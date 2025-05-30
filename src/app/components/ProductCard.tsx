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
      transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 2,
        borderRadius: 4,
        backgroundColor: '#2C2C2E',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          borderColor: 'rgba(59, 130, 246, 0.2)',
          backgroundColor: 'rgba(44, 44, 46, 0.8)',
        }
      }}
    >
      {/* Layout principal con Box y Stack */}
      <Box>
        {/* Fila superior: Nombre + Precio */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
        alignItems="flex-start"
            sx={{ mb: 2 }}
          >
          {/* Nombre del producto a la izquierda */}
          <Box sx={{ flex: 1, mr: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography 
                variant="subtitle1" 
                component="h3" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: '#F5F5F7',
                  lineHeight: 1.3,
              }}
              >
                {product.name}
              </Typography>
              
              {/* Chips para destacados */}
      {product.isRecommended && (
                <Chip
                  label="Recomendado"
                  size="small" 
                  color="success"
                  sx={{ 
                    height: 24,
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    fontWeight: 500,
                  }}
                />
              )}

              {product.isVegan && (
                <Chip
                  label="Nuevo"
                  size="small"
                  color="secondary"
                  sx={{ 
                    height: 24,
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#F59E0B',
                    fontWeight: 500,
          }}
        />
      )}
            </Stack>
          </Box>

          {/* Precio a la derecha */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
              color: '#F59E0B', // Color mostaza suave
              textAlign: 'right',
              minWidth: 'fit-content',
            }}
          >
            {formatPrice(product.price)}
          </Typography>
        </Stack>
        
        {/* Descripción abajo en gris claro */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#A1A1AA', // Gris claro para descripciones
            lineHeight: 1.6,
            fontSize: '0.875rem',
          }}
        >
          {product.description}
        </Typography>
      </Box>

      {/* Efecto visual sutil para productos destacados */}
      {product.isRecommended && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '60px',
            height: '60px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0) 70%)',
            borderRadius: '0 16px 0 100%',
          }}
        />
      )}
    </MotionPaper>
  );
}