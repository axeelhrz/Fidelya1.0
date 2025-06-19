import { AIAnalysis, EmotionalTone } from '@/types/session';

export interface OpenAIResponse {
  summary: string;
  recommendation: string;
  emotionalTone: EmotionalTone;
  keyInsights: string[];
  riskLevel: 'low' | 'medium' | 'high';
  suggestedInterventions: string[];
  confidence: number;
}

export class AIService {
  private static readonly API_ENDPOINT = '/api/ai/analyze-session';

  /**
   * Analiza las notas de una sesión clínica usando IA
   * Esta función llama a una Firebase Function que procesa la información de forma segura
   */
  static async analyzeSessionNotes(
    sessionId: string,
    notes: string,
    patientContext?: {
      age?: number;
      gender?: string;
      previousSessions?: number;
      mainConcerns?: string[];
    }
  ): Promise<AIAnalysis> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          notes,
          patientContext,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.statusText}`);
      }

      const aiResponse: OpenAIResponse = await response.json();

      // Transformar la respuesta al formato de AIAnalysis
      const analysis: AIAnalysis = {
        summary: aiResponse.summary,
        recommendation: aiResponse.recommendation,
        emotionalTone: aiResponse.emotionalTone,
        keyInsights: aiResponse.keyInsights,
        riskLevel: aiResponse.riskLevel,
        suggestedInterventions: aiResponse.suggestedInterventions,
        generatedAt: new Date(),
        processedBy: 'gpt-4',
        confidence: aiResponse.confidence,
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing session notes:', error);
      throw new Error('No se pudo procesar el análisis de IA. Inténtalo más tarde.');
    }
  }

  /**
   * Reanaliza las notas de una sesión (cuando se modifican)
   */
  static async reanalyzeSession(
    sessionId: string,
    updatedNotes: string,
    patientContext?: any
  ): Promise<AIAnalysis> {
    return this.analyzeSessionNotes(sessionId, updatedNotes, patientContext);
  }

  /**
   * Genera un resumen de múltiples sesiones para un paciente
   */
  static async generatePatientSummary(
    patientId: string,
    sessionNotes: string[],
    timeframe: 'week' | 'month' | 'quarter'
  ): Promise<{
    overallProgress: string;
    mainPatterns: string[];
    recommendations: string[];
    riskAssessment: 'low' | 'medium' | 'high';
  }> {
    try {
      const response = await fetch('/api/ai/patient-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          sessionNotes,
          timeframe,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Patient summary generation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating patient summary:', error);
      throw new Error('No se pudo generar el resumen del paciente.');
    }
  }

  /**
   * Valida que las notas tengan suficiente contenido para análisis
   */
  static validateNotesForAnalysis(notes: string): {
    isValid: boolean;
    reason?: string;
    minLength: number;
  } {
    const minLength = 50;
    const trimmedNotes = notes.trim();

    if (trimmedNotes.length < minLength) {
      return {
        isValid: false,
        reason: `Las notas deben tener al menos ${minLength} caracteres para un análisis efectivo.`,
        minLength,
      };
    }

    // Verificar que no sean solo espacios o caracteres repetidos
    const uniqueChars = new Set(trimmedNotes.toLowerCase().replace(/\s/g, ''));
    if (uniqueChars.size < 10) {
      return {
        isValid: false,
        reason: 'Las notas parecen tener contenido insuficiente o repetitivo.',
        minLength,
      };
    }

    return {
      isValid: true,
      minLength,
    };
  }

  /**
   * Obtiene sugerencias de preguntas para la próxima sesión
   */
  static async getNextSessionQuestions(
    currentNotes: string,
    patientHistory: string[]
  ): Promise<string[]> {
    try {
      const response = await fetch('/api/ai/next-session-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentNotes,
          patientHistory,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate next session questions');
      }

      const data = await response.json();
      return data.questions || [];
    } catch (error) {
      console.error('Error getting next session questions:', error);
      return [];
    }
  }
}

// Utilidades para el manejo de análisis de IA
export const AIUtils = {
  /**
   * Formatea el nivel de confianza para mostrar al usuario
   */
  formatConfidence: (confidence: number): string => {
    if (confidence >= 0.8) return 'Alta';
    if (confidence >= 0.6) return 'Media';
    return 'Baja';
  },

  /**
   * Determina si un análisis necesita revisión humana
   */
  needsHumanReview: (analysis: AIAnalysis): boolean => {
    return (
      analysis.confidence < 0.7 ||
      analysis.riskLevel === 'high' ||
      analysis.keyInsights.length < 2
    );
  },

  /**
   * Genera un color para el nivel de riesgo
   */
  getRiskColor: (riskLevel: 'low' | 'medium' | 'high'): string => {
    const colors = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
    };
    return colors[riskLevel];
  },

  /**
   * Calcula el tiempo estimado de procesamiento
   */
  getEstimatedProcessingTime: (notesLength: number): number => {
    // Tiempo base de 10 segundos + 1 segundo por cada 100 caracteres
    return Math.max(10, Math.ceil(notesLength / 100) + 10);
  },
};
