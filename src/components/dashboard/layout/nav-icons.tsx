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
