"use client";

import { Box, Container, Typography, Link as MuiLink, IconButton, Divider, MenuItem, Select, SelectChangeEvent, FormControl, useMediaQuery, useTheme as useMuiTheme } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandX, 
  IconBrandNotion, 
  IconMail, 
  IconWorld 
} from "@tabler/icons-react";
import { useState } from "react";

export function FooterSection() {
  const currentYear = new Date().getFullYear();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [language, setLanguage] = useState('es');
  
  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.2, type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.9 }
  };
  
  const linkVariants = {
    initial: { x: 0 },
    hover: { 
      x: 5,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };
  
  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "/servicios" },
    { name: "Proyectos", href: "/portafolio" },
    { name: "Testimonios", href: "/#testimonios" },
    { name: "Contacto", href: "/contacto" },
  ];
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: { xs: 8, md: 12 },
        background: muiTheme.palette.mode === "dark" 
          ? "linear-gradient(to bottom, rgba(10, 10, 10, 0), rgba(10, 10, 10, 0.8))"
          : "linear-gradient(to bottom, rgba(247, 247, 247, 0), rgba(247, 247, 247, 0.8))",
        borderTop: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box 
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(93, 95, 239, 0.1) 0%, rgba(93, 95, 239, 0) 70%)",
          zIndex: 0,
          opacity: 0.5,
        }}
      />
      
      <Container maxWidth="xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Main footer content */}
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: { xs: 6, md: 8 },
            }}
          >
            {/* Brand Column */}
            <Box sx={{ maxWidth: { xs: "100%", md: "30%" } }}>
              <motion.div variants={itemVariants}>
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 700,
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    mb: 2,
                    background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  axel.dev
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 4, 
                    maxWidth: 300,
                    fontFamily: "var(--font-satoshi)",
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Soluciones digitales a medida
                </Typography>
                
                <Box sx={{ display: "flex", gap: 1.5, mb: 4 }}>
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <IconButton 
                      component="a"
                      href="https://linkedin.com/in/axelhernandez"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: "text.primary",
                        backgroundColor: muiTheme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.05)" 
                          : "rgba(0, 0, 0, 0.05)",
                        "&:hover": {
                          backgroundColor: muiTheme.palette.mode === "dark" 
                            ? "rgba(255, 255, 255, 0.1)" 
                            : "rgba(0, 0, 0, 0.1)",
                        }
                      }}
                      size="small"
                    >
                      <IconBrandLinkedin size={20} stroke={1.5} />
                    </IconButton>
                  </motion.div>
                  
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <IconButton 
                      component="a"
                      href="https://github.com/axelhernandez"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: "text.primary",
                        backgroundColor: muiTheme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.05)" 
                          : "rgba(0, 0, 0, 0.05)",
                        "&:hover": {
                          backgroundColor: muiTheme.palette.mode === "dark" 
                            ? "rgba(255, 255, 255, 0.1)" 
                            : "rgba(0, 0, 0, 0.1)",
                        }
                      }}
                      size="small"
                    >
                      <IconBrandGithub size={20} stroke={1.5} />
                    </IconButton>
                  </motion.div>
                  
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <IconButton 
                      component="a"
                      href="https://twitter.com/axelhernandez"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: "text.primary",
                        backgroundColor: muiTheme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.05)" 
                          : "rgba(0, 0, 0, 0.05)",
                        "&:hover": {
                          backgroundColor: muiTheme.palette.mode === "dark" 
                            ? "rgba(255, 255, 255, 0.1)" 
                            : "rgba(0, 0, 0, 0.1)",
                        }
                      }}
                      size="small"
                    >
                      <IconBrandX size={20} stroke={1.5} />
                    </IconButton>
                  </motion.div>
                  
                  <motion.div
                    variants={iconVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <IconButton 
                      component="a"
                      href="https://notion.so/axelhernandez"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: "text.primary",
                        backgroundColor: muiTheme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.05)" 
                          : "rgba(0, 0, 0, 0.05)",
                        "&:hover": {
                          backgroundColor: muiTheme.palette.mode === "dark" 
                            ? "rgba(255, 255, 255, 0.1)" 
                            : "rgba(0, 0, 0, 0.1)",
                        }
                      }}
                      size="small"
                    >
                      <IconBrandNotion size={20} stroke={1.5} />
                    </IconButton>
                  </motion.div>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormControl 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      minWidth: 100,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 100,
                        backgroundColor: muiTheme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.05)" 
                          : "rgba(0, 0, 0, 0.05)",
                        "& fieldset": {
                          borderColor: "transparent"
                        },
                        "&:hover fieldset": {
                          borderColor: "transparent"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main"
                        }
                      }
                    }}
                  >
                    <Select
                      value={language}
                      onChange={handleLanguageChange}
                      displayEmpty
                      renderValue={(value) => (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconWorld size={16} />
                          <Typography variant="body2" sx={{ textTransform: "uppercase" }}>
                            {value}
                          </Typography>
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            borderRadius: 2,
                            mt: 1,
                            boxShadow: muiTheme.palette.mode === "dark"
                              ? "0 10px 30px rgba(0, 0, 0, 0.5)"
                              : "0 10px 30px rgba(0, 0, 0, 0.1)",
                          }
                        }
                      }}
                    >
                      <MenuItem value="es">Español</MenuItem>
                      <MenuItem value="en">English</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </motion.div>
            </Box>
            
            {/* Middle section with navigation and contact */}
            <Box 
              sx={{ 
                display: "flex", 
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 6, sm: 8, md: 10 },
                flexGrow: 1,
                justifyContent: { xs: "flex-start", md: "space-around" }
              }}
            >
              {/* Navigation Column */}
              <Box>
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontFamily: "var(--font-space-grotesk)",
                      fontWeight: 600,
                      mb: 3,
                      fontSize: "1rem",
                    }}
                  >
                    Navegación
                  </Typography>
                  
                  <Box 
                    component="nav" 
                    sx={{ 
                      display: "flex", 
                      flexDirection: isMobile ? "row" : "column",
                      flexWrap: isMobile ? "wrap" : "nowrap",
                      gap: isMobile ? 3 : 2,
                    }}
                  >
                    {navItems.map((item) => (
                      <motion.div
                        key={item.name}
                        variants={linkVariants}
                        initial="initial"
                        whileHover="hover"
                      >
                        <MuiLink 
                          component={Link} 
                          href={item.href} 
                          underline="none" 
                          color="text.secondary"
                          sx={{ 
                            fontFamily: "var(--font-satoshi)",
                            fontWeight: 400,
                            fontSize: "0.95rem",
                            transition: "color 0.2s ease",
                            "&:hover": {
                              color: "primary.main"
                            }
                          }}
                        >
                          {item.name}
                        </MuiLink>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              </Box>
              
              {/* Contact Column */}
              <Box>
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontFamily: "var(--font-space-grotesk)",
                      fontWeight: 600,
                      mb: 3,
                      fontSize: "1rem",
                    }}
                  >
                    Contacto
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      fontFamily: "var(--font-satoshi)",
                    }}
                  >
                    ¿Tienes un proyecto en mente?
                  </Typography>
                  
                  <motion.div
                    variants={linkVariants}
                    initial="initial"
                    whileHover="hover"
                  >
                    <MuiLink 
                      component={Link} 
                      href="/contacto" 
                      underline="none"
                      sx={{ 
                        display: "inline-flex",
                        alignItems: "center",
                        fontFamily: "var(--font-satoshi)",
                        fontWeight: 500,
                        color: "primary.main",
                        mb: 3,
                        "&:hover": {
                          color: "primary.dark"
                        }
                      }}
                    >
                      Conectemos
                      <Box 
                        component="span" 
                        sx={{ 
                          ml: 0.5,
                          transition: "transform 0.2s ease",
                          display: "inline-block",
                          transform: "translateX(0)",
                        }}
                        className="arrow"
                      >
                        →
                      </Box>
                    </MuiLink>
                  </motion.div>
                  
                  <Box 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <IconMail size={18} style={{ opacity: 0.7 }} />
                    <Typography 
                      variant="body2" 
                      component="a"
                      href="mailto:axel@axel.dev"
                      sx={{ 
                        color: "text.secondary",
                        textDecoration: "none",
                        fontFamily: "var(--font-satoshi)",
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "primary.main"
                        }
                      }}
                    >
                      axel@axel.dev
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </Box>
          
          <Divider 
            sx={{ 
              my: { xs: 4, md: 6 },
              opacity: 0.6,
              background: muiTheme.palette.mode === "dark"
                ? "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)"
                : "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0) 100%)",
            }} 
          />
          
          <motion.div variants={itemVariants}>
            <Box 
              sx={{ 
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontFamily: "var(--font-satoshi)",
                  fontSize: "0.875rem",
                }}
              >
                © {currentYear} Axel Hernández. Todos los derechos reservados.
              </Typography>
              
              <MuiLink 
                component={Link} 
                href="/privacidad" 
                underline="hover" 
                color="text.secondary"
                sx={{ 
                  fontFamily: "var(--font-satoshi)",
                  fontSize: "0.875rem",
                }}
              >
                Política de Privacidad
              </MuiLink>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}