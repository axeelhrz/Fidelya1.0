"use client";

import { useState, useRef } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Avatar, 
  useTheme,
  IconButton,
  Stack,
  Rating,
  Chip,
} from "@mui/material";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { IconArrowLeft, IconArrowRight, IconQuote, IconBadge, IconStar } from "@tabler/icons-react";

// Datos de testimonios
const testimonials = [
  {
    id: 1,
    name: "Carlos Rodríguez",
    role: "CEO en TechSolutions",
    avatar: "/images/testimonials/avatar-1.jpg",
    content: "Trabajar con Axel fue una experiencia excepcional. Entendió perfectamente nuestras necesidades y entregó una plataforma que superó todas nuestras expectativas. Nuestras conversiones aumentaron un 85% en los primeros tres meses.",
    rating: 5,
    since: "2022",
    verified: true,
  },
  {
    id: 2,
    name: "Laura Martínez",
    role: "Directora de Marketing en E-Shop",
    avatar: "/images/testimonials/avatar-2.jpg",
    content: "Axel no solo es un desarrollador técnicamente brillante, sino que también entiende de negocios y conversión. Nuestra tienda online ahora genera un 120% más de ventas gracias a sus optimizaciones.",
    rating: 5,
    since: "2023",
    verified: true,
  },
  {
    id: 3,
    name: "Miguel Sánchez",
    role: "Fundador en HealthApp",
    avatar: "/images/testimonials/avatar-3.jpg",
    content: "Buscábamos a alguien que pudiera transformar nuestra idea en una aplicación funcional y Axel lo logró perfectamente. Su enfoque en la experiencia del usuario y la optimización técnica fue clave para nuestro éxito.",
    rating: 5,
    since: "2021",
    verified: true,
  },
  {
    id: 4,
    name: "Ana García",
    role: "CMO en DigitalGrowth",
    avatar: "/images/testimonials/avatar-4.jpg",
    content: "La capacidad de Axel para combinar diseño atractivo con funcionalidad avanzada es impresionante. Nuestra plataforma no solo se ve increíble, sino que también convierte visitantes en clientes de manera efectiva.",
    rating: 5,
    since: "2022",
    verified: true,
  },
  {
    id: 5,
    name: "Lucas Fernández",
    role: "CEO en RestQR",
    avatar: "/images/testimonials/avatar-5.jpg",
    content: "Implementamos la solución de Axel en más de 50 restaurantes y los resultados fueron inmediatos. Interfaz intuitiva, carga rápida y un aumento del 40% en pedidos online. Totalmente recomendado.",
    rating: 5,
    since: "2023",
    verified: true,
  },
  {
    id: 6,
    name: "Camila González",
    role: "Fundadora en PetCare",
    avatar: "/images/testimonials/avatar-6.jpg",
    content: "Axel transformó nuestra visión en una aplicación que nuestros clientes adoran. Su atención al detalle y comprensión de las necesidades de nuestro negocio fue fundamental para crear una experiencia excepcional.",
    rating: 5,
    since: "2022",
    verified: true,
  },
  {
    id: 7,
    name: "Javier Morales",
    role: "Corredor en Assuriva",
    avatar: "/images/testimonials/avatar-7.jpg",
    content: "La plataforma desarrollada por Axel revolucionó nuestra forma de gestionar clientes. Ahora procesamos solicitudes un 70% más rápido y nuestros clientes valoran la facilidad de uso y seguridad.",
    rating: 5,
    since: "2023",
    verified: true,
  },
];
  
