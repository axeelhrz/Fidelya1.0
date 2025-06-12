import { useCallback, useEffect, useRef } from 'react';
import { useScatData } from '../contexts/ScatContext';
import { useEditing } from '../contexts/EditingContext';

export function useProjectEditing() {
  const { 
    getCompleteSummary, 
    loadProjectForEditing, 
    resetAllData,
    setEditingState 
  } = useScatData();
  
  const {
    isEditing,
    projectId,
    projectData,
    status,
    error,
    hasUnsavedChanges,
    startEditing,
    stopEditing,
    updateProjectData,
    saveProject,
    EDITING_STATES
  } = useEditing();

  const lastSyncRef = useRef(null);
  const isLoadingRef = useRef(false);

  // Sincronizar datos SCAT con el contexto de edición
  const syncScatData = useCallback(async () => {
    if (!isEditing || !projectId || isLoadingRef.current) return;

    try {
      const scatSummary = getCompleteSummary();
      const updatedData = {
        formData: scatSummary.project,
        scatData: {
          evaluacion: scatSummary.evaluacion,
          contacto: scatSummary.contacto,
          causasInmediatas: scatSummary.causasInmediatas,
          causasBasicas: scatSummary.causasBasicas,
          necesidadesControl: scatSummary.necesidadesControl
        }
      };

      // Solo actualizar si los datos han cambiado
      const currentDataString = JSON.stringify(updatedData);
      if (lastSyncRef.current !== currentDataString) {
        updateProjectData(updatedData);
        lastSyncRef.current = currentDataString;
      }
    } catch (error) {
      console.error('Error sincronizando datos SCAT:', error);
    }
  }, [isEditing, projectId, getCompleteSummary, updateProjectData]);

  // Iniciar edición de un proyecto
  const startProjectEditing = useCallback(async (project) => {
    try {
      console.log('=== INICIANDO EDICIÓN DE PROYECTO ===');
      console.log('Proyecto a editar:', project);

      isLoadingRef.current = true;

      // Limpiar datos anteriores
      resetAllData();
      
      // Iniciar modo edición en el contexto
      startEditing(project);
      
      // Cargar datos en el contexto SCAT con verificación
      const loadSuccess = await loadProjectForEditing(project);
      if (!loadSuccess) {
        throw new Error('Error cargando datos del proyecto');
      }
      
      // Marcar como editando en SCAT context
      setEditingState(true, project.id);
      
      // Pequeña pausa para asegurar que los datos se carguen completamente
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('=== EDICIÓN INICIADA EXITOSAMENTE ===');
      return true;
    } catch (error) {
      console.error('Error iniciando edición:', error);
      return false;
    } finally {
      isLoadingRef.current = false;
    }
  }, [resetAllData, startEditing, loadProjectForEditing, setEditingState]);

  // Finalizar edición
  const finishProjectEditing = useCallback(async (saveChanges = true) => {
    try {
      console.log('=== FINALIZANDO EDICIÓN ===');
      
      if (saveChanges && hasUnsavedChanges()) {
        // Sincronizar datos finales
        await syncScatData();
        
        // Guardar proyecto
        const saved = await saveProject(false);
        if (!saved) {
          throw new Error('No se pudieron guardar los cambios');
        }
      }
      
      // Limpiar contextos
      stopEditing();
      resetAllData();
      setEditingState(false, null);
      
      console.log('Edición finalizada exitosamente');
      return true;
    } catch (error) {
      console.error('Error finalizando edición:', error);
      return false;
    }
  }, [hasUnsavedChanges, syncScatData, saveProject, stopEditing, resetAllData, setEditingState]);

  // Guardar progreso actual
  const saveProgress = useCallback(async (silent = false) => {
    if (!isEditing || isLoadingRef.current) return false;
    
    try {
      // Sincronizar datos actuales
      await syncScatData();
      
      // Guardar
      return await saveProject(silent);
    } catch (error) {
      console.error('Error guardando progreso:', error);
      return false;
    }
  }, [isEditing, syncScatData, saveProject]);

  // Auto-sincronización periódica (reducida para evitar conflictos)
  useEffect(() => {
    if (isEditing && status !== EDITING_STATES.SAVING && !isLoadingRef.current) {
      const interval = setInterval(syncScatData, 10000); // Cada 10 segundos
      return () => clearInterval(interval);
    }
  }, [isEditing, status, syncScatData, EDITING_STATES.SAVING]);

  // Verificar cambios antes de salir
  const canExit = useCallback(() => {
    if (!isEditing) return true;
    
    if (hasUnsavedChanges()) {
      return window.confirm(
        '¿Estás seguro de que quieres salir? Hay cambios sin guardar que se perderán.'
      );
    }
    
    return true;
  }, [isEditing, hasUnsavedChanges]);

  return {
    // Estado
    isEditing,
    projectId,
    projectData,
    status,
    error,
    hasUnsavedChanges: hasUnsavedChanges(),
    
    // Funciones
    startProjectEditing,
    finishProjectEditing,
    saveProgress,
    syncScatData,
    canExit,
    
    // Estados
    EDITING_STATES,
    
    // Helpers
    isLoading: status === EDITING_STATES.LOADING || isLoadingRef.current,
    isSaving: status === EDITING_STATES.SAVING,
    isSaved: status === EDITING_STATES.SAVED,
    hasError: status === EDITING_STATES.ERROR
  };
}