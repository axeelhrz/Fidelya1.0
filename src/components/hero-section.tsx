"use client";

import { useEffect, useRef } from "react";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { IconDownload, IconArrowRight } from "@tabler/icons-react";

// Componente de partículas
function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configurar el canvas para que ocupe toda la pantalla
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Crear partículas
    const particlesArray: Particle[] = [];
    const numberOfParticles = 100;
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(93, 95, 239, ${Math.random() * 0.5 + 0.1})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (canvas && this.x > canvas.width) this.x = 0;
        else if (this.x < 0 && canvas) this.x = canvas.width;
        
        if (canvas && this.y > canvas.height) this.y = 0;
        else if (this.y < 0 && canvas) this.y = canvas.height;
      }
      
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const init = () => {
        for (let i = 0; i < numberOfParticles; i++) {
          particlesArray.push(new Particle());
        }
      };
      
      const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
          particlesArray[i].update();
          particlesArray[i].draw();
        }
        
        // Conectar partículas cercanas con líneas
        connectParticles();
        
        requestAnimationFrame(animate);
      };
      
      const connectParticles = () => {
        if (!ctx) return;
        const maxDistance = 150;
        
        for (let a = 0; a < particlesArray.length; a++) {
          for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
              const opacity = 1 - (distance / maxDistance);
              ctx.strokeStyle = `rgba(93, 95, 239, ${opacity * 0.2})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
              ctx.stroke();
            }
          }
        }
      };
      
      init();
      animate();
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }, []);
    
    return (
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
    );
}

// Badge animado de "Disponible para trabajar"
function AvailabilityBadge() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.5 }}
      sx={{
        position: "absolute",
        top: { xs: 20, md: 40 },
        right: { xs: 20, md: 40 },
        background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
        color: "white",
        py: 1,
        px: 2,
        borderRadius: 100,
        display: "flex",
        alignItems: "center",
        gap: 1,
        boxShadow: "0 4px 15px rgba(93, 95, 239, 0.3)",
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "#4ADE80",
          boxShadow: "0 0 0 rgba(74, 222, 128, 0.4)",
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": {
              boxShadow: "0 0 0 0 rgba(74, 222, 128, 0.4)",
            },
            "70%": {
              boxShadow: "0 0 0 10px rgba(74, 222, 128, 0)",
            },
            "100%": {
              boxShadow: "0 0 0 0 rgba(74, 222, 128, 0)",
            },
          },
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: 0.5,
        }}
      >
        Disponible para proyectos
      </Typography>
    </Box>
  );
}

export function HeroSection() {
  const theme = useTheme();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };
  
  return (
    <Box 
      component="section" 
      ref={ref}
      sx={{ 
        pt: { xs: 10, md: 16 },
        pb: { xs: 16, md: 24 },
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Fondo de partículas */}
      <ParticlesBackground />
      
      {/* Badge de disponibilidad */}
      <AvailabilityBadge />
      
      {/* Fondo decorativo con gradiente */}
      <Box 
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
          opacity: 0.6,
          background: theme.palette.mode === "dark" 
            ? "radial-gradient(circle at 20% 20%, rgba(93, 95, 239, 0.15), transparent 40%), radial-gradient(circle at 80% 80%, rgba(61, 90, 254, 0.1), transparent 30%)"
            : "radial-gradient(circle at 20% 20%, rgba(93, 95, 239, 0.1), transparent 40%), radial-gradient(circle at 80% 80%, rgba(61, 90, 254, 0.05), transparent 30%)",
        }}
      />
      
      <Container maxWidth="lg">
        <motion.div style={{ opacity, y }}>
          <Box 
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ 
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
              maxWidth: { md: "80%", lg: "70%" },
            }}
          >
            {/* Badges */}
            <Box 
              sx={{ 
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 4,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Box 
                component={motion.div}
                variants={badgeVariants}
                className="badge"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔥 Garantía de resultados
              </Box>
              <Box 
                component={motion.div}
                variants={badgeVariants}
                className="badge"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎯 +120% en leads
              </Box>
              <Box 
                component={motion.div}
                variants={badgeVariants}
                className="badge"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Listo en 15 días
              </Box>
            </Box>
            
            {/* Título principal */}
            <Typography 
              component={motion.h1}
              variants={itemVariants}
              variant="h1" 
              sx={{ 
                fontSize: { xs: "2.5rem", sm: "3rem", md: "3.75rem", lg: "4.5rem" },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 3,
                fontFamily: "var(--font-space-grotesk)",
                letterSpacing: "-0.02em",
              }}
              className="text-gradient"
            >
              Desarrollo plataformas que venden más y mejor
            </Typography>
            
            {/* Subtítulo */}
            <Typography 
              component={motion.p}
              variants={itemVariants}
              variant="h4" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                fontWeight: 400,
                mb: 5,
                maxWidth: "90%",
              }}
            >
              Soluciones digitales pensadas para convertir visitantes en clientes.
            </Typography>
            
            {/* Botones CTA */}
            <Box 
              component={motion.div}
              variants={itemVariants}
              sx={{ 
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  href="#servicios"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<IconArrowRight size={20} />}
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontWeight: 500,
                    fontSize: "1rem",
                    background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
                    boxShadow: theme.palette.mode === "dark"
                      ? "0 0 20px rgba(93, 95, 239, 0.4)"
                      : "0 0 20px rgba(93, 95, 239, 0.2)",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Conocé mis servicios
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  component={Link}
                  href="/servicios.pdf"
                  target="_blank"
                  variant="outlined"
                  color="secondary"
                  size="large"
                  startIcon={<IconDownload size={20} />}
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontWeight: 500,
                    fontSize: "1rem",
                    borderWidth: 2,
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Descargar PDF
                </Button>
              </motion.div>
            </Box>
            
            {/* Contador animado */}
            <Box
              component={motion.div}
              variants={itemVariants}
              sx={{
                display: "flex",
                gap: { xs: 3, md: 6 },
                mt: 8,
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Box>
                <Typography
                  variant="h3"
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1 }}
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  +50K
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Líneas de código
                </Typography>
              </Box>
              
              <Box>
                <Typography
                  variant="h3"
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  +30
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Clientes satisfechos
                </Typography>
              </Box>
              
              <Box>
                <Typography
                  variant="h3"
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.4 }}
                  sx={{
                    fontWeight: 700,
                    color: "primary.main",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  +120%
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Aumento en conversiones
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}