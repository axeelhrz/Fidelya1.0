"use client";

import { useState } from "react";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Container, 
  Divider, 
  Grid, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  TextField,
  InputAdornment,
  Slider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { IconCheck, IconBrandWhatsapp, IconArrowUpRight } from "@tabler/icons-react";

// Tipos de servicios
const services = [
  {
    name: "Starter",
    price: "1,500",
    description: "Ideal para emprendedores y pequeñas empresas que buscan establecer su presencia online.",
    features: [
      "Diseño web responsive",
      "Hasta 5 páginas",
      "SEO básico",
      "Formulario de contacto",
      "Integración con redes sociales",
      "1 mes de soporte",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "3,000",
    description: "Perfecto para negocios en crecimiento que necesitan una plataforma más completa y personalizada.",
    features: [
      "Todo lo del plan Starter",
      "Hasta 10 páginas",
      "Diseño personalizado avanzado",
      "Blog integrado",
      "SEO avanzado",
      "Integración con CRM",
      "Análisis de conversión",
      "3 meses de soporte",
    ],
    highlighted: true,
  },
  {
    name: "Elite",
    price: "5,000+",
    description: "Solución completa para empresas que requieren una plataforma digital de alto rendimiento.",
    features: [
      "Todo lo del plan Pro",
      "Páginas ilimitadas",
      "E-commerce completo",
      "Panel de administración",
      "Integraciones API personalizadas",
      "Optimización de velocidad avanzada",
      "Estrategia de conversión",
      "6 meses de soporte",
    ],
    highlighted: false,
  },
];

export function ServicesSection() {
  const theme = useTheme();
  const [investment, setInvestment] = useState<number>(3000);
  const [clientValue, setClientValue] = useState<number>(500);
  const [conversionRate, setConversionRate] = useState<number>(10);
  
  // Cálculo del ROI
  const monthlyVisitors = 1000; // Asumimos este número
  const monthlyLeads = Math.round(monthlyVisitors * (conversionRate / 100));
  const monthlyRevenue = monthlyLeads * clientValue;
  const annualRevenue = monthlyRevenue * 12;
  const roi = ((annualRevenue - investment) / investment) * 100;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -10,
      boxShadow: theme.palette.mode === "dark"
        ? "0 20px 40px rgba(0, 0, 0, 0.3)"
        : "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };
  
  return (
    <Box 
      component="section" 
      id="servicios"
      sx={{ 
        py: { xs: 10, md: 16 },
        background: theme.palette.mode === "dark" 
          ? "linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(20,20,20,1) 100%)"
          : "linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(255,255,255,1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          sx={{ 
            textAlign: "center",
            mb: { xs: 8, md: 12 },
          }}
        >
          <Typography 
            component={motion.h2}
            variants={itemVariants}
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Servicios a medida
          </Typography>
          
          <Typography 
            component={motion.p}
            variants={itemVariants}
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: "700px",
              mx: "auto",
              mb: 4,
              fontWeight: 400,
            }}
          >
            Soluciones digitales diseñadas para maximizar tu presencia online y convertir visitantes en clientes.
          </Typography>
        </Box>
        
        {/* Tarjetas de servicios */}
        <Grid container spacing={4} sx={{ mb: 12 }}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={service.name}>
              <Card 
                component={motion.div}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.1 }}
                sx={{ 
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "visible",
                  border: service.highlighted ? 2 : 1,
                  borderColor: service.highlighted 
                    ? "primary.main" 
                    : "divider",
                  ...(service.highlighted && {
                    mt: { md: -2 },
                    mb: { md: -2 },
                  }),
                }}
              >
                {service.highlighted && (
                  <Box 
                    sx={{ 
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "primary.main",
                      color: "primary.contrastText",
                      py: 0.5,
                      px: 2,
                      borderRadius: 100,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Recomendado
                  </Box>
                )}
                
                <CardContent sx={{ p: 4, flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" fontWeight={700} gutterBottom>
                    {service.name}
                  </Typography>
                  
                  <Box sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
                    <Typography variant="h3" component="span" fontWeight={700}>
                      ${service.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      USD
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {service.description}
                  </Typography>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <List disablePadding>
                    {service.features.map((feature) => (
                      <ListItem key={feature} disablePadding sx={{ mb: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <IconCheck size={20} color={theme.palette.primary.main} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ 
                            variant: "body2",
                            fontWeight: 500,
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button 
                    variant={service.highlighted ? "contained" : "outlined"}
                    color={service.highlighted ? "primary" : "secondary"}
                    fullWidth
                    size="large"
                    endIcon={<IconBrandWhatsapp />}
                    href={`https://wa.me/1234567890?text=Hola%20Axel,%20estoy%20interesado%20en%20el%20plan%20${service.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      py: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Contactar por WhatsApp
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Calculadora de ROI */}
        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          sx={{ 
            background: theme.palette.mode === "dark" 
              ? "rgba(0, 0, 0, 0.2)" 
              : "rgba(0, 0, 0, 0.02)",
            borderRadius: 4,
            p: { xs: 3, md: 6 },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box component={motion.div} variants={itemVariants}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Calculadora de ROI
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                  Calcula el retorno de inversión que podrías obtener con nuestras soluciones digitales.
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Inversión inicial ($)
                  </Typography>
                  <TextField
                    fullWidth
                    value={investment}
                    onChange={(e) => setInvestment(Number(e.target.value))}
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Valor promedio por cliente ($)
                  </Typography>
                  <TextField
                    fullWidth
                    value={clientValue}
                    onChange={(e) => setClientValue(Number(e.target.value))}
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Tasa de conversión esperada (%)
                  </Typography>
                  <Box sx={{ px: 1 }}>
                    <Slider
                      value={conversionRate}
                      onChange={(_, newValue) => setConversionRate(newValue as number)}
                      min={1}
                      max={20}
                      step={0.5}
                      marks={[
                        { value: 1, label: '1%' },
                        { value: 10, label: '10%' },
                        { value: 20, label: '20%' },
                      ]}
                      sx={{ mb: 3 }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box 
                component={motion.div} 
                variants={itemVariants}
                sx={{ 
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box 
                  sx={{ 
                    background: theme.palette.mode === "dark" 
                      ? "rgba(0, 112, 243, 0.1)" 
                      : "rgba(0, 112, 243, 0.05)",
                    borderRadius: 3,
                    p: 4,
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderWidth: "1px",
                    mb: 3,
                  }}
                >
                  <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
                    {roi.toFixed(0)}%
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={500}>
                    ROI estimado en 12 meses
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                      <Typography variant="body2" color="text.secondary">
                        Leads mensuales
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {monthlyLeads}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                      <Typography variant="body2" color="text.secondary">
                        Ingresos mensuales
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        ${monthlyRevenue.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                      <Typography variant="body2" color="text.secondary">
                        Ingresos anuales estimados
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        ${annualRevenue.toLocaleString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Button 
                  variant="contained" 
                  color="primary"
                  endIcon={<IconArrowUpRight size={18} />}
                  href="/contacto"
                  sx={{ 
                    mt: 3,
                    py: 1.5,
                    fontWeight: 500,
                  }}
                >
                  Maximiza tu inversión
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}