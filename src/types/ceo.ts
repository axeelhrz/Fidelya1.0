import { EmotionalTone } from './session';
import { AlertType, AlertUrgency } from './alert';

// CEO Dashboard KPI Interfaces
export interface CEOKPIData {
  id: string;
  title: string;
  value: number;
  unit?: string;
  target?: number;
  sparklineData: number[];
  trend: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  semaphore: 'green' | 'amber' | 'red';
  subtitle: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

// Financial Metrics
export interface FinancialMetrics {
  ingresosMTD: {
    actual: number;
    meta: number;
    variacion: number;
  };
  ebitdaRolling12: {
    actual: number;
    meta: number;
    progreso: number;
  };
  tasaOcupacion: {
    actual: number;
    meta: number;
    porConsultorio: Record<string, number>;
  };
  cancelaciones: {
    porcentaje: number;
    ultimos30Dias: number;
    tendencia: number[];
  };
  mejoriaSintomatica: {
    promedio: number;
    phq9: number;
    gad7: number;
    distribucion: Record<string, number>;
  };
  cacVsLtv: {
    cac: number;
    ltv: number;
    ratio: number;
    ultimos90Dias: Array<{
      fecha: string;
      cac: number;
      ltv: number;
    }>;
  };
  inventarioTests: {
    diasRestantes: number;
    alertaRoja: boolean;
    porTest: Record<string, number>;
  };
  cuentasPorCobrar: {
    backlogMas30Dias: number;
    montoTotal: number;
    distribucionEdad: Record<string, number>;
  };
}

// Burn & Earn Chart Data
export interface BurnEarnData {
  fecha: string;
  ingresos: number;
  egresos: number;
  proyeccionIngresos: number;
  proyeccionEgresos: number;
}

// Profitability Heatmap Data
export interface ProfitabilityData {
  terapeutaId: string;
  nombre: string;
  rentabilidad: number;
  ingresos: number;
  costos: number;
  sesiones: number;
  pacientesActivos: number;
}

// Risk Radar Data
export interface RiskRadarData {
  pacienteId: string;
  nombre: string;
  tipoRiesgo: 'suicidio' | 'phq_alto' | 'sin_progreso';
  nivelRiesgo: 'critico' | 'alto' | 'medio';
  ultimaSesion: Date;
  descripcion: string;
  accionesRecomendadas: string[];
}

// Capacity Forecast Data
export interface CapacityForecastData {
  fecha: string;
  disponibilidad: 'libre' | 'ocupado' | 'saturado';
  porcentajeOcupacion: number;
  sesionesProgramadas: number;
  capacidadMaxima: number;
  consultoriosDisponibles: number;
}

// Adherence Data
export interface AdherenceData {
  programa: string;
  sesionesCompletadas: number;
  sesionesProgramadas: number;
  porcentajeAdherencia: number;
  pacientesActivos: number;
  tendencia: number[];
}

// AI Insights
export interface AIInsight {
  id: string;
  tipo: 'oportunidad' | 'riesgo' | 'optimizacion';
  titulo: string;
  descripcion: string;
  impacto: 'alto' | 'medio' | 'bajo';
  confianza: number;
  accionesRecomendadas: string[];
  datosRespaldo: Record<string, any>;
  fechaGeneracion: Date;
}

// Compliance Metrics
export interface ComplianceMetrics {
  backupsVerificados: {
    completado: boolean;
    ultimaVerificacion: Date;
    proximaVerificacion: Date;
  };
  politicasFirmadas: {
    porcentajeCompletado: number;
    pendientes: string[];
    vencimientos: { politica: string; fecha: Date }[];
  };
  accesosAuditados: {
    completado: boolean;
    ultimaAuditoria: Date;
    hallazgos: number;
  };
  certificacionesMSP: {
    vigentes: boolean;
    proximoVencimiento: Date;
    certificados: { nombre: string; vencimiento: Date }[];
  };
}

// Task Management
export interface CEOTask {
  id: string;
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  categoria: 'hoy' | 'semana' | 'mes';
  estado: 'pendiente' | 'en_proceso' | 'completada';
  fechaCreacion: Date;
  fechaVencimiento?: Date;
  etiquetas: string[];
  acciones: {
    enviarCorreo?: boolean;
    crearReunion?: boolean;
    asignarResponsable?: boolean;
  };
}

// Alert Extensions for CEO
export interface CEOAlert {
  id: string;
  tipo: 'clinica' | 'financiera' | 'operativa' | 'compliance';
  urgencia: 'crítica' | 'alta' | 'media';
  titulo: string;
  descripcion: string;
  accionesRequeridas: string[];
  estado: 'activa' | 'en_proceso' | 'resuelta';
}

// Export Configuration
export interface CEOExportConfig {
  formato: 'pdf' | 'excel' | 'notion' | 'google_sheets';
  incluirGraficos: boolean;
  incluirResumen: boolean;
  incluirDetalles: boolean;
  periodo: {
    inicio: Date;
    fin: Date;
  };
  seccionesIncluidas: {
    kpis: boolean;
    financiero: boolean;
    clinico: boolean;
    alertas: boolean;
    insights: boolean;
  };
}

// Dashboard State
export interface CEODashboardState {
  kpis: CEOKPIData[];
  financialMetrics: FinancialMetrics;
  burnEarnData: BurnEarnData[];
  profitabilityData: ProfitabilityData[];
  riskRadarData: RiskRadarData[];
  capacityForecast: CapacityForecastData[];
  adherenceData: AdherenceData[];
  aiInsights: AIInsight[];
  complianceMetrics: any;
  criticalAlerts: CEOAlert[];
  importantAlerts: CEOAlert[];
  tasks: CEOTask[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
}

// Simulation Parameters
export interface ScenarioSimulation {
  nombre: string;
  parametros: {
    incrementoPacientes?: number;
    cambioTarifas?: number;
    nuevosConsultorios?: number;
    reduccionCostos?: number;
  };
  resultadosProyectados: {
    ingresosMensuales: number;
    ebitda: number;
    roi: number;
    paybackMeses: number;
  };
}

// Voice Command Interface
export interface VoiceCommand {
  comando: string;
  intencion: 'mostrar' | 'filtrar' | 'exportar' | 'navegar';
  parametros: Record<string, any>;
  respuesta: string;
}