import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Configurar dayjs para usar español
dayjs.locale('es');


export function parseCurrency(value: string): number {
  // Remove currency symbols, commas, and spaces
  const sanitizedValue = value.replace(/[$,\s]/g, '');
  return parseFloat(sanitizedValue) || 0;
}

// Formato de moneda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-ES', { 
    style: 'currency', 
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Formato de número
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('es-ES').format(value);
};

// Formato de porcentaje
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Formato de fecha corta
export const formatShortDate = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY');
};

// Formato de fecha larga
export const formatLongDate = (date: string | Date): string => {
  return dayjs(date).format('DD [de] MMMM [de] YYYY');
};

// Formato de fecha relativa (hace X días)
export const formatRelativeDate = (date: string | Date): string => {
  const days = dayjs().diff(dayjs(date), 'day');
  
  if (days === 0) {
    return 'Hoy';
  } else if (days === 1) {
    return 'Ayer';
  } else if (days < 30) {
    return `Hace ${days} días`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    const years = Math.floor(days / 365);
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }
};

// Definición del tipo de tema
interface Theme {
  palette: {
    success: { main: string };
    error: { main: string };
    warning: { main: string };
    info: { main: string };
    text: { secondary: string };
  }
}

// Obtener color para prioridad
export const getPriorityColor = (priority: 'high' | 'medium' | 'low', theme: Theme): string => {
  if (priority === 'high') {
    return theme.palette.error.main;
  } else if (priority === 'medium') {
    return theme.palette.warning.main;
  } else {
    return theme.palette.info.main;
  }
};

// Obtener color para tendencia
export const getTrendColor = (trend: 'up' | 'down' | 'neutral', theme: Theme): string => {
  if (trend === 'up') {
    return theme.palette.success.main;
  } else if (trend === 'down') {
    return theme.palette.error.main;
  } else {
    return theme.palette.text.secondary;
  }
};

// Obtener color para severidad
export const getSeverityColor = (severity: 'error' | 'warning' | 'info' | 'success', theme: Theme): string => {
  return theme.palette[severity].main;
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};