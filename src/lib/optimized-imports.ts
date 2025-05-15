// Este archivo centraliza las importaciones optimizadas para reducir el tamaño del bundle
// Importaciones optimizadas de Phosphor Icons
// Importar solo los iconos que se utilizan en lugar de toda la biblioteca
export { RocketLaunch } from '@phosphor-icons/react/dist/ssr/RocketLaunch';
export { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck';
export { Lock } from '@phosphor-icons/react/dist/ssr/Lock';
export { Database } from '@phosphor-icons/react/dist/ssr/Database';
export { Users } from '@phosphor-icons/react/dist/ssr/Users';
export { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning';
export { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight';
export { Bell } from '@phosphor-icons/react/dist/ssr/Bell';
export { Globe } from '@phosphor-icons/react/dist/ssr/Globe';
export { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown';
export { Check } from '@phosphor-icons/react/dist/ssr/Check';
export { Translate } from '@phosphor-icons/react/dist/ssr/Translate';
export { Sun } from '@phosphor-icons/react/dist/ssr/Sun';
export { Moon } from '@phosphor-icons/react/dist/ssr/Moon';
export { SignIn } from '@phosphor-icons/react/dist/ssr/SignIn';
export { ChatCircle } from '@phosphor-icons/react/dist/ssr/ChatCircle';
export { List } from '@phosphor-icons/react/dist/ssr/List';
export { X } from '@phosphor-icons/react/dist/ssr/X';
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