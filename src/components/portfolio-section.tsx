"use client";

import { useState, useRef } from "react";
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Container, 
  Typography, 
  useTheme,
  Chip,
  Stack,
  IconButton,
  useMediaQuery
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowRight, IconExternalLink, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import { useTheme as useNextTheme } from "@/components/theme-provider";

// Datos de proyectos específicos
const projects = [
  {
    id: 1,
    title: "Assuriva",
    client: "Producto Propio - InsurTech",
    description: "Plataforma SaaS para compañías de seguros que automatiza procesos, mejora la experiencia del cliente y reduce costos operativos en un 70%.",
    image: "/images/portfolio/assuriva.jpg", // Imagen por defecto (fallback)
    technologies: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Material UI"],
    result: "Reducción 70% en costos operativos",
    link: "https://assuriva.com",
    useThemeImage: true, // Marca este proyecto para usar imágenes según el tema
  },
  {
    id: 2,
    title: "TuVeterinaria",
    client: "Clínica Veterinaria Regional",
    description: "Sistema integral para clínicas veterinarias con historias clínicas digitales, agenda online y tienda de productos que incrementó ingresos en un 45%.",
    image: "/images/portfolio/tuveterinaria.jpg",
    technologies: ["React", "Firebase", "Stripe", "PWA", "Tailwind CSS"],
    result: "+120% en ventas online",
    link: "#",
  },
  {
    id: 3,
    title: "MenuQR",
    client: "Cadena de Restaurantes",
    description: "Sistema de menú digital con QR, pedidos online y pagos integrados que mejoró la eficiencia del servicio y redujo errores en pedidos en un 90%.",
    image: "/images/portfolio/menuqr.jpg",
    technologies: ["Vue.js", "Node.js", "MongoDB", "PWA", "Framer Motion"],
    result: "Aumento de 35% en ticket promedio",
    link: "#",
  }
];

// Categorías para filtrado
const categories = [
  { value: "all", label: "Todos" },
  { value: "saas", label: "SaaS" },
  { value: "web", label: "Web Apps" },
  { value: "mobile", label: "Mobile Apps" },
];

