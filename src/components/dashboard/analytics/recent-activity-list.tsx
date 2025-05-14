import React from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Chip, 
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { FileText, Users, CheckSquare } from 'lucide-react';
import { formatCurrency, formatRelativeDate } from '@/lib/formatters';
import { createPremiumCardStyle } from '@/styles/theme/themeAnalytics';

interface RecentPolicyData {
  id: string;
  type: string;
  clientName: string;
  status: string;
  premium: number;
  date: string | Date;
}

interface ActiveCustomerData {
  id: string;
  name: string;
  policyCount: number;
  totalPremium?: number;
  lastActivity: string | Date;
}

interface PendingTaskData {
  id: string;
  description: string;
  priority: string;
  dueDate: string | Date;
  relatedEntity?: {
    type: string;
    name: string;
  };
}

interface RecentActivityListProps {
  recentPolicies: RecentPolicyData[];
  activeCustomers: ActiveCustomerData[];
  pendingTasks: PendingTaskData[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  recentPolicies,
  activeCustomers,
  pendingTasks
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  // Renderizar pólizas recientes
  const renderPolicies = () => (
    <List component={motion.ul} variants={containerVariants} initial="hidden" animate="visible">
      {recentPolicies.map((policy, index) => (
        <React.Fragment key={policy.id}>
          <ListItem 
            component={motion.li} 
            variants={itemVariants}
            sx={{ 
              py: 1.5,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            <ListItemIcon>
              <FileText color={theme.palette.primary.main} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontWeight: 500 
                    }}
                  >
                    {policy.type} - {policy.clientName}
                  </Typography>
                  <Chip 
                    label={policy.status} 
                    size="small"
                    color={policy.status === 'Activa' ? 'success' : policy.status === 'Pendiente' ? 'warning' : 'default'}
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {formatCurrency(policy.premium)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {formatRelativeDate(policy.date)}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
          {index < recentPolicies.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
  
  // Renderizar clientes activos
  const renderCustomers = () => (
    <List component={motion.ul} variants={containerVariants} initial="hidden" animate="visible">
      {activeCustomers.map((customer, index) => (
        <React.Fragment key={customer.id}>
          <ListItem 
            component={motion.li} 
            variants={itemVariants}
            sx={{ 
              py: 1.5,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            <ListItemIcon>
              <Users color={theme.palette.info.main} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontWeight: 500 
                    }}
                  >
                    {customer.name}
                  </Typography>
                  <Chip 
                    label={`${customer.policyCount} pólizas`} 
                    size="small"
                    color="info"
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {customer.totalPremium ? formatCurrency(customer.totalPremium) : ''}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Última actividad: {formatRelativeDate(customer.lastActivity)}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
          {index < activeCustomers.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
  
  // Renderizar tareas pendientes
  const renderTasks = () => (
    <List component={motion.ul} variants={containerVariants} initial="hidden" animate="visible">
      {pendingTasks.map((task, index) => (
        <React.Fragment key={task.id}>
          <ListItem 
            component={motion.li} 
            variants={itemVariants}
            sx={{ 
              py: 1.5,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05)
              }
            }}
          >
            <ListItemIcon>
              <CheckSquare />
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontWeight: 500 
                    }}
                  >
                    {task.description}
                  </Typography>
                  <Chip 
                    label={task.priority.toUpperCase()} 
                    size="small"
                    color={
                      task.priority === 'high' 
                        ? 'error' 
                        : task.priority === 'medium' 
                          ? 'warning' 
                          : 'info'
                    }
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                  {task.relatedEntity && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: theme.palette.text.secondary,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {task.relatedEntity.type === 'client' ? 'Cliente: ' : 'Póliza: '}
                      {task.relatedEntity.name}
                    </Typography>
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Vence: {formatRelativeDate(task.dueDate)}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
          {index < pendingTasks.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        ...createPremiumCardStyle(theme, theme.palette.primary.main),
        overflow: 'hidden'
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="activity tabs"
          sx={{
            '& .MuiTab-root': {
              fontFamily: 'Sora, sans-serif',
              fontWeight: 500,
              textTransform: 'none',
              minHeight: 48
            }
          }}
        >
          <Tab 
            icon={<FileText size={16} />} 
            iconPosition="start" 
            label="Pólizas Recientes" 
            id="tab-0" 
            aria-controls="tabpanel-0" 
          />
          <Tab 
            icon={<Users size={16} />} 
            iconPosition="start" 
            label="Clientes Activos" 
            id="tab-1" 
            aria-controls="tabpanel-1" 
          />
          <Tab 
            icon={<CheckSquare size={16} />} 
            iconPosition="start" 
            label="Tareas Pendientes" 
            id="tab-2" 
            aria-controls="tabpanel-2" 
          />
        </Tabs>
      </Box>
      <Box 
        role="tabpanel"
        hidden={tabValue !== 0}
        id="tabpanel-0"
        aria-labelledby="tab-0"
        sx={{ maxHeight: 350, overflow: 'auto' }}
      >
        {tabValue === 0 && renderPolicies()}
      </Box>
      <Box 
        role="tabpanel"
        hidden={tabValue !== 1}
        id="tabpanel-1"
        aria-labelledby="tab-1"
        sx={{ maxHeight: 350, overflow: 'auto' }}
      >
        {tabValue === 1 && renderCustomers()}
      </Box>
      <Box 
        role="tabpanel"
        hidden={tabValue !== 2}
        id="tabpanel-2"
        aria-labelledby="tab-2"
        sx={{ maxHeight: 350, overflow: 'auto' }}
      >
        {tabValue === 2 && renderTasks()}
      </Box>
    </Paper>
  );
};