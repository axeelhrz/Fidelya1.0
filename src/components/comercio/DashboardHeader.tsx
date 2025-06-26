'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useComercios } from '@/hooks/useComercios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Store, Calendar } from 'lucide-react';

const styles = {
  container: {
    marginBottom: '2rem'
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  flexContainerLg: {
    '@media (min-width: 1024px)': {
      flexDirection: 'row' as const,
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  },
  welcomeSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logoContainer: {
    position: 'relative' as const
  },
  logoImage: {
    width: '4rem',
    height: '4rem',
    borderRadius: '1rem',
    objectFit: 'cover' as const,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: '2px solid white'
  },
  logoPlaceholder: {
    width: '4rem',
    height: '4rem',
    background: 'linear-gradient(135deg, #06b6d4 0%, #1e40af 100%)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  },
  statusIndicator: {
    position: 'absolute' as const,
    bottom: '-0.25rem',
    right: '-0.25rem',
    width: '1.5rem',
    height: '1.5rem',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    border: '2px solid white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusDot: {
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '50%'
  },
  welcomeText: {
    flex: 1
  },
  welcomeTitle: {
    fontSize: '1.875rem',
    fontWeight: 900,
    color: '#0f172a',
    marginBottom: '0.5rem',
    lineHeight: 1.2
  },
  welcomeTitleLg: {
    '@media (min-width: 1024px)': {
      fontSize: '2.25rem'
    }
  },
  welcomeSubtitle: {
    fontSize: '1.125rem',
    color: '#64748b',
    fontWeight: 500
  },
  dateSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    borderRadius: '1rem',
    padding: '1rem 1.5rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(148, 163, 184, 0.2)'
  },
  dateIcon: {
    width: '2.5rem',
    height: '2.5rem',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateContent: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  dateLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },
  dateValue: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#0f172a'
  }
};

export const DashboardHeader: React.FC = () => {
  const { comercio } = useComercios();
  
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={styles.container}
    >
      <div style={{
        ...styles.flexContainer,
        '@media (min-width: 1024px)': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }
      }}>
        {/* Welcome Section */}
        <div style={styles.welcomeSection}>
          {/* Logo/Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={styles.logoContainer}
          >
            {comercio?.logoUrl ? (
              <img
                src={comercio.logoUrl}
                alt={`Logo de ${comercio.nombreComercio}`}
                style={styles.logoImage}
              />
            ) : (
              <div style={styles.logoPlaceholder}>
                <Store style={{ width: '2rem', height: '2rem', color: 'white' }} />
              </div>
            )}
            <div style={styles.statusIndicator}>
              <div style={styles.statusDot} />
            </div>
          </motion.div>

          {/* Welcome Text */}
          <div style={styles.welcomeText}>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                ...styles.welcomeTitle,
                '@media (min-width: 1024px)': {
                  fontSize: '2.25rem'
                }
              }}
            >
              Hola, {comercio?.nombreComercio || 'Comercio'} 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={styles.welcomeSubtitle}
            >
              Este es el resumen de tu actividad en Fidelitá.
            </motion.p>
          </div>
        </div>

        {/* Date Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={styles.dateSection}
        >
          <div style={styles.dateIcon}>
            <Calendar style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </div>
          <div style={styles.dateContent}>
            <p style={styles.dateLabel}>
              Hoy
            </p>
            <p style={styles.dateValue}>
              {capitalizedToday}
            </p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .flex-container-lg {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
          .welcome-title-lg {
            font-size: 2.25rem;
          }
        }
      `}</style>
    </motion.div>
  );
};