'use client';

import React from 'react';
import { 
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import { 
  ExpandMore, 
  AccessTime, 
  LocalOffer,
  Restaurant,
  Warning
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Product } from '../types';

const MotionCard = motion(Card);

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'APPETIZER': '#FF6B6B',
      'MAIN_COURSE': '#4ECDC4',
      'DESSERT': '#FFE66D',
      'BEVERAGE': '#A8E6CF',
      'COCKTAIL': '#FF8B94',
      'WINE': '#B4A7D6',
      'BEER': '#FFD93D',
      'COFFEE': '#8B4513',
      'NON_ALCOHOLIC': '#87CEEB',
      'SIDE_DISH': '#DDA0DD',
      'SNACK': '#F0E68C'
    };
    return colors[category] || '#D4AF37';
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'APPETIZER': 'Entrada',
      'MAIN_COURSE': 'Principal',
      'DESSERT': 'Postre',
      'BEVERAGE': 'Bebida',
      'COCKTAIL': 'Cóctel',
      'WINE': 'Vino',
      'BEER': 'Cerveza',
      'COFFEE': 'Café',
      'NON_ALCOHOLIC': 'Sin Alcohol',
      'SIDE_DISH': 'Acompañamiento',
      'SNACK': 'Snack'
    };
    return labels[category] || category;
  };

  return (
    <MotionCard
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)'
      }}
      transition={{ duration: 0.2 }}
      sx={{
        background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(16, 16, 16, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        opacity: product.isAvailable ? 1 : 0.6,
        cursor: 'pointer'
      }}
      onClick={handleExpandClick}
    >
      {/* Imagen del producto */}
      {product.image && (
        <Box
          sx={{
            height: 200,
            backgroundImage: `url(${product.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          {/* Overlay con información rápida */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1
            }}
          >
            {product.nutritionalInfo?.isVegan && (
              <Chip
                label="🌱 Vegano"
                size="small"
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            )}
            {product.tags?.includes('recomendado') && (
              <Chip
                icon={<LocalOffer />}
                label="Recomendado"
                size="small"
                sx={{
                  backgroundColor: 'rgba(212, 175, 55, 0.9)',
                  color: '#0A0A0A',
                  fontWeight: 600
                }}
              />
            )}
          </Box>

          {!product.isAvailable && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                backgroundColor: 'rgba(244, 67, 54, 0.9)',
                color: 'white',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Warning fontSize="small" />
              <Typography variant="caption" fontWeight={600}>
                No disponible
              </Typography>
            </Box>
          )}
        </Box>
      )}

      <CardContent sx={{ p: 3 }}>
        {/* Header del producto */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography
              variant="h6"
              sx={{
                color: '#F8F8F8',
                fontWeight: 600,
                fontSize: '1.125rem',
                lineHeight: 1.3,
                mb: 0.5
              }}
            >
              {product.name}
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Chip
                label={getCategoryLabel(product.category)}
                size="small"
                sx={{
                  backgroundColor: getCategoryColor(product.category),
                  color: '#0A0A0A',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
              
              {product.preparationTime && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <AccessTime sx={{ fontSize: 14, color: '#B8B8B8' }} />
                  <Typography variant="caption" color="#B8B8B8">
                    {product.preparationTime} min
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: '#D4AF37',
              fontWeight: 700,
              fontSize: '1.25rem',
              ml: 2
            }}
          >
            {formatPrice(product.price)}
          </Typography>
        </Box>

        {/* Descripción */}
        {product.description && (
          <Typography
            variant="body2"
            sx={{
              color: '#B8B8B8',
              lineHeight: 1.5,
              mb: 2
            }}
          >
            {product.description}
          </Typography>
        )}

        {/* Tags principales */}
        {product.tags && product.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
            {product.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={`tag-${index}`}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                  fontSize: '0.7rem'
                }}
              />
            ))}
            {product.tags.length > 3 && (
              <Chip
                label={`+${product.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: 'rgba(212, 175, 55, 0.3)',
                  color: '#D4AF37',
                  fontSize: '0.7rem'
                }}
              />
            )}
          </Box>
        )}

        {/* Información nutricional rápida */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" gap={1}>
            {product.nutritionalInfo?.isVegetarian && !product.nutritionalInfo?.isVegan && (
              <Chip
                label="🥬 Vegetariano"
                size="small"
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  color: '#4CAF50',
                  fontSize: '0.7rem'
                }}
              />
            )}
            {product.nutritionalInfo?.isGlutenFree && (
              <Chip
                label="🌾 Sin Gluten"
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 152, 0, 0.2)',
                  color: '#FF9800',
                  fontSize: '0.7rem'
                }}
              />
            )}
          </Box>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleExpandClick();
            }}
            sx={{
              color: '#D4AF37',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s'
            }}
          >
            <ExpandMore />
          </IconButton>
        </Box>

        {/* Información expandida */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
            {/* Información nutricional detallada */}
            {product.nutritionalInfo?.calories && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Restaurant sx={{ fontSize: 16, color: '#B8B8B8' }} />
                <Typography variant="body2" color="#B8B8B8">
                  {product.nutritionalInfo.calories} calorías
                </Typography>
              </Box>
            )}

            {/* Alérgenos */}
            {product.allergens && product.allergens.length > 0 && (
              <Box mb={2}>
                <Typography variant="caption" color="#B8B8B8" gutterBottom display="block">
                  ⚠️ Alérgenos:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {product.allergens.map((allergen, index) => (
                    <Chip
                      key={`allergen-${index}`}
                      label={allergen}
                      size="small"
                      color="warning"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Todos los tags */}
            {product.tags && product.tags.length > 3 && (
              <Box>
                <Typography variant="caption" color="#B8B8B8" gutterBottom display="block">
                  ✨ Características:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {product.tags.map((tag, index) => (
                    <Chip
                      key={`expanded-tag-${index}`}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(212, 175, 55, 0.3)',
                        color: '#D4AF37',
                        fontSize: '0.7rem'
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </MotionCard>
  );
}
