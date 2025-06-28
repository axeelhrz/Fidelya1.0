'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  Add,
  LocalOffer,
  Edit,
  Delete,
  MoreVert,
  Visibility,
  VisibilityOff,
  TrendingUp,
  Schedule,
  People,
  AttachMoney,
  Percent,
  CardGiftcard,
  LocalShipping,
  Star,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBeneficios } from '@/hooks/useBeneficios';
import { beneficioSchema, BeneficioFormData } from '@/lib/validations/comercio';
import { Beneficio, TIPOS_BENEFICIO, TipoBeneficio } from '@/types/comercio';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const DIAS_SEMANA = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];

export const BeneficiosManagement: React.FC = () => {
  const { beneficios, loading, createBeneficio, updateBeneficio, deleteBeneficio, toggleBeneficioStatus } = useBeneficios();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBeneficio, setEditingBeneficio] = useState<Beneficio | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedBeneficio, setSelectedBeneficio] = useState<Beneficio | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<BeneficioFormData>({
    resolver: zodResolver(beneficioSchema),
    defaultValues: {
      titulo: '',
      descripcion: '',
      tipo: 'descuento_porcentaje',
      valor: 0,
      asociacionesVinculadas: [],
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      diasValidez: [],
      mediosPagoHabilitados: [],
    }
  });

  const selectedTipo = watch('tipo');

  // Map API tipo to form tipo
  const mapTipoFromApi = (
    tipo: "porcentaje" | "monto_fijo" | "producto_gratis"
  ): TipoBeneficio => {
    switch (tipo) {
      case 'porcentaje':
        return 'descuento_porcentaje';
      case 'monto_fijo':
        return 'descuento_fijo';
      case 'producto_gratis':
        // You may want to store the original form tipo somewhere if needed
        // Default to 'regalo' for producto_gratis, or adjust as needed
        return 'regalo';
      default:
        return 'descuento_porcentaje';
    }
  };

  const handleOpenDialog = (beneficio?: Beneficio) => {
    if (beneficio) {
      setEditingBeneficio(beneficio);
      reset({
        titulo: beneficio.titulo,
        descripcion: beneficio.descripcion,
        tipo: mapTipoFromApi(beneficio.tipo as any),
        valor: beneficio.valor,
        asociacionesVinculadas: beneficio.asociacionesVinculadas,
        fechaInicio: beneficio.fechaInicio.toDate(),
        fechaFin: beneficio.fechaFin.toDate(),
        diasValidez: beneficio.diasValidez || [],
        horariosValidez: beneficio.horariosValidez,
        mediosPagoHabilitados: beneficio.mediosPagoHabilitados || [],
        limitePorSocio: beneficio.limitePorSocio,
        limiteTotal: beneficio.limiteTotal,
        condiciones: beneficio.condiciones,
      });
    } else {
      setEditingBeneficio(null);
      reset({
        titulo: '',
        descripcion: '',
        tipo: 'descuento_porcentaje',
        valor: 0,
        asociacionesVinculadas: [],
        fechaInicio: new Date(),
        fechaFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        diasValidez: [],
        mediosPagoHabilitados: [],
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBeneficio(null);
    reset();
  };

  // Map form tipo to API tipo
  const mapTipoToApi = (
    tipo: string
  ): "porcentaje" | "monto_fijo" | "producto_gratis" => {
    switch (tipo) {
      case 'descuento_porcentaje':
        return 'porcentaje';
      case 'descuento_fijo':
        return 'monto_fijo';
      case 'regalo':
      case '2x1':
      case 'envio_gratis':
      case 'puntos':
        return 'producto_gratis';
      default:
        return 'porcentaje'; // fallback, adjust as needed
    }
  };

  const onSubmit = async (data: BeneficioFormData) => {
    let success = false;

    const mappedData: Partial<BeneficioFormData> = {
      ...data,
      tipo: mapTipoToApi(data.tipo),
    };

    if (editingBeneficio) {
      success = await updateBeneficio(editingBeneficio.id, mappedData);
    } else {
      success = await createBeneficio(mappedData);
    }

    if (success) {
      handleCloseDialog();
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, beneficio: Beneficio) => {
    setMenuAnchor(event.currentTarget);
    setSelectedBeneficio(beneficio);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedBeneficio(null);
  };

  const handleToggleStatus = async () => {
    if (selectedBeneficio) {
      const newStatus = selectedBeneficio.estado === 'activo' ? 'inactivo' : 'activo';
      await toggleBeneficioStatus(selectedBeneficio.id, newStatus);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedBeneficio) {
      if (window.confirm(`¿Estás seguro de que quieres eliminar el beneficio "${selectedBeneficio.titulo}"?`)) {
        await deleteBeneficio(selectedBeneficio.id);
      }
    }
    handleMenuClose();
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activo': return '#10b981';
      case 'vencido': return '#f59e0b';
      case 'agotado': return '#ef4444';
      case 'inactivo': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'vencido': return 'Vencido';
      case 'agotado': return 'Agotado';
      case 'inactivo': return 'Inactivo';
      default: return estado;
    }
  };

  const getTipoIcon = (tipo: TipoBeneficio) => {
    switch (tipo) {
      case 'descuento_porcentaje': return <Percent />;
      case 'descuento_fijo': return <AttachMoney />;
      case '2x1': return <CardGiftcard />;
      case 'envio_gratis': return <LocalShipping />;
      case 'regalo': return <CardGiftcard />;
      case 'puntos': return <Star />;
      default: return <LocalOffer />;
    }
  };

  const statsData = [
    {
      title: 'Total Beneficios',
      value: beneficios.length,
      icon: <LocalOffer />,
      color: '#06b6d4',
    },
    {
      title: 'Beneficios Activos',
      value: beneficios.filter(b => b.estado === 'activo').length,
      icon: <TrendingUp />,
      color: '#10b981',
    },
    {
      title: 'Próximos a Vencer',
      value: beneficios.filter(b => {
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return b.fechaFin.toDate() <= weekFromNow && b.fechaFin.toDate() > now;
      }).length,
      icon: <Schedule />,
      color: '#f59e0b',
    },
    {
      title: 'Total Usos',
      value: beneficios.reduce((sum, b) => sum + b.usosActuales, 0),
      icon: <People />,
      color: '#8b5cf6',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Avatar sx={{ width: 60, height: 60, bgcolor: '#06b6d4' }}>
            <LocalOffer sx={{ fontSize: 30 }} />
          </Avatar>
        </motion.div>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
            Gestión de Beneficios
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Crea y administra los beneficios que ofreces a los socios
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#06b6d4',
            '&:hover': { bgcolor: '#0891b2' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Nuevo Beneficio
        </Button>
      </Stack>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4,
        '& > *': {
          flex: '1 1 250px',
          minWidth: '250px'
        }
      }}>
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{ flex: '1 1 250px', minWidth: '250px' }}
          >
            <Card
              elevation={0}
              sx={{
                p: 3,
                background: 'white',
                border: '1px solid #f1f5f9',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: alpha(stat.color, 0.1),
                    color: stat.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#1e293b' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {stat.title}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Benefits Table */}
      <Card
        elevation={0}
        sx={{
          background: 'white',
          border: '1px solid #f1f5f9',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafbfc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Beneficio</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Tipo</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Valor</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Vigencia</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Usos</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {beneficios.map((beneficio, index) => (
                    <motion.tr
                      key={beneficio.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      component={TableRow}
                      sx={{
                        '&:hover': {
                          bgcolor: alpha('#06b6d4', 0.05),
                        }
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: alpha(TIPOS_BENEFICIO[beneficio.tipo].color, 0.1),
                              color: TIPOS_BENEFICIO[beneficio.tipo].color,
                              width: 40,
                              height: 40,
                            }}
                          >
                            {getTipoIcon(beneficio.tipo)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                              {beneficio.titulo}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              {beneficio.descripcion.length > 50 
                                ? `${beneficio.descripcion.substring(0, 50)}...` 
                                : beneficio.descripcion}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={TIPOS_BENEFICIO[beneficio.tipo].label}
                          size="small"
                          sx={{
                            bgcolor: alpha(TIPOS_BENEFICIO[beneficio.tipo].color, 0.1),
                            color: TIPOS_BENEFICIO[beneficio.tipo].color,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {beneficio.tipo === 'descuento_porcentaje' && `${beneficio.valor}%`}
                          {beneficio.tipo === 'descuento_fijo' && `$${beneficio.valor}`}
                          {beneficio.tipo === 'puntos' && `${beneficio.valor} pts`}
                          {!['descuento_porcentaje', 'descuento_fijo', 'puntos'].includes(beneficio.tipo) && 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {format(beneficio.fechaInicio.toDate(), 'dd/MM/yyyy', { locale: es })} - {' '}
                            {format(beneficio.fechaFin.toDate(), 'dd/MM/yyyy', { locale: es })}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {beneficio.usosActuales}
                          </Typography>
                          {beneficio.limiteTotal && (
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                              / {beneficio.limiteTotal}
                            </Typography>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(beneficio.estado)}
                          size="small"
                          sx={{
                            bgcolor: alpha(getStatusColor(beneficio.estado), 0.1),
                            color: getStatusColor(beneficio.estado),
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={(e) => handleMenuClick(e, beneficio)}
                          sx={{ color: '#64748b' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>

          {beneficios.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: alpha('#06b6d4', 0.1),
                  color: '#06b6d4',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <LocalOffer sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                No hay beneficios creados
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Crea tu primer beneficio para comenzar a atraer clientes
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
                sx={{
                  bgcolor: '#06b6d4',
                  '&:hover': { bgcolor: '#0891b2' },
                }}
              >
                Crear Beneficio
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => {
          handleOpenDialog(selectedBeneficio!);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {selectedBeneficio?.estado === 'activo' ? 
              <VisibilityOff fontSize="small" /> : 
              <Visibility fontSize="small" />
            }
          </ListItemIcon>
          <ListItemText>
            {selectedBeneficio?.estado === 'activo' ? 'Desactivar' : 'Activar'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#ef4444' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      {/* Create/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          color: 'white',
          fontWeight: 700,
        }}>
          {editingBeneficio ? 'Editar Beneficio' : 'Crear Nuevo Beneficio'}
        </DialogTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              {/* Basic Information */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                  Información Básica
                </Typography>
              </Box>

              <TextField
                {...register('titulo')}
                label="Título del Beneficio"
                fullWidth
                error={!!errors.titulo}
                helperText={errors.titulo?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#06b6d4',
                    }
                  }
                }}
              />

              <TextField
                {...register('descripcion')}
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#06b6d4',
                    }
                  }
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Beneficio</InputLabel>
                    <Controller
                      name="tipo"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Tipo de Beneficio"
                          sx={{
                            borderRadius: 2,
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#06b6d4',
                            }
                          }}
                        >
                          {Object.entries(TIPOS_BENEFICIO).map(([key, config]) => (
                            <MenuItem key={key} value={key}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                  sx={{
                                    bgcolor: alpha(config.color, 0.1),
                                    color: config.color,
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  {getTipoIcon(key as TipoBeneficio)}
                                </Avatar>
                                <Typography>{config.label}</Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Box>

                {TIPOS_BENEFICIO[selectedTipo].requiresValue && (
                  <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                    <TextField
                      {...register('valor', { valueAsNumber: true })}
                      label={TIPOS_BENEFICIO[selectedTipo].valueLabel}
                      type="number"
                      fullWidth
                      error={!!errors.valor}
                      helperText={errors.valor?.message}
                      inputProps={{
                        min: 0,
                        max: TIPOS_BENEFICIO[selectedTipo].maxValue || undefined,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&.Mui-focused fieldset': {
                            borderColor: '#06b6d4',
                          }
                        }
                      }}
                    />
                  </Box>
                )}
              </Box>

              {/* Validity Period */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                  Período de Validez
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                  <Controller
                    name="fechaInicio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Fecha de Inicio"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&.Mui-focused fieldset': {
                              borderColor: '#06b6d4',
                            }
                          }
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                  <Controller
                    name="fechaFin"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Fecha de Fin"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&.Mui-focused fieldset': {
                              borderColor: '#06b6d4',
                            }
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Advanced Settings */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#374151' }}>
                  Configuración Avanzada
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b' }}>
                  Días de la semana válidos
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {DIAS_SEMANA.map((dia) => (
                    <Controller
                      key={dia.value}
                      name="diasValidez"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={field.value?.includes(dia.value) || false}
                              onChange={(e) => {
                                const currentValues = field.value || [];
                                if (e.target.checked) {
                                  field.onChange([...currentValues, dia.value]);
                                } else {
                                  field.onChange(currentValues.filter(v => v !== dia.value));
                                }
                              }}
                              sx={{
                                color: '#06b6d4',
                                '&.Mui-checked': {
                                  color: '#06b6d4',
                                }
                              }}
                            />
                          }
                          label={dia.label}
                          sx={{ mr: 2, mb: 1 }}
                        />
                      )}
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                  <TextField
                    {...register('limitePorSocio', { valueAsNumber: true })}
                    label="Límite por Socio"
                    type="number"
                    fullWidth
                    helperText="Máximo de usos por socio (opcional)"
                    inputProps={{ min: 1 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused fieldset': {
                          borderColor: '#06b6d4',
                        }
                      }
                    }}
                  />
                </Box>

                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                  <TextField
                    {...register('limiteTotal', { valueAsNumber: true })}
                    label="Límite Total"
                    type="number"
                    fullWidth
                    helperText="Máximo de usos totales (opcional)"
                    inputProps={{ min: 1 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&.Mui-focused fieldset': {
                          borderColor: '#06b6d4',
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              <TextField
                {...register('condiciones')}
                label="Términos y Condiciones"
                fullWidth
                multiline
                rows={3}
                placeholder="Especifica las condiciones de uso del beneficio..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#06b6d4',
                    }
                  }
                }}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: '#64748b',
                '&:hover': {
                  bgcolor: alpha('#64748b', 0.1),
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                bgcolor: '#06b6d4',
                '&:hover': { bgcolor: '#0891b2' },
                minWidth: 120,
              }}
            >
              {isSubmitting ? 'Guardando...' : editingBeneficio ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </motion.div>
  );
};