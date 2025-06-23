'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
  Avatar,
  useTheme,
  alpha,
  Divider,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Badge,
  ButtonGroup,
  Fab,
  Zoom,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Email,
  Phone,
  CalendarToday,
  People,
  FilterList,
  MoreVert,
  Download,
  Upload,
  Visibility,
  Send,
  Archive,
  Restore,
  Star,
  StarBorder,
  Sort,
  ViewColumn,
  Refresh,
  PersonAdd,
  GroupAdd,
  Settings,
  Analytics,
  Print,
  Share,
} from '@mui/icons-material';
import { Socio } from '@/types/socio';

interface EnhancedMemberManagementProps {
  socios: Socio[];
  loading: boolean;
  onEdit: (socio: Socio) => void;
  onDelete: (socio: Socio) => void;
  onAdd: () => void;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
}

interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
  sortable?: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const columns: TableColumn[] = [
  { id: 'select', label: '', minWidth: 50 },
  { id: 'avatar', label: '', minWidth: 60 },
  { id: 'nombre', label: 'Miembro', minWidth: 200, sortable: true },
  { id: 'email', label: 'Contacto', minWidth: 250, sortable: true },
  { id: 'estado', label: 'Estado', minWidth: 120, sortable: true },
  { id: 'creadoEn', label: 'Fecha de Alta', minWidth: 150, sortable: true },
  { id: 'engagement', label: 'Engagement', minWidth: 120 },
  { id: 'actions', label: 'Acciones', minWidth: 150, align: 'right' },
];

const TableSkeleton: React.FC = () => (
  <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 6 }}>
    <CardContent sx={{ p: 0 }}>
      <Box sx={{ p: 4, borderBottom: '1px solid #f1f5f9' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Box sx={{ width: 200, height: 28, bgcolor: '#f1f5f9', borderRadius: 2, mb: 1 }} />
            <Box sx={{ width: 150, height: 20, bgcolor: '#f1f5f9', borderRadius: 1 }} />
          </Box>
          <Box sx={{ width: 140, height: 44, bgcolor: '#f1f5f9', borderRadius: 3 }} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ flex: 1, height: 56, bgcolor: '#f1f5f9', borderRadius: 4 }} />
          <Box sx={{ width: 200, height: 56, bgcolor: '#f1f5f9', borderRadius: 4 }} />
          <Box sx={{ width: 120, height: 56, bgcolor: '#f1f5f9', borderRadius: 4 }} />
        </Box>
      </Box>
      <Box sx={{ p: 4 }}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 3, py: 3, borderBottom: index < 7 ? '1px solid #f1f5f9' : 'none' }}>
            <Box sx={{ width: 24, height: 24, bgcolor: '#f1f5f9', borderRadius: 1 }} />
            <Box sx={{ width: 48, height: 48, bgcolor: '#f1f5f9', borderRadius: '50%' }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ width: '70%', height: 20, bgcolor: '#f1f5f9', borderRadius: 1, mb: 1 }} />
              <Box sx={{ width: '50%', height: 16, bgcolor: '#f1f5f9', borderRadius: 1 }} />
            </Box>
            <Box sx={{ width: 100, height: 28, bgcolor: '#f1f5f9', borderRadius: 2 }} />
            <Box sx={{ width: 80, height: 36, bgcolor: '#f1f5f9', borderRadius: 2 }} />
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);

