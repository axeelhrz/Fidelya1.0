'use client';
import React from 'react';
import {
  Box,
  Typography,
  Card,
  alpha,
  useTheme,
  Stack
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
  Paid as PaidIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/formatters';

interface PolicyStatsData {
  total: number;
  active: number;
  expired: number;
  pending: number;
  review: number;
  cancelled: number;
  expiringIn30Days: number;
  totalPremium: number;
}

interface PolicyStatsProps {
  stats: PolicyStatsData;
}

const PolicyStats: React.FC<PolicyStatsProps> = ({ stats }) => {
  const theme = useTheme();

  const statCards = [
    {
      title: 'Pólizas Activas',
      value: stats.active,
      icon: <CheckCircleIcon sx={{ fontSize: 28 }}/>,
      color: theme.palette.success.main,
      delay: 0
    },
    {
      title: 'Pólizas Vencidas',
      value: stats.expired,
      icon: <WarningIcon sx={{ fontSize: 28 }}/>,
      color: theme.palette.error.main,
      delay: 0.1
    },
    {
      title: 'Pólizas Pendientes',
      value: stats.pending,
      icon: <AccessTimeIcon sx={{ fontSize: 28 }}/>,
      color: theme.palette.warning.main,
      delay: 0.2
    },
    {
      title: 'Prima Total',
      value: formatCurrency(stats.totalPremium),
      icon: <PaidIcon sx={{ fontSize: 28 }}/>,
      color: theme.palette.primary.main,
      delay: 0.3
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2, // Corresponds to spacing={2}
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)', // Corresponds to xs={12}
            sm: 'repeat(2, 1fr)', // Corresponds to sm={6}
            md: 'repeat(4, 1fr)', // Corresponds to md={3}
          },
        }}
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: stat.delay }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card
              elevation={0}
              sx={{
                p: 2.5,
                height: '100%',
                borderRadius: '16px',
                background: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.6)
                  : alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(stat.color, 0.15)}`,
                  borderColor: alpha(stat.color, 0.2),
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(stat.color, 0.1),
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    fontFamily="Inter, sans-serif"
                    sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
                  >
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    fontFamily="Sora, sans-serif"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default PolicyStats;