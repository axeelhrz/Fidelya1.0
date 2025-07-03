'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Alert,
  Skeleton,
  Fab,
} from '@mui/material';
import {
  Add,
  Schedule,
  CheckCircle,
  PlayArrow,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

import { useTodaySessions } from '../../../../../hooks/useTodaySessions';
import { useSessionActions } from '../../../../../hooks/useSessionActions';
import { Session } from '../../../../../types/session';

import SessionCard from '../../../../../components/clinical/sessions/SessionCard';
import SessionFilters from '../../../../../components/clinical/sessions/SessionFilters';
import SessionModal from '../../../../../components/clinical/sessions/SessionModal';
import SessionDetailDrawer from '../../../../../components/clinical/sessions/SessionDetailDrawer';
import KPICard from '../../../../../components/dashboard/KPICard';

const TodaySessionsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSession, setSelectedSession] = useState<Session | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSession, setDrawerSession] = useState<Session | null>(null);

  const dateString = selectedDate.toISOString().split('T')[0];
  const {
    sessions,
    loading,
    error,
    filters,
    applyFilters,
    refreshSessions,
    totalSessions,
    completedSessions,
    pendingSessions,
  } = useTodaySessions(dateString);

  const { updateSessionStatus } = useSessionActions();

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCreateSession = () => {
    setSelectedSession(undefined);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleViewDetails = (session: Session) => {
    setDrawerSession(session);
    setDrawerOpen(true);
  };

  const handleChangeStatus = async (session: Session, status: Session['status']) => {
    try {
      await updateSessionStatus(session.id, status);
      refreshSessions();
    } catch (error) {
      console.error('Error changing session status:', error);
    }
  };

  const handleModalSuccess = () => {
    refreshSessions();
  };

  const handleDrawerEdit = (session: Session) => {
    setDrawerOpen(false);
    handleEditSession(session);
  };

  const clearFilters = () => {
    applyFilters({});
  };

  const isToday = dateString === new Date().toISOString().split('T')[0];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Sesiones de {isToday ? 'Hoy' : format(selectedDate, 'dd/MM/yyyy', { locale: es })}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestioná tus sesiones clínicas programadas para {isToday ? 'hoy' : 'la fecha seleccionada'}.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <DatePicker
                label="Seleccionar fecha"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
              />
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateSession}
              >
                Registrar Sesión
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* KPI Cards - Using Stack instead of Grid */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={3} 
          sx={{ mb: 4 }}
        >
          <Box sx={{ flex: 1 }}>
            <KPICard
              title="Total Sesiones"
              value={totalSessions}
              icon={<Schedule />}
              color="primary"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <KPICard
              title="Completadas"
              value={completedSessions}
              icon={<CheckCircle />}
              color="success"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <KPICard
              title="Pendientes"
              value={pendingSessions}
              icon={<PlayArrow />}
              color="warning"
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <KPICard
              title="Tasa Finalización"
              value={`${totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%`}
              icon={<CheckCircle />}
              color="info"
            />
          </Box>
        </Stack>

        {/* Filters */}
        <SessionFilters
          filters={filters}
          onFiltersChange={applyFilters}
          onClearFilters={clearFilters}
        />

        {/* Sessions List */}
        <Box>
          {loading ? (
            <Stack spacing={2}>
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={200} />
              ))}
            </Stack>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
              <Button onClick={refreshSessions} sx={{ ml: 2 }}>
                Reintentar
              </Button>
            </Alert>
          ) : sessions.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No hay sesiones programadas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {isToday 
                  ? 'No tienes sesiones programadas para hoy.' 
                  : `No tienes sesiones programadas para ${format(selectedDate, 'dd/MM/yyyy', { locale: es })}.`
                }
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateSession}
              >
                Registrar Primera Sesión
              </Button>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onViewDetails={handleViewDetails}
                  onEditNotes={handleEditSession}
                  onChangeStatus={handleChangeStatus}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add session"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={handleCreateSession}
        >
          <Add />
        </Fab>

        {/* Session Modal */}
        <SessionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          session={selectedSession}
          mode={modalMode}
          onSuccess={handleModalSuccess}
        />

        {/* Session Detail Drawer */}
        <SessionDetailDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          session={drawerSession}
          onEdit={handleDrawerEdit}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default TodaySessionsPage;
