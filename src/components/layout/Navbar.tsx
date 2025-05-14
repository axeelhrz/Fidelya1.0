'use client';

import { useState } from 'react';
import { AppBar, Toolbar, Container, Box, IconButton, Drawer, List, ListItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import Button from '@/components/ui/Button';

const navItems = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Examples', href: '/#examples' },
  { label: 'Pricing', href: '/#pricing' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="fixed" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(16, 16, 16, 0.8)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Logo />

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
            {navItems.map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link 
                  href={item.href}
                  className="text-gray-300 hover:text-white font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button variant="outlined" color="primary">
              Log In
            </Button>
            <Button variant="contained" color="secondary">
              Try Free
            </Button>
          </Box>

          {/* Mobile Navigation Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ 
          sx: { 
            width: '100%', 
            maxWidth: '300px',
            backgroundColor: '#101010',
            color: 'white'
          } 
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size="sm" />
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <Link 
                href={item.href}
                className="w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={handleDrawerToggle}
              >
                {item.label}
              </Link>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: 2 }}>
            <Box sx={{ p: 2, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button variant="outlined" color="primary" fullWidth>
                Log In
              </Button>
              <Button variant="contained" color="secondary" fullWidth>
                Try Free
              </Button>
            </Box>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;