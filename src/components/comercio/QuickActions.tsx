'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  QrCode, 
  FileText, 
  User, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export const QuickActions: React.FC = () => {
  const router = useRouter();

  const quickActions = [
    {
      id: 'new-benefit',
      title: 'Publicar nuevo beneficio',
      description: 'Creá un beneficio para tus socios',
      icon: Plus,
      color: '#10b981',
      path: '/dashboard/comercio/beneficios'
    },
    {
      id: 'qr-code',
      title: 'Ver o descargar QR',
      description: 'Gestioná tu código QR',
      icon: QrCode,
      color: '#06b6d4',
      path: '/dashboard/comercio/qr'
    },
    {
      id: 'validations',
      title: 'Ver historial completo',
      description: 'Todas las validaciones',
      icon: FileText,
      color: '#8b5cf6',
      path: '/dashboard/comercio/validaciones'
    },
    {
      id: 'profile',
      title: 'Editar perfil',
      description: 'Actualizá tu información',
      icon: User,
      color: '#f59e0b',
      path: '/dashboard/comercio/perfil'
    }
  ];

  const handleAction = (path: string) => {
    router.push(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#6366f1',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Zap style={{ width: '20px', height: '20px', color: 'white' }} />
        </div>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '2px'
          }}>
            Accesos rápidos
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#64748b'
          }}>
            Acciones frecuentes
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAction(action.path)}
              style={{
                width: '100%',
                textAlign: 'left',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'transparent'
              }}
            >
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s ease'
                  }}>
                    <IconComponent style={{ width: '20px', height: '20px', color: 'white' }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{
                      fontWeight: 600,
                      color: '#1e293b',
                      marginBottom: '2px',
                      fontSize: '14px'
                    }}>
                      {action.title}
                    </h4>
                    <p style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div style={{
                    color: '#94a3b8',
                    transition: 'all 0.2s ease'
                  }}>
                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
