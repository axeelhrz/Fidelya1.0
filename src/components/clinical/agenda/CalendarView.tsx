'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Plus,
  Filter,
  AlertTriangle,
  Users,
  MapPin,
  Video,
  Coffee,
  Plane,
  AlertCircle
} from 'lucide-react';
import { Appointment, ConsultingRoom, TherapistSchedule } from '@/types/clinical';
import { AppointmentCard } from '../AppointmentCard';

interface CalendarViewProps {
  appointments: Appointment[];
  rooms: ConsultingRoom[];
  therapistSchedules: TherapistSchedule[];
  onAppointmentClick: (appointment: Appointment) => void;
  onAppointmentMove: (appointmentId: string, newDate: Date, newRoomId: string) => void;
  onCreateAppointment: (date: Date, roomId: string) => void;
  onUpdateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  viewMode: 'day' | 'week' | 'month';
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: 'day' | 'week' | 'month') => void;
}

export function CalendarView({
  appointments,
  rooms,
  therapistSchedules,
  onAppointmentClick,
  onAppointmentMove,
  onCreateAppointment,
  onUpdateAppointment,
  viewMode,
  selectedDate,
  onDateChange,
  onViewModeChange
}: CalendarViewProps) {
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<{ date: Date; roomId: string } | null>(null);
  const [showConflicts, setShowConflicts] = useState(true);
  const [selectedTherapist, setSelectedTherapist] = useState<string>('all');

  // Generate time slots (30-minute intervals from 8:00 to 20:00)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(8 + i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // Get dates for current view
  const getViewDates = useCallback(() => {
    const dates: Date[] = [];
    
    if (viewMode === 'day') {
      dates.push(new Date(selectedDate));
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(selectedDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
      startOfWeek.setDate(diff);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(date);
      }
    } else if (viewMode === 'month') {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Start from Monday of the first week
      const startDate = new Date(firstDay);
      const startDay = firstDay.getDay();
      startDate.setDate(firstDay.getDate() - (startDay === 0 ? 6 : startDay - 1));
      
      // End at Sunday of the last week
      const endDate = new Date(lastDay);
      const endDay = lastDay.getDay();
      endDate.setDate(lastDay.getDate() + (endDay === 0 ? 0 : 7 - endDay));
      
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return dates;
  }, [selectedDate, viewMode]);

  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    onDateChange(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  // Get appointments for a specific date and time slot
  const getAppointmentsForSlot = (date: Date, timeSlot: string, roomId?: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(hours, minutes, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    return appointments.filter(appointment => {
      const appointmentStart = new Date(appointment.date);
      const appointmentEnd = new Date(appointmentStart);
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointment.duration);

      const dateMatches = appointmentStart.toDateString() === date.toDateString();
      const timeOverlaps = appointmentStart < slotEnd && appointmentEnd > slotStart;
      const roomMatches = !roomId || appointment.roomId === roomId;

      return dateMatches && timeOverlaps && roomMatches;
    });
  };

  // Check for conflicts
  const getConflicts = () => {
    const conflicts: { type: string; appointments: Appointment[]; severity: 'warning' | 'error' }[] = [];
    
    // Check for double bookings (same therapist, overlapping times)
    const therapistAppointments = new Map<string, Appointment[]>();
    appointments.forEach(appointment => {
      if (!therapistAppointments.has(appointment.therapistId)) {
        therapistAppointments.set(appointment.therapistId, []);
      }
      therapistAppointments.get(appointment.therapistId)!.push(appointment);
    });

    therapistAppointments.forEach((therapistAppts, therapistId) => {
      for (let i = 0; i < therapistAppts.length; i++) {
        for (let j = i + 1; j < therapistAppts.length; j++) {
          const apt1 = therapistAppts[i];
          const apt2 = therapistAppts[j];
          
          const start1 = new Date(apt1.date);
          const end1 = new Date(start1.getTime() + apt1.duration * 60000);
          const start2 = new Date(apt2.date);
          const end2 = new Date(start2.getTime() + apt2.duration * 60000);
          
          if (start1 < end2 && start2 < end1) {
            conflicts.push({
              type: 'therapist-double-booking',
              appointments: [apt1, apt2],
              severity: 'error'
            });
          }
        }
      }
    });

    // Check for room double bookings
    const roomAppointments = new Map<string, Appointment[]>();
    appointments.forEach(appointment => {
      if (!appointment.isVirtual && appointment.roomId) {
        if (!roomAppointments.has(appointment.roomId)) {
          roomAppointments.set(appointment.roomId, []);
        }
        roomAppointments.get(appointment.roomId)!.push(appointment);
      }
    });

    roomAppointments.forEach((roomAppts, roomId) => {
      for (let i = 0; i < roomAppts.length; i++) {
        for (let j = i + 1; j < roomAppts.length; j++) {
          const apt1 = roomAppts[i];
          const apt2 = roomAppts[j];
          
          const start1 = new Date(apt1.date);
          const end1 = new Date(start1.getTime() + apt1.duration * 60000);
          const start2 = new Date(apt2.date);
          const end2 = new Date(start2.getTime() + apt2.duration * 60000);
          
          if (start1 < end2 && start2 < end1) {
            conflicts.push({
              type: 'room-double-booking',
              appointments: [apt1, apt2],
              severity: 'error'
            });
          }
        }
      }
    });

    return conflicts;
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    setDraggedAppointment(appointment);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, date: Date, timeSlot: string, roomId: string) => {
    e.preventDefault();
    
    if (draggedAppointment) {
      const [hours, minutes] = timeSlot.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0, 0);
      
      onAppointmentMove(draggedAppointment.id, newDate, roomId);
      setDraggedAppointment(null);
    }
  };

  const handleSlotClick = (date: Date, timeSlot: string, roomId: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(hours, minutes, 0, 0);
    
    onCreateAppointment(appointmentDate, roomId);
  };

  // Get current period label
  const getPeriodLabel = () => {
    if (viewMode === 'day') {
      return selectedDate.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (viewMode === 'week') {
      const dates = getViewDates();
      const start = dates[0];
      const end = dates[6];
      return `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else if (viewMode === 'month') {
      return selectedDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    }
    return '';
  };

  const conflicts = getConflicts();
  const viewDates = getViewDates();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1F2937',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            Agenda
          </h1>
          
          {conflicts.length > 0 && showConflicts && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#FEF2F2',
              borderRadius: '0.5rem',
              border: '1px solid #FECACA'
            }}>
              <AlertTriangle size={16} color="#EF4444" />
              <span style={{
                fontSize: '0.875rem',
                color: '#DC2626',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}>
                {conflicts.length} conflicto{conflicts.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* View Mode Selector */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F3F4F6',
            borderRadius: '0.5rem',
            padding: '0.25rem'
          }}>
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  backgroundColor: viewMode === mode ? 'white' : 'transparent',
                  color: viewMode === mode ? '#1F2937' : '#6B7280',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: viewMode === mode ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                }}
              >
                {mode === 'day' ? 'Día' : mode === 'week' ? 'Semana' : 'Mes'}
              </button>
            ))}
          </div>

          <button
            onClick={goToToday}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Hoy
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        padding: '1rem 1.5rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigatePrevious}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} color="#6B7280" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={navigateNext}
              style={{
                padding: '0.5rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} color="#6B7280" />
            </motion.button>
          </div>

          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1F2937',
            margin: 0,
            fontFamily: 'Inter, sans-serif'
          }}>
            {getPeriodLabel()}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Therapist Filter */}
          <select
            value={selectedTherapist}
            onChange={(e) => setSelectedTherapist(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <option value="all">Todos los terapeutas</option>
            {/* Add therapist options here */}
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCreateAppointment(new Date(), rooms[0]?.id || '')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <Plus size={16} />
            Nueva Cita
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {viewMode === 'month' ? (
          <MonthView
            dates={viewDates}
            appointments={appointments}
            onAppointmentClick={onAppointmentClick}
            onDateClick={(date) => {
              onDateChange(date);
              onViewModeChange('day');
            }}
            selectedDate={selectedDate}
          />
        ) : (
          <WeekDayView
            dates={viewDates}
            timeSlots={timeSlots}
            appointments={appointments}
            rooms={rooms}
            onAppointmentClick={onAppointmentClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onSlotClick={handleSlotClick}
            draggedAppointment={draggedAppointment}
            conflicts={conflicts}
            viewMode={viewMode}
          />
        )}
      </div>
    </div>
  );
}

// Month View Component
interface MonthViewProps {
  dates: Date[];
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onDateClick: (date: Date) => void;
  selectedDate: Date;
}

function MonthView({ dates, appointments, onAppointmentClick, onDateClick, selectedDate }: MonthViewProps) {
  const weeks: Date[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      appointment.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === selectedDate.getMonth();
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Days of week header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB'
      }}>
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div
            key={day}
            style={{
              padding: '1rem',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              flex: 1,
              borderBottom: weekIndex < weeks.length - 1 ? '1px solid #E5E7EB' : 'none'
            }}
          >
            {week.map((date, dayIndex) => {
              const dayAppointments = getAppointmentsForDate(date);
              
              return (
                <motion.div
                  key={dayIndex}
                  whileHover={{ backgroundColor: '#F9FAFB' }}
                  onClick={() => onDateClick(date)}
                  style={{
                    padding: '0.5rem',
                    borderRight: dayIndex < 6 ? '1px solid #E5E7EB' : 'none',
                    cursor: 'pointer',
                    backgroundColor: isSelected(date) ? '#EFF6FF' : 'white',
                    opacity: isCurrentMonth(date) ? 1 : 0.5,
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: isToday(date) ? 700 : 500,
                      color: isToday(date) ? '#2563EB' : '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {date.getDate()}
                    </span>
                    
                    {dayAppointments.length > 0 && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {dayAppointments.slice(0, 3).map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAppointmentClick(appointment);
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: appointment.status === 'completed' ? '#ECFDF5' :
                                         appointment.status === 'cancelled' ? '#FEF2F2' : '#EFF6FF',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          color: appointment.status === 'completed' ? '#10B981' :
                                appointment.status === 'cancelled' ? '#EF4444' : '#2563EB',
                          fontFamily: 'Inter, sans-serif',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {appointment.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </motion.div>
                    ))}
                    
                    {dayAppointments.length > 3 && (
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        textAlign: 'center',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        +{dayAppointments.length - 3} más
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Week/Day View Component
interface WeekDayViewProps {
  dates: Date[];
  timeSlots: string[];
  appointments: Appointment[];
  rooms: ConsultingRoom[];
  onAppointmentClick: (appointment: Appointment) => void;
  onDragStart: (e: React.DragEvent, appointment: Appointment) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, date: Date, timeSlot: string, roomId: string) => void;
  onSlotClick: (date: Date, timeSlot: string, roomId: string) => void;
  draggedAppointment: Appointment | null;
  conflicts: any[];
  viewMode: 'day' | 'week';
}

function WeekDayView({
  dates,
  timeSlots,
  appointments,
  rooms,
  onAppointmentClick,
  onDragStart,
  onDragOver,
  onDrop,
  onSlotClick,
  draggedAppointment,
  conflicts,
  viewMode
}: WeekDayViewProps) {
  const getAppointmentsForSlot = (date: Date, timeSlot: string, roomId: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(hours, minutes, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setMinutes(slotEnd.getMinutes() + 30);

    return appointments.filter(appointment => {
      const appointmentStart = new Date(appointment.date);
      const appointmentEnd = new Date(appointmentStart);
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointment.duration);

      const dateMatches = appointmentStart.toDateString() === date.toDateString();
      const timeOverlaps = appointmentStart < slotEnd && appointmentEnd > slotStart;
      const roomMatches = appointment.roomId === roomId;

      return dateMatches && timeOverlaps && roomMatches;
    });
  };

  const isCurrentTime = (timeSlot: string) => {
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return currentHour === hours && Math.abs(currentMinute - minutes) < 30;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with dates and rooms */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `80px repeat(${dates.length}, 1fr)`,
        backgroundColor: '#F9FAFB',
        borderBottom: '1px solid #E5E7EB',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ padding: '1rem', borderRight: '1px solid #E5E7EB' }} />
        
        {dates.map((date, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              borderRight: index < dates.length - 1 ? '1px solid #E5E7EB' : 'none',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              {date.toLocaleDateString('es-ES', { weekday: 'short' })}
            </div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: date.toDateString() === new Date().toDateString() ? '#2563EB' : '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Rooms header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `80px repeat(${dates.length}, 1fr)`,
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{ padding: '0.75rem', borderRight: '1px solid #E5E7EB' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            SALAS
          </span>
        </div>
        
        {dates.map((date, dateIndex) => (
          <div
            key={dateIndex}
            style={{
              borderRight: dateIndex < dates.length - 1 ? '1px solid #E5E7EB' : 'none',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {rooms.map((room, roomIndex) => (
              <div
                key={room.id}
                style={{
                  padding: '0.5rem',
                  borderBottom: roomIndex < rooms.length - 1 ? '1px solid #F3F4F6' : 'none',
                  backgroundColor: room.status === 'maintenance' ? '#FEF2F2' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <MapPin size={12} color="#6B7280" />
                <span style={{
                  fontSize: '0.75rem',
                  color: room.status === 'maintenance' ? '#EF4444' : '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {room.name}
                </span>
                {room.status === 'maintenance' && (
                  <AlertCircle size={12} color="#EF4444" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Time slots and appointments */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {timeSlots.map((timeSlot, timeIndex) => (
          <div
            key={timeSlot}
            style={{
              display: 'grid',
              gridTemplateColumns: `80px repeat(${dates.length}, 1fr)`,
              borderBottom: '1px solid #F3F4F6',
              backgroundColor: isCurrentTime(timeSlot) ? '#FEF3C7' : 'white'
            }}
          >
            {/* Time label */}
            <div style={{
              padding: '0.75rem',
              borderRight: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F9FAFB'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isCurrentTime(timeSlot) ? '#92400E' : '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                {timeSlot}
              </span>
            </div>

            {/* Date columns */}
            {dates.map((date, dateIndex) => (
              <div
                key={dateIndex}
                style={{
                  borderRight: dateIndex < dates.length - 1 ? '1px solid #E5E7EB' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: `${rooms.length * 60}px`
                }}
              >
                {rooms.map((room, roomIndex) => {
                  const slotAppointments = getAppointmentsForSlot(date, timeSlot, room.id);
                  
                  return (
                    <div
                      key={room.id}
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, date, timeSlot, room.id)}
                      onClick={() => onSlotClick(date, timeSlot, room.id)}
                      style={{
                        height: '60px',
                        borderBottom: roomIndex < rooms.length - 1 ? '1px solid #F3F4F6' : 'none',
                        position: 'relative',
                        cursor: 'pointer',
                        backgroundColor: room.status === 'maintenance' ? '#FEF2F2' : 
                                       draggedAppointment ? '#F0FDF4' : 'transparent',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      {slotAppointments.map((appointment, index) => (
                        <motion.div
                          key={appointment.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, appointment)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick(appointment);
                          }}
                          whileHover={{ scale: 1.02 }}
                          style={{
                            position: 'absolute',
                            top: `${index * 2}px`,
                            left: '2px',
                            right: '2px',
                            height: `${Math.min(appointment.duration / 30 * 60 - 4, 56)}px`,
                            backgroundColor: appointment.status === 'completed' ? '#10B981' :
                                           appointment.status === 'cancelled' ? '#EF4444' :
                                           appointment.status === 'no-show' ? '#F59E0B' : '#2563EB',
                            borderRadius: '0.25rem',
                            padding: '0.25rem',
                            cursor: 'grab',
                            overflow: 'hidden',
                            zIndex: 5
                          }}
                        >
                          <div style={{
                            fontSize: '0.75rem',
                            color: 'white',
                            fontWeight: 600,
                            fontFamily: 'Inter, sans-serif',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {appointment.type === 'individual' ? '👤' :
                             appointment.type === 'family' ? '👨‍👩‍👧‍👦' :
                             appointment.type === 'couple' ? '💑' : '👥'} 
                            {appointment.duration}min
                          </div>
                          
                          {appointment.isVirtual && (
                            <Video size={12} color="white" style={{ position: 'absolute', top: '2px', right: '2px' }} />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
