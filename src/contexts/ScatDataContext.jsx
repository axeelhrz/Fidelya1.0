import { useReducer, useEffect, useRef, useCallback } from 'react';
import { ACTIONS } from './useScatData';
import { ScatDataContext } from './ScatContext';

// Estado inicial limpio
const initialState = {
  projectData: {
    evento: '',
    involucrado: '',
    area: '',
    fechaHora: '',
    investigador: '',
    otrosDatos: ''
  },
  evaluacionData: {
    severity: null,
    probability: null,
    frequency: null
  },
  contactoData: {
    selectedIncidents: [],
    image: null,
    observation: ''
  },
  causasInmediatasData: {
    actos: {
      selectedItems: [],
      image: null,
      observation: ''
    },
    condiciones: {
      selectedItems: [],
      image: null,
      observation: ''
    }
  },
  causasBasicasData: {
    personales: {
      selectedItems: [],
      detailedSelections: {},
      image: null,
      observation: ''
    },
    laborales: {
      selectedItems: [],
      detailedSelections: {},
      image: null,
      observation: ''
    }
  },
  necesidadesControlData: {
    selectedItems: [],
    detailedData: {},
    globalImage: null,
    globalObservation: '',
    medidasCorrectivas: ''
  },
  // Estado de edición simplificado
  isEditing: false,
  editingProjectId: null,
  // Metadatos
  lastModified: null,
  dataVersion: 1
};

// Función para crear copia profunda
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Función para obtener estado inicial limpio
const getCleanInitialState = () => deepClone(initialState);

// Reducer optimizado
function scatDataReducer(state, action) {
  const newState = { ...state, lastModified: new Date().toISOString() };
  
  switch (action.type) {
    case ACTIONS.SET_PROJECT_DATA:
      return {
        ...newState,
        projectData: { ...state.projectData, ...action.payload }
      };
    
    case ACTIONS.SET_EVALUACION_DATA:
      return {
        ...newState,
        evaluacionData: { ...state.evaluacionData, ...action.payload }
      };
    
    case ACTIONS.SET_CONTACTO_DATA:
      return {
        ...newState,
        contactoData: { ...state.contactoData, ...action.payload }
      };
    
    case ACTIONS.SET_CAUSAS_INMEDIATAS_DATA:
      return {
        ...newState,
        causasInmediatasData: {
          ...state.causasInmediatasData,
          [action.section]: {
            ...state.causasInmediatasData[action.section],
            ...action.payload
          }
        }
      };
    
    case ACTIONS.SET_CAUSAS_BASICAS_DATA:
      return {
        ...newState,
        causasBasicasData: {
          ...state.causasBasicasData,
          [action.section]: {
            ...state.causasBasicasData[action.section],
            ...action.payload
          }
        }
      };
    
    case ACTIONS.SET_NECESIDADES_CONTROL_DATA:
      return {
        ...newState,
        necesidadesControlData: { ...state.necesidadesControlData, ...action.payload }
      };
    
    case ACTIONS.SET_EDITING_STATE:
      return {
        ...state, // No actualizar lastModified para cambios de estado
        isEditing: action.payload.isEditing,
        editingProjectId: action.payload.projectId || null
      };
    
    case ACTIONS.LOAD_DATA:
      return {
        ...action.payload,
        dataVersion: (action.payload.dataVersion || 0) + 1,
        lastModified: new Date().toISOString()
      };
    
    case ACTIONS.RESET_DATA:
      return getCleanInitialState();
    
    case ACTIONS.CLEAR_EDITING_DATA:
      const cleanState = getCleanInitialState();
      return {
        ...cleanState,
        projectData: action.keepProjectData ? state.projectData : cleanState.projectData
      };
    
    default:
      return state;
  }
}

