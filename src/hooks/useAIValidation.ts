import { useState, useCallback } from 'react';
import { AIValidationResult, DiagnosisCode, ClinicalNote } from '@/types/notes';
import { aiValidationService } from '@/lib/services/aiValidationService';

export function useAIValidation() {
  const [validationResult, setValidationResult] = useState<AIValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateNote = useCallback(async (note: ClinicalNote): Promise<AIValidationResult | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await aiValidationService.validateNote(note);
      setValidationResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar la nota';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
    setError(null);
  }, []);

  return {
    validationResult,
    loading,
    error,
    validateNote,
    clearValidation
  };
}

export function useDiagnosisSuggestions() {
  const [suggestions, setSuggestions] = useState<DiagnosisCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = useCallback(async (): Promise<DiagnosisCode[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await aiValidationService.suggestDiagnoses();
      setSuggestions(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener sugerencias';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    suggestions,
    loading,
    error,
    getSuggestions,
    clearSuggestions
  };
}

export function useConsistencyValidation() {
  const [result, setResult] = useState<{
    isConsistent: boolean;
    confidence: number;
    explanation: string;
    suggestions: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateConsistency = useCallback(async (

  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const validationResult = await aiValidationService.validateConsistency();
      setResult(validationResult);
      return validationResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al validar consistencia';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    validateConsistency,
    clearResult
  };
}
