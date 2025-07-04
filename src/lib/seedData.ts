import { 
  collection, 
  addDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '@/lib/firebase';
import { Session, Payment, Expense } from '@/lib/services/financialService';
import { Patient, Therapist, ClinicalAssessment } from '@/lib/services/clinicalService';
import { Lead, Campaign } from '@/lib/services/commercialService';
import { Alert, Task } from '@/hooks/useDashboardData';

// Función principal para sembrar datos
export async function seedData() {
  try {
    console.log('🌱 Iniciando proceso de siembra de datos...');
    
    const centerId = 'center1';
    
    await Promise.all([
      seedTherapists(centerId),
      seedPatients(centerId),
      seedSessions(centerId),
      seedPayments(centerId),
      seedExpenses(centerId),
      seedLeads(centerId),
      seedCampaigns(centerId),
      seedAlerts(centerId),
      seedTasks(centerId),
      seedAssessments(centerId)
    ]);
    
    // Agregar siembra de documentos
    await seedPatientDocuments(centerId);
    
    console.log('✅ Proceso de siembra completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante la siembra de datos:', error);
    throw error;
  }
}

// Sembrar terapeutas
async function seedTherapists(centerId: string) {
  const therapists: Omit<Therapist, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana.garcia@centro.com',
      phone: '+34 600 123 456',
      specializations: ['Ansiedad', 'Depresión', 'Terapia Cognitiva'],
      licenseNumber: 'PSY-001',
      status: 'active',
      schedule: {
        monday: { start: '09:00', end: '17:00', available: true },
        tuesday: { start: '09:00', end: '17:00', available: true },
        wednesday: { start: '09:00', end: '17:00', available: true },
        thursday: { start: '09:00', end: '17:00', available: true },
        friday: { start: '09:00', end: '15:00', available: true },
        saturday: { start: '00:00', end: '00:00', available: false },
        sunday: { start: '00:00', end: '00:00', available: false }
      },
      consultingRooms: ['room1', 'room2'],
      hourlyRate: 80,
      experience: 8,
      education: ['Psicología Clínica - Universidad Complutense'],
      certifications: ['Terapia Cognitivo-Conductual'],
      currentPatients: 25,
      maxPatients: 30,
      averageRating: 4.8,
      totalSessions: 1250
    },
    {
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos.mendoza@centro.com',
      phone: '+34 600 123 457',
      specializations: ['Terapia de Pareja', 'Terapia Familiar', 'Mindfulness'],
      licenseNumber: 'PSY-002',
      status: 'active',
      schedule: {
        monday: { start: '10:00', end: '18:00', available: true },
        tuesday: { start: '10:00', end: '18:00', available: true },
        wednesday: { start: '10:00', end: '18:00', available: true },
        thursday: { start: '10:00', end: '18:00', available: true },
        friday: { start: '10:00', end: '16:00', available: true },
        saturday: { start: '09:00', end: '13:00', available: true },
        sunday: { start: '00:00', end: '00:00', available: false }
      },
      consultingRooms: ['room3'],
      hourlyRate: 90,
      experience: 12,
      education: ['Psicología Clínica - Universidad Autónoma'],
      certifications: ['Terapia Sistémica', 'Mindfulness-Based Therapy'],
      currentPatients: 28,
      maxPatients: 35,
      averageRating: 4.9,
      totalSessions: 1800
    },
    {
      firstName: 'Laura',
      lastName: 'Martínez',
      email: 'laura.martinez@centro.com',
      phone: '+34 600 123 458',
      specializations: ['Psicología Infantil', 'TDAH', 'Autismo'],
      licenseNumber: 'PSY-003',
      status: 'active',
      schedule: {
        monday: { start: '08:00', end: '16:00', available: true },
        tuesday: { start: '08:00', end: '16:00', available: true },
        wednesday: { start: '08:00', end: '16:00', available: true },
        thursday: { start: '08:00', end: '16:00', available: true },
        friday: { start: '08:00', end: '14:00', available: true },
        saturday: { start: '00:00', end: '00:00', available: false },
        sunday: { start: '00:00', end: '00:00', available: false }
      },
      consultingRooms: ['room4'],
      hourlyRate: 75,
      experience: 6,
      education: ['Psicología Infantil - Universidad de Barcelona'],
      certifications: ['Terapia ABA', 'Evaluación Neuropsicológica'],
      currentPatients: 20,
      maxPatients: 25,
      averageRating: 4.7,
      totalSessions: 950
    }
  ];

  for (const therapist of therapists) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.THERAPISTS), {
      ...therapist,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${therapists.length} terapeutas creados`);
}

// Sembrar pacientes
async function seedPatients(centerId: string) {
  const patients: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      firstName: 'María',
      lastName: 'López',
      email: 'maria.lopez@email.com',
      phone: '+34 600 234 567',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'female',
      address: {
        street: 'Calle Mayor 123',
        city: 'Madrid',
        state: 'Madrid',
        zipCode: '28001',
        country: 'España'
      },
      emergencyContact: {
        name: 'Juan López',
        phone: '+34 600 234 568',
        relationship: 'Esposo',
        email: 'juan.lopez@email.com'
      },
      assignedTherapist: 'therapist1',
      status: 'active',
      tags: ['ansiedad', 'trabajo'],
      diagnosis: ['Trastorno de Ansiedad Generalizada'],
      riskLevel: 'medium',
      phq9Score: 12,
      gad7Score: 14,
      notes: 'Paciente con ansiedad relacionada con el trabajo. Buena adherencia al tratamiento.',
      lastSession: new Date('2024-01-15'),
      totalSessions: 8,
      medicalHistory: {
        allergies: ['Polen'],
        medications: ['Sertralina 50mg'],
        previousDiagnoses: [],
        familyHistory: ['Depresión (madre)']
      },
      insuranceInfo: {
        provider: 'Sanitas',
        policyNumber: 'SAN123456',
        groupNumber: 'GRP001',
        validUntil: new Date('2024-12-31')
      }
    },
    {
      firstName: 'Pedro',
      lastName: 'Sánchez',
      email: 'pedro.sanchez@email.com',
      phone: '+34 600 234 569',
      dateOfBirth: new Date('1978-07-22'),
      gender: 'male',
      emergencyContact: {
        name: 'Carmen Sánchez',
        phone: '+34 600 234 570',
        relationship: 'Esposa'
      },
      assignedTherapist: 'therapist2',
      status: 'active',
      tags: ['depresión', 'duelo'],
      diagnosis: ['Episodio Depresivo Mayor'],
      riskLevel: 'high',
      phq9Score: 18,
      gad7Score: 8,
      notes: 'Paciente en proceso de duelo. Requiere seguimiento cercano.',
      lastSession: new Date('2024-01-12'),
      totalSessions: 15,
      medicalHistory: {
        allergies: [],
        medications: ['Escitalopram 10mg'],
        previousDiagnoses: [],
        familyHistory: []
      }
    },
    {
      firstName: 'Sofia',
      lastName: 'Ruiz',
      email: 'sofia.ruiz@email.com',
      phone: '+34 600 234 571',
      dateOfBirth: new Date('2010-11-08'),
      gender: 'female',
      emergencyContact: {
        name: 'Elena Ruiz',
        phone: '+34 600 234 572',
        relationship: 'Madre'
      },
      assignedTherapist: 'therapist3',
      status: 'active',
      tags: ['tdah', 'escolar'],
      diagnosis: ['TDAH Tipo Combinado'],
      riskLevel: 'low',
      notes: 'Niña con TDAH. Buena evolución con terapia conductual.',
      lastSession: new Date('2024-01-10'),
      totalSessions: 12,
      medicalHistory: {
        allergies: [],
        medications: ['Metilfenidato 18mg'],
        previousDiagnoses: [],
        familyHistory: ['TDAH (padre)']
      }
    }
  ];

  for (const patient of patients) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS), {
      ...patient,
      dateOfBirth: Timestamp.fromDate(patient.dateOfBirth),
      lastSession: patient.lastSession ? Timestamp.fromDate(patient.lastSession) : null,
      insuranceInfo: patient.insuranceInfo ? {
        ...patient.insuranceInfo,
        validUntil: patient.insuranceInfo.validUntil ? Timestamp.fromDate(patient.insuranceInfo.validUntil) : null
      } : undefined,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${patients.length} pacientes creados`);
}

