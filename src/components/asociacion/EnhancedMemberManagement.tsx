'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
  alpha,
  Divider,
  Checkbox,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  ButtonGroup,
  Fab,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Badge,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Collapse,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
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
  Visibility,
  Archive,
  Restore,
  Star,
  Sort,
  Refresh,
  PersonAdd,
  Print,
  DeleteForever,
  TrendingUp,
  TrendingDown,
  Remove,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Info,
  Close,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { Socio } from '@/types/socio';
import { 
  doc, 
  deleteDoc, 
  updateDoc, 
  Timestamp,
  collection,
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { format, isAfter, isBefore, subDays, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

interface EnhancedMemberManagementProps {
  socios: Socio[];
  loading: boolean;
  onEdit: (socio: Socio) => void;
  onDelete: (socio: Socio) => void;
  onAdd: () => void;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
  onRefresh?: () => void;
}

interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: unknown) => string;
  sortable?: boolean;
  hideOnMobile?: boolean;
}

interface BulkActionResult {
  success: number;
  failed: number;
  errors: string[];
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const columns: TableColumn[] = [
  { id: 'select', label: '', minWidth: 50 },
  { id: 'avatar', label: '', minWidth: 60, hideOnMobile: true },
  { id: 'nombre', label: 'Socio', minWidth: 200, sortable: true },
  { id: 'email', label: 'Contacto', minWidth: 250, sortable: true, hideOnMobile: true },
  { id: 'estado', label: 'Estado', minWidth: 120, sortable: true },
  { id: 'creadoEn', label: 'Fecha', minWidth: 150, sortable: true, hideOnMobile: true },
  { id: 'engagement', label: 'Engagement', minWidth: 120, hideOnMobile: true },
  { id: 'actions', label: 'Acciones', minWidth: 150, align: 'right' },
];

const TableSkeleton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Card elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 6 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: { xs: 2, md: 4 }, borderBottom: '1px solid #f1f5f9' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
            <Box>
              <Box sx={{ width: { xs: 150, sm: 200 }, height: 28, bgcolor: '#f1f5f9', borderRadius: 2, mb: 1 }} />
              <Box sx={{ width: { xs: 100, sm: 150 }, height: 20, bgcolor: '#f1f5f9', borderRadius: 1 }} />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 140 }, height: 44, bgcolor: '#f1f5f9', borderRadius: 3 }} />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <Box sx={{ flex: 1, height: 56, bgcolor: '#f1f5f9', borderRadius: 4 }} />
            <Box sx={{ width: { xs: '100%', md: 200 }, height: 56, bgcolor: '#f1f5f9', borderRadius: 4 }} />
            <Box sx={{ width: { xs: '100%', md: 120 }, height: 56, bgcolor: '#f1f5f9', borderRadius: 4 }} />
          </Box>
        </Box>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {Array.from({ length: isMobile ? 4 : 8 }).map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 }, py: { xs: 2, md: 3 }, borderBottom: index < (isMobile ? 3 : 7) ? '1px solid #f1f5f9' : 'none' }}>
              <Box sx={{ width: 24, height: 24, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              {!isMobile && <Box sx={{ width: 48, height: 48, bgcolor: '#f1f5f9', borderRadius: '50%' }} />}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ width: '70%', height: 20, bgcolor: '#f1f5f9', borderRadius: 1, mb: 1 }} />
                <Box sx={{ width: '50%', height: 16, bgcolor: '#f1f5f9', borderRadius: 1 }} />
              </Box>
              <Box sx={{ width: { xs: 60, md: 100 }, height: 28, bgcolor: '#f1f5f9', borderRadius: 2 }} />
              <Box sx={{ width: { xs: 40, md: 80 }, height: 36, bgcolor: '#f1f5f9', borderRadius: 2 }} />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// Mobile Card Component for responsive design
