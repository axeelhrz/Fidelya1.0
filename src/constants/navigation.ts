import { 
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Psychology as PsychologyIcon,
  Assignment as AssignmentIcon,
  NotificationsActive as NotificationsIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

export interface NavigationItem {
  id: string;
  label: string;
  path: string
}