'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  description?: string;
  disabled?: boolean;
  route?: string; // Nueva propiedad para rutas específicas
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
  allowMobile?: boolean;
  enableRouting?: boolean; // Nueva propiedad para habilitar navegación por rutas
}

export default function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange,
  showDescriptions = true,
  allowMobile = true,
  enableRouting = false
}: TabNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const router = useRouter();

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const isTabActive = (tabId: string) => activeTab === tabId;
  const isTabHovered = (tabId: string) => hoveredTab === tabId;

  const handleTabClick = (tab: Tab) => {
    if (tab.disabled) return;

    if (enableRouting && tab.route) {
      // Navegar a la ruta específica
      router.push(tab.route);
    } else {
      // Usar el callback tradicional
      onTabChange(tab.id);
    }
  };

  const renderTabButton = (tab: Tab, isMobile = false) => {
    const isActive = isTabActive(tab.id);
    const isHovered = isTabHovered(tab.id);
    const Icon = tab.icon;

    return (
      <motion.button
        key={tab.id}
        onClick={() => {
          handleTabClick(tab);
          if (isMobile) setIsMobileMenuOpen(false);
        }}
        onMouseEnter={() => setHoveredTab(tab.id)}
        onMouseLeave={() => setHoveredTab(null)}
        disabled={tab.disabled}
        whileHover={tab.disabled ? {} : { scale: 1.02, y: -2 }}
        whileTap={tab.disabled ? {} : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.5rem 2rem',
          borderRadius: '1.5rem',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          fontSize: '0.875rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: tab.disabled ? 'not-allowed' : 'pointer',
          border: 'none',
          outline: 'none',
          background: isActive 
            ? 'rgba(255, 255, 255, 0.9)' 
            : isHovered 
              ? 'rgba(255, 255, 255, 0.6)' 
              : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(12px)',
          borderBottom: isActive ? '3px solid #2463EB' : '3px solid transparent',
          color: isActive ? '#2463EB' : tab.disabled ? '#9CA3AF' : '#1C1E21',
          opacity: tab.disabled ? 0.5 : 1,
          boxShadow: isActive 
            ? '0 8px 25px rgba(36, 99, 235, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)' 
            : isHovered 
              ? '0 4px 12px rgba(0, 0, 0, 0.08)' 
              : '0 2px 4px rgba(0, 0, 0, 0.02)',
          minWidth: '180px',
          textAlign: 'center'
        }}
        title={tab.description}
      >
        {/* Fondo activo animado */}
        {isActive && (
          <motion.div
            layoutId="activeBackground"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(36, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
              borderRadius: '1.5rem',
              zIndex: -1
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Badge de notificaciones */}
        {tab.badge && tab.badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: '#EF4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
            }}
          >
            {tab.badge > 99 ? '99+' : tab.badge}
          </motion.div>
        )}

        {/* Icono */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem',
          borderRadius: '12px',
          background: isActive 
            ? 'rgba(36, 99, 235, 0.1)' 
            : 'rgba(107, 114, 128, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <Icon size={24} strokeWidth={1.5} />
        </div>

        {/* Título */}
        <div style={{
          fontWeight: isActive ? 600 : 500,
          fontSize: '0.875rem',
          lineHeight: 1.2,
          fontFamily: 'Inter, sans-serif'
        }}>
          {tab.label}
        </div>

        {/* Descripción */}
        {showDescriptions && tab.description && (
          <div style={{
            fontSize: '0.75rem',
            color: '#6B7280',
            lineHeight: 1.3,
            fontFamily: 'Inter, sans-serif',
            textAlign: 'center',
            maxWidth: '140px'
          }}>
            {tab.description}
          </div>
        )}

        {/* Tooltip hover */}
        <AnimatePresence>
          {isHovered && !isMobile && tab.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'absolute',
                bottom: '-60px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
                zIndex: 100,
                pointerEvents: 'none'
              }}
            >
              {tab.description}
              <div style={{
                position: 'absolute',
                top: '-4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderBottom: '4px solid rgba(0, 0, 0, 0.8)'
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };

  const shouldShowMobile = allowMobile && typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <div style={{ position: 'relative', width: '100%' }}>
        {shouldShowMobile ? (
          // Vista Mobile
          <div style={{ position: 'relative' }}>
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.98 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(229, 231, 235, 0.6)',
                borderRadius: '1rem',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {activeTabData && (
                  <>
                    <activeTabData.icon size={20} />
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                      {activeTabData.label}
                    </span>
                    {activeTabData.badge && activeTabData.badge > 0 && (
                      <div style={{
                        backgroundColor: '#EF4444',
                        color: 'white',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {activeTabData.badge > 99 ? '99+' : activeTabData.badge}
                      </div>
                    )}
                  </>
                )}
              </div>
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}
                >
                  {tabs.map((tab, index) => (
                    <motion.div
                      key={tab.id}
                      onClick={() => handleTabClick(tab)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem 1.5rem',
                        cursor: tab.disabled ? 'not-allowed' : 'pointer',
                        borderBottom: index === tabs.length - 1 ? 'none' : '1px solid rgba(229, 231, 235, 0.3)',
                        background: isTabActive(tab.id) ? 'rgba(36, 99, 235, 0.05)' : 'transparent',
                        color: tab.disabled ? '#9CA3AF' : 
                               isTabActive(tab.id) ? '#2463EB' : '#1C1E21',
                        opacity: tab.disabled ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                      whileHover={tab.disabled ? {} : { backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
                    >
                      <tab.icon size={18} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
                          {tab.label}
                        </div>
                        {tab.description && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            marginTop: '0.125rem',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {tab.description}
                          </div>
                        )}
                      </div>
                      {tab.badge && tab.badge > 0 && (
                        <div style={{
                          backgroundColor: '#EF4444',
                          color: 'white',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {tab.badge > 99 ? '99+' : tab.badge}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Vista Desktop - Navegación horizontal
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '2rem',
              border: '1px solid rgba(229, 231, 235, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {tabs.map((tab) => renderTabButton(tab))}
          </motion.div>
        )}
      </div>

      {/* Overlay para cerrar mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Estilos CSS adicionales */}
      <style jsx>{`
        /* Ocultar scrollbar en navegación desktop */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}