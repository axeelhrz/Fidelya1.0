'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Grid,
  Alert,
  Skeleton,
  Fab,
  Badge,
} from '@mui/material';
import {
  Add,
  Today,
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
import KPICard from '../../../../../components/dashboard/KPICard';

const TodaySessionsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSession, setSelectedSession] = useState<Session | undefined>();

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
    // TODO: Implement session detail drawer
    console.log('View session details:', session);
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
