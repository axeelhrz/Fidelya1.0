import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Receipt
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ReportSummaryCards = ({ data, loading = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'success.main';
    if (balance < 0) return 'error.main';
    return 'text.secondary';
  };

  const getBalanceIcon = (balance) => {
    if (balance > 0) return <TrendingUp />;
    if (balance < 0) return <TrendingDown />;
    return <AccountBalance />;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  const cards = [
    {
      title: 'Total Ingresos',
      value: data?.ingresos || 0,
      icon: <TrendingUp />,
      color: 'success.main',
      bgColor: 'rgba(76, 175, 80, 0.1)'
    },
    {
      title: 'Total Egresos',
      value: data?.egresos || 0,
      icon: <TrendingDown />,
      color: 'error.main',
      bgColor: 'rgba(244, 67, 54, 0.1)'
    },
    {
      title: 'Balance Neto',
      value: data?.balance || 0,
      icon: getBalanceIcon(data?.balance || 0),
      color: getBalanceColor(data?.balance || 0),
      bgColor: data?.balance > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
    },
    {
      title: 'Total Impuestos',
      value: data?.impuestos || 0,
      icon: <Receipt />,
      color: 'info.main',
      bgColor: 'rgba(33, 150, 243, 0.1)'
    }
  ];

  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[1, 2, 3, 4].map((index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="80%" height={32} sx={{ mt: 1 }} />
                <Skeleton variant="circular" width={40} height={40} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card 
              sx={{ 
                borderRadius: 3,
                height: '100%',
                background: `linear-gradient(135deg, ${card.bgColor} 0%, rgba(255,255,255,0.9) 100%)`,
                border: `1px solid ${card.color}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500,
                        mb: 1
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: card.color,
                        mb: 1
                      }}
                    >
                      {formatCurrency(card.value)}
                    </Typography>
                    {card.title === 'Balance Neto' && (
                      <Chip
                        label={card.value >= 0 ? 'Positivo' : 'Negativo'}
                        size="small"
                        color={card.value >= 0 ? 'success' : 'error'}
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <Box 
                    sx={{ 
                      color: card.color,
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: 2,
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReportSummaryCards;