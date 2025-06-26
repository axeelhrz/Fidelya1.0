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
import { Shield, Loader2 } from 'lucide-react';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
    position: 'relative' as const,
    overflow: 'hidden'
  },
  backgroundPattern: {
    position: 'fixed' as const,
    inset: 0,
    opacity: 0.4,
    zIndex: 0
  },
  backgroundGradients: {
    position: 'absolute' as const,
    inset: 0,
    background: `
      radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
    `,
    backgroundSize: '800px 800px, 600px 600px'
  },
  backgroundDots: {
    position: 'absolute' as const,
    inset: 0,
    background: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)',
    backgroundSize: '20px 20px'
  },
  content: {
    position: 'relative' as const,
    zIndex: 10
  },
  innerContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1.5rem'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    marginBottom: '2rem'
  },
  mainGridLg: {
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '2fr 1fr'
    }
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem'
  },
  loadingScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  loadingContent: {
    textAlign: 'center' as const
  },
  loadingSpinner: {
    width: '5rem',
    height: '5rem',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #06b6d4',
    borderRight: '4px solid #0891b2',
    borderRadius: '50%',
    animation: 'spin 1.5s linear infinite',
    margin: '0 auto 2rem'
  },
  loadingTitle: {
    fontSize: '1.875rem',
    fontWeight: 900,
    color: '#0f172a',
    marginBottom: '1rem'
  },
  loadingMessage: {
    fontSize: '1.125rem',
    color: '#64748b',
    fontWeight: 500
  },
  accessDeniedScreen: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
  },
  accessDeniedContent: {
    textAlign: 'center' as const,
    maxWidth: '28rem',
    margin: '0 1rem'
  },
  accessDeniedIcon: {
    width: '6rem',
    height: '6rem',
    backgroundColor: '#fee2e2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem'
  },
  accessDeniedTitle: {
    fontSize: '1.875rem',
    fontWeight: 900,
    color: '#0f172a',
    marginBottom: '1rem'
  },
  accessDeniedMessage: {
    fontSize: '1.125rem',
    color: '#64748b',
    marginBottom: '2rem'
  }
};

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div style={styles.loadingScreen}>
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={styles.loadingContent}
    >
      <div style={styles.loadingSpinner} />
      <h1 style={styles.loadingTitle}>
        Cargando Panel de Control
      </h1>
      <p style={styles.loadingMessage}>
        {message}
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  </div>
);

const AccessDeniedScreen: React.FC = () => (
  <div style={styles.accessDeniedScreen}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={styles.accessDeniedContent}
    >
      <div style={styles.accessDeniedIcon}>
        <Shield style={{ width: '3rem', height: '3rem', color: '#ef4444' }} />
      </div>
      
      <h1 style={styles.accessDeniedTitle}>
        Acceso Restringido
      </h1>
      <p style={styles.accessDeniedMessage}>
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

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <AccessDeniedScreen />;
  }

  if (loading) {
    return <LoadingScreen message="Preparando tu panel de control comercial..." />;
  }

  return (
    <div style={styles.container}>
      {/* Background Pattern */}
      <div style={styles.backgroundPattern}>
        <div style={styles.backgroundGradients} />
        <div style={styles.backgroundDots} />
      </div>

      <div style={styles.content}>
        <div style={styles.innerContainer}>
          {/* Header */}
          <DashboardHeader />

          {/* Stats Cards */}
          <div style={{ marginBottom: '2rem' }}>
            <StatsCards />
          </div>

          {/* Main Content Grid */}
          <div style={{
            ...styles.mainGrid,
            '@media (min-width: 1024px)': {
              gridTemplateColumns: '2fr 1fr'
            }
          }}>
            {/* Left Column - Charts */}
            <div style={styles.leftColumn}>
              <ValidationsChart />
              <TopBenefits />
            </div>

            {/* Right Column - Alerts & Quick Actions */}
            <div style={styles.rightColumn}>
              <Alerts />
              <QuickActions />
            </div>
          </div>

          {/* Recent Validations */}
          <RecentValidations />
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .main-grid {
            grid-template-columns: 2fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}