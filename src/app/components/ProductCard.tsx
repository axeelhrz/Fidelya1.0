'use client';

import { Box, Paper, Typography, Stack, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export default function ProductCard({ 
  product, 
  isAdmin = false, 
  onEdit, 
  onDelete 
}: ProductCardProps) {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2, width: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h6" component="h3">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {product.description}
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1 }}>
            ${product.price.toFixed(2)}
          </Typography>
        </Box>
        
        {isAdmin && (
          <Stack direction="row">
            <IconButton 
              size="small" 
              color="primary" 
              onClick={() => onEdit && onEdit(product)}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              size="small" 
              color="error" 
              onClick={() => onDelete && onDelete(product.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}