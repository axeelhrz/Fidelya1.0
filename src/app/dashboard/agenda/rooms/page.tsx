'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  Settings,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Maximize2,
  Minimize2,
  Activity,
  Zap,
  Shield,
  Camera,
  Volume2,
  Thermometer,
  Lightbulb,
  Monitor,
  Sofa,
  Coffee,
  Gamepad2,
  BookOpen,
  Heart,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar as CalendarIcon,
  X,
  Save,
  RefreshCw,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
} from 'lucide-react';
import { ConsultingRoom, Appointment, Therapist } from '@/types/dashboard';

interface RoomUsageStats {
  roomId: string;
  totalHours: number;
  utilizationRate: number;
  averageSessionDuration: number;
  totalSessions: number;
  revenue: number;
  maintenanceHours: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  popularTimeSlots: { time: string; usage: number }[];
  therapistUsage: { therapistId: string; hours: number }[];
}

interface MaintenanceRecord {
  id: string;
  roomId: string;
  type: 'preventive' | 'corrective' | 'upgrade';
  description: string;
  startDate: Date;
  endDate?: Date;
  cost: number;
  technician: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
}

interface RoomFormData {
  name: string;
  capacity: number;
  location: string;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance';
  description: string;
  hourlyRate: number;
  amenities: string[];
  accessibility: boolean;
  soundproofing: boolean;
  naturalLight: boolean;
  airConditioning: boolean;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  photos: string[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<ConsultingRoom[]>([]);
  const [roomStats, setRoomStats] = useState<RoomUsageStats[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedRoom, setSelectedRoom] = useState<ConsultingRoom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view' | 'maintenance'>('view');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'occupied' | 'maintenance'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'utilization' | 'revenue'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'maintenance' | 'analytics'>('overview');

  // Form state
  const [formData, setFormData] = useState<RoomFormData>({
    name: '',
    capacity: 2,
    location: '',
    equipment: [],
    status: 'available',
    description: '',
    hourlyRate: 80,
    amenities: [],
    accessibility: false,
    soundproofing: false,
    naturalLight: false,
    airConditioning: false,
    dimensions: { length: 0, width: 0, height: 0 },
    photos: []
  });

  // Mock data initialization
  useEffect(() => {
    const mockRooms: ConsultingRoom[] = [
      {
        id: 'room1',
        name: 'Consultorio Serenidad',
        capacity: 2,
        equipment: ['Sillas ergonómicas', 'Mesa auxiliar', 'Aire acondicionado', 'Insonorización', 'Iluminación LED'],
        status: 'available',
        location: 'Planta baja - Ala Este'
      },
      {
        id: 'room2',
        name: 'Sala Armonía',
        capacity: 4,
        equipment: ['Mesa redonda', 'Sillas cómodas', 'Pizarra interactiva', 'Proyector', 'Sistema de sonido'],
        status: 'occupied',
        location: 'Primera planta - Ala Norte'
      },
      {
        id: 'room3',
        name: 'Espacio Grupal Esperanza',
        capacity: 8,
        equipment: ['Círculo de sillas', 'Equipo de sonido', 'Aire acondicionado', 'Cámara de seguridad'],
        status: 'available',
        location: 'Primera planta - Ala Sur'
      },
      {
        id: 'room4',
        name: 'Consultorio Familiar Unión',
        capacity: 6,
        equipment: ['Sofás cómodos', 'Mesa de centro', 'Juguetes terapéuticos', 'Cámara', 'Biblioteca infantil'],
        status: 'maintenance',
        location: 'Planta baja - Ala Oeste'
      },
      {
        id: 'room5',
        name: 'Sala VIP Tranquilidad',
        capacity: 3,
        equipment: ['Sillones de lujo', 'Mesa de cristal', 'Sistema de música', 'Difusor de aromas', 'Ventana panorámica'],
        status: 'available',
        location: 'Segunda planta - Ala Premium'
      },
      {
        id: 'room6',
        name: 'Espacio Mindfulness',
        capacity: 10,
        equipment: ['Colchonetas de yoga', 'Cojines de meditación', 'Sistema de sonido ambiental', 'Iluminación regulable'],
        status: 'available',
        location: 'Planta baja - Ala Wellness'
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

    const mockStats: RoomUsageStats[] = [
      {
        roomId: 'room1',
        totalHours: 156,
        utilizationRate: 78,
        averageSessionDuration: 52,
        totalSessions: 180,
        revenue: 12480,
        maintenanceHours: 4,
        lastMaintenance: new Date(2024, 1, 15),
        nextMaintenance: new Date(2024, 4, 15),
        popularTimeSlots: [
          { time: '10:00', usage: 85 },
          { time: '11:00', usage: 92 },
          { time: '15:00', usage: 78 },
          { time: '16:00', usage: 88 }
        ],
        therapistUsage: [
          { therapistId: 'therapist1', hours: 120 },
          { therapistId: 'therapist2', hours: 36 }
        ]
      },
      {
        roomId: 'room2',
        totalHours: 142,
        utilizationRate: 71,
        averageSessionDuration: 65,
        totalSessions: 131,
        revenue: 11340,
        maintenanceHours: 6,
        lastMaintenance: new Date(2024, 2, 1),
        nextMaintenance: new Date(2024, 5, 1),
        popularTimeSlots: [
          { time: '09:00', usage: 75 },
          { time: '14:00', usage: 82 },
          { time: '17:00', usage: 69 }
        ],
        therapistUsage: [
          { therapistId: 'therapist1', hours: 89 },
          { therapistId: 'therapist2', hours: 53 }
        ]
      },
      {
        roomId: 'room3',
        totalHours: 98,
        utilizationRate: 49,
        averageSessionDuration: 90,
        totalSessions: 65,
        revenue: 8330,
        maintenanceHours: 2,
        lastMaintenance: new Date(2024, 1, 28),
        nextMaintenance: new Date(2024, 4, 28),
        popularTimeSlots: [
          { time: '18:00', usage: 95 },
          { time: '19:00', usage: 87 },
          { time: '20:00', usage: 72 }
        ],
        therapistUsage: [
          { therapistId: 'therapist2', hours: 98 }
        ]
      }
    ];

    const mockMaintenance: MaintenanceRecord[] = [
      {
        id: 'maint1',
        roomId: 'room4',
        type: 'corrective',
        description: 'Reparación del sistema de aire acondicionado',
        startDate: new Date(2024, 2, 10),
        endDate: new Date(2024, 2, 12),
        cost: 450,
        technician: 'Juan Pérez - Climatización',
        status: 'in-progress',
        priority: 'high',
        notes: 'Reemplazo del compresor principal y limpieza de conductos'
      },
      {
        id: 'maint2',
        roomId: 'room1',
        type: 'preventive',
        description: 'Mantenimiento preventivo trimestral',
        startDate: new Date(2024, 3, 15),
        cost: 200,
        technician: 'María García - Mantenimiento General',
        status: 'scheduled',
        priority: 'medium',
        notes: 'Revisión general de instalaciones y equipamiento'
      }
    ];

    setRooms(mockRooms);
    setTherapists(mockTherapists);
    setRoomStats(mockStats);
    setMaintenanceRecords(mockMaintenance);
  }, []);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'occupied': return '#EF4444';
      case 'maintenance': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'available': return '#ECFDF5';
      case 'occupied': return '#FEF2F2';
      case 'maintenance': return '#FFFBEB';
      default: return '#F9FAFB';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} />;
      case 'occupied': return <WifiOff size={16} />;
      case 'maintenance': return <Settings size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Ocupado';
      case 'maintenance': return 'Mantenimiento';
      default: return 'Desconocido';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      case 'low': return '#65A30D';
      default: return '#6B7280';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#3B82F6';
      case 'scheduled': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Filter and sort functions
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'capacity':
        aValue = a.capacity;
        bValue = b.capacity;
        break;
      case 'utilization':
        const aStats = roomStats.find(s => s.roomId === a.id);
        const bStats = roomStats.find(s => s.roomId === b.id);
        aValue = aStats?.utilizationRate || 0;
        bValue = bStats?.utilizationRate || 0;
        break;
      case 'revenue':
        const aRevStats = roomStats.find(s => s.roomId === a.id);
        const bRevStats = roomStats.find(s => s.roomId === b.id);
        aValue = aRevStats?.revenue || 0;
        bValue = bRevStats?.revenue || 0;
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  // Modal handlers
  const openModal = (type: typeof modalType, room?: ConsultingRoom) => {
    setModalType(type);
    if (room) {
      setSelectedRoom(room);
      if (type === 'edit') {
        setFormData({
          name: room.name,
          capacity: room.capacity,
          location: room.location,
          equipment: room.equipment,
          status: room.status,
          description: '',
          hourlyRate: 80,
          amenities: [],
          accessibility: false,
          soundproofing: true,
          naturalLight: false,
          airConditioning: true,
          dimensions: { length: 0, width: 0, height: 0 },
          photos: []
        });
      }
    } else {
      setSelectedRoom(null);
      setFormData({
        name: '',
        capacity: 2,
        location: '',
        equipment: [],
        status: 'available',
        description: '',
        hourlyRate: 80,
        amenities: [],
        accessibility: false,
        soundproofing: false,
        naturalLight: false,
        airConditioning: false,
        dimensions: { length: 0, width: 0, height: 0 },
        photos: []
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    setModalType('view');
  };

  const handleSaveRoom = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (modalType === 'create') {
        const newRoom: ConsultingRoom = {
          id: `room${rooms.length + 1}`,
          name: formData.name,
          capacity: formData.capacity,
          location: formData.location,
          equipment: formData.equipment,
          status: formData.status
        };
        setRooms(prev => [...prev, newRoom]);
      } else if (modalType === 'edit' && selectedRoom) {
        setRooms(prev => prev.map(room => 
          room.id === selectedRoom.id 
            ? { ...room, ...formData }
            : room
        ));
      }
      
      setIsLoading(false);
      closeModal();
    }, 1000);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este consultorio?')) {
      setRooms(prev => prev.filter(room => room.id !== roomId));
    }
  };

  // Equipment icons mapping
  const getEquipmentIcon = (equipment: string) => {
    const equipmentLower = equipment.toLowerCase();
    if (equipmentLower.includes('silla') || equipmentLower.includes('sofá')) return <Sofa size={14} />;
    if (equipmentLower.includes('aire') || equipmentLower.includes('clima')) return <Thermometer size={14} />;
    if (equipmentLower.includes('sonido') || equipmentLower.includes('audio')) return <Volume2 size={14} />;
    if (equipmentLower.includes('luz') || equipmentLower.includes('iluminación')) return <Lightbulb size={14} />;
    if (equipmentLower.includes('proyector') || equipmentLower.includes('monitor')) return <Monitor size={14} />;
    if (equipmentLower.includes('cámara')) return <Camera size={14} />;
    if (equipmentLower.includes('juguete') || equipmentLower.includes('juego')) return <Gamepad2 size={14} />;
    if (equipmentLower.includes('libro') || equipmentLower.includes('biblioteca')) return <BookOpen size={14} />;
    if (equipmentLower.includes('café') || equipmentLower.includes('bebida')) return <Coffee size={14} />;
    return <Zap size={14} />;
  };

  // Render room card
  const renderRoomCard = (room: ConsultingRoom) => {
    const stats = roomStats.find(s => s.roomId === room.id);
    const maintenanceCount = maintenanceRecords.filter(m => m.roomId === room.id && m.status !== 'completed').length;

    return (
      <motion.div
        key={room.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        style={{
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}
        onClick={() => openModal('view', room)}
      >
        {/* Header with status */}
        <div style={{
          padding: '1.5rem 1.5rem 1rem 1.5rem',
          background: `linear-gradient(135deg, ${getStatusBgColor(room.status)} 0%, rgba(255,255,255,0.8) 100%)`,
          borderBottom: `2px solid ${getStatusColor(room.status)}20`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: getStatusColor(room.status),
                borderRadius: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Home size={20} color="white" />
              </div>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#1F2937',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {room.name}
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.25rem'
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: getStatusBgColor(room.status),
                    color: getStatusColor(room.status),
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {getStatusIcon(room.status)}
                    {getStatusText(room.status)}
                  </span>
                  {maintenanceCount > 0 && (
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      <AlertTriangle size={12} />
                      {maintenanceCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('edit', room);
                }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Edit size={16} color="#6B7280" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteRoom(room.id);
                }}
                style={{
                  padding: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Trash2 size={16} color="#EF4444" />
              </motion.button>
            </div>
          </div>

          {/* Quick stats */}
          {stats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#2563EB',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {stats.utilizationRate}%
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Utilización
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#10B981',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  €{stats.revenue.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Ingresos
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#F59E0B',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {stats.totalSessions}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Sesiones
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Location and capacity */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <MapPin size={16} color="#6B7280" />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                {room.location}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Users size={16} color="#6B7280" />
              <span style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                Capacidad: {room.capacity} personas
              </span>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.75rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Equipamiento
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              {room.equipment.slice(0, 4).map((item, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.375rem 0.75rem',
                    backgroundColor: '#F3F4F6',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {getEquipmentIcon(item)}
                  {item}
                </span>
              ))}
              {room.equipment.length > 4 && (
                <span style={{
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  +{room.equipment.length - 4} más
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render list view
  const renderRoomList = () => {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
          gap: '1rem',
          padding: '1rem 1.5rem',
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: '#374151',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div>Consultorio</div>
          <div>Estado</div>
          <div>Capacidad</div>
          <div>Utilización</div>
          <div>Ingresos</div>
          <div>Acciones</div>
        </div>

        {/* Table rows */}
        {sortedRooms.map((room, index) => {
          const stats = roomStats.find(s => s.roomId === room.id);
          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
                gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #F3F4F6',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onClick={() => openModal('view', room)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
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
                  {room.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {room.location}
                </div>
              </div>

              <div>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: getStatusBgColor(room.status),
                  color: getStatusColor(room.status),
                  fontFamily: 'Inter, sans-serif',
                  width: 'fit-content'
                }}>
                  {getStatusIcon(room.status)}
                  {getStatusText(room.status)}
                </span>
              </div>

              <div style={{
                fontSize: '0.875rem',
                color: '#374151',
                fontFamily: 'Inter, sans-serif'
              }}>
                {room.capacity} personas
              </div>

              <div>
                {stats ? (
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: stats.utilizationRate > 70 ? '#10B981' : stats.utilizationRate > 40 ? '#F59E0B' : '#EF4444',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    {stats.utilizationRate}%
                  </div>
                ) : (
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#9CA3AF',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Sin datos
                  </span>
                )}
              </div>

              <div>
                {stats ? (
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    €{stats.revenue.toLocaleString()}
                  </div>
                ) : (
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#9CA3AF',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Sin datos
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal('edit', room);
                  }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#F3F4F6',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Edit size={14} color="#6B7280" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRoom(room.id);
                  }}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#FEF2F2',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={14} color="#EF4444" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}

        {sortedRooms.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#9CA3AF'
          }}>
            <Home size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
            <p style={{
              fontSize: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              No se encontraron consultorios
            </p>
          </div>
        )}
      </div>
    );
  };

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
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Gestión de Consultorios
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6B7280',
              margin: '0.5rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Administra espacios, equipamiento y mantenimiento
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowStats(!showStats)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: showStats ? '#2563EB' : 'white',
                color: showStats ? 'white' : '#374151',
                border: '1px solid #E5E7EB',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <BarChart3 size={18} />
              {showStats ? 'Ocultar Estadísticas' : 'Ver Estadísticas'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal('create')}
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
        </div>

        {/* Stats overview */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#EFF6FF',
                    borderRadius: '0.75rem'
                  }}>
                    <Home size={20} color="#2563EB" />
                  </div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Total Consultorios
                  </h3>
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#2563EB',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {rooms.length}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {rooms.filter(r => r.status === 'available').length} disponibles
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#ECFDF5',
                    borderRadius: '0.75rem'
                  }}>
                    <TrendingUp size={20} color="#10B981" />
                  </div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Utilización Promedio
                  </h3>
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#10B981',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {Math.round(roomStats.reduce((acc, stat) => acc + stat.utilizationRate, 0) / roomStats.length || 0)}%
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Últimos 30 días
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#FEF3C7',
                    borderRadius: '0.75rem'
                  }}>
                    <Star size={20} color="#F59E0B" />
                  </div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Ingresos Totales
                  </h3>
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#F59E0B',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  €{roomStats.reduce((acc, stat) => acc + stat.revenue, 0).toLocaleString()}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Este mes
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  border: '1px solid #E5E7EB'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#FEF2F2',
                    borderRadius: '0.75rem'
                  }}>
                    <Settings size={20} color="#EF4444" />
                  </div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    margin: 0,
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Mantenimientos
                  </h3>
                </div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  color: '#EF4444',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  {maintenanceRecords.filter(m => m.status !== 'completed').length}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Pendientes
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid #E5E7EB',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            {/* Search */}
            <div style={{ position: 'relative', minWidth: '300px' }}>
              <Search
                size={18}
                color="#9CA3AF"
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <input
                type="text"
                placeholder="Buscar consultorios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 3rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #E5E7EB',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                minWidth: '150px'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="occupied">Ocupado</option>
              <option value="maintenance">Mantenimiento</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                border: '1px solid #E5E7EB',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                minWidth: '150px'
              }}
            >
              
