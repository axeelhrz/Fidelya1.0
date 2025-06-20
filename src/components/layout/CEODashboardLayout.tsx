'use client';

import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import DashboardLayout from './DashboardLayout';
import CEOTopbar from './CEOTopbar';
import RightDock from './RightDock';
import FooterInsights from './FooterInsights';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';
import { CEOTask } from '@/types/ceo';

interface CEODashboardLayoutProps {
  children: React.ReactNode;
}

export default function CEODashboardLayout({ children }: CEODashboardLayoutProps) {
  const theme = useTheme();
  const [currentMode, setCurrentMode] = useState<'admin' | 'therapist'>('admin');
  const [selectedCenter, setSelectedCenter] = useState('center-1');
  
  const ceoMetrics = useCEOMetrics();

  const handleModeToggle = () => {
    setCurrentMode(prev => prev === 'admin' ? 'therapist' : 'admin');
  };

  const handleCenterChange = (centerId: string) => {
    setSelectedCenter(centerId);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<CEOTask>) => {
    console.log('Updating task:', taskId, updates);
    // Here you would implement the actual task update logic
  };

  const handleTaskCreate = () => {
    console.log('Creating new task');
    // Here you would implement the task creation logic
  };

  const handleAlertDismiss = (alertId: string) => {
    console.log('Dismissing alert:', alertId);
    // Here you would implement the alert dismissal logic
  };

  if (currentMode === 'therapist') {
    // Return regular dashboard layout for therapist mode
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* CEO Topbar */}
      <CEOTopbar
        onModeToggle={handleModeToggle}
        currentMode={currentMode}
        onCenterChange={handleCenterChange}
        selectedCenter={selectedCenter}
      />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Left Sidebar - Use existing DashboardLayout sidebar */}
        <DashboardLayout>
          <Box
            sx={{
              flex: 1,
              mr: '380px', // Make room for right dock
              minHeight: 'calc(100vh - 80px)',
              background: theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, #0f0f23 0%, #1a1d29 100%)'
                : 'linear-gradient(135deg, #fafbff 0%, #f0f4ff 100%)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme.palette.mode === 'dark' 
                  ? 'radial-gradient(circle at 70% 30%, rgba(120, 119, 198, 0.05) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 70% 30%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
                pointerEvents: 'none',
              }
            }}
          >
            <Box position="relative" zIndex={1}>
              {children}
            </Box>
          </Box>
        </DashboardLayout>

        {/* Right Dock */}
        <RightDock
          criticalAlerts={ceoMetrics.criticalAlerts}
          importantAlerts={ceoMetrics.importantAlerts}
          tasks={ceoMetrics.tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreate={handleTaskCreate}
          onAlertDismiss={handleAlertDismiss}
        />
      </Box>

      {/* Footer Insights */}
      <FooterInsights
        aiInsights={ceoMetrics.aiInsights}
        complianceMetrics={ceoMetrics.complianceMetrics}
        loading={ceoMetrics.loading}
      />
    </Box>
  );
}
