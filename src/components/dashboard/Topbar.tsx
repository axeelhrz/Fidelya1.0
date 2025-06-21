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
    role: 'CEO & Fundador',
    avatar: null
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Actualizar tiempo cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
          background: '#F9FAFB',
          borderBottom: 'none',
          height: '72px',
          display: 'flex',
          alignItems: 'center'
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
          
          {/* Logo y nombre del centro */}
          <motion.div 
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(36, 99, 235, 0.3)'
              }}>
                <Activity size={20} color="white" />
              </div>
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '12px',
                height: '12px',
                backgroundColor: '#10B981',
                borderRadius: '50%',
                border: '2px solid white',
                animation: 'pulse 2s infinite'
              }} />
            </div>
            <div>
              <h1 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1C1E21',
                fontFamily: 'Space Grotesk, sans-serif',
                margin: 0,
                lineHeight: 1.2
              }}>
                Centro Psicológico
              </h1>
              <p style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                fontWeight: 500,
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Dashboard Ejecutivo
              </p>
            </div>
          </motion.div>

          {/* Fecha actual con UTC y local */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '12px',
              border: '1px solid rgba(229, 231, 235, 0.6)'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <Calendar size={16} color="#2463EB" />
            </motion.div>
            <div style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ fontWeight: 600, color: '#1C1E21', lineHeight: 1.2 }}>
                {currentDate}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#2463EB', fontWeight: 500 }}>
                {localTime}
              </div>
            </div>
          </motion.div>

          {/* Selector de sede */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <div style={{
              padding: '0.5rem',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              borderRadius: '12px',
              border: '1px solid rgba(229, 231, 235, 0.6)'
            }}>
              <MapPin size={16} color="#2463EB" />
            </div>
            <div style={{ position: 'relative' }}>
              <select 
                style={{
                  appearance: 'none',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  borderRadius: '12px',
                  padding: '0.75rem 2rem 0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1C1E21',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
                onChange={(e) => onCenterChange?.(e.target.value)}
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
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#9CA3AF'
                }} 
              />
            </div>
          </motion.div>

          {/* Buscador global suave */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            style={{ position: 'relative', flex: 1, maxWidth: '320px' }}
          >
            <div style={{
              position: 'relative',
              transition: 'all 0.3s ease',
              transform: isSearchFocused ? 'scale(1.02)' : 'scale(1)'
            }}>
              <Search 
                size={16} 
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  transition: 'all 0.2s ease',
                  color: isSearchFocused ? '#2463EB' : '#9CA3AF'
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
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px',
                  border: `1px solid ${isSearchFocused ? '#2463EB' : 'rgba(229, 231, 235, 0.6)'}`,
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: isSearchFocused ? '0 0 0 3px rgba(36, 99, 235, 0.1)' : 'none'
                }}
              />
            </div>
          </motion.div>

          {/* Ícono de campana con badge rojo y animación sutil */}
          <motion.button 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'relative',
              padding: '0.75rem',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(229, 231, 235, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Bell size={20} color="#4B5563" />
            </motion.div>
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'white'
              }}>
                3
              </span>
            </div>
          </motion.button>

          {/* Avatar del usuario con rol (Dr. CEO) */}
          <div style={{ position: 'relative' }}>
            <motion.button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={16} color="white" />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#10B981',
                  borderRadius: '50%',
                  border: '2px solid white'
                }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1C1E21',
                  maxWidth: '8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {mockUser.name.split(' ')[0]}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#2463EB',
                  fontWeight: 500,
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  CEO
                </div>
              </div>
              <motion.div
                animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} color="#9CA3AF" />
              </motion.div>
            </motion.button>

            {/* Dropdown Usuario */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    marginTop: '0.5rem',
                    width: '18rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    padding: '0.5rem 0',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}
                >
                  {/* Header Usuario */}
                  <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <User size={24} color="white" />
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '-4px',
                          right: '-4px',
                          width: '16px',
                          height: '16px',
                          backgroundColor: '#10B981',
                          borderRadius: '50%',
                          border: '2px solid white'
                        }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#1C1E21',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {mockUser.name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          margin: 0,
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {mockUser.email}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          marginTop: '0.25rem'
                        }}>
                          <Shield size={12} color="#2463EB" />
                          <span style={{
                            fontSize: '0.75rem',
                            color: '#2463EB',
                            fontWeight: 500,
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {mockUser.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Opciones Menú */}
                  <div style={{ padding: '0.25rem 0' }}>
                    <motion.button 
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#DBEAFE',
                        transition: 'all 0.15s ease'
                      }}>
                        <Settings size={16} color="#2463EB" />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
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
                      backgroundColor: '#F3F4F6',
                      margin: '0.25rem 1rem'
                    }} />
                    
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.15s ease',
                        outline: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(254, 242, 242, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: '#FEF2F2',
                        transition: 'all 0.15s ease'
                      }}>
                        <LogOut size={16} color="#DC2626" />
                      </div>
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
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

      {/* Overlay para cerrar menús */}
      <AnimatePresence>
        {isUserMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(4px)',
              zIndex: 40
            }}
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
