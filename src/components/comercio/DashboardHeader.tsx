'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useComercios } from '@/hooks/useComercios';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Store, Calendar } from 'lucide-react';

export const DashboardHeader: React.FC = () => {
  const { comercio } = useComercios();
  
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: es });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ marginBottom: '40px' }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Welcome Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Logo/Avatar */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ position: 'relative' }}
          >
            {comercio?.logoUrl ? (
              <img
                src={comercio.logoUrl}
                alt={`Logo de ${comercio.nombreComercio}`}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '2px solid white',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
            ) : (
              <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#06b6d4',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}>
                <Store style={{ width: '24px', height: '24px', color: 'white' }} />
              </div>
            )}
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              backgroundColor: '#10b981',
              borderRadius: '50%',
              border: '2px solid white'
            }} />
          </motion.div>

          {/* Welcome Text */}
          <div style={{ flex: 1 }}>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: '4px',
                lineHeight: 1.2
              }}
            >
              Hola, {comercio?.nombreComercio || 'Comercio'} 👋
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                fontSize: '16px',
                color: '#64748b',
                fontWeight: 500
              }}
            >
              Este es el resumen de tu actividad en Fidelitá.
            </motion.p>
          </div>

          {/* Date Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#8b5cf6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '2px'
              }}>
                Hoy
              </p>
              <p style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b'
              }}>
                {capitalizedToday}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            align-items: flex-start;
          }
          .date-section {
            align-self: stretch;
          }
        }
      `}</style>
    </motion.div>
  );
};