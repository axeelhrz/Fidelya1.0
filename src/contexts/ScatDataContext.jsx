import { useReducer, useEffect, useRef } from 'react';
import { ACTIONS } from './useScatData';
import { ScatDataContext } from './ScatContext';

// Estado inicial
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
    medidasCorrectivas: '' // Nuevo campo para medidas correctivas
  },
  // Agregar estado para tracking de edición
  isEditing: false,
  editingProjectId: null
};

// Función para crear una copia profunda del estado inicial
const getCleanInitialState = () => {
  return JSON.parse(JSON.stringify(initialState));
};

// Reducer para manejar las acciones
function scatDataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PROJECT_DATA:
      return {
        ...state,
        projectData: { ...state.projectData, ...action.payload }
      };
    
    case ACTIONS.SET_EVALUACION_DATA:
      return {
        ...state,
        evaluacionData: { ...state.evaluacionData, ...action.payload }
      };
    
    case ACTIONS.SET_CONTACTO_DATA:
      return {
        ...state,
        contactoData: { ...state.contactoData, ...action.payload }
      };
    
    case ACTIONS.SET_CAUSAS_INMEDIATAS_DATA:
      return {
        ...state,
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
        ...state,
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
        ...state,
        necesidadesControlData: { ...state.necesidadesControlData, ...action.payload }
      };
    
    case ACTIONS.SET_EDITING_STATE:
      console.log(`=== CAMBIANDO ESTADO DE EDICIÓN: ${action.payload.isEditing ? 'EDITANDO' : 'NO EDITANDO'} ===`);
      if (action.payload.projectId) {
        console.log(`Proyecto ID: ${action.payload.projectId}`);
      }
      return {
        ...state,
        isEditing: action.payload.isEditing,
        editingProjectId: action.payload.projectId || null
      };
    
    case ACTIONS.LOAD_DATA:
      console.log('=== CARGANDO DATOS EN REDUCER ===');
      return action.payload;
    
    case ACTIONS.RESET_DATA:
      console.log('=== RESETEANDO TODOS LOS DATOS EN REDUCER ===');
      return getCleanInitialState();
    
    case ACTIONS.CLEAR_EDITING_DATA:
      console.log('=== LIMPIANDO DATOS DE EDICIÓN EN REDUCER ===');
      const cleanState = getCleanInitialState();
      return {
        ...cleanState,
        projectData: action.keepProjectData ? state.projectData : cleanState.projectData
      };
    
    default:
      return state;
  }
}

