import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  Analytics as AnalyticsIcon,
  Refresh as RefreshIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Constantes
const PLAN_LIMITS = {
  basic: 10,
  pro: Infinity,
  enterprise: Infinity
};

interface CustomerHeaderProps {
  customersCount: number;
  planType?: string;
  onNewCustomer: () => void;
  onImport: () => void;
  onExport: () => void;
  onAnalytics: () => void;
  onRefresh: () => void;
  lastUpdated?: Date | null;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  customersCount,
  planType = 'basic',
  onNewCustomer,
  onImport,
  onExport,
  onAnalytics,
  onRefresh,
  lastUpdated
}) => {
  const theme = useTheme();
  
  // Verificar si el usuario ha alcanzado el límite de clientes
  const hasReachedLimit = planType === 'basic' && customersCount >= PLAN_LIMITS.basic;
  
  // Format last updated date
  const formattedLastUpdated = lastUpdated 
    ? format(lastUpdated, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })
    : 'No disponible';
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ mb: 4 }}
    >
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            gutterBottom 
            fontFamily="'Sora', sans-serif"
            sx={{ 
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            Gestión de Clientes
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            fontFamily="'Sora', sans-serif"
            fontWeight={400}
          >
            Administra tus clientes, pólizas y recordatorios en un solo lugar
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          {planType === 'basic' && (
            <Chip 
              label={`${customersCount}/${PLAN_LIMITS.basic} clientes`}
              color={hasReachedLimit ? "error" : "primary"}
              variant="outlined"
              size="small"
              sx={{ 
                fontWeight: 500,
                borderWidth: hasReachedLimit ? 2 : 1,
                mr: 1
              }}
            />
          )}
          
          <Tooltip title={hasReachedLimit ? "Límite de clientes alcanzado. Actualiza tu plan para añadir más." : "Añadir nuevo cliente"}>
            <span>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onNewCustomer}
                disabled={hasReachedLimit}
                sx={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,118,255,0.39)',
                  },
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                }}
              >
                Nuevo Cliente
              </Button>
            </span>
          </Tooltip>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title="Importar clientes">
              <IconButton 
                onClick={onImport}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <FileUploadIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Exportar clientes">
              <IconButton 
                onClick={onExport}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Analíticas de clientes">
              <IconButton 
                onClick={onAnalytics}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <AnalyticsIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Actualizar estadísticas">
              <IconButton 
                onClick={onRefresh}
                sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
      
      {lastUpdated && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
          }}
        >
          <AccessTimeIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
          <Typography variant="caption">
            Última actualización: {formattedLastUpdated}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CustomerHeader;