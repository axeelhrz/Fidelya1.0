"use client";

import { useState, useRef } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Stack, 
  useTheme, 
  alpha
} from "@mui/material";
import { 
  motion, 
  useInView, 
  useMotionValue 
} from "framer-motion";
import { 
  IconRocket, 
  IconDevices, 
  IconCreditCard, 
  IconRobot, 
  IconChartBar, 
  IconArrowUpRight,
  IconBrandReact,
  IconBrandFirebase,
  IconBrandNextjs,
  IconApi
} from "@tabler/icons-react";

// Definición de los servicios
const services = [
  {
    id: 1,
    icon: <IconRocket size={24} stroke={1.5} />,
    title: "Desarrollo de SaaS",
    description: "Plataformas escalables y de alto rendimiento que automatizan procesos y generan ingresos recurrentes.",
    benefit: "+200% ROI promedio",
    technologies: [<IconBrandReact key="react" size={18} />, <IconBrandNextjs key="next" size={18} />, <IconBrandFirebase key="firebase" size={18} />],
    color: "#5D5FEF", // Morado digital
    cta: "Explorar soluciones",
  },
  {
    id: 2,
    icon: <IconDevices size={24} stroke={1.5} />,
    title: "Aplicaciones Web & Móviles",
    description: "Soluciones multiplataforma con experiencias de usuario excepcionales y alto rendimiento.",
    benefit: "+35% conversión",
    technologies: [<IconBrandReact key="react" size={18} />, <IconBrandNextjs key="next" size={18} />],
    color: "#3D5AFE", // Azul eléctrico
    cta: "Ver proyectos",
  },
  {
    id: 3,
    icon: <IconCreditCard size={24} stroke={1.5} />,
    title: "Integraciones de Pago",
    description: "Implementación de pasarelas de pago seguras y optimizadas para maximizar conversiones.",
    benefit: "+45% en ventas",
    technologies: [<IconApi key="api" size={18} />, <IconBrandFirebase key="firebase" size={18} />],
    color: "#00C853", // Verde éxito
    cta: "Conocer opciones",
  },
  {
    id: 4,
    icon: <IconRobot size={24} stroke={1.5} />,
    title: "Automatización con IA",
    description: "Flujos de trabajo inteligentes que reducen costos operativos y mejoran la eficiencia.",
    benefit: "-70% tiempo operativo",
    technologies: [<IconApi key="api" size={18} />, <IconBrandNextjs key="next" size={18} />],
    color: "#FF6D00", // Naranja energía
    cta: "Descubrir soluciones",
  },
  {
    id: 5,
    icon: <IconChartBar size={24} stroke={1.5} />,
    title: "Optimización de Performance",
    description: "Mejora de velocidad, SEO y experiencia de usuario para aumentar conversiones y retención.",
    benefit: "+85% velocidad",
    technologies: [<IconBrandNextjs key="next" size={18} />, <IconBrandReact key="react" size={18} />],
    color: "#2979FF", // Azul brillante
    cta: "Analizar opciones",
  },
];

