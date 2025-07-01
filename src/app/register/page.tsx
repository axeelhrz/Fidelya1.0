'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Heart,
  UserCheck,
  Stethoscope,
  Crown,
  Sparkles,
  Star,
} from 'lucide-react';
import { UserRole, UserRegistrationData } from '@/types/user';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  features: string[];
  popular?: boolean;
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState<UserRegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: undefined
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  
  const router = useRouter();

  // Opciones de roles con diseño mejorado
  const roleOptions: RoleOption[] = [
    {
      id: 'ceo',
      title: 'CEO / Administrador',
      description: 'Control total del centro psicológico',
      icon: Crown,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      features: [
        'Dashboard ejecutivo completo',
        'Análisis financiero y comercial',
        'Gestión de personal',
        'Reportes avanzados',
        'Configuración del sistema'
      ]
    },
    {
      id: 'therapist',
      title: 'Terapeuta / Psicólogo',
      description: 'Gestión profesional de pacientes y sesiones',
      icon: Stethoscope,
      color: '#10B981',
      bgColor: '#ECFDF5',
      features: [
        'Gestión de pacientes asignados',
        'Calendario de citas',
        'Notas clínicas',
        'Seguimiento de tratamientos',
        'Reportes de sesiones'
      ],
      popular: true
    },
    {
      id: 'patient',
      title: 'Paciente',
      description: 'Acceso a tu información y citas',
      icon: Heart,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      features: [
        'Ver historial médico',
        'Agendar citas',
        'Acceso a documentos',
        'Comunicación con terapeuta',
        'Seguimiento de progreso'
      ]
    },
    {
      id: 'receptionist',
      title: 'Recepcionista',
      description: 'Gestión de citas y atención al cliente',
      icon: UserCheck,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      features: [
        'Gestión de citas',
        'Registro de pacientes',
        'Calendario general',
        'Atención telefónica',
        'Coordinación de horarios'
      ]
    }
  ];

  // Pasos del formulario
  const formSteps: FormStep[] = [
    {
      id: 'role',
      title: 'Selecciona tu rol',
      description: 'Elige el tipo de cuenta que mejor se adapte a tus necesidades',
      fields: ['role']
    },
    {
      id: 'basic',
      title: 'Información básica',
      description: 'Datos personales y de contacto',
      fields: ['firstName', 'lastName', 'email', 'phone']
    },
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Crea una contraseña segura',
      fields: ['password', 'confirmPassword']
    },
    {
      id: 'details',
      title: 'Detalles adicionales',
      description: 'Información específica para tu rol',
      fields: ['dateOfBirth', 'gender', 'roleSpecific']
    }
  ];

  // Validaciones
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'email':
        if (!value) return 'El email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return '';
      case 'password':
        if (!value) return 'La contraseña es requerida';
        if (value.length < 8) return 'Mínimo 8 caracteres';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return 'Debe contener mayúscula, minúscula y número';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña';
        if (value !== formData.password) return 'Las contraseñas no coinciden';
        return '';
      case 'firstName':
        if (!value) return 'El nombre es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
      case 'lastName':
        if (!value) return 'El apellido es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
      case 'phone':
        if (!value) return 'El teléfono es requerido';
        if (!/^\+?[\d\s-()]{10,}$/.test(value)) return 'Teléfono inválido';
        return '';
      default:
        return '';
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const step = formSteps[stepIndex];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    step.fields.forEach(field => {
      if (field === 'role' && !selectedRole) {
        newErrors.role = 'Selecciona un rol';
        isValid = false;
      } else if (field !== 'role' && field !== 'roleSpecific') {
        const value = typeof formData[field as keyof UserRegistrationData] === 'string'
          ? formData[field as keyof UserRegistrationData] as string
          : '';
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < formSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setFormData(prev => ({ ...prev, role }));
    setErrors(prev => ({ ...prev, role: '' }));
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validación en tiempo real
    if (errors[field]) {
      const error = validateField(field, String(value));
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setIsValidating(true);

    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de registro
      console.log('Registrando usuario:', formData);
      
      // Redirigir según el rol
      const roleRoutes = {
        ceo: '/dashboard/ceo',
        therapist: '/dashboard/therapist',
        patient: '/dashboard/patient',
        receptionist: '/dashboard/reception'
      };
      
      router.push(roleRoutes[selectedRole!]);
    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ submit: 'Error al crear la cuenta. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  // Renderizar selección de rol
  const renderRoleSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {roleOptions.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => handleRoleSelect(role.id)}
            style={{
              background: selectedRole === role.id 
                ? 'rgba(255, 255, 255, 0.95)' 
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              borderRadius: '1.5rem',
              padding: '2rem',
              border: selectedRole === role.id 
                ? `2px solid ${role.color}` 
                : '1px solid rgba(229, 231, 235, 0.6)',
              boxShadow: selectedRole === role.id 
                ? `0 8px 32px ${role.color}20` 
                : '0 4px 12px rgba(0, 0, 0, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Badge popular */}
            {role.popular && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.025em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Star size={12} />
                Popular
              </motion.div>
            )}

            {/* Efecto de fondo */}
            <div
              style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '100px',
                height: '100px',
                background: `${role.color}10`,
                borderRadius: '50%',
                opacity: 0.5
              }}
            />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header del rol */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '1rem',
                    backgroundColor: role.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <role.icon size={28} color={role.color} />
                </div>
                
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#1C1E21',
                    margin: '0 0 0.25rem 0',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {role.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    margin: 0,
                    lineHeight: 1.4
                  }}>
                    {role.description}
                  </p>
                </div>
              </div>

              {/* Características */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  margin: '0 0 0.75rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Características incluidas:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {role.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (0.05 * idx) }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.8125rem',
                        color: '#4B5563'
                      }}
                    >
                      <CheckCircle size={14} color={role.color} />
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Indicador de selección */}
              {selectedRole === role.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem',
                    background: `${role.color}15`,
                    borderRadius: '0.75rem',
                    color: role.color,
                    fontSize: '0.875rem',
                    fontWeight: 600
                  }}
                >
                  <CheckCircle size={16} />
                  Seleccionado
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {errors.role && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '0.875rem 1rem',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}
        >
          <AlertCircle size={14} color="#DC2626" />
          <span style={{
            fontSize: '0.8rem',
            color: '#DC2626',
            fontFamily: 'Inter, sans-serif'
          }}>
            {errors.role}
          </span>
        </motion.div>
      )}
    </motion.div>
  );

  // Renderizar campos de formulario
  const renderFormFields = () => {
    const currentStepData = formSteps[currentStep];
    
    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {currentStepData.fields.map(field => {
          if (field === 'role') return null;
          if (field === 'roleSpecific') return renderRoleSpecificFields();
          
          return renderField(field);
        })}
      </motion.div>
    );
  };

  const renderField = (field: string) => {
    const fieldConfig = {
      firstName: { label: 'Nombre', icon: User, type: 'text', placeholder: 'Tu nombre' },
      lastName: { label: 'Apellido', icon: User, type: 'text', placeholder: 'Tu apellido' },
      email: { label: 'Email', icon: Mail, type: 'email', placeholder: 'tu@email.com' },
      phone: { label: 'Teléfono', icon: Phone, type: 'tel', placeholder: '+1 234 567 8900' },
      dateOfBirth: { label: 'Fecha de nacimiento', icon: Calendar, type: 'date', placeholder: '' },
      password: { label: 'Contraseña', icon: Lock, type: 'password', placeholder: 'Mínimo 8 caracteres' },
      confirmPassword: { label: 'Confirmar contraseña', icon: Lock, type: 'password', placeholder: 'Repite tu contraseña' }
    };

    const config = fieldConfig[field as keyof typeof fieldConfig];
    if (!config) return null;

    const isPassword = field === 'password';
    const isConfirmPassword = field === 'confirmPassword';
    const showPasswordField = isPassword ? showPassword : isConfirmPassword ? showConfirmPassword : false;

    return (
      <div key={field} style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '0.5rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          {config.label}
        </label>
        
        <div style={{ position: 'relative' }}>
          <config.icon size={16} style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94A3B8'
          }} />
          
          <input
            type={isPassword || isConfirmPassword ? (showPasswordField ? 'text' : 'password') : config.type}
            value={formData[field as keyof UserRegistrationData] as string || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={config.placeholder}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 2.75rem',
              border: errors[field] ? '1px solid #EF4444' : '1px solid #E2E8F0',
              borderRadius: '0.875rem',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              fontFamily: 'Inter, sans-serif',
              backgroundColor: 'white',
              color: '#1E293B'
            }}
            onFocus={(e) => {
              if (!errors[field]) {
                e.target.style.borderColor = '#2563EB';
                e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.08)';
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors[field] ? '#EF4444' : '#E2E8F0';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          {(isPassword || isConfirmPassword) && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isPassword) setShowPassword(!showPassword);
                if (isConfirmPassword) setShowConfirmPassword(!showConfirmPassword);
              }}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: '0.25rem',
                borderRadius: '0.25rem'
              }}
            >
              {showPasswordField ? <EyeOff size={16} /> : <Eye size={16} />}
            </motion.button>
          )}
        </div>
        
        {errors[field] && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}
          >
            <AlertCircle size={12} color="#EF4444" />
            <span style={{
              fontSize: '0.75rem',
              color: '#EF4444',
              fontFamily: 'Inter, sans-serif'
            }}>
              {errors[field]}
            </span>
          </motion.div>
        )}
      </div>
    );
  };

  const renderRoleSpecificFields = () => {
    if (!selectedRole) return null;

    // Campos específicos según el rol seleccionado
    switch (selectedRole) {
      case 'therapist':
        return (
          <div style={{ gridColumn: '1 / -1' }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '1rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Información profesional
            </h4>
            {/* Aquí irían campos específicos para terapeutas */}
          </div>
        );
      case 'patient':
        return (
          <div style={{ gridColumn: '1 / -1' }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '1rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Información médica básica
            </h4>
            {/* Aquí irían campos específicos para pacientes */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative'
    }}>
      {/* Efectos de fondo */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)
        `
      }} />

      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '1200px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2rem',
          padding: '3rem',
          border: '1px solid rgba(226, 232, 240, 0.5)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              borderRadius: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.2)'
            }}
          >
            <Sparkles size={36} color="white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1E293B',
              margin: 0,
              marginBottom: '1rem',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-0.02em'
            }}
          >
            Únete a Centro Psicológico
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: '1.125rem',
              color: '#64748B',
              margin: 0,
              fontFamily: 'Inter, sans-serif',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6
            }}
          >
            Crea tu cuenta y accede a la plataforma más avanzada para la gestión de centros psicológicos
          </motion.p>
        </div>

        {/* Indicador de progreso */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            {formSteps.map((step, index) => (
              <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                  animate={{
                    backgroundColor: index <= currentStep ? '#2563EB' : '#E2E8F0',
                    scale: index === currentStep ? 1.2 : 1
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: index <= currentStep ? 'white' : '#94A3B8',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {index + 1}
                </motion.div>
                {index < formSteps.length - 1 && (
                  <motion.div
                    animate={{
                      backgroundColor: index < currentStep ? '#2563EB' : '#E2E8F0'
                    }}
                    style={{
                      width: '60px',
                      height: '2px',
                      marginLeft: '1rem',
                      marginRight: '1rem'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1E293B',
              margin: '0 0 0.5rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {formSteps[currentStep].title}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              margin: 0,
              fontFamily: 'Inter, sans-serif'
            }}>
              {formSteps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Contenido del formulario */}
        <div style={{ marginBottom: '3rem' }}>
          <AnimatePresence mode="wait">
            {currentStep === 0 ? renderRoleSelection() : renderFormFields()}
          </AnimatePresence>
        </div>

        {/* Botones de navegación */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <motion.button
            whileHover={{ scale: currentStep > 0 ? 1.02 : 1 }}
            whileTap={{ scale: currentStep > 0 ? 0.98 : 1 }}
            onClick={handlePrevious}
            disabled={currentStep === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: currentStep > 0 ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
              border: currentStep > 0 ? '1px solid #E2E8F0' : 'none',
              borderRadius: '0.875rem',
              cursor: currentStep > 0 ? 'pointer' : 'default',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: currentStep > 0 ? '#374151' : 'transparent',
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif',
              opacity: currentStep > 0 ? 1 : 0,
              pointerEvents: currentStep > 0 ? 'auto' : 'none'
            }}
          >
            <ArrowLeft size={16} />
            Anterior
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={isLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: isLoading 
                ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'
                : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.875rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif',
              boxShadow: isLoading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.25)',
              minWidth: '140px',
              justifyContent: 'center'
            }}
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%'
                  }}
                />
                {isValidating ? 'Validando...' : 'Creando...'}
              </>
            ) : (
              <>
                {currentStep === formSteps.length - 1 ? 'Crear cuenta' : 'Siguiente'}
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </div>

        {/* Error de envío */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center'
            }}
          >
            <AlertCircle size={16} color="#DC2626" />
            <span style={{
              fontSize: '0.875rem',
              color: '#DC2626',
              fontFamily: 'Inter, sans-serif'
            }}>
              {errors.submit}
            </span>
          </motion.div>
        )}

        {/* Link a login */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#F8FAFC',
            borderRadius: '1rem',
            border: '1px solid #F1F5F9'
          }}
        >
          <p style={{
            fontSize: '0.875rem',
            color: '#64748B',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            ¿Ya tienes una cuenta?{' '}
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="/login"
              style={{
                color: '#2563EB',
                textDecoration: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Inicia sesión aquí
            </motion.a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
