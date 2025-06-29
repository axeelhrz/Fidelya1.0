'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Shield,
  AlertTriangle,
  Save,
  X,
  Upload,
  FileText,
  Camera,
  Mic,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { ExtendedPatient, PatientDocument } from '@/types/clinical';

interface PatientFormProps {
  patient?: ExtendedPatient;
  onSave: (patientData: Partial<ExtendedPatient>) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit';
  duplicateWarnings?: ExtendedPatient[];
}

export function PatientForm({ 
  patient, 
  onSave, 
  onCancel, 
  mode,
  duplicateWarnings = []
}: PatientFormProps) {
  const [formData, setFormData] = useState<Partial<ExtendedPatient>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: new Date(),
    gender: 'prefer-not-to-say',
    pronouns: '',
    identification: {
      type: 'dni',
      number: '',
      expiryDate: undefined
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'España'
    },
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
      email: ''
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      copay: 0
    },
    medicalInfo: {
      allergies: [],
      currentMedications: [],
      medicalHistory: [],
      previousTherapy: false,
      previousTherapyDetails: ''
    },
    assignedTherapist: '',
    status: 'active',
    tags: [],
    riskLevel: 'low',
    assessmentScores: {
      custom: {}
    },
    referralSource: {
      type: 'self',
      details: '',
      referrerName: '',
      referrerContact: ''
    },
    consentForms: [],
    privacySettings: {
      allowSMS: true,
      allowEmail: true,
      allowCalls: true,
      shareWithFamily: false
    },
    adherenceRate: 0,
    feedback: []
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescribedBy: '',
    startDate: new Date(),
    notes: ''
  });
  const [newTag, setNewTag] = useState('');
  const [showSensitiveData, setShowSensitiveData] = useState(false);

  const steps = [
    { id: 'basic', title: 'Información Básica', icon: User },
    { id: 'contact', title: 'Contacto y Dirección', icon: MapPin },
    { id: 'emergency', title: 'Contacto de Emergencia', icon: Phone },
    { id: 'medical', title: 'Información Médica', icon: Heart },
    { id: 'insurance', title: 'Seguro Médico', icon: Shield },
    { id: 'clinical', title: 'Información Clínica', icon: FileText },
    { id: 'privacy', title: 'Privacidad y Consentimiento', icon: Eye }
  ];

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  useEffect(() => {
    if (duplicateWarnings.length > 0) {
      setShowDuplicateWarning(true);
    }
  }, [duplicateWarnings]);

  const validateStep = (stepId: string) => {
    const newErrors: { [key: string]: string } = {};

    switch (stepId) {
      case 'basic':
        if (!formData.firstName?.trim()) newErrors.firstName = 'Nombre es requerido';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Apellido es requerido';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Fecha de nacimiento es requerida';
        if (!formData.identification?.number?.trim()) newErrors.identificationNumber = 'Número de identificación es requerido';
        break;
      case 'contact':
        if (!formData.email?.trim()) newErrors.email = 'Email es requerido';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.phone?.trim()) newErrors.phone = 'Teléfono es requerido';
        if (!formData.address?.street?.trim()) newErrors.addressStreet = 'Dirección es requerida';
        if (!formData.address?.city?.trim()) newErrors.addressCity = 'Ciudad es requerida';
        break;
      case 'emergency':
        if (!formData.emergencyContact?.name?.trim()) newErrors.emergencyName = 'Nombre del contacto es requerido';
        if (!formData.emergencyContact?.phone?.trim()) newErrors.emergencyPhone = 'Teléfono del contacto es requerido';
        if (!formData.emergencyContact?.relationship?.trim()) newErrors.emergencyRelationship = 'Relación es requerida';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(steps[currentStep].id)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    // Validate all steps
    let isValid = true;
    for (const step of steps) {
      if (!validateStep(step.id)) {
        isValid = false;
        break;
      }
    }

    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo!,
          allergies: [...(prev.medicalInfo?.allergies || []), newAllergy.trim()]
        }
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo!,
        allergies: prev.medicalInfo?.allergies?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const addMedication = () => {
    if (newMedication.name.trim()) {
      setFormData(prev => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo!,
          currentMedications: [...(prev.medicalInfo?.currentMedications || []), { ...newMedication }]
        }
      }));
      setNewMedication({
        name: '',
        dosage: '',
        frequency: '',
        prescribedBy: '',
        startDate: new Date(),
        notes: ''
      });
    }
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo!,
        currentMedications: prev.medicalInfo?.currentMedications?.filter((_, i) => i !== index) || []
      }
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const renderStepContent = () => {
    const currentStepId = steps[currentStep].id;

    switch (currentStepId) {
      case 'basic':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.firstName ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Nombre del paciente"
                />
                {errors.firstName && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.lastName ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Apellidos del paciente"
                />
                {errors.lastName && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: new Date(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.dateOfBirth ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                />
                {errors.dateOfBirth && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Género
                </label>
                <select
                  value={formData.gender || 'prefer-not-to-say'}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                >
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                  <option value="prefer-not-to-say">Prefiero no decir</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Pronombres
                </label>
                <input
                  type="text"
                  value={formData.pronouns || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, pronouns: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="él/ella, elle, etc."
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Tipo de ID
                </label>
                <select
                  value={formData.identification?.type || 'dni'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    identification: { ...prev.identification!, type: e.target.value as any }
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                >
                  <option value="dni">DNI</option>
                  <option value="nie">NIE</option>
                  <option value="passport">Pasaporte</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Número de Identificación *
                </label>
                <input
                  type="text"
                  value={formData.identification?.number || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    identification: { ...prev.identification!, number: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.identificationNumber ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="12345678A"
                />
                {errors.identificationNumber && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.identificationNumber}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Fecha de Expiración
                </label>
                <input
                  type="date"
                  value={formData.identification?.expiryDate ? formData.identification.expiryDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    identification: { 
                      ...prev.identification!, 
                      expiryDate: e.target.value ? new Date(e.target.value) : undefined 
                    }
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
        );

      // ... resto de los casos (contact, emergency, medical, insurance, clinical, privacy)
      // [El código continúa con todos los casos del switch statement como se mostró anteriormente]

      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header, Progress Bar, Content, Footer */}
        {/* [Todo el JSX del modal como se mostró anteriormente] */}
      </motion.div>

      {/* Duplicate Warning Modal */}
      <AnimatePresence>
        {showDuplicateWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <AlertTriangle size={24} color="#F59E0B" />
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Posibles Duplicados Detectados
                </h3>
              </div>
              
              <p style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Se encontraron pacientes con información similar. ¿Desea continuar con el registro?
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {duplicateWarnings.map((duplicate, index) => (
                  <div key={index} style={{
                    padding: '0.75rem',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '0.5rem',
                    border: '1px solid #FDE68A'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#92400E',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {duplicate.firstName} {duplicate.lastName}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#78350F',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {duplicate.email} • {duplicate.phone}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDuplicateWarning(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Revisar
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowDuplicateWarning(false);
                    handleSubmit();
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#F59E0B',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Continuar de Todos Modos
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
