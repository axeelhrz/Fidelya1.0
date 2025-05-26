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
import { motion } from "framer-motion";
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
        ? "rgba(10, 10, 10, 0.8)" 
        : "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    },
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
        <Box component={Link} href="/" sx={{ textDecoration: "none", color: "text.primary" }}>
          <Box component="span" sx={{ fontFamily: "var(--font-plus-jakarta)", fontWeight: 700, fontSize: "1.5rem" }}>
            axel.dev
          </Box>
        </Box>
        <IconButton edge="end" onClick={handleDrawerToggle} aria-label="close menu">
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
                  fontFamily: "var(--font-plus-jakarta)",
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
          sx={{ borderRadius: 100, px: 4, py: 1.5 }}
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
        transition={{ duration: 0.3 }}
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
            <Box component={Link} href="/" sx={{ 
              textDecoration: "none", 
              color: "text.primary",
              display: "flex",
              alignItems: "center",
            }}>
              <Box 
                component="span" 
                sx={{ 
                  fontFamily: "var(--font-plus-jakarta)", 
                  fontWeight: 700, 
                  fontSize: { xs: "1.5rem", md: "1.75rem" } 
                }}
              >
                axel.dev
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  href={item.href}
                  sx={{ 
                    color: "text.primary",
                    fontFamily: "var(--font-plus-jakarta)",
                    fontWeight: 500,
                    mx: 1,
                  }}
                >
                  {item.name}
                </Button>
              ))}
              <Box sx={{ ml: 1 }}>
                <ThemeToggle />
              </Box>
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
                }}
              >
                Contáctame
              </Button>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}>
              <ThemeToggle />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <IconMenu2 />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Box component="nav">
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
              background: muiTheme.palette.background.default,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      {/* Spacer para compensar la altura del AppBar */}
      <Toolbar sx={{ height: 80 }} />
    </>
  );
}