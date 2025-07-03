'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, Brain, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay un usuario autenticado
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      router.push('/dashboard/ceo');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Efectos de fondo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
        `
      }} />

      {/* Contenido de carga */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          zIndex: 10
        }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            width: '120px',
            height: '120px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Activity size={48} color="white" />
        </motion.div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          margin: 0,
          marginBottom: '1rem',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          Centro Psicológico
        </h1>

        <p style={{
          fontSize: '1.25rem',
          opacity: 0.9,
          margin: 0,
          marginBottom: '2rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          Cargando plataforma de gestión inteligente...
        </p>

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          <Brain size={24} color="white" />
          <Sparkles size={24} color="white" />
          <Activity size={24} color="white" />
        </motion.div>

        {/* Spinner de carga */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            margin: '2rem auto'
          }}
        />
      </motion.div>
    </div>
  );
}