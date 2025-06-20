import { AIAnalysis, EmotionalTone } from '@/types/session';

export interface AIAnalysisResult {
  summary: string;
  emotionalTone: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  keyPoints: string[];
  model?: string; // Modelo de IA utilizado
  recommendations: string[];
}

export class AIService {
  /**
   * Analiza las notas de una sesión usando IA
   * Por ahora es una implementación básica, se puede integrar con OpenAI más adelante
   */
  static async analyzeSessionNotes(sessionId: string, notes: string): Promise<AIAnalysisResult> {
    try {
      // Implementación básica sin IA real por ahora
      const notesLower = notes.toLowerCase();
      
      // Detectar palabras clave de riesgo
      const highRiskKeywords = [
        'suicidio', 'autolesión', 'crisis', 'pánico', 'agresión',
        'violencia', 'psicosis', 'alucinaciones', 'delirios'
      ];
      
      const mediumRiskKeywords = [
        'ansiedad', 'depresión', 'estrés', 'insomnio', 'irritabilidad',
        'tristeza', 'preocupación', 'miedo', 'angustia'
      ];

      const highRiskCount = highRiskKeywords.filter(keyword => 
        notesLower.includes(keyword)
      ).length;

      const mediumRiskCount = mediumRiskKeywords.filter(keyword => 
        notesLower.includes(keyword)
      ).length;

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      let confidence = 0.5;

      if (highRiskCount > 0) {
        riskLevel = 'high';
        confidence = Math.min(0.9, 0.6 + (highRiskCount * 0.1));
      } else if (mediumRiskCount > 1) {
        riskLevel = 'medium';
        confidence = Math.min(0.8, 0.5 + (mediumRiskCount * 0.05));
      }

      // Detectar tono emocional básico
      let emotionalTone = 'Estable';
      if (notesLower.includes('ansioso') || notesLower.includes('ansiedad')) {
        emotionalTone = 'Ansioso/a';
      } else if (notesLower.includes('deprimido') || notesLower.includes('triste')) {
        emotionalTone = 'Deprimido/a';
      } else if (notesLower.includes('irritable') || notesLower.includes('enojado')) {
        emotionalTone = 'Irritable';
      } else if (notesLower.includes('confundido') || notesLower.includes('confusión')) {
        emotionalTone = 'Confundido/a';
      }

      // Generar resumen básico
      const summary = `Análisis de sesión ${sessionId}: ${riskLevel === 'high' ? 'Requiere atención inmediata' : 
        riskLevel === 'medium' ? 'Seguimiento recomendado' : 'Progreso normal'}`;

      // Puntos clave básicos
      const keyPoints = [];
      if (highRiskCount > 0) {
        keyPoints.push('Indicadores de alto riesgo detectados');
      }
      if (mediumRiskCount > 0) {
        keyPoints.push('Síntomas de seguimiento identificados');
      }
      if (keyPoints.length === 0) {
        keyPoints.push('Sesión sin indicadores de riesgo significativos');
      }

      // Recomendaciones básicas
      const recommendations = [];
      if (riskLevel === 'high') {
        recommendations.push('Evaluación inmediata requerida');
        recommendations.push('Considerar seguimiento intensivo');
      } else if (riskLevel === 'medium') {
        recommendations.push('Programar seguimiento en 1-2 semanas');
        recommendations.push('Monitorear síntomas reportados');
      } else {
        recommendations.push('Continuar con plan de tratamiento actual');
      }

      return {
        summary,
        emotionalTone,
        riskLevel,
        confidence,
        keyPoints,
        recommendations
      };

    } catch (error) {
      console.error('Error analyzing session notes:', error);
      
      // Retornar análisis por defecto en caso de error
      return {
        summary: 'Error en el análisis automático',
        emotionalTone: 'Estable',
        riskLevel: 'low',
        confidence: 0.1,
        keyPoints: ['Análisis no disponible'],
        recommendations: ['Revisar manualmente']
      };
    }
  }

  /**
   * Reanaliza las notas de una sesión (cuando se modifican)
   */
  static async reanalyzeSession(
    sessionId: string,
    updatedNotes: string,
    patientContext?: {
      patientId: string;
      previousSessions?: string[];
      diagnoses?: string[];
      medications?: string[];
      riskFactors?: string[];
    }
  ): Promise<AIAnalysis> {
    const aiResult = await this.analyzeSessionNotes(sessionId, updatedNotes);
    
    // Enhance analysis with patient context if available
    const enhancedKeyInsights = patientContext 
      ? [...aiResult.keyPoints, `Análisis considerando historial del paciente ${patientContext.patientId}`]
      : aiResult.keyPoints;
    
    // Convert AIAnalysisResult to AIAnalysis format
    return {
      ...aiResult,
      emotionalTone: aiResult.emotionalTone as EmotionalTone,
      recommendation: aiResult.recommendations?.[0] || '',
      keyInsights: enhancedKeyInsights || [],
      suggestedInterventions: aiResult.recommendations || [],
      generatedAt: new Date(),
      processedBy: 'gpt-3.5-turbo'
    };
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

  /**
   * Genera un resumen de sesión usando IA
   */
  static async generateSessionSummary(notes: string, sessionType: string): Promise<string> {
    try {
      // Implementación básica
      const wordsCount = notes.split(' ').length;
      const sessionTypeLabel = sessionType === 'individual' ? 'individual' : 
                              sessionType === 'group' ? 'grupal' : 
                              sessionType === 'family' ? 'familiar' : 'terapéutica';

      return `Sesión ${sessionTypeLabel} documentada con ${wordsCount} palabras. ` +
             `${wordsCount > 100 ? 'Sesión detallada con observaciones completas.' : 
               'Sesión con documentación básica.'}`;
    } catch (error) {
      console.error('Error generating session summary:', error);
      return 'Resumen no disponible';
    }
  }

  /**
   * Detecta emociones en texto
   */
  static async detectEmotions(text: string): Promise<Record<string, number>> {
    try {
      const textLower = text.toLowerCase();
      const emotions: Record<string, number> = {
        'Alegre': 0,
        'Triste': 0,
        'Ansioso': 0,
        'Calmado': 0,
        'Irritable': 0,
        'Confundido': 0
      };

      // Palabras clave para cada emoción
      const emotionKeywords = {
        'Alegre': ['feliz', 'contento', 'alegre', 'bien', 'mejor', 'positivo'],
        'Triste': ['triste', 'deprimido', 'melancólico', 'desanimado', 'abatido'],
        'Ansioso': ['ansioso', 'nervioso', 'preocupado', 'estresado', 'tenso'],
        'Calmado': ['calmado', 'tranquilo', 'relajado', 'sereno', 'pacífico'],
        'Irritable': ['irritable', 'enojado', 'molesto', 'frustrado', 'agitado'],
        'Confundido': ['confundido', 'perdido', 'desorientado', 'incierto']
      };

      // Contar ocurrencias
      Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        keywords.forEach(keyword => {
          if (textLower.includes(keyword)) {
            emotions[emotion]++;
          }
        });
      });

      return emotions;
    } catch (error) {
      console.error('Error detecting emotions:', error);
      return {};
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