import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Tooltip,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Características para la tabla comparativa
const features = [
  { 
    name: "Clientes", 
    basic: "Hasta 10", 
    pro: "Ilimitados", 
    enterprise: "Ilimitados",
    tooltip: "Número máximo de clientes que puedes gestionar en la plataforma"
  },
  { 
    name: "Usuarios", 
    basic: "1", 
    pro: "Hasta 5", 
    enterprise: "Ilimitados",
    tooltip: "Número de cuentas de usuario con acceso al sistema"
  },
  { 
    name: "Gestión de pólizas", 
    basic: true, 
    pro: true, 
    enterprise: true,
    tooltip: "Registro y seguimiento de pólizas de seguros"
  },
  { 
    name: "Recordatorios automáticos", 
    basic: true, 
    pro: true, 
    enterprise: true,
    tooltip: "Notificaciones automáticas para renovaciones, pagos, etc."
  },
  { 
    name: "Automatización de renovaciones", 
    basic: false, 
    pro: true, 
    enterprise: true,
    tooltip: "Flujos de trabajo automatizados para el proceso de renovación de pólizas"
  },
  { 
    name: "Análisis de rentabilidad", 
    basic: false, 
    pro: true, 
    enterprise: true,
    tooltip: "Informes detallados sobre la rentabilidad por cliente, póliza o producto"
  },
  { 
    name: "Integración con CRM", 
    basic: false, 
    pro: true, 
    enterprise: true,
    tooltip: "Conexión con sistemas CRM populares para sincronizar datos de clientes"
  },
  { 
    name: "Personalización de documentos", 
    basic: false, 
    pro: true, 
    enterprise: true,
    tooltip: "Plantillas personalizables para generar cartas, correos y otros documentos"
  },
  { 
    name: "API personalizada", 
    basic: false, 
    pro: false, 
    enterprise: true,
    tooltip: "Acceso a una API para desarrollar integraciones a medida con otros sistemas"
  },
  { 
    name: "Gestor de cuenta dedicado", 
    basic: false, 
    pro: false, 
    enterprise: true,
    tooltip: "Un representante exclusivo asignado a tu cuenta para soporte y consultoría"
  },
  { 
    name: "Soporte técnico", 
    basic: "Email", 
    pro: "Prioritario 24/7 (Email, Chat, Teléfono)", 
    enterprise: "Dedicado y personalizado",
    tooltip: "Canales y tiempos de respuesta del soporte técnico"
  },
];

const ComparisonTable: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ mb: 10 }}
    >
      <Typography
        variant="h3"
        component="h2"
        sx={{
          mb: 4,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: { xs: '1.75rem', md: '2.5rem' },
          background: isDark
            ? 'linear-gradient(90deg, #93C5FD 0%, #60A5FA 100%)'
            : 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Compara nuestros planes
      </Typography>
      
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: '24px',
          background: isDark
            ? 'rgba(15, 23, 42, 0.7)'
            : 'rgba(255, 255, 255, 0.8)',
          border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
          boxShadow: isDark
            ? '0 15px 30px -5px rgba(0, 0, 0, 0.5)'
            : '0 15px 30px -5px rgba(0, 0, 0, 0.1)',
          overflowX: 'auto', // Para mejorar la visualización en móviles
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="Tabla comparativa de planes">
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  fontWeight: 700,
                  fontSize: '1rem',
                  py: 2,
                  borderBottom: `2px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                  background: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.5)',
                },
              }}
            >
              <TableCell sx={{ borderTopLeftRadius: '24px' }}>Característica</TableCell>
              <TableCell align="center">Básico</TableCell>
              <TableCell align="center" sx={{ color: isDark ? '#60A5FA' : '#2563EB' }}>
                Profesional
              </TableCell>
              <TableCell align="center" sx={{ borderTopRightRadius: '24px' }}>Enterprise</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature) => (
              <TableRow
                key={feature.name}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '& td': {
                    py: 2,
                    borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
                  },
                  '&:hover': {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(241, 245, 249, 0.5)',
                  },
                  transition: 'background-color 0.2s ease',
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {feature.name}
                    {feature.tooltip && (
                      <Tooltip title={feature.tooltip} placement="top" arrow>
                        <InfoOutlinedIcon
                          fontSize="small"
                          sx={{ ml: 1, color: 'text.secondary', cursor: 'help' }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                
                {[feature.basic, feature.pro, feature.enterprise].map((value, i) => (
                  <TableCell key={i} align="center">
                    {typeof value === 'boolean' ? (
                      value ? (
                        <CheckIcon sx={{ color: 'success.main' }} />
                      ) : (
                        <CloseIcon sx={{ color: 'error.main' }} />
                      )
                    ) : (
                      <Typography variant="body2">{value}</Typography>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ComparisonTable;