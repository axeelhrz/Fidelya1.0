import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/authService';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory debe ser usado dentro de un InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
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

  // Función para actualizar todos los datos del dashboard
  const refreshDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsUpdating(true);
      }

      console.log('🔄 Actualizando datos del dashboard...');
      
      // Cargar todos los datos en paralelo
      const [
        resumen,
        stockBajo,
        comprasRecientes,
        ventasMensuales,
        stockDistribucion,
        ultimosMovimientos
      ] = await Promise.all([
        authService.getDashboardResumen(),
        authService.getStockBajo(),
        authService.getComprasRecientes(),
        authService.getVentasMensuales(),
        authService.getStockDistribucion(),
        authService.getUltimosMovimientos()
      ]);

      const newData = {
        resumen,
        stockBajo,
        comprasRecientes,
        ventasMensuales,
        stockDistribucion,
        ultimosMovimientos
      };

      setDashboardData(newData);
      setLastUpdate(new Date());
      
      console.log('✅ Datos del dashboard actualizados');
      return newData;
    } catch (error) {
      console.error('❌ Error actualizando dashboard:', error);
      throw error;
    } finally {
      if (showLoading) {
        setIsUpdating(false);
      }
    }
  }, []);

  // Función para notificar cambios en el inventario
  const notifyInventoryChange = useCallback((changeType, productData = null) => {
    console.log('📦 Cambio en inventario detectado:', changeType, productData);
    
    // Incrementar trigger para forzar actualización
    setUpdateTrigger(prev => prev + 1);
    
    // Actualizar datos después de un breve delay para permitir que el backend procese
    setTimeout(() => {
      refreshDashboardData(false);
    }, 500);
  }, [refreshDashboardData]);

  // Función para obtener datos específicos
  const getSpecificData = useCallback(async (dataType) => {
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
      throw error;
    }
  }, []);

  // Polling automático cada 30 segundos como respaldo
  useEffect(() => {
    const interval = setInterval(() => {
      refreshDashboardData(false);
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [refreshDashboardData]);

  const value = {
    dashboardData,
    isUpdating,
    lastUpdate,
    updateTrigger,
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