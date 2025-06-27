'use client';

import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMenuClick = (section: string) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarComponent
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
        onMenuClick={handleMenuClick}
        activeSection={activeSection}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          bgcolor: '#fafbfc',
          background: 'linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)',
          position: 'relative',
          overflow: 'hidden',
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
            backgroundSize: '800px 800px, 600px 600px, 20px 20px'
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};