export const EnhancedMemberManagement: React.FC<EnhancedMemberManagementProps> = ({
  socios,
  loading,
  onEdit,
  onDelete,
  onAdd,
  onBulkAction
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'vencido'>('all');
  const [sortBy, setSortBy] = useState<string>('creadoEn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);

  // Mock engagement scores (in real app, this would come from your data)
  const getEngagementScore = (socio: Socio) => {
    return Math.floor(Math.random() * 100) + 1;
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { label: 'Muy Alto', color: '#10b981' };
    if (score >= 60) return { label: 'Alto', color: '#f59e0b' };
    if (score >= 40) return { label: 'Medio', color: '#6366f1' };
    return { label: 'Bajo', color: '#ef4444' };
  };

  const filteredAndSortedSocios = useMemo(() => {
    let filtered = socios.filter(socio => {
      const matchesSearch = 
        socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.telefono?.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || socio.estado === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Socio];
      let bValue: any = b[sortBy as keyof Socio];

      if (sortBy === 'creadoEn') {
        aValue = aValue?.toDate?.() || new Date(aValue);
        bValue = bValue?.toDate?.() || new Date(bValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [socios, searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedSocios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSocios = filteredAndSortedSocios.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(paginatedSocios.map(socio => socio.uid));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (uid: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, uid]);
    } else {
      setSelectedMembers(selectedMembers.filter(id => id !== uid));
    }
  };

  const handleBulkAction = (action: string) => {
    if (onBulkAction && selectedMembers.length > 0) {
      onBulkAction(action, selectedMembers);
      setSelectedMembers([]);
    }
    setBulkMenuAnchor(null);
  };

  const getStatusChip = (estado: string) => {
    const config = {
      activo: { color: '#10b981', bgcolor: alpha('#10b981', 0.1), label: 'Activo' },
      vencido: { color: '#ef4444', bgcolor: alpha('#ef4444', 0.1), label: 'Vencido' },
      inactivo: { color: '#6b7280', bgcolor: alpha('#6b7280', 0.1), label: 'Inactivo' }
    };

    const { color, bgcolor, label } = config[estado as keyof typeof config] || config.inactivo;

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          bgcolor,
          color,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
          borderRadius: 2,
        }}
      />
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <TableSkeleton />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card
        elevation={0}
        sx={{
          border: '1px solid #f1f5f9',
          borderRadius: 6,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        }}
      >
        {/* Enhanced Header */}
        <CardContent sx={{ p: 4, borderBottom: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 3, mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontSize: '1.5rem' }}>
                Gestión Avanzada de Miembros
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {filteredAndSortedSocios.length} miembros encontrados
                </Typography>
                {selectedMembers.length > 0 && (
                  <Chip
                    label={`${selectedMembers.length} seleccionados`}
                    size="small"
                    sx={{
                      bgcolor: alpha('#6366f1', 0.1),
                      color: '#6366f1',
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Box>
            
            <Stack direction="row" spacing={2}>
              <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Vista de tabla">
                  <IconButton
                    onClick={() => setViewMode('table')}
                    sx={{
                      bgcolor: viewMode === 'table' ? alpha('#6366f1', 0.1) : 'transparent',
                      color: viewMode === 'table' ? '#6366f1' : '#64748b',
                      borderColor: '#e2e8f0',
                      '&:hover': {
                        bgcolor: alpha('#6366f1', 0.05),
                        borderColor: '#6366f1',
                      }
                    }}
                  >
                    <ViewColumn />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Actualizar datos">
                  <IconButton
                    sx={{
                      color: '#64748b',
                      borderColor: '#e2e8f0',
                      '&:hover': {
                        bgcolor: alpha('#10b981', 0.05),
                        borderColor: '#10b981',
                        color: '#10b981',
                      }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
              
              <Button
                onClick={onAdd}
                variant="contained"
                startIcon={<PersonAdd />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 25px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Nuevo Miembro
              </Button>
            </Stack>
          </Box>

          {/* Enhanced Filters */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
            <TextField
              placeholder="Buscar por nombre, email, DNI o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  bgcolor: '#fafbfc',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                  }
                },
              }}
            />
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                label="Estado"
                startAdornment={<FilterList sx={{ color: '#94a3b8', mr: 1 }} />}
                sx={{
                  borderRadius: 4,
                  bgcolor: '#fafbfc',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                  }
                }}
              >
                <MenuItem value="all">Todos los estados</MenuItem>
                <MenuItem value="activo">Activos</MenuItem>
                <MenuItem value="vencido">Vencidos</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Mostrar</InputLabel>
              <Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                label="Mostrar"
                sx={{
                  borderRadius: 4,
                  bgcolor: '#fafbfc',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366f1',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1',
                    borderWidth: 2,
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                  }
                }}
              >
                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>{option} por página</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: alpha('#6366f1', 0.05),
                    border: `1px solid ${alpha('#6366f1', 0.2)}`,
                    borderRadius: 4,
                    p: 3,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                      {selectedMembers.length} miembros seleccionados
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<Email />}
                        onClick={() => handleBulkAction('email')}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Enviar Email
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={() => handleBulkAction('export')}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Exportar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Archive />}
                        onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Más acciones
                      </Button>
                    </Stack>
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        {/* Enhanced Table */}
        {paginatedSocios.length === 0 ? (
          <Box sx={{ p: 8, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: alpha('#6b7280', 0.1),
                color: '#6b7280',
                mx: 'auto',
                mb: 3,
              }}
            >
              <People sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              No hay miembros
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 400, mx: 'auto' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron miembros con los filtros aplicados'
                : 'Comienza agregando tu primer miembro'
              }
            </Typography>
            {(!searchTerm && statusFilter === 'all') && (
              <Button
                onClick={onAdd}
                variant="contained"
                startIcon={<Add />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 25px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Agregar Primer Miembro
              </Button>
            )}
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafbfc' }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selectedMembers.length > 0 && selectedMembers.length < paginatedSocios.length}
                        checked={paginatedSocios.length > 0 && selectedMembers.length === paginatedSocios.length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        sx={{
                          color: '#6366f1',
                          '&.Mui-checked': {
                            color: '#6366f1',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell />
                    {columns.slice(2, -1).map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ 
                          fontWeight: 700, 
                          color: '#475569', 
                          fontSize: '0.8rem', 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em',
                          cursor: column.sortable ? 'pointer' : 'default',
                          '&:hover': column.sortable ? { color: '#6366f1' } : {},
                        }}
                        onClick={() => column.sortable && handleSort(column.id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {column.label}
                          {column.sortable && (
                            <Sort 
                              sx={{ 
                                fontSize: 16, 
                                opacity: sortBy === column.id ? 1 : 0.3,
                                transform: sortBy === column.id && sortOrder === 'desc' ? 'rotate(180deg)' : 'none',
                                transition: 'all 0.2s ease'
                              }} 
                            />
                          )}
                        </Box>
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSocios.map((socio, index) => {
                    const isSelected = selectedMembers.includes(socio.uid);
                    const engagementScore = getEngagementScore(socio);
                    const engagementLevel = getEngagementLevel(engagementScore);
                    
                    return (
                      <TableRow
                        key={socio.uid}
                        component={motion.tr}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        sx={{
                          bgcolor: isSelected ? alpha('#6366f1', 0.05) : 'transparent',
                          '&:hover': {
                            bgcolor: isSelected ? alpha('#6366f1', 0.08) : '#fafbfc',
                          },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => handleSelectMember(socio.uid, e.target.checked)}
                            sx={{
                              color: '#6366f1',
                              '&.Mui-checked': {
                                color: '#6366f1',
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              bgcolor: alpha('#6366f1', 0.1),
                              color: '#6366f1',
                              fontWeight: 700,
                              fontSize: '1rem',
                              borderRadius: 3,
                            }}
                          >
                            {getInitials(socio.nombre)}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                              {socio.nombre}
                            </Typography>
                            {socio.dni && (
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                DNI: {socio.dni}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Email sx={{ fontSize: 14, color: '#94a3b8' }} />
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                {socio.email}
                              </Typography>
                            </Box>
                            {socio.telefono && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone sx={{ fontSize: 14, color: '#94a3b8' }} />
                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                  {socio.telefono}
                                </Typography>
                              </Box>
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(socio.estado)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarToday sx={{ fontSize: 14, color: '#94a3b8' }} />
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                              {formatDate(socio.creadoEn)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: engagementLevel.color,
                              }}
                            />
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                              {engagementLevel.label}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="Ver perfil">
                              <IconButton
                                size="small"
                                sx={{
                                  color: '#94a3b8',
                                  '&:hover': {
                                    color: '#6366f1',
                                    bgcolor: alpha('#6366f1', 0.1),
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Visibility sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton
                                onClick={() => onEdit(socio)}
                                size="small"
                                sx={{
                                  color: '#94a3b8',
                                  '&:hover': {
                                    color: '#f59e0b',
                                    bgcolor: alpha('#f59e0b', 0.1),
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Edit sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton
                                onClick={() => onDelete(socio)}
                                size="small"
                                sx={{
                                  color: '#94a3b8',
                                  '&:hover': {
                                    color: '#ef4444',
                                    bgcolor: alpha('#ef4444', 0.1),
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Delete sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Más opciones">
                              <IconButton
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                                size="small"
                                sx={{
                                  color: '#94a3b8',
                                  '&:hover': {
                                    color: '#6366f1',
                                    bgcolor: alpha('#6366f1', 0.1),
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <MoreVert sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <Box sx={{ p: 4, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredAndSortedSocios.length)} de {filteredAndSortedSocios.length} miembros
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      '&.Mui-selected': {
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
                        }
                      },
                      '&:hover': {
                        bgcolor: alpha('#6366f1', 0.1),
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Card>

      {/* Context Menus */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid #f1f5f9',
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <Email fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enviar Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <Star fontSize="small" />
          </ListItemIcon>
          <ListItemText>Marcar Favorito</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <Archive fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archivar</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: '#ef4444' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid #f1f5f9',
            minWidth: 200,
          }
        }}
      >
        <MenuItem onClick={() => handleBulkAction('archive')}>
          <ListItemIcon>
            <Archive fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archivar Seleccionados</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('activate')}>
          <ListItemIcon>
            <Restore fontSize="small" />
          </ListItemIcon>
          <ListItemText>Activar Seleccionados</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('print')}>
          <ListItemIcon>
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText>Imprimir Lista</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleBulkAction('delete')} sx={{ color: '#ef4444' }}>
          <ListItemIcon>
            <Delete fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Eliminar Seleccionados</ListItemText>
        </MenuItem>
      </Menu>

      {/* Floating Action Button */}
      <Zoom in={selectedMembers.length === 0}>
        <Fab
          color="primary"
          onClick={onAdd}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)',
              transform: 'scale(1.1)',
              boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          <Add />
        </Fab>
      </Zoom>
    </motion.div>
  );
};