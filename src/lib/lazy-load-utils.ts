// Utilidades para carga diferida de recursos

// Función para cargar scripts de forma diferida
export const loadScript = (src: string, id: string, async = true, defer = true): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verificar si el script ya existe
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = async;
    script.defer = defer;

    script.onload = () => resolve();
    script.onerror = (error) => reject(error);

    document.body.appendChild(script);
  });
};

// Función para cargar estilos de forma diferida
export const loadStyle = (href: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verificar si el estilo ya existe
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = () => resolve();
    link.onerror = (error) => reject(error);

    document.head.appendChild(link);
  });
};

// Función para cargar recursos cuando el componente es visible
export const loadWhenVisible = (
  elementId: string, 
  callback: () => void, 
  options = { rootMargin: '200px' }
): void => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    // Fallback para navegadores que no soportan IntersectionObserver
    callback();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        observer.disconnect();
      }
    });
  }, options);

  const element = document.getElementById(elementId);
  if (element) {
    observer.observe(element);
  } else {
    // Si el elemento no existe, ejecutar el callback de inmediato
    callback();
  }
};

// Interfaz para la API de conexión de red
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

// Interfaz extendida de Navigator para incluir información de conexión
interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

// Función para detectar conexiones lentas
export const isSlowConnection = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const connection = (navigator as NavigatorWithConnection).connection || 
                    (navigator as NavigatorWithConnection).mozConnection || 
                    (navigator as NavigatorWithConnection).webkitConnection;
  
  if (!connection) return false;
  
  return connection.saveData || 
         connection.effectiveType === 'slow-2g' || 
         connection.effectiveType === '2g' || 
         connection.effectiveType === '3g';
};

// Función para cargar recursos de forma adaptativa según la conexión
export const adaptiveLoad = (
  fastCallback: () => void,
  slowCallback: () => void
): void => {
  if (isSlowConnection()) {
    slowCallback();
  } else {
    fastCallback();
  }
};