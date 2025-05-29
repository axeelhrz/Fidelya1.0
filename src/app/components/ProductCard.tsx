'use client';

import { Box, Paper, Typography, Stack, IconButton, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import EcoIcon from '@mui/icons-material/LocalFlorist';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

export default function ProductCard({ 
  product, 
  isAdmin = false,
  onEdit, 
  onDelete 
}: ProductCardProps) {
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 2.5,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        backgroundColor: '#2C2C2E',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255,255,255,0.05)',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          borderColor: 'rgba(59, 130, 246, 0.2)',
        }
      }}
    >
      {/* Elementos decorativos sutiles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.04) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '0 12px 0 100%',
          zIndex: 0,
        }}
      />

      <Stack 
        direction="row" 
        justifyContent="space-between" 
        alignItems="flex-start"
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ flex: 1, mr: isAdmin ? 2 : 0 }}>
          {/* Nombre del producto y badges */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5} 
            sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
          >
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                color: '#F5F5F7',
                lineHeight: 1.3,
              }}
            >
              {product.name}
            </Typography>
            
            {product.isRecommended && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Chip
                  icon={<StarIcon sx={{ fontSize: '0.8rem !important' }} />}
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
              </motion.div>
            )}

            {product.isVegan && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <Chip
                  icon={<EcoIcon sx={{ fontSize: '0.8rem !important' }} />}
                  label="Vegano"
                  size="small"
                  sx={{ 
                    height: 24,
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e',
                    fontWeight: 500,
                  }}
                />
              </motion.div>
            )}
          </Stack>

          {/* Categoría y precio */}
          <Stack 
            direction="row" 
            justifyContent="space-between"
            alignItems="center" 
            sx={{ mb: 2 }}
          >
            <Chip
              label={product.category}
              size="small"
              sx={{ 
                height: 24,
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#F59E0B',
                fontWeight: 500,
              }}
            />
            
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.25rem',
                color: '#F59E0B',
                textAlign: 'right',
              }}
            >
              {formatPrice(product.price)}
            </Typography>
          </Stack>
          
          {/* Descripción */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#A1A1AA',
              lineHeight: 1.6,
              fontSize: '0.9rem',
            }}
          >
            {product.description}
          </Typography>
        </Box>
        
        {/* Botones de administración */}
        {isAdmin && (
          <Stack 
            direction="column" 
            spacing={1}
            sx={{ ml: 2 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                size="small" 
                onClick={() => onEdit && onEdit(product)}
                sx={{ 
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: '#3B82F6',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.25)',
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                size="small" 
                onClick={() => onDelete && onDelete(product.id)}
                sx={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.25)',
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </motion.div>
          </Stack>
        )}
      </Stack>
      
      {/* Indicador visual para productos recomendados */}
      {product.isRecommended && (
        <MotionBox
          initial={{ width: 0 }}
          animate={{ width: '40%' }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 3,
            background: 'linear-gradient(90deg, #10B981 0%, rgba(16, 185, 129, 0.3) 100%)',
            borderRadius: '0 4px 0 12px',
          }}
        />
      )}
    </MotionPaper>
  );
}