// Provider principal
export function ScatDataProvider({ children }) {
  const [state, dispatch] = useReducer(scatDataReducer, getCleanInitialState());
  const isInitializedRef = useRef(false);
  const skipLocalStorageRef = useRef(false);
  const lastSavedStateRef = useRef(null);

  // Inicialización única
  useEffect(() => {
    if (!isInitializedRef.current) {
      console.log('=== INICIALIZANDO SCAT DATA CONTEXT ===');
      
      // Solo cargar datos temporales si no estamos en modo edición
      const savedData = localStorage.getItem('scatData');
      if (savedData && !skipLocalStorageRef.current) {
        try {
          const parsedData = JSON.parse(savedData);
          if (!parsedData.isEditing) {
            console.log('Cargando datos temporales del localStorage');
            dispatch({ type: ACTIONS.LOAD_DATA, payload: parsedData });
          }
        } catch (error) {
          console.error('Error cargando datos temporales:', error);
        }
      }
      
      isInitializedRef.current = true;
    }
  }, []);

  // Auto-guardado para proyectos nuevos (no en edición)
  useEffect(() => {
    if (isInitializedRef.current && !state.isEditing && !skipLocalStorageRef.current) {
      const currentStateString = JSON.stringify(state);
      
      // Solo guardar si el estado ha cambiado realmente
      if (lastSavedStateRef.current !== currentStateString) {
        console.log('Auto-guardando datos temporales');
        localStorage.setItem('scatData', currentStateString);
        lastSavedStateRef.current = currentStateString;
      }
    }
  }, [state, isInitializedRef.current]);

  // Funciones de actualización optimizadas
  const setProjectData = useCallback((data) => {
    dispatch({ type: ACTIONS.SET_PROJECT_DATA, payload: data });
  }, []);

  const setEvaluacionData = useCallback((data) => {
    dispatch({ type: ACTIONS.SET_EVALUACION_DATA, payload: data });
  }, []);

  const setContactoData = useCallback((data) => {
    dispatch({ type: ACTIONS.SET_CONTACTO_DATA, payload: data });
  }, []);

  const setCausasInmediatasData = useCallback((section, data) => {
    dispatch({ 
      type: ACTIONS.SET_CAUSAS_INMEDIATAS_DATA, 
      section, 
      payload: data 
    });
  }, []);

  const setCausasBasicasData = useCallback((section, data) => {
    dispatch({ 
      type: ACTIONS.SET_CAUSAS_BASICAS_DATA, 
      section, 
      payload: data 
    });
  }, []);

  const setNecesidadesControlData = useCallback((data) => {
    dispatch({ type: ACTIONS.SET_NECESIDADES_CONTROL_DATA, payload: data });
  }, []);

  const setEditingState = useCallback((isEditing, projectId = null) => {
    console.log(`=== CAMBIANDO ESTADO DE EDICIÓN: ${isEditing ? 'EDITANDO' : 'NO EDITANDO'} ===`);
    dispatch({ 
      type: ACTIONS.SET_EDITING_STATE, 
      payload: { isEditing, projectId } 
    });
  }, []);

  // Reset completo
  const resetAllData = useCallback(() => {
    console.log('=== RESET COMPLETO DE DATOS ===');
    skipLocalStorageRef.current = true;
    
    dispatch({ type: ACTIONS.RESET_DATA });
    
    // Limpiar localStorage
    localStorage.removeItem('scatData');
    lastSavedStateRef.current = null;
    
    // Permitir localStorage después de un delay
    setTimeout(() => {
      skipLocalStorageRef.current = false;
    }, 100);
  }, []);

  // Cargar proyecto para edición (versión mejorada)
  const loadProjectForEditing = useCallback(async (projectData) => {
    console.log('=== CARGANDO PROYECTO PARA EDICIÓN ===');
    console.log('Datos del proyecto:', projectData);

    try {
      // Prevenir interferencia del localStorage
      skipLocalStorageRef.current = true;

      // Construir estado completo
      const completeState = {
        projectData: projectData.formData || initialState.projectData,
        evaluacionData: projectData.scatData?.evaluacion || initialState.evaluacionData,
        contactoData: projectData.scatData?.contacto || initialState.contactoData,
        causasInmediatasData: projectData.scatData?.causasInmediatas || initialState.causasInmediatasData,
        causasBasicasData: projectData.scatData?.causasBasicas || initialState.causasBasicasData,
        necesidadesControlData: projectData.scatData?.necesidadesControl || initialState.necesidadesControlData,
        isEditing: true,
        editingProjectId: projectData.id,
        lastModified: projectData.lastModified || new Date().toISOString(),
        dataVersion: (projectData.version || 1)
      };

      // Cargar estado completo
      dispatch({ type: ACTIONS.LOAD_DATA, payload: completeState });
      
      console.log('=== PROYECTO CARGADO EXITOSAMENTE ===');
      
      // Permitir localStorage después de un delay
      setTimeout(() => {
        skipLocalStorageRef.current = false;
      }, 500);
      
      return true;
    } catch (error) {
      console.error('Error cargando proyecto para edición:', error);
      skipLocalStorageRef.current = false;
      return false;
    }
  }, []);

  // Obtener resumen completo
  const getCompleteSummary = useCallback(() => {
    return {
      project: state.projectData,
      evaluacion: state.evaluacionData,
      contacto: state.contactoData,
      causasInmediatas: state.causasInmediatasData,
      causasBasicas: state.causasBasicasData,
      necesidadesControl: state.necesidadesControlData,
      metadata: {
        lastModified: state.lastModified,
        dataVersion: state.dataVersion,
        isEditing: state.isEditing,
        editingProjectId: state.editingProjectId
      }
    };
  }, [state]);

  // Verificar si hay datos
  const hasData = useCallback(() => {
    const { projectData, evaluacionData, contactoData, causasInmediatasData, causasBasicasData, necesidadesControlData } = state;
    
    return (
      Object.values(projectData).some(value => value && value.toString().trim() !== '') ||
      Object.values(evaluacionData).some(value => value !== null && value !== undefined) ||
      contactoData.selectedIncidents.length > 0 ||
      contactoData.observation?.trim() ||
      contactoData.image ||
      causasInmediatasData.actos.selectedItems.length > 0 ||
      causasInmediatasData.condiciones.selectedItems.length > 0 ||
      causasInmediatasData.actos.observation?.trim() ||
      causasInmediatasData.condiciones.observation?.trim() ||
      causasInmediatasData.actos.image ||
      causasInmediatasData.condiciones.image ||
      causasBasicasData.personales.selectedItems.length > 0 ||
      causasBasicasData.laborales.selectedItems.length > 0 ||
      causasBasicasData.personales.observation?.trim() ||
      causasBasicasData.laborales.observation?.trim() ||
      causasBasicasData.personales.image ||
      causasBasicasData.laborales.image ||
      necesidadesControlData.selectedItems.length > 0 ||
      necesidadesControlData.globalObservation?.trim() ||
      necesidadesControlData.globalImage ||
      necesidadesControlData.medidasCorrectivas?.trim()
    );
  }, [state]);

  // Valor del contexto
  const value = {
    // Estado
    ...state,
    
    // Funciones de actualización
    setProjectData,
    setEvaluacionData,
    setContactoData,
    setCausasInmediatasData,
    setCausasBasicasData,
    setNecesidadesControlData,
    setEditingState,
    resetAllData,
    loadProjectForEditing,
    
    // Funciones de utilidad
    getCompleteSummary,
    hasData
  };

  return (
    <ScatDataContext.Provider value={value}>
      {children}
    </ScatDataContext.Provider>
  );
}