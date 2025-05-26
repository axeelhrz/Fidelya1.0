"use client";

import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Divider } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from "@tabler/icons-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 8,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontFamily: "var(--font-plus-jakarta)",
                  fontWeight: 700,
                  fontSize: "1.75rem",
                  mb: 2,
                }}
              >
                axel.dev
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
                Cada línea de código que escribo tiene un propósito: tu crecimiento.
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton 
                  component={motion.a}
                  href="https://github.com/axelhernandez"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{ color: "text.primary" }}
                >
                  <IconBrandGithub size={20} />
                </IconButton>
                <IconButton 
                  component={motion.a}
                  href="https://linkedin.com/in/axelhernandez"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{ color: "text.primary" }}
                >
                  <IconBrandLinkedin size={20} />
                </IconButton>
                <IconButton 
                  component={motion.a}
                  href="https://twitter.com/axelhernandez"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  sx={{ color: "text.primary" }}
                >
                  <IconBrandTwitter size={20} />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          <Grid>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Navegación
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <MuiLink component={Link} href="/" underline="hover" color="text.secondary">
                    Inicio
                  </MuiLink>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <MuiLink component={Link} href="/servicios" underline="hover" color="text.secondary">
                    Servicios
                  </MuiLink>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <MuiLink component={Link} href="/productos" underline="hover" color="text.secondary">
                    Productos
                  </MuiLink>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <MuiLink component={Link} href="/portafolio" underline="hover" color="text.secondary">
                    Portafolio
                  </MuiLink>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Legal
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <MuiLink component={Link} href="/privacidad" underline="hover" color="text.secondary">
                    Privacidad
                  </MuiLink>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <MuiLink component={Link} href="/terminos" underline="hover" color="text.secondary">
                    Términos
                  </MuiLink>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid>
            <Box 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                Contacto
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                ¿Tienes un proyecto en mente?
              </Typography>
              <MuiLink 
                component={Link} 
                href="/contacto" 
                sx={{ 
                  fontWeight: 500,
                  display: "inline-block",
                  mb: 2,
                }}
              >
                Hablemos →
              </MuiLink>
              <Typography variant="body2" color="text.secondary">
                contacto@axel.dev
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box 
          sx={{ 
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Axel Hernández. Todos los derechos reservados.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Diseñado y desarrollado con ♥ en Argentina
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}