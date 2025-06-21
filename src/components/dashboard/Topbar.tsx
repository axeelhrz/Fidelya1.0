'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Settings, User, LogOut, Bell } from 'lucide-react';
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
      className="bg-surface border-b border-border-light sticky top-0 z-50 backdrop-blur-sm bg-surface/95"
    >
      <div className="container-dashboard">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-inverse font-semibold text-sm">CP</span>
              </div>
              <div>
                <h1 className="font-space-grotesk font-semibold text-lg text-primary">
                  Centro Psicológico
                </h1>
                <p className="text-xs text-tertiary">Dashboard Ejecutivo</p>
              </div>
            </div>
          </div>

          {/* Centro - Información de fecha y selector de sede */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-sm">
              <Calendar className="w-4 h-4 text-secondary" />
              <div className="text-right">
                <div className="font-medium text-primary">{localTime}</div>
                <div className="text-xs text-secondary">{currentTime}</div>
              </div>
            </div>
            
            <div className="h-6 w-px bg-border-light" />
            
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-secondary" />
              <select 
                className="bg-transparent border-none text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent rounded-lg px-2 py-1 cursor-pointer"
                onChange={(e) => onCenterChange?.(e.target.value)}
              >
                <option value="main">Sede Principal</option>
                <option value="north">Sede Norte</option>
                <option value="south">Sede Sur</option>
              </select>
            </div>
          </div>

          {/* Derecha - Buscador y usuario */}
          <div className="flex items-center space-x-4">
            {/* Buscador global */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-64 bg-surface-elevated rounded-button border border-border-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm transition-all"
              />
            </div>

            {/* Notificaciones */}
            <button className="relative p-2 rounded-button hover:bg-surface-hover transition-colors">
              <Bell className="w-5 h-5 text-secondary" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-surface rounded-full"></span>
              </span>
            </button>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-button hover:bg-surface-hover transition-colors"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-inverse" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-primary">
                    {user?.name || 'Usuario'}
                  </div>
                  <div className="text-xs text-secondary">Administrador</div>
                </div>
              </button>

              {/* Dropdown del usuario */}
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 bg-surface rounded-card shadow-floating border border-border-light py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-border-light">
                    <div className="text-sm font-medium text-primary">{user?.name}</div>
                    <div className="text-xs text-secondary">{user?.email}</div>
                  </div>
                  
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover flex items-center space-x-3 transition-colors">
                    <Settings className="w-4 h-4 text-secondary" />
                    <span className="text-primary">Configuración</span>
                  </button>
                  
                  <div className="h-px bg-border-light my-1" />
                  
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-surface-hover flex items-center space-x-3 text-error transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}