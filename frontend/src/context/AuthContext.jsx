import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = authService.getToken();
      
      if (token) {
        // Verificar si el token no ha expirado localmente
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp > currentTime) {
            // Token válido localmente, verificar con el servidor
            const response = await authService.verifyToken(token);
      
            if (response.valid && response.user) {
              setUser(response.user);
              setIsAuthenticated(true);
            } else {
              // Token inválido en el servidor
              await logout();
            }
          } else {
            // Token expirado localmente
            console.log('Token expirado localmente');
            await logout();
          }
        } catch (decodeError) {
          // Error decodificando token
          console.error('Error decodificando token:', decodeError);
          await logout();
        }
      } else {
        // No hay token
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Validar credenciales
      if (!credentials.correo || !credentials.contraseña) {
        return { 
          success: false, 
          message: 'Correo y contraseña son requeridos' 
        };
      }

      const response = await authService.login(credentials.correo, credentials.contraseña);
      
      if (response.token && response.user) {
        // Guardar token
        const tokenSaved = authService.setToken(response.token);
        
        if (tokenSaved) {
          setUser(response.user);
          setIsAuthenticated(true);
          
          return { 
            success: true, 
            user: response.user,
            message: response.message || 'Inicio de sesión exitoso'
};
        } else {
          return { 
            success: false, 
            message: 'Error guardando sesión' 
          };
        }
      } else {
        return { 
          success: false, 
          message: 'Respuesta del servidor inválida' 
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Validar datos
      if (!userData.nombre || !userData.correo || !userData.contraseña) {
        return { 
          success: false, 
          message: 'Todos los campos son requeridos' 
        };
      }

      const response = await authService.register(
        userData.nombre, 
        userData.correo, 
        userData.contraseña
      );
      
      return { 
        success: true, 
        message: response.message || 'Usuario registrado exitosamente' 
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: error.message || 'Error al registrar usuario' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Limpiar estado local
      setUser(null);
      setIsAuthenticated(false);
      
      // Limpiar localStorage
      authService.logout();
      
      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    checkAuthStatus,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};