// Sembrar sesiones
async function seedSessions(centerId: string) {
  const sessions: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  
  // Generar sesiones para los últimos 6 meses
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  const patients = ['patient1', 'patient2', 'patient3'];
  const therapists = ['therapist1', 'therapist2', 'therapist3'];
  const sessionTypes: Session['type'][] = ['individual', 'group', 'family'];
  const costs = [60, 70, 80, 90];
  
  for (let i = 0; i < 150; i++) {
    const sessionDate = new Date(startDate.getTime() + Math.random() * (Date.now() - startDate.getTime()));
    
    sessions.push({
      patientId: patients[Math.floor(Math.random() * patients.length)],
      therapistId: therapists[Math.floor(Math.random() * therapists.length)],
      date: sessionDate,
      duration: 50 + Math.floor(Math.random() * 40), // 50-90 minutos
      type: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
      status: Math.random() > 0.1 ? 'completed' : Math.random() > 0.5 ? 'cancelled' : 'no-show',
      cost: costs[Math.floor(Math.random() * costs.length)],
      paid: Math.random() > 0.2, // 80% pagadas
      paymentMethod: Math.random() > 0.5 ? 'card' : Math.random() > 0.5 ? 'transfer' : 'cash',
      notes: 'Sesión completada satisfactoriamente.',
      patientName: 'Paciente ' + (Math.floor(Math.random() * 3) + 1),
      therapistName: 'Terapeuta ' + (Math.floor(Math.random() * 3) + 1)
    });
  }

  for (const session of sessions) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.SESSIONS), {
      ...session,
      date: Timestamp.fromDate(session.date as Date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${sessions.length} sesiones creadas`);
}

// Sembrar pagos
async function seedPayments(centerId: string) {
  const payments: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  
  const statuses: Payment['status'][] = ['paid', 'pending', 'overdue'];
  const methods: Payment['method'][] = ['card', 'transfer', 'cash', 'insurance'];
  
  for (let i = 0; i < 80; i++) {
    const paymentDate = new Date();
    paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 180));
    
    payments.push({
      patientId: 'patient' + (Math.floor(Math.random() * 3) + 1),
      amount: 60 + Math.floor(Math.random() * 40),
      date: paymentDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      method: methods[Math.floor(Math.random() * methods.length)],
      reference: 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      patientName: 'Paciente ' + (Math.floor(Math.random() * 3) + 1),
      sessionType: 'individual'
    });
  }

  for (const payment of payments) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PAYMENTS), {
      ...payment,
      date: Timestamp.fromDate(payment.date as Date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${payments.length} pagos creados`);
}

