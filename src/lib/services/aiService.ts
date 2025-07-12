import { AIAnalysis, EmotionalState } from '../../types/session';

export class AIService {
  private static readonly API_ENDPOINT = '/api/ai/analyze-session';

  static async analyzeSessionNotes(notes: string, consultationReason: string): Promise<AIAnalysis> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes,
          consultationReason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze session notes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing session notes:', error);
      // Fallback analysis
      return this.generateFallbackAnalysis(notes);
    }
  }

  private static generateFallbackAnalysis(notes: string): AIAnalysis {
    const wordCount = notes.split(' ').length;
    const hasPositiveWords = /bien|mejor|progreso|positivo|alegr/i.test(notes);
    const hasNegativeWords = /mal|peor|triste|ansioso|preocup/i.test(notes);

    let emotionalTone: EmotionalState = 'neutral';
    if (hasPositiveWords && !hasNegativeWords) {
      emotionalTone = 'positivo';
    } else if (hasNegativeWords && !hasPositiveWords) {
      emotionalTone = 'ansioso';
    }

    return {
      summary: `Sesión registrada con ${wordCount} palabras de notas clínicas.`,
      recommendation: 'Continuar con el seguimiento según protocolo establecido.',
      emotionalTone,
      keyInsights: ['Sesión documentada', 'Seguimiento requerido'],
    };
  }

  static getEmotionalStateColor(state: EmotionalState): string {
    const colors: Record<EmotionalState, string> = {
      muy_positivo: '#4caf50',
      positivo: '#8bc34a',
      neutral: '#9e9e9e',
      ansioso: '#ff9800',
      triste: '#2196f3',
      irritado: '#f44336',
      confundido: '#9c27b0',
      before: '#9e9e9e', // Default neutral color for 'before' state
      after: '#9e9e9e',  // Default neutral color for 'after' state
    };
    return colors[state];
  }

  static getEmotionalStateIcon(state: EmotionalState): string {
    const icons: Record<EmotionalState, string> = {
      muy_positivo: '😊',
      positivo: '🙂',
      neutral: '😐',
      ansioso: '😰',
      triste: '😢',
      irritado: '😠',
      confundido: '😕',
      before: '⏮️', // Icon for 'before' state
      after: '⏭️',  // Icon for 'after' state
    };
    return icons[state];
  }

  static getEmotionalStateLabel(state: EmotionalState): string {
    const labels: Record<EmotionalState, string> = {
      muy_positivo: 'Muy Positivo',
      positivo: 'Positivo',
      neutral: 'Neutral',
      ansioso: 'Ansioso',
      triste: 'Triste',
      irritado: 'Irritado',
      confundido: 'Confundido',
      before: 'Antes',
      after: 'Después',
    };
    return labels[state];
  }
}