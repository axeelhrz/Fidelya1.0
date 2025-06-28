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
  Users,
  Star,
  Clock,
  Activity
} from 'lucide-react';
import { ExtendedPatient, PatientDocument } from '@/types/clinical';

interface PatientFormProps {
  patient?: ExtendedPatient;
  onSavePerfecto! Ahora voy a implementar el **Submódulo 1.2 - Maestro de Pacientes** con todas las funcionalidades avanzadas que especificaste.

## Paso 3: Implementación del Submódulo 1.2 - Maestro de Pacientes

Primero, voy a crear el formulario completo de registro de pacientes:

```typescript file="src/components/clinical/patients/PatientForm.tsx"
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
  Alert: (patientData: Partial<ExtendedPatient>) => Promise<void>;
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
    addressTriangle,
  Save,
  X,: {
      street: '',
      city
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
  onSave: (patientData: Partial<ExtendedPat: '',
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
    statusient>) => Promise<void>;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export function PatientForm({ patient, onSave, onCancel, mode }: PatientFormProps) {
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
    consentF: 'active',
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
    { id: 'basic', title: 'Información Básica', iconorms: [],
    privacySettings: {
      allowSMS: true,
      allowEmail: true,
      allowCalls: true,
      shareWithFamily: false
    },
    adherenceRate: 0,
    feedback: []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep: User },
    { id: 'contact', title: 'Contacto y Dirección', icon: MapPin },
    { id: 'emergency', title: 'Contacto de Emergencia', icon: Phone },
    { id: 'medical', title: 'Información Médica', icon: Heart },
    { id: 'insurance', title: 'Seguro Médico', icon: Shield },
    { id: 'clinical', title: 'Información Clínica', icon: Activity },
    { id: 'privacy', title: 'Privacidad y Consentimiento', icon: Star }
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

  const validateStep = (stepIndex: number) => {
    const newErrors: { [key: string]: string } = {};
    const step = steps[stepIndex];

    switch (step.id) {
      case 'basic':
        if (!formData.firstName?.trim()) newErrors.firstName = 'Nombre es requerido';
        if (!formData.lastName?.trim()) newErrors.lastName = 'Apellido es requerido';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Fecha de nacimiento es requerida';
        if (!formData.identification?.number?.trim()) newErrors.identificationNumber = 'Número de identificación es requerido';
        break;
      
      case 'contact':
        if (!formData.email?.trim()) {
          newErrors.email = 'Email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email no válido';
        }
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
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

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
    const step = steps[currentStep];

    switch (step.id) {
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
                  type="] = useState(0);
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
                  fontFamily:text"
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
                  onChange={(e) => setFormData 'Inter, sans-serif'
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
                  placeholder="+34 612 345 678"
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
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
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
                <input
                  type="text"
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
                />
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
              borderRadius: '0.75rem',
              border: '1px solid #FDE68A'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <AlertTriangle size={16} color="#92400E" />
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
                fontSize: '0.875rem',
                color: '#78350F',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Esta información será utilizada únicamente en caso de emergencia médica o situaciones críticas.
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
                  <option value="esposo">Esposo</option>
                  <option value="esposa">Esposa</option>
                  <option value="hermano">Hermano</option>
                  <option value="hermana">Hermana</option>
                  <option value="hijo">Hijo</option>
                  <option value="hija">Hija</option>
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
                  placeholder="+34 612 345 678"
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
                (prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.phone ? '#EF4444' : '#E5E7EB'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="+34 612 345 678"
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
                <input
                  type="text"
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
                />
              </div>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#EFF6FF',
              borderRadius: '0.75rem',
              border: '1px solid #DBEAFE'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Phone size={16} color="#2563EB" />
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#1E40AF',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Contacto de Emergencia
                </h4>
              </div>
              <p style={{
                fontSize: '0.75rem',
                color: '#1E40AF',
                margin: 0,
                fontFamily: 'Inter, sans-serif'
              }}>
                Esta información será utilizada únicamente en caso de emergencia médica o situaciones críticas.
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
                  <option value="esposo">Esposo</option>
                  <option value="esposa">Esposa</option>
                  <option value="hijo">Hijo</option>
                  <option value="hija">Hija</option>
                  <option value="hermano">Hermano</option>
                  <option value="hermana">Hermana</option>
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
                  placeholder="+34 612 345 678"
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
        return (    fontSize: '0.875rem',
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5
                    fontFamily: 'Inter, sans-serif',
                    outline: 'rem' }}>
            {/* Allergies */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                colornone'
                  }}
                  placeholder="email@ejemplo.com"
                />
              </div>
            </div>
          </div>
        );

      case 'medical':
        return (: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
          <div style={{ display: 'flex', flexDirection: 'column', gap
              }}>
                Alergias
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
                    fontFamily:: '1.5rem' }}>
            {/* Allergies */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Alergias
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
                    border: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Agregar alergia"
                />
                <motion.button
                  whileHover={{ scale: 1. '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addAllergy}
                  type="button"
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#2563EB',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Agregar
                </motion.button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {formData.medicalInfo?.allergies?.map((    outline: 'none'
                  }}
                  placeholder="Agregar alergia"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addAllergy}
                  type="button"
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#2563EB',
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
                {formData.medicalInfo?.allergies?.map((allergy, index)allergy, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      display => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <span>{allergy}</span>
                    <button
                      onClick={() => removeAllergy(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      borderRadius: '1rem',
                      fontSize: '0.875rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <span>{allergy}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeAllergy(index)}
                      type="button"
                      style={{
                        padding: '0.125rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer': 'center'
                      }}
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current
                      }}
                    >
                      <X size={12} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div> Medications */}
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
                  placeholder="
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
                  }}Nombre del medicamento"
                />
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  style={{
                    padding: '0.75rem',
                    border
                  placeholder="Nombre del medicamento"
                />
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  style={{
                    padding: '0.75rem: '1px solid #E5E7EB',
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
                    ',
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
                  }}outline: 'none'
                  }}
                  placeholder="Frecuencia"
                />
                <input
                  type="text"
                  placeholder="Frecuencia"
                />
                <input
                  type="text"
                  value={newMedication.presc
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0ribedBy}
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
                  type="button"
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#10B981',
                .98 }}
                  onClick={addMedication}
                  type="button"
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor:    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                </motion.button>
              </div>

              <div style={{ display: 'flex '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Agregar
                </motion.button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {formData.medicalInfo?.currentMedications?.map((medication, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: ', flexDirection: 'column', gap: '0.5rem' }}>
                {formData.medicalInfo?.currentMedications?.map((medication, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      backgroundColor: '#F0FDF4',
                      borderRadius: '0.5rem',
                      border: '1px solid #1, y: 0 }}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '0.5rem',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <div style={{BBF7D0'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {medication.name} - {medication.dosage}
                       display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.25rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {medication.name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {medication.dosage} • {medication.frequency} • Prescrito por: {medication.prescribedBy}
                        </div>
                      </div>
                      <button
                        onClick={() => removeMedication(index)}
                        style={{
                          background: 'none',
                          border:</div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {medication.frequency} • Prescrito por: {medication.prescribedBy}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeMedication(index)}
                      type="button"
                      style={{
                        padding: '0.25rem',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    > 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '
                      <Trash2 size={14} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            0.25rem',
                          borderRadius: '0.25rem'
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Previous Therapy */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0</div>

            {/* Previous Therapy */}
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
                  .5rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.medicalInfo?.previousTherapy || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicalInfo: { ...prev.medicalInfo!, previousTherapy: e.target.checked }
                  })onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicalInfo: { ...prev.medicalInfo!, previousTherapy: e.target.checked }
                  }))}
                />
                ¿Ha recibido terapia psicológica anteriormente?
              </label>

              {formData.medicalInfo?.previousTherapy && (
                <textarea
                  value={formData.medicalInfo?.previousTherap)}
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
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  placeholder="Describa brevemente la terapia anterior (cuándo, tipo, duración, resultados...)"
                />
              )}
            </div>
          </div>
        );

      case 'insurance':
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
                  fontSize: '0.875rem',yDetails || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    medicalInfo: { ...prev.medicalInfo!, previousTherapyDetails: e.target.value }
                  }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                  placeholder="Describa brevemente la terapia anterior, duración, motivo, etc."
                />
              )}
            </div>
          </div>
        );

      case 'insurance':
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
                  Compañía de Seguros
                </label>
                <input
                  type="text"
                  
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Compañía de Seguros
                </label>
                <input
                  type="text"
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
                  placeholder="Sanitas, Adeslas, DKV, etc."
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
                  Número de Póliza
                </label>
                <input
                  type="text"
                  value={formData.insurance?.policyNumber || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    insurance: { ...prev.insurance!, policyNumber: e.target.value }
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
                  placeholder="Sanitas, Adeslas, DKV, etc."
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
                  placeholder="Número de póliza"
                />}))}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Número de póliza"
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
                  Número de Grupo
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
                    borderRadius: '
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
                  Número de Grupo
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
                  placeholder="Número de grupo (si aplica)"
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.50.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none'
                  }}
                  placeholder="Número de grupo (si aplica)"
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

            <div style={{
              padding: '1rem',
              backgroundColor: '#FFFBEB',
              borderRadius: '0.75rem',
              border: '1px solid #FDE68A'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Shield size={16} color="#F59E0B" />
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#92400E',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Información del Seguro
                </h4>
              
