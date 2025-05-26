"use client";

import { useState } from "react";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Container, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Grid, 
  IconButton, 
  Typography, 
  useTheme,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { IconX, IconExternalLink, IconEye } from "@tabler/icons-react";

// Datos de productos
const products = [
  {
    id: 1,
    name: "Dashboard UI Kit",
    description: "Kit completo de interfaz de usuario para dashboards administrativos con más de 300 componentes.",
    image: "/images/products/dashboard-ui-kit.jpg",
    price: "$79",
    stats: "+350 descargas",
    demoUrl: "https://example.com/demo/dashboard-ui",
    purchaseUrl: "https://gumroad.com/l/dashboard-ui-kit",
    features: [
      "300+ componentes UI",
      "Diseño responsivo",
      "Temas claro y oscuro",
      "Figma y Sketch incluidos",
      "Actualizaciones gratuitas",
    ],
  },
  {
    id: 2,
    name: "E-commerce Template",
    description: "Plantilla completa para tiendas online con funcionalidades avanzadas y diseño optimizado para conversión.",
    image: "/images/products/ecommerce-template.jpg",
    price: "$129",
    stats: "Mejor valorado",
    demoUrl: "https://example.com/demo/ecommerce",
    purchaseUrl: "https://gumroad.com/l/ecommerce-template",
    features: [
      "Carrito de compras",
      "Pasarela de pagos",
      "Gestión de inventario",
      "Optimizado para SEO",
      "Soporte técnico",
    ],
  },
  {
    id: 3,
    name: "Landing Page Pack",
    description: "Pack de 10 landing pages de alta conversión para diferentes nichos y sectores.",
    image: "/images/products/landing-page-pack.jpg",
    price: "$59",
    stats: "Nuevo lanzamiento",
    demoUrl: "https://example.com/demo/landing-pages",
    purchaseUrl: "https://gumroad.com/l/landing-page-pack",
    features: [
      "10 diseños diferentes",
      "Optimizado para conversión",
      "Código limpio y documentado",
      "Integración con herramientas de marketing",
      "Soporte por 6 meses",
    ],
  },
];

export function ProductsSection() {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  
  const handleOpenDialog = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
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
      transition: { duration: 0.3 },
    },
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
            Recursos y plantillas premium para acelerar tus proyectos digitales y maximizar resultados.
          </Typography>
        </Box>
        
        {/* Tarjetas de productos */}
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid key={product.id}>
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
                  overflow: "hidden",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={product.image}
                    alt={product.name}
                    sx={{ 
                      objectFit: "cover",
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 100,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {product.price}
                  </Box>
                </Box>
                
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}>
                    <Typography variant="h5" component="h3" fontWeight={700}>
                      {product.name}
                    </Typography>
                    <Chip 
                      label={product.stats} 
                      size="small"
                      sx={{ 
                        background: theme.palette.mode === "dark" 
                          ? "rgba(0, 112, 243, 0.15)" 
                          : "rgba(0, 112, 243, 0.1)",
                        color: "primary.main",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  
                  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<IconEye size={18} />}
                      onClick={() => handleOpenDialog(product)}
                      sx={{ 
                        flexGrow: 1,
                        fontWeight: 500,
                      }}
                    >
                      Ver demo
                    </Button>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<IconExternalLink size={18} />}
                      href={product.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        flexGrow: 1,
                        fontWeight: 500,
                      }}
                    >
                      Comprar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Modal de demo */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedProduct && (
            <>
              <DialogTitle sx={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                p: 3,
              }}>
                <Typography variant="h5" component="h2" fontWeight={600}>
                  {selectedProduct.name}
                </Typography>
                <IconButton onClick={handleCloseDialog} edge="end">
                  <IconX size={20} />
                </IconButton>
              </DialogTitle>
              
              <DialogContent dividers sx={{ p: 4 }}>
                <Grid container spacing={4}>
                  <Grid>
                    <Box 
                      component="img"
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      sx={{ 
                        width: "100%",
                        height: "auto",
                        borderRadius: 2,
                        mb: 2,
                      }}
                    />
                    
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {selectedProduct.price}
                    </Typography>
                    
                    <Typography variant="body1" paragraph>
                      {selectedProduct.description}
                    </Typography>
                  </Grid>
                  
                  <Grid>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Características
                    </Typography>
                    
                    <Box component="ul" sx={{ pl: 2, mb: 4 }}>
                      {selectedProduct.features.map((feature, index) => (
                        <Box 
                          component="li" 
                          key={index} 
                          sx={{ 
                            mb: 1,
                            color: "text.secondary",
                          }}
                        >
                          {feature}
                        </Box>
                      ))}
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      href={selectedProduct.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<IconExternalLink size={18} />}
                      sx={{ 
                        mb: 2,
                        py: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Ver demo completa
                    </Button>
                    
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      size="large"
                      href={selectedProduct.purchaseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        py: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Comprar en Gumroad
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleCloseDialog} color="inherit">
                  Cerrar
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
}