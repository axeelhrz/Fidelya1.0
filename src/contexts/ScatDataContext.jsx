import { useReducer, useEffect } from 'react';
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
    globalObservation: ''
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
      return {
        ...state,
        isEditing: action.payload.isEditing,
        editingProjectId: action.payload.projectId || null
      };
    
    case ACTIONS.LOAD_DATA:
      return action.payload;
    
    case ACTIONS.RESET_DATA:
      console.log('=== RESETEANDO TODOS LOS DATOS ===');
      return getCleanInitialState();
    
    case ACTIONS.CLEAR_EDITING_DATA:
      return {
        ...getCleanInitialState(),
        // Mantener solo los datos básicos si no estamos editando
        projectData: action.keepProjectData ? state.projectData : getCleanInitialState().projectData
      };
    
    default:
      return state;
  }
}

// Provider del contexto
export function ScatDataProvider({ children }) {
  const [state, dispatch] = useReducer(scatDataReducer, getCleanInitialState());

  // Cargar datos del localStorage al inicializar (solo si no estamos editando)
  useEffect(() => {
    const savedData = localStorage.getItem('scatData');
    if (savedData && !state.isEditing) {
      try {
        const parsedData = JSON.parse(savedData);
        // Solo cargar si no hay un proyecto específico siendo editado
        if (!parsedData.isEditing) {
          dispatch({ type: ACTIONS.LOAD_DATA, payload: parsedData });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage cuando el estado cambie (pero no durante edición)
  useEffect(() => {
    // Solo guardar en localStorage si no estamos editando un proyecto específico
    if (!state.isEditing) {
      localStorage.setItem('scatData', JSON.stringify(state));
    }
  }, [state]);

  // Funciones para actualizar datos
  const setProjectData = (data) => {
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
    dispatch({ 
      type: ACTIONS.SET_EDITING_STATE, 
      payload: { isEditing, projectId } 
    });
  };

  const resetAllData = () => {
    console.log('=== LIMPIANDO TODOS LOS DATOS DEL CONTEXTO ===');
    dispatch({ type: ACTIONS.RESET_DATA });
    // Limpiar localStorage completamente
    localStorage.removeItem('scatData');
  };

  const clearEditingData = (keepProjectData = false) => {
    dispatch({ type: ACTIONS.CLEAR_EDITING_DATA, keepProjectData });
    // Limpiar localStorage para evitar conflictos
    localStorage.removeItem('scatData');
  };

  // Función para cargar datos completos de un proyecto (para edición)
  const loadProjectForEditing = (projectData) => {
    console.log('=== CARGANDO PROYECTO PARA EDICIÓN ===');
    console.log('Datos del proyecto:', projectData);

    // Marcar como modo edición
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