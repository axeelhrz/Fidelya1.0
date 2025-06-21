'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, ChevronDown } from 'lucide-react';
import { useStyles } from '@/lib/useStyles';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  description?: string;
  disabled?: boolean;
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
}

export default function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  showDescriptions = true,
  allowMobile = true
}: TabNavigationProps) {
  const { theme, responsive } = useStyles();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  const styles = {
    container: {
      position: 'relative' as const,
      width: '100%',
    },
    
    // Contenedor principal de pestañas
    tabContainer: {
      display: orientation === 'horizontal' ? 'flex' : 'flex',
      flexDirection: orientation === 'horizontal' ? 'row' as const : 'column' as const,
      gap: variant === 'underline' ? '0' : '0.25rem',
      backgroundColor: variant === 'default' || variant === 'pills' ? theme.colors.surfaceGlass : 'transparent',
      backdropFilter: variant === 'default' || variant === 'pills' ? 'blur(20px)' : 'none',
      borderRadius: variant === 'pills' ? theme.borderRadius.xxl : variant === 'default' ? theme.borderRadius.xl : '0',
      padding: variant === 'default' || variant === 'pills' ? '0.5rem' : '0',
      border: variant === 'default' || variant === 'pills' ? `1px solid ${theme.colors.borderLight}` : 'none',
      boxShadow: variant === 'default' || variant === 'pills' ? theme.shadows.card : 'none',
      borderBottom: variant === 'underline' ? `1px solid ${theme.colors.borderLight}` : 'none',
      overflowX: orientation === 'horizontal' ? 'auto' as const : 'visible',
      overflowY: orientation === 'vertical' ? 'auto' as const : 'visible',
      maxWidth: orientation === 'horizontal' ? '100%' : 'auto',
    },
    
    // Estilos base del botón de pestaña
    tabButton: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      gap: getSizeValue('gap'),
      padding: getSizeValue('padding'),
      borderRadius: getVariantRadius(),
      fontFamily: theme.fonts.heading,
      fontWeight: theme.fontWeights.medium,
      fontSize: getSizeValue('fontSize'),
      transition: theme.animations.transition,
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      whiteSpace: 'nowrap' as const,
      minWidth: orientation === 'horizontal' ? 'auto' : '100%',
      textAlign: 'left' as const,
      flexShrink: 0,
    },
    
    // Estilos para pestaña activa
    tabButtonActive: {
      color: getActiveColor(),
      backgroundColor: getActiveBackground(),
      boxShadow: getActiveShadow(),
      border: getActiveBorder(),
      fontWeight: theme.fontWeights.semibold,
    },
    
    // Estilos para pestaña inactiva
    tabButtonInactive: {
      color: theme.colors.textSecondary,
      backgroundColor: 'transparent',
    },
    
    // Estilos hover
    tabButtonHover: {
      color: theme.colors.textPrimary,
      backgroundColor: getHoverBackground(),
      transform: variant === 'cards' ? 'translateY(-2px)' : 'none',
    },
    
    // Estilos disabled
    tabButtonDisabled: {
      color: theme.colors.textTertiary,
      cursor: 'not-allowed',
      opacity: 0.5,
    },
    
    // Contenedor del icono
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    
    // Contenedor del contenido
    contentContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.125rem',
      flex: 1,
      minWidth: 0,
    },
    
    // Label de la pestaña
    tabLabel: {
      fontWeight: 'inherit',
      fontSize: 'inherit',
      lineHeight: 1.2,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    
    // Descripción de la pestaña
    tabDescription: {
      fontSize: getSizeValue('descriptionSize'),
      color: theme.colors.textTertiary,
      lineHeight: 1.3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    },
    
    // Badge
    badge: {
      backgroundColor: theme.colors.error,
      color: theme.colors.textInverse,
      fontSize: '0.75rem',
      fontWeight: theme.fontWeights.bold,
      borderRadius: theme.borderRadius.full,
      padding: '0.125rem 0.5rem',
      minWidth: '1.25rem',
      height: '1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    
    // Indicador activo para variant underline
    activeIndicator: {
      position: 'absolute' as const,
      bottom: variant === 'underline' ? '-1px' : 'auto',
      left: variant === 'underline' ? '0' : '50%',
      right: variant === 'underline' ? '0' : 'auto',
      top: variant === 'underline' ? 'auto' : '0',
      width: variant === 'underline' ? '100%' : '0.5rem',
      height: variant === 'underline' ? '2px' : '100%',
      backgroundColor: theme.colors.primary,
      borderRadius: variant === 'underline' ? '0' : theme.borderRadius.full,
      transform: variant === 'underline' ? 'none' : 'translateX(-50%)',
    },
    
    // Fondo activo animado
    activeBackground: {
      position: 'absolute' as const,
      inset: 0,
      background: getActiveGradient(),
      borderRadius: 'inherit',
      opacity: 0.1,
    },
    
    // Contenedor mobile
    mobileContainer: {
      display: 'block',
      position: 'relative' as const,
    },
    
    // Botón mobile
    mobileButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surfaceGlass,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.colors.borderLight}`,
      borderRadius: theme.borderRadius.xl,
      cursor: 'pointer',
      outline: 'none',
      transition: theme.animations.transition,
    },
    
    // Contenido del botón mobile
    mobileButtonContent: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    
    // Dropdown mobile
    mobileDropdown: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      marginTop: '0.5rem',
      backgroundColor: theme.colors.surface,
      backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.colors.borderLight}`,
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.shadows.floating,
      zIndex: 50,
      overflow: 'hidden',
    },
    
    // Item del dropdown mobile
    mobileDropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
      cursor: 'pointer',
      transition: theme.animations.transition,
      borderBottom: `1px solid ${theme.colors.borderLight}`,
    },
    
    // Indicador de contenido activo
    contentIndicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: theme.spacing.md,
      padding: '0.5rem 1rem',
      backgroundColor: theme.colors.surfaceGlass,
      backdropFilter: 'blur(20px)',
      borderRadius: theme.borderRadius.full,
      border: `1px solid ${theme.colors.borderLight}`,
      width: 'fit-content',
      margin: `${theme.spacing.md} auto 0 auto`,
    },
    
    // Dot animado
    activeDot: {
      width: '0.5rem',
      height: '0.5rem',
      backgroundColor: theme.colors.primary,
      borderRadius: '50%',
      animation: 'pulse 2s ease-in-out infinite',
    },
    
    // Texto del indicador
    indicatorText: {
      fontSize: '0.875rem',
      color: theme.colors.textSecondary,
      fontWeight: theme.fontWeights.medium,
    },
  };

  function getSizeValue(property: string) {
    const sizeMap = {
      sm: {
        padding: '0.5rem 0.75rem',
        fontSize: '0.75rem',
        descriptionSize: '0.625rem',
        gap: '0.375rem',
      },
      md: {
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        descriptionSize: '0.75rem',
        gap: '0.5rem',
      },
      lg: {
        padding: '1rem 1.5rem',
        fontSize: '1rem',
        descriptionSize: '0.875rem',
        gap: '0.75rem',
      },
    };
    
    return sizeMap[size][property as keyof typeof sizeMap.sm];
  }

  function getVariantRadius() {
    switch (variant) {
      case 'pills':
        return theme.borderRadius.full;
      case 'cards':
        return theme.borderRadius.xl;
      case 'underline':
        return '0';
      default:
        return theme.borderRadius.lg;
    }
  }

  function getActiveColor() {
    return variant === 'underline' ? theme.colors.primary : theme.colors.primary;
  }

  function getActiveBackground() {
    switch (variant) {
      case 'underline':
        return 'transparent';
      case 'cards':
        return theme.colors.surface;
      default:
        return theme.colors.surface;
    }
  }

  function getActiveShadow() {
    switch (variant) {
      case 'cards':
        return theme.shadows.elevated;
      case 'underline':
        return 'none';
      default:
        return theme.shadows.card;
    }
  }

  function getActiveBorder() {
    switch (variant) {
      case 'cards':
        return `1px solid ${theme.colors.borderPrimary}`;
      case 'underline':
        return 'none';
      default:
        return `1px solid ${theme.colors.primary}20`;
    }
  }

  function getHoverBackground() {
    switch (variant) {
      case 'underline':
        return `${theme.colors.primary}08`;
      case 'cards':
        return theme.colors.surfaceHover;
      default:
        return theme.colors.surfaceHover;
    }
  }

  function getActiveGradient() {
    return `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.primary}05)`;
  }

  const isTabActive = (tabId: string) => activeTab === tabId;
  const isTabHovered = (tabId: string) => hoveredTab === tabId;

  const renderTabButton = (tab: Tab, isMobile = false) => {
    const isActive = isTabActive(tab.id);
    const isHovered = isTabHovered(tab.id);
    const Icon = tab.icon;

    const buttonStyles = {
      ...styles.tabButton,
      ...(isActive ? styles.tabButtonActive : styles.tabButtonInactive),
      ...(isHovered && !isActive ? styles.tabButtonHover : {}),
      ...(tab.disabled ? styles.tabButtonDisabled : {}),
    };

    return (
      <motion.button
        key={tab.id}
        onClick={() => {
          if (!tab.disabled) {
            onTabChange(tab.id);
            if (isMobile) setIsMobileMenuOpen(false);
          }
        }}
        onMouseEnter={() => setHoveredTab(tab.id)}
        onMouseLeave={() => setHoveredTab(null)}
        style={buttonStyles}
        disabled={tab.disabled}
        whileHover={tab.disabled ? {} : { scale: variant === 'cards' ? 1.02 : 1.01 }}
        whileTap={tab.disabled ? {} : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {/* Fondo activo animado */}
        {isActive && variant !== 'underline' && (
          <motion.div
            layoutId={`activeBackground-${variant}`}
            style={styles.activeBackground}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Indicador activo para underline */}
        {isActive && variant === 'underline' && (
          <motion.div
            layoutId="activeIndicator"
            style={styles.activeIndicator}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Icono */}
        <div style={styles.iconContainer}>
          <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
        </div>

        {/* Contenido */}
        <div style={styles.contentContainer}>
          <span style={styles.tabLabel}>{tab.label}</span>
          {showDescriptions && tab.description && (
            <span style={styles.tabDescription}>{tab.description}</span>
          )}
        </div>

        {/* Badge */}
        {tab.badge && tab.badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={styles.badge}
          >
            {tab.badge > 99 ? '99+' : tab.badge}
          </motion.div>
        )}
      </motion.button>
    );
  };

  const shouldShowMobile = allowMobile && typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      <div style={styles.container}>
        {shouldShowMobile ? (
          // Vista Mobile
          <div style={styles.mobileContainer}>
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={styles.mobileButton}
              whileTap={{ scale: 0.98 }}
            >
              <div style={styles.mobileButtonContent}>
                {activeTabData && (
                  <>
                    <activeTabData.icon size={18} />
                    <span style={{ fontWeight: theme.fontWeights.medium }}>
                      {activeTabData.label}
                    </span>
                    {activeTabData.badge && activeTabData.badge > 0 && (
                      <div style={styles.badge}>
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
                  style={styles.mobileDropdown}
                >
                  {tabs.map((tab, index) => (
                    <motion.div
                      key={tab.id}
                      onClick={() => {
                        if (!tab.disabled) {
                          onTabChange(tab.id);
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      style={{
                        ...styles.mobileDropdownItem,
                        backgroundColor: isTabActive(tab.id) ? theme.colors.surfaceElevated : 'transparent',
                        color: tab.disabled ? theme.colors.textTertiary : 
                               isTabActive(tab.id) ? theme.colors.primary : theme.colors.textPrimary,
                        cursor: tab.disabled ? 'not-allowed' : 'pointer',
                        borderBottom: index === tabs.length - 1 ? 'none' : `1px solid ${theme.colors.borderLight}`,
                      }}
                      whileHover={tab.disabled ? {} : { backgroundColor: theme.colors.surfaceHover }}
                    >
                      <tab.icon size={18} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: theme.fontWeights.medium }}>
                          {tab.label}
                        </div>
                        {tab.description && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: theme.colors.textTertiary,
                            marginTop: '0.125rem',
                          }}>
                            {tab.description}
                          </div>
                        )}
                      </div>
                      {tab.badge && tab.badge > 0 && (
                        <div style={styles.badge}>
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
          // Vista Desktop
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={styles.tabContainer}
          >
            {tabs.map((tab) => renderTabButton(tab))}
          </motion.div>
        )}

        {/* Indicador de contenido activo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={styles.contentIndicator}
        >
          <div style={styles.activeDot} />
          <span style={styles.indicatorText}>
            {activeTabData?.label}
          </span>
        </motion.div>
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
    </>
  );
}