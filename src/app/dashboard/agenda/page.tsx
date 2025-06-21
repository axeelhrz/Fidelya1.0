'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Users,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
  Settings,
  Home,
  Wifi,
  WifiOff,
  Eye,
  Edit,
} from 'lucide-react';
import { Appointment, ConsultingRoom, Therapist } from '@/types/dashboard';

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rooms, setRooms] = useState<ConsultingRoom[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedTherapist, setSelectedTherapist] = useState<string>('all');
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);

  // Mock data para desarrollo
  useEffect(() => {
    const mockRooms: ConsultingRoom[] = [
      {
        id: 'room1',
        name: 'Consultorio 1',
        capacity: 2,
        equipment: ['Sillas cómodas', 'Mesa auxiliar', 'Aire acondicionado', 'Insonorización'],
        status: 'available',
        location: 'Planta baja'
      },
      {
        id: 'room2',
        name: 'Consultorio 2',
        capacity: 4,
        equipment: ['Mesa redonda', 'Sillas', 'Pizarra', 'Proyector'],
        status: 'available',
        location: 'Primera planta'
      },
      {
        id: 'room3',
        name: 'Sala Grupal',
        capacity: 8,
        equipment: ['Círculo de sillas', 'Equipo de sonido', 'Aire acondicionado'],
        status: 'occupied',
        location: 'Primera planta'
      },
      {
        id: 'room4',
        name: 'Consultorio Familiar',
        capacity: 6,
        equipment: ['Sofás', 'Mesa de centro', 'Juguetes terapéuticos', 'Cámara'],
        status: 'maintenance',
        location: 'Planta baja'
      }
    ];

    const mockTherapists: Therapist[] = [
      {
        id: 'therapist1',
        firstName: 'Ana',
        lastName: 'Martín',
        email: 'ana.martin@centro.com',
        phone: '+34 600 123 456',
        specializations: ['Ansiedad', 'Depresión', 'Terapia Cognitivo-Conductual'],
        licenseNumber: 'COL12345',
        status: 'active',
        schedule: {
          monday: { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
          tuesday: { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
          wednesday: { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
          thursday: { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
          friday: { start: '09:00', end: '15:00', breaks: [] }
        },
        consultingRooms: ['room1', 'room2'],
        hourlyRate: 80
      },
      {
        id: 'therapist2',
        firstName: 'Luis',
        lastName: 'Fernández',
        email: 'luis.fernandez@centro.com',
        phone: '+34 600 123 457',
        specializations: ['Terapia Familiar', 'Adolescentes', 'Trastornos Alimentarios'],
        licenseNumber: 'COL12346',
        status: 'active',
        schedule: {
          monday: { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
          tuesday: { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
          wednesday: { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
          thursday: { start: '10:00', end: '18:00', breaks: [{ start: '14:00', end: '15:00' }] },
          friday: { start: '10:00', end: '16:00', breaks: [] }
        },
        consultingRooms: ['room3', 'room4'],
        hourlyRate: 85
      }
    ];

    const mockAppointments: Appointment[] = [
      {
        id: 'apt1',
        patientId: '1',
        therapistId: 'therapist1',
        roomId: 'room1',
        date: new Date(2024, 2, 15, 10, 0), // 15 marzo 2024, 10:00
        duration: 60,
        type: 'individual',
        status: 'confirmed',
        notes: 'Primera sesión de seguimiento',
        reminderSent: true,
        cost: 80
      },
      {
        id: 'apt2',
        patientId: '2',
        therapistId: 'therapist2',
        roomId: 'room3',
        date: new Date(2024, 2, 15, 11, 30), // 15 marzo 2024, 11:30
        duration: 90,
        type: 'family',
        status: 'scheduled',
        notes: 'Sesión familiar con padres',
        reminderSent: false,
        cost: 120
      },
      {
        id: 'apt3',
        patientId: '3',
        therapistId: 'therapist1',
        roomId: 'room1',
        date: new Date(2024, 2, 15, 15, 0), // 15 marzo 2024, 15:00
        duration: 60,
        type: 'individual',
        status: 'confirmed',
        notes: 'Seguimiento de ansiedad',
        reminderSent: true,
        cost: 80
      },
      {
        id: 'apt4',
        patientId: '1',
        therapistId: 'therapist1',
        roomId: 'room1',
        date: new Date(2024, 2, 16, 9, 0), // 16 marzo 2024, 09:00
        duration: 60,
        type: 'individual',
        status: 'scheduled',
        reminderSent: false,
        cost: 80
      }
    ];

    setRooms(mockRooms);
    setTherapists(mockTherapists);
    setAppointments(mockAppointments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'scheduled': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      case 'completed': return '#2563EB';
      case 'no-show': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#ECFDF5';
      case 'scheduled': return '#FFFBEB';
      case 'cancelled': return '#FEF2F2';
      case 'completed': return '#EFF6FF';
      case 'no-show': return '#FEF2F2';
      default: return '#F9FAFB';
    }
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'occupied': return '#EF4444';
      case 'maintenance': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getRoomStatusBgColor = (status: string) => {
    switch (status) {
      case 'available': return '#ECFDF5';
      case 'occupied': return '#FEF2F2';
      case 'maintenance': return '#FFFBEB';
      default: return '#F9FAFB';
    }
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lunes como primer día
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const getAppointmentForTimeSlot = (date: Date, time: string, roomId?: string, therapistId?: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(date);
    slotTime.setHours(hours, minutes, 0, 0);

    return appointments.find(apt => {
      const aptTime = new Date(apt.date);
      const aptEndTime = new Date(apt.date.getTime() + apt.duration * 60000);
      
      const matchesTime = aptTime <= slotTime && slotTime < aptEndTime;
      const matchesRoom = !roomId || apt.roomId === roomId;
      const matchesTherapist = !therapistId || apt.therapistId === therapistId;
      
      return matchesTime && matchesRoom && matchesTherapist;
    });
  };

  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newDate: Date, newTime: string, newRoomId?: string) => {
    e.preventDefault();
    if (!draggedAppointment) return;

    const [hours, minutes] = newTime.split(':').map(Number);
    const newDateTime = new Date(newDate);
    newDateTime.setHours(hours, minutes, 0, 0);

    const updatedAppointment = {
      ...draggedAppointment,
      date: newDateTime,
      roomId: newRoomId || draggedAppointment.roomId
    };

    setAppointments(prev => 
      prev.map(apt => apt.id === draggedAppointment.id ? updatedAppointment : apt)
    );
    setDraggedAppointment(null);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays(currentDate);
    const timeSlots = getTimeSlots();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
        {/* Header de días */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `120px repeat(${weekDays.length}, 1fr)`,
          borderBottom: '2px solid #E5E7EB',
          backgroundColor: '#F9FAFB'
        }}>
          <div style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>
            Horario
          </div>
          {weekDays.map(day => (
            <div key={day.toISOString()} style={{ 
              padding: '1rem', 
              textAlign: 'center',
              borderLeft: '1px solid #E5E7EB'
            }}>
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: '#1F2937',
                fontFamily: 'Inter, sans-serif'
              }}>
                {day.toLocaleDateString('es-ES', { weekday: 'short' })}
              </div>
              <div style={{ 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                color: day.toDateString() === new Date().toDateString() ? '#2563EB' : '#374151',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de horarios */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {timeSlots.map(time => (
            <div key={time} style={{ 
              display: 'grid', 
              gridTemplateColumns: `120px repeat(${weekDays.length}, 1fr)`,
              minHeight: '60px',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <div style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.875rem', 
                color: '#6B7280',
                borderRight: '1px solid #E5E7EB',
                backgroundColor: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'Inter, sans-serif'
              }}>
                {time}
              </div>
              {weekDays.map(day => {
                const appointment = getAppointmentForTimeSlot(day, time, selectedRoom !== 'all' ? selectedRoom : undefined);
                return (
                  <div
                    key={`${day.toISOString()}-${time}`}
                    style={{ 
                      borderLeft: '1px solid #F3F4F6',
                      position: 'relative',
                      minHeight: '60px'
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, day, time, selectedRoom !== 'all' ? selectedRoom : undefined)}
                  >
                    {appointment && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        draggable
                        onDragStart={() => handleDragStart(appointment)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: '2px',
                          right: '2px',
                          backgroundColor: getStatusBgColor(appointment.status),
                          border: `2px solid ${getStatusColor(appointment.status)}`,
                          borderRadius: '0.5rem',
                          padding: '0.5rem',
                          cursor: 'move',
                          zIndex: 10
                        }}
                      >
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: getStatusColor(appointment.status),
                          marginBottom: '0.25rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {appointment.type === 'individual' ? 'Individual' :
                           appointment.type === 'family' ? 'Familiar' :
                           appointment.type === 'group' ? 'Grupal' : 'Pareja'}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#374151',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {appointment.duration}min
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {rooms.find(r => r.id === appointment.roomId)?.name}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = getTimeSlots();
    const dayAppointments = getAppointmentsForDay(currentDate);

    return (
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Columna principal - Horarios */}
        <div style={{ flex: 2 }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1F2937',
                margin: 0,
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                {currentDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </h3>
            </div>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {timeSlots.map(time => {
                const appointment = getAppointmentForTimeSlot(currentDate, time);
                return (
                  <div key={time} style={{
                    display: 'flex',
                    minHeight: '60px',
                    borderBottom: '1px solid #F3F4F6'
                  }}>
                    <div style={{
                      width: '100px',
                      padding: '1rem',
                      backgroundColor: '#FAFAFA',
                      borderRight: '1px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {time}
                    </div>
                    <div style={{
                      flex: 1,
                      padding: '0.5rem',
                      position: 'relative'
                    }}>
                      {appointment && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          style={{
                            backgroundColor: getStatusBgColor(appointment.status),
                            border: `2px solid ${getStatusColor(appointment.status)}`,
                            borderRadius: '0.75rem',
                            padding: '1rem',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <div>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#1F2937',
                              marginBottom: '0.25rem',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {appointment.type === 'individual' ? 'Sesión Individual' :
                               appointment.type === 'family' ? 'Terapia Familiar' :
                               appointment.type === 'group' ? 'Terapia Grupal' : 'Terapia de Pareja'}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {appointment.duration} min • {rooms.find(r => r.id === appointment.roomId)?.name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6B7280',
                              fontFamily: 'Inter, sans-serif'
                            }}>
                              {therapists.find(t => t.id === appointment.therapistId)?.firstName} {therapists.find(t => t.id === appointment.therapistId)?.lastName}
                            </div>
                          </div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: getStatusColor(appointment.status),
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            €{appointment.cost}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna lateral - Resumen del día */}
        <div style={{ flex: 1 }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Resumen del día
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                padding: '1rem',
                backgroundColor: '#EFF6FF',
                borderRadius: '0.75rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#2563EB',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {dayAppointments.length}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#1E40AF',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Citas programadas
                </div>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: '#ECFDF5',
                borderRadius: '0.75rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#10B981',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  €{dayAppointments.reduce((sum, apt) => sum + apt.cost, 0)}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#047857',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Ingresos estimados
                </div>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: '#FFFBEB',
                borderRadius: '0.75rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#F59E0B',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {Math.round(dayAppointments.reduce((sum, apt) => sum + apt.duration, 0) / 60)}h
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#92400E',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Horas de terapia
                </div>
              </div>
            </div>

            {/* Lista de citas del día */}
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1F2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Próximas citas
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dayAppointments
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map(appointment => (
                    <div key={appointment.id} style={{
                      padding: '0.75rem',
                      backgroundColor: '#F9FAFB',
                      borderRadius: '0.5rem',
                      border: '1px solid #E5E7EB'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#1F2937',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {appointment.date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: getStatusBgColor(appointment.status),
                          color: getStatusColor(appointment.status),
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {appointment.status === 'confirmed' ? 'Confirmada' :
                           appointment.status === 'scheduled' ? 'Programada' : appointment.status}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#6B7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {rooms.find(r => r.id === appointment.roomId)?.name} • {appointment.duration}min
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRoomsPanel = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#1F2937',
          margin: 0,
          fontFamily: 'Inter, sans-serif'
        }}>
          Estado de Consultorios
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <Plus size={16} />
          Nuevo Consultorio
        </motion.button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              padding: '1.5rem',
              backgroundColor: getRoomStatusBgColor(room.status),
              border: `2px solid ${getRoomStatusColor(room.status)}`,
              borderRadius: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Home size={20} color={getRoomStatusColor(room.status)} />
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {room.name}
                </h4>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {room.status === 'available' && <Wifi size={16} color="#10B981" />}
                {room.status === 'occupied' && <WifiOff size={16} color="#EF4444" />}
                {room.status === 'maintenance' && <Settings size={16} color="#F59E0B" />}
                
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: getRoomStatusColor(room.status),
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {room.status === 'available' ? 'Disponible' :
                   room.status === 'occupied' ? 'Ocupado' : 'Mantenimiento'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                {room.location}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                <Users size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                Capacidad: {room.capacity} personas
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Equipamiento
              </h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {room.equipment.map((item, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Eye size={14} />
                Ver
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <Edit size={14} />
                Editar
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: '#F9FAFB',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Agenda y Consultorios
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Gestión inteligente de citas y recursos
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {/* TODO: Implement new appointment modal */}}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#2563EB',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Plus size={18} />
              Nueva Cita
            </motion.button>
          </div>
        </div>

        {/* Controles de navegación y vista */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Navegación de fecha */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateDay('prev')}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft size={20} color="#374151" />
              </motion.button>
              
              <div style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1F2937',
                minWidth: '200px',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif'
              }}>
                {viewMode === 'week' 
                  ? `Semana del ${getWeekDays(currentDate)[0].getDate()} - ${getWeekDays(currentDate)[6].getDate()} ${currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
                  : currentDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                }
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateDay('next')}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight size={20} color="#374151" />
              </motion.button>
            </div>

            {/* Botón Hoy */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentDate(new Date())}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #DBEAFE',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Hoy
            </motion.button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Selector de vista */}
            <div style={{ display: 'flex', backgroundColor: '#F3F4F6', borderRadius: '0.5rem', padding: '0.25rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('day')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: viewMode === 'day' ? 'white' : 'transparent',
                  color: viewMode === 'day' ? '#2563EB' : '#6B7280',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: viewMode === 'day' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
                }}
              >
                Día
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setViewMode('week')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: viewMode === 'week' ? 'white' : 'transparent',
                  color: viewMode === 'week' ? '#2563EB' : '#6B7280',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: viewMode === 'week' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
                }}
              >
                Semana
              </motion.button>
            </div>

            {/* Filtros */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <option value="all">Todos los consultorios</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>

              <select
                value={selectedTherapist}
                onChange={(e) => setSelectedTherapist(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <option value="all">Todos los terapeutas</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.firstName} {therapist.lastName}
                  </option>
                ))}
              </select>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={18} color="#374151" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#F3F4F6',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <Settings size={18} color="#374151" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Panel de consultorios */}
      {renderRoomsPanel()}

      {/* Vista del calendario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          overflow: 'hidden'
        }}
      >
        {viewMode === 'week' ? renderWeekView() : renderDayView()}
      </motion.div>
    </div>
  );
}
