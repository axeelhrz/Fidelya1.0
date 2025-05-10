import { alpha, Theme } from '@mui/material/styles';

// Función para crear efecto glassmorphism
export const createGlassmorphismStyle = (theme: Theme, intensity: 'low' | 'medium' | 'high' = 'medium') => {
  const opacityMap = {
    low: 0.5,
    medium: 0.7,
    high: 0.9
  };
  
  const blurMap = {
    low: '4px',
    medium: '8px',
    high: '12px'
  };
  
  return {
    backgroundColor: alpha(theme.palette.background.paper, opacityMap[intensity]),
    backdropFilter: `blur(${blurMap[intensity]})`,
    border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    boxShadow: theme.shadows[2]
  };
};

// Función para crear efecto hover
export const createHoverStyle = (theme: Theme, color: string) => {
  return {
    '&:hover': {
      boxShadow: `0 8px 32px 0 ${alpha(color, 0.25)}`,
      borderColor: alpha(color, 0.5),
      transform: 'translateY(-4px)',
      transition: 'all 0.3s ease'
    }
  };
};

// Función para crear efecto de tarjeta premium
export const createPremiumCardStyle = (theme: Theme, color: string) => {
  return {
    borderRadius: '20px',
    ...createGlassmorphismStyle(theme),
    ...createHoverStyle(theme, color),
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    position: 'relative'
  };
};

// Función para crear efecto de borde animado
export const createAnimatedBorderStyle = (theme: Theme, color: string) => {
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