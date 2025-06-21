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

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo y Branding - Minimalista */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 font-space-grotesk">
                  Centro Psicológico
                </h1>
                <p className="text-xs text-gray-500 font-medium">Dashboard Ejecutivo</p>
              </div>
            </motion.div>

            {/* Información Central - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              
              {/* Fecha y Hora */}
              <motion.div 
                className="flex items-center space-x-3 px-4 py-2 bg-gray-50/80 rounded-xl border border-gray-200/60"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Calendar className="w-4 h-4 text-blue-600" />
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">{localTime}</div>
                  <div className="text-xs text-blue-600 font-medium">{currentTime}</div>
                </div>
              </motion.div>
              
              {/* Selector de Centro */}
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="p-2 bg-gray-50/80 rounded-xl border border-gray-200/60">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer transition-all duration-200"
                    onChange={(e) => onCenterChange?.(e.target.value)}
                  >
                    {centers.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>
            </div>

            {/* Controles Derecha */}
            <div className="flex items-center space-x-3">
              
              {/* Buscador - Desktop */}
              <motion.div 
                className="relative hidden md:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'scale-105' : ''
                }`}>
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                    isSearchFocused ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="pl-10 pr-4 py-2.5 w-80 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </motion.div>

              {/* Notificaciones */}
              <motion.button 
                className="relative p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:bg-gray-50/80 hover:border-gray-300/60 transition-all duration-200 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">3</span>
                </div>
              </motion.button>

              {/* Menú Usuario */}
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:bg-gray-50/80 hover:border-gray-300/60 transition-all duration-200 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-semibold text-gray-900 truncate max-w-32">
                      {mockUser.name.split(' ')[0]}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">CEO</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </motion.button>

                {/* Dropdown Usuario */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                      className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 py-2 z-50 overflow-hidden"
                    >
                      {/* Header Usuario */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center relative">
                            <User className="w-6 h-6 text-white" />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {mockUser.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {mockUser.email}
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              <Shield className="w-3 h-3 text-blue-600" />
                              <span className="text-xs text-blue-600 font-medium">CEO & Fundador</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Opciones Menú */}
                      <div className="py-1">
                        <motion.button 
                          className="w-full px-4 py-3 text-left hover:bg-gray-50/80 flex items-center space-x-3 transition-colors duration-150 group"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                            <Settings className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">Configuración</div>
                            <div className="text-xs text-gray-500">Preferencias del sistema</div>
                          </div>
                        </motion.button>
                        
                        <div className="h-px bg-gray-100 my-1 mx-4" />
                        
                        <motion.button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left hover:bg-red-50/80 flex items-center space-x-3 transition-colors duration-150 group"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="p-2 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-red-600">Cerrar Sesión</div>
                            <div className="text-xs text-red-500">Salir del dashboard</div>
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
                className="lg:hidden p-2.5 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/60 hover:bg-gray-50/80 transition-all duration-200"
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
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
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200/60 shadow-sm"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
              
              {/* Buscador Mobile */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2.5 w-full bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all duration-200 placeholder-gray-400"
                />
              </div>

              {/* Información Mobile */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50/80 rounded-xl border border-gray-200/60">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">{localTime}</div>
                    <div className="text-xs text-blue-600 font-medium">{currentTime}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50/80 rounded-xl border border-gray-200/60">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <div className="relative flex-1">
                    <select 
                      className="appearance-none bg-transparent w-full text-sm font-medium text-gray-900 focus:outline-none cursor-pointer pr-4"
                      onChange={(e) => onCenterChange?.(e.target.value)}
                    >
                      {centers.map(center => (
                        <option key={center.id} value={center.id}>
                          {center.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
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