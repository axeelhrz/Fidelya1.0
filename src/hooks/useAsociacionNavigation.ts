'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AsociacionTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  component: React.ComponentType<any>;
  description?: string;
  color: string;
  badge?: number;
  isNew?: boolean;
}

export interface UseAsociacionNavigationReturn {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: AsociacionTab[];
  getActiveTabData: () => AsociacionTab | undefined;
  isTabActive: (tabId: string) => boolean;
  navigateToTab: (tabId: string) => void;
}

export const useAsociacionNavigation = (): UseAsociacionNavigationReturn => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determinar la pestaña activa basada en la URL
  const getActiveTabFromPath = useCallback((path: string): string => {
    if (path.includes('/socios')) return 'socios';
    if (path.includes('/comercios')) return 'comercios';
    if (path.includes('/beneficios')) return 'beneficios';
    if (path.includes('/analytics')) return 'analytics';
    if (path.includes('/notificaciones')) return 'notificaciones';
    return 'dashboard';
  }, []);

  const [activeTab, setActiveTabState] = useState<string>(() => 
    getActiveTabFromPath(pathname)
  );

  // Definir las pestañas disponibles (se actualizará dinámicamente)
  const tabs = useMemo<AsociacionTab[]>(() => [], []);

  // Función para cambiar de pestaña
  const setActiveTab = useCallback((tabId: string) => {
    setActiveTabState(tabId);
  }, []);

  // Función para navegar a una pestaña específica
  const navigateToTab = useCallback((tabId: string) => {
    const routes: Record<string, string> = {
      'dashboard': '/dashboard/asociacion',
      'socios': '/dashboard/asociacion/socios',
      'comercios': '/dashboard/asociacion/comercios',
      'beneficios': '/dashboard/asociacion/beneficios',
      'analytics': '/dashboard/asociacion/analytics',
      'notificaciones': '/dashboard/asociacion/notificaciones'
    };

    const route = routes[tabId];
    if (route) {
      // Solo navegar si es diferente a la ruta actual
      if (pathname !== route) {
        router.push(route);
      }
      setActiveTab(tabId);
    }
  }, [router, pathname, setActiveTab]);

  // Obtener datos de la pestaña activa
  const getActiveTabData = useCallback(() => {
    return tabs.find(tab => tab.id === activeTab);
  }, [tabs, activeTab]);

  // Verificar si una pestaña está activa
  const isTabActive = useCallback((tabId: string) => {
    return activeTab === tabId;
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    tabs,
    getActiveTabData,
    isTabActive,
    navigateToTab
  };
};
