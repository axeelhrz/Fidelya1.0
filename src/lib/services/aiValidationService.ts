import { AIValidationResult, AISuggestion, AIFlag, DiagnosisCode, ClinicalNote } from '@/types/notes';

class AIValidationService {
  private readonly API_ENDPOINT = '/api/ai/validate';

  // Validar coherencia de la nota
  async validateNote(note: ClinicalNote): Promise<AIValidationResult> {
    try {
      // Simular llamada a API de IA
      await new Promise(resolve => setTimeout(resolve, 3000));

      const suggestions = this.generateSuggestions(note);
      const flags = this.generateFlags(note);
      const suggestedDiagnoses = this.generateDiagnosisSuggestions(note);
      const coherenceScore = this.calculateCoherenceScore(note);

      const result: AIValidationResult = {
        id: `validation_${Date.now()}`,
        noteId: note.id,
        timestamp: new Date(),
        coherenceScore,
        suggestions,
        flaggedIssues: flags,
        confidence: Math.min(95, coherenceScore + 10),
        riskFlags: this.extractRiskFlags(note),
        suggestedDiagnoses,
        isValid: coherenceScore >= 70 && flags.filter(f => f.severity === 'critical').length === 0
      };

      return result;
    } catch (error) {
      console.error('Error validating note:', error);
      throw new Error('Error al validar la nota con IA');
    }
  }

  // Sugerir códigos de diagnóstico
  async suggestDiagnoses(): Promise<DiagnosisCode[]> {
    try {
      // Simular llamada a API de IA para sugerencias de diagnóstico
      await new Promise(resolve => setTimeout(resolve, 2000));

      const suggestions: DiagnosisCode[] = [
        {
          code: 'F41.1',
          description: 'Trastorno de ansiedad generalizada',
          system: 'ICD-11',
          confidence: 85
        },
        {
          code: 'F32.1',
          description: 'Episodio depresivo moderado',
          system: 'ICD-11',
          confidence: 72
        },
        {
          code: '300.02',
          description: 'Trastorno de Ansiedad Generalizada',
          system: 'DSM-5-TR',
          confidence: 83
        }
      ];

      return suggestions.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
    } catch (error) {
      console.error('Error suggesting diagnoses:', error);
      throw new Error('Error al obtener sugerencias de diagnóstico');
    }
  }

  // Validar consistencia entre síntomas y diagnóstico
  async validateConsistency(): Promise<{
    isConsistent: boolean;
    confidence: number;
    explanation: string;
    suggestions: string[];
  }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Lógica simulada de validación
      const isConsistent = Math.random() > 0.3; // 70% de probabilidad de consistencia
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%

