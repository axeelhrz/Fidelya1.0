import { createContext, useContext, useReducer, useEffect } from 'react';

const ScatDataContext = createContext();

// Tipos de acciones para el reducer
const ACTIONS = {
  SET_PROJECT_DATA: 'SET_PROJECT_DATA',
  SET_EVALUACION_DATA: 'SET_EVALUACION_DATA',
  SET_CONTACTO_DATA: 'SET_CONTACTO_DATA',
  SET_CAUSAS_INMEDIATAS_DATA: 'SET_CAUSAS_INMEDIATAS_DATA',
  SET_CAUSAS_BASICAS_DATA: 'SET_CAUSAS_BASICAS_DATA',
  SET_NECESIDADES_CONTROL_DATA: 'SET_NECESIDADES_CONTROL_DATA',
  LOAD_DATA: 'LOAD_DATA',
  RESET_DATA: 'RESET_DATA'
};

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
  }
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
    
    case ACTIONS.LOAD_DATA:
      return action.payload;
    
    case ACTIONS.RESET_DATA:
      return initialState;
    
    default:
      return state;
  }
}

// Provider del contexto
export function ScatDataProvider({ children }) {
  const [state, dispatch] = useReducer(scatDataReducer, initialState);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    const savedData = localStorage.getItem('scatData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: ACTIONS.LOAD_DATA, payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Guardar datos en localStorage cuando el estado cambie
  useEffect(() => {
    localStorage.setItem('scatData', JSON.stringify(state));
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

  const resetAllData = () => {
    dispatch({ type: ACTIONS.RESET_DATA });
    localStorage.removeItem('scatData');
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
    resetAllData,
    
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

// Hook personalizado para usar el contexto
export function useScatData() {
  const context = useContext(ScatDataContext);
  if (!context) {
    throw new Error('useScatData must be used within a ScatDataProvider');
  }
  return context;
}

export { ACTIONS };
