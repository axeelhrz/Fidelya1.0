'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Settings, 
  User, 
  LogOut, 
  Bell, 
  ChevronDown, 
  Shield,
  Activity,
  Moon,
  Sun,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

interface TopbarProps {
  onSearch?: (query: string) => void;
  onCenterChange?: (centerId: string) => void;
}

export default function Topbar({ onSearch, onCenterChange }: TopbarProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'Nueva cita programada', time: '2 min', type: 'info' },
    { id: 2, title: 'Pago pendiente', time: '5 min', type: 'warning' },
    { id: 3, title: 'Sesión completada', time: '10 min', type: 'success' }
  ]);
  
  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detectar estado de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isUserMenuOpen && !target.closest('[data-user-menu]')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevenir múltiples clics
    
    try {
      setIsLoggingOut(true);
      console.log('🔄 Topbar: Iniciando logout...');
      
      // Cerrar el menú inmediatamente
      setIsUserMenuOpen(false);
      
      // Mostrar confirmación al usuario
      const confirmLogout = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
      
      if (!confirmLogout) {
        setIsLoggingOut(false);
        return;
      }
      
      // Llamar a la función logout del contexto
      await logout();
      
      console.log('✅ Topbar: Logout completado');
    } catch (error) {
      console.error('❌ Topbar: Error al cerrar sesión:', error);
      
      // En caso de error, forzar redirección
      alert('Error al cerrar sesión. Redirigiendo...');
      window.location.href = '/login';
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Aquí podrías implementar la lógica para cambiar el tema globalmente
  };

  const centers = [
    { id: 'main', name: 'Sede Principal', location: 'Centro' },
    { id: 'north', name: 'Sede Norte', location: 'Zona Norte' },
    { id: 'south', name: 'Sede Sur', location: 'Zona Sur' }
  ];

  const localTime = format(currentTime, "HH:mm:ss", { locale: es });
  const currentDate = format(currentTime, "dd MMM yyyy", { locale: es });

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          
          {/* Logo y nombre del centro mejorado */}
          <motion.div 
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div style={{ position: 'relative' }}>
              <motion.div 
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)'
                }}
                transition={{ duration: 0.3 }}
              >
                <Activity size={24} color="white" />
              </motion.div>
              <motion.div 
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: isOnline ? '#10B981' : '#EF4444',
                  borderRadius: '50%',
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1C1E21',
                fontFamily: 'Space Grotesk, sans-serif',
                margin: 0,
                lineHeight: 1.2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Centro Psicológico
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontWeight: 500,
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Dashboard Ejecutivo
                </p>
                {isOnline ? (
                  <Wifi size={12} color="#10B981" />
                ) : (
                  <WifiOff size={12} color="#EF4444" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Fecha y hora mejorada */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              border: '1px solid rgba(229, 231, 235, 0.4)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{
                padding: '0.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px'
              }}
            >
              <Calendar size={16} color="white" />
            </motion.div>
            <div style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ 
                fontWeight: 700, 
                color: '#1C1E21', 
                lineHeight: 1.2,
                fontSize: '0.9rem'
              }}>
                {currentDate}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#667eea', 
                fontWeight: 600,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {localTime}
              </div>
            </div>
          </motion.div>

          {/* Selector de sede mejorado */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <motion.div 
              style={{
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <MapPin size={16} color="white" />
            </motion.div>
            <div style={{ position: 'relative' }}>
              <select 
                style={{
                  appearance: 'none',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(229, 231, 235, 0.4)',
                  borderRadius: '16px',
                  padding: '1rem 2.5rem 1rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1C1E21',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                }}
                onChange={(e) => onCenterChange?.(e.target.value)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(229, 231, 235, 0.4)';
                  e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
                }}
              >
                {centers.map(center => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={16} 
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#667eea'
                }} 
              />
            </div>
          </motion.div>

          {/* Buscador mejorado */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ position: 'relative', flex: 1, maxWidth: '380px' }}
          >
            <motion.div 
              style={{
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
              animate={{
                scale: isSearchFocused ? 1.02 : 1,
                y: isSearchFocused ? -2 : 0
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Search 
                size={18} 
                style={{
                  position: 'absolute',
                  left: '1.25rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  transition: 'all 0.3s ease',
                  color: isSearchFocused ? '#667eea' : '#9CA3AF'
                }} 
              />
              <input
                type="text"
                placeholder="Buscar pacientes, sesiones, métricas..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                style={{
                  paddingLeft: '3rem',
                  paddingRight: '1.25rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '16px',
                  border: `2px solid ${isSearchFocused ? '#667eea' : 'rgba(229, 231, 235, 0.4)'}`,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: isSearchFocused 
                    ? '0 8px 32px rgba(102, 126, 234, 0.2), 0 0 0 3px rgba(102, 126, 234, 0.1)' 
                    : '0 4px 16px rgba(0, 0, 0, 0.08)'
                }}
              />
            </motion.div>
          </motion.div>

          {/* Toggle modo oscuro */}
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            style={{
              padding: '1rem',
              borderRadius: '16px',
              background: isDarkMode 
                ? 'linear-gradient(135deg, #1f2937 0%, #374151 100%)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(229, 231, 235, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
            }}
          >
            <motion.div
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {isDarkMode ? (
                <Sun size={20} color="#F59E0B" />
              ) : (
                <Moon size={20} color="#6366F1" />
              )}
            </motion.div>
          </motion.button>

          {/* Notificaciones mejoradas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            style={{ position: 'relative' }}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: 'relative',
                padding: '1rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(229, 231, 235, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              >
                <Bell size={20} color="#667eea" />
              </motion.div>
              {notifications.length > 0 && (
                <motion.div 
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    minWidth: '24px',
                    height: '24px',
                    backgroundColor: '#EF4444',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'white',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {notifications.length}
                  </span>
                </motion.div>
              )}
            </motion.button>
          </motion.div>

          {/* Avatar del usuario mejorado */}
          <div style={{ position: 'relative' }} data-user-menu>
            <motion.button
              onClick={() => !isLoggingOut && setIsUserMenuOpen(!isUserMenuOpen)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: isLoggingOut ? 1 : 1.02 }}
              whileTap={{ scale: isLoggingOut ? 1 : 0.98 }}
              disabled={isLoggingOut}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(229, 231, 235, 0.4)',
                cursor: isLoggingOut ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                opacity: isLoggingOut ? 0.7 : 1
              }}
            >
              <div style={{ position: 'relative' }}>
                <motion.div 
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                  }}
                  whileHover={{ scale: isLoggingOut ? 1 : 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <User size={20} color="white" />
                </motion.div>
                <motion.div 
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#1C1E21',
                  maxWidth: '8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {user?.name?.split(' ')[0] || 'Usuario'}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#667eea',
                  fontWeight: 600,
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {user?.role === 'admin' ? 'CEO' : 'Terapeuta'}
                </div>
              </div>
              <motion.div
                animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDown size={16} color="#9CA3AF" />
              </motion.div>
            </motion.button>

            {/* Dropdown Usuario mejorado */}
            <AnimatePresence>
              {isUserMenuOpen && !isLoggingOut && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '0.75rem',
                    width: '20rem',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: '20px',
                    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(229, 231, 235, 0.4)',
                    padding: '0.75rem 0',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}
                >
                  {/* Header Usuario mejorado */}
                  <div style={{
                    padding: '1.25rem',
                    borderBottom: '1px solid rgba(229, 231, 235, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ position: 'relative' }}>
                        <motion.div 
                          style={{
                            width: '56px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)'
                          }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <User size={28} color="white" />
                        </motion.div>
                        <div style={{
                          position: 'absolute',
                          bottom: '-6px',
                          right: '-6px',
                          width: '20px',
                          height: '20px',
                          backgroundColor: '#10B981',
                          borderRadius: '50%',
                          border: '3px solid white',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#1C1E21',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {user?.name || 'Usuario'}
                        </div>
                        <div style={{
                          fontSize: '0.8rem',
                          color: '#6B7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {user?.email || 'email@ejemplo.com'}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.5rem'
                        }}>
                          <Shield size={14} color="#667eea" />
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#667eea',
                            fontWeight: 600,
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}>
                            {user?.role === 'admin' ? 'CEO & Fundador' : 'Terapeuta Profesional'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Opciones Menú mejoradas */}
                  <div style={{ padding: '0.5rem 0' }}>
                    <motion.button 
                      whileHover={{ x: 6, backgroundColor: 'rgba(102, 126, 234, 0.05)' }}
                      transition={{ duration: 0.2 }}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    >
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                      }}>
                        <Settings size={16} color="white" />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#1C1E21',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Configuración
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Preferencias del sistema
                        </div>
                      </div>
                    </motion.button>
                    
                    <div style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(229, 231, 235, 0.5), transparent)',
                      margin: '0.5rem 1.25rem'
                    }} />
                    
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ x: 6, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                      transition={{ duration: 0.2 }}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                    >
                      <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
                      }}>
                        <LogOut size={16} color="white" />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: '#DC2626',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Cerrar Sesión
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#EF4444',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          Salir del dashboard
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Overlay mejorado */}
      <AnimatePresence>
        {isUserMenuOpen && !isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              zIndex: 40
            }}
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Indicador de logout */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #E5E7EB',
                  borderTop: '4px solid #2563EB',
                  borderRadius: '50%',
                  margin: '0 auto 1rem'
                }}
              />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: '0 0 0.5rem 0',
                fontFamily: 'Inter, sans-serif'
              }}>
                Cerrando Sesión
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Por favor espera...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estilos CSS mejorados */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.05);
          }
        }
        
        @keyframes glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.6);
          }
        }

        @media (max-width: 768px) {
          header > div {
            padding: 0 1rem !important;
            gap: 0.75rem !important;
          }
          
          header > div > div:nth-child(3),
          header > div > div:nth-child(4) {
            display: none !important;
          }
          
          header > div > div:nth-child(5) {
            max-width: 200px !important;
          }
        }
      `}</style>
    </>
  );
}