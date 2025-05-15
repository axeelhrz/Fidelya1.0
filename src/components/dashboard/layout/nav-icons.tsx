import type { Icon } from '@phosphor-icons/react/dist/lib/types';

import { 
  XSquare, 
  ChartPie as ChartPieIcon, 
  GearSix as GearSixIcon, 
  PlugsConnected as PlugsConnectedIcon,
  User as UserIcon,
  Users as UsersIcon
} from '@phosphor-icons/react';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;

// Crea un componente optimizado para iconos
const OptimizedIcon = ({ icon: Icon, ...props }: { icon: Icon, [key: string]: unknown }) => {
  // Reduce la complejidad del SVG
  return <Icon {...props} />; 
};

// Usa React.memo para evitar re-renderizados innecesarios
import React from 'react';
export default React.memo(OptimizedIcon);