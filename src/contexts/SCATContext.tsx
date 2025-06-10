'use client';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos de datos actualizados
export interface Project {
  id: string;
  name: string;
  event: string;
  involved: string;
  area: string;
  dateTime: string;
  investigator: string;
  otherData: string;
  status: 'active' | 'in-progress' | 'pending' | 'completed' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
  scatProgress: {
    ci: { [key: string]: boolean };
    cb: { [key: string]: boolean };
    nac: { [key: string]: boolean };
  };
  validations: {
    [key: string]: {
      selected: boolean;
      observation: string;
      attachments: string[];
      P?: boolean | null; // Solo para NAC
      E?: boolean | null; // Solo para NAC
      C?: boolean | null; // Solo para NAC
      completedAt?: Date;
    };
  };
  formProgress?: {
    currentSection: 'ci' | 'cb' | 'nac';
    currentCause: number;
    lastSaved: Date;
  };
}

export interface SCATState {
  currentProject: Project | null;
  projects: Project[];
  currentSection: 'ci' | 'cb' | 'nac';
  currentCause: number | null;
  searchQuery: string;
  filterStatus: 'all' | 'completed' | 'incomplete' | 'pending';
  isLoading: boolean;
  sidebarOpen: boolean;
  formMode: 'wizard' | 'traditional';
}

// Acciones actualizadas
type SCATAction =
  | { type: 'SET_CURRENT_PROJECT'; payload: Project }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Partial<Project> & { id: string } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'RESTORE_PROJECT'; payload: string }
  | { type: 'SET_CURRENT_SECTION'; payload: 'ci' | 'cb' | 'nac' }
  | { type: 'SET_CURRENT_CAUSE'; payload: number }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTER_STATUS'; payload: 'all' | 'completed' | 'incomplete' | 'pending' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_FORM_MODE'; payload: 'wizard' | 'traditional' }
  | { type: 'UPDATE_VALIDATION'; payload: { causeId: string; validation: any } }
  | { type: 'UPDATE_FORM_PROGRESS'; payload: { section: 'ci' | 'cb' | 'nac'; cause: number } }
  | { type: 'MARK_CAUSE_COMPLETE'; payload: { section: 'ci' | 'cb' | 'nac'; causeId: string } };

// Estado inicial actualizado
const initialState: SCATState = {
  currentProject: null,
  projects: [],
  currentSection: 'ci',
  currentCause: null,
  searchQuery: '',
  filterStatus: 'all',
  isLoading: false,
  sidebarOpen: false,
  formMode: 'wizard',
};

// Reducer actualizado
function scatReducer(state: SCATState, action: SCATAction): SCATState {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    
    case 'ADD_PROJECT':
      return { 
        ...state, 
        projects: [...state.projects, action.payload],
        currentProject: action.payload
      };
    
    case 'UPDATE_PROJECT':
      const updatedProjects = state.projects.map(project =>
        project.id === action.payload.id 
          ? { ...project, ...action.payload, updatedAt: new Date() }
          : project
      );
      return {
        ...state,
        projects: updatedProjects,
        currentProject: state.currentProject?.id === action.payload.id 
          ? { ...state.currentProject, ...action.payload, updatedAt: new Date() }
          : state.currentProject
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload 
            ? { ...project, status: 'deleted' as const }
            : project
        )
      };
    
    case 'RESTORE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload 
            ? { ...project, status: 'active' as const }
            : project
        )
      };
    
    case 'SET_CURRENT_SECTION':
      return { ...state, currentSection: action.payload };
    
    case 'SET_CURRENT_CAUSE':
      return { ...state, currentCause: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'SET_FORM_MODE':
      return { ...state, formMode: action.payload };
    
    case 'UPDATE_VALIDATION':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          validations: {
            ...state.currentProject.validations,
            [action.payload.causeId]: {
              ...state.currentProject.validations[action.payload.causeId],
              ...action.payload.validation
            }
          }
        }
      };
    
    case 'UPDATE_FORM_PROGRESS':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          formProgress: {
            currentSection: action.payload.section,
            currentCause: action.payload.cause,
            lastSaved: new Date()
          }
        }
      };
    
    case 'MARK_CAUSE_COMPLETE':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          scatProgress: {
            ...state.currentProject.scatProgress,
            [action.payload.section]: {
              ...state.currentProject.scatProgress[action.payload.section],
              [action.payload.causeId]: true
            }
          }
        }
      };
    
    default:
      return state;
  }
}

// Context
const SCATContext = createContext<{
  state: SCATState;
  dispatch: React.Dispatch<SCATAction>;
} | null>(null);

// Provider
export function SCATProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scatReducer, initialState);

  return (
    <SCATContext.Provider value={{ state, dispatch }}>
      {children}
    </SCATContext.Provider>
  );
}

// Hook personalizado
export function useSCAT() {
  const context = useContext(SCATContext);
  if (!context) {
    throw new Error('useSCAT must be used within a SCATProvider');
  }
  return context;
}

// Utilidades actualizadas
export function generateProjectId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function calculateProgress(project: Project): {
  ci: number;
  cb: number;
  nac: number;
  total: number;
} {
  const ciCompleted = Object.values(project.scatProgress.ci).filter(Boolean).length;
  const cbCompleted = Object.values(project.scatProgress.cb).filter(Boolean).length;
  const nacCompleted = Object.values(project.scatProgress.nac).filter(Boolean).length;
  
  const ciTotal = 7;
  const cbTotal = 15;
  const nacTotal = 20;
  const totalCompleted = ciCompleted + cbCompleted + nacCompleted;
  const totalCauses = ciTotal + cbTotal + nacTotal;
  
  return {
    ci: Math.round((ciCompleted / ciTotal) * 100),
    cb: Math.round((cbCompleted / cbTotal) * 100),
    nac: Math.round((nacCompleted / nacTotal) * 100),
    total: Math.round((totalCompleted / totalCauses) * 100)
  };
}

export function isProjectComplete(project: Project): boolean {
  const progress = calculateProgress(project);
  return progress.total === 100;
}

export function getProjectStatusText(project: Project): string {
  const progress = calculateProgress(project);
  
  if (progress.total === 100) return 'Completado';
  if (progress.total > 0) return 'En progreso';
  return 'Pendiente';
}