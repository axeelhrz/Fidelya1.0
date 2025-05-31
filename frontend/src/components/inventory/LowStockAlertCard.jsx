import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Collapse,
} from '@mui/material';
import {
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const LowStockAlertCard = ({ productos, onProductClick }) => {
  const [expanded, setExpanded] = React.useState(false);

  if (!productos || productos.length === 0) {
    return null;
  }

  const handleToggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: '2px solid',
          borderColor: 'warning.main',
          backgroundColor: 'warning.light',
          backgroundImage: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <WarningIcon sx={{ color: 'warning.main', fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold" color="warning.dark">
                  Alerta de Stock Bajo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {productos.length} producto{productos.length !== 1 ? 's' : ''} requiere{productos.length === 1 ? '' : 'n'} atención
                </Typography>
              </Box>
            </Box>
            
            <Button
              onClick={handleToggleExpanded}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ color: 'warning.dark' }}
            >
              {expanded ? 'Ocultar' : 'Ver Detalles'}
            </Button>
          </Box>

          <Collapse in={expanded}>
            <Box mt={2}>
              <Stack spacing={2}>
                <AnimatePresence>
                  {productos.map((producto, index) => (
                    <motion.div
                      key={producto.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'action.hover',
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <Box flex={1}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {producto.nombre}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={2} mt={1}>
                            <Chip
                              label={producto.categoria}
                              size="small"
                              sx={{
                                backgroundColor: 'primary.light',
                                color: 'primary.dark',
                                fontWeight: 500,
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Stock actual: <strong>{producto.stock}</strong> | 
                              Mínimo: <strong>{producto.stock_minimo}</strong>
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => onProductClick(producto)}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            minWidth: 120,
                          }}
                        >
                          Ajustar Stock
                        </Button>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Stack>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LowStockAlertCard;