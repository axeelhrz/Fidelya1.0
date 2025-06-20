import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CEODashboardState, CEOKPIData, FinancialMetrics, AIInsight } from '@/types/ceo';
import { FirestoreService } from '@/services/firestore';
import { Session } from '@/types/session';
import { Patient } from '@/types/patient';
import { ClinicalAlert } from '@/types/alert';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export function useCEOMetrics() {
  const { user } = useAuth();
  
  const [state, setState] = useState<CEODashboardState>({
    kpis: [],
    financialMetrics: {} as FinancialMetrics,
    burnEarnData: [],
    profitabilityData: [],
    riskRadarData: [],
    capacityForecast: [],
    adherenceData: [],
    aiInsights: [],
    complianceMetrics: {} as any,
    criticalAlerts: [],
    importantAlerts: [],
    tasks: [],
    loading: true,
    error: null,
    lastUpdated: new Date(),
  });

  useEffect(() => {
    if (!user?.centerId) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchCEOData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Fetch base data
        const [sessions, patients, alerts] = await Promise.all([
          FirestoreService.getSessions(user.centerId, {}, 200),
          FirestoreService.getPatients(user.centerId, {}, 200),
          FirestoreService.getAlerts(user.centerId, {}, 100),
        ]);

        // Calculate KPIs
        const kpis = calculateKPIs(sessions.sessions, patients.patients, alerts.alerts);
        
        // Calculate financial metrics
        const financialMetrics = calculateFinancialMetrics(sessions.sessions, patients.patients);
        
        // Generate burn & earn data
        const burnEarnData = generateBurnEarnData(sessions.sessions);
        
        // Calculate profitability data
        const profitabilityData = calculateProfitabilityData(sessions.sessions);
        
        // Generate risk radar data
        const riskRadarData = generateRiskRadarData(patients.patients, sessions.sessions);
        
        // Generate capacity forecast
        const capacityForecast = generateCapacityForecast(sessions.sessions);
        
        // Calculate adherence data
        const adherenceData = calculateAdherenceData(sessions.sessions, patients.patients);
        
        // Generate AI insights
        const aiInsights = generateAIInsights(sessions.sessions, patients.patients, alerts.alerts);
        
        // Calculate compliance metrics
        const complianceMetrics = calculateComplianceMetrics();
        
        // Process alerts for CEO view
        const criticalAlerts = alerts.alerts
          .filter(alert => alert.urgency === 'crítica' && alert.status === 'activa')
          .slice(0, 5)
          .map(alert => ({
            id: alert.id,
            tipo: alert.type as any,
            urgencia: alert.urgency,
            titulo: alert.title || alert.description.substring(0, 50),
            descripcion: alert.description,
            accionesRequeridas: ['Revisar inmediatamente', 'Contactar responsable'],
            estado: alert.status as any,
          }));

        const importantAlerts = alerts.alerts
          .filter(alert => alert.urgency === 'alta' && alert.status === 'activa')
          .slice(0, 8)
          .map(alert => ({
            id: alert.id,
            tipo: alert.type as any,
            urgencia: alert.urgency,
            titulo: alert.title || alert.description.substring(0, 50),
            descripcion: alert.description,
            accionesRequeridas: ['Programar revisión', 'Asignar responsable'],
            estado: alert.status as any,
          }));

        // Generate sample tasks
        const tasks = generateSampleTasks();

        setState(prev => ({
          ...prev,
          kpis,
          financialMetrics,
          burnEarnData,
          profitabilityData,
          riskRadarData,
          capacityForecast,
          adherenceData,
          aiInsights,
          complianceMetrics,
          criticalAlerts,
          importantAlerts,
          tasks,
          loading: false,
          lastUpdated: new Date(),
        }));

      } catch (error) {
        console.error('Error fetching CEO metrics:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Error al cargar las métricas del CEO',
        }));
      }
    };

    fetchCEOData();
  }, [user?.centerId]);

  return state;
}

