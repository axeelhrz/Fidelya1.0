import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor for token
  useEffect(() => {
    const token = state.token || localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Check if user is authenticated on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/auth/me');
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: response.data.user, token },
          });
        } catch (error) {
          localStorage.removeItem('token');
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await axios.post('/auth/register', { email, password, name });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};