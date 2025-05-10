import React from 'react';
import {
  Tabs,
  Tab,
  Stack,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { Customer } from '@/types/customer';

interface CustomerTabsProps {
  currentTab: number;
  onTabChange: (newValue: number) => void;
  customers: Customer[];
}

const CustomerTabs: React.FC<CustomerTabsProps> = ({
  currentTab,
  onTabChange,
  customers
}) => {
  const theme = useTheme();
  
  // Contar clientes por estado
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
  const leadCustomers = customers.filter(c => c.status === 'lead').length;
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };
  
  return (
    <Tabs 
      value={currentTab} 
      onChange={handleChange}
      sx={{ 
        mb: 3,
        '& .MuiTabs-indicator': {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
        '& .MuiTab-root': {
          fontFamily: "'Sora', sans-serif",
          fontWeight: 600,
          textTransform: 'none',
          minWidth: 100,
          transition: 'all 0.2s',
          '&:hover': {
            color: theme.palette.primary.main,
          },
        },
      }}
    >
      <Tab 
        label={
          <Stack direction="row" spacing={1} alignItems="center">
            <span>Todos</span>
            <Chip 
              label={customers.length} 
              size="small"
              sx={{ 
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
              }}
            />
          </Stack>
        } 
      />
      <Tab 
        label={
          <Stack direction="row" spacing={1} alignItems="center">
            <span>Activos</span>
            <Chip 
              label={activeCustomers} 
              size="small"
              sx={{ 
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: alpha(theme.palette.success.main, 0.2),
                color: theme.palette.success.main,
              }}
            />
          </Stack>
        } 
      />
      <Tab 
        label={
          <Stack direction="row" spacing={1} alignItems="center">
            <span>Inactivos</span>
            <Chip 
              label={inactiveCustomers} 
              size="small"
              sx={{ 
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: alpha(theme.palette.warning.main, 0.2),
                color: theme.palette.warning.main,
              }}
            />
          </Stack>
        } 
      />
      <Tab 
        label={
          <Stack direction="row" spacing={1} alignItems="center">
            <span>Leads</span>
            <Chip 
              label={leadCustomers} 
              size="small"
              sx={{ 
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 600,
                bgcolor: alpha(theme.palette.info.main, 0.2),
                color: theme.palette.info.main,
              }}
            />
          </Stack>
        } 
      />
    </Tabs>
  );
};

export default CustomerTabs;