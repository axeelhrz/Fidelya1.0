'use client';

import { useState } from 'react';
import { Container, Typography, Box, Switch, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@/components/ui/Button';

const pricingPlans = [
  {
    title: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Perfecto para probar la plataforma',
    features: [
      { text: '3 videos por mes', included: true },
      { text: 'Duración máxima: 15 segundos', included: true },
      { text: 'Marca de agua', included: true },
      { text: 'Calidad estándar', included: true },
      { text: 'Soporte por email', included: true },
      { text: 'Descarga en múltiples formatos', included: false },
      { text: 'Plantillas personalizadas', included: false },
      { text: 'Voces premium', included: false },
    ],
    buttonText: 'Comenzar Gratis',
    buttonVariant: 'outlined',
    popular: false,
    color: '#4A7DFF',
  },
  {
    title: 'Starter',
    price: { monthly: 9, annual: 90 },
    description: 'Para creadores de contenido individuales',
    features: [
      { text: '15 videos por mes', included: true },
      { text: 'Duración máxima: 30 segundos', included: true },
      { text: 'Sin marca de agua', included: true },
      { text: 'Calidad HD', included: true },
      { text: 'Soporte prioritario', included: true },
      { text: 'Descarga en múltiples formatos', included: true },
      { text: 'Plantillas personalizadas', included: false },
      { text: 'Voces premium', included: false },
    ],
    buttonText: 'Suscribirse',
    buttonVariant: 'contained',
    popular: true,
    color: '#1ED760',
  },
  {
    title: 'Pro',
    price: { monthly: 29, annual: 290 },
    description: 'Para creadores profesionales',
    features: [
      { text: '60 videos por mes', included: true },
      { text: 'Duración máxima: 60 segundos', included: true },
      { text: 'Sin marca de agua', included: true },
      { text: 'Calidad HD', included: true },
      { text: 'Soporte prioritario', included: true },
      { text: 'Descarga en múltiples formatos', included: true },
      { text: 'Plantillas personalizadas', included: true },
      { text: 'Voces premium', included: true },
    ],
    buttonText: 'Suscribirse',
    buttonVariant: 'contained',
    popular: false,
    color: '#FF3366',
  },
  {
    title: 'Agency',
    price: { monthly: 79, annual: 790 },
    description: 'Para agencias y equipos',
    features: [
      { text: '250 videos por mes', included: true },
      { text: 'Duración máxima: 60 segundos', included: true },
      { text: 'Sin marca de agua', included: true },
      { text: 'Calidad 4K', included: true },
      { text: 'Soporte prioritario 24/7', included: true },
      { text: 'Descarga en múltiples formatos', included: true },
      { text: 'Plantillas personalizadas', included: true },
      { text: 'Voces premium', included: true },
      { text: 'Branding white-label', included: true },
      { text: 'API access', included: true },
    ],
    buttonText: 'Contactar Ventas',
    buttonVariant: 'outlined',
    popular: false,
    color: '#FFB800',
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  const handleBillingChange = () => {
    setAnnual(!annual);
  };

  return (
    <Box
      component="section"
      id="pricing"
      sx={{
        py: { xs: 10, md: 16 },
                    position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
                        position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(180deg, rgba(16, 16, 16, 0) 0%, rgba(16, 16, 16, 0.8) 100%)',
          zIndex: 0,
        },
                      }}
                    >
      {/* Decorative elements */}
                        <Box
                          sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(30, 215, 96, 0.1) 0%, rgba(16, 16, 16, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
                          }}
                          />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(255, 51, 102, 0.1) 0%, rgba(16, 16, 16, 0) 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
                    >
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(90deg, #1ED760 0%, #FF3366 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                display: 'inline-block',
              }}
            >
              Planes y Precios
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                maxWidth: '700px',
                mx: 'auto',
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              Elige el plan que mejor se adapte a tus necesidades. Todos incluyen acceso a nuestra tecnología de IA.
            </Typography>
            
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'rgba(30, 215, 96, 0.1)',
                borderRadius: '100px',
                padding: '4px 8px',
                border: '1px solid rgba(30, 215, 96, 0.2)',
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: !annual ? 600 : 400,
                  color: !annual ? 'primary.main' : 'text.secondary',
                  px: 2,
                }}
              >
                Mensual
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={annual}
                    onChange={handleBillingChange}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#1ED760',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgba(30, 215, 96, 0.5)',
                      },
                    }}
                  />
                }
                label=""
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: annual ? 600 : 400,
                  color: annual ? 'primary.main' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                }}
              >
                Anual
                {annual && (
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    Ahorra 20%
    </Box>
                )}
              </Typography>
            </Box>
          </motion.div>
        </Box>

        <Box 
          sx={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 4, md: 2 },
            justifyContent: 'center',
          }}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              viewport={{ once: true }}
              style={{ 
                flex: '1 1 280px',
                maxWidth: '320px',
                minWidth: '280px',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  backgroundColor: plan.popular ? 'rgba(30, 215, 96, 0.05)' : 'rgba(23, 23, 23, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  border: '1px solid',
                  borderColor: plan.popular ? plan.color : 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(${plan.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.1)`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: `linear-gradient(90deg, ${plan.color} 0%, rgba(23, 23, 23, 0) 100%)`,
                  },
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 0,
                      backgroundColor: plan.color,
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: '4px 0 0 4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      zIndex: 1,
                    }}
                  >
                    Más Popular
                  </Box>
                )}
                
                <Typography variant="h5" component="h3" sx={{ mb: 1, fontWeight: 600, color: plan.color }}>
                  {plan.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {plan.description}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{ 
                      fontWeight: 700, 
                      display: 'flex', 
                      alignItems: 'flex-end',
                      color: 'white',
                    }}
                  >
                    ${annual ? Math.round((plan.price.annual / 12) * 100) / 100 : plan.price.monthly}
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1, mb: 0.5 }}
                    >
                      / mes
                    </Typography>
                  </Typography>
                  
                  {annual && plan.price.annual > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      ${plan.price.annual} facturado anualmente
                    </Typography>
                  )}
                </Box>
                
                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none', mb: 4, flexGrow: 1 }}>
                  {plan.features.map((feature, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      {feature.included ? (
                        <CheckIcon
                          sx={{
                            mr: 1.5,
                            color: plan.color,
                            fontSize: '1.25rem',
                          }}
                        />
                      ) : (
                        <CloseIcon
                          sx={{
                            mr: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)',
                            fontSize: '1.25rem',
                          }}
                        />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: feature.included ? 'text.primary' : 'text.secondary',
                          textDecoration: feature.included ? 'none' : 'line-through',
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                
                <Button
                  fullWidth
                  variant={plan.buttonVariant as 'contained' | 'outlined'}
                  color={plan.popular ? 'secondary' : 'primary'}
                  size="large"
                  href="/signup"
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    ...(plan.buttonVariant === 'outlined' && {
                      borderColor: plan.color,
                      color: plan.color,
                      '&:hover': {
                        borderColor: plan.color,
                        backgroundColor: `rgba(${plan.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.1)`,
                      },
                    }),
                    ...(plan.buttonVariant === 'contained' && plan.popular && {
                      background: `linear-gradient(90deg, ${plan.color} 0%, #FF3366 100%)`,
                      '&:hover': {
                        background: `linear-gradient(90deg, ${plan.color} 20%, #FF3366 100%)`,
                      },
                    }),
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Box>
            </motion.div>
          ))}
        </Box>
        
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="body2" color="text.secondary">
            ¿Necesitas un plan personalizado para tu empresa?{' '}
            <Box
              component="a"
              href="/contact"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Contáctanos
            </Box>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Pricing;