// Helper functions for calculations
function calculateKPIs(sessions: Session[], patients: Patient[], alerts: ClinicalAlert[]): CEOKPIData[] {
  const currentMonth = new Date();
  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  
  // Calculate monthly revenue (simulated)
  const monthlyRevenue = sessions.filter(s => {
    const sessionDate = new Date(s.date || s.createdAt);
    return sessionDate >= startMonth && sessionDate <= endMonth;
  }).length * 80; // Assuming $80 per session

  const revenueTarget = 50000; // $50k monthly target
  
  return [
    {
      id: 'ingresos-mtd',
      title: 'Ingresos Netos MTD',
      value: monthlyRevenue,
      unit: '$',
      target: revenueTarget,
      sparklineData: [42000, 45000, 48000, 46000, monthlyRevenue],
      trend: {
        value: 12.5,
        isPositive: true,
        period: 'vs mes anterior'
      },
      semaphore: monthlyRevenue >= revenueTarget * 0.9 ? 'green' : monthlyRevenue >= revenueTarget * 0.7 ? 'amber' : 'red',
      subtitle: `Meta: $${revenueTarget.toLocaleString()}`,
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      id: 'ebitda-rolling',
      title: 'EBITDA Rolling-12',
      value: 180000,
      unit: '$',
      target: 200000,
      sparklineData: [160000, 165000, 170000, 175000, 180000],
      trend: {
        value: 8.2,
        isPositive: true,
        period: 'vs año anterior'
      },
      semaphore: 'amber',
      subtitle: 'Progreso: 90%',
      icon: 'Assessment',
      color: 'primary'
    },
    {
      id: 'ocupacion-consultorios',
      title: 'Tasa Ocupación Consultorios',
      value: 78,
      unit: '%',
      target: 85,
      sparklineData: [72, 75, 76, 77, 78],
      trend: {
        value: 3.2,
        isPositive: true,
        period: 'últimos 30 días'
      },
      semaphore: 'amber',
      subtitle: '6 consultorios activos',
      icon: 'Business',
      color: 'info'
    },
    {
      id: 'cancelaciones',
      title: '% Cancelaciones / No-shows',
      value: 12,
      unit: '%',
      sparklineData: [15, 14, 13, 12.5, 12],
      trend: {
        value: -2.1,
        isPositive: true,
        period: '30 días'
      },
      semaphore: 'green',
      subtitle: 'Meta: <15%',
      icon: 'EventBusy',
      color: 'warning'
    },
    {
      id: 'mejoria-sintomatica',
      title: 'Mejoría Sintomática Promedio',
      value: 68,
      unit: '%',
      sparklineData: [62, 64, 66, 67, 68],
      trend: {
        value: 4.8,
        isPositive: true,
        period: 'PHQ-9 / GAD-7'
      },
      semaphore: 'green',
      subtitle: 'Basado en 156 evaluaciones',
      icon: 'Psychology',
      color: 'success'
    },
    {
      id: 'cac-ltv',
      title: 'CAC vs. LTV',
      value: 3.2,
      unit: 'x',
      sparklineData: [2.8, 2.9, 3.0, 3.1, 3.2],
      trend: {
        value: 6.7,
        isPositive: true,
        period: '90 días'
      },
      semaphore: 'green',
      subtitle: 'LTV/CAC ratio saludable',
      icon: 'AccountBalance',
      color: 'secondary'
    },
    {
      id: 'inventario-tests',
      title: 'Inventario Tests',
      value: 8,
      unit: 'días',
      sparklineData: [15, 12, 10, 9, 8],
      trend: {
        value: -12,
        isPositive: false,
        period: 'días restantes'
      },
      semaphore: 'red',
      subtitle: 'Requiere reposición urgente',
      icon: 'Inventory',
      color: 'error'
    },
    {
      id: 'cuentas-cobrar',
      title: 'Backlog Cuentas por Cobrar',
      value: 15600,
      unit: '$',
      sparklineData: [18000, 17200, 16800, 16000, 15600],
      trend: {
        value: -8.5,
        isPositive: true,
        period: '>30 días'
      },
      semaphore: 'amber',
      subtitle: '12 cuentas pendientes',
      icon: 'Receipt',
      color: 'warning'
    }
  ];
}

