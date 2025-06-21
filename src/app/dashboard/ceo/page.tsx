'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  Heart, 
  Target, 
  Brain, 
  TrendingUp, 
  Sparkles,
  Activity,
  Users,
  Zap,
  Download,
  Bell
} from 'lucide-react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Paper
} from '@mui/material';

import Topbar from '@/components/dashboard/Topbar';
import TabNavigation from '@/components/dashboard/TabNavigation';
import KPIGrid from '@/components/dashboard/KPIGrid';
import FinancialPanel from '@/components/dashboard/FinancialPanel';
import ClinicalPanel from '@/components/dashboard/ClinicalPanel';
import CommercialPanel from '@/components/dashboard/CommercialPanel';
import AlertsTasksDock from '@/components/dashboard/AlertsTasksDock';
import AIInsightsFooter from '@/components/dashboard/AIInsightsFooter';
import KPICardProfessional from '@/components/dashboard/KPICardProfessional';
import ButtonProfessional from '@/components/ui/ButtonProfessional';

export default function CEODashboard() {
  const [activeTab, setActiveTab] = useState('executive');

  // Usuario mock para desarrollo
  const mockUser = {
    name: 'Dr. Carlos Mendoza',
    email: 'carlos.mendoza@centropsicologico.com',
    role: 'admin'
  };

  const tabs = [
    {
      id: 'executive',
      label: 'Resumen Ejecutivo',
      icon: BarChart3,
      description: 'KPIs principales'
    },
    {
      id: 'financial',
      label: 'Análisis Financiero',
      icon: DollarSign,
      description: 'Métricas económicas'
    },
    {
      id: 'clinical',
      label: 'Operaciones Clínicas',
      icon: Heart,
      description: 'Salud operativa'
    },
    {
      id: 'commercial',
      label: 'Marketing & Comercial',
      icon: Target,
      description: 'Conversión y campañas'
    },
    {
      id: 'insights',
      label: 'Insights & IA',
      icon: Brain,
      description: 'Recomendaciones inteligentes'
    }
  ];

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
  };

  const handleCenterChange = (centerId: string) => {
    console.log('Changing to center:', centerId);
  };

  const handleDownloadBrief = () => {
    console.log('Downloading daily brief...');
  };

  const renderTabContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
      },
      exit: { 
        opacity: 0, 
        y: -20,
        transition: { duration: 0.3 }
      }
    };

    switch (activeTab) {
      case 'executive':
        return (
          <motion.div
            key="executive"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Box sx={{ mb: 6 }}>
              {/* Welcome Section Profesional */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                            borderRadius: '50%',
                            mr: 2,
                            boxShadow: '0 0 20px rgba(36, 99, 235, 0.3)'
                          }} 
                        />
                      </motion.div>
                      <Typography 
                        variant="h1" 
                        sx={{ 
                          background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          fontFamily: 'var(--font-family-space-grotesk)',
                          fontSize: { xs: '2.5rem', md: '3.5rem' },
                          fontWeight: 700,
                          mr: 2
                        }}
                      >
                        Buenos días, {mockUser.name}
                      </Typography>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles style={{ width: 28, height: 28, color: '#2463EB' }} />
                      </motion.div>
                    </Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        maxWidth: '600px',
                        fontFamily: 'var(--font-family-inter)'
                      }}
                    >
                      Resumen ejecutivo del estado actual de tu centro psicológico con insights en tiempo real
                    </Typography>
                  </Box>
                  
                  {/* Status Cards */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 3,
                          borderRadius: '1rem',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        }}
                      >
                        <Box 
                          sx={{ 
                            width: 16, 
                            height: 16, 
                            backgroundColor: '#10B981', 
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                          }} 
                        />
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#10B981', 
                              fontWeight: 700,
                              fontFamily: 'var(--font-family-space-grotesk)',
                              fontSize: '1.125rem'
                            }}
                          >
                            Sistema Operativo
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(16, 185, 129, 0.7)',
                              fontSize: '0.875rem'
                            }}
                          >
                            Todos los servicios activos
                          </Typography>
                        </Box>
                      </Paper>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 3,
                          borderRadius: '1rem',
                          border: '1px solid rgba(36, 99, 235, 0.2)',
                          backgroundColor: 'rgba(36, 99, 235, 0.05)',
                        }}
                      >
                        <Activity style={{ width: 24, height: 24, color: '#2463EB' }} />
                        <Box>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#2463EB', 
                              fontWeight: 700,
                              fontFamily: 'var(--font-family-space-grotesk)',
                              fontSize: '1.125rem'
                            }}
                          >
                            IA Activa
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'rgba(36, 99, 235, 0.7)',
                              fontSize: '0.875rem'
                            }}
                          >
                            Análisis en tiempo real
                          </Typography>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Box>
                </Box>

                {/* Quick Performance Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <Grid container spacing={3} sx={{ mb: 6 }}>
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 4,
                          borderRadius: '1.5rem',
                          textAlign: 'center',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
                          }
                        }}
                      >
                        <TrendingUp style={{ width: 32, height: 32, color: '#10B981', marginBottom: 16 }} />
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            color: '#10B981', 
                            fontWeight: 700,
                            fontFamily: 'var(--font-family-space-grotesk)',
                            mb: 1
                          }}
                        >
                          +12.5%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Crecimiento mensual
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 4,
                          borderRadius: '1.5rem',
                          textAlign: 'center',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
                          }
                        }}
                      >
                        <Zap style={{ width: 32, height: 32, color: '#2463EB', marginBottom: 16 }} />
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            color: '#2463EB', 
                            fontWeight: 700,
                            fontFamily: 'var(--font-family-space-grotesk)',
                            mb: 1
                          }}
                        >
                          87.3%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Eficiencia operativa
                        </Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 4,
                          borderRadius: '1.5rem',
                          textAlign: 'center',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
                          }
                        }}
                      >
                        <Users style={{ width: 32, height: 32, color: '#F59E0B', marginBottom: 16 }} />
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            color: '#F59E0B', 
                            fontWeight: 700,
                            fontFamily: 'var(--font-family-space-grotesk)',
                            mb: 1
                          }}
                        >
                          94.2%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Satisfacción pacientes
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </motion.div>

                {/* Daily Brief Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <ButtonProfessional
                      variant="primary"
                      icon={Download}
                      onClick={handleDownloadBrief}
                    >
                      Descargar Resumen Diario PDF
                    </ButtonProfessional>
                  </Box>
                </motion.div>
              </Box>

              {/* KPI Grid */}
              <KPIGrid />
            </Box>
          </motion.div>
        );

      case 'financial':
        return (
          <motion.div
            key="financial"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-family-space-grotesk)',
                  mb: 2
                }}
              >
                Análisis Financiero Detallado
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '600px', 
                  mx: 'auto',
                  fontFamily: 'var(--font-family-inter)',
                  fontWeight: 400
                }}
              >
                Métricas financieras completas con proyecciones inteligentes y análisis de rentabilidad
              </Typography>
            </Box>
            <FinancialPanel />
          </motion.div>
        );

      case 'clinical':
        return (
          <motion.div
            key="clinical"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-family-space-grotesk)',
                  mb: 2
                }}
              >
                Operaciones Clínicas
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '600px', 
                  mx: 'auto',
                  fontFamily: 'var(--font-family-inter)',
                  fontWeight: 400
                }}
              >
                Monitoreo inteligente de salud operativa, riesgos y capacidad del centro
              </Typography>
            </Box>
            <ClinicalPanel />
          </motion.div>
        );

      case 'commercial':
        return (
          <motion.div
            key="commercial"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-family-space-grotesk)',
                  mb: 2
                }}
              >
                Marketing & Comercial
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '600px', 
                  mx: 'auto',
                  fontFamily: 'var(--font-family-inter)',
                  fontWeight: 400
                }}
              >
                Análisis completo de conversión, campañas y adquisición de pacientes
              </Typography>
            </Box>
            <CommercialPanel />
          </motion.div>
        );

      case 'insights':
        return (
          <motion.div
            key="insights"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-family-space-grotesk)',
                  mb: 2
                }}
              >
                Insights & Inteligencia Artificial
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  maxWidth: '600px', 
                  mx: 'auto',
                  fontFamily: 'var(--font-family-inter)',
                  fontWeight: 400
                }}
              >
                Recomendaciones inteligentes y análisis predictivo para optimizar tu centro
              </Typography>
            </Box>
            <AIInsightsFooter />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #EFF3FB 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Efectos de fondo sutiles */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '12px',
            height: '12px',
            background: 'rgba(36, 99, 235, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '30%',
            right: '15%',
            width: '8px',
            height: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse',
          }
        }}
      />

      {/* Topbar */}
      <Topbar onSearch={handleSearch} onCenterChange={handleCenterChange} />
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* Left Column - Main Dashboard */}
          <Grid item xs={12} lg={9}>
            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ mb: 6 }}>
                <TabNavigation 
                  tabs={tabs} 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                />
              </Box>
            </motion.div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </Grid>

          {/* Right Column - Alerts & Tasks Dock */}
          <Grid item xs={12} lg={3}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Box sx={{ position: 'sticky', top: 120 }}>
                <AlertsTasksDock />
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button Profesional */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.1, y: -4 }}
          whileTap={{ scale: 0.9 }}
        >
          <Paper
            elevation={3}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(36, 99, 235, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 0 30px rgba(36, 99, 235, 0.6)',
              }
            }}
          >
            <Sparkles style={{ width: 40, height: 40, color: '#FFFFFF' }} />
          </Paper>
        </motion.div>
      </motion.div>
    </Box>
  );
}