import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPie } from '@phosphor-icons/react';
import { GearSix as GearSix } from '@phosphor-icons/react';
import { PlugsConnected as PlugsConnected } from '@phosphor-icons/react';
import { User as User } from '@phosphor-icons/react';
import { Users as Users } from '@phosphor-icons/react';
import { XSquare as XSquare } from '@phosphor-icons/react';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
