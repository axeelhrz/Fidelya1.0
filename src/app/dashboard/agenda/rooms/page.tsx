'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Settings,
  Users,
  Wrench,
  CheckCircle,
  AlertCircle,
  Wifi,
  Monitor,
  Coffee,
  Car
} from 'lucide-react';
import { ConsultingRoom } from '@/types/clinical';
import { ClinicalCard } from '@/components/clinical/ClinicalCard';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<ConsultingRoom[]>([
    {
      id: 'room1',
      centerId: 'center1',
      name: 'Consultorio 1',
      capacity: 2,
      equipment: ['Sillas ergonómicas', 'Mesa auxiliar', 'Pizarra blanca'],
      status: 'available',
      location: 'Planta Baja - Ala Este',
      features: [
        { name: 'Aire Acondicionado', description: 'Climatización automática', icon: '❄️' },
        { name: 'Insonorizado', description: 'Aislamiento acústico profesional', icon: '🔇' },
        { name: 'Luz Natural', description: 'Ventana con vista al jardín', icon: '☀️' }
      ],
      bookings: []
    },
    {
      id: 'room2',
      centerId: 'center1',
      name: 'Consultorio Familiar',
      capacity: 6,
      equipment: ['Sofá familiar', 'Sillas individuales', 'Mesa de centro', 'TV 55"', 'Juegos terapéuticos'],
      status: 'available',
      location: 'Primera Planta - Ala Norte',
      features: [
        { name: 'Espacio Amplio', description: 'Ideal para terapia familiar', icon: '👨‍👩‍👧‍👦' },
        { name: 'Juegos Infantiles', description: 'Material lúdico especializado', icon: '🧸' },
        { name: 'Multimedia', description: 'TV y sistema de audio', icon: '📺' }
      ],
      bookings: []
    },
    {
      id: 'room3',
      centerId: 'center1',
      name: 'Sala de Grupo',
      capacity: 12,
      equipment: ['Sillas en círculo', 'Proyector 4K', 'Pizarra interactiva', 'Sistema de sonido'],
      status: 'available',
      location: 'Primera Planta - Ala Sur',
      features: [
        { name: 'Terapia Grupal', description: 'Configuración circular', icon: '👥' },
        { name: 'Proyector 4K', description: 'Presentaciones de alta calidad', icon: '📽️' },
        { name: 'Acústica Optimizada', description: 'Diseño para grupos', icon: '🎵' }
      ],
      bookings: []
    },
    {
      id: 'room4',
      centerId: 'center1',
      name: 'Consultorio VIP',
      capacity: 3,
      equipment: ['Sillones de cuero', 'Mesa de cristal', 'Minibar', 'Sistema de música'],
      status: 'maintenance',
      location: 'Segunda Planta - Suite',
      features: [
        { name: 'Premium', description: 'Acabados de lujo', icon: '⭐' },
        { name: 'Privacidad Total', description: 'Acceso independiente', icon: '🔒' },
        { name: 'Vista Panorámica', description: 'Terraza privada', icon: '🌅' }
      ],
      bookings: []
    }
  ]);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ConsultingRoom | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} color="#10B981" />;
      case 'occupied': return <Users size={16} color="#F59E0B" />;
      case 'maintenance': return <Wrench size={16} color="#EF4444" />;
      case 'reserved': return <AlertCircle size={16} color="#2563EB" />;
      default: return <MapPin size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'occupied': return '#F59E0B';
      case 'maintenance': return '#EF4444';
      case 'reserved': return '#2563EB';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'available': return '#ECFDF5';
      case 'occupied': return '#FFFBEB';
      case 'maintenance': return '#FEF2F2';
      case 'reserved': return '#EFF6FF';
      default: return '#F9FAFB';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Ocupado';
      case 'maintenance': return 'Mantenimiento';
      case 'reserved': return 'Reservado';
      default: return status;
    }
  };

  const handleCreateRoom = () => {
    setSelectedRoom(null);
    setModalMode('create');
    setShowRoomModal(true);
  };

  const handleEditRoom = (room: ConsultingRoom) => {
    setSelectedRoom(room);
    setModalMode('edit');
    setShowRoomModal(true);
  };

  const handleViewRoom = (room: ConsultingRoom) => {
    setSelectedRoom(room);
    setModalMode('view');
    setShowRoomModal(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este consultorio?')) {
      setRooms(prev => prev.filter(room => room.id !== roomId));
    }
  };

  const handleStatusChange = (roomId: string, newStatus: string) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, status: newStatus as any } : room
    ));
  };

  const roomStats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
    totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0)
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
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
              Gestión de Consultorios
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              {rooms.length} consultorios configurados
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateRoom}
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
            Nuevo Consultorio
          </motion.button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <ClinicalCard
            title="Total Consultorios"
            value={roomStats.total}
            icon={MapPin}
            iconColor="#2563EB"
            size="small"
          />
          
          <ClinicalCard
            title="Disponibles"
            value={roomStats.available}
            icon={CheckCircle}
            iconColor="#10B981"
            size="small"
          />
          
          <ClinicalCard
            title="En Uso"
            value={roomStats.occupied}
            icon={Users}
            iconColor="#F59E0B"
            size="small"
          />
          
          <ClinicalCard
            title="Mantenimiento"
            value={roomStats.maintenance}
            icon={Wrench}
            iconColor="#EF4444"
            size="small"
          />
          
          <ClinicalCard
            title="Capacidad Total"
            value={`${roomStats.totalCapacity} personas`}
            icon={Users}
            iconColor="#7C3AED"
            size="small"
          />
        </div>
      </motion.div>

      {/* Rooms Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Room Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #F3F4F6'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#1F2937',
                    margin: 0,
                    marginBottom: '0.5rem',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}>
                    {room.name}
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {getStatusIcon(room.status)}
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: getStatusBgColor(room.status),
                      color: getStatusColor(room.status),
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {getStatusLabel(room.status)}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} color="#6B7280" />
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {room.location}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleViewRoom(room)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: '#EFF6FF',
                      cursor: 'pointer'
                    }}
                    title="Ver detalles"
                  >
                    <Settings size={16} color="#2563EB" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditRoom(room)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: '#FFFBEB',
                      cursor: 'pointer'
                    }}
                    title="Editar"
                  >
                    <Edit size={16} color="#F59E0B" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteRoom(room.id)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      backgroundColor: '#FEF2F2',
                      cursor: 'pointer'
                    }}
                    title="Eliminar"
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </motion.button>
                </div>
              </div>

              {/* Capacity */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#F9FAFB',
                borderRadius: '0.5rem'
              }}>
                <Users size={16} color="#6B7280" />
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Capacidad: {room.capacity} personas
                </span>
              </div>
            </div>

            {/* Features */}
            <div style={{ padding: '1.5rem' }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Características
              </h4>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0.75rem'
              }}>
                {room.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '0.5rem',
                      border: '1px solid #E2E8F0'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{feature.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {feature.name}
                      </div>
                      {feature.description && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {feature.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Equipment */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Equipamiento
                </h4>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {room.equipment.map((item, itemIndex) => (
                    <span
                      key={itemIndex}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Actions */}
              {room.status !== 'maintenance' && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStatusChange(room.id, 'maintenance')}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Marcar Mantenimiento
                    </motion.button>
                    
                    {room.status === 'available' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleStatusChange(room.id, 'reserved')}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          backgroundColor: '#EFF6FF',
                          color: '#2563EB',
                          border: '1px solid #DBEAFE',
                          borderRadius: '0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Reservar
                      </motion.button>
                    )}
                  </div>
                </div>
              )}

              {room.status === 'maintenance' && (
                <div style={{ marginTop: '1.5rem' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange(room.id, 'available')}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      border: '1px solid #A7F3D0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    Marcar como Disponible
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {rooms.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            border: '1px solid #E5E7EB'
          }}
        >
          <MapPin size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            No hay consultorios configurados
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#6B7280',
            marginBottom: '2rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Comienza agregando tu primer consultorio para gestionar las citas
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateRoom}
            style={{
              display: 'inline-flex',
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
            Crear Primer Consultorio
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
                  
