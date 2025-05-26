"use client";

import { Box, Button, Card, CardContent, Container, Stack, Typography, useTheme, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { IconExternalLink, IconInfoCircle } from "@tabler/icons-react";
// Datos de productos
const products = [
  {
    id: 1,
    name: "Assuriva",
    tagline: "Plataforma SaaS para corredores de seguros",
    description: "Gestión completa de clientes, pólizas, tareas y pagos para corredores de seguros.",
    image: "/images/products/assuriva.webp",
    stats: "+1.200 pólizas gestionadas",
    demoUrl: "#contacto",
    technologies: ["Next.js", "Firebase", "Stripe", "MUI", "PWA"],
    features: [
      "Dashboard personalizado",
      "Gestión de clientes y pólizas",
      "Recordatorios automáticos",
      "Procesamiento de pagos",
      "Reportes avanzados",
    ],
  },
  {
    id: 2,
    name: "Tu Veterinaria",
    tagline: "Sistema de gestión veterinaria integral",
    description: "Sistema completo con agenda, fichas clínicas, inventario y notificaciones para clientes.",
    image: "/images/products/veterinaria.webp",
    stats: "+5.000 mascotas atendidas",
    demoUrl: "#contacto",
    technologies: ["React", "Node.js", "MongoDB", "PayPal", "PWA"],
    features: [
      "Agenda inteligente",
      "Fichas clínicas digitales",
      "Control de inventario",
      "Notificaciones automáticas",
      "App móvil para clientes",
    ],
  },
  {
    id: 3,
    name: "Menú QR",
    tagline: "Menús digitales para restaurantes",
    description: "Webapp con generación automática de QR, menús digitales y panel administrativo editable.",
    image: "/images/products/menu-qr.webp",
    stats: "+700 menús escaneados/mes",
    demoUrl: "#contacto",
    technologies: ["Next.js", "Vercel", "Tailwind", "Framer Motion", "PWA"],
    features: [
      "Generación de QR personalizado",
      "Panel de administración intuitivo",
      "Actualización en tiempo real",
      "Analíticas de escaneos",
      "Diseño personalizable",
    ],
  },
];

export function ProductsSection() {
  const theme = useTheme();
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        ? "0 20px 40px rgba(0, 0, 0, 0.5)" 
        : "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };
  
  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    }
  };
  
  return (
    <Box 
      component="section" 
      id="productos"
      sx={{ 
        py: { xs: 10, md: 16 },
        background: theme.palette.mode === "dark" 
          ? "linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)",
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
            Productos digitales
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
            Soluciones tecnológicas completas diseñadas para resolver problemas reales
            de negocios con alto nivel técnico y experiencia de usuario excepcional.
          </Typography>
        </Box>
        
        {/* Tarjetas de productos */}
        <Stack spacing={6}>
          {products.map((product, index) => (
            <Card 
              key={product.id}
              component={motion.div}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, amount: 0.1 }}
              sx={{ 
                overflow: "hidden",
                borderRadius: "2xl",
                boxShadow: "lg",
                }}
              >
              <Box sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" },
                height: "100%",
              }}>
                {/* Imagen del producto */}
                <Box 
                  component={motion.div}
                  variants={imageVariants}
                  whileHover="hover"
                  sx={{ 
                    position: "relative",
                    width: { xs: "100%", md: "50%" },
                    height: { xs: "240px", md: "auto" },
                    overflow: "hidden",
                      }}
                >
                  <Box
                    component={motion.div}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                      sx={{ 
                      width: "100%",
                      height: "100%",
                      background: `url(${product.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      }}
                  />
                  <Box 
                    sx={{ 
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 100,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {product.stats}
                  </Box>
                </Box>
                
                {/* Contenido del producto */}
                <CardContent 
                  sx={{ 
                    p: { xs: 3, md: 5 },
                    width: { xs: "100%", md: "50%" },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h4" 
                      component="h3" 
                      fontWeight={700}
                      sx={{ mb: 1 }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary.main"
                      fontWeight={600}
                      sx={{ mb: 2 }}
                    >
                      {product.tagline}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      paragraph
                      sx={{ mb: 3 }}
                    >
                      {product.description}
                    </Typography>
                    {/* Tecnologías */}
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      flexWrap="wrap"
                      sx={{ mb: 4, gap: 1 }}
                    >
                      {product.technologies.map((tech) => (
                        <Chip 
                          key={tech}
                          label={tech} 
                          size="small"
                          sx={{ 
                            background: theme.palette.mode === "dark" 
                              ? "rgba(93, 95, 239, 0.15)" 
                              : "rgba(93, 95, 239, 0.1)",
                            color: "primary.main",
                            fontWeight: 500,
                            borderRadius: "100px",
                            mb: 1,
                          }}
                        />
                      ))}
                    </Stack>
                    
                    {/* Botones de acción */}
                    <Stack 
                      direction={{ xs: "column", sm: "row" }} 
                      spacing={2}
                      sx={{ mt: "auto" }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<IconExternalLink size={18} />}
                        href={product.demoUrl}
                        sx={{ 
                          fontWeight: 500,
                          py: 1.5,
                        }}
                      >
                        Ver caso de estudio
                </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        endIcon={<IconInfoCircle size={18} />}
                        href="#contacto"
                        sx={{ 
                          fontWeight: 500,
                          py: 1.5,
                        }}
                      >
                        Más información
                      </Button>
                    </Stack>
    </Box>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Stack>
        
        {/* CTA final */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          sx={{
            textAlign: "center",
            mt: 10,
            p: 5,
            borderRadius: "2xl",
            background: theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(93, 95, 239, 0.15) 0%, rgba(61, 90, 254, 0.15) 100%)"
              : "linear-gradient(135deg, rgba(93, 95, 239, 0.1) 0%, rgba(61, 90, 254, 0.1) 100%)",
          }}
        >
          <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
            ¿Necesitas una solución personalizada?
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: "700px", mx: "auto" }}>
            Desarrollamos productos digitales a medida para resolver los desafíos específicos de tu negocio.
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="#contacto"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Hablemos de tu proyecto
          </Button>
        </Box>
      </Container>
    </Box>
  );
}