export function PortfolioSection() {
  const theme = useTheme();
  const { theme: nextTheme } = useNextTheme();
  const [filter, setFilter] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Filtrado de proyectos (simulado, ajustar según categorías reales)
  const filteredProjects = projects;
  
  // Variantes de animación para Framer Motion
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
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

  // Navegación del carrusel
  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      scrollToCard(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < filteredProjects.length - 1) {
      setActiveIndex(activeIndex + 1);
      scrollToCard(activeIndex + 1);
    }
  };

  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.scrollWidth / filteredProjects.length;
      carouselRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
    }
  };

  // Determinar cuántos proyectos mostrar por fila según el tamaño de pantalla
  const getCardWidth = () => {
    if (isMobile) return '85vw';
    if (isTablet) return '400px';
    return '380px';
  };
  
  return (
    <Box 
      component="section" 
      id="portafolio"
      sx={{ 
        py: { xs: 10, md: 16 },
        background: theme.palette.mode === "dark" 
          ? "linear-gradient(180deg, #0A0A0A 0%, #111111 100%)" 
          : "linear-gradient(180deg, #F7F7F7 0%, #FFFFFF 100%)",
                        }}
                    >
      <Container maxWidth="xl">
        <Box 
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          sx={{ 
            textAlign: "center",
            mb: { xs: 6, md: 10 },
          }}
        >
          <Typography 
            component={motion.h2}
            variants={itemVariants}
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(90deg, #5D5FEF 0%, #3D5AFE 100%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Portafolio
          </Typography>
          
          <Typography 
            component={motion.p}
            variants={itemVariants}
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: "800px",
              mx: "auto",
              mb: 6,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.25rem" },
              lineHeight: 1.6,
            }}
          >
            Proyectos destacados que demuestran mi experiencia en diversas tecnologías 
            y soluciones digitales de alto impacto para clientes reales.
          </Typography>
          
          {/* Filtros de categorías */}
          <Stack 
            component={motion.div}
            variants={itemVariants}
            direction="row" 
            spacing={1} 
            useFlexGap 
            flexWrap="wrap"
            justifyContent="center"
            sx={{ mb: 8 }}
          >
            {categories.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                onClick={() => setFilter(category.value)}
                sx={{
                  px: 2,
                  py: 2.5,
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  background: filter === category.value 
                    ? "linear-gradient(90deg, #5D5FEF 0%, #3D5AFE 100%)" 
                    : theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.05)" 
                      : "rgba(0, 0, 0, 0.05)",
                  color: filter === category.value 
                    ? "#FFFFFF" 
                    : theme.palette.text.primary,
                  '&:hover': {
                    background: filter === category.value 
                      ? "linear-gradient(90deg, #5D5FEF 0%, #3D5AFE 100%)" 
                      : theme.palette.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.1)" 
                        : "rgba(0, 0, 0, 0.1)",
                  },
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Stack>
    </Box>
        
        {/* Controles de navegación del carrusel */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4,
            gap: 2
          }}
        >
          <IconButton 
            onClick={handlePrev}
            disabled={activeIndex === 0}
            sx={{
              background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              '&:hover': {
                background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              },
              '&.Mui-disabled': {
                opacity: 0.3,
}
            }}
          >
            <IconChevronLeft />
          </IconButton>
          
          <Typography variant="body2" color="text.secondary">
            {activeIndex + 1} / {filteredProjects.length}
          </Typography>
          
          <IconButton 
            onClick={handleNext}
            disabled={activeIndex === filteredProjects.length - 1}
            sx={{
              background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
              '&:hover': {
                background: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
              },
              '&.Mui-disabled': {
                opacity: 0.3,
              }
            }}
          >
            <IconChevronRight />
          </IconButton>
        </Box>
        
        {/* Carrusel de proyectos */}
        <Box
          ref={carouselRef}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': { // Chrome, Safari, etc.
              display: 'none'
            },
            pb: 4,
            px: { xs: 2, md: 0 },
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            '-webkit-overflow-scrolling': 'touch',
          }}
        >
          <AnimatePresence mode="wait">
            <Stack
              direction="row"
              spacing={4}
              sx={{ px: 2 }}
            >
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id}
                  component={motion.div}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true, amount: 0.1 }}
                  sx={{ 
                    width: getCardWidth(),
                    minWidth: getCardWidth(),
                    height: '100%',
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    scrollSnapAlign: 'center',
                    background: theme.palette.mode === "dark" 
                      ? "linear-gradient(145deg, #171717 0%, #0F0F0F 100%)" 
                      : "linear-gradient(145deg, #FFFFFF 0%, #F7F7F7 100%)",
                    border: theme.palette.mode === "dark" 
                      ? "1px solid rgba(255, 255, 255, 0.05)" 
                      : "1px solid rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                    {project.useThemeImage ? (
                      // Usar imagen dinámica basada en el tema para Assuriva
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image
                          src={nextTheme === "dark" ? "/images/Assuriva-night.png" : "/images/Assuriva-light.png"}
                          alt={project.title}
                          fill
                          style={{ 
                            objectFit: "contain",
                            padding: "20px"
                      }}
                          priority
                        />
                      </Box>
                    ) : (
                      // Usar imagen normal para otros proyectos
                      <CardMedia
                        component={motion.img}
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.5 }
                        }}
                        height="240"
                        image={project.image}
                        alt={project.title}
                        sx={{ 
                          objectFit: "cover",
                          transition: 'transform 0.5s ease',
                        }}
                      />
                    )}
                    
                    {/* Overlay con resultado destacado */}
                    {project.result && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                        background: 'linear-gradient(90deg, #5D5FEF 0%, #3D5AFE 100%)',
                          color: 'white',
                          borderRadius: '100px',
                          px: 2,
                          py: 0.5,
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          boxShadow: '0 4px 12px rgba(93, 95, 239, 0.3)',
                        }}
                      >
                        {project.result}
                      </Box>
                    )}
                  </Box>
                  
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    <Typography 
                      variant="subtitle2" 
            color="primary"
                      sx={{ 
                        mb: 1,
              fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontSize: '0.75rem',
            }}
          >
                      {project.client}
                    </Typography>
                    
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 700,
                        mb: 2,
                        fontSize: '1.5rem',
                      }}
                    >
                      {project.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 3,
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                      }}
                    >
                      {project.description}
                    </Typography>
                    
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 'auto', mb: 3 }}>
                      {project.technologies.map((tech) => (
                        <Chip 
                          key={tech} 
                          label={tech} 
                          size="small"
                          sx={{ 
                            background: theme.palette.mode === "dark" 
                              ? "rgba(255, 255, 255, 0.05)" 
                              : "rgba(0, 0, 0, 0.05)",
                            fontWeight: 500,
                            fontSize: '0.7rem',
                            height: '24px',
                          }}
                        />
                      ))}
        </Box>
                    
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<IconExternalLink size={16} />}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        mt: 1,
                        fontWeight: 600,
                        background: 'linear-gradient(90deg, #5D5FEF 0%, #3D5AFE 100%)',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #4A4CD6 0%, #2A3EB1 100%)',
                        },
                      }}
                    >
                      Ver detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </AnimatePresence>
    </Box>
        
        {/* Botón para ver todos los proyectos */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 6 
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            endIcon={<IconArrowRight size={18} />}
            href="#contacto"
            sx={{ 
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            ¿Tienes un proyecto en mente? Contáctame
          </Button>
        </Box>
      </Container>
    </Box>
  );
}