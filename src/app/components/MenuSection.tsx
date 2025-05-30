'use client';

import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Restaurant, TrendingUp } from '@mui/icons-material';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface MenuSectionProps {
  title: string;
  products: Product[];
  index?: number;
}

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const MenuSection: React.FC<MenuSectionProps> = ({ title, products, index = 0 }) => {
  if (!products || products.length === 0) return null;

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: 'easeOut',
        delay: index * 0.15
      } 
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3 + (index * 0.15),
      },
    },
  };

  const recommendedCount = products.filter(p => p.isRecommended).length;
  const newCount = products.filter(p => p.isNew).length;

  return (
    <MotionBox
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      sx={{ mb: { xs: 8, sm: 10 } }}
    >
      {/* Section header */}
      <Box sx={{ mb: { xs: 5, sm: 6 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Restaurant 
              sx={{ 
                color: '#3B82F6', 
                fontSize: { xs: 24, sm: 28 },
                filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))'
              }} 
            />
            <MotionTypography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                color: '#F5F5F7',
                letterSpacing: '-0.03em',
                lineHeight: 1.1
              }}
            >
              {title}
            </MotionTypography>
          </Box>

          {/* Section stats */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
            {recommendedCount > 0 && (
              <Box sx={{ 
                px: 2, 
                py: 0.5, 
                borderRadius: 2,
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <Typography sx={{ 
                  color: '#10B981', 
                  fontSize: '0.75rem', 
                  fontWeight: 600 
                }}>
                  {recommendedCount} ★
                </Typography>
              </Box>
            )}
            
            {newCount > 0 && (
              <Box sx={{ 
                px: 2, 
                py: 0.5, 
                borderRadius: 2,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}>
                <TrendingUp sx={{ fontSize: 12, color: '#3B82F6' }} />
                <Typography sx={{ 
                  color: '#3B82F6', 
                  fontSize: '0.75rem', 
                  fontWeight: 600 
                }}>
                  {newCount}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Elegant divider */}
        <Divider 
          sx={{ 
            borderColor: 'rgba(255, 255, 255, 0.08)',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              top: '50%',
              width: '60px',
              height: '2px',
              background: 'linear-gradient(90deg, #3B82F6 0%, transparent 100%)',
              transform: 'translateY(-50%)'
            }
          }} 
        />
      </Box>

      {/* Products grid */}
      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Stack spacing={{ xs: 4, sm: 5 }}>
          {products.map((product, productIndex) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={productIndex}
            />
          ))}
        </Stack>
    </MotionBox>
    </MotionBox>
  );
};

export default MenuSection;
