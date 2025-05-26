'use client';

import { Box, Paper, Typography, Stack, IconButton, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  isRecommended?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);
const MotionChip = motion(Chip);

export default function ProductCard({ 
  product, 
  isAdmin = false,
  isRecommended = false,
  onEdit, 
  onDelete 
}: ProductCardProps) {
  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      elevation={1}
      sx={{ 
        p: 3, 
        mb: 2, 
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Elementos decorativos */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.03) 0%, rgba(245, 158, 11, 0) 70%)',
          borderRadius: '0 0 0 100%',
          zIndex: 0,
        }}
      />

      <Box
            sx={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.02) 0%, rgba(59, 130, 246, 0) 70%)',
          borderRadius: '0 100% 0 0',
          zIndex: 0,
            }}
      />

      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }} 
        sx={{ position: 'relative', zIndex: 1 }}
          >
        <Box sx={{ maxWidth: isAdmin ? { xs: '100%', sm: 'calc(100% - 80px)' } : '100%' }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={1} 
            sx={{ mb: 1 }}
          >
            <Typography 
              variant="h6" 
              component="h3" 
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
              {product.name}
            </Typography>
            
            {isRecommended && (
              <MotionChip
                icon={<StarIcon sx={{ fontSize: '0.8rem !important' }} />}
                label="Recomendado"
                size="small" 
                color="success"
                sx={{ height: 24 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              />
        )}
      </Stack>

          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center" 
            sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
          >
            <MotionChip
              label={product.category}
              size="small"
              color="secondary"
              sx={{ height: 24 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            />
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.1rem',
                color: 'primary.main',
                ml: { xs: 0, sm: 'auto' },
                mt: { xs: 1, sm: 0 },
              }}
            >
              ${product.price.toFixed(2)}
            </Typography>
          </Stack>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 1,
              mb: 2,
              lineHeight: 1.6,
              fontSize: '0.9rem',
            }}
          >
            {product.description}
          </Typography>
        </Box>
        
        {isAdmin && (
          <Stack 
            direction="row" 
            sx={{ 
              mt: { xs: 2, sm: 0 },
              alignSelf: { xs: 'flex-end', sm: 'center' }
            }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                size="small" 
                color="primary" 
                onClick={() => onEdit && onEdit(product)}
                sx={{ 
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  mr: 1,
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton 
                size="small" 
                color="error" 
                onClick={() => onDelete && onDelete(product.id)}
                sx={{ backgroundColor: 'rgba(239, 68, 68, 0.08)' }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </motion.div>
          </Stack>
        )}
      </Stack>
      
      {/* Indicador visual para productos recomendados */}
      {isRecommended && (
        <MotionBox
          initial={{ width: 0 }}
          animate={{ width: '30%' }}
          transition={{ delay: 0.5, duration: 0.5 }}
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: 3,
            backgroundColor: 'success.main',
            borderRadius: '0 4px 0 0',
          }}
        />
      )}
    </MotionPaper>
  );
}