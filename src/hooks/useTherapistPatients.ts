'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExtendedPatient } from '@/types/clinical';

export function useTherapistPatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<ExtendedPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockPatients = useMemo<ExtendedPatient[]>(() => [
    {
      id: '1',
      firstName: 'María',
      lastName: 'González Pérez',
      email: 'maria.gonzalez@email.com',
      phone: '+34 612 345 678',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'female',
      pronouns: 'ella/la',
      identification: {
        type: 'dni',
        number: '12345678A',
        expiryDate: new Date('2030-03-15')
      },
      address: {
        street: 'Calle Mayor 123, 2º A',
        city: 'Madrid',
        state: 'Madrid',
        zipCode: '28001',
        country: 'España'
      },
      emergencyContact: {
        name: 'Carlos González',
        phone: '+34 612 345 679',
        relationship: 'esposo',
        email: 'carlos@email.com'
      },
      insurance: {
        provider: 'Sanitas',
        policyNumber: 'SAN123456789',
        groupNumber: 'GRP001',
        copay: 15
      },
      medicalInfo: {
        allergies: ['Polen', 'Frutos secos'],
        currentMedications: [
          {
            name: 'Sertralina',
            dosage: '50mg',
            frequency: '1 vez al día',
            prescribedBy: 'Dr. Martínez',
            startDate: new Date('2024-01-15'),
            notes: 'Tomar por la mañana con el desayuno'
          }
        ],
        medicalHistory: ['Episodio depresivo mayor (2023)'],
        previousTherapy: true,
        previousTherapyDetails: 'Terapia cognitivo-conductual durante 6 meses en 2023'
      },
      assignedTherapist: user?.firstName + ' ' + user?.lastName || 'Dra. Ana García',
      status: 'active',
      tags: ['ansiedad', 'depresión', 'terapia-cognitiva'],
      riskLevel: 'medium',
      assessmentScores: {
        phq9: 12,
        gad7: 8,
        custom: {}
      },
      referralSource: {
        type: 'doctor',
        details: 'Referido por médico de cabecera',
        referrerName: 'Dr. Martínez',
        referrerContact: 'martinez@clinica.com'
      },
      consentForms: [
        {
          id: 'consent-1',
          type: 'informed-consent',
          signed: true,
          signedDate: new Date('2024-01-10'),
          signedAt: new Date('2024-01-10'),
          documentUrl: '/documents/consent-informed.pdf',
          version: '1.0'
        }
      ],
      privacySettings: {
        allowSMS: true,
        allowEmail: true,
        allowCalls: true,
        shareWithFamily: false
      },
      adherenceRate: 85,
      feedback: [],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      lastSession: new Date('2024-03-10'),
      totalSessions: 8,
      emotionalState: 'stable',
      nextAppointment: new Date('2024-03-20')
    },
    {
      id: '2',
      firstName: 'Carlos',
      lastName: 'Rodríguez López',
      email: 'carlos.rodriguez@email.com',
      phone: '+34 623 456 789',
      dateOfBirth: new Date('1992-07-22'),
      gender: 'male',
      pronouns: 'él/lo',
      identification: {
        type: 'dni',
        number: '87654321B'
      },
      address: {
        street: 'Avenida de la Paz 45, 1º B',
        city: 'Barcelona',
        state: 'Cataluña',
        zipCode: '08001',
        country: 'España'
      },
      emergencyContact: {
        name: 'Ana Rodríguez',
        phone: '+34 623 456 790',
        relationship: 'madre'
      },
      insurance: {
        provider: 'Mapfre',
        policyNumber: 'MAP987654321',
        copay: 20
      },
      medicalInfo: {
        allergies: [],
        currentMedications: [],
        medicalHistory: ['TDAH diagnosticado en la infancia'],
        previousTherapy: false
      },
      assignedTherapist: user?.firstName + ' ' + user?.lastName || 'Dra. Ana García',
      status: 'active',
      tags: ['tdah', 'adulto-joven', 'primera-vez'],
      riskLevel: 'low',
      assessmentScores: {
        phq9: 6,
        gad7: 4,
        custom: {}
      },
      referralSource: {
        type: 'online',
        details: 'Encontró el centro a través de búsqueda en Google'
      },
      consentForms: [
        {
          id: 'consent-2',
          type: 'informed-consent',
          signed: true,
          signedDate: new Date('2024-02-01'),
          signedAt: new Date('2024-02-01'),
          documentUrl: '/documents/consent-informed.pdf',
          version: '1.0'
        }
      ],
      privacySettings: {
        allowSMS: true,
        allowEmail: true,
        allowCalls: false,
        shareWithFamily: true
      },
      adherenceRate: 95,
      feedback: [],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-14'),
      lastSession: new Date('2024-03-12'),
      totalSessions: 6,
      emotionalState: 'improving',
      nextAppointment: new Date('2024-03-19')
    },
    {
      id: '3',
      firstName: 'Ana',
      lastName: 'Martínez Silva',
      email: 'ana.martinez@email.com',
      phone: '+34 634 567 890',
      dateOfBirth: new Date('1978-11-08'),
      gender: 'female',
      pronouns: 'ella/la',
      identification: {
        type: 'dni',
        number: '11223344C'
      },
      address: {
        street: 'Plaza del Sol 12, 3º C',
        city: 'Valencia',
        state: 'Valencia',
        zipCode: '46001',
        country: 'España'
      },
      emergencyContact: {
        name: 'Miguel Martínez',
        phone: '+34 634 567 891',
        relationship: 'hermano',
        email: 'miguel@email.com'
      },
      medicalInfo: {
        allergies: ['Penicilina'],
        currentMedications: [
          {
            name: 'Lorazepam',
            dosage: '1mg',
            frequency: 'Según necesidad',
            prescribedBy: 'Dra. López',
            startDate: new Date('2024-01-20'),
            notes: 'Solo para crisis de ansiedad'
          }
        ],
        medicalHistory: ['Trastorno de ansiedad generalizada'],
        previousTherapy: true,
        previousTherapyDetails: 'Terapia familiar hace 5 años'
      },
      assignedTherapist: user?.firstName + ' ' + user?.lastName || 'Dra. Ana García',
      status: 'active',
      tags: ['ansiedad-generalizada', 'crisis-panico', 'adulto'],
      riskLevel: 'high',
      assessmentScores: {
        phq9: 8,
        gad7: 15,
        custom: {}
      },
      referralSource: {
        type: 'friend',
        details: 'Recomendación de una amiga que fue paciente'
      },
      consentForms: [
        {
          id: 'consent-3',
          type: 'informed-consent',
          signed: true,
          signedDate: new Date('2024-01-15'),
          signedAt: new Date('2024-01-15'),
          documentUrl: '/documents/consent-informed.pdf',
          version: '1.0'
        }
      ],
      privacySettings: {
        allowSMS: false,
        allowEmail: true,
        allowCalls: true,
        shareWithFamily: false
      },
      adherenceRate: 75,
      feedback: [],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-13'),
      lastSession: new Date('2024-03-08'),
      totalSessions: 10,
      emotionalState: 'struggling',
      nextAppointment: new Date('2024-03-22')
    },
    {
      id: '4',
      firstName: 'David',
      lastName: 'López García',
      email: 'david.lopez@email.com',
      phone: '+34 645 678 901',
      dateOfBirth: new Date('2001-05-12'),
      gender: 'male',
      pronouns: 'él/lo',
      identification: {
        type: 'dni',
        number: '55667788D'
      },
      address: {
        street: 'Calle de la Luna 78, 4º A',
        city: 'Sevilla',
        state: 'Andalucía',
        zipCode: '41001',
        country: 'España'
      },
      emergencyContact: {
        name: 'Carmen López',
        phone: '+34 645 678 902',
        relationship: 'madre'
      },
      medicalInfo: {
        allergies: [],
        currentMedications: [],
        medicalHistory: [],
        previousTherapy: false
      },
      assignedTherapist: user?.firstName + ' ' + user?.lastName || 'Dra. Ana García',
      status: 'pending',
      tags: ['adolescente', 'primera-vez', 'universitario'],
      riskLevel: 'low',
      assessmentScores: {
        custom: {}
      },
      referralSource: {
        type: 'family',
        details: 'Los padres solicitaron la consulta'
      },
      consentForms: [],
      privacySettings: {
        allowSMS: true,
        allowEmail: true,
        allowCalls: true,
        shareWithFamily: true
      },
      adherenceRate: 0,
      feedback: [],
      createdAt: new Date('2024-03-18'),
      updatedAt: new Date('2024-03-18'),
      totalSessions: 0,
      emotionalState: 'unknown'
    },
    {
      id: '5',
      firstName: 'Laura',
      lastName: 'Fernández Ruiz',
      email: 'laura.fernandez@email.com',
      phone: '+34 656 789 012',
      dateOfBirth: new Date('1995-09-30'),
      gender: 'female',
      pronouns: 'ella/la',
      identification: {
        type: 'nie',
        number: 'X1234567L'
      },
      address: {
        street: 'Paseo de Gracia 156, 2º D',
        city: 'Barcelona',
        state: 'Cataluña',
        zipCode: '08008',
        country: 'España'
      },
      emergencyContact: {
        name: 'Roberto Fernández',
        phone: '+34 656 789 013',
        relationship: 'pareja'
      },
      medicalInfo: {
        allergies: ['Látex'],
        currentMedications: [
          {
            name: 'Escitalopram',
            dosage: '10mg',
            frequency: '1 vez al día',
            prescribedBy: 'Dr. Sánchez',
            startDate: new Date('2024-02-10'),
            notes: 'Tomar por la noche'
          }
        ],
        medicalHistory: ['Episodio depresivo leve'],
        previousTherapy: true,
        previousTherapyDetails: 'Terapia online durante la pandemia'
      },
      assignedTherapist: user?.firstName + ' ' + user?.lastName || 'Dra. Ana García',
      status: 'discharged',
      tags: ['depresión', 'terapia-pareja', 'alta-terapéutica'],
      riskLevel: 'low',
      assessmentScores: {
        phq9: 3,
        gad7: 2,
        custom: {}
      },
      referralSource: {
        type: 'insurance',
        details: 'Derivada por el seguro médico'
      },
      consentForms: [
        {
          id: 'consent-5',
          type: 'informed-consent',
          signed: true,
          signedDate: new Date('2024-01-05'),
          signedAt: new Date('2024-01-05'),
          documentUrl: '/documents/consent-informed.pdf',
          version: '1.0'
        }
      ],
      privacySettings: {
        allowSMS: true,
        allowEmail: true,
        allowCalls: true,
        shareWithFamily: false
      },
      adherenceRate: 100,
      feedback: [
        {
          id: 'feedback-1',
          rating: 5,
          comment: 'Excelente profesional, me ayudó mucho en mi proceso',
          date: new Date('2024-03-01'),
          anonymous: false
        }
      ],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-03-01'),
      lastSession: new Date('2024-02-28'),
      totalSessions: 12,
      emotionalState: 'stable'
    }
  ], [user]);

  const fetchPatients = useCallback(async () => {
    if (!user || user.role !== 'therapist') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, this would fetch from Firebase
      // const therapistPatients = await clinicalService.getPatientsByTherapist(
      //   user.centerId, 
      //   user.id
      // );

      setPatients(mockPatients);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [user, mockPatients]);

  const createPatient = useCallback(async (patientData: Partial<ExtendedPatient>) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPatient: ExtendedPatient = {
        id: `patient_${Date.now()}`,
        firstName: patientData.firstName || '',
        lastName: patientData.lastName || '',
        email: patientData.email || '',
        phone: patientData.phone || '',
        dateOfBirth: patientData.dateOfBirth || new Date(),
        gender: patientData.gender || 'prefer-not-to-say',
        pronouns: patientData.pronouns || '',
        identification: patientData.identification || { type: 'dni', number: '' },
        address: patientData.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'España'
        },
        emergencyContact: patientData.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        insurance: patientData.insurance,
        medicalInfo: patientData.medicalInfo || {
          allergies: [],
          currentMedications: [],
          medicalHistory: [],
          previousTherapy: false
        },
        assignedTherapist: user.firstName + ' ' + user.lastName,
        status: patientData.status || 'active',
        tags: patientData.tags || [],
        riskLevel: patientData.riskLevel || 'low',
        assessmentScores: patientData.assessmentScores || { custom: {} },
        referralSource: patientData.referralSource || { type: 'self' },
        consentForms: patientData.consentForms || [],
        privacySettings: patientData.privacySettings || {
          allowSMS: true,
          allowEmail: true,
          allowCalls: true,
          shareWithFamily: false
        },
        adherenceRate: 0,
        feedback: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        totalSessions: 0,
        emotionalState: 'unknown'
      };

      // In real implementation:
      // const createdPatient = await clinicalService.createPatient(user.centerId, newPatient);

      setPatients(prev => [newPatient, ...prev]);
      return newPatient;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }, [user]);

  const updatePatient = useCallback(async (patientId: string, updates: Partial<ExtendedPatient>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // In real implementation:
      // await clinicalService.updatePatient(user.centerId, patientId, updates);

      setPatients(prev => prev.map(patient => 
        patient.id === patientId 
          ? { ...patient, ...updates, updatedAt: new Date() }
          : patient
      ));
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }, []);

  const deletePatient = useCallback(async (patientId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // In real implementation:
      // await clinicalService.deletePatient(user.centerId, patientId);

      setPatients(prev => prev.filter(patient => patient.id !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }, []);

  const refreshPatients = useCallback(async () => {
    await fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    loading,
    error,
    createPatient,
    updatePatient,
    deletePatient,
    refreshPatients
  };
}
