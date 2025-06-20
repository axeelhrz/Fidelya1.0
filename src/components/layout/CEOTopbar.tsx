'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import {
  Search,
  BusinessCenter,
  Psychology,
  Notifications,
  Settings,
  AccountCircle,
  LocationOn,
  Schedule,
  Public,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/context/AuthContext';

interface CEOTopbarProps {
  onModeToggle: () => void;
  currentMode: 'admin' | 'therapist';
  onCenterChange: (centerId: string) => void;
  selectedCenter: string;
}

export default function CEOTopbar({ 
  onModeToggle, 
  currentMode, 
  onCenterChange, 
  selectedCenter 
}: CEOTopbarProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      local: format(now, "EEEE, dd 'de' MMMM 'de' yyyy - HH:mm", { locale: es }),
      utc: format(now, "HH:mm 'UTC'")
    };
  };

  const { local, utc } = getCurrentDateTime();

  // Sample centers - in real app, this would come from user's accessible centers
  const availableCenters = [
    { id: 'center-1', name: 'Centro Principal', location: 'Madrid' },
    { id: 'center-2', name: 'Sucursal Norte', location: 'Barcelona' },
    { id: 'center-3', name: 'Clínica Sur', location: 'Valencia' },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: theme.palette.mode === 'dark' 
          ? 'rgba(26, 29, 41, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        color: theme.palette.text.primary,
      }}
    >
      <Toolbar sx={{ minHeight: '80px !important', px: 3 }}>
        {/* Left Section - Date & Time */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                fontFamily: '"Neris", sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Schedule sx={{ fontSize: 20, color: 'primary.main' }} />
              {local}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 0.5
              }}
            >
              <Public sx={{ fontSize: 14 }} />
              {utc}
            </Typography>
          </Box>
        </Box>

        {/* Center Section - Center Selector & Search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flex: 1 }}>
          {/* Center Selector */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Centro / Unidad</InputLabel>
            <Select
              value={selectedCenter}
              onChange={(e) => onCenterChange(e.target.value)}
              label="Centro / Unidad"
              startAdornment={
                <InputAdornment position="start">
                  <LocationOn sx={{ fontSize: 20, color: 'primary.main' }} />
                </InputAdornment>
              }
              sx={{
                borderRadius: 3,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                },
              }}
            >
              {availableCenters.map((center) => (
                <MenuItem key={center.id} value={center.id}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {center.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {center.location}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Global Search */}
          <TextField
            size="small"
            placeholder="Buscar pacientes, sesiones, alertas..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ 
              minWidth: 350,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                background: alpha(theme.palette.background.paper, 0.8),
                '& fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover fieldset': {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Right Section - Mode Toggle & Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Mode Toggle */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: 3,
              p: 1,
            }}
          >
            <Tooltip title="Cambiar entre modo Administrador y Terapeuta">
              <FormControlLabel
                control={
                  <Switch
                    checked={currentMode === 'admin'}
                    onChange={onModeToggle}
                    size="small"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentMode === 'admin' ? (
                      <>
                        <BusinessCenter sx={{ fontSize: 18, color: 'primary.main' }} />
                        <Typography variant="caption" fontWeight={600}>
                          Modo CEO
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Psychology sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="caption" fontWeight={600}>
                          Modo Terapeuta
                        </Typography>
                      </>
                    )}
                  </Box>
                }
                sx={{ m: 0 }}
              />
            </Tooltip>
          </Box>

          {/* Status Indicator */}
          <Chip
            label={currentMode === 'admin' ? 'CEO Dashboard' : 'Vista Clínica'}
            size="small"
            color={currentMode === 'admin' ? 'primary' : 'secondary'}
            sx={{
              fontWeight: 600,
              fontFamily: '"Neris", sans-serif',
            }}
          />

          {/* Profile Menu */}
          <Tooltip title="Perfil y configuración">
            <IconButton
              onClick={handleProfileClick}
              sx={{
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <Avatar
                src={user?.profileImage}
                sx={{ 
                  width: 32, 
                  height: 32,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              >
                {user?.displayName?.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                borderRadius: 3,
                mt: 1,
                minWidth: 200,
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #fafbff 100%)',
                boxShadow: theme.shadows[8],
              }
            }}
          >
            <MenuItem onClick={handleProfileClose}>
              <AccountCircle sx={{ mr: 2, color: 'primary.main' }} />
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <Settings sx={{ mr: 2, color: 'info.main' }} />
              Configuración
            </MenuItem>
            <MenuItem onClick={handleProfileClose}>
              <Notifications sx={{ mr: 2, color: 'warning.main' }} />
              Notificaciones
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
