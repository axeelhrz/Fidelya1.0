"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Utensils
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Schema de validación simplificado
const registerSchema = z.object({
  nombreCompleto: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Solo se permiten letras y espacios')
    .trim(),
  
  email: z
    .string()
    .email('Ingresa un email válido')
    .min(1, 'El email es requerido')
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña no puede exceder 100 caracteres')
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    setSubmitStatus('idle');

    try {
      const { email, password, nombreCompleto } = data;
      const supabase = supabaseBrowser();

      // Registro en Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nombreCompleto
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      const user = signUpData.user;
      if (user) {
        // Insertar en tabla users
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          nombre: nombreCompleto,
          email,
          rol: 'user',
          estado: 'pendiente_verificacion',
          created_at: new Date().toISOString()
        });

        if (insertError) {
          throw new Error(insertError.message);
        }

        setSubmitStatus('success');
        
        // Redirigir después de mostrar el éxito
        setTimeout(() => {
          router.push('/auth/check-email');
        }, 2500);
      }
    } catch (error: any) {
      setSubmitStatus('error');
      
      // Personalizar mensajes de error
      if (error.message.includes('User already registered')) {
        setErrorMessage('Este email ya está registrado');
      } else if (error.message.includes('Invalid email')) {
        setErrorMessage('El formato del email no es válido');
      } else if (error.message.includes('Password should be at least 6 characters')) {
        setErrorMessage('La contraseña debe tener al menos 6 caracteres');
      } else {
        setErrorMessage(error.message || 'Ocurrió un error inesperado');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldStatus = (fieldName: keyof RegisterFormData) => {
    if (errors[fieldName]) return 'error';
    if (touchedFields[fieldName] && watchedFields[fieldName] && !errors[fieldName]) return 'success';
    return 'default';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 50%, #fefce8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative'
    }}>
      {/* Elementos decorativos de fondo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '-160px',
          right: '-160px',
          width: '320px',
          height: '320px',
          background: 'rgba(220, 38, 38, 0.2)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-160px',
          left: '-160px',
          width: '320px',
          height: '320px',
          background: 'rgba(251, 191, 36, 0.2)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '384px',
          height: '384px',
          background: 'rgba(251, 146, 60, 0.1)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: '100%',
          maxWidth: '448px',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="casino-gradient"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              marginBottom: '24px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Utensils style={{ width: '32px', height: '32px', color: 'white' }} />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-heading"
            style={{
              fontSize: '30px',
              fontWeight: 'bold',
              color: 'var(--foreground)',
              marginBottom: '8px'
            }}
          >
            Casino Escolar
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              color: 'var(--muted-foreground)'
            }}
          >
            Crear nueva cuenta
          </motion.p>
        </div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="modern-card"
          style={{ padding: '32px' }}
        >
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Campo Nombre Completo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}>
                Nombre completo
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: 'var(--muted-foreground)'
                }} />
                <input
                  {...register('nombreCompleto')}
                  type="text"
                  placeholder="Juan Carlos Pérez"
                  className={`input-field ${
                    getFieldStatus('nombreCompleto') === 'error' ? 'input-error' : 
                    getFieldStatus('nombreCompleto') === 'success' ? 'input-success' : ''
                  }`}
                  style={{ paddingLeft: '44px' }}
                />
                {getFieldStatus('nombreCompleto') === 'success' && (
                  <CheckCircle style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: 'var(--success)'
                  }} />
                )}
              </div>
              <AnimatePresence>
                {errors.nombreCompleto && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-destructive"
                    style={{
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <AlertCircle style={{ width: '16px', height: '16px' }} />
                    {errors.nombreCompleto.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Campo Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}>
                Correo electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: 'var(--muted-foreground)'
                }} />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className={`input-field ${
                    getFieldStatus('email') === 'error' ? 'input-error' : 
                    getFieldStatus('email') === 'success' ? 'input-success' : ''
                  }`}
                  style={{ paddingLeft: '44px' }}
                />
                {getFieldStatus('email') === 'success' && (
                  <CheckCircle style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '20px',
                    color: 'var(--success)'
                  }} />
                )}
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-destructive"
                    style={{
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <AlertCircle style={{ width: '16px', height: '16px' }} />
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Campo Contraseña */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--foreground)'
              }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  color: 'var(--muted-foreground)'
                }} />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  className={`input-field ${
                    getFieldStatus('password') === 'error' ? 'input-error' : 
                    getFieldStatus('password') === 'success' ? 'input-success' : ''
                  }`}
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-destructive"
                    style={{
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <AlertCircle style={{ width: '16px', height: '16px' }} />
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Mensaje de Error Global */}
            <AnimatePresence>
              {submitStatus === 'error' && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 border-red-200"
                  style={{
                    border: '1px solid',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertCircle className="text-red-500" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    <p className="text-red-700" style={{ fontSize: '14px' }}>{errorMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensaje de Éxito */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-50 border-green-200"
                  style={{
                    border: '1px solid',
                    borderRadius: '12px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle className="text-green-500 animate-pulse-success" style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                    <div>
                      <p className="text-green-700" style={{ fontSize: '14px', fontWeight: '500' }}>
                        Cuenta creada exitosamente
                      </p>
                      <p className="text-green-600" style={{ fontSize: '12px' }}>
                        Revisa tu email para verificar tu cuenta
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón de Envío */}
            <motion.button
              type="submit"
              disabled={isLoading || !isValid || submitStatus === 'success'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px'
              }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                    Creando cuenta...
                  </motion.div>
                ) : submitStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <CheckCircle style={{ width: '20px', height: '20px' }} />
                    Cuenta creada
                  </motion.div>
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    Crear cuenta
                    <ArrowRight style={{ width: '20px', height: '20px' }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
              ¿Ya tienes una cuenta?{' '}
              <Link 
                href="/auth/login" 
                className="text-primary"
                style={{
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease'
                }}
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Indicador de seguridad */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: '24px', textAlign: 'center' }}
        >
          <p style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>
            Plataforma segura para la gestión escolar
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}