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
import { motion, useInView } from "framer-motion";
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
    icon: <IconRocket size={32} />,
    title: "Desarrollo de SaaS",
    description: "Plataformas escalables y de alto rendimiento que automatizan procesos y generan ingresos recurrentes.",
    benefit: "+200% ROI promedio",
    technologies: [<IconBrandReact key="react" />, <IconBrandNextjs key="next" />, <IconBrandFirebase key="firebase" />],
    color: "#5D5FEF", // Morado digital
  },
  {
    id: 2,
    icon: <IconDevices size={32} />,
    title: "Aplicaciones Web & Móviles",
    description: "Soluciones multiplataforma con experiencias de usuario excepcionales y alto rendimiento.",
    benefit: "+35% conversión",
    technologies: [<IconBrandReact key="react" />, <IconBrandNextjs key="next" />],
    color: "#3D5AFE", // Azul eléctrico
  },
  {
    id: 3,
    icon: <IconCreditCard size={32} />,
    title: "Integraciones de Pago",
    description: "Implementación de pasarelas de pago seguras y optimizadas para maximizar conversiones.",
    benefit: "+45% en ventas",
    technologies: [<IconApi key="api" />, <IconBrandFirebase key="firebase" />],
    color: "#00C853", // Verde éxito
  },
  {
    id: 4,
    icon: <IconRobot size={32} />,
    title: "Automatización con IA",
    description: "Flujos de trabajo inteligentes que reducen costos operativos y mejoran la eficiencia.",
    benefit: "-70% tiempo operativo",
    technologies: [<IconApi key="api" />, <IconBrandNextjs key="next" />],
    color: "#FF6D00", // Naranja energía
  },
  {
    id: 5,
    icon: <IconChartBar size={32} />,
    title: "Optimización de Performance",
    description: "Mejora de velocidad, SEO y experiencia de usuario para aumentar conversiones y retención.",
    benefit: "+85% velocidad",
    technologies: [<IconBrandNextjs key="next" />, <IconBrandReact key="react" />],
    color: "#2979FF", // Azul brillante
  },
];

export function ServicesSection() {
  const theme = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };
  
  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeOut", repeat: Infinity, repeatType: "reverse" as const }
    }
  };
  
  const techBadgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
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
                  position: "relative",
        overflow: "hidden",
                }}
      ref={ref}
              >
      {/* Fondo decorativo */}
      <Box 
                    sx={{ 
                      position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.4,
          background: theme.palette.mode === "dark" 
            ? "radial-gradient(circle at 80% 20%, rgba(93, 95, 239, 0.15), transparent 40%), radial-gradient(circle at 20% 80%, rgba(61, 90, 254, 0.1), transparent 30%)"
            : "radial-gradient(circle at 80% 20%, rgba(93, 95, 239, 0.1), transparent 40%), radial-gradient(circle at 20% 80%, rgba(61, 90, 254, 0.05), transparent 30%)",
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
            className="text-gradient"
                >
            Servicios que impulsan tu negocio digital
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
            Soluciones tecnológicas de alto impacto diseñadas para maximizar resultados y generar crecimiento sostenible.
          </Typography>
              </Box>
        <Box 
          sx={{ 
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 3, md: 4 },
            justifyContent: "center",
          }}
        >
          {services.map((service) => (
            <Box
              key={service.id}
              component={motion.div}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover="hover"
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              sx={{
                width: { xs: "100%", sm: "calc(50% - 16px)", lg: "calc(33.333% - 22px)" },
                height: { xs: "auto", md: 360 },
                p: 4,
                borderRadius: 6,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                background: theme.palette.mode === "dark" 
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.6),
                backdropFilter: "blur(10px)",
                border: "1px solid",
                borderColor: theme.palette.mode === "dark" 
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
                boxShadow: hoveredCard === service.id
                  ? theme.palette.mode === "dark"
                    ? `0 20px 40px ${alpha(service.color, 0.2)}`
                    : `0 20px 40px ${alpha(service.color, 0.1)}`
                  : "none",
              }}
              className="glass"
            >
              {/* Círculo decorativo de fondo */}
              <Box
                component={motion.div}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: hoveredCard === service.id ? 1 : 0, 
                  opacity: hoveredCard === service.id ? 0.05 : 0 
                }}
                transition={{ duration: 0.5 }}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: service.color,
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
              />
              
              {/* Icono */}
              <Box
                component={motion.div}
                variants={iconVariants}
                animate={hoveredCard === service.id ? "hover" : "visible"}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: alpha(service.color, theme.palette.mode === "dark" ? 0.2 : 0.1),
                  color: service.color,
                  mb: 3,
                }}
              >
                {service.icon}
    </Box>
              
              {/* Badge de beneficio */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 100,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  background: alpha(service.color, theme.palette.mode === "dark" ? 0.2 : 0.1),
                  color: service.color,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: "50%", 
                    background: service.color 
                  }} 
                />
                {service.benefit}
              </Box>
              
              {/* Título */}
              <Typography
                variant="h5"
                component="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: "var(--font-space-grotesk)",
                  color: hoveredCard === service.id ? service.color : "text.primary",
                  transition: "color 0.3s ease",
                }}
              >
                {service.title}
              </Typography>
              
              {/* Descripción */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 4, lineHeight: 1.7 }}
              >
                {service.description}
              </Typography>
              
              {/* Tecnologías */}
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: "auto", mb: 3 }}
              >
                {service.technologies.map((tech, index) => (
                  <Box
                    key={index}
                    component={motion.div}
                    variants={techBadgeVariants}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: theme.palette.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.1)" 
                        : "rgba(0, 0, 0, 0.05)",
                      color: "text.secondary",
                    }}
                  >
                    {tech}
                  </Box>
                ))}
              </Stack>
              
              {/* CTA */}
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="text"
                color="primary"
                endIcon={<IconArrowUpRight size={18} />}
                sx={{
                  alignSelf: "flex-start",
                  p: 0,
                  "&:hover": {
                    background: "transparent",
                    color: service.color,
                  },
                  color: hoveredCard === service.id ? service.color : "primary.main",
                  transition: "color 0.3s ease",
                }}
              >
                Saber más
              </Button>
            </Box>
          ))}
        </Box>
        
        {/* CTA final */}
        <Box
          component={motion.div}
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 8,
          }}
        >
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            color="primary"
            size="large"
            href="/contacto"
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 100,
              background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
              boxShadow: "0 10px 20px rgba(93, 95, 239, 0.3)",
            }}
          >
            Discutamos tu proyecto
          </Button>
        </Box>
      </Container>
    </Box>
  );
}