// Componente de tarjeta de testimonio
const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  const theme = useTheme();
  return (
            <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1.0],
              }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 },
                }}
              >
      <Box 
        sx={{ 
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: theme.palette.mode === "dark" 
            ? "rgba(30, 30, 30, 0.5)" 
            : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" 
            ? "rgba(255, 255, 255, 0.1)" 
            : "rgba(0, 0, 0, 0.05)",
                boxShadow: theme.palette.mode === "dark" 
            ? "0 10px 30px rgba(0, 0, 0, 0.2)"
            : "0 10px 30px rgba(0, 0, 0, 0.05)",
                transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
          },
        }}
      >
        <Box sx={{ position: "relative", mb: 3 }}>
          <IconQuote 
            size={40} 
            style={{ 
              position: "absolute",
              top: -10,
              left: -5,
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
              mb: 2,
              fontFamily: "var(--font-satoshi)",
            }}
          >
            &ldquo;{testimonial.content}&rdquo;
          </Typography>
          
          <Rating 
            value={testimonial.rating} 
            readOnly 
            icon={<IconStar size={20} fill="currentColor" stroke={1.5} />}
            emptyIcon={<IconStar size={20} stroke={1.5} />}
            sx={{ 
              color: "primary.main",
              mb: 2,
            }} 
          />
    </Box>
        
        <Box sx={{ mt: "auto" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar 
              src={testimonial.avatar} 
              alt={testimonial.name}
              sx={{ 
                width: 60, 
                height: 60,
                border: "3px solid",
                borderColor: "primary.main",
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight={600} fontFamily="var(--font-space-grotesk)">
                {testimonial.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {testimonial.role}
              </Typography>
              <Stack direction="row" spacing={1}>
                {testimonial.verified && (
                  <Chip
                    icon={<IconBadge size={14} />}
                    label="Cliente verificado"
                    size="small"
                    sx={{ 
                      bgcolor: "primary.main", 
                      color: "white",
                      fontWeight: 500,
                      fontSize: "0.7rem",
                      height: 24,
                    }}
                  />
                )}
                <Chip
                  label={`Cliente desde ${testimonial.since}`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: "divider",
                    fontSize: "0.7rem",
                    height: 24,
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </motion.div>
  );
};

// Componente principal
export function TestimonialsSection() {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);
  
  // Controles de carrusel
  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
}
  };
  
  const handleNext = () => {
    if (activeIndex < Math.ceil(testimonials.length / 3) - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };
  
  // Variantes de animación
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
  
  // Renderizado responsivo
  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 960) return 2;
      return 3;
    }
    return 3;
  };
  
  const itemsPerView = getItemsPerView();
  
  return (
    <Box 
      component="section" 
      id="testimonios"
      sx={{ 
        py: { xs: 10, md: 16 },
        background: theme.palette.mode === "dark" 
          ? "linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(20,20,20,1) 100%)"
          : "linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(255,255,255,1) 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(93,95,239,0.1) 0%, rgba(93,95,239,0) 70%)",
          top: "10%",
          left: "5%",
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(61,90,254,0.1) 0%, rgba(61,90,254,0) 70%)",
          bottom: "5%",
          right: "5%",
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
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
              background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Historias de éxito impulsadas por código
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
              fontFamily: "var(--font-satoshi)",
            }}
          >
            Clientes satisfechos que han transformado sus negocios con soluciones digitales a medida
          </Typography>
        </Box>
        
        {/* Carrusel para desktop */}
        <Box 
          sx={{ 
            display: { xs: 'none', md: 'block' },
            position: "relative",
            overflow: "hidden",
            mx: -2,
          }}
        >
          <Box
            ref={carouselRef}
            component={motion.div}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, opacity }}
            dragElastic={0.1}
            onDragEnd={(e, info) => {
              if (info.offset.x < -100 && activeIndex < Math.ceil(testimonials.length / itemsPerView) - 1) {
                setActiveIndex(activeIndex + 1);
              } else if (info.offset.x > 100 && activeIndex > 0) {
                setActiveIndex(activeIndex - 1);
              }
            }}
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease',
              transform: `translateX(-${activeIndex * (100 / itemsPerView)}%)`,
              width: `${(testimonials.length / itemsPerView) * 100}%`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <Box 
                key={testimonial.id}
                sx={{ 
                  width: `${100 / itemsPerView}%`,
                  px: 2,
                }}
              >
                <TestimonialCard testimonial={testimonial} index={index} />
              </Box>
            ))}
          </Box>
          
          <Box 
            sx={{ 
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 6,
            }}
          >
            <IconButton 
              onClick={handlePrev}
              disabled={activeIndex === 0}
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
                opacity: activeIndex === 0 ? 0.5 : 1,
              }}
            >
              <IconArrowLeft size={20} />
            </IconButton>
            
            <IconButton 
              onClick={handleNext}
              disabled={activeIndex >= Math.ceil(testimonials.length / itemsPerView) - 1}
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
                opacity: activeIndex >= Math.ceil(testimonials.length / itemsPerView) - 1 ? 0.5 : 1,
              }}
            >
              <IconArrowRight size={20} />
            </IconButton>
          </Box>
        </Box>
        
        {/* Vista móvil - tarjetas verticales */}
        <Box 
          sx={{ 
            display: { xs: 'flex', md: 'none' },
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
          ))}
        </Box>
        
        {/* Indicadores de página */}
        <Box 
          sx={{ 
            display: { xs: 'flex', md: 'flex' },
            justifyContent: 'center',
            mt: 6,
            gap: 1,
          }}
        >
          {Array.from({ length: Math.ceil(testimonials.length / itemsPerView) }).map((_, index) => (
            <Box
              key={index}
              component={motion.div}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: index === activeIndex ? 'primary.main' : 'divider',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}