'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Settings, User, LogOut, Bell, ChevronDown, Zap } from 'lucide-react';
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
    role: 'admin'
  };

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

  const handleLogout = () => {
    console.log('Logout clicked');
    // Aquí puedes agregar la lógica de logout cuando sea necesario
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      className="glass-premium sticky top-0 z-50 border-b border-glow/30"
    >
      <div className="container-dashboard">
        <div className="flex items-center justify-between h-24">
          {/* Logo futurista */}
          <motion.div 
            className="flex items-center space-x-5"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <motion.div 
                className="w-14 h-14 gradient-accent rounded-2xl flex items-center justify-center shadow-glow-strong relative overflow-hidden"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-inverse font-bold text-xl font-space-grotesk">CP</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-futuristic" />
              </motion.div>
              <motion.div 
                className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white shadow-glow"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-accent/60 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-heading-futuristic text-2xl text-primary">
                Centro Psicológico
              </h1>
              <div className="flex items-center space-x-2">
                <p className="text-caption text-tertiary">Dashboard Ejecutivo</p>
                <Zap className="w-3 h-3 text-accent animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Centro - Información mejorada */}
          <div className="hidden lg:flex items-center space-x-10">
            <motion.div 
              className="flex items-center space-x-4 text-sm"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="p-4 bg-surface-glass backdrop-blur-xl rounded-2xl border border-light shadow-card">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <div className="font-bold text-primary text-lg font-space-grotesk">{localTime}</div>
                <div className="text-sm text-accent font-semibold">{currentTime}</div>
              </div>
            </motion.div>
            
            <div className="h-12 w-px bg-gradient-to-b from-transparent via-border-light to-transparent" />
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="p-4 bg-surface-glass backdrop-blur-xl rounded-2xl border border-light shadow-card">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
              <div className="relative">
                <select 
                  className="appearance-none bg-surface-glass backdrop-blur-xl border border-light rounded-xl px-4 py-3 text-sm font-bold text-primary focus:outline-none focus:border-glow focus:shadow-glow cursor-pointer pr-10 font-space-grotesk"
                  onChange={(e) => onCenterChange?.(e.target.value)}
                >
                  <option value="main">Sede Principal</option>
                  <option value="north">Sede Norte</option>
                  <option value="south">Sede Sur</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Derecha - Controles futuristas */}
          <div className="flex items-center space-x-5">
            {/* Buscador futurista */}
            <motion.div 
              className="relative hidden md:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.div 
                className={`relative transition-all duration-500 ${
                  isSearchFocused ? 'scale-105' : ''
                }`}
                animate={{
                  boxShadow: isSearchFocused ? 'var(--shadow-glow-strong)' : 'var(--shadow-card)'
                }}
              >
                <Search className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                  isSearchFocused ? 'text-accent scale-110' : 'text-secondary'
                }`} />
                <input
                  type="text"
                  placeholder="Buscar pacientes, métricas, insights..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-14 pr-8 py-4 w-96 bg-surface-glass backdrop-blur-xl rounded-2xl border border-light focus:outline-none focus:border-glow text-sm transition-all duration-500 placeholder-tertiary font-inter"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSearchFocused ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 rounded-2xl -z-10"
                />
              </motion.div>
            </motion.div>

            {/* Notificaciones futuristas */}
            <motion.button 
              className="relative p-4 rounded-2xl bg-surface-glass backdrop-blur-xl border border-light hover:border-glow hover:shadow-glow transition-all duration-400 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Bell className="w-5 h-5 text-secondary group-hover:text-accent transition-colors duration-300" />
              <motion.div 
                className="absolute -top-1 -right-1 w-6 h-6 gradient-error rounded-full flex items-center justify-center shadow-glow"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-white">3</span>
              </motion.div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-error/30 rounded-full animate-ping" />
            </motion.button>

            {/* Menú de usuario futurista */}
            <div className="relative">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-4 p-4 rounded-2xl bg-surface-glass backdrop-blur-xl border border-light hover:border-glow hover:shadow-glow transition-all duration-400 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 gradient-accent rounded-2xl flex items-center justify-center shadow-glow relative overflow-hidden">
                    <User className="w-6 h-6 text-inverse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-futuristic" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white shadow-glow" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-bold text-primary font-space-grotesk">
                    {mockUser.name}
                  </div>
                  <div className="text-xs text-accent font-semibold">CEO & Fundador</div>
                </div>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4 text-secondary group-hover:text-accent transition-colors duration-300" />
                </motion.div>
              </motion.button>

              {/* Dropdown futurista */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  className="absolute right-0 mt-6 w-80 glass-premium rounded-2xl shadow-floating border border-glow/30 py-3 z-50 overflow-hidden"
                >
                  {/* Header del dropdown */}
                  <div className="px-8 py-6 border-b border-light/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center shadow-glow relative overflow-hidden">
                        <User className="w-8 h-8 text-inverse" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-futuristic" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-primary font-space-grotesk">{mockUser.name}</div>
                        <div className="text-sm text-secondary">{mockUser.email}</div>
                        <div className="text-sm text-accent font-bold">CEO & Fundador</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Opciones del menú */}
                  <div className="py-3">
                    <motion.button 
                      className="w-full px-8 py-4 text-left text-sm hover:bg-surface-hover/50 flex items-center space-x-4 transition-all duration-300 group"
                      whileHover={{ x: 8 }}
                    >
                      <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors border border-accent/20">
                        <Settings className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-bold text-primary font-space-grotesk">Configuración</div>
                        <div className="text-xs text-secondary">Preferencias y ajustes del sistema</div>
                      </div>
                    </motion.button>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-border-light to-transparent my-3 mx-8" />
                    
                    <motion.button
                      onClick={handleLogout}
                      className="w-full px-8 py-4 text-left text-sm hover:bg-error-bg/30 flex items-center space-x-4 transition-all duration-300 group"
                      whileHover={{ x: 8 }}
                    >
                      <div className="p-3 rounded-xl bg-error/10 group-hover:bg-error/20 transition-colors border border-error/20">
                        <LogOut className="w-5 h-5 text-error" />
                      </div>
                      <div>
                        <div className="font-bold text-error font-space-grotesk">Cerrar Sesión</div>
                        <div className="text-xs text-error/70">Salir del dashboard ejecutivo</div>
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