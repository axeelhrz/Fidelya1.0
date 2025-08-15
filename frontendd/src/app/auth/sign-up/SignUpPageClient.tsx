'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { motion } from 'framer-motion';
import authTheme from '@/theme/authTheme';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import SignUpForm from '@/components/auth/SignUpForm';

const SignUpPageClient: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  };

  return (
    <ThemeProvider theme={authTheme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        preventDuplicate
        dense
        autoHideDuration={4000}
      >
        <AuthLayout>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants}>
              <AuthHeader
                title="Únete a Raquet Power"
                subtitle="Crea tu cuenta y comienza tu experiencia deportiva"
              />
            </motion.div>

            {/* Form */}
            <motion.div variants={itemVariants}>
              <SignUpForm />
            </motion.div>
          </motion.div>
        </AuthLayout>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default SignUpPageClient;