'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Trash2, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { seedFirebaseData, clearFirebaseData } from '@/lib/seedData';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function DataSeeder() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeedData = async () => {
    if (!user?.centerId) {
      setStatus('error');
      setMessage('No hay centro asignado');
      return;
    }

    try {
      setLoading(true);
      setStatus('idle');
      setMessage('Sembrando datos en Firebase...');
      
      await seedFirebaseData(user.centerId);
      
      setStatus('success');
      setMessage('Datos sembrados exitosamente. El dashboard ahora mostrará información real.');
    } catch (error) {
      setStatus('error');
      setMessage(`Error sembrando datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!user?.centerId) {
      setStatus('error');
      setMessage('No hay centro asignado');
      return;
    }

    if (!confirm('¿Estás seguro de que quieres limpiar todos los datos? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setLoading(true);
      setStatus('idle');
      setMessage('Limpiando datos...');
      
      await clearFirebaseData();
      
      setStatus('success');
      setMessage('Datos limpiados. Usa Firebase Console para verificar.');
    } catch (error) {
      setStatus('error');
      setMessage(`Error limpiando datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle size={20} color="#10B981" />;
      case 'error':
        return <AlertCircle size={20} color="#EF4444" />;
      default:
        return <Database size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '2rem'
      }}
    >
      <Card variant="default">
        <div style={{ padding: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1rem',
              borderRadius: '1rem',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={24} color="#3B82F6" />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1C1E21',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Gestión de Datos de Desarrollo
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#6B7280',
                margin: '0.25rem 0 0 0'
              }}>
                Herramientas para poblar Firebase con datos de ejemplo
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              borderRadius: '1rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#1C1E21',
                margin: '0 0 0.5rem 0'
              }}>
                Datos que se crearán:
              </h3>
              <ul style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                paddingLeft: '1.25rem'
              }}>
                <li>3 Terapeutas con horarios</li>
                <li>3 Pacientes con historiales</li>
                <li>150 Sesiones (6 meses)</li>
                <li>80 Pagos con diferentes estados</li>
                <li>60 Gastos categorizados</li>
                <li>100 Leads de marketing</li>
                <li>2 Campañas publicitarias</li>
                <li>4 Alertas del sistema</li>
                <li>4 Tareas pendientes</li>
                <li>2 Evaluaciones clínicas</li>
              </ul>
            </div>

            <div style={{
              padding: '1.5rem',
              borderRadius: '1rem',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: 600,
                color: '#92400E',
                margin: '0 0 0.5rem 0'
              }}>
                ⚠️ Importante:
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: '#92400E',
                margin: 0,
                lineHeight: 1.5
              }}>
                Estos datos son solo para desarrollo y testing. 
                No uses esta función en un entorno de producción. 
                Asegúrate de tener configurado Firebase correctamente.
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="primary"
              icon={Upload}
              onClick={handleSeedData}
              loading={loading}
              disabled={loading}
            >
              Sembrar Datos de Ejemplo
            </Button>

            <Button
              variant="outline"
              icon={Trash2}
              onClick={handleClearData}
              disabled={loading}
            >
              Limpiar Datos
            </Button>

            <Button
              variant="secondary"
              icon={Download}
              onClick={() => window.open('https://console.firebase.google.com', '_blank')}
            >
              Abrir Firebase Console
            </Button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem',
                borderRadius: '0.75rem',
                backgroundColor: status === 'success' ? '#ECFDF5' : status === 'error' ? '#FEF2F2' : '#F8FAFC',
                border: `1px solid ${status === 'success' ? '#D1FAE5' : status === 'error' ? '#FECACA' : '#E2E8F0'}`,
                color: getStatusColor()
              }}
            >
              {getStatusIcon()}
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {message}
              </span>
            </motion.div>
          )}

          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            borderRadius: '1rem',
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#334155',
              margin: '0 0 1rem 0'
            }}>
              Instrucciones de uso:
            </h3>
            <ol style={{
              fontSize: '0.875rem',
              color: '#475569',
              margin: 0,
              paddingLeft: '1.25rem',
              lineHeight: 1.6
            }}>
              <li>Asegúrate de tener configurado Firebase en tu proyecto</li>
              <li>Verifica que las variables de entorno estén configuradas</li>
              <li>Haz clic en &quot;Sembrar Datos de Ejemplo&quot; para crear datos de prueba</li>
              <li>Ve al dashboard CEO para ver los datos en acción</li>
              <li>Usa &quot;Limpiar Datos&quot; si necesitas empezar de nuevo</li>
            </ol>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}