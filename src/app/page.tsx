"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const buttonBaseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    minWidth: '160px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#1e293b',
    color: 'white',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  };

  const secondaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#374151',
    border: '2px solid #e5e7eb',
    backdropFilter: 'blur(8px)',
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  };

  const contentStyle = {
    position: 'relative' as const,
    zIndex: 10,
    textAlign: 'center' as const,
    padding: '0 24px',
    maxWidth: '512px',
    margin: '0 auto',
  };

  const titleStyle = {
    fontSize: 'clamp(3rem, 8vw, 5rem)',
    fontWeight: '300',
    color: '#1e293b',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
    lineHeight: '1',
  };

  const subtitleStyle = {
    fontSize: 'clamp(2rem, 6vw, 3.5rem)',
    fontWeight: '300',
    color: '#059669',
    letterSpacing: '-0.02em',
    lineHeight: '1',
    marginBottom: '32px',
  };

  const descriptionStyle = {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    color: '#64748b',
    fontWeight: '300',
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto 48px auto',
  };

  const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    alignItems: 'center',
    marginBottom: '64px',
  };

  const separatorStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '32px 0',
  };

  const lineStyle = {
    width: '64px',
    height: '1px',
    background: 'linear-gradient(to right, transparent, #cbd5e1, transparent)',
  };

  const dotStyle = {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    margin: '0 16px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
  };

  const footerStyle = {
    fontSize: '14px',
    color: '#94a3b8',
    fontWeight: '300',
    letterSpacing: '0.5px',
  };

  const footerDotsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  };

  const footerDotStyle = {
    width: '4px',
    height: '4px',
    backgroundColor: '#cbd5e1',
    borderRadius: '50%',
  };

  const backgroundElementStyle = {
    position: 'absolute' as const,
    top: '25%',
    right: '25%',
    width: '384px',
    height: '384px',
    background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.3), rgba(219, 234, 254, 0.3))',
    borderRadius: '50%',
    filter: 'blur(48px)',
  };

  return (
    <div style={containerStyle}>
      {/* Elemento de fondo */}
      <motion.div
        style={backgroundElementStyle}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Contenido principal */}
      <div style={contentStyle}>
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 style={titleStyle}>Casino</h1>
          <h2 style={subtitleStyle}>Escolar</h2>
          
          {/* Separador */}
          <motion.div
            style={separatorStyle}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div style={lineStyle} />
            <div style={dotStyle} />
            <div style={lineStyle} />
          </motion.div>

          <motion.p
            style={descriptionStyle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Plataforma digital para la gestión de alimentación escolar
          </motion.p>
        </motion.div>

        {/* Botones */}
        <motion.div
          style={buttonsContainerStyle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/auth/sign-in" style={{ textDecoration: 'none' }}>
            <motion.button
              style={primaryButtonStyle}
              whileHover={{ 
                y: -2, 
                scale: 1.02,
                backgroundColor: '#334155',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Iniciar Sesión
            </motion.button>
          </Link>

          <Link href="/auth/sign-up" style={{ textDecoration: 'none' }}>
            <motion.button
              style={secondaryButtonStyle}
              whileHover={{ 
                y: -2, 
                scale: 1.02,
                borderColor: '#10b981',
                color: '#059669',
                backgroundColor: 'rgba(255, 255, 255, 1)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Crear Cuenta
            </motion.button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          style={footerStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div style={footerDotsStyle}>
            <span>Nutrición</span>
            <div style={footerDotStyle} />
            <span>Organización</span>
            <div style={footerDotStyle} />
            <span>Bienestar</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}