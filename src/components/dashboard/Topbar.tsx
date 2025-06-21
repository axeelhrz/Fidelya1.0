'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Settings, User, LogOut, Bell, ChevronDown } from 'lucide-react';
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
  
  const currentDate = new Date();
  const localTime = format(currentDate, "dd 'de' MMMM, yyyy", { locale: es });
  const currentTime = format(currentDate, "HH:mm");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="glass sticky top-0 z-50 border-b border-white/20"
    >
      <div className="container-dashboard">
        <div className="flex items-center justify-between h-20">
          {/* Logo y título con animación */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-elevated">
                  <span className="text-inverse font-bold text-lg">CP</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-heading text-xl text-primary">
                  Centro Psicológico
                </h1>
                <p className="text-caption text-tertiary">Dashboard Ejecutivo</p>
              </div>
            </div>
          </motion.div>

          {/* Centro - Información de fecha y selector de sede */}
          <div className="hidden lg:flex items-center space-x-8">
            <motion.div 
              className="flex items-center space-x-4 text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-3 bg-surface-elevated rounded-xl">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <div className="font-semibold text-primary">{localTime}</div>
                <div className="text-sm text-secondary">{currentTime}</div>
              </div>
            </motion.div>
            
            <div className="h-8 w-px bg-border-light" />
            
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-3 bg-surface-elevated rounded-xl">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div className="relative">
                <select 
                  className="appearance-none bg-transparent border-none text-sm font-semibold text-primary focus:outline-none cursor-pointer pr-6"
                  onChange={(e) => onCenterChange?.(e.target.value)}
                >
                  <option value="main">Sede Principal</option>
                  <option value="north">Sede Norte</option>
                  <option value="south">Sede Sur</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Derecha - Buscador y usuario */}
          <div className="flex items-center space-x-4">
            {/* Buscador global mejorado */}
            <motion.div 
              className="relative hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'scale-105' : ''
              }`}>
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  isSearchFocused ? 'text-accent' : 'text-secondary'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar pacientes, métricas..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-12 pr-6 py-3 w-80 bg-surface-elevated/80 backdrop-blur-sm rounded-2xl border border-border-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent text-sm transition-all duration-300 placeholder-tertiary"
                />
                {isSearchFocused && (
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent-light/5 rounded-2xl -z-10" />
                )}
              </div>
            </motion.div>

            {/* Notificaciones mejoradas */}
            <motion.button 
              className="relative p-3 rounded-2xl bg-surface-elevated/80 backdrop-blur-sm hover:bg-surface-hover transition-all duration-300 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Bell className="w-5 h-5 text-secondary group-hover:text-accent transition-colors duration-300" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-error to-error-light rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">3</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-error/30 rounded-full animate-ping" />
            </motion.button>

            {/* Menú de usuario mejorado */}
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-3 rounded-2xl bg-surface-elevated/80 backdrop-blur-sm hover:bg-surface-hover transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center shadow-elevated">
                    <User className="w-5 h-5 text-inverse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-primary">
                    {user?.name || 'Usuario'}
                  </div>
                  <div className="text-xs text-secondary">CEO & Fundador</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-secondary transition-transform duration-300 ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`} />
              </motion.button>

              {/* Dropdown del usuario mejorado */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-72 glass rounded-2xl shadow-floating border border-white/20 py-2 z-50 overflow-hidden"
                >
                  {/* Header del dropdown */}
                  <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-inverse" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-primary">{user?.name}</div>
                        <div className="text-xs text-secondary">{user?.email}</div>
                        <div className="text-xs text-accent font-medium">CEO & Fundador</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Opciones del menú */}
                  <div className="py-2">
                    <motion.button 
                      className="w-full px-6 py-3 text-left text-sm hover:bg-surface-hover/50 flex items-center space-x-3 transition-colors group"
                      whileHover={{ x: 4 }}
                    >
                      <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                        <Settings className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <div className="font-medium text-primary">Configuración</div>
                        <div className="text-xs text-secondary">Preferencias y ajustes</div>
                      </div>
                    </motion.button>
                    
                    <div className="h-px bg-border-light/50 my-2 mx-6" />
                    
                    <motion.button
                      onClick={logout}
                      className="w-full px-6 py-3 text-left text-sm hover:bg-error-bg/50 flex items-center space-x-3 transition-colors group"
                      whileHover={{ x: 4 }}
                    >
                      <div className="p-2 rounded-lg bg-error/10 group-hover:bg-error/20 transition-colors">
                        <LogOut className="w-4 h-4 text-error" />
                      </div>
                      <div>
                        <div className="font-medium text-error">Cerrar sesión</div>
                        <div className="text-xs text-error/70">Salir del dashboard</div>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}