// Sembrar gastos
async function seedExpenses(centerId: string) {
  const expenses: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  
  const categories = ['Personal', 'Alquiler', 'Suministros', 'Marketing', 'Tecnología', 'Formación'];
  const descriptions = [
    'Salario terapeuta',
    'Alquiler oficina',
    'Material de oficina',
    'Campaña Google Ads',
    'Software gestión',
    'Curso especialización'
  ];
  
  for (let i = 0; i < 60; i++) {
    const expenseDate = new Date();
    expenseDate.setDate(expenseDate.getDate() - Math.floor(Math.random() * 180));
    
    const categoryIndex = Math.floor(Math.random() * categories.length);
    
    expenses.push({
      category: categories[categoryIndex],
      amount: 100 + Math.floor(Math.random() * 2000),
      date: expenseDate,
      description: descriptions[categoryIndex],
      vendor: 'Proveedor ' + (Math.floor(Math.random() * 5) + 1),
      approved: Math.random() > 0.1,
      approvedBy: 'admin1',
      tags: ['operativo']
    });
  }

  for (const expense of expenses) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.EXPENSES), {
      ...expense,
      date: Timestamp.fromDate(expense.date as Date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${expenses.length} gastos creados`);
}

// Sembrar leads
async function seedLeads(centerId: string) {
  const leads: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>[] = [];
  
  const sources: Lead['source'][] = ['google_ads', 'facebook', 'referral', 'organic', 'email'];
  const statuses: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'lost'];
  const interests = ['Ansiedad', 'Depresión', 'Terapia de Pareja', 'Psicología Infantil'];
  
  for (let i = 0; i < 100; i++) {
    const leadDate = new Date();
    leadDate.setDate(leadDate.getDate() - Math.floor(Math.random() * 90));
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    leads.push({
      firstName: 'Lead',
      lastName: `${i + 1}`,
      email: `lead${i + 1}@email.com`,
      phone: `+34 600 ${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      status,
      notes: 'Lead generado automáticamente',
      tags: ['nuevo'],
      interests: [interests[Math.floor(Math.random() * interests.length)]],
      urgency: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
      conversionDate: status === 'converted' ? leadDate : undefined,
      conversionValue: status === 'converted' ? 200 + Math.floor(Math.random() * 300) : undefined
    });
  }

  for (const lead of leads) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.LEADS), {
      ...lead,
      conversionDate: lead.conversionDate ? Timestamp.fromDate(lead.conversionDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${leads.length} leads creados`);
}

// Sembrar campañas
async function seedCampaigns(centerId: string) {
  const campaigns: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Ansiedad Jóvenes - Google Ads',
      type: 'google_ads',
      status: 'active',
      budget: { total: 5000, spent: 2500, currency: 'EUR' },
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31')
      },
      targeting: {
        demographics: ['18-35'],
        interests: ['salud mental', 'ansiedad'],
        locations: ['Madrid', 'Barcelona'],
        ageRange: { min: 18, max: 35 }
      },
      metrics: {
        impressions: 45000,
        clicks: 1350,
        conversions: 45,
        ctr: 3.0,
        cpc: 1.85,
        cpa: 55.6,
        roas: 2.8
      },
      creatives: {
        headlines: ['Supera tu ansiedad', 'Terapia online especializada'],
        descriptions: ['Psicólogos especializados en ansiedad'],
        images: ['ansiedad1.jpg'],
        videos: []
      }
    },
    {
      name: 'Terapia Parejas - Facebook',
      type: 'facebook',
      status: 'active',
      budget: { total: 3000, spent: 1800, currency: 'EUR' },
      dateRange: {
        start: new Date('2024-01-15'),
        end: new Date('2024-04-15')
      },
      targeting: {
        demographics: ['25-50'],
        interests: ['relaciones', 'terapia de pareja'],
        locations: ['Madrid']
      },
      metrics: {
        impressions: 28000,
        clicks: 840,
        conversions: 28,
        ctr: 3.0,
        cpc: 2.14,
        cpa: 64.3,
        roas: 3.2
      },
      creatives: {
        headlines: ['Mejora tu relación', 'Terapia de pareja efectiva'],
        descriptions: ['Especialistas en terapia de pareja'],
        images: ['pareja1.jpg'],
        videos: ['pareja_video.mp4']
      }
    }
  ];

  for (const campaign of campaigns) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.CAMPAIGNS), {
      ...campaign,
      dateRange: {
        start: Timestamp.fromDate(campaign.dateRange.start),
        end: Timestamp.fromDate(campaign.dateRange.end)
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${campaigns.length} campañas creadas`);
}

