"use client";

import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconDownload, IconArrowRight } from "@tabler/icons-react";

export function HeroSection() {
  const theme = useTheme();
  
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
      sx={{ 
        pt: { xs: 8, md: 12 },
        pb: { xs: 12, md: 16 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo decorativo */}
      <Box 
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.5,
          background: theme.palette.mode === "dark" 
            ? "radial-gradient(circle at 20% 20%, rgba(0, 112, 243, 0.15), transparent 40%)"
            : "radial-gradient(circle at 20% 20%, rgba(0, 112, 243, 0.1), transparent 40%)",
        }}
      />
      
      <Container maxWidth="lg">
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
            >
              🔥 Garantía de resultados
            </Box>
            <Box 
              component={motion.div}
              variants={badgeVariants}
              className="badge"
            >
              🎯 +120% en leads
            </Box>
            <Box 
              component={motion.div}
              variants={badgeVariants}
              className="badge"
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
              background: theme.palette.mode === "dark"
                ? "linear-gradient(90deg, #FFFFFF 0%, #BBBBBB 100%)"
                : "linear-gradient(90deg, #000000 0%, #333333 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
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
                boxShadow: theme.palette.mode === "dark"
                  ? "0 0 20px rgba(0, 112, 243, 0.4)"
                  : "0 0 20px rgba(0, 112, 243, 0.2)",
              }}
            >
              Conocé mis servicios
            </Button>
            
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
              }}
            >
              Descargar PDF
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}