function calculateFinancialMetrics(sessions: Session[], patients: Patient[]): FinancialMetrics {
  // Simulated financial calculations
  return {
    ingresosMTD: {
      actual: 42500,
      meta: 50000,
      variacion: 12.5
    },
    ebitdaRolling12: {
      actual: 180000,
      meta: 200000,
      progreso: 90
    },
    tasaOcupacion: {
      actual: 78,
      meta: 85,
      porConsultorio: {
        'Consultorio 1': 85,
        'Consultorio 2': 82,
        'Consultorio 3': 75,
        'Consultorio 4': 70,
        'Consultorio 5': 80,
        'Consultorio 6': 76
      }
    },
    cancelaciones: {
      porcentaje: 12,
      ultimos30Dias: 24,
      tendencia: [15, 14, 13, 12.5, 12]
    },
    mejoriaSintomatica: {
      promedio: 68,
      phq9: 65,
      gad7: 71,
      distribucion: {
        'Mejoría significativa': 45,
        'Mejoría moderada': 32,
        'Sin cambios': 18,
        'Empeoramiento': 5
      }
    },
    cacVsLtv: {
      cac: 150,
      ltv: 480,
      ratio: 3.2,
      ultimos90Dias: [
        { fecha: '2024-01', cac: 160, ltv: 450 },
        { fecha: '2024-02', cac: 155, ltv: 465 },
        { fecha: '2024-03', cac: 150, ltv: 480 }
      ]
    },
    inventarioTests: {
      diasRestantes: 8,
      alertaRoja: true,
      porTest: {
        'PHQ-9': 5,
        'GAD-7': 8,
        'Beck Depression': 12,
        'MMPI-2': 3
      }
    },
    cuentasPorCobrar: {
      backlogMas30Dias: 15600,
      montoTotal: 28400,
      distribucionEdad: {
        '0-30 días': 12800,
        '31-60 días': 9200,
        '61-90 días': 4100,
        '>90 días': 2300
      }
    }
  };
}

function generateBurnEarnData(sessions: Session[]) {
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 30),
    end: new Date()
  });

  return last30Days.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySessions = sessions.filter(s => {
      const sessionDate = format(new Date(s.date || s.createdAt), 'yyyy-MM-dd');
      return sessionDate === dateStr;
    });

    const ingresos = daySessions.length * 80; // $80 per session
    const egresos = Math.random() * 500 + 800; // Random daily expenses

    return {
      fecha: dateStr,
      ingresos,
      egresos,
      proyeccionIngresos: ingresos * 1.1,
      proyeccionEgresos: egresos * 0.95
    };
  });
}

function calculateProfitabilityData(sessions: Session[]) {
  const therapists = ['Dr. García', 'Dra. López', 'Dr. Martínez', 'Dra. Rodríguez', 'Dr. Silva'];
  
  return therapists.map((nombre, index) => {
    const therapistSessions = Math.floor(Math.random() * 50) + 20;
    const ingresos = therapistSessions * 80;
    const costos = therapistSessions * 35;
    const rentabilidad = ((ingresos - costos) / ingresos) * 100;

    return {
      terapeutaId: `therapist-${index}`,
      nombre,
      rentabilidad,
      ingresos,
      costos,
      sesiones: therapistSessions,
      pacientesActivos: Math.floor(therapistSessions / 3)
    };
  });
}

function generateRiskRadarData(patients: Patient[], sessions: Session[]) {
  // Generate sample high-risk patients
  return [
    {
      pacienteId: 'patient-1',
      nombre: 'Paciente A.',
      tipoRiesgo: 'suicidio' as const,
      nivelRiesgo: 'critico' as const,
      ultimaSesion: subDays(new Date(), 2),
      descripcion: 'Ideación suicida activa detectada en última sesión',
      accionesRecomendadas: ['Contacto inmediato', 'Evaluación psiquiátrica', 'Plan de seguridad']
    },
    {
      pacienteId: 'patient-2',
      nombre: 'Paciente B.',
      tipoRiesgo: 'phq_alto' as const,
      nivelRiesgo: 'alto' as const,
      ultimaSesion: subDays(new Date(), 5),
      descripcion: 'PHQ-9 score: 18 (depresión severa)',
      accionesRecomendadas: ['Sesión de seguimiento', 'Considerar medicación']
    },
    {
      pacienteId: 'patient-3',
      nombre: 'Paciente C.',
      tipoRiesgo: 'sin_progreso' as const,
      nivelRiesgo: 'medio' as const,
      ultimaSesion: subDays(new Date(), 7),
      descripcion: 'Sin mejoría en 6 sesiones consecutivas',
      accionesRecomendadas: ['Revisar plan de tratamiento', 'Interconsulta']
    }
  ];
}

function generateCapacityForecast(sessions: Session[]) {
  const next30Days = eachDayOfInterval({
    start: new Date(),
    end: subDays(new Date(), -30)
  });

  return next30Days.map(date => {
    const ocupacion = Math.random() * 100;
    let disponibilidad: 'libre' | 'ocupado' | 'saturado';
    
    if (ocupacion < 60) disponibilidad = 'libre';
    else if (ocupacion < 85) disponibilidad = 'ocupado';
    else disponibilidad = 'saturado';

    return {
      fecha: format(date, 'yyyy-MM-dd'),
      disponibilidad,
      porcentajeOcupacion: ocupacion,
      sesionesProgramadas: Math.floor(ocupacion / 10),
      capacidadMaxima: 10,
      consultoriosDisponibles: 6
    };
  });
}

