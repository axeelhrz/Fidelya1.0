"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  useTheme,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconQuote } from "@tabler/icons-react";

// Datos de testimonios
const testimonials = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    role: "CEO, TechSolutions",
    avatar: "/images/testimonials/avatar-1.jpg",
    content: "Trabajar con Axel fue una experiencia excepcional. Entendió perfectamente nuestras necesidades y entregó una plataforma que superó todas nuestras expectativas. Nuestras conversiones aumentaron un 85% en los primeros tres meses.",
  },
  {
    id: 2,
    name: "Laura Martínez",
    role: "Directora de Marketing, E-Shop",
    avatar: "/images/testimonials/avatar-2.jpg",
    content: "Axel no solo es un desarrollador técnicamente brillante, sino que también entiende de negocios y conversión. Nuestra tienda online ahora genera un 120% más de ventas gracias a sus optimizaciones.",
  },
  {
    id: 3,
    name: "Miguel Sánchez",
    role: "Fundador, HealthApp",
    avatar: "/images/testimonials/avatar-3.jpg",
    content: "Buscábamos a alguien que pudiera transformar nuestra idea en una aplicación funcional y Axel lo logró perfectamente. Su enfoque en la experiencia del usuario y la optimización técnica fue clave para nuestro éxito.",
  },
  {
    id: 4,
    name: "Ana García",
    role: "CMO, DigitalGrowth",
    avatar: "/images/testimonials/avatar-4.jpg",
    content: "La capacidad de Axel para combinar diseño atractivo con funcionalidad avanzada es impresionante. Nuestra plataforma no solo se ve increíble, sino que también convierte visitantes en clientes de manera efectiva.",
  },
];

export function TestimonialsSection() {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);
  };
  
  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  
  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);
  
  const handlePrev = () => {
    stopAutoPlay();
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    startAutoPlay();
  };
  
  const handleNext = () => {
    stopAutoPlay();
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    startAutoPlay();
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
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };
  
  return (
    <Box 
      component="section" 
      id="testimonios"
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
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Lo que dicen mis clientes
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
            Resultados reales que han transformado negocios y generado crecimiento.
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            position: "relative",
            height: { xs: 400, md: 300 },
            overflow: "hidden",
          }}
        >
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                position: "absolute",
                width: "100%",
              }}
            >
              <Box 
                sx={{ 
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  gap: 4,
                  p: 4,
                  borderRadius: 4,
                  background: theme.palette.mode === "dark" 
                    ? "rgba(30, 30, 30, 0.5)" 
                    : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid",
                  borderColor: theme.palette.mode === "dark" 
                    ? "rgba(255, 255, 255, 0.1)" 
                    : "rgba(0, 0, 0, 0.05)",
                }}
                className="glass"
              >
                <Box 
                  sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar 
                    src={testimonials[currentIndex].avatar} 
                    alt={testimonials[currentIndex].name}
                    sx={{ 
                      width: 100, 
                      height: 100,
                      border: "4px solid",
                      borderColor: "primary.main",
                    }}
                  />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h6" fontWeight={600}>
                      {testimonials[currentIndex].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonials[currentIndex].role}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ position: "relative" }}>
                  <IconQuote 
                    size={40} 
                    style={{ 
                      position: "absolute",
                      top: -20,
                      left: -10,
                      opacity: 0.2,
                      color: theme.palette.primary.main,
                    }} 
                  />
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontStyle: "italic",
                      lineHeight: 1.8,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    &ldquo;{testimonials[currentIndex].content}&rdquo;
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </AnimatePresence>
          
          <Box 
            sx={{ 
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 4,
              position: "absolute",
              bottom: -20,
              left: 0,
              right: 0,
            }}
          >
            <IconButton 
              onClick={handlePrev}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{ 
                bgcolor: "background.paper",
                boxShadow: theme.palette.mode === "dark" 
                  ? "0 4px 12px rgba(0, 0, 0, 0.2)" 
                  : "0 4px 12px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  bgcolor: "background.paper",
                },
              }}
            >
              <IconArrowLeft size={20} />
            </IconButton>
            
            <IconButton 
              onClick={handleNext}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{ 
                bgcolor: "background.paper",
                boxShadow: theme.palette.mode === "dark" 
                  ? "0 4px 12px rgba(0, 0, 0, 0.2)" 
                  : "0 4px 12px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  bgcolor: "background.paper",
                },
              }}
            >
              <IconArrowRight size={20} />
            </IconButton>
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            display: "flex",
            justifyContent: "center",
            mt: 10,
          }}
        >
          {testimonials.map((_, index) => (
            <Box
              key={index}
              component={motion.div}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                stopAutoPlay();
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
                startAutoPlay();
              }}
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                mx: 0.5,
                cursor: "pointer",
                bgcolor: index === currentIndex ? "primary.main" : "divider",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}