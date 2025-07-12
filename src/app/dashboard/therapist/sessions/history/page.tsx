'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Checkbox,
  Chip,
  Stack,
  Alert,
  Skeleton,
  Fab,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Download,
  Refresh,
  MoreVert,
  Psychology,
  Notes,
  Schedule,
  Person,
  CalendarToday,
  TrendingUp,
  Assessment,
  FilterList,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionHistory } from '../../../../../hooks/useSessionHistory';
import { useSessionActions } from '../../../../../hooks/useSessionActions';
import SessionHistoryFilters from '../../../../../components/clinical/sessions/SessionHistoryFilters';
import SessionExportModal from '../../../../../components/clinical/sessions/SessionExportModal';
import SessionDetailDrawer from '../../../../../components/clinical/sessions/SessionDetailDrawer';
import StatusBadge from '../../../../../components/ui/StatusBadge';
import EmotionalStateIcon from '../../../../../components/ui/EmotionalStateIcon';
import { Session } from '../../../../../types/session';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SessionHistoryPage() {
  // Estados principales
  const [filters, setFilters] = useState<SessionHistoryFilters>({});
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);

  // Hooks
  const { 
    sessions, 
    loading, 
    error, 
    hasMore, 
    stats, 
    loadMore, 
    refresh,
    clearError 
  } = useSessionHistory(filters, { pageSize: 50 });

  const { analyzeSessionWithAI } = useSessionActions();

  // Datos paginados
  const paginatedSessions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sessions.slice(startIndex, startIndex + rowsPerPage);
  }, [sessions, page, rowsPerPage]);

  // Manejo de selección
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSessions(paginatedSessions.map(session => session.id));
    } else {
      setSelectedSessions([]);
    }
  };

  const handleSelectSession = (sessionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSessions(prev => [...prev, sessionId]);
    } else {
      setSelectedSessions(prev => prev.filter(id => id !== sessionId));
    }
  };

  const isAllSelected = paginatedSessions.length > 0 && 
    paginatedSessions.every(session => selectedSessions.includes(session.id));
  const isIndeterminate = selectedSessions.length > 0 && !isAllSelected;

  // Manejo de acciones
  const handleViewDetails = (session: Session) => {
    setSelectedSession(session);
    setDetailDrawerOpen(true);
  };

  const handleEditNotes = (session: Session) => {
    setSelectedSession(session);
    setDetailDrawerOpen(true);
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const handleRefresh = () => {
    setSelectedSessions([]);
    refresh();
  };

  const clearFilters = () => {
    setFilters({});
    setPage(0);
    setSelectedSessions([]);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd MMM yyyy', { locale: es });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5); // HH:mm
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Box sx={{ p: 3, maxWidth: '100%', mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #2463EB 0%, #1D4ED8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  mb: 1
                }}
              >
                Historial de Sesiones
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Consulta todas tus sesiones clínicas registradas
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Actualizar
              </Button>
              
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExport}
                disabled={sessions.length === 0}
              >
                Exportar
              </Button>
            </Stack>
          </Box>

          {/* Estadísticas rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assessment color="primary" />
                    <Box>
                      <Typography variant="h6" color="primary.main">{stats.total}</Typography>
                      <Typography variant="caption" color="text.secondary">Total</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="success" />
                    <Box>
                      <Typography variant="h6" color="success.main">{stats.completed}</Typography>
                      <Typography variant="caption" color="text.secondary">Finalizadas</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule color="warning" />
                    <Box>
                      <Typography variant="h6" color="warning.main">{stats.pending}</Typography>
                      <Typography variant="caption" color="text.secondary">Pendientes</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ flex: 1, background: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person color="error" />
                    <Box>
                      <Typography variant="h6" color="error.main">{stats.cancelled}</Typography>
                      <Typography variant="caption" color="text.secondary">Canceladas</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </motion.div>
        </Box>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SessionHistoryFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
          loading={loading}
        />
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert 
              severity="error" 
              onClose={clearError}
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabla de sesiones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {/* Header de la tabla con selección */}
          {selectedSessions.length > 0 && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: 'primary.50',
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="primary.main">
                  {selectedSessions.length} sesiones seleccionadas
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<Download />}
                    onClick={handleExport}
                    variant="outlined"
                  >
                    Exportar Seleccionadas
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setSelectedSessions([])}
                    color="error"
                  >
                    Limpiar Selección
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={isIndeterminate}
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      disabled={loading || paginatedSessions.length === 0}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarToday fontSize="small" />
                      Fecha y Hora
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      Paciente
                    </Box>
                  </TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Psychology fontSize="small" />
                      Estados Emocionales
                    </Box>
                  </TableCell>
                  <TableCell>Motivo de Consulta</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notes fontSize="small" />
                      Notas
                    </Box>
                  </TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && sessions.length === 0 ? (
                  // Skeleton loading
                  Array.from({ length: rowsPerPage }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell padding="checkbox">
                        <Skeleton variant="rectangular" width={20} height={20} />
                      </TableCell>
                      <TableCell><Skeleton width="80%" /></TableCell>
                      <TableCell><Skeleton width="60%" /></TableCell>
                      <TableCell><Skeleton width="40%" /></TableCell>
                      <TableCell><Skeleton width="50%" /></TableCell>
                      <TableCell><Skeleton width="90%" /></TableCell>
                      <TableCell><Skeleton width="70%" /></TableCell>
                      <TableCell><Skeleton width="60%" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedSessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No se encontraron sesiones
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Object.keys(filters).length > 0 
                            ? 'Intenta ajustar los filtros de búsqueda'
                            : 'Aún no tienes sesiones registradas'
                          }
                        </Typography>
                        {Object.keys(filters).length > 0 && (
                          <Button
                            variant="outlined"
                            onClick={clearFilters}
                            sx={{ mt: 2 }}
                            startIcon={<FilterList />}
                          >
                            Limpiar Filtros
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSessions.map((session, index) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={undefined}
                      onMouseLeave={undefined}
                      onClick={() => handleViewDetails(session)}
                      style={{
                        cursor: 'pointer'
                      }}
                    >
                      <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedSessions.includes(session.id)}
                          onChange={(e) => handleSelectSession(session.id, e.target.checked)}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={500}>
                            {formatDate(session.date)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(session.time)} • {session.duration}min
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          >
                            {session.patientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </Box>
                          <Typography variant="body2" fontWeight={500}>
                            {session.patientName}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={session.status} />
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {session.emotionalTonePre && (
                            <Tooltip title={`Estado inicial`}>
                              <Box>
                                <EmotionalStateIcon 
                                  state={session.emotionalTonePre} 
                                  size="small" 
                                />
                              </Box>
                            </Tooltip>
                          )}
                          {session.emotionalTonePre && session.emotionalTonePost && (
                            <Typography variant="caption" color="text.secondary">→</Typography>
                          )}
                          {session.emotionalTonePost && (
                            <Tooltip title={`Estado final`}>
                              <Box>
                                <EmotionalStateIcon 
                                  state={session.emotionalTonePost} 
                                  size="small" 
                                />
                              </Box>
                            </Tooltip>
                          )}
                          {!session.emotionalTonePre && !session.emotionalTonePost && (
                            <Typography variant="caption" color="text.secondary">-</Typography>
                          )}
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {truncateText(session.consultationReason, 80)}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box>
                          {session.notes ? (
                            <>
                              <Typography variant="body2">
                                {truncateText(session.notes, 60)}
                              </Typography>
                              {session.summary && (
                                <Chip
                                  label="Con resumen IA"
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                  sx={{ mt: 0.5, fontSize: '0.6875rem' }}
                                />
                              )}
                            </>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Sin notas
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <Tooltip title="Ver detalles">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDetails(session)}
                              color="primary"
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Editar notas">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEditNotes(session)}
                              color="secondary"
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Más opciones">
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                setActionMenuAnchor(e.currentTarget);
                                setSelectedSession(session);
                              }}
                            >
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <TablePagination
            component="div"
            count={sessions.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Filas por página:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
            }
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              '& .MuiTablePagination-toolbar': {
                px: 3,
              },
            }}
          />
        </Card>
      </motion.div>

      {/* FAB para cargar más */}
      <AnimatePresence>
        {hasMore && sessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000,
            }}
          >
            <Fab
              color="primary"
              onClick={loadMore}
              disabled={loading}
              sx={{
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <Badge badgeContent="+" color="secondary">
                <Assessment />
              </Badge>
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu de acciones */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => setActionMenuAnchor(null)}
        PaperProps={{
          sx: { borderRadius: 2, minWidth: 200 }
        }}
      >
        <MenuItem onClick={() => {
          if (selectedSession) handleViewDetails(selectedSession);
          setActionMenuAnchor(null);
        }}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver detalles completos</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          if (selectedSession) handleEditNotes(selectedSession);
          setActionMenuAnchor(null);
        }}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar notas</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => {
          if (selectedSession) {
            setSelectedSessions([selectedSession.id]);
            setExportModalOpen(true);
          }
          setActionMenuAnchor(null);
        }}>
          <ListItemIcon>
            <Download fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exportar sesión</ListItemText>
        </MenuItem>

        {selectedSession?.notes && (
          <MenuItem onClick={async () => {
            if (selectedSession) {
              await analyzeSessionWithAI(
                selectedSession.notes || '', 
                selectedSession.consultationReason
              );
            }
            setActionMenuAnchor(null);
          }}>
            <ListItemIcon>
              <Psychology fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reprocesar con IA</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Modales */}
      <SessionExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        sessions={sessions}
        selectedSessions={selectedSessions}
      />

      <SessionDetailDrawer
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        session={selectedSession}
        onSessionUpdate={refresh}
      />
    </Box>
  );
}
