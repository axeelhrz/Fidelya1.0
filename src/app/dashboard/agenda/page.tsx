'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Plus,
  Filter,
  Download,
  Settings,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';
import { CalendarView } from '@/components/clinical/agenda/CalendarView';
import { AppointmentModal } from '@/components/clinical/agenda/AppointmentModal';
import { ClinicalCard } from '@/components/clinical/ClinicalCard';
import { useAppointments, usePatients } from '@/hooks/useClinicalData';
import { Appointment, ExtendedPatient, ConsultingRoom } from '@/types/clinical';

export default function AgendaPage() {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [showFilters, setShowFilters] = useState(false);

  // Hooks para datos
  const { 
    appointments, 
    loading: appointmentsLoading, 
    error: appointmentsError,
    createAppointment,
    updateAppointment,
    checkInAppointment,
    checkOutAppointment,
    cancelAppointment
  } = useAppointments();

  const { 
    patients, 
    loading: patientsLoading 
  } = usePatients();

  // Mock data para desarrollo
  const [rooms] = useState<ConsultingRoom[]>([
    {
      id: 'room1',
      centerId: 'center1',
      name: 'Consultorio 1',
      capacity: 2,
      equipment: ['Sillas', 'Mesa', 'Pizarra'],
      status: 'available',
      location: 'Planta Baja',
      features: [
        { name: 'Aire Acondicionado', icon: '❄️' },
        { name: 'Insonorizado', icon: '🔇' }
      ],
      bookings: []
    },
    {
      id: 'room2',
      centerId: 'center1',
      name: 'Consultorio 2',
      capacity: 4,
      equipment: ['Sillas', 'Mesa', 'TV', 'Juegos'],
      status: 'available',
      location: 'Primera Planta',
      features: [
        { name: 'Familiar', icon: '👨‍👩‍👧‍👦' },
        { name: 'Juegos Infantiles', icon: '🧸' }
      ],
      bookings: []
    },
    {
      id: 'room3',
      centerId: 'center1',
      name: 'Sala de Grupo',
      capacity: 8,
      equipment: ['Sillas en círculo', 'Proyector', 'Pizarra'],
      status: 'available',
      location: 'Primera Planta',
      features: [
        { name: 'Terapia Grupal', icon: '👥' },
        { name: 'Proyector', icon: '📽️' }
      ],
      bookings: []
    }
  ]);

  const [therapists] = useState([
    { id: 'therapist1', firstName: 'Ana', lastName: 'Martín' },
    { id: 'therapist2', firstName: 'Luis', lastName: 'Fernández' },
    { id: 'therapist3', firstName: 'Isabel', lastName: 'Moreno' }
  ]);

  // Calcular métricas del día
  const todayAppointments = appointments.filter(apt => 
    apt.date.toDateString() === new Date().toDateString()
  );

  const todayMetrics = {
    total: todayAppointments.length,
    completed: todayAppointments.filter(apt => apt.status === 'completed').length,
    scheduled: todayAppointments.filter(apt => apt.status === 'scheduled').length,
    cancelled: todayAppointments.filter(apt => apt.status === 'cancelled').length,
    revenue: todayAppointments
      .filter(apt => apt.paid && apt.status === 'completed')
      .reduce((sum, apt) => sum + apt.cost, 0)
  };

  // Handlers
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalMode('view');
    setShowAppointmentModal(true);
  };

  const handleCreateAppointment = (date: Date, roomId: string) => {
    setSelectedAppointment(null);
    setModalMode('create');
    setShowAppointmentModal(true);
  };

  const handleAppointmentMove = async (appointmentId: string, newDate: Date, newRoomId: string) => {
    try {
      await updateAppointment(appointmentId, {
        date: newDate,
        roomId: newRoomId
      });
    } catch (error) {
      console.error('Error moving appointment:', error);
    }
  };

  const handleSaveAppointment = async (appointmentData: Partial<Appointment>) => {
    try {
      if (modalMode === 'create') {
        await createAppointment(appointmentData as any);
      } else if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id, appointmentData);
      }
      setShowAppointmentModal(false);
    } catch (error) {
      console.error('Error saving appointment:', error);
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    try {
      await checkInAppointment(appointmentId);
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleCheckOut = async (appointmentId: string) => {
    try {
      await checkOutAppointment(appointmentId);
    } catch (error) {
      console.error('Error checking out:', error);
    }
  };

  const handleSendReminder = async (appointmentId: string) => {
    // Implementar envío de recordatorio
    console.log('Sending reminder for appointment:', appointmentId);
  };

  if (appointmentsLoading || patientsLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #2563EB',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{
            fontSize: '0.875rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            Cargando agenda...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
      {/* Quick Stats */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <ClinicalCard
            title="Citas Hoy"
            value={todayMetrics.total}
            icon={Calendar}
            iconColor="#2563EB"
            trend={todayMetrics.total > 0 ? { value: 12, isPositive: true } : undefined}
            size="small"
          />
          
          <ClinicalCard
            title="Completadas"
            value={todayMetrics.completed}
            icon={CheckCircle}
            iconColor="#10B981"
            size="small"
          />
          
          <ClinicalCard
            title="Programadas"
            value={todayMetrics.scheduled}
            icon={Clock}
            iconColor="#F59E0B"
            size="small"
          />
          
          <ClinicalCard
            title="Ingresos Hoy"
            value={`€${todayMetrics.revenue}`}
            icon={TrendingUp}
            iconColor="#7C3AED"
            trend={{ value: 8, isPositive: true }}
            size="small"
          />
          
          <ClinicalCard
            title="Ocupación"
            value={`${Math.round((todayMetrics.total / (rooms.length * 8)) * 100)}%`}
            icon={Users}
            iconColor="#EF4444"
            size="small"
          />
        </div>
      </div>

      {/* Calendar */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <CalendarView
          appointments={appointments}
          rooms={rooms}
          therapistSchedules={[]} // TODO: Implement therapist schedules
          onAppointmentClick={handleAppointmentClick}
          onAppointmentMove={handleAppointmentMove}
          onCreateAppointment={handleCreateAppointment}
          onUpdateAppointment={updateAppointment}
          viewMode={viewMode}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        appointment={selectedAppointment}
        patients={patients}
        rooms={rooms}
        therapists={therapists}
        onSave={handleSaveAppointment}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onSendReminder={handleSendReminder}
        mode={modalMode}
      />

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleCreateAppointment(new Date(), rooms[0]?.id || '')}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      >
        <Plus size={24} />
      </motion.button>
    </div>
  );
}