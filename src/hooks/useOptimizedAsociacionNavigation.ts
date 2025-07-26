'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { navigationCache } from '@/lib/cache-manager';

interface NavigationState {
  activeSection: string;
  previousSection: string;
  isNavigating: boolean;
}

interface UseOptimizedAsociacionNavigationOptions {
  autoCloseOnMobile?: boolean;
  debounceMs?: number;
  enableCache?: boolean;
}

export const useOptimizedAsociacionNavigation = (
  options: UseOptimizedAsociacionNavigationOptions = {}
) => {
  const { 
    autoCloseOnMobile = true, 
    debounceMs = 200,
    enableCache = true 
  } = options;
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Navigation state
  const [navigationState, setNavigationState] = useState<NavigationState>(() => {
    const cached = enableCache ? navigationCache.get<NavigationState>('nav-state') : null;
    return cached || {
      activeSection: getActiveSectionFromPath(pathname),
      previousSection: '',
      isNavigating: false
    };
  });

  const [isMobile, setIsMobile] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const lastPathnameRef = useRef(pathname);
  const isInitializedRef = useRef(false);

  // Route mapping - memoized for performance
  const routeMap = useMemo(() => ({
    'dashboard': '/dashboard/asociacion',
    'socios': '/dashboard/asociacion/socios',
    'comercios': '/dashboard/asociacion/comercios',
    'beneficios': '/dashboard/asociacion/beneficios',
    'analytics': '/dashboard/asociacion/analytics',
    'notificaciones': '/dashboard/asociacion/notificaciones'
  }), []);

  const reverseRouteMap = useMemo(() => {
    const reversed: Record<string, string> = {};
    Object.entries(routeMap).forEach(([section, route]) => {
      reversed[route] = section;
    });
    return reversed;
  }, [routeMap]);

  // Helper function to get active section from pathname
  function getActiveSectionFromPath(path: string): string {
    return reverseRouteMap[path] || 'dashboard';
  }

  // Detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update navigation state when pathname changes
  useEffect(() => {
    if (pathname !== lastPathnameRef.current) {
      const newActiveSection = getActiveSectionFromPath(pathname);
      
      setNavigationState(prev => {
        const newState = {
          activeSection: newActiveSection,
          previousSection: prev.activeSection,
          isNavigating: false
        };
        
        // Cache the navigation state
        if (enableCache) {
          navigationCache.set('nav-state', newState);
        }
        
        return newState;
      });
      
      lastPathnameRef.current = pathname;
    }
  }, [pathname, enableCache]);

  // Initialize
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      const currentSection = getActiveSectionFromPath(pathname);
      
      setNavigationState(prev => ({
        ...prev,
        activeSection: currentSection
      }));
    }
  }, [pathname]);

  // Optimized navigation function
  const navigateToSection = useCallback((section: string) => {
    // Clear any pending navigation
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set navigating state immediately for UI feedback
    setNavigationState(prev => ({
      ...prev,
      isNavigating: true
    }));

    // Debounced navigation
    debounceTimeoutRef.current = setTimeout(() => {
      const targetRoute = routeMap[section];
      
      if (targetRoute && pathname !== targetRoute) {
        // Update state before navigation for immediate UI update
        setNavigationState(prev => {
          const newState = {
            activeSection: section,
            previousSection: prev.activeSection,
            isNavigating: false
          };
          
          if (enableCache) {
            navigationCache.set('nav-state', newState);
          }
          
          return newState;
        });
        
        // Navigate
        router.push(targetRoute);
      } else {
        // Just update the active section if already on the route
        setNavigationState(prev => ({
          ...prev,
          activeSection: section,
          isNavigating: false
        }));
      }
    }, debounceMs);
  }, [router, pathname, routeMap, debounceMs, enableCache]);

  // Check if a section is active
  const isActiveSection = useCallback((section: string) => {
    return navigationState.activeSection === section;
  }, [navigationState.activeSection]);

  // Check if a route is active
  const isActiveRoute = useCallback((route: string) => {
    return pathname === route;
  }, [pathname]);

  // Get section from route
  const getSectionFromRoute = useCallback((route: string) => {
    return reverseRouteMap[route] || 'dashboard';
  }, [reverseRouteMap]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    activeSection: navigationState.activeSection,
    previousSection: navigationState.previousSection,
    isNavigating: navigationState.isNavigating,
    isMobile,
    pathname,
    
    // Actions
    navigateToSection,
    isActiveSection,
    isActiveRoute,
    getSectionFromRoute,
    
    // Utils
    routeMap,
    reverseRouteMap
  };
};