"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Box,
  Chip
} from "@mui/material"
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Schedule as ScheduleIcon,
  Restaurant as RestaurantIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Language as LanguageIcon
} from "@mui/icons-material"
import { supabase } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface NavigationItem {
  name: string
  href: string
  icon: React.ReactNode
}

const navigation: NavigationItem[] = [
  { name: "Inicio", href: "/dashboard", icon: <HomeIcon /> },
  { name: "Hacer Pedido", href: "/pedidos/nuevo", icon: <ShoppingCartIcon /> },
  { name: "Reagendar", href: "/pedidos/reagendar", icon: <ScheduleIcon /> },
  { name: "Menú", href: "/menu", icon: <RestaurantIcon /> },
  { name: "Mis Datos", href: "/perfil", icon: <PersonIcon /> },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { toast } = useToast()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('es')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getCurrentUser()
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
      })
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar la sesión.",
      })
    }
    handleUserMenuClose()
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    handleUserMenuClose()
  }

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
    handleUserMenuClose()
  }

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const linkVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  const drawerVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      x: -300,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  }

  const isActive = (href: string) => pathname === href

  const NavLink = ({ item, mobile = false }: { item: NavigationItem; mobile?: boolean }) => {
    const active = isActive(item.href)
    
    return (
      <motion.div
        variants={linkVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link href={item.href} passHref>
          <Button
            component="a"
            onClick={mobile ? handleDrawerToggle : undefined}
            sx={{
              color: active ? 'primary.main' : 'text.primary',
              fontWeight: active ? 600 : 500,
              fontSize: '0.95rem',
              textTransform: 'none',
              px: 3,
              py: 1.5,
              borderRadius: 3,
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.15)',
              },
              '&::after': active ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60%',
                height: '3px',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                borderRadius: '2px',
                animation: 'shimmer 2s ease-in-out infinite',
              } : {},
              '@keyframes shimmer': {
                '0%, 100%': { opacity: 0.8 },
                '50%': { opacity: 1 }
              }
            }}
            startIcon={mobile ? item.icon : undefined}
          >
            {item.name}
          </Button>
        </Link>
      </motion.div>
    )
  }

  const MobileDrawer = () => (
    <Drawer
      variant="temporary"
      anchor="left"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(59, 130, 246, 0.1)',
        }
      }}
    >
      <motion.div
        variants={drawerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px'
              }}
            >
              Casino Pedidos
            </Typography>
            <IconButton onClick={handleDrawerToggle} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <List sx={{ px: 2, py: 3 }}>
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                component={Link}
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActive(item.href) ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(59, 130, 246, 0.12)',
                    transform: 'translateX(8px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.href) ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: isActive(item.href) ? 600 : 500,
                      color: isActive(item.href) ? 'primary.main' : 'text.primary',
                    }
                  }}
                />
                {isActive(item.href) && (
                  <Chip
                    size="small"
                    label="Activo"
                    sx={{
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: 20
                    }}
                  />
                )}
              </ListItem>
            </motion.div>
          ))}
        </List>

        <Divider sx={{ mx: 2, borderColor: 'rgba(59, 130, 246, 0.1)' }} />

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: 'error.main',
              '&:hover': {
                borderColor: 'error.main',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
              }
            }}
          >
            Cerrar Sesión
          </Button>
        </Box>
      </motion.div>
    </Drawer>
  )

  return (
    <>
      <motion.div
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Toolbar sx={{ px: { xs: 2, sm: 4 }, py: 1 }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    mr: 2,
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            )}

            {/* Logo */}
            <motion.div variants={logoVariants}>
              <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  Casino Pedidos
                </Typography>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: 4 }}>
                <motion.div
                  style={{ display: 'flex', gap: '8px' }}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {navigation.map((item) => (
                    <NavLink key={item.name} item={item} />
                  ))}
                </motion.div>
              </Box>
            )}

            {/* User Menu */}
            <Box sx={{ ml: 'auto' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{
                    p: 0.5,
                    border: '2px solid transparent',
                    background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #3b82f6, #8b5cf6) border-box',
                    borderRadius: '50%',
                    '&:hover': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </motion.div>

              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                    minWidth: 200
                  }
                }}
              >
                <MenuItem onClick={toggleDarkMode} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
                  <ListItemIcon>
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  </ListItemIcon>
                  <ListItemText>
                    {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
                  </ListItemText>
                </MenuItem>

                <MenuItem onClick={toggleLanguage} sx={{ borderRadius: 2, mx: 1, my: 0.5 }}>
                  <ListItemIcon>
                    <LanguageIcon />
                  </ListItemIcon>
                  <ListItemText>
                    {language === 'es' ? 'English' : 'Español'}
                  </ListItemText>
                </MenuItem>

                <Divider sx={{ my: 1, borderColor: 'rgba(59, 130, 246, 0.1)' }} />

                <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, mx: 1, my: 0.5, color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText>
                    Cerrar Sesión
                  </ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && <MobileDrawer />}
      </AnimatePresence>
    </>
  )
}