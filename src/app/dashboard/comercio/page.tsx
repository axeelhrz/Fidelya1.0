'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useComercios } from '@/hooks/useComercios';
import { useBeneficios } from '@/hooks/useBeneficios';
import { useValidaciones } from '@/hooks/useValidaciones';
import { DashboardHeader } from '@/components/comercio/DashboardHeader';
import { StatsCards } from '@/components/comercio/StatsCards';
import { ValidationsChart } from '@/components/comercio/ValidationsChart';
import { TopBenefits } from '@/components/comercio/TopBenefits';
import { Alerts } from '@/components/comercio/Alerts';
import { RecentValidations } from '@/components/comercio/RecentValidations';
import { QuickActions } from '@/components/comercio/QuickActions';
import { Shield } from 'lucide-react';

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafbfc'
  }}>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ textAlign: 'center' }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #06b6d4',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 24px'
      }} />
      <h1 style={{
        fontSize: '24px',
        fontWeight: 600,
        color: '#1e293b',
        marginBottom: '8px'
      }}>
        Cargando Panel de Control
      </h1>
      <p style={{
        fontSize: '16px',
        color: '#64748b'
      }}>
        {message}
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  </div>
);

const AccessDeniedScreen: React.FC = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafbfc'
  }}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        textAlign: 'center',
        maxWidth: '400px',
        padding: '0 24px'
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        backgroundColor: '#fef2f2',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px'
      }}>
        <Shield style={{ width: '32px', height: '32px', color: '#ef4444' }} />
      </div>
      
      <h1 style={{
        fontSize: '24px',
        fontWeight: 600,
        color: '#1e293b',
        marginBottom: '8px'
      }}>
        Acceso Restringido
      </h1>
      <p style={{
        fontSize: '16px',
        color: '#64748b'
      }}>
        Necesitas permisos de comercio para acceder a este panel de control.
      </p>
    </motion.div>
  </div>
);

export default function ComercioDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { comercio, loading: comercioLoading } = useComercios();
  const { loading: beneficiosLoading } = useBeneficios();
  const { loading: validacionesLoading } = useValidaciones();

  const loading = authLoading || comercioLoading || beneficiosLoading || validacionesLoading;

  if (!authLoading && !user) {
    return <AccessDeniedScreen />;
  }

  if (loading) {
    return <LoadingScreen message="Preparando tu panel de control comercial..." />;
  }

  const mainGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '32px',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '2fr 1fr'
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafbfc'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards */}
        <div style={{ marginBottom: '32px' }}>
          <StatsCards />
        </div>

        {/* Main Content Grid */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr',
            gap: '32px'
          }}>
            {/* Left Column - Charts */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}>
              <ValidationsChart />
              <TopBenefits />
            </div>

            {/* Right Column - Alerts & Quick Actions */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '32px'
            }}>
              <Alerts />
              <QuickActions />
            </div>
          </div>
        </div>

        {/* Recent Validations */}
        <RecentValidations />
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 2fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}