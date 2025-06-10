'use client';

import { useState, useCallback, useMemo } from 'react';
import { FormProgress, FormStep, SCATSection } from '../types/scatForm';
import { CauseValidation } from '../types/validation';
import { SCAT_SECTIONS } from '../data/scatData';

export interface UseFormStepperReturn {
  // Estado actual
  currentSection: 'ci' | 'cb' | 'nac';
  currentCause: number;
  currentStep: FormStep;
  steps: FormStep[];
  
  // Datos de la sección actual
  currentSectionData: SCATSection;
  currentCauseData: SCATSection['causes'][0] | undefined;
  
  // Progreso
  progress: FormProgress;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isCurrentCauseComplete: boolean;
  
  // Validaciones
  validations: Record<string, CauseValidation>;
  
  // Acciones de navegación
  goNext: () => void;
  goPrevious: () => void;
  goToSection: (section: 'ci' | 'cb' | 'nac') => void;
  goToCause: (causeIndex: number) => void;
  
  // Acciones de validación
  updateValidation: (causeId: string, validation: Partial<CauseValidation>) => void;
  markCauseComplete: (causeId: string) => void;
  updateObservation: (causeId: string, observation: string) => void;
  addAttachment: (causeId: string, attachment: string) => void;
  removeAttachment: (causeId: string, attachmentIndex: number) => void;
  
  // Validaciones NAC específicas
  updateNACValidation: (causeId: string, type: 'P' | 'E' | 'C', value: boolean) => void;
  
  // Utilidades
  getSectionProgress: (section: 'ci' | 'cb' | 'nac') => { completed: number; total: number; percentage: number };
  getTotalProgress: () => number;
  isFormComplete: () => boolean;
  getIncompleteValidations: () => string[];
  
  // Persistencia
  saveProgress: () => void;
  loadProgress: () => void;
  resetForm: () => void;
}

