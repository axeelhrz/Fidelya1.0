// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

/**
 * Utility function to load non-critical resources after page load
 */
function loadNonCriticalResources(callback: () => void) {
  if (typeof window !== 'undefined') {
    // Execute callback when window is loaded or immediately if already loaded
    if (document.readyState === 'complete') {
      setTimeout(callback, 0);
    } else {
      window.addEventListener('load', () => setTimeout(callback, 0));
    }
  }
}

/**
 * Carga diferida de Google Tag Manager
 */
export function loadGTM() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GTM_ID) {
    loadNonCriticalResources(() => {
      // Crear script de GTM
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM_ID}`;
      
      // Configuración de GTM
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: unknown[]) {
        window.dataLayer.push({ event: args[0], ...args.length > 1 ? { [args[0] as string]: args[1] } : {} });
      }
      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GTM_ID);
      
      // Añadir script al documento
      document.head.appendChild(script);
    });
  }
}