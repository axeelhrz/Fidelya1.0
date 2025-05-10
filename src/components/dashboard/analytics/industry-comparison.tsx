import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  useTheme, 
  alpha,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { createPremiumCardStyle } from '@/styles/theme/themeAnalytics';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/formatters';

interface IndustryComparisonData {
  metric: string;
  yourValue: number;
  industryAvg: number;
  difference: number;
}

interface IndustryComparisonProps {
  data: IndustryComparisonData[];
}

export const IndustryComparison: React.FC<IndustryComparisonProps> = ({ data }) => {
  const theme = useTheme();
  
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
    },
    hover: {
      y: -5,
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.2 }
    }
  };
  
  // Formatear valor según métrica
  const formatValue = (metric: string, value: number): string => {
    if (metric.toLowerCase().includes('prima')) {
      return formatCurrency(value);
    } else if (metric.toLowerCase().includes('retención') || metric.toLowerCase().includes('tasa')) {
      return formatPercentage(value);
    } else {
      return formatNumber(value);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...createPremiumCardStyle(theme, theme.palette.info.main),
        p: 3
      }}
    >
      <Typography 
        variant="h6" 
        component="h3" 
        gutterBottom 
        sx={{ 
          fontFamily: 'Sora, sans-serif', 
          fontWeight: 600 
        }}
      >
        Comparativa con la Industria
      </Typography>
      
      <Box 
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2,
          mt: 2
        }}
      >
        {data.map((item) => (
          <Paper
            key={item.metric}
            component={motion.div}
            variants={itemVariants}
            whileHover="hover"
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              flex: '1 1 calc(33.333% - 16px)',
              minWidth: 200,
              border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.7),
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ fontFamily: 'Inter, sans-serif' }}
            >
              {item.metric}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontFamily: 'Sora, sans-serif', 
                    fontWeight: 700,
                    color: theme.palette.text.primary
                  }}
                >
                  {formatValue(item.metric, item.yourValue)}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontFamily: 'Inter, sans-serif',
                    color: theme.palette.text.secondary,
                    display: 'block',
                    mt: 0.5
                  }}
                >
                  Tu valor
                </Typography>
              </Box>
              
              <Tooltip 
                title={
                  <Typography variant="body2" sx={{ fontFamily: 'Inter, sans-serif' }}>
                    {`Promedio de la industria: ${formatValue(item.metric, item.industryAvg)}`}
                  </Typography>
                }
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    cursor: 'help'
                  }}
                >
                  {item.difference > 0 ? (
                    <TrendingUp size={16} color={theme.palette.success.main} />
                  ) : (
                    <TrendingDown size={16} color={theme.palette.error.main} />
                  )}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 600,
                      color: item.difference > 0 ? theme.palette.success.main : theme.palette.error.main
                    }}
                  >
                    {item.difference > 0 ? '+' : ''}{formatValue(item.metric, item.difference)}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
            
            <Box 
              sx={{ 
                mt: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.divider, 0.2),
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box 
                component={motion.div}
                initial={{ width: 0 }}
                animate={{ width: `${(item.yourValue / (item.industryAvg * 1.5)) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  backgroundColor: item.difference > 0 ? theme.palette.success.main : theme.palette.error.main,
                  borderRadius: 2
                }}
              />
            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
};