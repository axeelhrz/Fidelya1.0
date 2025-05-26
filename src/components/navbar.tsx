"use client";

import { useState } from "react";
import { 
  AppBar, 
  Toolbar, 
  Container, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  useScrollTrigger,
  useTheme as useMuiTheme
} from "@mui/material";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { name: "Inicio", href: "/" },
  { name: "Servicios", href: "/servicios" },
  { name: "Productos", href: "/productos" },
  { name: "Portafolio", href: "/portafolio" },
  { name: "Contacto", href: "/contacto" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const muiTheme = useMuiTheme();
  
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navbarVariants = {
    initial: { 
      backgroundColor: "rgba(255, 255, 255, 0)",
      boxShadow: "none",
    },
    scrolled: { 
      backgroundColor: muiTheme.palette.mode === "dark" 
        ? "rgba(10, 10, 10, 0.7)" 
        : "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    },
  };

  const logoVariants = {
    initial: { opacity: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const linkVariants = {
    initial: { y: 0 },
    hover: { 
      y: -3,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Box 
          component={Link} 
          href="/" 
          sx={{ 
            textDecoration: "none", 
            color: "text.primary",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box 
            component={motion.span}
            initial="initial"
            whileHover="hover"
            variants={logoVariants}
            sx={{ 
              fontFamily: "var(--font-space-grotesk)", 
              fontWeight: 700, 
              fontSize: "1.5rem",
              background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            axel.dev
          </Box>
        </Box>
        <IconButton 
          edge="end" 
          onClick={handleDrawerToggle} 
          aria-label="close menu"
          component={motion.button}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IconX />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              component={Link} 
              href={item.href}
              sx={{ 
                textAlign: "center",
                py: 2,
              }}
            >
              <ListItemText 
                primary={item.name} 
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontFamily: "var(--font-satoshi)",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
        <Button 
          variant="contained" 
          color="primary"
          component={Link}
          href="/contacto"
          sx={{ 
            borderRadius: 100, 
            px: 4, 
            py: 1.5,
            background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
          }}
        >
          Contáctame
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={0}
        component={motion.header}
        variants={navbarVariants}
        initial="initial"
        animate={trigger ? "scrolled" : "initial"}
        transition={{ duration: 0.4 }}
        className={trigger ? "glass" : ""}
        sx={{ 
          borderBottom: "1px solid",
          borderColor: trigger 
            ? "transparent" 
            : muiTheme.palette.mode === "dark" 
              ? "rgba(255, 255, 255, 0.1)" 
              : "rgba(0, 0, 0, 0.05)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: 80 }}>
            <Box 
              component={Link} 
              href="/" 
              sx={{ 
                textDecoration: "none", 
                color: "text.primary",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box 
                component={motion.span}
                initial="initial"
                whileHover="hover"
                variants={logoVariants}
                sx={{ 
                  fontFamily: "var(--font-space-grotesk)", 
                  fontWeight: 700, 
                  fontSize: { xs: "1.5rem", md: "1.75rem" },
                  background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                axel.dev
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial="initial"
                  whileHover="hover"
                  variants={linkVariants}
                >
                  <Button
                    component={Link}
                    href={item.href}
                    sx={{ 
                      color: "text.primary",
                      fontFamily: "var(--font-satoshi)",
                      fontWeight: 500,
                      mx: 1,
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        width: "0%",
                        height: "2px",
                        backgroundColor: "primary.main",
                        transition: "all 0.3s ease",
                        transform: "translateX(-50%)",
                      },
                      "&:hover::after": {
                        width: "80%",
                      }
                    }}
                  >
                    {item.name}
                  </Button>
                </motion.div>
              ))}
              <Box sx={{ ml: 1 }}>
                <ThemeToggle />
              </Box>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="contained" 
                  color="primary"
                  component={Link}
                  href="/contacto"
                  sx={{ 
                    ml: 2,
                    borderRadius: 100,
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    background: "linear-gradient(90deg, #5D5FEF, #3D5AFE)",
                    boxShadow: "0 4px 15px rgba(93, 95, 239, 0.3)",
                    "&:hover": {
                      boxShadow: "0 8px 25px rgba(93, 95, 239, 0.5)",
                    }
                  }}
                >
                  Contáctame
                </Button>
              </motion.div>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
              <ThemeToggle />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconMenu2 />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <AnimatePresence>
        {mobileOpen && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { 
                boxSizing: "border-box", 
                width: "100%",
                background: muiTheme.palette.mode === "dark"
                  ? "rgba(10, 10, 10, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </AnimatePresence>
      
      {/* Spacer para compensar la altura del AppBar */}
      <Toolbar sx={{ height: 80 }} />
    </>
  );
}