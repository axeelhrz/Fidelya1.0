'use client';

import React, { useState } from 'react';
import { Box, Button, Stack, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

interface SocialButtonsProps {
  onGoogleSignIn?: () => Promise<void>;
  onAppleSignIn?: () => Promise<void>;
  disabled?: boolean;
}

const SocialButtons: React.FC<SocialButtonsProps> = ({
  onGoogleSignIn,
  onAppleSignIn,
  disabled = false,
}) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!onGoogleSignIn) return;
    
    try {
      setGoogleLoading(true);
      await onGoogleSignIn();
    } catch (error) {
      console.error('Google sign in error:', error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (!onAppleSignIn) return;
    
    try {
      setAppleLoading(true);
      await onAppleSignIn();
    } catch (error) {
      console.error('Apple sign in error:', error);
    } finally {
      setAppleLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Stack spacing={2}>
        {/* Google Button */}
        <motion.div variants={buttonVariants}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={disabled || googleLoading || appleLoading}
            startIcon={
              googleLoading ? (
                <CircularProgress size={20} />
              ) : (
                <GoogleIcon sx={{ fontSize: 20 }} />
              )
            }
            sx={{
              height: 48,
              borderColor: '#E2E8F0',
              color: '#475569',
              backgroundColor: '#FFFFFF',
              fontWeight: 500,
              fontSize: '0.9375rem',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#CBD5E1',
                backgroundColor: '#F8FAFC',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              },
              '&:disabled': {
                backgroundColor: '#F8FAFC',
                borderColor: '#E2E8F0',
                color: '#94A3B8',
              },
            }}
            component={motion.button}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
          >
            {googleLoading ? 'Conectando...' : 'Continuar con Google'}
          </Button>
        </motion.div>

        {/* Apple Button */}
        <motion.div variants={buttonVariants}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleAppleSignIn}
            disabled={disabled || appleLoading || googleLoading}
            startIcon={
              appleLoading ? (
                <CircularProgress size={20} />
              ) : (
                <AppleIcon sx={{ fontSize: 20 }} />
              )
            }
            sx={{
              height: 48,
              borderColor: '#E2E8F0',
              color: '#475569',
              backgroundColor: '#FFFFFF',
              fontWeight: 500,
              fontSize: '0.9375rem',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#CBD5E1',
                backgroundColor: '#F8FAFC',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              },
              '&:disabled': {
                backgroundColor: '#F8FAFC',
                borderColor: '#E2E8F0',
                color: '#94A3B8',
              },
            }}
            component={motion.button}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.1 }}
          >
            {appleLoading ? 'Conectando...' : 'Continuar con Apple'}
          </Button>
        </motion.div>
      </Stack>
    </motion.div>
  );
};

export default SocialButtons;