export function useFormStepper(): UseFormStepperReturn {
  // Estado principal
  const [currentSection, setCurrentSection] = useState<'ci' | 'cb' | 'nac'>('ci');
  const [currentCause, setCurrentCause] = useState<number>(0);
  const [validations, setValidations] = useState<Record<string, CauseValidation>>({});

  // Datos de la sección actual
  const currentSectionData = useMemo(() => {
    return SCAT_SECTIONS.find(section => section.id === currentSection)!;
  }, [currentSection]);

  // Datos de la causa actual
  const currentCauseData = useMemo(() => {
    return currentSectionData.causes[currentCause];
  }, [currentSectionData, currentCause]);

  // Generar steps para la barra de progreso
  const steps = useMemo((): FormStep[] => {
    return SCAT_SECTIONS.map(section => {
      const sectionProgress = getSectionProgressInternal(section.id);
      let status: 'pending' | 'active' | 'completed' | 'locked' = 'pending';
      
      if (section.id === currentSection) {
        status = 'active';
      } else if (sectionProgress.percentage === 100) {
        status = 'completed';
      } else if (section.id === 'cb' && getSectionProgressInternal('ci').percentage < 100) {
        status = 'locked';
      } else if (section.id === 'nac' && getSectionProgressInternal('cb').percentage < 100) {
        status = 'locked';
      }

      return {
        id: section.id,
        section: section.id,
        title: section.title,
        status,
        progress: sectionProgress.percentage
      };
    });
  }, [currentSection, validations]);

  // Step actual
  const currentStep = useMemo(() => {
    return steps.find(step => step.section === currentSection)!;
  }, [steps, currentSection]);

  // Función interna para calcular progreso de sección
  const getSectionProgressInternal = useCallback((section: 'ci' | 'cb' | 'nac') => {
    const sectionData = SCAT_SECTIONS.find(s => s.id === section)!;
    const completed = sectionData.causes.filter(cause => {
      const validation = validations[cause.id];
      return validation?.selected || false;
    }).length;
    
    return {
      completed,
      total: sectionData.totalCauses,
      percentage: Math.round((completed / sectionData.totalCauses) * 100)
    };
  }, [validations]);

  // Progreso general
  const progress = useMemo((): FormProgress => {
    return {
      currentSection,
      currentCause,
      sectionProgress: {
        ci: getSectionProgressInternal('ci'),
        cb: getSectionProgressInternal('cb'),
        nac: getSectionProgressInternal('nac')
      },
      validations,
      isComplete: isFormCompleteInternal()
    };
  }, [currentSection, currentCause, validations, getSectionProgressInternal]);

  // Verificar si la causa actual está completa
  const isCurrentCauseComplete = useMemo(() => {
    const validation = validations[currentCauseData?.id];
    if (!validation) return false;
    
    if (currentSection === 'nac') {
      return validation.selected && 
             validation.P !== null && 
             validation.E !== null && 
             validation.C !== null;
    }
    
    return validation.selected;
  }, [validations, currentCauseData, currentSection]);

  // Verificar si se puede avanzar
  const canGoNext = useMemo(() => {
    // Si estamos en la última causa de la última sección
    if (currentSection === 'nac' && currentCause >= currentSectionData.causes.length - 1) {
      return false;
    }
    
    // Si estamos en la última causa de una sección, verificar que esté completa
    if (currentCause >= currentSectionData.causes.length - 1) {
      const sectionProgress = getSectionProgressInternal(currentSection);
      return sectionProgress.percentage === 100;
    }
    
    return true;
  }, [currentSection, currentCause, currentSectionData, getSectionProgressInternal]);

  // Verificar si se puede retroceder
  const canGoPrevious = useMemo(() => {
    return !(currentSection === 'ci' && currentCause === 0);
  }, [currentSection, currentCause]);

  // Función interna para verificar si el formulario está completo
  const isFormCompleteInternal = useCallback(() => {
    return SCAT_SECTIONS.every(section => {
      const sectionProgress = getSectionProgressInternal(section.id);
      return sectionProgress.percentage === 100;
    });
  }, [getSectionProgressInternal]);

  // Navegación: Siguiente
  const goNext = useCallback(() => {
    if (!canGoNext) return;

    // Si estamos en la última causa de la sección actual
    if (currentCause >= currentSectionData.causes.length - 1) {
      // Avanzar a la siguiente sección
      if (currentSection === 'ci') {
        setCurrentSection('cb');
        setCurrentCause(0);
      } else if (currentSection === 'cb') {
        setCurrentSection('nac');
        setCurrentCause(0);
      }
    } else {
      // Avanzar a la siguiente causa en la misma sección
      setCurrentCause(prev => prev + 1);
    }
  }, [canGoNext, currentCause, currentSectionData, currentSection]);

  // Navegación: Anterior
  const goPrevious = useCallback(() => {
    if (!canGoPrevious) return;

    // Si estamos en la primera causa de la sección actual
    if (currentCause === 0) {
      // Retroceder a la sección anterior
      if (currentSection === 'cb') {
        setCurrentSection('ci');
        const ciSection = SCAT_SECTIONS.find(s => s.id === 'ci')!;
        setCurrentCause(ciSection.causes.length - 1);
      } else if (currentSection === 'nac') {
        setCurrentSection('cb');
        const cbSection = SCAT_SECTIONS.find(s => s.id === 'cb')!;
        setCurrentCause(cbSection.causes.length - 1);
      }
    } else {
      // Retroceder a la causa anterior en la misma sección
      setCurrentCause(prev => prev - 1);
    }
  }, [canGoPrevious, currentCause, currentSection]);

  // Navegación: Ir a sección específica
  const goToSection = useCallback((section: 'ci' | 'cb' | 'nac') => {
    const step = steps.find(s => s.section === section);
    if (step && step.status !== 'locked') {
      setCurrentSection(section);
      setCurrentCause(0);
    }
  }, [steps]);

  // Navegación: Ir a causa específica
  const goToCause = useCallback((causeIndex: number) => {
    if (causeIndex >= 0 && causeIndex < currentSectionData.causes.length) {
      setCurrentCause(causeIndex);
    }
  }, [currentSectionData]);

  // Actualizar validación
  const updateValidation = useCallback((causeId: string, validation: Partial<CauseValidation>) => {
    setValidations(prev => {
      const defaultValidation = {
        selected: false,
        observation: '',
        attachments: [],
        P: null,
        E: null,
        C: null
      };
      
      return {
        ...prev,
        [causeId]: {
          ...defaultValidation,
          ...prev[causeId],
          ...validation,
          completedAt: validation.selected ? new Date() : prev[causeId]?.completedAt
        }
      };
    });
  }, []);

  // Marcar causa como completa
  const markCauseComplete = useCallback((causeId: string) => {
    updateValidation(causeId, { selected: true });
  }, [updateValidation]);

  // Actualizar observación
  const updateObservation = useCallback((causeId: string, observation: string) => {
    updateValidation(causeId, { observation });
  }, [updateValidation]);

  // Agregar adjunto
  const addAttachment = useCallback((causeId: string, attachment: string) => {
    setValidations(prev => {
      const current = prev[causeId] || { selected: false, observation: '', attachments: [] };
      return {
        ...prev,
        [causeId]: {
          ...current,
          attachments: [...current.attachments, attachment]
        }
      };
    });
  }, []);

  // Remover adjunto
  const removeAttachment = useCallback((causeId: string, attachmentIndex: number) => {
    setValidations(prev => {
      const current = prev[causeId];
      if (!current) return prev;
      
      return {
        ...prev,
        [causeId]: {
          ...current,
          attachments: current.attachments.filter((_, index) => index !== attachmentIndex)
        }
      };
    });
  }, []);

  // Actualizar validación NAC específica
  const updateNACValidation = useCallback((causeId: string, type: 'P' | 'E' | 'C', value: boolean) => {
    updateValidation(causeId, { [type]: value });
  }, [updateValidation]);

  // Obtener progreso de sección
  const getSectionProgress = useCallback((section: 'ci' | 'cb' | 'nac') => {
    return getSectionProgressInternal(section);
  }, [getSectionProgressInternal]);

  // Obtener progreso total
  const getTotalProgress = useCallback(() => {
    const totalCauses = SCAT_SECTIONS.reduce((sum, section) => sum + section.totalCauses, 0);
    const completedCauses = SCAT_SECTIONS.reduce((sum, section) => {
      const sectionProgress = getSectionProgressInternal(section.id);
      return sum + sectionProgress.completed;
    }, 0);
    
    return Math.round((completedCauses / totalCauses) * 100);
  }, [getSectionProgressInternal]);

  // Verificar si el formulario está completo
  const isFormComplete = useCallback(() => {
    return isFormCompleteInternal();
  }, [isFormCompleteInternal]);

  // Obtener validaciones incompletas
  const getIncompleteValidations = useCallback(() => {
    const incomplete: string[] = [];
    
    SCAT_SECTIONS.forEach(section => {
      section.causes.forEach(cause => {
        const validation = validations[cause.id];
        if (!validation?.selected) {
          incomplete.push(`${section.name} ${cause.number}: ${cause.title}`);
        } else if (section.id === 'nac' && (
          validation.P === null || 
          validation.E === null || 
          validation.C === null
        )) {
          incomplete.push(`${section.name} ${cause.number}: Validaciones P/E/C incompletas`);
        }
      });
    });
    
    return incomplete;
  }, [validations]);

  // Guardar progreso (localStorage)
  const saveProgress = useCallback(() => {
    const progressData = {
      currentSection,
      currentCause,
      validations,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('scat-form-progress', JSON.stringify(progressData));
  }, [currentSection, currentCause, validations]);

  // Cargar progreso (localStorage)
  const loadProgress = useCallback(() => {
    try {
      const saved = localStorage.getItem('scat-form-progress');
      if (saved) {
        const progressData = JSON.parse(saved);
        setCurrentSection(progressData.currentSection || 'ci');
        setCurrentCause(progressData.currentCause || 0);
        setValidations(progressData.validations || {});
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }, []);

  // Resetear formulario
  const resetForm = useCallback(() => {
    setCurrentSection('ci');
    setCurrentCause(0);
    setValidations({});
    localStorage.removeItem('scat-form-progress');
  }, []);

  return {
    // Estado actual
    currentSection,
    currentCause,
    currentStep,
    steps,
    
    // Datos actuales
    currentSectionData,
    currentCauseData,
    
    // Progreso
    progress,
    canGoNext,
    canGoPrevious,
    isCurrentCauseComplete,
    
    // Validaciones
    validations,
    
    // Navegación
    goNext,
    goPrevious,
    goToSection,
    goToCause,
    
    // Validaciones
    updateValidation,
    markCauseComplete,
    updateObservation,
    addAttachment,
    removeAttachment,
    updateNACValidation,
    
    // Utilidades
    getSectionProgress,
    getTotalProgress,
    isFormComplete,
    getIncompleteValidations,
    
    // Persistencia
    saveProgress,
    loadProgress,
    resetForm
  };
}