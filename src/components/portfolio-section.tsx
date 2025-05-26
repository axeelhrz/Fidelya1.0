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

// Datos de proyectos freelance y colaboraciones
const projects = [
  {
    id: 1,
    title: "Reserva Express",
    client: "Cadena de Restaurantes Sabor Latino",
    description: "Sistema de reservas online con integración de pagos PSE que incrementó las reservas en un 45% y redujo las cancelaciones en un 30%.",
    image: "/images/portfolio/reserva-express.jpg",
    technologies: ["Next.js", "TypeScript", "Firebase", "Stripe", "PWA"],
    result: "+400 reservas/mes",
    link: "#",
  },
  {
    id: 2,
    title: "VetConnect",
    client: "Clínica Veterinaria PetCare",
    description: "Plataforma de gestión veterinaria con historias clínicas digitales e integración con laboratorios. Redujo tiempos administrativos en un 60%.",
    image: "/images/portfolio/vetconnect.jpg",
    technologies: ["React", "Node.js", "MongoDB", "AWS", "Material UI"],
    result: "Ahorro de 25 horas/semana en procesos",
    link: "#",
  },
  {
    id: 3,
    title: "InmoCRM",
    client: "Grupo Inmobiliario Horizonte",
    description: "CRM especializado para sector inmobiliario con seguimiento de leads y pipeline de ventas que aumentó la conversión en un 28%.",
    image: "/images/portfolio/inmocrm.jpg",
    technologies: ["Vue.js", "Laravel", "PostgreSQL", "Docker", "Tailwind"],
    result: "Incremento de 28% en conversión",
    link: "#",
  },
  {
    id: 4,
    title: "FinTech Dashboard",
    client: "Startup Fintech Internacional",
    description: "Dashboard analítico para visualización de datos financieros con integraciones API a múltiples fuentes y reportes automatizados.",
    image: "/images/portfolio/fintech-dashboard.jpg",
    technologies: ["React", "D3.js", "Python", "FastAPI", "Redis"],
    result: "90+ en Lighthouse Performance",
    link: "#",
  },
  {
    id: 5,
    title: "EduPlanner",
    client: "Instituto Educativo Nacional",
    description: "Sistema de planificación académica con gestión de horarios, asistencia y evaluaciones que optimizó la carga administrativa docente.",
    image: "/images/portfolio/eduplanner.jpg",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Framer Motion"],
    result: "Reducción del 40% en tiempo de planificación",
    link: "#",
  },
  {
    id: 6,
    title: "MediConnect",
    client: "Red de Clínicas Especializadas",
    description: "Plataforma de telemedicina con agendamiento, videoconsultas y recetas digitales que expandió el alcance geográfico en un 200%.",
    image: "/images/portfolio/mediconnect.jpg",
    technologies: ["React Native", "Node.js", "WebRTC", "MongoDB", "AWS"],
    result: "+1,200 consultas mensuales",
    link: "#",
  },
];

// Categorías para filtrado
const categories = [
  { value: "all", label: "Todos" },
  { value: "web", label: "Web Apps" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mobile", label: "Mobile Apps" },
  { value: "integration", label: "Integraciones API" },
];

export function PortfolioSection() {
  const theme = useTheme();
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
            Proyectos destacados desarrollados para clientes que demuestran mi experiencia
            en diversas tecnologías y soluciones digitales de alto impacto.
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
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
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