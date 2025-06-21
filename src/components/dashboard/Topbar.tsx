'use client';

import React, { useState } from 'react';
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
  Menu,
  X,
  Shield,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TopbarProps {
  onSearch?: (query: string) => void;
  onCenterChange?: (centerId: string) => void;
}

export default function Topbar({ onSearch, onCenterChange }: TopbarProps) {
  // Usuario mock para desarrollo
  const mockUser = {
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@centropsicologico.com',
    role: 'admin',
    avatar: null
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const currentDate = new Date();
  const localTime = format(currentDate, "dd MMM", { locale: es });
  const currentTime = format(currentDate, "HH:mm");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setIsUserMenuOpen(false);
  };

  const centers = [
    { id: 'main', name: 'Sede Principal', location: 'Centro' },
    { id: 'north', name: 'Sede Norte', location: 'Zona Norte' },
    { id: 'south', name: 'Sede Sur', location: 'Zona Sur' }
  ];

  // Estilos CSS-in-JS
  const styles = {
    header: {
      position: 'sticky' as const,
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '4rem',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    logoIcon: {
      position: 'relative' as const,
    },
    logoIconInner: {
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    statusDot: {
      position: 'absolute' as const,
      top: '-0.25rem',
      right: '-0.25rem',
      width: '0.75rem',
      height: '0.75rem',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      border: '2px solid white',
    },
    logoText: {
      display: 'none',
    },
    logoTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#111827',
      fontFamily: 'Space Grotesk, sans-serif',
      margin: 0,
    },
    logoSubtitle: {
      fontSize: '0.75rem',
      color: '#6b7280',
      fontWeight: '500',
      margin: 0,
    },
    centerInfo: {
      display: 'none',
      alignItems: 'center',
      gap: '2rem',
    },
    dateTimeCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem 1rem',
      backgroundColor: 'rgba(249, 250, 251, 0.8)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(229, 231, 235, 0.6)',
    },
    dateTimeText: {
      fontSize: '0.875rem',
    },
    dateTimeDate: {
      fontWeight: '600',
      color: '#111827',
      margin: 0,
    },
    dateTimeTime: {
      fontSize: '0.75rem',
      color: '#2563eb',
      fontWeight: '500',
      margin: 0,
    },
    centerSelector: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    centerIcon: {
      padding: '0.5rem',
      backgroundColor: 'rgba(249, 250, 251, 0.8)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(229, 231, 235, 0.6)',
    },
    selectWrapper: {
      position: 'relative' as const,
    },
    select: {
      appearance: 'none' as const,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(229, 231, 235, 0.6)',
      borderRadius: '0.75rem',
      padding: '0.5rem 1rem',
      paddingRight: '2rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#111827',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    selectArrow: {
      position: 'absolute' as const,
      right: '0.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const,
      color: '#9ca3af',
    },
    rightControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    searchContainer: {
      position: 'relative' as const,
      display: 'none',
    },
    searchWrapper: {
      position: 'relative' as const,
      transition: 'all 0.3s ease',
    },
    searchIcon: {
      position: 'absolute' as const,
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      transition: 'all 0.2s ease',
    },
    searchInput: {
      paddingLeft: '2.5rem',
      paddingRight: '1rem',
      paddingTop: '0.625rem',
      paddingBottom: '0.625rem',
      width: '20rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(229, 231, 235, 0.6)',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    notificationButton: {
      position: 'relative' as const,
      padding: '0.625rem',
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(229, 231, 235, 0.6)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    notificationBadge: {
      position: 'absolute' as const,
      top: '-0.25rem',
      right: '-0.25rem',
      width: '1.25rem',
      height: '1.25rem',
      backgroundColor: '#ef4444',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationBadgeText: {
      fontSize: '0.75rem',
      fontWeight: '600',
      color: 'white',
    },
    userMenuButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.5rem',
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(229, 231, 235, 0.6)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    userAvatar: {
      position: 'relative' as const,
    },
    userAvatarInner: {
      width: '2rem',
      height: '2rem',
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    userAvatarStatus: {
      position: 'absolute' as const,
      bottom: '-0.125rem',
      right: '-0.125rem',
      width: '0.75rem',
      height: '0.75rem',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      border: '2px solid white',
    },
    userInfo: {
      display: 'none',
      textAlign: 'left' as const,
    },
    userName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#111827',
      maxWidth: '8rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
      margin: 0,
    },
    userRole: {
      fontSize: '0.75rem',
      color: '#2563eb',
      fontWeight: '500',
      margin: 0,
    },
    chevron: {
      transition: 'transform 0.2s ease',
      color: '#9ca3af',
    },
    dropdown: {
      position: 'absolute' as const,
      right: 0,
      marginTop: '0.5rem',
      width: '18rem',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(229, 231, 235, 0.6)',
      padding: '0.5rem 0',
      zIndex: 50,
      overflow: 'hidden',
    },
    dropdownHeader: {
      padding: '1rem',
      borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
    },
    dropdownUserInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    },
    dropdownAvatar: {
      width: '3rem',
      height: '3rem',
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
    },
    dropdownAvatarStatus: {
      position: 'absolute' as const,
      bottom: '-0.25rem',
      right: '-0.25rem',
      width: '1rem',
      height: '1rem',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      border: '2px solid white',
    },
    dropdownUserDetails: {
      flex: 1,
      minWidth: 0,
    },
    dropdownUserName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#111827',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
      margin: 0,
    },
    dropdownUserEmail: {
      fontSize: '0.75rem',
      color: '#6b7280',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
      margin: 0,
    },
    dropdownUserRoleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      marginTop: '0.25rem',
    },
    dropdownUserRole: {
      fontSize: '0.75rem',
      color: '#2563eb',
      fontWeight: '500',
    },
    dropdownMenu: {
      padding: '0.25rem 0',
    },
    dropdownMenuItem: {
      width: '100%',
      padding: '0.75rem 1rem',
      textAlign: 'left' as const,
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.15s ease',
      outline: 'none',
    },
    dropdownMenuIcon: {
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'all 0.15s ease',
    },
    dropdownMenuText: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#111827',
      margin: 0,
    },
    dropdownMenuSubtext: {
      fontSize: '0.75rem',
      color: '#6b7280',
      margin: 0,
    },
    divider: {
      height: '1px',
      backgroundColor: '#f3f4f6',
      margin: '0.25rem 1rem',
    },
    mobileMenuButton: {
      display: 'none',
      padding: '0.625rem',
      borderRadius: '0.75rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      border: '1px solid rgba(229, 231, 235, 0.6)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    mobileMenu: {
      display: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    },
    mobileMenuContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    mobileSearchContainer: {
      position: 'relative' as const,
    },
    mobileSearchIcon: {
      position: 'absolute' as const,
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
    },
    mobileSearchInput: {
      paddingLeft: '2.5rem',
      paddingRight: '1rem',
      paddingTop: '0.625rem',
      paddingBottom: '0.625rem',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(229, 231, 235, 0.6)',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
      outline: 'none',
    },
    mobileInfoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
    },
    mobileInfoCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      backgroundColor: 'rgba(249, 250, 251, 0.8)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(229, 231, 235, 0.6)',
    },
    mobileSelectWrapper: {
      position: 'relative' as const,
      flex: 1,
    },
    mobileSelect: {
      appearance: 'none' as const,
      backgroundColor: 'transparent',
      width: '100%',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#111827',
      cursor: 'pointer',
      paddingRight: '1rem',
      outline: 'none',
      border: 'none',
    },
    mobileSelectArrow: {
      position: 'absolute' as const,
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none' as const,
      color: '#9ca3af',
    },
    overlay: {
      position: 'fixed' as const,
      inset: 0,
      zIndex: 40,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(4px)',
    },
  };

  // Media queries usando CSS-in-JS
  const mediaQueries = {
    sm: '@media (min-width: 640px)',
    md: '@media (min-width: 768px)',
    lg: '@media (min-width: 1024px)',
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={styles.header}
      >
        <div style={styles.container}>
          <div style={styles.headerContent}>
            
            {/* Logo y Branding */}
            <motion.div 
              style={styles.logoContainer}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div style={styles.logoIcon}>
                <div style={styles.logoIconInner}>
                  <Activity size={20} color="white" />
                </div>
                <div style={styles.statusDot} />
              </div>
              <div style={{
                ...styles.logoText,
                display: window.innerWidth >= 640 ? 'block' : 'none'
              }}>
                <h1 style={styles.logoTitle}>Centro Psicológico</h1>
                <p style={styles.logoSubtitle}>Dashboard Ejecutivo</p>
              </div>
            </motion.div>

            {/* Información Central - Desktop */}
            <div style={{
              ...styles.centerInfo,
              display: window.innerWidth >= 1024 ? 'flex' : 'none'
            }}>
              
              {/* Fecha y Hora */}
              <motion.div 
                style={styles.dateTimeCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Calendar size={16} color="#2563eb" />
                <div style={styles.dateTimeText}>
                  <div style={styles.dateTimeDate}>{localTime}</div>
                  <div style={styles.dateTimeTime}>{currentTime}</div>
                </div>
              </motion.div>
              
              {/* Selector de Centro */}
              <motion.div 
                style={styles.centerSelector}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div style={styles.centerIcon}>
                  <MapPin size={16} color="#2563eb" />
                </div>
                <div style={styles.selectWrapper}>
                  <select 
                    style={{
                      ...styles.select,
                      ':focus': {
                        borderColor: '#2563eb',
                        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
                      }
                    }}
                    onChange={(e) => onCenterChange?.(e.target.value)}
                  >
                    {centers.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={styles.selectArrow} />
                </div>
              </motion.div>
            </div>

            {/* Controles Derecha */}
            <div style={styles.rightControls}>
              
              {/* Buscador - Desktop */}
              <motion.div 
                style={{
                  ...styles.searchContainer,
                  display: window.innerWidth >= 768 ? 'block' : 'none'
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div style={{
                  ...styles.searchWrapper,
                  transform: isSearchFocused ? 'scale(1.05)' : 'scale(1)'
                }}>
                  <Search 
                    size={16} 
                    style={{
                      ...styles.searchIcon,
                      color: isSearchFocused ? '#2563eb' : '#9ca3af'
                    }} 
                  />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    style={{
                      ...styles.searchInput,
                      borderColor: isSearchFocused ? '#2563eb' : 'rgba(229, 231, 235, 0.6)',
                      boxShadow: isSearchFocused ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none'
                    }}
                  />
                </div>
              </motion.div>

              {/* Notificaciones */}
              <motion.button 
                style={{
                  ...styles.notificationButton,
                  ':hover': {
                    backgroundColor: 'rgba(249, 250, 251, 0.8)',
                    borderColor: 'rgba(209, 213, 219, 0.6)',
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Bell size={20} color="#4b5563" />
                <div style={styles.notificationBadge}>
                  <span style={styles.notificationBadgeText}>3</span>
                </div>
              </motion.button>

              {/* Menú Usuario */}
              <div style={{ position: 'relative' }}>
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{
                    ...styles.userMenuButton,
                    ':hover': {
                      backgroundColor: 'rgba(249, 250, 251, 0.8)',
                      borderColor: 'rgba(209, 213, 219, 0.6)',
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div style={styles.userAvatar}>
                    <div style={styles.userAvatarInner}>
                      <User size={16} color="white" />
                    </div>
                    <div style={styles.userAvatarStatus} />
                  </div>
                  <div style={{
                    ...styles.userInfo,
                    display: window.innerWidth >= 768 ? 'block' : 'none'
                  }}>
                    <div style={styles.userName}>
                      {mockUser.name.split(' ')[0]}
                    </div>
                    <div style={styles.userRole}>CEO</div>
                  </div>
                  <ChevronDown 
                    size={16} 
                    style={{
                      ...styles.chevron,
                      transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
                </motion.button>

                {/* Dropdown Usuario */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                      style={styles.dropdown}
                    >
                      {/* Header Usuario */}
                      <div style={styles.dropdownHeader}>
                        <div style={styles.dropdownUserInfo}>
                          <div style={styles.dropdownAvatar}>
                            <User size={24} color="white" />
                            <div style={styles.dropdownAvatarStatus} />
                          </div>
                          <div style={styles.dropdownUserDetails}>
                            <div style={styles.dropdownUserName}>
                              {mockUser.name}
                            </div>
                            <div style={styles.dropdownUserEmail}>
                              {mockUser.email}
                            </div>
                            <div style={styles.dropdownUserRoleContainer}>
                              <Shield size={12} color="#2563eb" />
                              <span style={styles.dropdownUserRole}>CEO & Fundador</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Opciones Menú */}
                      <div style={styles.dropdownMenu}>
                        <motion.button 
                          style={{
                            ...styles.dropdownMenuItem,
                            ':hover': {
                              backgroundColor: 'rgba(249, 250, 251, 0.8)',
                            }
                          }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div style={{
                            ...styles.dropdownMenuIcon,
                            backgroundColor: '#dbeafe',
                            ':hover': {
                              backgroundColor: '#bfdbfe',
                            }
                          }}>
                            <Settings size={16} color="#2563eb" />
                          </div>
                          <div>
                            <div style={styles.dropdownMenuText}>Configuración</div>
                            <div style={styles.dropdownMenuSubtext}>Preferencias del sistema</div>
                          </div>
                        </motion.button>
                        
                        <div style={styles.divider} />
                        
                        <motion.button
                          onClick={handleLogout}
                          style={{
                            ...styles.dropdownMenuItem,
                            ':hover': {
                              backgroundColor: 'rgba(254, 242, 242, 0.8)',
                            }
                          }}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div style={{
                            ...styles.dropdownMenuIcon,
                            backgroundColor: '#fef2f2',
                            ':hover': {
                              backgroundColor: '#fecaca',
                            }
                          }}>
                            <LogOut size={16} color="#dc2626" />
                          </div>
                          <div>
                            <div style={{...styles.dropdownMenuText, color: '#dc2626'}}>Cerrar Sesión</div>
                            <div style={{...styles.dropdownMenuSubtext, color: '#ef4444'}}>Salir del dashboard</div>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Botón Menú Mobile */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  ...styles.mobileMenuButton,
                  display: window.innerWidth < 1024 ? 'block' : 'none'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X size={20} color="#4b5563" />
                ) : (
                  <Menu size={20} color="#4b5563" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Menú Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              ...styles.mobileMenu,
              display: window.innerWidth < 1024 ? 'block' : 'none'
            }}
          >
            <div style={styles.mobileMenuContent}>
              
              {/* Buscador Mobile */}
              <div style={styles.mobileSearchContainer}>
                <Search size={16} style={styles.mobileSearchIcon} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={handleSearch}
                  style={styles.mobileSearchInput}
                />
              </div>

              {/* Información Mobile */}
              <div style={styles.mobileInfoGrid}>
                <div style={styles.mobileInfoCard}>
                  <Calendar size={16} color="#2563eb" />
                  <div style={styles.dateTimeText}>
                    <div style={styles.dateTimeDate}>{localTime}</div>
                    <div style={styles.dateTimeTime}>{currentTime}</div>
                  </div>
                </div>
                
                <div style={styles.mobileInfoCard}>
                  <MapPin size={16} color="#2563eb" />
                  <div style={styles.mobileSelectWrapper}>
                    <select 
                      style={styles.mobileSelect}
                      onChange={(e) => onCenterChange?.(e.target.value)}
                    >
                      {centers.map(center => (
                        <option key={center.id} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} style={styles.mobileSelectArrow} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar menús */}
      <AnimatePresence>
        {(isUserMenuOpen || isMobileMenuOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
            onClick={() => {
              setIsUserMenuOpen(false);
              setIsMobileMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}