// Provider del contexto
export function ScatDataProvider({ children }) {
  const [state, dispatch] = useReducer(scatDataReducer, getCleanInitialState());
  const isInitialized = useRef(false);
  const skipLocalStorageLoad = useRef(false);

  // Cargar datos del localStorage al inicializar (SOLO UNA VEZ)
  useEffect(() => {
    if (!isInitialized.current && !skipLocalStorageLoad.current) {
      console.log('=== INICIALIZANDO CONTEXTO ===');
      const savedData = localStorage.getItem('scatData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          console.log('Datos encontrados en localStorage:', parsedData);
          // Solo cargar si no hay un proyecto específico siendo editado
          if (!parsedData.isEditing) {
            console.log('Cargando datos del localStorage...');
            dispatch({ type: ACTIONS.LOAD_DATA, payload: parsedData });
          } else {
            console.log('Datos en modo edición encontrados, ignorando...');
          }
        } catch (error) {
          console.error('Error loading saved data:', error);
        }
      }
      isInitialized.current = true;
    }
  }, []);

  // Guardar datos en localStorage cuando el estado cambie (pero no durante edición)
  useEffect(() => {
    if (isInitialized.current && !state.isEditing && !skipLocalStorageLoad.current) {
      console.log('=== GUARDANDO EN LOCALSTORAGE ===');
      console.log('Estado actual:', state);
      localStorage.setItem('scatData', JSON.stringify(state));
    }
  }, [state]);

  // Funciones para actualizar datos
  const setProjectData = (data) => {
    console.log('=== SET PROJECT DATA ===', data);
    dispatch({ type: ACTIONS.SET_PROJECT_DATA, payload: data });
  };

  const setEvaluacionData = (data) => {
    dispatch({ type: ACTIONS.SET_EVALUACION_DATA, payload: data });
  };

  const setContactoData = (data) => {
    dispatch({ type: ACTIONS.SET_CONTACTO_DATA, payload: data });
  };

  const setCausasInmediatasData = (section, data) => {
    dispatch({ 
      type: ACTIONS.SET_CAUSAS_INMEDIATAS_DATA, 
      section, 
      payload: data 
    });
  };

  const setCausasBasicasData = (section, data) => {
    dispatch({ 
      type: ACTIONS.SET_CAUSAS_BASICAS_DATA, 
      section, 
      payload: data 
    });
  };

  const setNecesidadesControlData = (data) => {
    dispatch({ type: ACTIONS.SET_NECESIDADES_CONTROL_DATA, payload: data });
  };

  const setEditingState = (isEditing, projectId = null) => {
    console.log(`=== SETTING EDITING STATE: ${isEditing} ===`);
    dispatch({ 
      type: ACTIONS.SET_EDITING_STATE, 
      payload: { isEditing, projectId } 
    });
  };

  const resetAllData = () => {
    console.log('=== RESET ALL DATA LLAMADO ===');
    // Evitar que se cargue del localStorage después del reset
    skipLocalStorageLoad.current = true;
    
    dispatch({ type: ACTIONS.RESET_DATA });
    
    // Limpiar localStorage completamente
    localStorage.removeItem('scatData');
    
    // Permitir localStorage después de un breve delay
    setTimeout(() => {
      skipLocalStorageLoad.current = false;
    }, 100);
  };

  const clearEditingData = (keepProjectData = false) => {
    console.log('=== CLEAR EDITING DATA LLAMADO ===');
    console.log(`Mantener datos del proyecto: ${keepProjectData}`);
    
    // Evitar que se cargue del localStorage después de limpiar
    skipLocalStorageLoad.current = true;
    
    dispatch({ type: ACTIONS.CLEAR_EDITING_DATA, keepProjectData });
    
    // Limpiar localStorage para evitar conflictos
    localStorage.removeItem('scatData');
    
    // Permitir localStorage después de un breve delay
    setTimeout(() => {
      skipLocalStorageLoad.current = false;
    }, 100);
  };

  // Función para cargar datos completos de un proyecto (para edición)
  const loadProjectForEditing = (projectData) => {
    console.log('=== LOAD PROJECT FOR EDITING ===');
    console.log('Datos del proyecto:', projectData);

    // Evitar interferencia del localStorage durante la carga
    skipLocalStorageLoad.current = true;

    // Marcar como modo edición PRIMERO
    setEditingState(true, projectData.id);

    // Cargar datos básicos del proyecto
    if (projectData.formData) {
      setProjectData(projectData.formData);
    }

    // Cargar datos SCAT si existen
    if (projectData.scatData) {
      if (projectData.scatData.evaluacion) {
        setEvaluacionData(projectData.scatData.evaluacion);
      }
      if (projectData.scatData.contacto) {
        setContactoData(projectData.scatData.contacto);
      }
      if (projectData.scatData.causasInmediatas) {
        if (projectData.scatData.causasInmediatas.actos) {
          setCausasInmediatasData('actos', projectData.scatData.causasInmediatas.actos);
        }
        if (projectData.scatData.causasInmediatas.condiciones) {
          setCausasInmediatasData('condiciones', projectData.scatData.causasInmediatas.condiciones);
        }
      }
      if (projectData.scatData.causasBasicas) {
        if (projectData.scatData.causasBasicas.personales) {
          setCausasBasicasData('personales', projectData.scatData.causasBasicas.personales);
        }
        if (projectData.scatData.causasBasicas.laborales) {
          setCausasBasicasData('laborales', projectData.scatData.causasBasicas.laborales);
        }
      }
      if (projectData.scatData.necesidadesControl) {
        setNecesidadesControlData(projectData.scatData.necesidadesControl);
      }
    }

    console.log('=== PROYECTO CARGADO PARA EDICIÓN ===');
  };

  // Función para obtener un resumen completo de los datos
  const getCompleteSummary = () => {
    return {
      project: state.projectData,
      evaluacion: state.evaluacionData,
      contacto: state.contactoData,
      causasInmediatas: state.causasInmediatasData,
      causasBasicas: state.causasBasicasData,
      necesidadesControl: state.necesidadesControlData
    };
  };

  // Función para verificar si hay datos guardados
  const hasData = () => {
    const { projectData, evaluacionData, contactoData, causasInmediatasData, causasBasicasData, necesidadesControlData } = state;
    
    return (
      Object.values(projectData).some(value => value && value.trim() !== '') ||
      Object.values(evaluacionData).some(value => value !== null) ||
      contactoData.selectedIncidents.length > 0 ||
      causasInmediatasData.actos.selectedItems.length > 0 ||
      causasInmediatasData.condiciones.selectedItems.length > 0 ||
      causasBasicasData.personales.selectedItems.length > 0 ||
      causasBasicasData.laborales.selectedItems.length > 0 ||
      necesidadesControlData.selectedItems.length > 0
    );
  };

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
    clearEditingData,
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