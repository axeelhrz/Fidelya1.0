'use client'

import React from 'react'
import {
  List,
  ListItemButton,
  ListItemText,
  Box,
  Stack,
  alpha,
  Typography,
  Button,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Import only the specific icons we need
import { SignIn } from '@phosphor-icons/react/dist/ssr/SignIn'
import { RocketLaunch } from '@phosphor-icons/react/dist/ssr/RocketLaunch'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight'
import { Sun } from '@phosphor-icons/react/dist/ssr/Sun'
import { Moon } from '@phosphor-icons/react/dist/ssr/Moon'

// Types
interface NavItem {
  label: string
  path: string
  badge?: 'new' | 'live'
}

interface MobileDrawerContentProps {
  navItems: NavItem[]
  pathname: string
  handleNavigation: (path: string) => void
  profile: any
  getFirstName: () => string | null
  mode: string
  toggleColorMode: () => void
}

// Badge for "new" and "live" labels
const BadgeLabel = ({ children }: { children: React.ReactNode }) => (
  <Box
    component="span"
    sx={{
      padding: '3px 8px',
      borderRadius: '20px',
      fontSize: '0.65rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      background: (theme) => theme.palette.mode === 'light'
        ? alpha(theme.palette.primary.main, 0.1)
        : alpha(theme.palette.primary.main, 0.2),
      color: 'primary.main',
      border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 1,
      letterSpacing: '0.5px',
      marginLeft: '6px',
    }}
  >
    {children}
  </Box>
)

const MobileDrawerContent = ({
  navItems,
  pathname,
  handleNavigation,
  profile,
  getFirstName,
  mode,
  toggleColorMode
}: MobileDrawerContentProps) => {
  const theme = useTheme()

  return (
    <>
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: '12px',
              mb: 1,
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: pathname === item.path
                ? theme.palette.mode === 'light'
                  ? alpha(theme.palette.primary.main, 0.08)
                  : alpha(theme.palette.primary.main, 0.15)
                : 'transparent',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light'
                  ? alpha(theme.palette.primary.main, 0.05)
                  : alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.label}
                  {item.badge && (
                    <BadgeLabel>
                      {item.badge}
                    </BadgeLabel>
                  )}
                </Box>
              }
              sx={{
                '& .MuiTypography-root': {
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: pathname === item.path ? 700 : 600,
                  fontSize: '1rem',
                  letterSpacing: '0.3px',
                  color: pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                },
              }}
            />
          </ListItemButton>
        ))}
        
        {/* Theme Selector in Mobile Menu */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          my: 3, 
          px: 2,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Typography variant="subtitle2" sx={{
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            {mode === 'light' ? <Sun size={16} weight="fill" /> : <Moon size={16} weight="fill" />}
            Tema
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            backgroundColor: theme.palette.mode === 'light'
              ? alpha(theme.palette.background.default, 0.5)
              : alpha(theme.palette.background.default, 0.2),
            borderRadius: '12px',
            padding: '12px 16px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {mode === 'light' ? (
                <Sun size={20} weight="fill" color={theme.palette.primary.main} />
              ) : (
                <Moon size={20} weight="fill" color={theme.palette.primary.main} />
              )}
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {mode === 'light' ? 'Modo claro' : 'Modo oscuro'}
              </Typography>
            </Stack>
            
            <Box
              onClick={toggleColorMode}
              sx={{
                width: '40px',
                height: '24px',
                borderRadius: '12px',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  top: '3px',
                  left: mode === 'light' ? '3px' : '19px',
                  transition: 'left 0.3s ease',
                }}
              />
            </Box>
          </Box>
        </Box>
        
        {/* User Actions in Mobile Menu */}
        <Box sx={{ mt: 2, px: 1 }}>
          {profile ? (
            <>
              {/* User Greeting in Mobile */}
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600,
                  mb: 2,
                  pl: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box 
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.primary.main
                  }}
                >
                  {getFirstName()?.charAt(0).toUpperCase()}
                </Box>
                Hola, {getFirstName()}
              </Typography>
              
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleNavigation('/dashboard')}
                startIcon={<RocketLaunch weight="bold" />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  py: 1,
                  mb: 2,
                }}
              >
                Dashboard
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => handleNavigation('/auth/sign-in')}
                startIcon={<SignIn weight="bold" />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  py: 1,
                  mb: 2,
                }}
              >
                Iniciar sesión
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleNavigation('/auth/sign-up')}
                startIcon={<RocketLaunch weight="bold" />}
                endIcon={<ArrowRight weight="bold" />}
                sx={{
                  borderRadius: '10px',
                  textTransform: 'none',
                  py: 1,
                }}
              >
                Comenzar ahora
              </Button>
            </>
          )}
        </Box>
      </List>
    </>
  )
}

export default MobileDrawerContent