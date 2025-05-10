import { useState, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';

// Define the PolicyType enum or type
type PolicyType = string; // Replace with actual type definition if available

interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  policyTypes?: PolicyType[];
  insurers?: string[];
  clientIds?: string[];
  onlyActive: boolean;
}

interface UseFiltersReturn {
  filters: AnalyticsFilters;
  setDateRange: (start: Date, end: Date) => void;
  setPolicyTypes: (types: PolicyType[]) => void;
  setInsurers: (insurers: string[]) => void;
  setClientIds: (clientIds: string[]) => void;
  setOnlyActive: (onlyActive: boolean) => void;
  resetFilters: () => void;
}

export const useFilters = (): UseFiltersReturn => {
  // Filtros por defecto: último mes, todas las pólizas, solo activas
  const defaultFilters = useMemo(() => ({
    dateRange: {
      start: dayjs().subtract(30, 'day').toDate(),
      end: dayjs().toDate()
    },
    onlyActive: true
  }), []);
  
  const [filters, setFilters] = useState<AnalyticsFilters>(defaultFilters);
  
  // Función para establecer rango de fechas
  const setDateRange = useCallback((start: Date, end: Date) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  }, []);
  
  // Función para establecer tipos de póliza
  const setPolicyTypes = useCallback((types: PolicyType[]) => {
    setFilters(prev => ({
      ...prev,
      policyTypes: types.length > 0 ? types : undefined
    }));
  }, []);
  
  // Función para establecer aseguradoras
  const setInsurers = useCallback((insurers: string[]) => {
    setFilters(prev => ({
      ...prev,
      insurers: insurers.length > 0 ? insurers : undefined
    }));
  }, []);
  
  // Función para establecer clientes
  const setClientIds = useCallback((clientIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      clientIds: clientIds.length > 0 ? clientIds : undefined
    }));
  }, []);
  
  // Función para establecer solo activas
  const setOnlyActive = useCallback((onlyActive: boolean) => {
    setFilters(prev => ({
      ...prev,
      onlyActive
    }));
  }, []);
  
  // Función para resetear filtros
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);
  
  return {
    filters,
    setDateRange,
    setPolicyTypes,
    setInsurers,
    setClientIds,
    setOnlyActive,
    resetFilters
  };
};