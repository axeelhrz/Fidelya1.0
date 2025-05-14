'use client';
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  alpha,
  useTheme,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  BarChart as BarChartIcon,
  Lightbulb as LightbulbIcon,
  AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface PolicyHeaderProps {
  policiesCount: number;
  planType?: string;
  onNewPolicy: () => void;
  onImport: () => void;
  onExport: () => void;
  onAnalytics: () => void;
}

const PolicyHeader: React.FC<PolicyHeaderProps> = ({
  policiesCount,
  planType,
  onNewPolicy,
  onImport,
  onExport,
  onAnalytics
}) => {
  const theme = useTheme();
  const isPro = planType === 'professional' || planType === 'enterprise';
  const isEnterprise = planType === 'enterprise';

  return (
    <Box sx={{ mb: 3 }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={700}
              fontFamily="Sora, sans-serif"
              sx={{ 
                color: theme.palette.text.primary,
                mb: 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Gestión de Pólizas
              <Box
                component={motion.div}
                whileHover={{ rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                sx={{
                  display: 'inline-flex',
                  ml: 1,
                  color: theme.palette.primary.main
                }}
              >
                <AutoAwesomeIcon fontSize="medium" />
              </Box>
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              fontFamily="Sora, sans-serif"
            >
              {policiesCount === 0 
                ? 'Comienza a registrar tus pólizas para gestionar tu cartera de seguros' 
                : `Administra tus ${policiesCount} pólizas de seguros de forma eficiente`}
            </Typography>
          </motion.div>
        </Box>

        <Stack 
          direction="row" 
          spacing={1}
          sx={{ 
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={onNewPolicy}
              sx={{ 
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                px: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                }
              }}
            >
              Nueva Póliza
            </Button>
          </motion.div>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="Importar pólizas">
                <IconButton
                  color="primary"
                  onClick={onImport}
                  sx={{ 
                    borderRadius: '12px',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    backdropFilter: 'blur(4px)',
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <FileUploadIcon />
                </IconButton>
              </Tooltip>
            </motion.div>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.4 }}
              whileHover={{ scale: isPro ? 1.05 : 1 }}
              whileTap={{ scale: isPro ? 0.95 : 1 }}
            >
              <Tooltip title={isPro ? "Exportar pólizas" : "Disponible en plan Professional"}>
                <span>
                  <IconButton
                    color="primary"
                    onClick={onExport}
                    disabled={!isPro}
                    sx={{ 
                      borderRadius: '12px',
                      border: `1px solid ${alpha(isPro ? theme.palette.primary.main : theme.palette.divider, 0.2)}`,
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      '&.Mui-disabled': {
                        borderColor: alpha(theme.palette.divider, 0.5),
                        opacity: 0.6
                      }
                    }}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </motion.div>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.5 }}
              whileHover={{ scale: isPro ? 1.05 : 1 }}
              whileTap={{ scale: isPro ? 0.95 : 1 }}
            >
              <Tooltip title={isPro ? "Análisis de pólizas" : "Disponible en plan Professional"}>
                <span>
                  <IconButton
                    color="primary"
                    onClick={onAnalytics}
                    disabled={!isPro}
                    sx={{ 
                      borderRadius: '12px',
                      border: `1px solid ${alpha(isPro ? theme.palette.primary.main : theme.palette.divider, 0.2)}`,
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      },
                      '&.Mui-disabled': {
                        borderColor: alpha(theme.palette.divider, 0.5),
                        opacity: 0.6
                      }
                    }}
                  >
                    <BarChartIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </motion.div>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.6 }}
              whileHover={{ scale: isEnterprise ? 1.05 : 1 }}
              whileTap={{ scale: isEnterprise ? 0.95 : 1 }}
            >
              <Tooltip title={isEnterprise ? "Recomendaciones IA" : "Disponible en plan Enterprise"}>
                <span>
                  <IconButton
                    color="secondary"
                    disabled={!isEnterprise}
                    sx={{ 
                      borderRadius: '12px',
                      border: `1px solid ${alpha(isEnterprise ? theme.palette.secondary.main : theme.palette.divider, 0.2)}`,
                      backdropFilter: 'blur(4px)',
                      backgroundColor: alpha(theme.palette.background.paper, 0.5),
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                      },
                      '&.Mui-disabled': {
                        borderColor: alpha(theme.palette.divider, 0.5),
                        opacity: 0.6
                      }
                    }}
                  >
                    <LightbulbIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </motion.div>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FileUploadIcon />}
                onClick={onImport}
                sx={{ 
                  borderRadius: '999px',
                  fontFamily: 'Sora, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                Importar
              </Button>
            </motion.div>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PolicyHeader;