'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthForm } from '@/components/auth/AuthForm';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { signIn, getDashboardRoute } from '@/lib/auth';
import { Mail, Lock, ArrowRight, Shield, Zap, User, Key, CheckCircle2 } from 'lucide-react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
  },
  
  formSection: {
    marginBottom: '1.5rem',
  },
  
  forgotPasswordSection: {
    textAlign: 'center' as const,
    marginBottom: '1.5rem',
  },
  
  forgotPasswordButton: {
    background: 'none',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#4f46e5',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    padding: '0.5rem',
    borderRadius: '6px',
  },
  
  resetPasswordPanel: {
    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.03) 100%)',
    border: '1px solid rgba(79, 70, 229, 0.15)',
    borderRadius: '16px',
    padding: '1.5rem',
    marginTop: '1rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  
  resetPasswordContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  
  resetPasswordIcon: {
    padding: '0.75rem',
    background: 'rgba(79, 70, 229, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(79, 70, 229, 0.2)',
    flexShrink: 0,
  },
  
  resetPasswordText: {
    flex: 1,
  },
  
  resetPasswordTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#312e81',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em',
  },
  
  resetPasswordDescription: {
    fontSize: '0.875rem',
    color: '#4c1d95',
    lineHeight: 1.5,
    fontWeight: '500',
  },
  
  divider: {
    position: 'relative' as const,
    margin: '1.5rem 0',
  },
  
  dividerLine: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
  },
  
  dividerBorder: {
    width: '100%',
    borderTop: '1px solid rgba(148, 163, 184, 0.3)',
  },
  
  dividerText: {
    position: 'relative' as const,
    display: 'flex',
    justifyContent: 'center',
    fontSize: '0.875rem',
  },
  
  dividerSpan: {
    padding: '0 1.5rem',
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: '-0.025em',
  },
  
  registerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    width: '100%',
    height: '56px',
    padding: '0 2rem',
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#4f46e5',
    border: '2px solid rgba(79, 70, 229, 0.2)',
    borderRadius: '14px',
    fontSize: '0.875rem',
    fontWeight: '700',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.025em',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    backdropFilter: 'blur(10px)',
  },
  
  securitySection: {
    background: 'linear-gradient(135deg, rgba(148, 163, 184, 0.05) 0%, rgba(203, 213, 225, 0.03) 100%)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '16px',
    padding: '1.5rem',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  
  securityContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    fontSize: '0.875rem',
  },
  
  securityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#64748b',
    fontWeight: '600',
  },
  
  securityIcon: {
    width: '16px',
    height: '16px',
    color: '#4f46e5',
  },
  
  topBorder: {
    position: 'absolute' as const,
    top: 0,
    left: '20%',
    right: '20%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.3), transparent)',
  },
};

const hoverStyles = {
  forgotPasswordButton: {
    color: '#7c3aed',
    background: 'rgba(79, 70, 229, 0.05)',
  },
  
  registerButton: {
    background: 'rgba(79, 70, 229, 0.05)',
    borderColor: 'rgba(79, 70, 229, 0.4)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(79, 70, 229, 0.15)',
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    const userData = await signIn(data.email, data.password);
    const dashboardRoute = getDashboardRoute(userData.role);
    router.push(dashboardRoute);
  };

  const loginFields: { name: "email" | "password"; label: string; type: string; icon?: React.ReactNode; placeholder?: string }[] = [
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      icon: <Mail />,
      placeholder: "tu@email.com"
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      icon: <Lock />,
      placeholder: "Tu contraseña"
    }
  ];

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Accede a tu cuenta de Fidelita y gestiona tus beneficios de manera profesional"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, staggerChildren: 0.1 }}
        style={styles.container}
      >
        {/* Formulario de Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={styles.formSection}
        >
          <AuthForm
            schema={loginSchema}
            onSubmit={handleLogin}
            fields={loginFields}
            submitText="Iniciar sesión"
          />
        </motion.div>

        {/* Sección de recuperación de contraseña */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={styles.forgotPasswordSection}
        >
          <motion.button
            type="button"
            onClick={() => setShowResetPassword(!showResetPassword)}
            style={styles.forgotPasswordButton}
            whileHover={hoverStyles.forgotPasswordButton}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            ¿Olvidaste tu contraseña?
          </motion.button>

          {/* Panel de recuperación de contraseña */}
          {showResetPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={styles.resetPasswordPanel}
            >
              <div style={styles.topBorder} />
              <div style={styles.resetPasswordContent}>
                <div style={styles.resetPasswordIcon}>
                  <Key size={20} color="#4f46e5" />
                </div>
                <div style={styles.resetPasswordText}>
                  <p style={styles.resetPasswordTitle}>
                    Recuperación segura
                  </p>
                  <p style={styles.resetPasswordDescription}>
                    Enviaremos un enlace de recuperación a tu correo electrónico registrado.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Divisor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={styles.divider}
        >
          <div style={styles.dividerLine}>
            <div style={styles.dividerBorder} />
          </div>
          <div style={styles.dividerText}>
            <span style={styles.dividerSpan}>¿No tienes cuenta?</span>
          </div>
        </motion.div>

        {/* Botón de registro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            whileHover={hoverStyles.registerButton}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/auth/register" style={styles.registerButton}>
              <User size={20} />
              Crear cuenta nueva
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Sección de seguridad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={styles.securitySection}
        >
          <div style={styles.topBorder} />
          <div style={styles.securityContent}>
            <div style={styles.securityItem}>
              <Shield style={styles.securityIcon} />
              <span>SSL Seguro</span>
            </div>
            <div style={styles.securityItem}>
              <CheckCircle2 style={styles.securityIcon} />
              <span>Verificado</span>
            </div>
            <div style={styles.securityItem}>
              <Zap style={styles.securityIcon} />
              <span>Acceso rápido</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}