import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';
import { useAuth } from './AuthContext';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory debe ser usado dentro de un InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    resumen: null,
    stockBajo: null,
    comprasRecientes: null,
    ventasMensuales: null,
    stockDistribucion: null,
    ultimosMovimientos: null
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [connectionError, setConnectionError] = useState(false);

  // Función para actualizar todos los datos del dashboard
  const refreshDashboardData = useCallback(async (showLoading = true) => {
    // No hacer peticiones si no está autenticado
    if (!isAuthenticated) {
      console.log('⚠️ Usuario no autenticado, omitiendo actualización de dashboard');
      return null;
    }

    try {
      if (showLoading) {
        setIsUpdating(true);
      }

      console.log('🔄 Actualizando datos del dashboard...');
      
      // Cargar todos los datos en paralelo con manejo de errores individual
      const results = await Promise.allSettled([
        authService.getDashboardResumen(),
        authService.getStockBajo(),
        authService.getComprasRecientes(),
        authService.getVentasMensuales(),
        authService.getStockDistribucion(),
        authService.getUltimosMovimientos()
      ]);

      // Procesar resultados y manejar errores individuales
      const [
        resumenResult,
        stockBajoResult,
        comprasRecientesResult,
        ventasMensualesResult,
        stockDistribucionResult,
        ultimosMovimientosResult
      ] = results;

      const newData = {
        resumen: resumenResult.status === 'fulfilled' ? resumenResult.value : null,
        stockBajo: stockBajoResult.status === 'fulfilled' ? stockBajoResult.value : [],
        comprasRecientes: comprasRecientesResult.status === 'fulfilled' ? comprasRecientesResult.value : [],
        ventasMensuales: ventasMensualesResult.status === 'fulfilled' ? ventasMensualesResult.value : [],
        stockDistribucion: stockDistribucionResult.status === 'fulfilled' ? stockDistribucionResult.value : { frutas: 0, verduras: 0, otros: 0 },
        ultimosMovimientos: ultimosMovimientosResult.status === 'fulfilled' ? ultimosMovimientosResult.value : []
      };

      setDashboardData(newData);
      setLastUpdate(new Date());
      setConnectionError(false);
      
      console.log('✅ Datos del dashboard actualizados');
      return newData;
    } catch (error) {
      console.error('❌ Error actualizando dashboard:', error);
      setConnectionError(true);
      
      // No lanzar el error, solo registrarlo
      return null;
    } finally {
      if (showLoading) {
        setIsUpdating(false);
      }
    }
  }, [isAuthenticated]);

  // Función para notificar cambios en el inventario
  const notifyInventoryChange = useCallback((changeType, productData = null) => {
    console.log('📦 Cambio en inventario detectado:', changeType, productData);
    
    // Solo actualizar si está autenticado
    if (!isAuthenticated) {
      return;
    }
    
    // Incrementar trigger para forzar actualización
    setUpdateTrigger(prev => prev + 1);
    
    // Actualizar datos después de un breve delay para permitir que el backend procese
    setTimeout(() => {
      refreshDashboardData(false).catch(error => {
        console.error('Error en actualización automática:', error);
      });
    }, 500);
  }, [refreshDashboardData, isAuthenticated]);

  // Función para obtener datos específicos
  const getSpecificData = useCallback(async (dataType) => {
    if (!isAuthenticated) {
      console.log('⚠️ Usuario no autenticado, no se pueden obtener datos específicos');
      return null;
    }

    try {
      switch (dataType) {
        case 'resumen':
          return await authService.getDashboardResumen();
        case 'stockBajo':
          return await authService.getStockBajo();
        case 'comprasRecientes':
          return await authService.getComprasRecientes();
        case 'ventasMensuales':
          return await authService.getVentasMensuales();
        case 'stockDistribucion':
          return await authService.getStockDistribucion();
        case 'ultimosMovimientos':
          return await authService.getUltimosMovimientos();
        default:
          throw new Error(`Tipo de dato no válido: ${dataType}`);
      }
    } catch (error) {
      console.error(`Error obteniendo ${dataType}:`, error);
      // Retornar datos por defecto en lugar de lanzar error
      switch (dataType) {
        case 'stockBajo':
        case 'comprasRecientes':
        case 'ventasMensuales':
        case 'ultimosMovimientos':
          return [];
        case 'stockDistribucion':
          return { frutas: 0, verduras: 0, otros: 0 };
        case 'resumen':
          return null;
        default:
          return null;
      }
    }
  }, [isAuthenticated]);

  // Polling automático cada 30 segundos como respaldo (solo si está autenticado y no hay error de conexión)
  useEffect(() => {
    if (!isAuthenticated || connectionError) {
      return; // No hacer polling si no está autenticado o hay error de conexión
    }

    const interval = setInterval(() => {
      refreshDashboardData(false).catch(error => {
        console.error('Error en polling automático:', error);
      });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [refreshDashboardData, connectionError, isAuthenticated]);

  // Limpiar datos cuando el usuario no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      setDashboardData({
        resumen: null,
        stockBajo: null,
        comprasRecientes: null,
        ventasMensuales: null,
        stockDistribucion: null,
        ultimosMovimientos: null
      });
      setConnectionError(false);
      setLastUpdate(null);
    }
  }, [isAuthenticated]);

  const value = {
    dashboardData,
    isUpdating,
    lastUpdate,
    updateTrigger,
    connectionError,
    refreshDashboardData,
    notifyInventoryChange,
    getSpecificData
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryContext;