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
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)',
        transition: { duration: 0.3 }
      }}
      elevation={1}
      sx={{ 
        p: 3, 
        mb: 2, 
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
      }}
    >
      {/* Elemento decorativo */}
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

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: isAdmin ? 'calc(100% - 80px)' : '100%' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>
            
            {isRecommended && (
              <Chip
                icon={<StarIcon sx={{ fontSize: '0.8rem !important' }} />}
                label="Recomendado"
                size="small"
                color="success"
                sx={{ height: 24 }}
              />
            )}
          </Stack>

          <Chip
            label={product.category}
            size="small"
            color="secondary"
            sx={{ mb: 2, height: 24 }}
          />
          
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
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'primary.main',
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
        
        {isAdmin && (
          <Stack direction="row">
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
    </MotionPaper>
  );
}