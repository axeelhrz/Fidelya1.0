'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  FileText,
  Target,
  Brain,
  Video,
  Activity,
  Search,
  Settings
} from 'lucide-react';

// Import all clinical components
import { CalendarView } from '@/components/clinical/agenda/CalendarView';
import { AppointmentModal } from '@/components/clinical/agenda/AppointmentModal';
import { PatientForm } from '@/components/clinical/patients/PatientForm';
import { PatientTimeline } from '@/components/clinical/patients/PatientTimeline';
import { PatientDocuments } from '@/components/clinical/patients/PatientDocuments';
import { NotesEditor } from '@/components/clinical/notes/NotesEditor';
import { TreatmentPlanEditor } from '@/components/clinical/treatment/TreatmentPlanEditor';
import { TreatmentRoadmap } from '@/components/clinical/treatment/TreatmentRoadmap';
import { AssessmentManager } from '@/components/clinical/assessments/AssessmentManager';
import { AssessmentComparison } from '@/components/clinical/assessments/AssessmentComparison';
import { TeleconsultationManager } from '@/components/clinical/teleconsultation/TeleconsultationManager';
import { TeleconsultationSettings } from '@/components/clinical/teleconsultation/TeleconsultationSettings';
import { PatientPortalDashboard } from '@/components/clinical/patient-portal/PatientPortalDashboard';
import { SupervisionManager } from '@/components/clinical/supervision/SupervisionManager';
import { CompetencyRadar } from '@/components/clinical/supervision/CompetencyRadar';
import { DocumentManager } from '@/components/clinical/documents/DocumentManager';
import { GlobalSearchCommand } from '@/components/clinical/GlobalSearchCommand';

// Mock data
const mockPatient = {
  id: '1',
  firstName: 'María',
  lastName: 'González',
  email: 'maria.gonzalez@email.com',
  phone: '+34 666 123 456',
  birthDate: new Date('1985-03-15'),
  gender: 'female',
  age: 38,
  status: 'active' as const,
  riskLevel: 'medium' as const,
  lastSession: new Date('2024-01-15'),
  centerId: 'center1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15')
};

