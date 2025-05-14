'use client';

import { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardActions, Switch, FormControlLabel } from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@/components/ui/Button';

const pricingPlans = [
  {
    title: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Perfecto para probar la plataforma',
    features: [
      '3 videos por mes',
      'Duración máxima: 15 segundos',
      'Marca de agua',
      'Calidad estándar',
      'Soporte por email',
    ],
    buttonText: 'Comenzar Gratis',
    buttonVariant: 'outlined',
    popular: false,
  },
  {
    title: 'Starter',
    price: { monthly: 9, annual: 90 },
    description: 'Para creadores de contenido individuales',
    features: [
      '15 videos por mes',
      'Duración máxima: 30 segundos',
      'Sin marca de agua',
      'Calidad HD',
      'Soporte prioritario',
      'Descarga en múltiples formatos',
    ],
    buttonText: 'Suscribirse',
    buttonVariant: 'contained',
    popular: true,
  },
  {
    title: 'Pro',
    price: { monthly: 29, annual: 290 },
    description: 'Para creadores profesionales',
    features: [
      '60 videos por mes',
      'Duración máxima: 60 segundos',
      'Sin marca de agua',
      'Calidad HD',
      'Soporte prioritario',
      'Descarga en múltiples formatos',
      'Plantillas personalizadas',
      'Voces premium',
    ],
    buttonText: 'Suscribirse',
    buttonVariant: 'outlined',
    popular: false,
  },
  {
    title: 'Agency',
    price: { monthly: 79, annual: 790 },
    description: 'Para agencias y equipos',
    features: [
      '250 videos por mes',
      'Duración máxima: 60 segundos',
      'Sin marca de agua',
      'Calidad 4K',
      'Soporte prioritario 24/7',
      'Descarga en múltiples formatos',
      'Plantillas personalizadas',
      'Voces premium',
      'Branding white-label',
      'API access',
    ],
    buttonText: 'Contactar Ventas',
    buttonVariant: 'outlined',
    popular: false,
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
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Planes y Precios
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              maxWidth: '700px',
              mx: 'auto',
              mb: 4,
            }}
          >
            Elige el plan que mejor se adapte a tus necesidades. Todos incluyen acceso a nuestra tecnología de IA.
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={annual}
                onChange={handleBillingChange}
                color="primary"
              />
            }
            label={
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Facturación Mensual
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
              </Box>
            }
            labelPlacement="end"
          />
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible',
                    backgroundColor: plan.popular ? 'rgba(30, 215, 96, 0.05)' : 'background.paper',
                    border: plan.popular ? '2px solid' : '1px solid',
                    borderColor: plan.popular ? 'primary.main' : 'divider',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      Más Popular
                    </Box>
                  )}

                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
                      {plan.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h3"
                        component="div"
                        sx={{ fontWeight: 700, display: 'flex', alignItems: 'flex-end' }}
                      >
                        ${annual ? plan.price.annual / 12 : plan.price.monthly}
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

                    <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                      {plan.features.map((feature, idx) => (
                        <Box
                          component="li"
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1.5,
                          }}
                        >
                          <CheckIcon
                            sx={{
                              mr: 1.5,
                              color: 'primary.main',
                              fontSize: '1.25rem',
                            }}
                          />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 4, pt: 0 }}>
                    <Button
                      fullWidth
                      variant={plan.buttonVariant as 'contained' | 'outlined'}
                      color={plan.popular ? 'secondary' : 'primary'}
                      size="large"
                    >
                      {plan.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pricing;