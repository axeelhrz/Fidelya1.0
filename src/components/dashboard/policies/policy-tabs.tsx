'use client';
import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
  alpha,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Policy } from '@/types/policy';

interface PolicyTabsProps {
  currentTab: number;
  onTabChange: (newValue: number) => void;
  policies: Policy[];
}

const PolicyTabs: React.FC<PolicyTabsProps> = ({
  currentTab,
  onTabChange,
  policies
}) => {
  const theme = useTheme();

  // Contar pólizas por estado
  const activePolicies = policies.filter(p => p.status === 'active' && !p.isArchived).length;
  const expiredPolicies = policies.filter(p => p.status === 'expired' && !p.isArchived).length;
  const pendingPolicies = policies.filter(p => p.status === 'pending' && !p.isArchived).length;
  // Since 'review' is not in the status type, we're setting it to 0 or you might want to use a different condition
  const reviewPolicies = 0; // policies.filter(p => p.status === 'review' && !p.isArchived).length;
  const nonArchivedPolicies = policies.filter(p => !p.isArchived).length;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <Box sx={{ mb: 3, position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="policy tabs"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.primary.main,
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
            '& .MuiTabs-scrollButtons': {
              color: theme.palette.text.secondary,
            },
            '& .MuiTabs-flexContainer': {
              gap: 1,
            }
          }}
        >
          <Tab
            label="Todas"
            icon={
              <Badge
                badgeContent={nonArchivedPolicies}
                color="primary"
                max={999}
                sx={{
                  '& .MuiBadge-badge': {
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                  }
                }}
              />
            }
            iconPosition="end"
            sx={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 48,
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                color: theme.palette.primary.main,
              }
            }}
          />
          <Tab
            label="Activas"
            icon={
              <Badge
                badgeContent={activePolicies}
                color="success"
                max={999}
                sx={{
                  '& .MuiBadge-badge': {
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    backgroundColor: theme.palette.success.main,
                  }
                }}
              />
            }
            iconPosition="end"
            sx={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 48,
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                color: theme.palette.success.main,
                backgroundColor: alpha(theme.palette.success.main, 0.05),
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.success.main, 0.05),
                color: theme.palette.success.main,
              }
            }}
          />
          <Tab
            label="Vencidas"
            icon={
              <Badge
                badgeContent={expiredPolicies}
                color="error"
                max={999}
                sx={{
                  '& .MuiBadge-badge': {
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                  }
                }}
              />
            }
            iconPosition="end"
            sx={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 48,
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                color: theme.palette.error.main,
                backgroundColor: alpha(theme.palette.error.main, 0.05),
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.05),
                color: theme.palette.error.main,
              }
            }}
          />
          <Tab
            label="Pendientes"
            icon={
              <Badge
                badgeContent={pendingPolicies}
                color="warning"
                max={999}
                sx={{
                  '& .MuiBadge-badge': {
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                  }
                }}
              />
            }
            iconPosition="end"
            sx={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 48,
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                color: theme.palette.warning.main,
                backgroundColor: alpha(theme.palette.warning.main, 0.05),
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.warning.main, 0.05),
                color: theme.palette.warning.main,
              }
            }}
          />
          <Tab
            label="En Revisión"
            icon={
              <Badge
                badgeContent={reviewPolicies}
                color="info"
                max={999}
                sx={{
                  '& .MuiBadge-badge': {
                    fontFamily: 'Sora, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                  }
                }}
              />
            }
            iconPosition="end"
            sx={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              minHeight: 48,
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                color: theme.palette.info.main,
                backgroundColor: alpha(theme.palette.info.main, 0.05),
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.info.main, 0.05),
                color: theme.palette.info.main,
              }
            }}
          />
        </Tabs>
      </motion.div>
    </Box>
  );
};

export default PolicyTabs;