function calculateAdherenceData(sessions: Session[], patients: Patient[]) {
  const programas = ['Terapia Individual', 'Terapia Grupal', 'Terapia Familiar', 'Terapia Online'];
  
  return programas.map(programa => {
    const completadas = Math.floor(Math.random() * 100) + 50;
    const programadas = completadas + Math.floor(Math.random() * 20) + 10;
    
    return {
      programa,
      sesionesCompletadas: completadas,
      sesionesProgramadas: programadas,
      porcentajeAdherencia: (completadas / programadas) * 100,
      pacientesActivos: Math.floor(completadas / 4),
      tendencia: [85, 87, 86, 88, (completadas / programadas) * 100]
    };
  });
}

function generateAIInsights(sessions: Session[], patients: Patient[], alerts: ClinicalAlert[]): AIInsight[] {
  return [
    {
      id: 'insight-1',
      tipo: 'oportunidad',
      titulo: 'Baja ocupación martes 2-4 PM',
      descripcion: 'Detectamos baja ocupación los martes de 2 a 4 pm. Sugerimos promocionar estos slots con descuento del 15%.',
      impacto: 'alto',
      confianza: 87,
      accionesRecomendadas: [
        'Crear promoción para martes tarde',
        'Contactar pacientes con horarios flexibles',
        'Implementar descuento temporal'
      ],
      datosRespaldo: {
        ocupacionPromedio: 45,
        ingresosPotenciales: 2400,
        pacientesObjetivo: 12
      },
      fechaGeneracion: new Date()
    },
    {
      id: 'insight-2',
      tipo: 'riesgo',
      titulo: 'Incremento en cancelaciones de último minuto',
      descripcion: 'Las cancelaciones de último minuto han aumentado 23% en las últimas 2 semanas.',
      impacto: 'medio',
      confianza: 92,
      accionesRecomendadas: [
        'Implementar política de cancelación más estricta',
        'Enviar recordatorios 24h antes',
        'Analizar patrones de cancelación por terapeuta'
      ],
      datosRespaldo: {
        incremento: 23,
        impactoFinanciero: 1800,
        sesionesAfectadas: 15
      },
      fechaGeneracion: new Date()
    }
  ];
}

function calculateComplianceMetrics() {
  return {
    backupsVerificados: {
      completado: true,
      ultimaVerificacion: subDays(new Date(), 1),
      proximaVerificacion: subDays(new Date(), -6)
    },
    politicasFirmadas: {
      porcentajeCompletado: 85,
      pendientes: ['Política de Privacidad v2.1', 'Protocolo de Emergencias'],
      vencimientos: [
        { politica: 'HIPAA Compliance', fecha: subDays(new Date(), -30) }
      ]
    },
    accesosAuditados: {
      completado: false,
      ultimaAuditoria: subDays(new Date(), 15),
      hallazgos: 2
    },
    certificacionesMSP: {
      vigentes: true,
      proximoVencimiento: subDays(new Date(), -45),
      certificados: [
        { nombre: 'Licencia Sanitaria', vencimiento: subDays(new Date(), -45) },
        { nombre: 'Certificado Profesional', vencimiento: subDays(new Date(), -120) }
      ]
    }
  };
}

function generateSampleTasks() {
  return [
    {
      id: 'task-1',
      titulo: 'Revisar inventario de tests psicológicos',
      descripcion: 'Verificar stock y realizar pedido urgente',
      prioridad: 'alta' as const,
      categoria: 'hoy' as const,
      estado: 'pendiente' as const,
      fechaCreacion: new Date(),
      fechaVencimiento: new Date(),
      etiquetas: ['inventario', 'urgente'],
      acciones: { enviarCorreo: true }
    },
    {
      id: 'task-2',
      titulo: 'Reunión con equipo financiero',
      descripcion: 'Revisar métricas Q1 y planificar Q2',
      prioridad: 'media' as const,
      categoria: 'semana' as const,
      estado: 'pendiente' as const,
      fechaCreacion: new Date(),
      etiquetas: ['finanzas', 'planificación'],
      acciones: { crearReunion: true }
    },
    {
      id: 'task-3',
      titulo: 'Actualizar políticas de compliance',
      descripcion: 'Revisar y actualizar políticas según nuevas regulaciones',
      prioridad: 'baja' as const,
      categoria: 'mes' as const,
      estado: 'en_progreso' as const,
      fechaCreacion: subDays(new Date(), 5),
      etiquetas: ['compliance', 'políticas'],
      acciones: { asignarAlguien: true }
    }
  ];
}