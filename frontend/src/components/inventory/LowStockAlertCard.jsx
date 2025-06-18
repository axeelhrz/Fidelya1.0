import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Collapse,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as StockIcon,
  Apple as FruitIcon,
  Grass as VegetableIcon,
  Category as OtherIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const LowStockAlertCard = ({ productos = [], onProductClick }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);

  if (productos.length === 0) {
    return null;
  }

  const getCategoryIcon = (categoria) => {
    const iconProps = { fontSize: 'small' };
    switch (categoria) {
      case 'frutas':
        return <FruitIcon {...iconProps} />;
      case 'verduras':
        return <VegetableIcon {...iconProps} />;
      default:
        return <OtherIcon {...iconProps} />;
    }
  };

  const getCategoryColor = (categoria) => {
    switch (categoria) {
      case 'frutas':
        return theme.palette.success.main;
      case 'verduras':
        return theme.palette.primary.main;
      default:
        return theme.palette.warning.main;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: `2px solid ${theme.palette.warning.main}`,
          bgcolor: alpha(theme.palette.warning.main, 0.05),
          boxShadow: theme.shadows[4],
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.warning.main,
                  color: 'white',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                    },
                    '50%': {
                      transform: 'scale(1.05)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                    },
                  },
                }}
              >
                <WarningIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color="warning.dark">
                  ⚠️ Alerta de Stock Bajo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {productos.length} producto{productos.length > 1 ? 's' : ''} requiere{productos.length === 1 ? '' : 'n'} reposición
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={`${productos.length} producto${productos.length > 1 ? 's' : ''}`}
                color="warning"
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
              <IconButton
                onClick={() => setExpanded(!expanded)}
                sx={{
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Vista resumida */}
          {!expanded && productos.length > 0 && (
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              {productos.slice(0, 3).map((producto) => (
                <Chip
                  key={producto.id}
                  label={`${producto.nombre} (${producto.stock_actual})`}
                  variant="outlined"
                  color="warning"
                  size="small"
                  onClick={() => onProductClick && onProductClick(producto)}
                  clickable={!!onProductClick}
                />
              ))}
              {productos.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{productos.length - 3} más...
                </Typography>
              )}
            </Box>
          )}

          {/* Vista expandida */}
          <Collapse in={expanded}>
            <List sx={{ mt: 2 }}>
              {productos.map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: 'background.paper',
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                      },
                    }}
                    secondaryAction={
                      onProductClick && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          startIcon={<StockIcon />}
                          onClick={() => onProductClick(producto)}
                        >
                          Ajustar
                        </Button>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: alpha(getCategoryColor(producto.categoria), 0.1),
                          color: getCategoryColor(producto.categoria),
                        }}
                      >
                        {getCategoryIcon(producto.categoria)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {producto.nombre}
                          </Typography>
                          <Chip
                            label={producto.categoria}
                            size="small"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                          <Typography variant="body2" color="error.main" fontWeight={600}>
                            Stock: {producto.stock_actual} {producto.unidad}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Mínimo: {producto.stock_minimo}
                          </Typography>
                          {producto.proveedor && (
                            <Typography variant="caption" color="text.secondary">
                              • {producto.proveedor}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LowStockAlertCard;