// Componente de tarjeta de servicio
const ServiceCard = ({ service, isInView }: { service: typeof services[0], isInView: boolean }) => {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);
  
  // Motion values para efectos de hover
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Efecto de rotación 3D suave
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Efecto de brillo (glow)
  const glowOpacity = useMotionValue(0);
  
  // Manejador de movimiento del mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    // Calcular posición relativa del mouse dentro del elemento
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalizar valores (0-1)
    const normalizedX = x / rect.width;
    const normalizedY = y / rect.height;
    
    // Aplicar efecto de rotación 3D suave (máximo 3 grados)
    rotateX.set((normalizedY - 0.5) * -3);
    rotateY.set((normalizedX - 0.5) * 3);
    
    // Actualizar posición para efecto de brillo
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };
  
  // Manejador de entrada del mouse
  const handleMouseEnter = () => {
    setHovered(true);
    glowOpacity.set(0.15);
  };
  
  // Manejador de salida del mouse
  const handleMouseLeave = () => {
    setHovered(false);
    glowOpacity.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };
  
  // Variantes de animación para la tarjeta
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
  
  return (
    <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
              }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="service-card"
            >
              <Box
                sx={{
          width: "100%",
          height: "100%",
          p: { xs: 3, md: 4 },
          borderRadius: "2xl",
                  display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          background: theme.palette.mode === "dark" 
            ? "rgba(23, 23, 23, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" 
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.04)",
          boxShadow: hovered
            ? theme.palette.mode === "dark"
              ? `0 20px 40px -20px ${alpha(service.color, 0.3)}, 0 0 0 1px ${alpha(service.color, 0.1)}`
              : `0 20px 40px -20px ${alpha(service.color, 0.2)}, 0 0 0 1px ${alpha(service.color, 0.05)}`
            : theme.palette.mode === "dark"
              ? "0 4px 20px rgba(0, 0, 0, 0.2)"
              : "0 4px 20px rgba(0, 0, 0, 0.03)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
                    }}
                  >
        {/* Efecto de brillo en hover */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(
              800px circle at ${mouseX.get() * 100}% ${mouseY.get() * 100}%, 
              ${service.color}10, 
              transparent 40%
            )`,
            opacity: glowOpacity,
            zIndex: 0,
                }}
        />
        
        {/* Borde de acento */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "4px",
            background: service.color,
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.3s ease",
            borderTopLeftRadius: "2xl",
            borderBottomLeftRadius: "2xl",
          }}
        />
        
        {/* Contenido de la tarjeta */}
        <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Cabecera: Icono y título */}
          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2.5 }}>
            <Box
          sx={{
            display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "xl",
                background: alpha(service.color, theme.palette.mode === "dark" ? 0.15 : 0.08),
                color: service.color,
                transition: "all 0.3s ease",
                transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        >
              {service.icon}
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                component="h3"
            sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.25rem", md: "1.35rem" },
                  fontFamily: "var(--font-space-grotesk)",
                  color: hovered ? service.color : "text.primary",
                  transition: "color 0.3s ease",
                  mb: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {service.title}
              </Typography>
              
              {/* Badge de beneficio */}
              <Box
                component={motion.div}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: hovered ? 1 : 0.8 }}
                sx={{
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 100,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  background: alpha(service.color, theme.palette.mode === "dark" ? 0.15 : 0.08),
                  color: service.color,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  alignSelf: "flex-start",
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    width: 5, 
                    height: 5, 
                    borderRadius: "50%", 
                    background: service.color,
                    animation: hovered ? "pulse 1.5s infinite" : "none",
                    "@keyframes pulse": {
                      "0%": { opacity: 0.5 },
                      "50%": { opacity: 1 },
                      "100%": { opacity: 0.5 },
                    }
                  }} 
                />
                {service.benefit}
              </Box>
        </Box>
          </Stack>
          
          {/* Descripción */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mb: 3, 
              lineHeight: 1.6,
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            {service.description}
          </Typography>
          
          {/* Espacio flexible para empujar el footer al fondo */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Footer: Tecnologías y CTA */}
          <Box>
            {/* Tecnologías */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2.5 }}
            >
              {service.technologies.map((tech, index) => (
                <Box
                  key={index}
                  component={motion.div}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: hovered ? 1 : 0.7 }}
                  transition={{ duration: 0.2 }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 28,
                    height: 28,
                    borderRadius: "lg",
                    background: theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.06)" 
                      : "rgba(0, 0, 0, 0.03)",
                    color: "text.secondary",
                    transition: "all 0.2s ease",
                    transform: hovered ? "translateY(-2px)" : "translateY(0)",
                  }}
                >
                  {tech}
    </Box>
              ))}
            </Stack>
            
            {/* CTA */}
            <Button
              component={motion.button}
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              variant="text"
              endIcon={
                <motion.div
                  animate={{ x: hovered ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IconArrowUpRight size={16} />
                </motion.div>
}
              sx={{
                p: 0,
                fontSize: "0.85rem",
                fontWeight: 500,
                color: service.color,
                "&:hover": {
                  background: "transparent",
                },
                "& .MuiButton-endIcon": {
                  ml: 0.5,
                  transition: "transform 0.2s ease",
                },
              }}
            >
              {service.cta}
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export function ServicesSection() {
  const theme = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  // Variantes de animación para el contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  // Variantes de animación para elementos de texto
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };
  
  return (
    <Box 
      component="section" 
      id="servicios"
      sx={{ 
        py: { xs: 12, md: 16 },
        background: theme.palette.mode === "dark" 
          ? "linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(17,17,17,1) 100%)"
          : "linear-gradient(180deg, rgba(250,250,250,1) 0%, rgba(255,255,255,1) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
      ref={ref}
    >
      {/* Fondo decorativo con efecto de malla (mesh gradient) */}
      <Box 
        sx={{ 
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: theme.palette.mode === "dark" ? 0.3 : 0.2,
          background: theme.palette.mode === "dark" 
            ? "radial-gradient(circle at 20% 20%, rgba(93, 95, 239, 0.15), transparent 40%), radial-gradient(circle at 80% 60%, rgba(61, 90, 254, 0.1), transparent 50%), radial-gradient(circle at 40% 80%, rgba(0, 200, 83, 0.05), transparent 30%)"
            : "radial-gradient(circle at 20% 20%, rgba(93, 95, 239, 0.08), transparent 40%), radial-gradient(circle at 80% 60%, rgba(61, 90, 254, 0.05), transparent 50%), radial-gradient(circle at 40% 80%, rgba(0, 200, 83, 0.03), transparent 30%)",
        }}
      />
      
      {/* Líneas decorativas */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.03,
          backgroundImage: `linear-gradient(0deg, ${theme.palette.mode === "dark" ? "#fff" : "#000"} 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.mode === "dark" ? "#fff" : "#000"} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box 
          component={motion.div} 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          sx={{ 
            textAlign: "center",
            mb: { xs: 8, md: 10 },
          }}
        >
          <Typography 
            component={motion.h2}
            variants={textVariants}
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2.25rem", md: "3.25rem" },
              fontFamily: "var(--font-space-grotesk)",
              background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Servicios que impulsan tu negocio digital
          </Typography>
          
          <Typography 
            component={motion.p}
            variants={textVariants}
            variant="h6" 
            color="text.secondary"
            sx={{ 
              maxWidth: "700px",
              mx: "auto",
              mb: 2,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Soluciones tecnológicas de alto impacto diseñadas para maximizar resultados y generar crecimiento sostenible.
          </Typography>
          
          {/* Línea decorativa */}
          <motion.div
            variants={textVariants}
            style={{
              width: "60px",
              height: "4px",
              background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
              margin: "0 auto",
              borderRadius: "2px",
              marginTop: "24px",
            }}
          />
        </Box>
        
        {/* Contenedor de tarjetas */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          flexWrap="wrap"
          spacing={0}
          gap={{ xs: 3, md: 4 }}
          sx={{
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {services.map((service) => (
            <Box
              key={service.id}
              sx={{
                width: { xs: "100%", sm: "calc(50% - 16px)", lg: "calc(33.333% - 22px)" },
                height: { xs: "auto", md: "auto" },
                minHeight: { xs: "auto", md: 340 },
                display: "flex",
              }}
            >
              <ServiceCard service={service} isInView={isInView} />
            </Box>
          ))}
        </Stack>
        
        {/* CTA final */}
        <Box
          component={motion.div}
          variants={textVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 8, md: 10 },
          }}
        >
          <Button
            component={motion.button}
            whileHover={{ 
              scale: 1.03,
              boxShadow: theme.palette.mode === "dark" 
                ? "0 10px 30px rgba(93, 95, 239, 0.3)" 
                : "0 10px 30px rgba(93, 95, 239, 0.2)",
            }}
            whileTap={{ scale: 0.97 }}
            variant="contained"
            size="large"
            href="/contacto"
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 100,
              background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
              boxShadow: theme.palette.mode === "dark" 
                ? "0 8px 20px rgba(93, 95, 239, 0.25)" 
                : "0 8px 20px rgba(93, 95, 239, 0.15)",
              fontSize: "1rem",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Discutamos tu proyecto
          </Button>
        </Box>
      </Container>
    </Box>
  );
}