'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface UseSidebarNavigationOptions {
  autoCloseOnMobile?: boolean;
  persistState?: boolean;
}

export const useSidebarNavigation = (options: UseSidebarNavigationOptions = {}) => {
  const { autoCloseOnMobile = true, persistState = true } = options;
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Estado persistente del sidebar
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    if (persistState) {
      const saved = localStorage.getItem('sidebar-open');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    }
    
    // Default: abierto en desktop, cerrado en mobile
    return window.innerWidth >= 1024;
  });

  const [isMobile, setIsMobile] = useState(false);
  const lastPathnameRef = useRef(pathname);

  // Detectar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-ajustar sidebar según el tamaño de pantalla
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      } else if (mobile && sidebarOpen && autoCloseOnMobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen, autoCloseOnMobile]);

  // Persistir estado del sidebar
  useEffect(() => {
    if (persistState && typeof window !== 'undefined') {
      localStorage.setItem('sidebar-open', JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, persistState]);

  // Toggle del sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Navegación optimizada
  const navigateTo = useCallback((route: string, section?: string) => {
    // Solo navegar si la ruta es diferente
    if (pathname !== route) {
      router.push(route);
    }
    
    // Auto-cerrar en mobile después de navegación
    if (isMobile && autoCloseOnMobile) {
      setSidebarOpen(false);
    }
    
    lastPathnameRef.current = route;
  }, [router, pathname, isMobile, autoCloseOnMobile]);

  // Verificar si una ruta está activa
  const isActiveRoute = useCallback((route: string) => {
    return pathname === route;
  }, [pathname]);

  // Cerrar sidebar en mobile al cambiar de ruta
  useEffect(() => {
    if (pathname !== lastPathnameRef.current && isMobile && autoCloseOnMobile) {
      setSidebarOpen(false);
    }
    lastPathnameRef.current = pathname;
  }, [pathname, isMobile, autoCloseOnMobile]);

  return {
    sidebarOpen,
    isMobile,
    toggleSidebar,
    navigateTo,
    isActiveRoute,
    setSidebarOpen
  };
};