const MobileSocioCard: React.FC<{
  socio: Socio;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onMore: (event: React.MouseEvent<HTMLElement>) => void;
  engagementScore: number;
  engagementLevel: { label: string; color: string; icon: React.ReactElement };
  formatDate: (date: any) => string;
  getInitials: (name: string) => string;
  getStatusChip: (estado: string) => React.ReactElement;
}> = ({
  socio,
  isSelected,
  onSelect,
  onEdit,
  onMore,
  engagementScore,
  engagementLevel,
  formatDate,
  getInitials,
  getStatusChip
}) => (
  <Card
    elevation={0}
    sx={{
      border: '1px solid #f1f5f9',
      borderRadius: 4,
      mb: 2,
      bgcolor: isSelected ? alpha('#6366f1', 0.05) : 'white',
      borderColor: isSelected ? '#6366f1' : '#f1f5f9',
      transition: 'all 0.2s ease'
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          sx={{
            color: '#6366f1',
            '&.Mui-checked': { color: '#6366f1' },
            mt: -1
          }}
        />
        
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
        
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5, wordBreak: 'break-word' }}>
                {socio.nombre}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1, wordBreak: 'break-all' }}>
                {socio.email}
              </Typography>
            </Box>
            
            <IconButton
              onClick={onMore}
              size="small"
              sx={{
                color: '#94a3b8',
                '&:hover': {
                  color: '#6366f1',
                  bgcolor: alpha('#6366f1', 0.1),
                },
                ml: 1
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {getStatusChip(socio.estado)}
            <Chip
              label={`${engagementLevel.label} (${engagementScore}%)`}
              size="small"
              sx={{
                bgcolor: alpha(engagementLevel.color, 0.1),
                color: engagementLevel.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 28,
                borderRadius: 2,
              }}
            />
          </Box>
          
          <Stack spacing={1}>
            {socio.telefono && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 14, color: '#94a3b8' }} />
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {socio.telefono}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday sx={{ fontSize: 14, color: '#94a3b8' }} />
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                {formatDate(socio.creadoEn)}
              </Typography>
            </Box>
          </Stack>
          
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              size="small"
              startIcon={<Edit />}
              onClick={onEdit}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#f59e0b',
                '&:hover': {
                  bgcolor: alpha('#f59e0b', 0.1),
                }
              }}
            >
              Editar
            </Button>
            <Button
              size="small"
              startIcon={<Visibility />}
              onClick={() => toast('Vista de perfil en desarrollo', { icon: '👀' })}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#6366f1',
                '&:hover': {
                  bgcolor: alpha('#6366f1', 0.1),
                }
              }}
            >
              Ver
            </Button>
          </Box>
        </Box>
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
  onBulkAction,
  onRefresh
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'vencido' | 'inactivo'>('all');
  const [sortBy, setSortBy] = useState<string>('creadoEn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(isMobile ? 10 : ITEMS_PER_PAGE_OPTIONS[0]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Socio | null>(null);
  const [deleteType, setDeleteType] = useState<'soft' | 'permanent'>('soft');
  const [deleting, setDeleting] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkResultDialog, setBulkResultDialog] = useState(false);
  const [bulkResult, setBulkResult] = useState<BulkActionResult | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Adjust items per page based on screen size
  React.useEffect(() => {
    if (isMobile && itemsPerPage > 10) {
      setItemsPerPage(10);
      setCurrentPage(1);
    }
  }, [isMobile, itemsPerPage]);

  // Cálculo de engagement score basado en datos reales
  const getEngagementScore = useCallback((socio: Socio) => {
    let score = 50; // Base score
    
    // Factores que aumentan el engagement
    if (socio.estado === 'activo') score += 30;
    if (socio.telefono) score += 10;
    if (socio.fechaNacimiento) score += 5;
    if (socio.direccion) score += 5;
    
    // Factor temporal - socios más antiguos tienen más engagement
    if (socio.creadoEn) {
      const createdDate = socio.creadoEn instanceof Date 
        ? socio.creadoEn 
        : (socio.creadoEn as any)?.toDate?.() || new Date();
      const daysSinceCreation = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceCreation > 365) score += 15;
      else if (daysSinceCreation > 180) score += 10;
      else if (daysSinceCreation > 90) score += 5;
    }
    
    return Math.min(100, Math.max(0, score));
  }, []);

  const getEngagementLevel = useCallback((score: number) => {
    if (score >= 80) return { label: 'Muy Alto', color: '#10b981', icon: <TrendingUp /> };
    if (score >= 60) return { label: 'Alto', color: '#f59e0b', icon: <TrendingUp /> };
    if (score >= 40) return { label: 'Medio', color: '#6366f1', icon: <Remove /> };
    return { label: 'Bajo', color: '#ef4444', icon: <TrendingDown /> };
  }, []);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const total = socios.length;
    const activos = socios.filter(s => s.estado === 'activo').length;
    const vencidos = socios.filter(s => s.estado === 'vencido').length;
    const inactivos = socios.filter(s => s.estado === 'inactivo').length;
    
    // Nuevos socios en los últimos 30 días
    const thirtyDaysAgo = subDays(new Date(), 30);
    const nuevos = socios.filter(socio => {
      if (!socio.creadoEn) return false;
      const createdDate = socio.creadoEn instanceof Date 
        ? socio.creadoEn 
        : (socio.creadoEn as any)?.toDate?.() || new Date();
      return isAfter(createdDate, thirtyDaysAgo);
    }).length;

    const avgEngagement = socios.length > 0 
      ? socios.reduce((sum, socio) => sum + getEngagementScore(socio), 0) / socios.length 
      : 0;

    return {
      total,
      activos,
      vencidos,
      inactivos,
      nuevos,
      avgEngagement: Math.round(avgEngagement)
    };
  }, [socios, getEngagementScore]);

  const filtered = useMemo(() => {
    return socios.filter(socio => {
      const matchesSearch = 
        socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.dni?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.telefono?.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || socio.estado === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      let aValue: string | number | Date | undefined = a[sortBy as keyof Socio] as string | number | Date | undefined;
      let bValue: string | number | Date | undefined = b[sortBy as keyof Socio] as string | number | Date | undefined;

      if (sortBy === 'creadoEn') {
        if (
          aValue &&
          typeof aValue === 'object' &&
          'toDate' in aValue &&
          typeof (aValue as { toDate: () => Date }).toDate === 'function'
        ) {
          aValue = (aValue as { toDate: () => Date }).toDate();
        }
        if (
          bValue &&
          typeof bValue === 'object' &&
          'toDate' in bValue &&
          typeof (bValue as { toDate: () => Date }).toDate === 'function'
        ) {
          bValue = (bValue as { toDate: () => Date }).toDate();
        }
      }

      if (sortBy === 'engagement') {
        aValue = getEngagementScore(a);
        bValue = getEngagementScore(b);
      }

      if (sortOrder === 'asc') {
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [socios, searchTerm, statusFilter, sortBy, sortOrder, getEngagementScore]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSocios = filtered.slice(startIndex, startIndex + itemsPerPage);

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

  const handleBulkAction = async (action: string) => {
    if (selectedMembers.length === 0) return;
    
    setBulkProcessing(true);
    setBulkProgress(0);
    
    const batch = writeBatch(db);
    const result: BulkActionResult = { success: 0, failed: 0, errors: [] };
    
    try {
      for (let i = 0; i < selectedMembers.length; i++) {
        const uid = selectedMembers[i];
        const socio = socios.find(s => s.uid === uid);
        
        if (!socio) {
          result.failed++;
          result.errors.push(`Socio con ID ${uid} no encontrado`);
          continue;
        }

        try {
          const docRef = doc(db, 'socios', uid);
          
          switch (action) {
            case 'activate':
              batch.update(docRef, { 
                estado: 'activo', 
                actualizadoEn: Timestamp.now() 
              });
              break;
            case 'deactivate':
              batch.update(docRef, { 
                estado: 'inactivo', 
                actualizadoEn: Timestamp.now() 
              });
              break;
            case 'delete':
              batch.delete(docRef);
              break;
            default:
              result.failed++;
              result.errors.push(`Acción desconocida: ${action}`);
              continue;
          }
          
          result.success++;
        } catch (error) {
          result.failed++;
          result.errors.push(`Error con ${socio.nombre}: ${error}`);
        }
        
        setBulkProgress(((i + 1) / selectedMembers.length) * 100);
      }
      
      if (result.success > 0) {
        await batch.commit();
        toast.success(`${result.success} socios procesados correctamente`);
      }
      
      if (result.failed > 0) {
        toast.error(`${result.failed} socios no pudieron ser procesados`);
      }
      
    } catch (error) {
      console.error('Error en acción masiva:', error);
      toast.error('Error al procesar la acción masiva');
    } finally {
      setBulkProcessing(false);
      setBulkProgress(0);
      setSelectedMembers([]);
      setBulkMenuAnchor(null);
      setBulkResult(result);
      setBulkResultDialog(true);
      
      if (onRefresh) {
        onRefresh();
      }
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    setDeleting(true);
    try {
      if (deleteType === 'permanent') {
        await deleteDoc(doc(db, 'socios', memberToDelete.uid));
        toast.success('Socio eliminado permanentemente');
      } else {
        await updateDoc(doc(db, 'socios', memberToDelete.uid), {
          estado: 'inactivo',
          actualizadoEn: Timestamp.now()
        });
        toast.success('Socio marcado como inactivo');
      }
      
      onDelete(memberToDelete);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error al eliminar socio:', error);
      toast.error('Error al eliminar el socio');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      setAnchorEl(null);
    }
  };

  const exportToCSV = useCallback(() => {
    const selectedSocios = selectedMembers.length > 0 
      ? socios.filter(s => selectedMembers.includes(s.uid))
      : filtered;
    
    const csvContent = [
      ['Nombre', 'Email', 'DNI', 'Teléfono', 'Estado', 'Fecha de Alta', 'Engagement'].join(','),
      ...selectedSocios.map(socio => [
        socio.nombre,
        socio.email,
        socio.dni || '',
        socio.telefono || '',
        socio.estado,
        formatDate(socio.creadoEn),
        getEngagementScore(socio)
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `socios_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exportados ${selectedSocios.length} socios`);
    setSelectedMembers([]);
  }, [selectedMembers, socios, filtered, getEngagementScore]);

  const getStatusChip = (estado: string) => {
    const config = {
      activo: { color: '#10b981', bgcolor: alpha('#10b981', 0.1), label: 'Activo', icon: <CheckCircle /> },
      vencido: { color: '#ef4444', bgcolor: alpha('#ef4444', 0.1), label: 'Vencido', icon: <Warning /> },
      inactivo: { color: '#6b7280', bgcolor: alpha('#6b7280', 0.1), label: 'Inactivo', icon: <ErrorIcon /> }
    };

    const { color, bgcolor, label, icon } = config[estado as keyof typeof config] || config.inactivo;

    return (
      <Chip
        label={label}
        icon={React.cloneElement(icon, { sx: { fontSize: '0.9rem !important' } })}
        size="small"
        sx={{
          bgcolor,
          color,
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 28,
          borderRadius: 2,
          '& .MuiChip-icon': {
            fontSize: '0.9rem',
          }
        }}
      />
    );
  };

  const formatDate = (
    timestamp: Date | { toDate: () => Date } | string | number | null | undefined
  ) => {
    if (!timestamp) return '-';
    let date: Date;
    if (
      timestamp &&
      typeof timestamp === 'object' &&
      'toDate' in timestamp &&
      typeof (timestamp as { toDate: () => Date }).toDate === 'function'
    ) {
      date = (timestamp as { toDate: () => Date }).toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      return '-';
    }
    return format(date, isMobile ? 'dd/MM/yy' : 'dd MMM yyyy', { locale: es });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <TableSkeleton />
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
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
        {/* Enhanced Header with Stats */}
        <CardContent sx={{ p: { xs: 2, md: 4 }, borderBottom: '1px solid #f1f5f9' }}>
          {/* Stats Cards - Responsive Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(4, 1fr)' 
            }, 
            gap: { xs: 1.5, md: 2 }, 
            mb: { xs: 3, md: 4 } 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, p: { xs: 2, md: 3 }, bgcolor: alpha('#10b981', 0.05), borderRadius: 4, border: `1px solid ${alpha('#10b981', 0.1)}` }}>
              <Avatar sx={{ bgcolor: '#10b981', width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 } }}>
                <People sx={{ fontSize: { xs: 20, md: 24 } }} />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 800, color: '#10b981', mb: 0.5, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Total
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, p: { xs: 2, md: 3 }, bgcolor: alpha('#6366f1', 0.05), borderRadius: 4, border: `1px solid ${alpha('#6366f1', 0.1)}` }}>
              <Avatar sx={{ bgcolor: '#6366f1', width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 } }}>
                <CheckCircle sx={{ fontSize: { xs: 20, md: 24 } }} />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 800, color: '#6366f1', mb: 0.5, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {stats.activos}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Activos
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, p: { xs: 2, md: 3 }, bgcolor: alpha('#f59e0b', 0.05), borderRadius: 4, border: `1px solid ${alpha('#f59e0b', 0.1)}` }}>
              <Avatar sx={{ bgcolor: '#f59e0b', width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 } }}>
                <PersonAdd sx={{ fontSize: { xs: 20, md: 24 } }} />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 800, color: '#f59e0b', mb: 0.5, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {stats.nuevos}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Nuevos
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, p: { xs: 2, md: 3 }, bgcolor: alpha('#8b5cf6', 0.05), borderRadius: 4, border: `1px solid ${alpha('#8b5cf6', 0.1)}` }}>
              <Avatar sx={{ bgcolor: '#8b5cf6', width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 } }}>
                <TrendingUp sx={{ fontSize: { xs: 20, md: 24 } }} />
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 800, color: '#8b5cf6', mb: 0.5, fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  {stats.avgEngagement}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Engagement
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 3, mb: { xs: 3, md: 4 } }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Gestión de Socios
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {filtered.length} socios encontrados
                </Typography>
                {selectedMembers.length > 0 && (
                  <Badge badgeContent={selectedMembers.length} color="primary">
                    <Chip
                      label="seleccionados"
                      size="small"
                      sx={{
                        bgcolor: alpha('#6366f1', 0.1),
                        color: '#6366f1',
                        fontWeight: 600,
                      }}
                    />
                  </Badge>
                )}
              </Box>
            </Box>
            
            <Stack direction="row" spacing={1}>
              {!isMobile && (
                <ButtonGroup variant="outlined" size="small">
                  <Tooltip title="Actualizar datos">
                    <IconButton
                      onClick={onRefresh}
                      disabled={loading}
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
                  <Tooltip title="Exportar datos">
                    <IconButton
                      onClick={exportToCSV}
                      sx={{
                        color: '#64748b',
                        borderColor: '#e2e8f0',
                        '&:hover': {
                          bgcolor: alpha('#6366f1', 0.05),
                          borderColor: '#6366f1',
                          color: '#6366f1',
                        }
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              )}
              
              <Button
                onClick={onAdd}
                variant="contained"
                startIcon={<PersonAdd />}
                size={isMobile ? "medium" : "large"}
                sx={{
                  py: { xs: 1, md: 1.5 },
                  px: { xs: 2, md: 4 },
                  borderRadius: 4,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: { xs: '0.875rem', md: '1rem' },
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
                {isMobile ? 'Nuevo' : 'Nuevo Socio'}
              </Button>
            </Stack>
          </Box>

          {/* Mobile Filters Toggle */}
          {isMobile && (
            <Button
              onClick={() => setFiltersOpen(!filtersOpen)}
              startIcon={<FilterList />}
              endIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                borderRadius: 4,
                textTransform: 'none',
                fontWeight: 600,
                borderColor: '#e2e8f0',
                color: '#64748b',
                '&:hover': {
                  borderColor: '#6366f1',
                  color: '#6366f1',
                }
              }}
            >
              Filtros y Búsqueda
            </Button>
          )}

          {/* Enhanced Filters */}
          <Collapse in={!isMobile || filtersOpen}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <TextField
                placeholder="Buscar por nombre, email, DNI o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                size={isMobile ? "medium" : "large"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setSearchTerm('')}
                        size="small"
                        sx={{ color: '#94a3b8' }}
                      >
                        <Close />
                      </IconButton>
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
              
              <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e: SelectChangeEvent) => setStatusFilter(e.target.value as 'all' | 'activo' | 'vencido' | 'inactivo')}
                  label="Estado"
                  size={isMobile ? "medium" : "large"}
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
                  <MenuItem value="all">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Info sx={{ fontSize: 16 }} />
                      Todos ({stats.total})
                    </Box>
                  </MenuItem>
                  <MenuItem value="activo">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
                      Activos ({stats.activos})
                    </Box>
                  </MenuItem>
                  <MenuItem value="vencido">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Warning sx={{ fontSize: 16, color: '#ef4444' }} />
                      Vencidos ({stats.vencidos})
                    </Box>
                  </MenuItem>
                  <MenuItem value="inactivo">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ErrorIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                      Inactivos ({stats.inactivos})
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: { xs: '100%', md: 150 } }}>
                <InputLabel>Mostrar</InputLabel>
                <Select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  label="Mostrar"
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    borderRadius: 4,
                    bgcolor: '#fafbfc',
                    '& fieldset': {
                      borderColor:                      '#e2e8f0',
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
                    <MenuItem key={option} value={option}>
                      {option} por página
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Collapse>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selectedMembers.length > 0 && (
              <Box
                component={motion.div}
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
                    p: { xs: 2, md: 3 },
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#6366f1', width: 32, height: 32 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'white' }}>
                          {selectedMembers.length}
                        </Typography>
                      </Avatar>
                      <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                        socios seleccionados
                      </Typography>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                      <Button
                        size="small"
                        startIcon={<Email />}
                        onClick={() => toast('Función de email en desarrollo', { icon: '📧' })}
                        sx={{ textTransform: 'none', fontWeight: 600, justifyContent: { xs: 'flex-start', sm: 'center' } }}
                      >
                        Enviar Email
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={exportToCSV}
                        sx={{ textTransform: 'none', fontWeight: 600, justifyContent: { xs: 'flex-start', sm: 'center' } }}
                      >
                        Exportar
                      </Button>
                      <Button
                        size="small"
                        startIcon={<MoreVert />}
                        onClick={(e) => setBulkMenuAnchor(e.currentTarget)}
                        sx={{ textTransform: 'none', fontWeight: 600, justifyContent: { xs: 'flex-start', sm: 'center' } }}
                      >
                        Más acciones
                      </Button>
                    </Stack>
                  </Box>
                  
                  {bulkProcessing && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                          Procesando...
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 600 }}>
                          {Math.round(bulkProgress)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={bulkProgress} 
                        sx={{ 
                          borderRadius: 2,
                          height: 8,
                          bgcolor: alpha('#6366f1', 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#6366f1',
                            borderRadius: 2,
                          }
                        }} 
                      />
                    </Box>
                  )}
                </Paper>
              </Box>
            )}
          </AnimatePresence>
        </CardContent>

        {/* Content - Mobile Cards or Desktop Table */}
        {paginatedSocios.length === 0 ? (
          <Box sx={{ p: { xs: 4, md: 8 }, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: { xs: 60, md: 80 },
                height: { xs: 60, md: 80 },
                bgcolor: alpha('#6b7280', 0.1),
                color: '#6b7280',
                mx: 'auto',
                mb: 3,
              }}
            >
              <People sx={{ fontSize: { xs: 30, md: 40 } }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, fontSize: { xs: '1.125rem', md: '1.25rem' } }}>
              No hay socios
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 400, mx: 'auto', fontSize: { xs: '0.875rem', md: '1rem' } }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron socios con los filtros aplicados'
                : 'Comienza agregando tu primer socio'
              }
            </Typography>
            {(!searchTerm && statusFilter === 'all') && (
              <Button
                onClick={onAdd}
                variant="contained"
                startIcon={<Add />}
                size={isMobile ? "medium" : "large"}
                sx={{
                  py: { xs: 1, md: 1.5 },
                  px: { xs: 3, md: 4 },
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
                Agregar Primer Socio
              </Button>
            )}
          </Box>
        ) : (
          <>
            {/* Mobile View - Cards */}
            {isMobile ? (
              <Box sx={{ p: 2 }}>
                {paginatedSocios.map((socio, index) => {
                  const isSelected = selectedMembers.includes(socio.uid);
                  const engagementScore = getEngagementScore(socio);
                  const engagementLevel = getEngagementLevel(engagementScore);
                  
                  return (
                    <Box
                      key={socio.uid}
                      component={motion.div}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <MobileSocioCard
                        socio={socio}
                        isSelected={isSelected}
                        onSelect={(checked) => handleSelectMember(socio.uid, checked)}
                        onEdit={() => onEdit(socio)}
                        onMore={(e) => {
                          setAnchorEl(e.currentTarget);
                          setMemberToDelete(socio);
                        }}
                        engagementScore={engagementScore}
                        engagementLevel={engagementLevel}
                        formatDate={formatDate}
                        getInitials={getInitials}
                        getStatusChip={getStatusChip}
                      />
                    </Box>
                  );
                })}
              </Box>
            ) : (
              /* Desktop View - Table */
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
                      {columns.slice(1, -1).map((column) => (
                        !column.hideOnMobile && (
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
                              display: { xs: column.hideOnMobile ? 'none' : 'table-cell', md: 'table-cell' }
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
                        )
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
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
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
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
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
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarToday sx={{ fontSize: 14, color: '#94a3b8' }} />
                              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                                {formatDate(socio.creadoEn)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
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
                                {engagementLevel.label} ({engagementScore}%)
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <Tooltip title="Ver perfil">
                                <IconButton
                                  size="small"
                                  onClick={() => toast('Vista de perfil en desarrollo', { icon: '👀' })}
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
                              <Tooltip title="Más opciones">
                                <IconButton
                                  onClick={(e) => {
                                    setAnchorEl(e.currentTarget);
                                    setMemberToDelete(socio);
                                  }}
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
            )}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <Box sx={{ 
                p: { xs: 2, md: 4 }, 
                borderTop: '1px solid #f1f5f9', 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: 2
              }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                  Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filtered.length)} de {filtered.length} socios
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            m: isMobile ? 0 : 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: deleteType === 'permanent' ? alpha('#ef4444', 0.1) : alpha('#f59e0b', 0.1),
                color: deleteType === 'permanent' ? '#ef4444' : '#f59e0b',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
              }}
            >
              {deleteType === 'permanent' ? <DeleteForever /> : <Archive />}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: { xs: '1.125rem', md: '1.25rem' } }}>
                {deleteType === 'permanent' ? 'Eliminar Permanentemente' : 'Desactivar Socio'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', wordBreak: 'break-word' }}>
                {memberToDelete?.nombre}
              </Typography>
            </Box>
            {isMobile && (
              <IconButton
                onClick={() => setDeleteDialogOpen(false)}
                sx={{ color: '#64748b' }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 3, p: { xs: 2, md: 3 } }}>
          <Alert 
            severity={deleteType === 'permanent' ? 'error' : 'warning'} 
            sx={{ mb: 3, borderRadius: 3 }}
          >
            {deleteType === 'permanent' 
              ? 'Esta acción eliminará permanentemente al socio de Firebase. No se puede deshacer.'
              : 'Esta acción marcará al socio como inactivo. Podrás reactivarlo más tarde.'
            }
          </Alert>
          
          <Typography variant="body1" sx={{ color: '#475569', mb: 2 }}>
            ¿Estás seguro de que deseas {deleteType === 'permanent' ? 'eliminar permanentemente' : 'desactivar'} a este socio?
          </Typography>
          
          <Box sx={{ mt: 3, p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
              <strong>Opciones de eliminación:</strong>
            </Typography>
            <Stack spacing={1}>
              <Button
                variant={deleteType === 'soft' ? 'contained' : 'outlined'}
                size="small"
                startIcon={<Archive />}
                onClick={() => setDeleteType('soft')}
                fullWidth={isMobile}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  bgcolor: deleteType === 'soft' ? '#f59e0b' : 'transparent',
                  borderColor: deleteType === 'soft' ? '#f59e0b' : '#e2e8f0',
                  color: deleteType === 'soft' ? 'white' : '#64748b',
                  '&:hover': {
                    bgcolor: deleteType === 'soft' ? '#d97706' : alpha('#f59e0b', 0.1),
                    borderColor: '#f59e0b',
                    color: deleteType === 'soft' ? 'white' : '#f59e0b',
                  }
                }}
              >
                Desactivar (recomendado)
              </Button>
              <Button
                variant={deleteType === 'permanent' ? 'contained' : 'outlined'}
                size="small"
                startIcon={<DeleteForever />}
                onClick={() => setDeleteType('permanent')}
                fullWidth={isMobile}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  bgcolor: deleteType === 'permanent' ? '#ef4444' : 'transparent',
                  borderColor: deleteType === 'permanent' ? '#ef4444' : '#e2e8f0',
                  color: deleteType === 'permanent' ? 'white' : '#64748b',
                  '&:hover': {
                    bgcolor: deleteType === 'permanent' ? '#dc2626' : alpha('#ef4444', 0.1),
                    borderColor: '#ef4444',
                    color: deleteType === 'permanent' ? 'white' : '#ef4444',
                  }
                }}
              >
                Eliminar permanentemente
              </Button>
            </Stack>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 0, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
            fullWidth={isMobile}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteMember}
            disabled={deleting}
            variant="contained"
            fullWidth={isMobile}
            startIcon={deleting ? <CircularProgress size={16} /> : (deleteType === 'permanent' ? <DeleteForever /> : <Archive />)}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: deleteType === 'permanent' ? '#ef4444' : '#f59e0b',
              '&:hover': {
                bgcolor: deleteType === 'permanent' ? '#dc2626' : '#d97706',
              }
            }}
          >
            {deleting ? 'Procesando...' : (deleteType === 'permanent' ? 'Eliminar Permanentemente' : 'Desactivar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Action Result Dialog */}
      <Dialog
        open={bulkResultDialog}
        onClose={() => setBulkResultDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
            m: isMobile ? 0 : 2,
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, p: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: bulkResult?.failed === 0 ? alpha('#10b981', 0.1) : alpha('#f59e0b', 0.1),
                color: bulkResult?.failed === 0 ? '#10b981' : '#f59e0b',
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
              }}
            >
              {bulkResult?.failed === 0 ? <CheckCircle /> : <Warning />}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: { xs: '1.125rem', md: '1.25rem' } }}>
                Resultado de Acción Masiva
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                {bulkResult?.success} exitosos, {bulkResult?.failed} fallidos
              </Typography>
            </Box>
            {isMobile && (
              <IconButton
                onClick={() => setBulkResultDialog(false)}
                sx={{ color: '#64748b' }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 3, p: { xs: 2, md: 3 } }}>
          {bulkResult && (
            <Stack spacing={2}>
              {bulkResult.success > 0 && (
                <Alert severity="success" sx={{ borderRadius: 3 }}>
                  {bulkResult.success} socios procesados correctamente
                </Alert>
              )}
              
              {bulkResult.failed > 0 && (
                <Alert severity="error" sx={{ borderRadius: 3 }}>
                  {bulkResult.failed} socios no pudieron ser procesados
                </Alert>
              )}
              
              {bulkResult.errors.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Errores detallados:
                  </Typography>
                  <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                    {bulkResult.errors.map((error, index) => (
                      <Typography key={index} variant="caption" sx={{ display: 'block', color: '#ef4444', mb: 0.5 }}>
                        • {error}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
          <Button
            onClick={() => setBulkResultDialog(false)}
            variant="contained"
            fullWidth={isMobile}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

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
        <MenuItem onClick={() => {
          if (memberToDelete) onEdit(memberToDelete);
          setAnchorEl(null);
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar Socio</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          toast('Función de email en desarrollo', { icon: '📧' });
          setAnchorEl(null);
        }}>
          <ListItemIcon>
            <Email fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enviar Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          toast('Función de favoritos en desarrollo', { icon: '⭐' });
          setAnchorEl(null);
        }}>
          <ListItemIcon>
            <Star fontSize="small" />
          </ListItemIcon>
          <ListItemText>Marcar Favorito</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          setDeleteType('soft');
          setDeleteDialogOpen(true);
          setAnchorEl(null);
        }}>
          <ListItemIcon>
            <Archive fontSize="small" />
          </ListItemIcon>
          <ListItemText>Desactivar</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          setDeleteType('permanent');
          setDeleteDialogOpen(true);
          setAnchorEl(null);
        }} sx={{ color: '#ef4444' }}>
          <ListItemIcon>
            <DeleteForever fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Eliminar Permanentemente</ListItemText>
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
        <MenuItem onClick={() => handleBulkAction('deactivate')} disabled={bulkProcessing}>
          <ListItemIcon>
            <Archive fontSize="small" />
          </ListItemIcon>
          <ListItemText>Desactivar Seleccionados</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleBulkAction('activate')} disabled={bulkProcessing}>
          <ListItemIcon>
            <Restore fontSize="small" />
          </ListItemIcon>
          <ListItemText>Activar Seleccionados</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          toast('Función de impresión en desarrollo', { icon: '🖨️' });
          setBulkMenuAnchor(null);
        }}>
          <ListItemIcon>
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText>Imprimir Lista</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleBulkAction('delete')} disabled={bulkProcessing} sx={{ color: '#ef4444' }}>
          <ListItemIcon>
            <DeleteForever fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          <ListItemText>Eliminar Seleccionados</ListItemText>
        </MenuItem>
      </Menu>

      {/* Floating Action Button - Only on Mobile */}
      {isMobile && (
        <Zoom in={selectedMembers.length === 0 && !bulkProcessing}>
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
      )}
    </Box>
  );
};