// Sembrar alertas
async function seedAlerts(centerId: string) {
  const alerts: Omit<Alert, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: 'Paciente de alto riesgo',
      description: 'Pedro Sánchez ha mostrado un aumento en su puntuación PHQ-9. Requiere evaluación inmediata.',
      level: 'critical',
      timestamp: new Date(),
      isRead: false,
      patientId: 'patient2',
      type: 'clinical'
    },
    {
      title: 'Pago pendiente',
      description: 'Factura de María López lleva 15 días sin pagar.',
      level: 'warning',
      timestamp: new Date(Date.now() - 86400000),
      isRead: false,
      patientId: 'patient1',
      type: 'financial'
    },
    {
      title: 'Capacidad máxima alcanzada',
      description: 'La agenda del Dr. Mendoza está al 95% de capacidad esta semana.',
      level: 'warning',
      timestamp: new Date(Date.now() - 172800000),
      isRead: true,
      type: 'operational'
    },
    {
      title: 'Nueva funcionalidad disponible',
      description: 'Sistema de recordatorios automáticos por WhatsApp ya está activo.',
      level: 'info',
      timestamp: new Date(Date.now() - 259200000),
      isRead: false,
      type: 'system'
    }
  ];

  for (const alert of alerts) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.ALERTS), {
      ...alert,
      timestamp: Timestamp.fromDate(alert.timestamp),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${alerts.length} alertas creadas`);
}

// Sembrar tareas
async function seedTasks(centerId: string) {
  const tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      title: 'Revisar protocolo de crisis',
      description: 'Actualizar el protocolo de manejo de crisis suicidas según nuevas directrices.',
      status: 'todo',
      priority: 'high',
      assignedTo: 'therapist1',
      dueDate: new Date(Date.now() + 86400000 * 3),
      category: 'clinical'
    },
    {
      title: 'Preparar informe mensual',
      description: 'Generar informe financiero del mes de enero para la dirección.',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: 'admin1',
      dueDate: new Date(Date.now() + 86400000 * 7),
      category: 'financial'
    },
    {
      title: 'Optimizar campaña Google Ads',
      description: 'Revisar palabras clave y ajustar pujas para mejorar ROI.',
      status: 'todo',
      priority: 'medium',
      assignedTo: 'marketing1',
      dueDate: new Date(Date.now() + 86400000 * 5),
      category: 'marketing'
    },
    {
      title: 'Actualizar expedientes',
      description: 'Digitalizar expedientes físicos pendientes.',
      status: 'done',
      priority: 'low',
      assignedTo: 'reception1',
      dueDate: new Date(Date.now() - 86400000 * 2),
      category: 'administrative'
    }
  ];

  for (const task of tasks) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.TASKS), {
      ...task,
      dueDate: Timestamp.fromDate(task.dueDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${tasks.length} tareas creadas`);
}

