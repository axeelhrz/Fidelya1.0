import { alpha, Theme } from '@mui/material/styles';

// Función para crear efecto glassmorphism
export const createGlassmorphismStyle = (theme: Theme, intensity: 'low' | 'medium' | 'high' = 'medium', isMobile = false) => {
  // Reducir intensidad en móviles para mejorar rendimiento
  const actualIntensity = isMobile ? 'low' : intensity;
  
  const opacityMap = {
    low: 0.5,
    medium: 0.7,
    high: 0.9
  };
  
  const blurMap = {
    low: isMobile ? '0px' : '4px',  // Sin blur en móvil
    medium: isMobile ? '0px' : '8px', // Sin blur en móvil
    high: isMobile ? '0px' : '12px' // Sin blur en móvil
  };
  
  return {
    backgroundColor: alpha(theme.palette.background.paper, isMobile ? 0.95 : opacityMap[actualIntensity]),
    backdropFilter: isMobile ? 'none' : `blur(${blurMap[actualIntensity]})`, // Eliminar blur en móviles
    border: `1px solid ${alpha(theme.palette.divider, isMobile ? 0.1 : 0.2)}`,
    boxShadow: isMobile ? 'none' : theme.shadows[2] // Eliminar sombras en móviles
  };
};

// Función para crear efecto hover
export const createHoverStyle = (theme: Theme, color: string, isMobile = false) => {
  // Eliminar efectos hover en móviles
  if (isMobile) {
    return {};
  }
  return {
    '@media (hover: hover)': {
      '&:hover': {
        boxShadow: `0 8px 32px 0 ${alpha(color, 0.25)}`,
        borderColor: alpha(color, 0.5),
        transform: 'translateY(-4px)',
        transition: 'all 0.3s ease'
      }
    }
  };
};

// Función para crear efecto de tarjeta premium
export const createPremiumCardStyle = (theme: Theme, color: string, isMobile = false) => {
  return {
    borderRadius: isMobile ? '12px' : '20px',
    ...createGlassmorphismStyle(theme, 'medium', isMobile),
    ...createHoverStyle(theme, color, isMobile),
    transition: isMobile ? 'none' : 'all 0.3s ease', // Eliminar transiciones en móviles
    overflow: 'hidden',
    position: 'relative'
  };
};

// Función para crear efecto de borde animado
export const createAnimatedBorderStyle = (theme: Theme, color: string, isMobile = false) => {
  // Eliminar bordes animados en móviles
  if (isMobile) {
    return {
      border: `1px solid ${alpha(color, 0.5)}`,
      borderRadius: 'inherit',
    };
  }
  
  return {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      padding: '2px',
      background: `linear-gradient(45deg, ${color}, ${alpha(color, 0.5)})`,
      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      maskComposite: 'exclude',
      pointerEvents: 'none'
    }
  };
};

// Nuevas funciones optimizadas para móvil

// Función para crear estilos de gráficos optimizados para móvil
export const createOptimizedChartStyle = (theme: Theme, isMobile = false) => {
  return {
    '& .recharts-cartesian-grid-horizontal line, & .recharts-cartesian-grid-vertical line': {
      stroke: alpha(theme.palette.divider, isMobile ? 0.1 : 0.2),
      strokeWidth: isMobile ? 0.5 : 1,
    },
    '& .recharts-cartesian-axis-line': {
      stroke: alpha(theme.palette.divider, isMobile ? 0.2 : 0.3),
      strokeWidth: isMobile ? 0.5 : 1,
    },
    '& .recharts-text': {
      fontSize: isMobile ? '0.65rem' : '0.75rem',
      fill: theme.palette.text.secondary,
    },
    '& .recharts-layer.recharts-pie': {
      transform: isMobile ? 'scale(0.9)' : 'none',
    }
  };
};

// Función para crear estilos de tarjetas de datos optimizados para móvil
export const createOptimizedDataCardStyle = (theme: Theme, isMobile = false) => {
  return {
    p: isMobile ? 1.5 : 3,
    borderRadius: isMobile ? '10px' : '16px',
    backgroundColor: alpha(theme.palette.background.paper, isMobile ? 0.95 : 0.8),
    border: `1px solid ${alpha(theme.palette.divider, isMobile ? 0.1 : 0.2)}`,
    boxShadow: isMobile ? 'none' : theme.shadows[1],
    transition: 'none',
  };
};