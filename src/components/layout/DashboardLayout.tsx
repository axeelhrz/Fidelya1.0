'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardSidebar } from './DashboardSidebar';
import { Menu, X } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  onMenuClick: (section: string) => void;
  activeSection: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  sidebarComponent?: React.ComponentType<SidebarProps>;
}

const SIDEBAR_WIDTH = 320;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeSection = 'overview',
  onSectionChange,
  sidebarComponent: SidebarComponent = DashboardSidebar
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Handle responsive breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const tablet = width >= 768 && width < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Auto-open sidebar on desktop
      if (width >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    // Auto-close sidebar on mobile after selection
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Calculate main content styles based on screen size and sidebar state
  const getMainContentStyles = () => {
    if (isMobile) {
      return {
        marginLeft: 0,
        width: '100%',
      };
    }
    
    if (isTablet) {
      return {
        marginLeft: sidebarOpen ? SIDEBAR_COLLAPSED_WIDTH : 0,
        width: sidebarOpen ? `calc(100% - ${SIDEBAR_COLLAPSED_WIDTH}px)` : '100%',
      };
    }
    
    return {
      marginLeft: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
      width: sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : `calc(100% - ${SIDEBAR_COLLAPSED_WIDTH}px)`,
    };
  };

  const mainContentStyles = getMainContentStyles();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        <div className="absolute inset-0 bg-grid bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Header */}
      {isMobile && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSidebarToggle}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Panel Comercial
              </h1>
            </div>
            
            {/* Mobile Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleMenuClick('qr-validacion')}
                className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <>
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Sidebar Container */}
            <motion.div
              initial={isMobile ? { x: -SIDEBAR_WIDTH } : false}
              animate={isMobile ? { x: 0 } : false}
              exit={isMobile ? { x: -SIDEBAR_WIDTH } : false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                ${isMobile ? 'fixed' : 'fixed'} 
                top-0 left-0 h-full z-50
                ${isMobile ? 'w-80' : sidebarOpen ? `w-[${SIDEBAR_WIDTH}px]` : `w-[${SIDEBAR_COLLAPSED_WIDTH}px]`}
                transition-all duration-300 ease-in-out
              `}
              style={{
                width: isMobile ? 320 : sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH
              }}
            >
              <div className="h-full bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-2xl">
                <SidebarComponent
                  open={isMobile ? true : sidebarOpen}
                  onToggle={handleSidebarToggle}
                  onMenuClick={handleMenuClick}
                  activeSection={activeSection}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <motion.main
        className="flex-1 relative z-10 min-h-screen"
        style={mainContentStyles}
        animate={mainContentStyles}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Content Container */}
        <div className={`
          h-full overflow-auto
          ${isMobile ? 'pt-20' : 'pt-0'}
        `}>
          {/* Scrollable Content */}
          <div className="min-h-full">
            {children}
          </div>
        </div>

        {/* Scroll to Top Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="fixed bottom-6 right-6 p-3 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      </motion.main>

      {/* Responsive Breakpoint Indicator (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
        </div>
      )}
    </div>
  );
};