// Sembrar evaluaciones clínicas
async function seedAssessments(centerId: string) {
  const assessments: Omit<ClinicalAssessment, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      patientId: 'patient1',
      therapistId: 'therapist1',
      type: 'phq9',
      score: 12,
      maxScore: 27,
      severity: 'moderate',
      responses: {
        'q1': 2, 'q2': 1, 'q3': 2, 'q4': 1, 'q5': 2,
        'q6': 1, 'q7': 1, 'q8': 1, 'q9': 1
      },
      notes: 'Mejora notable desde la última evaluación.',
      recommendations: ['Continuar terapia cognitiva', 'Ejercicios de relajación'],
      nextAssessmentDate: new Date(Date.now() + 86400000 * 30)
    },
    {
      patientId: 'patient2',
      therapistId: 'therapist2',
      type: 'phq9',
      score: 18,
      maxScore: 27,
      severity: 'severe',
      responses: {
        'q1': 3, 'q2': 2, 'q3': 2, 'q4': 2, 'q5': 2,
        'q6': 2, 'q7': 2, 'q8': 2, 'q9': 1
      },
      notes: 'Puntuación elevada. Requiere seguimiento cercano.',
      recommendations: ['Evaluación psiquiátrica', 'Aumentar frecuencia de sesiones'],
      nextAssessmentDate: new Date(Date.now() + 86400000 * 14)
    }
  ];

  for (const assessment of assessments) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, 'assessments'), {
      ...assessment,
      nextAssessmentDate: assessment.nextAssessmentDate ? Timestamp.fromDate(assessment.nextAssessmentDate) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  }
  
  console.log(`✅ ${assessments.length} evaluaciones creadas`);
}