const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    patientName: 'María González',
    therapistId: 'therapist1',
    therapistName: 'Dr. Juan Pérez',
    dateTime: new Date('2024-02-15T10:00:00'),
    duration: 60,
    type: 'individual' as const,
    status: 'confirmed' as const,
    notes: 'Sesión de seguimiento',
    centerId: 'center1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockDocuments = [
  {
    id: '1',
    title: 'Consentimiento Informado',
    type: 'consent' as const,
    status: 'signed' as const,
    content: 'Contenido del consentimiento...',
    patientId: '1',
    patientName: 'María González',
    tags: ['consentimiento', 'firmado'],
    isConfidential: true,
    requiresSignature: true,
    centerId: 'center1',
    createdBy: 'therapist1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

const mockTherapists = [
  {
    id: 'therapist1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@centro.com',
    specialization: 'Psicología Clínica',
    activePatients: 15,
    centerId: 'center1'
  }
];

const mockPortalData = {
  upcomingAppointments: mockAppointments,
  tasks: [
    {
      id: '1',
      title: 'Ejercicio de respiración',
      description: 'Practicar técnica de respiración diafragmática',
      type: 'homework' as const,
      priority: 'medium' as const,
      completed: false,
      dueDate: new Date('2024-02-20'),
      estimatedDuration: 15,
      instructions: 'Realizar 3 veces al día durante 5 minutos'
    }
  ],
  documents: mockDocuments,
  payments: {
    totalPaid: 450,
    pendingAmount: 120,
    invoiceCount: 8,
    history: [
      {
        id: '1',
        amount: 60,
        description: 'Sesión individual',
        date: new Date('2024-01-15'),
        method: 'Tarjeta de crédito'
      }
    ]
  },
  notifications: [
    {
      id: '1',
      title: 'Próxima cita',
      message: 'Tienes una cita mañana a las 10:00',
      timestamp: new Date(),
      read: false,
      type: 'appointment' as const
    }
  ],
  moodLogs: []
};

export default function TestClinicalPage() {
  const [activeComponent, setActiveComponent] = useState('agenda');
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  const components = [
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'patients', label: 'Pacientes', icon: Users },
    { id: 'notes', label: 'Notas', icon: FileText },
    { id: 'treatment', label: 'Tratamiento', icon: Target },
    { id: 'assessments', label: 'Evaluaciones', icon: Brain },
    { id: 'teleconsult', label: 'Teleconsulta', icon: Video },
    { id: 'portal', label: 'Portal Paciente', icon: Activity },
    { id: 'supervision', label: 'Supervisión', icon: Users },
    { id: 'documents', label: 'Documentos', icon: FileText }
  ];

  // Mock handlers
  const mockHandlers = {
    onCreateAppointment: (data: any) => console.log('Create appointment:', data),
    onUpdateAppointment: (id: string, data: any) => console.log('Update appointment:', id, data),
    onDeleteAppointment: (id: string) => console.log('Delete appointment:', id),
    onCreatePatient: (data: any) => console.log('Create patient:', data),
    onUpdatePatient: (id: string, data: any) => console.log('Update patient:', id, data),
    onCreateNote: (data: any) => console.log('Create note:', data),
    onUpdateNote: (id: string, data: any) => console.log('Update note:', id, data),
    onCreateTreatmentPlan: (data: any) => console.log('Create treatment plan:', data),
    onUpdateTreatmentPlan: (id: string, data: any) => console.log('Update treatment plan:', id, data),
    onCreateAssessment: (data: any) => console.log('Create assessment:', data),
    onUpdateAssessment: (id: string, data: any) => console.log('Update assessment:', id, data),
    onCreateDocument: (data: any) => console.log('Create document:', data),
    onUpdateDocument: (id: string, data: any) => console.log('Update document:', id, data),
    onDeleteDocument: (id: string) => console.log('Delete document:', id),
    onGeneratePDF: (id: string) => console.log('Generate PDF:', id),
    onScanDocument: () => console.log('Scan document'),
    onNavigate: (url: string) => console.log('Navigate to:', url),
    onToggleFavorite: (item: any) => console.log('Toggle favorite:', item),
    onUpdateProfile: (data: any) => console.log('Update profile:', data),
    onScheduleAppointment: (data: any) => console.log('Schedule appointment:', data),
    onCompleteTask: (taskId: string) => console.log('Complete task:', taskId),
    onMakePayment: (amount: number, description: string) => console.log('Make payment:', amount, description)
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'agenda':
        return (
          <CalendarView
            appointments={mockAppointments}
            onCreateAppointment={mockHandlers.onCreateAppointment}
            onUpdateAppointment={mockHandlers.onUpdateAppointment}
            onDeleteAppointment={mockHandlers.onDeleteAppointment}
          />
        );
      
      case 'patients':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <PatientForm
              patient={null}
              onSubmit={mockHandlers.onCreatePatient}
              onCancel={() => console.log('Cancel')}
            />
            <PatientTimeline
              patientId="1"
              events={[
                {
                  id: '1',
                  type: 'session',
                  title: 'Sesión Individual',
                  date: new Date('2024-01-15'),
                  description: 'Primera sesión de evaluación',
                  therapistName: 'Dr. Juan Pérez'
                }
              ]}
              onExport={() => console.log('Export timeline')}
            />
          </div>
        );
      
      case 'notes':
        return (
          <NotesEditor
            note={null}
            patientId="1"
            onSave={mockHandlers.onCreateNote}
            onCancel={() => console.log('Cancel')}
          />
        );
      
      case 'treatment':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <TreatmentPlanEditor
              plan={null}
              patientId="1"
              onSave={mockHandlers.onCreateTreatmentPlan}
              onCancel={() => console.log('Cancel')}
            />
            <TreatmentRoadmap
              plan={{
                id: '1',
                patientId: '1',
                title: 'Plan de Tratamiento para Ansiedad',
                goals: [
                  {
                    id: '1',
                    title: 'Reducir síntomas de ansiedad',
                    category: 'emotional',
                    description: 'Disminuir la frecuencia e intensidad de los episodios de ansiedad',
                    targetDate: new Date('2024-06-01'),
                    progress: 65,
                    milestones: [
                      {
                        id: '1',
                        title: 'Identificar triggers',
                        completed: true,
                        date: new Date('2024-02-01')
                      }
                    ]
                  }
                ],
                tasks: [],
                adherence: 75,
                centerId: 'center1',
                createdBy: 'therapist1',
                createdAt: new Date(),
                updatedAt: new Date()
              }}
              viewMode="monthly"
              onUpdatePlan={mockHandlers.onUpdateTreatmentPlan}
            />
          </div>
        );
      
      case 'assessments':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AssessmentManager
              assessments={[
                {
                  id: '1',
                  patientId: '1',
                  testName: 'PHQ-9',
                  category: 'depression',
                  date: new Date('2024-01-15'),
                  score: 12,
                  interpretation: 'Depresión moderada',
                  centerId: 'center1',
                  createdBy: 'therapist1',
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]}
              onCreateAssessment={mockHandlers.onCreateAssessment}
              onUpdateAssessment={mockHandlers.onUpdateAssessment}
              onDeleteAssessment={(id) => console.log('Delete assessment:', id)}
              onGenerateReport={(id) => console.log('Generate report:', id)}
            />
            <AssessmentComparison
              assessments={[
                {
                  id: '1',
                  patientId: '1',
                  testName: 'PHQ-9',
                  category: 'depression',
                  date: new Date('2024-01-15'),
                  score: 12,
                  interpretation: 'Depresión moderada',
                  centerId: 'center1',
                  createdBy: 'therapist1',
                  createdAt: new Date(),
                  updatedAt: new Date()
                },
                {
                  id: '2',
                  patientId: '1',
                  testName: 'PHQ-9',
                  category: 'depression',
                  date: new Date('2024-02-15'),
                  score: 8,
                  interpretation: 'Depresión leve',
                  centerId: 'center1',
                  createdBy: 'therapist1',
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]}
              patientId="1"
              onExportReport={() => console.log('Export report')}
            />
          </div>
        );
      
      case 'teleconsult':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <TeleconsultationManager
              session={{
                id: '1',
                appointmentId: '1',
                patientId: '1',
                therapistId: 'therapist1',
                meetingUrl: 'https://zoom.us/j/123456789',
                status: 'waiting',
                startTime: new Date(),
                duration: 0,
                centerId: 'center1',
                createdAt: new Date(),
                updatedAt: new Date()
              }}
              onUpdateSession={(id, data) => console.log('Update session:', id, data)}
              onEndSession={(id) => console.log('End session:', id)}
            />
            <TeleconsultationSettings
              settings={{
                platform: 'zoom',
                autoGenerateLinks: true,
                sendReminders: true,
                recordSessions: false,
                waitingRoom: true,
                participantAuthentication: true,
                qualitySettings: {
                  video: 'hd',
                  audio: 'high'
                }
              }}
              onUpdateSettings={(settings) => console.log('Update settings:', settings)}
            />
          </div>
        );
      
      case 'portal':
        return (
          <PatientPortalDashboard
            patient={mockPatient}
            portalData={mockPortalData}
            onUpdateProfile={mockHandlers.onUpdateProfile}
            onScheduleAppointment={mockHandlers.onScheduleAppointment}
            onCompleteTask={mockHandlers.onCompleteTask}
            onMakePayment={mockHandlers.onMakePayment}
          />
        );
      
      case 'supervision':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <SupervisionManager
              therapists={mockTherapists}
              sessions={[
                {
                  id: '1',
                  therapistId: 'therapist1',
                  therapistName: 'Juan Pérez',
                  supervisorId: 'supervisor1',
                  supervisorName: 'Dra. Ana López',
                  date: new Date('2024-01-15'),
                  duration: 60,
                  type: 'individual',
                  status: 'completed',
                  notes: 'Revisión de casos complejos',
                  competenciesReviewed: ['therapeutic', 'assessment'],
                  actionItems: ['Revisar protocolo de evaluación', 'Programar seguimiento'],
                  centerId: 'center1',
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]}
              competencies={[
                {
                  id: '1',
                  therapistId: 'therapist1',
                  categoryId: 'therapeutic',
                  name: 'Rapport terapéutico',
                  description: 'Capacidad para establecer una relación terapéutica efectiva',
                  score: 85,
                  lastEvaluated: new Date('2024-01-15'),
                  notes: 'Excelente capacidad de conexión con pacientes',
                  centerId: 'center1',
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]}
              metrics={{
                activeTherapists: 5,
                newTherapistsThisMonth: 1,
                totalSessions: 25,
                sessionsThisMonth: 8,
                averageCompetencyScore: 82,
                competencyTrend: 5,
                riskAlerts: 2
              }}
              onCreateSession={(data) => console.log('Create session:', data)}
              onUpdateSession={(id, data) => console.log('Update session:', id, data)}
              onDeleteSession={(id) => console.log('Delete session:', id)}
            />
            <CompetencyRadar
              therapist={mockTherapists[0]}
              competencies={[
                {
                  id: '1',
                  therapistId: 'therapist1',
                  categoryId: 'therapeutic',
                  name: 'Rapport terapéutico',
                  description: 'Capacidad para establecer una relación terapéutica efectiva',
                  score: 85,
                  lastEvaluated: new Date('2024-01-15'),
                  notes: 'Excelente capacidad de conexión con pacientes',
                  centerId: 'center1',
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]}
              categories={[
                { id: 'therapeutic', name: 'Habilidades Terapéuticas', color: '#10B981' },
                { id: 'assessment', name: 'Evaluación', color: '#6366F1' },
                { id: 'intervention', name: 'Intervención', color: '#F59E0B' },
                { id: 'ethics', name: 'Ética Profesional', color: '#EF4444' },
                { id: 'communication', name: 'Comunicación', color: '#8B5CF6' },
                { id: 'documentation', name: 'Documentación', color: '#06B6D4' }
              ]}
              onUpdateCompetency={(id, score, notes) => console.log('Update competency:', id, score, notes)}
              onAddCompetency={(data) => console.log('Add competency:', data)}
            />
          </div>
        );
      
      case 'documents':
        return (
          <DocumentManager
            documents={mockDocuments}
            templates={[]}
            onCreateDocument={mockHandlers.onCreateDocument}
            onUpdateDocument={mockHandlers.onUpdateDocument}
            onDeleteDocument={mockHandlers.onDeleteDocument}
            onGeneratePDF={mockHandlers.onGeneratePDF}
            onScanDocument={mockHandlers.onScanDocument}
          />
        );
      
      default:
        return (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#374151',
              margin: '0 0 1rem 0',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Selecciona un componente para probar
            </h3>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Usa la barra lateral para navegar entre los diferentes módulos del sistema clínico.
            </p>
          </div>
        );
    }
  };

  // Global search keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#F9FAFB'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #E5E7EB',
        padding: '2rem 1rem',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1F2937',
            margin: '0 0 0.5rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Sistema Clínico
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            Prueba todos los módulos
          </p>
        </div>

        {/* Global Search Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowGlobalSearch(true)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: '#F3F4F6',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#6B7280',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '1.5rem'
          }}
        >
          <Search size={16} />
          <span>Búsqueda global...</span>
          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem'
          }}>
            <kbd style={{
              padding: '0.125rem 0.25rem',
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '0.25rem'
            }}>
              ⌘K
            </kbd>
          </div>
        </motion.button>

        {/* Component Navigation */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {components.map((component) => {
            const Icon = component.icon;
            const isActive = activeComponent === component.id;

            return (
              <motion.button
                key={component.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveComponent(component.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                  color: isActive ? '#4338CA' : '#6B7280',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Icon size={18} />
                {component.label}
              </motion.button>
            );
          })}
        </div>

        {/* Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#F0FDF4',
          borderRadius: '0.5rem',
          border: '1px solid #BBF7D0'
        }}>
          <h4 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#15803D',
            margin: '0 0 0.5rem 0',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            💡 Cómo probar
          </h4>
          <ul style={{
            fontSize: '0.75rem',
            color: '#166534',
            margin: 0,
            paddingLeft: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            <li>Navega por los módulos</li>
            <li>Prueba ⌘K para búsqueda</li>
            <li>Interactúa con los componentes</li>
            <li>Revisa la consola para logs</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '280px',
        flex: 1,
        padding: '2rem'
      }}>
        {renderComponent()}
      </div>

      {/* Global Search */}
      <GlobalSearchCommand
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
        patients={[mockPatient]}
        appointments={mockAppointments}
        documents={mockDocuments}
        treatmentPlans={[]}
        assessments={[]}
        recentItems={[]}
        favorites={[]}
        onNavigate={mockHandlers.onNavigate}
        onToggleFavorite={mockHandlers.onToggleFavorite}
      />
    </div>
  );
}
