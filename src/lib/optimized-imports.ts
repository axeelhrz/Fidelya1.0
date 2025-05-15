// Este archivo centraliza las importaciones optimizadas para reducir el tamaño del bundle
// Importaciones optimizadas de Phosphor Icons
// Importar solo los iconos que se utilizan en lugar de toda la biblioteca
export { RocketLaunch } from '@phosphor-icons/react/RocketLaunch';
export { ShieldCheck } from '@phosphor-icons/react/ShieldCheck';
export { Lock } from '@phosphor-icons/react/Lock';
export { Database } from '@phosphor-icons/react/Database';
export { Users } from '@phosphor-icons/react/Users';
export { Lightning } from '@phosphor-icons/react/Lightning';
export { ArrowRight } from '@phosphor-icons/react/ArrowRight';
export { Bell } from '@phosphor-icons/react/Bell';
export { Globe } from '@phosphor-icons/react/Globe';
export { CaretDown } from '@phosphor-icons/react/CaretDown';
export { Check } from '@phosphor-icons/react/Check';
export { Translate } from '@phosphor-icons/react/Translate';
export { Sun } from '@phosphor-icons/react/Sun';
export { Moon } from '@phosphor-icons/react/Moon';
export { SignIn } from '@phosphor-icons/react/SignIn';
export { ChatCircle } from '@phosphor-icons/react/ChatCircle';
export { List } from '@phosphor-icons/react/List';
export { X } from '@phosphor-icons/react/X';
// Importaciones optimizadas de MUI
// Exportar componentes específicos para permitir tree-shaking
export { 
  Box, 
  Button, 
  Container, 
  Stack, 
  Typography, 
  useTheme,
  alpha,
  Chip,
  Paper,
  Tooltip,
  styled,
  Skeleton,
} from '@mui/material';

// Exportar hooks y utilidades
export { useMediaQuery } from '@mui/material';

// Importaciones optimizadas para iconos
export { 
  User, 
  Calendar, 
  ChartLine 
} from '@phosphor-icons/react';

// Importaciones optimizadas para date-fns (solo lo que se usa)
export { format, parseISO } from 'date-fns';