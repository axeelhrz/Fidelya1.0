import React from 'react';
import { Box, Paper, Container, Typography, useTheme, useMediaQuery, Grid, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  TrendingUpRounded, 
  InventoryRounded, 
  PeopleRounded, 
  AssessmentRounded,
  SecurityRounded,
  SpeedRounded,
  CloudRounded,
  SupportAgentRounded
} from '@mui/icons-material';
import ParticleBackground from './ParticleBackground';

const AuthFormWrapper = ({ children, title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        type: "spring",
        stiffness: 200
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.8,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: <TrendingUpRounded />,
      title: "Análisis en Tiempo Real",
      description: "Monitorea tus ventas y ganancias al instante"
    },
    {
      icon: <InventoryRounded />,
      title: "Gestión de Inventario",
      description: "Control total de tu stock y productos"
    },
    {
      icon: <PeopleRounded />,
      title: "Gestión de Clientes",
      description: "Administra tu base de clientes eficientemente"
    },
    {
      icon: <AssessmentRounded />,
      title: "Reportes Detallados",
      description: "Informes completos para tomar mejores decisiones"
    },
    {
      icon: <SecurityRounded />,
      title: "Seguridad Avanzada",
      description: "Tus datos protegidos con la mejor tecnología"
    },
    {
      icon: <SpeedRounded />,
      title: "Rendimiento Óptimo",
      description: "Sistema rápido y confiable para tu negocio"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Tiempo de actividad" },
    { number: "500+", label: "Fruterías activas" },
    { number: "24/7", label: "Soporte técnico" },
    { number: "100%", label: "Satisfacción garantizada" }
  ];

  if (isMobile) {
    // Layout móvil - solo el formulario centrado
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `
            linear-gradient(135deg, 
              rgba(15, 23, 42, 0.95) 0%, 
              rgba(30, 41, 59, 0.95) 50%, 
              rgba(51, 65, 85, 0.95) 100%
            ),
            radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ParticleBackground />
        
        <Container maxWidth="sm" sx={{ zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: `
                  0 20px 40px rgba(0, 0, 0, 0.1),
                  0 0 0 1px rgba(255, 255, 255, 0.05),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  textAlign: 'center',
                  pt: 6,
                  pb: 4,
                  px: 4,
                  background: `
                    linear-gradient(135deg, 
                      rgba(99, 102, 241, 0.05) 0%, 
                      rgba(16, 185, 129, 0.05) 100%
                    )
                  `,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <motion.div variants={logoVariants}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 80,
                      height: 80,
                      borderRadius: '20px',
                      background: `
                        linear-gradient(135deg, 
                          rgba(99, 102, 241, 0.1) 0%, 
                          rgba(16, 185, 129, 0.1) 100%
                        )
                      `,
                      border: '2px solid rgba(99, 102, 241, 0.2)',
                      mb: 3,
                      fontSize: '2.5rem',
                      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                    }}
                  >
                    🍎
                  </Box>
                </motion.div>
                
                <motion.div variants={contentVariants}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, #6366f1)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Frutería Nina
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      fontWeight: 500,
                      opacity: 0.8,
                    }}
                  >
                    Sistema de Gestión Inteligente
                  </Typography>
                </motion.div>
              </Box>

              {/* Contenido del formulario */}
              <Box sx={{ p: 4 }}>
                <motion.div variants={contentVariants}>
                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 600, 
                        color: 'text.primary',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {title}
                    </Typography>
                    {subtitle && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          fontWeight: 400,
                          lineHeight: 1.5,
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
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  {children}
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    );
  }

  // Layout desktop - dos columnas
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, 
            rgba(15, 23, 42, 0.95) 0%, 
            rgba(30, 41, 59, 0.95) 50%, 
            rgba(51, 65, 85, 0.95) 100%
          ),
          radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ParticleBackground />
      
      {/* Efectos de luz ambiental */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />

      <Container maxWidth="xl" sx={{ zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: '90vh' }}>
          {/* Columna izquierda - Formulario */}
          <Grid item xs={12} lg={6}>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Paper
                elevation={0}
                sx={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: `
                    0 20px 40px rgba(0, 0, 0, 0.1),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                {/* Header con logo */}
                <Box
                  sx={{
                    textAlign: 'center',
                    pt: 6,
                    pb: 4,
                    px: 4,
                    background: `
                      linear-gradient(135deg, 
                        rgba(99, 102, 241, 0.05) 0%, 
                        rgba(16, 185, 129, 0.05) 100%
                      )
                    `,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <motion.div variants={logoVariants}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        background: `
                          linear-gradient(135deg, 
                            rgba(99, 102, 241, 0.1) 0%, 
                            rgba(16, 185, 129, 0.1) 100%
                          )
                        `,
                        border: '2px solid rgba(99, 102, 241, 0.2)',
                        mb: 3,
                        fontSize: '2.5rem',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                      }}
                    >
                      🍎
                    </Box>
                  </motion.div>
                  
                  <motion.div variants={contentVariants}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 1, 
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, #6366f1)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Frutería Nina
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        opacity: 0.8,
                      }}
                    >
                      Sistema de Gestión Inteligente
                    </Typography>
                  </motion.div>
                </Box>

                {/* Contenido del formulario */}
                <Box sx={{ p: 4 }}>
                  <motion.div variants={contentVariants}>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          mb: 1, 
                          fontWeight: 600, 
                          color: 'text.primary',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {title}
                      </Typography>
                      {subtitle && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontWeight: 400,
                            lineHeight: 1.5,
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
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    {children}
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Columna derecha - Contenido informativo */}
          <Grid item xs={12} lg={6}>
            <motion.div
              variants={featureVariants}
              initial="hidden"
              animate="visible"
            >
              <Box sx={{ pl: { lg: 4 }, color: 'white' }}>
                {/* Hero Section */}
                <Box sx={{ mb: 6 }}>
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                    }}
                  >
                    Gestiona tu frutería con tecnología de vanguardia
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 4, 
                      opacity: 0.9,
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}
                  >
                    Optimiza tus operaciones, aumenta tus ventas y toma decisiones inteligentes 
                    con nuestro sistema integral de gestión empresarial.
                  </Typography>

                  {/* Estadísticas */}
                  <Grid container spacing={3} sx={{ mb: 6 }}>
                    {stats.map((stat, index) => (
                      <Grid item xs={6} key={index}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                        >
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 3,
                              borderRadius: '16px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            <Typography 
                              variant="h4" 
                              sx={{ 
                                fontWeight: 700, 
                                mb: 1,
                                background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                              }}
                            >
                              {stat.number}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              {stat.label}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Características principales */}
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4, 
                      fontWeight: 600,
                      opacity: 0.95,
                    }}
                  >
                    ¿Por qué elegir Frutería Nina?
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {features.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                        >
                          <Card
                            sx={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '16px',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                background: 'rgba(255, 255, 255, 0.15)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                              }
                            }}
                          >
                            <CardContent sx={{ p: 3 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 48,
                                  height: 48,
                                  borderRadius: '12px',
                                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                                  color: '#10b981',
                                  mb: 2,
                                }}
                              >
                                {feature.icon}
                              </Box>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  mb: 1, 
                                  fontWeight: 600,
                                  color: 'white',
                                }}
                              >
                                {feature.title}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  opacity: 0.8,
                                  lineHeight: 1.5,
                                  color: 'white',
                                }}
                              >
                                {feature.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Call to action adicional */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 0.6 }}
                >
                  <Box
                    sx={{
                      mt: 6,
                      p: 4,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.2)',
                        mb: 3,
                      }}
                    >
                      <SupportAgentRounded sx={{ fontSize: 30, color: '#10b981' }} />
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        color: 'white',
                      }}
                    >
                      ¿Necesitas ayuda?
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        opacity: 0.8,
                        mb: 3,
                        color: 'white',
                      }}
                    >
                      Nuestro equipo de soporte está disponible 24/7 para ayudarte 
                      con cualquier consulta o problema técnico.
                    </Typography>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 3,
                        py: 1.5,
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <CloudRounded sx={{ fontSize: 20, color: '#10b981' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
                        soporte@fruteria-nina.com
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthFormWrapper;