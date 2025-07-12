'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  Calendar,
  Plus,
  Filter,
  Download,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { useAgenda } from '@/hooks/useAgenda';
import AppointmentModal from '@/components/clinical/agenda/AppointmentModal';
import AppointmentDetailsModal from '@/components/clinical/agenda/AppointmentDetailsModal';
import { 
  Appointment, 
  CalendarView, 
  AgendaFilters, 
  CreateAppointmentData,
  AppointmentStatus,
} from '@/types/agenda';
import { format as formatDate, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TherapistAgendaPage() {
  const {
    appointments,
    calendarEvents,
    stats,
    loading,
    error,
    clearError,
    fetchAgendaData,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    exportToCSV,
    exportToICS
  } = useAgenda();

  // State
  const [currentView, setCurrentView] = useState<CalendarView>({
    type: 'week',
    date: new Date()
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    start: Date;
    end: Date;
    title?: string;
    extendedProps?: {
      type?: string;
      appointment?: Appointment;
      motive?: string;
    };
  } | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState<AgendaFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Refs
  const calendarRef = useRef<FullCalendar>(null);

  // Mock data for patients (in real app, this would come from a service)
  const [patients] = useState([
    { id: '1', name: 'María González', phone: '+1234567890', email: 'maria@email.com' },
    { id: '2', name: 'Carlos Rodríguez', phone: '+1234567891', email: 'carlos@email.com' },
    { id: '3', name: 'Ana Martínez', phone: '+1234567892', email: 'ana@email.com' },
    { id: '4', name: 'Luis Pérez', phone: '+1234567893', email: 'luis@email.com' },
    { id: '5', name: 'Carmen López', phone: '+1234567894', email: 'carmen@email.com' }
  ]);

  const [consultorios] = useState([
    'Consultorio 1',
    'Consultorio 2',
    'Consultorio 3',
    'Sala de Terapia Familiar',
    'Sala de Terapia Grupal'
  ]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (currentView.type) {
      case 'day':
        startDate = new Date(currentView.date);
        endDate = new Date(currentView.date);
        break;
      case 'week':
        startDate = startOfWeek(currentView.date, { locale: es });
        endDate = endOfWeek(currentView.date, { locale: es });
        break;
      case 'month':
        startDate = startOfMonth(currentView.date);
        endDate = endOfMonth(currentView.date);
        break;
      default:
        startDate = startOfWeek(today, { locale: es });
        endDate = endOfWeek(today, { locale: es });
    }

    fetchAgendaData(startDate, endDate);
  }, [currentView, fetchAgendaData]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDateClick = (arg: { date: Date; dateStr: string; allDay: boolean; view: { type: string } }) => {
    setSelectedEvent({
      start: arg.date,
      end: new Date(arg.date.getTime() + 60 * 60 * 1000) // 1 hour default
    });
    setSelectedAppointment(null);
    setIsCreating(true);
    setShowAppointmentModal(true);
  };

  const handleEventClick = (clickInfo: { event: { start: Date | null; end: Date | null; title: string; extendedProps: { type?: string; appointment?: Appointment; motive?: string } } }) => {
    const event = clickInfo.event;
    if (!event.start || !event.end) return;
    
    setSelectedEvent({
      start: event.start,
      end: event.end,
      title: event.title,
      extendedProps: event.extendedProps
    });
    
    if (event.extendedProps?.type === 'appointment') {
      setSelectedAppointment(event.extendedProps.appointment || null);
      setIsCreating(false);
      setShowEventDetails(true);
    }
  };

  const handleEventDrop = async (dropInfo: { event: { start: Date | null; end: Date | null; extendedProps: { type?: string; appointment?: Appointment } }; revert: () => void }) => {
    const event = dropInfo.event;
    if (!event.start || !event.end) {
      dropInfo.revert();
      return;
    }

    if (event.extendedProps.type === 'appointment') {
      const appointment = event.extendedProps.appointment;
      if (appointment) {
        const success = await updateAppointment(appointment.id, {
          startDateTime: event.start,
          duration: Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))
        });

        if (!success) {
          dropInfo.revert();
        }
      } else {
        dropInfo.revert();
      }
    }
  };

  const handleEventResize = async (resizeInfo: { event: { start: Date | null; end: Date | null; extendedProps: { type?: string; appointment?: Appointment } }; revert: () => void }) => {
    const event = resizeInfo.event;
    if (!event.start || !event.end) {
      resizeInfo.revert();
      return;
    }

    if (event.extendedProps.type === 'appointment') {
      const appointment = event.extendedProps.appointment;
      if (appointment) {
        const success = await updateAppointment(appointment.id, {
          duration: Math.round((event.end.getTime() - event.start.getTime()) / (1000 * 60))
        });

        if (!success) {
          resizeInfo.revert();
        }
      } else {
        resizeInfo.revert();
      }
    }
  };

  const handleCreateAppointment = async (appointmentData: CreateAppointmentData) => {
    const success = await createAppointment(appointmentData);
    if (success) {
      setShowAppointmentModal(false);
      setSelectedEvent(null);
    }
  };

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    const success = await updateAppointment(appointmentId, { status });
    if (success) {
      setShowEventDetails(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    const success = await deleteAppointment(appointmentId);
    if (success) {
      setShowEventDetails(false);
    }
  };

  const handleEditAppointment = () => {
    setShowEventDetails(false);
    setIsCreating(false);
    setShowAppointmentModal(true);
  };

  const handleViewChange = (viewType: 'day' | 'week' | 'month') => {
    setCurrentView(prev => ({ ...prev, type: viewType }));
    
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(
        viewType === 'day' ? 'timeGridDay' : 
        viewType === 'week' ? 'timeGridWeek' : 
        'dayGridMonth'
      );
    }
  };

  const handleDateNavigation = (direction: 'prev' | 'next' | 'today') => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      
      switch (direction) {
        case 'prev':
          calendarApi.prev();
          break;
        case 'next':
          calendarApi.next();
          break;
        case 'today':
          calendarApi.today();
          break;
      }
      
      setCurrentView(prev => ({ ...prev, date: calendarApi.getDate() }));
    }
  };

  const handleExport = (format: 'csv' | 'ics') => {
    if (format === 'csv') {
      const csvContent = exportToCSV();
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agenda-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'ics') {
      const icsContent = exportToICS();
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agenda-${formatDate(new Date(), 'yyyy-MM-dd')}.ics`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================




  // ============================================================================
  // RENDER FUNCTIONS
  // ============================================================================

  const renderHeader = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
        borderRadius: '1.5rem',
        padding: '2rem',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background effects */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }}
      />
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              borderRadius: '1.25rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Calendar size={28} color="white" />
          </motion.div>
          
          <div>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              color: '#1E40AF',
              textShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
            }}>
              Agenda
            </h1>
            <p style={{ 
              fontSize: '1.125rem',
              color: '#2563EB',
              fontWeight: 600,
              margin: '0.5rem 0 0 0'
            }}>
              Gestioná tu calendario clínico con tus turnos y eventos
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.5rem'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#2563EB' }}>
                {formatDate(currentView.date, 'EEEE, d MMMM yyyy', { locale: es })}
              </span>
              <div style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#1E40AF'
              }}>
                Vista: {currentView.type === 'day' ? 'Día' : currentView.type === 'week' ? 'Semana' : 'Mes'}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedEvent({ start: new Date(), end: new Date(Date.now() + 60 * 60 * 1000) });
              setSelectedAppointment(null);
              setIsCreating(true);
              setShowAppointmentModal(true);
            }}
            style={{
              padding: '0.875rem 1.5rem',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.875rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus size={16} />
            Nueva Cita
          </motion.button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '0.875rem',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: '0.5rem',
                background: showFilters ? '#3B82F6' : 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Filter size={16} color={showFilters ? 'white' : '#3B82F6'} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isDarkMode ? <Sun size={16} color="#3B82F6" /> : <Moon size={16} color="#3B82F6" />}
            </motion.button>

            <div style={{ width: '1px', height: '20px', background: 'rgba(59, 130, 246, 0.2)' }} />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleExport('csv')}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Download size={16} color="#3B82F6" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderFiltersBar = () => (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.25rem',
            padding: '1.5rem',
            border: '1px solid rgba(229, 231, 235, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Buscar Paciente
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#9CA3AF" style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }} />
                <input
                  type="text"
                  placeholder="Nombre del paciente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Estado
              </label>
              <select
                value={filters.status?.[0] || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  status: e.target.value ? [e.target.value as AppointmentStatus] : undefined
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  background: 'white'
                }}
              >
                <option value="">Todos los estados</option>
                <option value="reservada">Reservada</option>
                <option value="confirmada">Confirmada</option>
                <option value="check-in">Check-in</option>
                <option value="no-show">No Show</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Consultorio
              </label>
              <select
                value={filters.consultorio || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  consultorio: e.target.value || undefined
                }))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  background: 'white'
                }}
              >
                <option value="">Todos los consultorios</option>
                {consultorios.map(consultorio => (
                  <option key={consultorio} value={consultorio}>
                    {consultorio}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateNavigation('today')}
                style={{
                  padding: '0.75rem 1rem',
                  background: '#F3F4F6',
                  border: '1px solid #D1D5DB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Hoy
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFilters({});
                  setSearchTerm('');
                }}
                style={{
                  padding: '0.75rem 1rem',
                  background: '#EF4444',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Limpiar
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderCalendarControls = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        padding: '1rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleDateNavigation('prev')}
          style={{
            padding: '0.5rem',
            background: '#F3F4F6',
            border: '1px solid #D1D5DB',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronLeft size={16} color="#374151" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleDateNavigation('next')}
          style={{
            padding: '0.5rem',
            background: '#F3F4F6',
            border: '1px solid #D1D5DB',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ChevronRight size={16} color="#374151" />
        </motion.button>

        <div style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#1F2937',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>
          {formatDate(currentView.date, 'MMMM yyyy', { locale: es })}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.25rem',
        background: '#F3F4F6',
        borderRadius: '0.5rem'
      }}>
        {(['day', 'week', 'month'] as const).map((viewType) => (
          <motion.button
            key={viewType}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewChange(viewType)}
            style={{
              padding: '0.5rem 1rem',
              background: currentView.type === viewType ? '#3B82F6' : 'transparent',
              color: currentView.type === viewType ? 'white' : '#374151',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease'
            }}
          >
            {viewType === 'day' ? 'Día' : viewType === 'week' ? 'Semana' : 'Mes'}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {stats && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.5rem 1rem',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '0.5rem',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>
                {stats.totalAppointments}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Total</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>
                {stats.confirmedAppointments}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Confirmadas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981' }}>
                {Math.round(stats.occupancyRate)}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>Ocupación</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderCalendar = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        minHeight: '600px'
      }}
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={
          currentView.type === 'day' ? 'timeGridDay' :
          currentView.type === 'week' ? 'timeGridWeek' :
          'dayGridMonth'
        }
        headerToolbar={false}
        locale="es"
        events={calendarEvents}
        editable={true}
        droppable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        slotMinTime="07:00:00"
        slotMaxTime="20:00:00"
        slotDuration="00:30:00"
        slotLabelInterval="01:00:00"
        height="auto"
        contentHeight="auto"
        aspectRatio={1.8}
        eventDisplay="block"
        dayHeaderFormat={{ weekday: 'long', day: 'numeric' }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '18:00'
        }}
        eventContent={(eventInfo) => (
          <div style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'white',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ fontWeight: 700 }}>
              {eventInfo.event.title}
            </div>
            {eventInfo.event.extendedProps.type === 'appointment' && (
              <div style={{ fontSize: '0.6875rem', opacity: 0.9 }}>
                {eventInfo.event.extendedProps.motive}
              </div>
            )}
          </div>
        )}
      />
    </motion.div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (loading && appointments.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #3B82F6',
            borderRadius: '50%'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      position: 'relative'
    }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
        `
      }} />

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '2rem',
        position: 'relative',
        zIndex: 1
      }}>
        {renderHeader()}
        {renderFiltersBar()}
        {renderCalendarControls()}
        {renderCalendar()}

        {/* Modals */}
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          onSave={handleCreateAppointment}
          onUpdate={async (id: string, data: Partial<CreateAppointmentData>) => {
            await updateAppointment(id, data);
          }}
          appointment={selectedAppointment}
          selectedDate={selectedEvent?.start}
          patients={patients}
          consultorios={consultorios}
          isCreating={isCreating}
        />

        <AppointmentDetailsModal
          isOpen={showEventDetails}
          onClose={() => setShowEventDetails(false)}
          appointment={selectedAppointment}
          onEdit={handleEditAppointment}
          onDelete={handleDeleteAppointment}
          onStatusChange={handleUpdateAppointmentStatus}
          patient={selectedAppointment ? patients.find(p => p.id === selectedAppointment.patientId) : undefined}
        />

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '0.75rem',
                padding: '1rem 1.5rem',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
                zIndex: 1000,
                maxWidth: '400px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={20} color="#EF4444" />
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#DC2626',
                    marginBottom: '0.25rem'
                  }}>
                    Error
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#7F1D1D'
                  }}>
                    {error}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={clearError}
                  style={{
                    padding: '0.25rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} color="#DC2626" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
