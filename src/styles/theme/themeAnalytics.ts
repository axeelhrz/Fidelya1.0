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
    low: isMobile ? '2px' : '4px',
    medium: isMobile ? '4px' : '8px',
    high: isMobile ? '6px' : '12px'
  };
  
  return {
    backgroundColor: alpha(theme.palette.background.paper, opacityMap[actualIntensity]),
    backdropFilter: isMobile ? 'none' : `blur(${blurMap[actualIntensity]})`, // Eliminar blur en móviles
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
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