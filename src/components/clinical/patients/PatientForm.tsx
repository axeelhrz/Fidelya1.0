'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Shield,
  AlertTriangle,
  Save,
  X,
  FileText,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import { ExtendedPatient } from '@/types/clinical';

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
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' | 'other' | 'prefer-not-to-say' }))}
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
                    identification: { ...prev.identification!, type: e.target.value as 'dni' | 'nie' | 'passport' }
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

      case 'contact':
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
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.email ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="email@ejemplo.com"
                />
                {errors.email && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.email}
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
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.phone ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="+34 600 000 000"
                />
                {errors.phone && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.phone}
                  </p>
                )}
              </div>
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
                Dirección *
              </label>
              <input
                type="text"
                value={formData.address?.street || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address!, street: e.target.value }
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.addressStreet ? '#EF4444' : '#E5E7EB'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none'
                }}
                placeholder="Calle, número, piso, puerta"
              />
              {errors.addressStreet && (
                <p style={{
                  fontSize: '0.75rem',
                  color: '#EF4444',
                  marginTop: '0.25rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {errors.addressStreet}
                </p>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
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
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.address?.city || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address!, city: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.addressCity ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Madrid"
                />
                {errors.addressCity && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.addressCity}
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
                  Provincia
                </label>
                <input
                  type="text"
                  value={formData.address?.state || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address!, state: e.target.value }
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
                  placeholder="Madrid"
                />
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
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.address?.zipCode || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address!, zipCode: e.target.value }
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
                  placeholder="28001"
                />
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
                  País
                </label>
                <select
                  value={formData.address?.country || 'España'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address!, country: e.target.value }
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
                  <option value="España">España</option>
                  <option value="Francia">Francia</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Italia">Italia</option>
                  <option value="Alemania">Alemania</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#FEF3C7',
              borderRadius: '0.5rem',
              border: '1px solid #FDE68A'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={16} color="#F59E0B" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#92400E',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Contacto de Emergencia
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#78350F',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Esta información será utilizada únicamente en caso de emergencia médica o situaciones críticas.
                Asegúrese de que la persona designada esté informada y disponible.
              </p>
            </div>

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
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact?.name || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact!, name: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.emergencyName ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Nombre del contacto de emergencia"
                />
                {errors.emergencyName && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.emergencyName}
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
                  Relación *
                </label>
                <select
                  value={formData.emergencyContact?.relationship || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact!, relationship: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.emergencyRelationship ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                >
                  <option value="">Seleccionar relación</option>
                  <option value="padre">Padre</option>
                  <option value="madre">Madre</option>
                  <option value="hermano">Hermano/a</option>
                  <option value="conyuge">Cónyuge</option>
                  <option value="pareja">Pareja</option>
                  <option value="hijo">Hijo/a</option>
                  <option value="amigo">Amigo/a</option>
                  <option value="tutor">Tutor Legal</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.emergencyRelationship && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.emergencyRelationship}
                  </p>
                )}
              </div>
            </div>

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
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContact?.phone || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact!, phone: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.emergencyPhone ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="+34 600 000 000"
                />
                {errors.emergencyPhone && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#EF4444',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {errors.emergencyPhone}
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
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={formData.emergencyContact?.email || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    emergencyContact: { ...prev.emergencyContact!, email: e.target.value }
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
                  placeholder="email@ejemplo.com"
                />
              </div>
            </div>
          </div>
        );

      case 'medical':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Alergias */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Alergias Conocidas
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Agregar alergia (medicamentos, alimentos, etc.)"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addAllergy}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formData.medicalInfo?.allergies?.map((allergy, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#FEF2F2',
                    color: '#991B1B',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <span>{allergy}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeAllergy(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={12} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Medicación Actual */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Medicación Actual
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '0.5rem',
                marginBottom: '0.75rem',
                alignItems: 'end'
              }}>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Nombre del medicamento"
                />
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Dosis"
                />
                <input
                  type="text"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Frecuencia"
                />
                <input
                  type="text"
                  value={newMedication.prescribedBy}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, prescribedBy: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Prescrito por"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addMedication}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {formData.medicalInfo?.currentMedications?.map((medication, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: '#F0F9FF',
                    borderRadius: '0.5rem',
                    border: '1px solid #E0F2FE'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0C4A6E',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {medication.name}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#0369A1',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {medication.dosage} • {medication.frequency}
                        {medication.prescribedBy && ` • Prescrito por: ${medication.prescribedBy}`}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeMedication(index)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>

            {/* Terapia Previa */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.medicalInfo?.previousTherapy || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicalInfo: { ...prev.medicalInfo!, previousTherapy: e.target.checked }
                  }))}
                  style={{ marginRight: '0.5rem' }}
                />
                ¿Ha recibido terapia psicológica anteriormente?
              </label>
              {formData.medicalInfo?.previousTherapy && (
                <textarea
                  value={formData.medicalInfo?.previousTherapyDetails || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicalInfo: { ...prev.medicalInfo!, previousTherapyDetails: e.target.value }
                  }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  placeholder="Describa brevemente su experiencia previa con terapia psicológica..."
                />
              )}
            </div>
          </div>
        );

      case 'insurance':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#EFF6FF',
              borderRadius: '0.5rem',
              border: '1px solid #DBEAFE'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Shield size={16} color="#2563EB" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1E40AF',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Información del Seguro Médico
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#1E3A8A',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Esta información nos ayuda a gestionar los pagos y reembolsos de manera más eficiente.
                Todos los datos del seguro son confidenciales y están protegidos.
              </p>
            </div>

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
                  Compañía de Seguros
                </label>
                <select
                  value={formData.insurance?.provider || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    insurance: { ...prev.insurance!, provider: e.target.value }
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
                  <option value="">Sin seguro / Pago privado</option>
                  <option value="sanitas">Sanitas</option>
                  <option value="mapfre">Mapfre</option>
                  <option value="axa">AXA</option>
                  <option value="dkv">DKV</option>
                  <option value="asisa">Asisa</option>
                  <option value="cigna">Cigna</option>
                  <option value="otro">Otro</option>
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
                  Número de Póliza
                </label>
                <input
                  type="text"
                  value={formData.insurance?.policyNumber || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    insurance: { ...prev.insurance!, policyNumber: e.target.value }
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
                  placeholder="Número de póliza del seguro"
                />
              </div>
            </div>

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
                  Número de Grupo (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.insurance?.groupNumber || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    insurance: { ...prev.insurance!, groupNumber: e.target.value }
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
                  placeholder="Número de grupo si aplica"
                />
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
                  Copago (€)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.insurance?.copay || 0}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    insurance: { ...prev.insurance!, copay: parseFloat(e.target.value) || 0 }
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
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        );

      case 'clinical':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Fuente de Referencia */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                ¿Cómo nos conoció?
              </label>
              <select
                value={formData.referralSource?.type || 'self'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  referralSource: { ...prev.referralSource!, type: e.target.value as 'self' | 'family' | 'friend' | 'doctor' | 'insurance' | 'online' | 'advertisement' | 'other' }
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  marginBottom: '0.75rem'
                }}
              >
                <option value="self">Búsqueda propia</option>
                <option value="family">Recomendación de familiar</option>
                <option value="friend">Recomendación de amigo</option>
                <option value="doctor">Referencia de otro profesional</option>
                <option value="insurance">A través del seguro médico</option>
                <option value="online">Búsqueda online</option>
                <option value="advertisement">Publicidad</option>
                <option value="other">Otro</option>
              </select>

              {(formData.referralSource?.type === 'doctor' || formData.referralSource?.type === 'other') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input
                    type="text"
                    value={formData.referralSource?.referrerName || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      referralSource: { ...prev.referralSource!, referrerName: e.target.value }
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
                    placeholder="Nombre del profesional o persona que lo refirió"
                  />
                  <textarea
                    value={formData.referralSource?.details || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      referralSource: { ...prev.referralSource!, details: e.target.value }
                    }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    placeholder="Detalles adicionales sobre la referencia..."
                  />
                </div>
              )}
            </div>

            {/* Nivel de Riesgo */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Nivel de Riesgo Inicial
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { value: 'low', label: 'Bajo', color: '#10B981' },
                  { value: 'medium', label: 'Medio', color: '#F59E0B' },
                  { value: 'high', label: 'Alto', color: '#EF4444' }
                ].map((risk) => (
                  <label key={risk.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: `2px solid ${formData.riskLevel === risk.value ? risk.color : '#E5E7EB'}`,
                    backgroundColor: formData.riskLevel === risk.value ? `${risk.color}10` : 'white',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <input
                      type="radio"
                      name="riskLevel"
                      value={risk.value}
                      checked={formData.riskLevel === risk.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, riskLevel: e.target.value as 'low' | 'medium' | 'high' }))}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: risk.color
                    }} />
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: formData.riskLevel === risk.value ? 600 : 400,
                      color: formData.riskLevel === risk.value ? risk.color : '#374151'
                    }}>
                      {risk.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Etiquetas */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Etiquetas de Categorización
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Agregar etiqueta (adolescente, ansiedad, corporativo, etc.)"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addTag}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#6366F1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {formData.tags?.map((tag, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#EEF2FF',
                    color: '#4338CA',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <span>{tag}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeTag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={12} />
                    </motion.button>
                  </div>
                ))}
              </div>

              {/* Etiquetas Sugeridas */}
              <div>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Etiquetas sugeridas:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    'Adolescente', 'Adulto', 'Adulto Mayor', 'Ansiedad', 'Depresión', 
                    'Trastorno Alimentario', 'TDAH', 'Terapia de Pareja', 'Terapia Familiar',
                    'Corporativo', 'Primera Vez', 'Seguimiento', 'Crisis', 'Trauma'
                  ].filter(suggested => !formData.tags?.includes(suggested)).map((suggested) => (
                    <motion.button
                      key={suggested}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          tags: [...(prev.tags || []), suggested]
                        }));
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'white',
                        color: '#6B7280',
                        border: '1px solid #E5E7EB',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      + {suggested}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#F0FDF4',
              borderRadius: '0.5rem',
              border: '1px solid #BBF7D0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Shield size={16} color="#16A34A" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#15803D',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Configuración de Privacidad y Consentimientos
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#166534',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Configure sus preferencias de comunicación y otorgue los consentimientos necesarios
                para brindarle el mejor servicio posible.
              </p>
            </div>

            {/* Preferencias de Comunicación */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Preferencias de Comunicación
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { key: 'allowEmail', label: 'Recibir comunicaciones por email', icon: Mail },
                  { key: 'allowSMS', label: 'Recibir recordatorios por SMS/WhatsApp', icon: Phone },
                  { key: 'allowCalls', label: 'Permitir llamadas telefónicas', icon: Phone },
                  { key: 'shareWithFamily', label: 'Compartir información con familiares autorizados', icon: User }
                ].map((pref) => (
                  <label key={pref.key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <input
                      type="checkbox"
                      checked={formData.privacySettings?.[pref.key as keyof typeof formData.privacySettings] || false}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        privacySettings: {
                          ...prev.privacySettings!,
                          [pref.key]: e.target.checked
                        }
                      }))}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#10B981'
                      }}
                    />
                    <pref.icon size={16} color="#6B7280" />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#374151'
                    }}>
                      {pref.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Consentimientos Obligatorios */}
            <div>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Consentimientos Requeridos
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  {
                    id: 'informed-consent',
                    title: 'Consentimiento Informado para Tratamiento Psicológico',
                    description: 'Acepto recibir tratamiento psicológico y entiendo los riesgos y beneficios asociados.',
                    required: true
                  },
                  {
                    id: 'data-processing',
                    title: 'Tratamiento de Datos Personales (RGPD)',
                    description: 'Autorizo el tratamiento de mis datos personales conforme a la normativa de protección de datos.',
                    required: true
                  },
                  {
                    id: 'recording-consent',
                    title: 'Consentimiento para Grabación de Sesiones (Opcional)',
                    description: 'Autorizo la grabación de sesiones con fines terapéuticos y de supervisión.',
                    required: false
                  },
                  {
                    id: 'research-participation',
                    title: 'Participación en Investigación (Opcional)',
                    description: 'Acepto que mis datos anonimizados puedan ser utilizados para investigación clínica.',
                    required: false
                  }
                ].map((consent) => (
                  <div key={consent.id} style={{
                    padding: '1rem',
                    backgroundColor: consent.required ? '#FEF3C7' : '#F9FAFB',
                    border: `1px solid ${consent.required ? '#FDE68A' : '#E5E7EB'}`,
                    borderRadius: '0.5rem'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.consentForms?.some(c => c.type === consent.id && c.signed) || false}
                        onChange={(e) => {
                          const existingConsents = formData.consentForms || [];
                          const updatedConsents = existingConsents.filter(c => c.type !== consent.id);
                          if (e.target.checked) {
                            updatedConsents.push({
                              id: `consent-${consent.id}-${Date.now()}`,
                              type: consent.id,
                              signed: true,
                              signedDate: new Date(),
                              signedAt: new Date(),
                              documentUrl: `/documents/consent-forms/${consent.id}.pdf`,
                              version: '1.0'
                            });
                          }
                          setFormData(prev => ({
                            ...prev,
                            consentForms: updatedConsents
                          }));
                        }}
                        style={{
                          width: '16px',
                          height: '16px',
                          marginTop: '2px',
                          accentColor: '#10B981'
                        }}
                      />
                      <div>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: consent.required ? '#92400E' : '#374151',
                          marginBottom: '0.25rem'
                        }}>
                          {consent.title}
                          {consent.required && (
                            <span style={{ color: '#DC2626', marginLeft: '0.25rem' }}>*</span>
                          )}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: consent.required ? '#78350F' : '#6B7280',
                          lineHeight: '1.4'
                        }}>
                          {consent.description}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Información Adicional */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#F0F9FF',
              borderRadius: '0.5rem',
              border: '1px solid #E0F2FE'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Eye size={16} color="#0369A1" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0C4A6E',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Sus Derechos
                </span>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#0369A1',
                margin: 0,
                lineHeight: '1.4',
                fontFamily: 'Inter, sans-serif'
              }}>
                Puede modificar estas preferencias en cualquier momento desde su portal de paciente.
                Tiene derecho a acceder, rectificar, suprimir y portar sus datos, así como a limitar
                u oponerse a su tratamiento. Para ejercer estos derechos, contacte con nuestro
                Delegado de Protección de Datos.
              </p>
            </div>
          </div>
        );

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
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {mode === 'create' ? 'Nuevo Paciente' : 'Editar Paciente'}
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {steps[currentStep].title} ({currentStep + 1} de {steps.length})
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onCancel}
            style={{
              padding: '0.5rem',
              backgroundColor: '#F3F4F6',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <X size={20} color="#6B7280" />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div style={{
          padding: '0 1.5rem',
          backgroundColor: '#F9FAFB'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem 0'
          }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <React.Fragment key={step.id}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: isActive ? '#EEF2FF' : isCompleted ? '#F0FDF4' : 'transparent',
                    border: `1px solid ${isActive ? '#C7D2FE' : isCompleted ? '#BBF7D0' : 'transparent'}`
                  }}>
                    <Icon 
                      size={16} 
                      color={isActive ? '#4338CA' : isCompleted ? '#16A34A' : '#9CA3AF'} 
                    />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#4338CA' : isCompleted ? '#16A34A' : '#9CA3AF',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div style={{
                      width: '1rem',
                      height: '2px',
                      backgroundColor: isCompleted ? '#16A34A' : '#E5E7EB',
                      borderRadius: '1px'
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          borderTop: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB'
        }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePrevious}
            disabled={currentStep === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: currentStep === 0 ? '#F3F4F6' : 'white',
              color: currentStep === 0 ? '#9CA3AF' : '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Anterior
          </motion.button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
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
              Cancelar
            </motion.button>

            {currentStep === steps.length - 1 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isSubmitting ? '#9CA3AF' : '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid white',
                      borderTop: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {mode === 'create' ? 'Crear Paciente' : 'Guardar Cambios'}
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6366F1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Siguiente
              </motion.button>
            )}
          </div>
        </div>
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
