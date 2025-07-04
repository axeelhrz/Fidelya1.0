'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Camera,
  Mail,
  Phone,
  Award,
  Shield,
  Bell,
  Moon,
  Sun,
  Globe,
  Key,
  Eye,
  EyeOff,
  Save,
  Upload,
  Trash2,
  X,
  AlertCircle,
  Settings,
  Lock,
  Smartphone,
  MessageSquare,
  Languages,
  GraduationCap,
  Stethoscope,
  Clock,
  FileText,
  Link as LinkIcon,
  History,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useTherapistProfile } from '@/hooks/useTherapistProfile';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface ProfileSectionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  collapsible = false,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        marginBottom: '1.5rem'
      }}
    >
      <div
        style={{
          padding: '1.5rem',
          borderBottom: collapsible ? '1px solid rgba(229, 231, 235, 0.3)' : 'none',
          cursor: collapsible ? 'pointer' : 'default'
        }}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            padding: '0.75rem',
            borderRadius: '0.875rem',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
          }}>
            <Icon size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {description}
            </p>
          </div>
          {collapsible && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(!collapsible || isExpanded) && (
          <motion.div
            initial={collapsible ? { height: 0, opacity: 0 } : { opacity: 1 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '1.5rem' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function TherapistProfilePage() {
  const therapistProfileData = useTherapistProfile();

  // All hooks must be called at the top level, before any conditional returns
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    dateOfBirth: '',
    gender: '' as 'male' | 'female' | 'other' | 'prefer-not-to-say' | '',
    specialties: [] as string[],
    licenseNumber: '',
    experience: 0,
    education: [] as string[],
    bio: '',
    languages: [] as string[],
    notifications: {
      email: true,
      sms: false,
      whatsapp: true
    },
    darkMode: false,
    language: 'es'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Extract data from hook, handling undefined/null cases
  const profileData = therapistProfileData?.profileData;
  const loading = therapistProfileData?.loading;
  const saving = therapistProfileData?.saving;
  const error = therapistProfileData?.error;
  const uploadingAvatar = therapistProfileData?.uploadingAvatar;
  const updateProfile = therapistProfileData?.updateProfile;
  const changePassword = therapistProfileData?.changePassword;
  const uploadAvatar = therapistProfileData?.uploadAvatar;
  const removeAvatar = therapistProfileData?.removeAvatar;
  const sendEmailVerification = therapistProfileData?.sendEmailVerification;
  const toggleTwoFactor = therapistProfileData?.toggleTwoFactor;
  const clearError = therapistProfileData?.clearError;

  // Actualizar formData cuando se cargan los datos del perfil
  React.useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.fullName,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth || '',
        gender: profileData.gender || '',
        specialties: profileData.specialties,
        licenseNumber: profileData.licenseNumber,
        experience: profileData.experience,
        education: profileData.education,
        bio: profileData.bio,
        languages: profileData.languages,
        notifications: profileData.notifications,
        darkMode: profileData.darkMode,
        language: profileData.language
      });
    }
  }, [profileData]);

  // Limpiar mensajes después de un tiempo
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  React.useEffect(() => {
    if (error && clearError) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);
  
  // Handle case where hook returns void or undefined
  if (therapistProfileData === undefined || therapistProfileData === null) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1F2937', margin: '0 0 0.5rem 0' }}>
            Error al cargar el hook
          </h2>
          <p style={{ color: '#6B7280', margin: 0 }}>
            No se pudo inicializar el hook useTherapistProfile
          </p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    const profileUpdateData = {
      ...formData,
      gender: formData.gender === '' ? undefined : formData.gender as 'male' | 'female' | 'other' | 'prefer-not-to-say'
    };
    const success = await updateProfile(profileUpdateData);
    if (success) {
      setEditMode(false);
      setSuccessMessage('Perfil actualizado correctamente');
    }
  };

  const handleChangePassword = async () => {
    const success = await changePassword(passwordData);
    if (success) {
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Contraseña cambiada correctamente');
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const success = await uploadAvatar(file);
      if (success) {
        setSuccessMessage('Avatar actualizado correctamente');
      }
    }
  };

  const handleRemoveAvatar = async () => {
    const success = await removeAvatar();
    if (success) {
      setSuccessMessage('Avatar eliminado correctamente');
    }
  };

  const handleSendVerification = async () => {
    const success = await sendEmailVerification();
    if (success) {
      setSuccessMessage('Email de verificación enviado');
    }
  };

  const handleToggle2FA = async () => {
    if (!profileData) return;
    const success = await toggleTwoFactor(!profileData.twoFactorEnabled);
    if (success) {
      setSuccessMessage(
        profileData.twoFactorEnabled 
          ? 'Autenticación de dos factores desactivada' 
          : 'Autenticación de dos factores activada'
      );
    }
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addEducation = (education: string) => {
    if (education && !formData.education.includes(education)) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, education]
      }));
    }
  };

  const removeEducation = (education: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(e => e !== education)
    }));
  };

  const addLanguage = (language: string) => {
    if (language && !formData.languages.includes(language)) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, language]
      }));
    }
  };

  const removeLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #10B981',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1F2937', margin: '0 0 0.5rem 0' }}>
            Error al cargar el perfil
          </h2>
          <p style={{ color: '#6B7280', margin: 0 }}>
            No se pudieron cargar los datos del perfil
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative'
    }}>
      {/* Efectos de fondo */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
        `
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Mi Perfil
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Gestiona tu información personal y profesional
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Button
              variant="secondary"
              icon={profileData.darkMode ? Sun : Moon}
              onClick={() => setFormData(prev => ({ ...prev, darkMode: !prev.darkMode }))}
            >
              {profileData.darkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </Button>
          </div>
        </motion.div>

        {/* Mensajes de estado */}
        <AnimatePresence>
          {(error || successMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                padding: '1rem 1.5rem',
                borderRadius: '0.875rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
                color: error ? '#DC2626' : '#059669'
              }}
            >
              {error ? <XCircle size={20} /> : <CheckCircle size={20} />}
              <span style={{ fontWeight: 500 }}>{error || successMessage}</span>
              <button
                onClick={() => error ? clearError() : setSuccessMessage(null)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'inherit'
                }}
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar y Datos Básicos */}
        <ProfileSection
          title="Información Básica"
          description="Tu foto de perfil y datos principales"
          icon={User}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: profileData.avatarUrl 
                    ? `url(${profileData.avatarUrl}) center/cover`
                    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '4px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  {!profileData.avatarUrl && (
                    <User size={48} color="white" />
                  )}
                </div>
                
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
                    border: '2px solid white'
                  }}
                >
                  <Camera size={16} color="white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: 'none' }}
                    disabled={uploadingAvatar}
                  />
                </motion.label>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={Upload}
                  loading={uploadingAvatar}
                  onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                >
                  Subir
                </Button>
                {profileData.avatarUrl && (
                  <Button
                    variant="error"
                    size="sm"
                    icon={Trash2}
                    loading={saving}
                    onClick={handleRemoveAvatar}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>

            {/* Información básica */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <Input
                  label="Nombre completo"
                  value={editMode ? formData.fullName : profileData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  disabled={!editMode}
                  leftIcon={User}
                />
                
                <Input
                  label="Email"
                  value={profileData.email}
                  disabled
                  leftIcon={Mail}
                  rightIcon={profileData.emailVerified ? CheckCircle : AlertCircle}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <Input
                  label="Teléfono"
                  value={editMode ? formData.phone : profileData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={!editMode}
                  leftIcon={Phone}
                />
                
                <div>
                  <label style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '0.25rem',
                    display: 'block'
                  }}>
                    Rol
                  </label>
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Stethoscope size={16} color="#10B981" />
                    <span style={{ color: '#059669', fontWeight: 600 }}>Terapeuta</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button
                  variant={editMode ? "success" : "primary"}
                  icon={editMode ? Save : Settings}
                  loading={saving}
                  onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
                >
                  {editMode ? 'Guardar Cambios' : 'Editar Datos'}
                </Button>
                
                <Button
                  variant="outline"
                  icon={Key}
                  onClick={() => setShowPasswordForm(true)}
                >
                  Cambiar Contraseña
                </Button>

                {!profileData.emailVerified && (
                  <Button
                    variant="warning"
                    icon={Mail}
                    loading={saving}
                    onClick={handleSendVerification}
                  >
                    Verificar Email
                  </Button>
                )}

                {editMode && (
                  <Button
                    variant="ghost"
                    icon={X}
                    onClick={() => {
                      setEditMode(false);
                      // Restaurar datos originales
                      if (profileData) {
                        setFormData({
                          fullName: profileData.fullName,
                          phone: profileData.phone,
                          dateOfBirth: profileData.dateOfBirth || '',
                          gender: profileData.gender || '',
                          specialties: profileData.specialties,
                          licenseNumber: profileData.licenseNumber,
                          experience: profileData.experience,
                          education: profileData.education,
                          bio: profileData.bio,
                          languages: profileData.languages,
                          notifications: profileData.notifications,
                          darkMode: profileData.darkMode,
                          language: profileData.language
                        });
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ProfileSection>

        {/* Información Profesional */}
        <ProfileSection
          title="Información Profesional"
          description="Especialidades, licencia y experiencia"
          icon={Award}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <Input
                label="Número de Licencia"
                value={editMode ? formData.licenseNumber : profileData.licenseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                disabled={!editMode}
                leftIcon={Award}
              />
                            <Input
                label="Años de Experiencia"
                type="number"
                value={editMode ? formData.experience.toString() : profileData.experience.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                disabled={!editMode}
                leftIcon={Clock}
              />
            </div>

            {/* Especialidades */}
            <div>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Especialidades
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: editMode ? '0.5rem' : '0'
              }}>
                {(editMode ? formData.specialties : profileData.specialties).map((specialty, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Stethoscope size={14} />
                    {specialty}
                    {editMode && (
                      <button
                        onClick={() => removeSpecialty(specialty)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              {editMode && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Input
                    placeholder="Nueva especialidad"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        addSpecialty(target.value);
                        target.value = '';
                      }
                    }}
                    size="sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Nueva especialidad"]') as HTMLInputElement;
                      if (input?.value) {
                        addSpecialty(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              )}
            </div>

            {/* Educación */}
            <div>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Educación
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {(editMode ? formData.education : profileData.education).map((edu, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <GraduationCap size={16} color="#3B82F6" />
                    <span style={{ flex: 1, fontSize: '0.875rem' }}>{edu}</span>
                    {editMode && (
                      <button
                        onClick={() => removeEducation(edu)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '0.25rem'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              {editMode && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Input
                    placeholder="Nueva educación"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        addEducation(target.value);
                        target.value = '';
                      }
                    }}
                    size="sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Nueva educación"]') as HTMLInputElement;
                      if (input?.value) {
                        addEducation(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Biografía Profesional
              </label>
              <textarea
                value={editMode ? formData.bio : profileData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!editMode}
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(229, 231, 235, 0.6)',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  resize: 'vertical',
                  background: editMode ? 'white' : 'rgba(249, 250, 251, 0.5)',
                  color: '#374151'
                }}
                placeholder="Describe tu experiencia y enfoque terapéutico..."
              />
            </div>

            {/* Idiomas */}
            <div>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Idiomas
              </label>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: editMode ? '0.5rem' : '0'
              }}>
                {(editMode ? formData.languages : profileData.languages).map((language, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Languages size={14} />
                    {language}
                    {editMode && (
                      <button
                        onClick={() => removeLanguage(language)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
              {editMode && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Input
                    placeholder="Nuevo idioma"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        addLanguage(target.value);
                        target.value = '';
                      }
                    }}
                    size="sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Nuevo idioma"]') as HTMLInputElement;
                      if (input?.value) {
                        addLanguage(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Agregar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ProfileSection>

        {/* Seguridad de Cuenta */}
        <ProfileSection
          title="Seguridad de Cuenta"
          description="Configuración de seguridad y autenticación"
          icon={Shield}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Estado de verificación */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                padding: '1rem',
                background: profileData.emailVerified 
                  ? 'rgba(16, 185, 129, 0.1)' 
                  : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${profileData.emailVerified 
                  ? 'rgba(16, 185, 129, 0.2)' 
                  : 'rgba(245, 158, 11, 0.2)'}`,
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                {profileData.emailVerified ? (
                  <CheckCircle size={20} color="#10B981" />
                ) : (
                  <AlertCircle size={20} color="#F59E0B" />
                )}
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: profileData.emailVerified ? '#059669' : '#D97706'
                  }}>
                    Email {profileData.emailVerified ? 'Verificado' : 'No Verificado'}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: profileData.emailVerified ? '#047857' : '#B45309'
                  }}>
                    {profileData.emailVerified 
                      ? 'Tu email ha sido verificado correctamente'
                      : 'Verifica tu email para mayor seguridad'
                    }
                  </div>
                </div>
                {!profileData.emailVerified && (
                  <Button
                    variant="warning"
                    size="sm"
                    loading={saving}
                    onClick={handleSendVerification}
                  >
                    Verificar
                  </Button>
                )}
              </div>

              <div style={{
                padding: '1rem',
                background: profileData.twoFactorEnabled 
                  ? 'rgba(16, 185, 129, 0.1)' 
                  : 'rgba(107, 114, 128, 0.1)',
                border: `1px solid ${profileData.twoFactorEnabled 
                  ? 'rgba(16, 185, 129, 0.2)' 
                  : 'rgba(107, 114, 128, 0.2)'}`,
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Smartphone size={20} color={profileData.twoFactorEnabled ? '#10B981' : '#6B7280'} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: profileData.twoFactorEnabled ? '#059669' : '#374151'
                  }}>
                    Autenticación 2FA
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: profileData.twoFactorEnabled ? '#047857' : '#6B7280'
                  }}>
                    {profileData.twoFactorEnabled 
                      ? 'Protección adicional activada'
                      : 'Mejora la seguridad de tu cuenta'
                    }
                  </div>
                </div>
                <Button
                  variant={profileData.twoFactorEnabled ? "error" : "success"}
                  size="sm"
                  loading={saving}
                  onClick={handleToggle2FA}
                >
                  {profileData.twoFactorEnabled ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            </div>

            {/* Cambiar contraseña */}
            <div style={{
              padding: '1rem',
              background: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              borderRadius: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Lock size={20} color="#3B82F6" />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1F2937' }}>
                    Cambiar Contraseña
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    Actualiza tu contraseña regularmente para mayor seguridad
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                icon={Key}
                onClick={() => setShowPasswordForm(true)}
              >
                Cambiar Contraseña
              </Button>
            </div>
          </div>
        </ProfileSection>

        {/* Preferencias */}
        <ProfileSection
          title="Preferencias"
          description="Notificaciones y configuración personal"
          icon={Settings}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Notificaciones */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1F2937',
                margin: '0 0 1rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Bell size={16} />
                Notificaciones
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                {[
                  { key: 'email', label: 'Email', icon: Mail, description: 'Recibir notificaciones por correo' },
                  { key: 'sms', label: 'SMS', icon: MessageSquare, description: 'Mensajes de texto al móvil' },
                  { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, description: 'Mensajes por WhatsApp' }
                ].map(({ key, label, icon: Icon, description }) => (
                  <div
                    key={key}
                    style={{
                      padding: '1rem',
                      background: 'rgba(249, 250, 251, 0.8)',
                      border: '1px solid rgba(229, 231, 235, 0.5)',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <Icon size={16} color="#6B7280" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1F2937' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {description}
                      </div>
                    </div>
                    <label style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '44px',
                      height: '24px'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.notifications[key as keyof typeof formData.notifications]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [key]: e.target.checked
                          }
                        }))}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: formData.notifications[key as keyof typeof formData.notifications] 
                          ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                          : '#CBD5E1',
                        borderRadius: '24px',
                        transition: 'all 0.3s ease'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: formData.notifications[key as keyof typeof formData.notifications] ? '23px' : '3px',
                          bottom: '3px',
                          background: 'white',
                          borderRadius: '50%',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tema y idioma */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                padding: '1rem',
                background: 'rgba(249, 250, 251, 0.8)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                borderRadius: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  {formData.darkMode ? <Moon size={16} color="#6B7280" /> : <Sun size={16} color="#6B7280" />}
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1F2937' }}>
                      Tema
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Modo {formData.darkMode ? 'oscuro' : 'claro'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon={formData.darkMode ? Sun : Moon}
                  onClick={() => setFormData(prev => ({ ...prev, darkMode: !prev.darkMode }))}
                  fullWidth
                >
                  Cambiar a {formData.darkMode ? 'Claro' : 'Oscuro'}
                </Button>
              </div>

              <div style={{
                padding: '1rem',
                background: 'rgba(249, 250, 251, 0.8)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                borderRadius: '0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <Globe size={16} color="#6B7280" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1F2937' }}>
                      Idioma del Sistema
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Idioma de la interfaz
                    </div>
                  </div>
                </div>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid rgba(229, 231, 235, 0.6)',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    background: 'white'
                  }}
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="ca">Català</option>
                </select>
              </div>
            </div>

            {/* Botón guardar preferencias */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="success"
                icon={Save}
                loading={saving}
                onClick={async () => {
                  const success = await updateProfile({
                    notifications: formData.notifications,
                    darkMode: formData.darkMode,
                    language: formData.language
                  });
                  if (success) {
                    setSuccessMessage('Preferencias guardadas correctamente');
                  }
                }}
              >
                Guardar Preferencias
              </Button>
            </div>
          </div>
        </ProfileSection>

        {/* Resumen Profesional */}
        <ProfileSection
          title="Resumen Profesional"
          description="Vista pública de tu perfil profesional"
          icon={FileText}
          collapsible
          defaultExpanded={false}
        >
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.1)',
            borderRadius: '0.875rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: profileData.avatarUrl 
                  ? `url(${profileData.avatarUrl}) center/cover`
                  : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {!profileData.avatarUrl && <User size={24} color="white" />}
              </div>
              <div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  margin: 0
                }}>
                  {profileData.fullName}
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#059669',
                  margin: '0.25rem 0 0 0',
                  fontWeight: 500
                }}>
                  {profileData.specialties.join(', ')}
                </p>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  margin: '0.25rem 0 0 0'
                }}>
                  Licencia: {profileData.licenseNumber}
                </p>
              </div>
            </div>
            
            <p style={{
              fontSize: '0.875rem',
              color: '#374151',
              lineHeight: 1.6,
              margin: '0 0 1rem 0'
            }}>
              {profileData.bio}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="sm"
                icon={LinkIcon}
                onClick={() => {
                  const profileUrl = `${window.location.origin}/therapist/${profileData.email}`;
                  navigator.clipboard.writeText(profileUrl);
                  setSuccessMessage('Link del perfil copiado al portapapeles');
                }}
              >
                Copiar Link de Perfil
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                icon={Eye}
                onClick={() => window.open(`/therapist/${profileData.email}`, '_blank')}
              >
                Vista Previa
              </Button>
            </div>
          </div>
        </ProfileSection>

        {/* Logs y Auditoría */}
        <ProfileSection
          title="Historial de Actividad"
          description="Registro de accesos y cambios en el perfil"
          icon={History}
          collapsible
          defaultExpanded={false}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                action: 'Inicio de sesión',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                ip: '192.168.1.100',
                device: 'Chrome en Windows'
              },
              {
                action: 'Perfil actualizado',
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                ip: '192.168.1.100',
                device: 'Chrome en Windows'
              },
              {
                action: 'Contraseña cambiada',
                timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                ip: '192.168.1.100',
                device: 'Safari en iPhone'
              }
            ].map((log, index) => (
              <div
                key={index}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(249, 250, 251, 0.8)',
                  border: '1px solid rgba(229, 231, 235, 0.5)',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === 0 ? '#10B981' : '#6B7280'
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#1F2937'
                  }}>
                    {log.action}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6B7280'
                  }}>
                    {log.timestamp.toLocaleString('es-ES')} • {log.device} • {log.ip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ProfileSection>
      </div>

      {/* Modal de cambio de contraseña */}
      <AnimatePresence>
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setShowPasswordForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.875rem',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Lock size={20} color="white" />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0
                  }}>
                    Cambiar Contraseña
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    margin: '0.25rem 0 0 0'
                  }}>
                    Actualiza tu contraseña para mayor seguridad
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                  label="Contraseña Actual"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  leftIcon={Lock}
                  rightIcon={showPassword ? EyeOff : Eye}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                <div style={{ position: 'relative' }}>
                  <Input
                    label="Nueva Contraseña"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    leftIcon={Key}
                    rightIcon={showNewPassword ? EyeOff : Eye}
                    helperText="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '2rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6B7280'
                    }}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div style={{ position: 'relative' }}>
                  <Input
                    label="Confirmar Nueva Contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    leftIcon={Key}
                    rightIcon={showConfirmPassword ? EyeOff : Eye}
                    error={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'Las contraseñas no coinciden' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '2rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6B7280'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1.5rem',
                justifyContent: 'flex-end'
              }}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  icon={Save}
                  loading={saving}
                  onClick={handleChangePassword}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                >
                  Cambiar Contraseña
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

              
