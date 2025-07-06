'use client';

import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { DashboardSidebar } from './DashboardSidebar';

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

const SIDEBAR_WIDTH = 280;
const SIDEBAR_COLLAPSED_WIDTH = 80;

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeSection = 'overview',
  onSectionChange,
  sidebarComponent: SidebarComponent = DashboardSidebar
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

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

  // Calculate main content width based on screen size and sidebar state
  const getMainContentStyles = () => {
    if (isMobile) {
      return {
        width: '100%',
        marginLeft: 0,
      };
    }
    
    if (isTablet) {
      return {
        width: sidebarOpen ? `calc(100% - ${SIDEBAR_COLLAPSED_WIDTH}px)` : '100%',
        marginLeft: sidebarOpen ? `${SIDEBAR_COLLAPSED_WIDTH}px` : 0,
      };
    }
    
    return {
      width: sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : `calc(100% - ${SIDEBAR_COLLAPSED_WIDTH}px)`,
      marginLeft: sidebarOpen ? `${SIDEBAR_WIDTH}px` : `${SIDEBAR_COLLAPSED_WIDTH}px`,
    };
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Sidebar */}
      <Box
        sx={{
          position: isMobile ? 'fixed' : 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: theme.zIndex.drawer + 1,
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: theme.transitions.create(['transform', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <SidebarComponent
          open={sidebarOpen}
          onToggle={handleSidebarToggle}
          onMenuClick={handleMenuClick}
          activeSection={activeSection}
        />
      </Box>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.drawer,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...getMainContentStyles(),
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          bgcolor: '#fafbfc',
          background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)
            `,
            backgroundSize: {
              xs: '400px 400px, 300px 300px, 15px 15px',
              md: '800px 800px, 600px 600px, 20px 20px'
            }
          }}
        />
        
        <Box 
          sx={{ 
            position: 'relative', 
            zIndex: 1, 
            height: '100%',
            overflow: 'auto',
            // Add responsive padding
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};