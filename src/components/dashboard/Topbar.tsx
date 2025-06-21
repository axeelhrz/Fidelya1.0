'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Settings, User, LogOut } from 'lucide-react';
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
  const localTime = format(currentDate, "dd 'de' MMMM, yyyy - HH:mm", { locale: es });
  const utcTime = format(currentDate, "HH:mm 'UTC'");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white shadow-card border-b border-gray-100 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CP</span>
            </div>
            <div>
              <h1 className="font-space-grotesk font-bold text-xl text-primary">
                Centro Psicológico
              </h1>
              <p className="text-sm text-secondary font-medium">Dashboard CEO</p>
            </div>
          </div>
        </div>

        {/* Información de fecha y hora */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-secondary" />
            <span className="font-medium text-primary">{localTime}</span>
            <span className="text-secondary">({utcTime})</span>
          </div>
          
          {/* Selector de sede */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-secondary" />
            <select className="bg-transparent border-none text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1">
              <option>Sede Principal</option>
              <option>Sede Norte</option>
              <option>Sede Sur</option>
            </select>
          </div>
        </div>

        {/* Buscador y usuario */}
        <div className="flex items-center space-x-4">
          {/* Buscador global */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Buscar pacientes, terapeutas..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-64 bg-secondary rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Switch Modo Terapeuta/Admin */}
          <div className="flex items-center space-x-2 bg-secondary rounded-xl p-1">
            <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded-lg">
              Admin
            </button>
            <button className="px-3 py-1 text-xs font-medium text-secondary hover:text-primary transition-colors">
              Terapeuta
            </button>
          </div>

          {/* Menú de usuario */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-primary">
                {user?.name || 'Usuario'}
              </span>
            </button>

            {/* Dropdown del usuario */}
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
              >
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Configuración</span>
                </button>
                <hr className="my-1 border-gray-100" />
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center space-x-2 text-error"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
