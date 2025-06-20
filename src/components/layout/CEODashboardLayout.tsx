'use client';

import React, { useState } from 'react';
import { Box, useTheme, Fab, Tooltip } from '@mui/material';
import { Mic, MicOff } from '@mui/icons-material';
import DashboardLayout from './DashboardLayout';
import CEOTopbar from './CEOTopbar';
import FooterInsights from './FooterInsights';
import VoiceCommandInterface from '@/components/ceo/VoiceCommandInterface';
import { useCEOMetrics } from '@/hooks/useCEOMetrics';

interface CEODashboardLayoutProps {
  children: React.ReactNode;
}

export default function CEODashboardLayout({ children }: CEODashboardLayoutProps) {
  const theme = useTheme();
  const [currentMode, setCurrentMode] = useState<'admin' | 'therapist'>('admin');
  const [selectedCenter, setSelectedCenter] = useState('center-1');
  const [voiceCommandOpen, setVoiceCommandOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const ceoMetrics = useCEOMetrics();

  const handleModeToggle = () => {
    setCurrentMode(prev => prev === 'admin' ? 'therapist' : 'admin');
  };

  const handleCenterChange = (centerId: string) => {
    setSelectedCenter(centerId);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      setVoiceCommandOpen(false);
    } else {
      setIsListening(true);
      setVoiceCommandOpen(true);
    }
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
              minHeight: 'calc(100vh - 80px)',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #0f0f23 0%, #1a1d29 100%)'
                : 'linear-gradient(135deg, #F2EDEA 0%, #f0f4ff 100%)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme.palette.mode === 'dark' 
                  ? 'radial-gradient(circle at 70% 30%, rgba(165, 147, 243, 0.05) 0%, transparent 50%)'
                  : 'radial-gradient(circle at 70% 30%, rgba(93, 79, 176, 0.03) 0%, transparent 50%)',
                pointerEvents: 'none',
              }
            }}
          >
            <Box position="relative" zIndex={1}>
              {children}
            </Box>
          </Box>
        </DashboardLayout>
      </Box>

      {/* Voice Command FAB */}
      <Tooltip title={isListening ? "Detener comando de voz" : "Activar comando de voz"}>
        <Fab
          color={isListening ? "secondary" : "primary"}
          sx={{
            position: 'fixed',
            bottom: 140,
            right: 24,
            zIndex: 1300,
            background: isListening 
              ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              transform: 'scale(1.1)',
            },
            animation: isListening ? 'pulse 2s infinite' : 'none',
          }}
          onClick={handleVoiceToggle}
        >
          {isListening ? <MicOff /> : <Mic />}
        </Fab>
      </Tooltip>

      {/* Footer Insights */}
      <FooterInsights
        aiInsights={ceoMetrics.aiInsights}
        complianceMetrics={ceoMetrics.complianceMetrics}
        loading={ceoMetrics.loading}
      />

      {/* Voice Command Interface */}
      <VoiceCommandInterface
        open={voiceCommandOpen}
        onClose={() => {
          setVoiceCommandOpen(false);
          setIsListening(false);
        }}
      />

      {/* Pulse animation for voice FAB */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(93, 79, 176, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(93, 79, 176, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(93, 79, 176, 0);
          }
        }
      `}</style>
    </Box>
  );
}