// Función para sembrar documentos de pacientes
async function seedPatientDocuments(centerId: string) {
  const documents: Omit<PatientDocument, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      patientId: 'patient1',
      centerId: centerId,
      title: 'Consentimiento Informado - Tratamiento Psicológico',
      description: 'Documento de consentimiento para el inicio del tratamiento psicológico individual con enfoque cognitivo-conductual.',
      type: 'consentimiento',
      fileUrl: '/documents/consentimiento_001.pdf',
      fileName: 'consentimiento_tratamiento.pdf',
      fileType: 'pdf',
      fileSize: 245760,
      tags: ['consentimiento', 'legal', 'tratamiento', 'cognitivo-conductual'],
      uploadedBy: 'therapist1',
      uploadedByName: 'Dra. Ana García',
      isRead: true,
      readAt: new Date('2024-01-16'),
      downloadCount: 2,
      lastDownloaded: new Date('2024-01-20'),
      category: 'legal',
      privacy: 'privado',
      isRequired: true,
      notes: 'Documento firmado y archivado correctamente.',
      metadata: {
        version: '1.0',
        author: 'Centro Psicológico',
        language: 'es',
        keywords: ['consentimiento', 'tratamiento', 'psicología']
      }
    },
    {
      patientId: 'patient1',
      centerId: centerId,
      title: 'Informe de Evaluación Inicial',
      description: 'Resultado de la evaluación psicológica inicial con diagnóstico, recomendaciones de tratamiento y plan terapéutico.',
      type: 'informe',
      fileUrl: '/documents/evaluacion_inicial_001.pdf',
      fileName: 'evaluacion_inicial.pdf',
      fileType: 'pdf',
      fileSize: 512000,
      tags: ['evaluación', 'diagnóstico', 'inicial', 'plan-terapéutico'],
      uploadedBy: 'therapist1',
      uploadedByName: 'Dra. Ana García',
      isRead: false,
      downloadCount: 0,
      category: 'clinico',
      privacy: 'privado',
      notes: 'Informe completo de la evaluación inicial con plan de tratamiento recomendado. Incluye resultados de pruebas psicométricas.',
      metadata: {
        version: '1.0',
        author: 'Dra. Ana García',
        language: 'es',
        summary: 'Evaluación inicial que confirma diagnóstico de Trastorno de Ansiedad Generalizada con recomendaciones específicas de tratamiento.',
        keywords: ['evaluación', 'ansiedad', 'diagnóstico', 'tratamiento']
      }
    },
    {
      patientId: 'patient1',
      centerId: centerId,
      title: 'Guía de Técnicas de Relajación',
      description: 'Material psicoeducativo con técnicas de relajación progresiva, respiración diafragmática y manejo de ansiedad.',
      type: 'psicoeducacion',
      fileUrl: '/documents/tecnicas_relajacion.pdf',
      fileName: 'guia_relajacion.pdf',
      fileType: 'pdf',
      fileSize: 1024000,
      tags: ['psicoeducación', 'ansiedad', 'técnicas', 'relajación', 'respiración'],
      uploadedBy: 'therapist1',
      uploadedByName: 'Dra. Ana García',
      isRead: true,
      readAt: new Date('2024-02-02'),
      downloadCount: 3,
      lastDownloaded: new Date('2024-02-15'),
      category: 'educativo',
      privacy: 'compartido',
      metadata: {
        version: '2.1',
        author: 'Equipo Clínico',
        language: 'es',
        summary: 'Guía práctica con ejercicios de relajación y técnicas de manejo de ansiedad para uso diario.',
        keywords: ['relajación', 'ansiedad', 'técnicas', 'ejercicios']
      }
    },
    {
      patientId: 'patient1',
      centerId: centerId,
      title: 'Certificado de Tratamiento',
      description: 'Certificado médico que acredita el tratamiento psicológico en curso para presentación en instituciones.',
      type: 'certificado',
      fileUrl: '/documents/certificado_tratamiento.pdf',
      fileName: 'certificado_tratamiento.pdf',
      fileType: 'pdf',
      fileSize: 180000,
      tags: ['certificado', 'médico', 'tratamiento', 'institucional'],
      uploadedBy: 'therapist1',
      uploadedByName: 'Dra. Ana García',
      isRead: false,
      downloadCount: 0,
      category: 'administrativo',
      privacy: 'privado',
      expiresAt: new Date('2024-12-31'),
      metadata: {
        version: '1.0',
        author: 'Dra. Ana García',
        language: 'es',
        summary: 'Certificado oficial que acredita el tratamiento psicológico actual del paciente.'
      }
    },
    {
      patientId: 'patient1',
      centerId: centerId,
      title: 'Audio de Meditación Guiada',
      description: 'Sesión de meditación guiada de 15 minutos para la práctica diaria de mindfulness y reducción de ansiedad.',
      type: 'recurso',
      fileUrl: '/documents/meditacion_guiada.mp3',
      fileName: 'meditacion_15min.mp3',
      fileType: 'audio',
      fileSize: 14400000,
      tags: ['meditación', 'mindfulness', 'audio', 'práctica', 'ansiedad'],
      uploadedBy: 'therapist1',
      uploadedByName: 'Dra. Ana García',
      isRead: true,
      readAt: new Date('2024-02-21'),
      downloadCount: 5,
      lastDownloaded: new Date('2024-03-01'),
      category: 'educativo',
      privacy: 'compartido',
      metadata: {
        version: '1.0',
        author: 'Centro de Mindfulness',
        language: 'es',
        summary: 'Audio de meditación guiada diseñado específicamente para reducir la ansiedad y promover la relajación.',
        keywords: ['meditación', 'mindfulness', 'relajación', 'audio']
      }
    },
    {
      patientId: 'patient1',
      centerId: centerId,
      title: 'Plan de Tratamiento Personalizado',
      description: 'Plan detallado de tratamiento con objetivos específicos, cronograma de sesiones y actividades terapéuticas.',
      type: 'plan-tratamiento',
      fileUrl: '/documents/plan_tratamiento.pdf',
      fileName: 'plan_tratamiento_personalizado.pdf',
      fileType: 'pdf',
      fileSize: 680000,
      tags: ['plan', 'tratamiento', 'objetivos', 'cronograma', 'personalizado'],
      uploadedBy: 'therapist1',
      uploadedByName: 'Dra. Ana García',
      isRead: true,
      readAt: new Date('2024-03-05'),
      downloadCount: 1,
      lastDownloaded: new Date('2024-03-05'),
      category: 'clinico',
      privacy: 'privado',
      metadata: {
        version: '1.2',
        author: 'Dra. Ana García',
        language: 'es',
        summary: 'Plan de tratamiento individualizado con objetivos SMART y cronograma detallado de intervenciones.',
        keywords: ['plan', 'tratamiento', 'objetivos', 'terapia']
      }
    },
    {
      patientId: 'patient1',
      centerId: centerId,
      title: 'Registro de Actividades Diarias',
      description: 'Formato para el registro diario de actividades, estado de ánimo y práctica de técnicas aprendidas.',
      type: 'tarea',
      fileUrl: '/documents/registro_actividades.pdf',
      fileName: 'registro_diario.pdf',
      fileType: 'pdf',
      fileSize: 320000,
      tags: ['registro', 'actividades', 'estado-ánimo', 'seguimiento', 'tarea'],
      uploadedBy: 'therapist1',
      uploadedByName: 'Dra. Ana García',
      isRead: true,
      readAt: new Date('2024-03-10'),
      downloadCount: 4,
      lastDownloaded: new Date('2024-03-18'),
      category: 'educativo',
      privacy: 'privado',
      metadata: {
        version: '1.0',
        author: 'Equipo Clínico',
        language: 'es',
        summary: 'Herramienta de autoregistro para el seguimiento diario del progreso terapéutico.',
        keywords: ['registro', 'seguimiento', 'actividades', 'progreso']
      }
    }
  ];

  for (const document of documents) {
    await addDoc(collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, document.patientId, 'documents'), {
      ...document,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      readAt: document.readAt ? Timestamp.fromDate(document.readAt) : null,
      lastDownloaded: document.lastDownloaded ? Timestamp.fromDate(document.lastDownloaded) : null,
      expiresAt: document.expiresAt ? Timestamp.fromDate(document.expiresAt) : null
    });
  }

  console.log(`✅ ${documents.length} documentos de pacientes creados`);
}

// Función para limpiar datos existentes (opcional)
export async function clearFirebaseData() {
  console.log('🧹 Limpiando datos existentes...');
  
  // Nota: En un entorno de producción, usarías las funciones de Firebase Admin SDK
  // para eliminar colecciones completas. Aquí solo mostramos la estructura.
  
  console.log('⚠️ Para limpiar datos en producción, usa Firebase Admin SDK');
}

// Extiende la interfaz Window para evitar errores de TypeScript
declare global {
  interface Window {
    seedFirebaseData: typeof seedFirebaseData;
    clearFirebaseData: typeof clearFirebaseData;
  }
}

// Función de utilidad para ejecutar desde la consola del navegador
window.seedFirebaseData = seedFirebaseData;
window.clearFirebaseData = clearFirebaseData;