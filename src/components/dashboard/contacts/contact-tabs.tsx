import { Box, Tabs, Tab, Badge, useTheme } from '@mui/material';
import { Users, Clock, Ban, Star } from 'lucide-react';

interface ContactsTabsProps {
  activeTab: number;
  onChange: (newValue: number) => void;
  pendingCount: number;
}

const ContactsTabs = ({ activeTab, onChange, pendingCount }: ContactsTabsProps) => {
  const theme = useTheme();
  
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    onChange(newValue);
  };

  const tabItems = [
    { label: 'Todos', icon: <Users size={18} /> },
    { 
      label: 'Pendientes', 
      icon: <Clock size={18} />,
      badge: pendingCount > 0
    },
    { label: 'Bloqueados', icon: <Ban size={18} /> },
    { label: 'Favoritos', icon: <Star size={18} /> },
  ];

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs 
        value={activeTab} 
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            fontFamily: "'Inter', sans-serif",
            minHeight: 48,
            color: theme.palette.text.secondary,
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          },
        }}
      >
        {tabItems.map((item, index) => (
          <Tab 
            key={index}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.icon}
                {item.label}
                {item.badge && (
                  <Badge 
                    badgeContent={pendingCount} 
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
            sx={{ 
              minWidth: 'auto',
              px: 3,
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default ContactsTabs;