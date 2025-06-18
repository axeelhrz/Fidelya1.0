import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = "Cargando..." }) => {
  const spinnerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2
      }
    },
    end: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const circleVariants = {
    start: {
      opacity: 1,
      scale: 1,
      y: 0
    },
    end: {
      opacity: 0.3,
      scale: 0.8,
      y: -20
    }
  };

  const transition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
      }}
    >
      <motion.div
        variants={spinnerVariants}
        initial="start"
        animate="end"
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            variants={circleVariants}
            transition={{
              ...transition,
              delay: index * 0.2
            }}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {message}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingSpinner;