      return {
        isConsistent,
        confidence,
        explanation: isConsistent 
          ? 'Los síntomas descritos son consistentes con el diagnóstico propuesto.'
          : 'Se detectaron algunas inconsistencias entre los síntomas y el diagnóstico.',
        suggestions: isConsistent 
          ? ['Considerar evaluación de comorbilidades', 'Revisar criterios de severidad']
          : ['Revisar criterios diagnósticos', 'Considerar diagnósticos diferenciales', 'Ampliar evaluación de síntomas']
      };
    } catch (error) {
      console.error('Error validating consistency:', error);
      throw new Error('Error al validar consistencia');
    }
  }

  // Generar sugerencias basadas en el contenido
  private generateSuggestions(note: ClinicalNote): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    // Sugerencias de diagnóstico
    if (!note.diagnosis?.primary) {
      suggestions.push({
        type: 'diagnosis',
        suggestion: 'Considerar agregar un diagnóstico principal basado en los síntomas descritos',
        confidence: 80,
        reasoning: 'No se ha especificado un diagnóstico principal',
        priority: 'high'
      });
    }

    // Sugerencias de intervención
    if (note.content.plan && note.content.plan.length < 50) {
      suggestions.push({
        type: 'intervention',
        field: 'plan',
        suggestion: 'Ampliar el plan de tratamiento con intervenciones más específicas',
        confidence: 75,
        reasoning: 'El plan de tratamiento parece muy breve',
        priority: 'medium'
      });
    }

    // Sugerencias de evaluación de riesgo
    if (!note.content.riskAssessment || note.content.riskAssessment.riskLevel === 'low') {
      const riskKeywords = ['suicidio', 'autolesión', 'muerte', 'lastimar', 'dañar'];
      const hasRiskContent = Object.values(note.content).some(content => 
        typeof content === 'string' && 
        riskKeywords.some(keyword => content.toLowerCase().includes(keyword))
      );

      if (hasRiskContent) {
        suggestions.push({
          type: 'risk-assessment',
          suggestion: 'Revisar la evaluación de riesgo - se detectaron indicadores potenciales',
          confidence: 90,
          reasoning: 'Se encontraron palabras clave relacionadas con riesgo',
          priority: 'high'
        });
      }
    }

    // Sugerencias de claridad
    if (note.content.assessment && note.content.assessment.length > 500) {
      suggestions.push({
        type: 'clarity',
        field: 'assessment',
        suggestion: 'Considerar dividir la evaluación en puntos más concisos',
        confidence: 65,
        reasoning: 'La sección de evaluación es muy extensa',
        priority: 'low'
      });
    }

    return suggestions;
  }

  // Generar flags de problemas
  private generateFlags(note: ClinicalNote): AIFlag[] {
    const flags: AIFlag[] = [];

    // Flag de información faltante
    if (note.templateType === 'soap') {
      const requiredFields = ['subjective', 'objective', 'assessment', 'plan'];
      const missingFields = requiredFields.filter(field => 
        !note.content[field as keyof typeof note.content] || 
        (note.content[field as keyof typeof note.content] as string)?.length < 10
      );

      if (missingFields.length > 0) {
        flags.push({
          type: 'missing-info',
          severity: 'medium',
          description: `Campos incompletos en plantilla SOAP: ${missingFields.join(', ')}`,
          recommendation: 'Completar todos los campos requeridos de la plantilla SOAP'
        });
      }
    }

    // Flag de inconsistencia
    if (note.content.subjective && note.content.assessment) {
      const subjectiveWords = note.content.subjective.toLowerCase().split(' ');
      const assessmentWords = note.content.assessment.toLowerCase().split(' ');
      const commonWords = subjectiveWords.filter(word => assessmentWords.includes(word));
      
      if (commonWords.length < 3) {
        flags.push({
          type: 'inconsistency',
          severity: 'low',
          description: 'Posible inconsistencia entre información subjetiva y evaluación',
          recommendation: 'Revisar la coherencia entre los síntomas reportados y la evaluación clínica'
        });
      }
    }

    // Flag de riesgo
    if (note.content.riskAssessment) {
      const highRiskFactors = [
        note.content.riskAssessment.suicidalIdeation,
        note.content.riskAssessment.homicidalIdeation,
        note.content.riskAssessment.selfHarm,
        note.content.riskAssessment.psychosis
      ].filter(Boolean).length;

      if (highRiskFactors > 0 && note.content.riskAssessment.riskLevel === 'low') {
        flags.push({
          type: 'risk-indicator',
          severity: 'critical',
          description: 'Discrepancia en evaluación de riesgo',
          recommendation: 'Revisar el nivel de riesgo considerando los factores identificados'
        });
      }
    }

    return flags;
  }

  // Generar sugerencias de diagnóstico
  private generateDiagnosisSuggestions(note: ClinicalNote): DiagnosisCode[] {
    const suggestions: DiagnosisCode[] = [];

    // Análisis básico de palabras clave
    const content = [
      note.content.subjective,
      note.content.objective,
      note.content.assessment,
      note.content.data,
      note.content.freeText
    ].filter(Boolean).join(' ').toLowerCase();

    // Sugerencias basadas en palabras clave
    if (content.includes('ansiedad') || content.includes('nervioso') || content.includes('preocupación')) {
      suggestions.push({
        code: 'F41.1',
        description: 'Trastorno de ansiedad generalizada',
        system: 'ICD-11',
        confidence: 75
      });
    }

    if (content.includes('depresión') || content.includes('tristeza') || content.includes('desesperanza')) {
      suggestions.push({
        code: 'F32.1',
        description: 'Episodio depresivo moderado',
        system: 'ICD-11',
        confidence: 70
      });
    }

    if (content.includes('trauma') || content.includes('pesadillas') || content.includes('flashback')) {
      suggestions.push({
        code: 'F43.1',
        description: 'Trastorno de estrés postraumático',
        system: 'ICD-11',
        confidence: 80
      });
    }

    return suggestions.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  }

  // Calcular puntuación de coherencia
  private calculateCoherenceScore(note: ClinicalNote): number {
    let score = 100;

    // Penalizar por campos vacíos
    if (note.templateType === 'soap') {
      const fields = [note.content.subjective, note.content.objective, note.content.assessment, note.content.plan];
      const emptyFields = fields.filter(field => !field || field.length < 10).length;
      score -= emptyFields * 15;
    }

    // Penalizar por falta de diagnóstico
    if (!note.diagnosis?.primary) {
      score -= 20;
    }

    // Penalizar por evaluación de riesgo incompleta
    if (!note.content.riskAssessment) {
      score -= 10;
    }

    // Bonificar por contenido detallado
    const totalContent = Object.values(note.content)
      .filter(content => typeof content === 'string')
      .join('').length;
    
    if (totalContent > 500) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  // Extraer flags de riesgo
  private extractRiskFlags(note: ClinicalNote): string[] {
    const flags: string[] = [];

    if (note.content.riskAssessment) {
      const risk = note.content.riskAssessment;
      
      if (risk.suicidalIdeation) flags.push('Ideación suicida');
      if (risk.homicidalIdeation) flags.push('Ideación homicida');
      if (risk.selfHarm) flags.push('Autolesión');
      if (risk.substanceAbuse) flags.push('Abuso de sustancias');
      if (risk.psychosis) flags.push('Psicosis');
      if (risk.domesticViolence) flags.push('Violencia doméstica');
      if (risk.childAbuse) flags.push('Abuso infantil');
    }

    return flags;
  }
}

export const aiValidationService = new AIValidationService();
