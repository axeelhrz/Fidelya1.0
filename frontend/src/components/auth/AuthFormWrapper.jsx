import React from 'react';
import { Box, Paper, Container, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  StorefrontRounded,
  TrendingUpRounded,
  SecurityRounded,
  CloudRounded 
} from '@mui/icons-material';

const AuthFormWrapper = ({ children, title, subtitle }) => {
  const theme = useTheme();

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: `
          linear-gradient(135deg, 
            #0f172a 0%, 
            #1e293b 25%,
            #334155 50%,
            #475569 75%,
            #64748b 100%
          )
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, ${alpha('#6366f1', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, ${alpha('#10b981', 0.1)} 0%, transparent 50%)
          `,
          zIndex: 0,
        }
      }}
    >
      {/* Elementos decorativos geométricos reducidos */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '80px',
          height: '80px',
          background: `linear-gradient(135deg, ${alpha('#6366f1', 0.08)}, ${alpha('#8b5cf6', 0.08)})`,
          borderRadius: '20px',
          transform: 'rotate(45deg)',
          filter: 'blur(1px)',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'rotate(45deg) translateY(0px)' },
            '50%': { transform: 'rotate(45deg) translateY(-15px)' }
          }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '60px',
          height: '60px',
          background: `linear-gradient(135deg, ${alpha('#10b981', 0.08)}, ${alpha('#06b6d4', 0.08)})`,
          borderRadius: '15px',
          transform: 'rotate(-30deg)',
          filter: 'blur(1px)',
          animation: 'float 6s ease-in-out infinite reverse',
        }}
      />

      <Container 
        maxWidth={false}
        sx={{ 
          zIndex: 1, 
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              boxShadow: `
                0 20px 40px ${alpha('#000000', 0.12)},
                0 0 0 1px ${alpha('#ffffff', 0.05)},
                inset 0 1px 0 ${alpha('#ffffff', 0.1)}
              `,
              position: 'relative',
              width: '100%',
            }}
          >
            {/* Header más compacto */}
            <Box
              sx={{
                textAlign: 'center',
                pt: 4,
                pb: 3,
                px: 4,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
                }
              }}
            >
              <motion.div variants={logoVariants}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 56,
                    height: 56,
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    mb: 2,
                    boxShadow: `
                      0 8px 20px ${alpha(theme.palette.primary.main, 0.25)},
                      0 0 0 1px ${alpha('#ffffff', 0.1)}
                    `,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: '2px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${alpha('#ffffff', 0.2)}, transparent)`,
                      zIndex: 1,
                    }
                  }}
                >
                  <StorefrontRounded 
                    sx={{ 
                      fontSize: 28, 
                      color: 'white',
                      position: 'relative',
                      zIndex: 2,
                    }} 
                  />
                </Box>
              </motion.div>
              
              <motion.div variants={contentVariants}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    mb: 1, 
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.025em',
                    fontSize: { xs: '1.5rem', sm: '1.75rem' }
                  }}
                >
                  Frutería Nina
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha(theme.palette.text.secondary, 0.8),
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    letterSpacing: '0.01em',
                  }}
                >
                  Sistema de Gestión
                </Typography>
              </motion.div>
            </Box>

            {/* Contenido del formulario más compacto */}
            <Box sx={{ px: 4, pb: 4 }}>
              <motion.div variants={contentVariants}>
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 700, 
                      color: theme.palette.text.primary,
                      letterSpacing: '-0.02em',
                      fontSize: { xs: '1.25rem', sm: '1.5rem' }
                    }}
                  >
                    {title}
                  </Typography>
                  {subtitle && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: alpha(theme.palette.text.secondary, 0.8),
                        fontWeight: 400,
                        lineHeight: 1.5,
                        fontSize: '0.875rem',
                      }}
                    >
                      {subtitle}
                    </Typography>
                  )}
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {children}
              </motion.div>

              {/* Features minimalistas más pequeñas */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Box
                  sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 3,
                      flexWrap: 'wrap',
                    }}
                  >
                    {[
                      { icon: TrendingUpRounded, label: 'Analytics' },
                      { icon: SecurityRounded, label: 'Seguro' },
                      { icon: CloudRounded, label: 'Cloud' },
                    ].map((feature, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: alpha(theme.palette.text.secondary, 0.6),
                        }}
                      >
                        <feature.icon sx={{ fontSize: 16 }} />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        >
                          {feature.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AuthFormWrapper;