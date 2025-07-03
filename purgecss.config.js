module.exports = {
  content: [
    './index.html',
    './js/**/*.js',
    './scripts/**/*.js'
  ],
  css: ['./css/style.css'],
  output: './dist/',
  
  // Extractor personalizado para StarFlex
  defaultExtractor: content => {
    // Capturar clases CSS estándar
    const standardMatches = content.match(/[A-Za-z0-9-_:/]+/g) || [];
    
    // Capturar clases dinámicas de JavaScript
    const jsMatches = content.match(/['"`]([^'"`]*)['"]/g) || [];
    const cleanJsMatches = jsMatches.map(match => match.replace(/['"`]/g, ''));
    
    // Capturar data attributes que pueden generar clases
    const dataMatches = content.match(/data-[a-zA-Z-]+/g) || [];
    
    // Capturar clases en comentarios (para documentación)
    const commentMatches = content.match(/\/\*.*?\*\//gs) || [];
    const commentClasses = commentMatches.join(' ').match(/\.[a-zA-Z0-9-_]+/g) || [];
    
    return [
      ...standardMatches,
      ...cleanJsMatches,
      ...dataMatches,
      ...commentClasses.map(cls => cls.substring(1)) // Remover el punto
    ];
  },
  
  // Lista de seguridad exhaustiva para StarFlex
  safelist: {
    standard: [
      // Estados de la aplicación
      'active', 'inactive', 'loading', 'loaded', 'error', 'success',
      'visible', 'hidden', 'show', 'hide', 'open', 'closed',
      'expanded', 'collapsed', 'in-view', 'out-view',
      
      // Estados del navbar
      'no-scroll', 'nav-menu-open', 'menu-active',
      
      // Estados de dispositivos
      'mobile-only', 'desktop-only', 'tablet-only',
      
      // Estados de imágenes
      'image-optimized', 'lazy-loaded',
      
      // Estados de videos
      'video-playing', 'video-paused', 'video-ended',
      
      // Estados de formularios
      'form-valid', 'form-invalid', 'field-error',
      
      // Estados de animaciones
      'animate-in', 'animate-out', 'fade-in', 'fade-out',
      
      // Clases de utilidad que pueden ser agregadas dinámicamente
      'sr-only', 'visually-hidden', 'skip-link'
    ],
    
    // Patrones para componentes BEM
    deep: [
      // Navegación
      /^nav(__|\-\-)/,
      /^header(__|\-\-)/,
      
      // Hero section
      /^hero(__|\-\-)/,
      
      // Features
      /^features(__|\-\-)/,
      /^feature(__|\-\-)/,
      
      // Videos
      /^videos(__|\-\-)/,
      
      // FAQ
      /^faq(__|\-\-)/,
      
      // Contact
      /^contact(__|\-\-)/,
      
      // Botones
      /^btn(__|\-\-)/,
      
      // Componentes específicos
      /^language-switcher(__|\-\-)/,
      /^floating-widget(__|\-\-)/,
      /^phone(__|\-\-)/,
      /^download-btn(__|\-\-)/,
      
      // Utilidades
      /^bg-/,
      /^text-/,
      /^border-/,
      /^shadow-/,
      /^space-/,
      /^m[trblxy]?-/,
      /^p[trblxy]?-/,
      
      // Responsive
      /^sm:/,
      /^md:/,
      /^lg:/,
      /^xl:/,
      /^2xl:/
    ],
    
    // Patrones greedy para capturar variaciones
    greedy: [
      // Modificadores BEM
      /^.*--.*$/,
      /^.*__.*$/,
      
      // Data attributes
      /^data-.*$/,
      
      // Aria attributes
      /^aria-.*$/,
      
      // Clases de estado con números
      /^.*-\d+$/,
      
      // Clases con prefijos de vendor
      /^-webkit-.*$/,
      /^-moz-.*$/,
      /^-ms-.*$/,
      /^-o-.*$/
    ]
  },
  
  // Mantener elementos importantes
  variables: true,
  keyframes: true,
  fontFace: true,
  
  // Configuración de extracción
  extractors: [
    {
      extractor: content => {
        // Extractor específico para archivos JavaScript
        const matches = content.match(/[A-Za-z0-9-_:/]+/g) || [];
        return matches;
      },
      extensions: ['js']
    },
    {
      extractor: content => {
        // Extractor específico para HTML
        const matches = content.match(/[A-Za-z0-9-_:/]+/g) || [];
        return matches;
      },
      extensions: ['html']
    }
  ],
  
  // Configuración de salida
  rejected: true, // Generar archivo con CSS removido para revisión
  rejectedCss: './reports/purged-css.css'
};
