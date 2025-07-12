'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  Calendar,
  FileText,
  Star,
  History,
  TrendingUp,
  AlertTriangle,
  Target,
  Brain,
  Shield,
  Command,
  ArrowRight,
  X,
  Bookmark,
  BookmarkPlus
} from 'lucide-react';
import { Patient, Appointment, Document, TreatmentPlan, Assessment } from '@/types/clinical';

interface SearchResult {
  id: string;
  type: 'patient' | 'appointment' | 'document' | 'treatment' | 'assessment' | 'note';
  title: string;
  subtitle?: string;
  description?: string;
  icon: React.ElementType;
  color: string;
  url: string;
  relevance: number;
  lastAccessed?: Date;
  isFavorite?: boolean;
  metadata?: {
    riskLevel?: string;
    activePatient?: boolean;
    status?: string;
    isVirtual?: boolean;
    isConfidential?: boolean;
    requiresSignature?: boolean;
    [key: string]: unknown;
  };
}

interface GlobalSearchCommandProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  appointments: Appointment[];
  documents: Document[];
  treatmentPlans: TreatmentPlan[];
  assessments: Assessment[];
  recentItems: SearchResult[];
  favorites: SearchResult[];
  onNavigate: (url: string) => void;
  onToggleFavorite: (item: SearchResult) => void;
}

export function GlobalSearchCommand({
  isOpen,
  onClose,
  patients,
  appointments,
  documents,
  recentItems,
  favorites,
  onNavigate,
  onToggleFavorite
}: GlobalSearchCommandProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showMetrics, setShowMetrics] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { id: 'all', label: 'Todo', icon: Search },
    { id: 'patient', label: 'Pacientes', icon: User },
    { id: 'appointment', label: 'Citas', icon: Calendar },
    { id: 'document', label: 'Documentos', icon: FileText },
    { id: 'treatment', label: 'Tratamientos', icon: Target },
    { id: 'assessment', label: 'Evaluaciones', icon: Brain }
  ];

  // Combine all searchable items
  const allItems: SearchResult[] = [
    ...patients.map(patient => ({
      id: patient.id,
      type: 'patient' as const,
      title: `${patient.firstName} ${patient.lastName}`,
      subtitle: patient.email,
      description: `${patient.age} años • ${patient.gender}`,
      icon: User,
      color: '#10B981',
      url: `/dashboard/patients/${patient.id}`,
      relevance: 1,
      lastAccessed: patient.lastSession,
      isFavorite: favorites.some(f => f.id === patient.id),
      metadata: {
        riskLevel: patient.riskLevel,
        activePatient: patient.status === 'active'
      }
    })),
    ...appointments.map(appointment => ({
      id: appointment.id,
      type: 'appointment' as const,
      title: `Cita con ${appointment.patientName}`,
      subtitle: appointment.dateTime.toLocaleDateString('es-ES'),
      description: `${appointment.type} • ${appointment.duration} min`,
      icon: Calendar,
      color: '#6366F1',
      url: `/dashboard/agenda/${appointment.id}`,
      relevance: 1,
      lastAccessed: appointment.dateTime,
      isFavorite: favorites.some(f => f.id === appointment.id),
      metadata: {
        status: appointment.status,
        isVirtual: appointment.type === 'virtual' as Appointment['type']
      }
    })),
    ...documents.map(document => ({
      id: document.id,
      type: 'document' as const,
      title: document.title ?? 'Sin título',
      subtitle: document.patientName || 'Sin paciente asignado',
      description: `${document.type} • ${document.status}`,
      icon: FileText,
      color: '#F59E0B',
      url: `/dashboard/documents/${document.id}`,
      relevance: 1,
      lastAccessed: document.updatedAt,
      isFavorite: favorites.some(f => f.id === document.id),
      metadata: {
        isConfidential: document.isConfidential,
        requiresSignature: document.requiresSignature
      }
    }))
  ];

  // Filter and search items
  const filteredItems = allItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesQuery = query === '' || 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase());
    
    return matchesFilter && matchesQuery;
  }).sort((a, b) => {
    // Sort by relevance, then by last accessed
    if (a.relevance !== b.relevance) return b.relevance - a.relevance;
    if (a.lastAccessed && b.lastAccessed) {
      return b.lastAccessed.getTime() - a.lastAccessed.getTime();
    }
    return 0;
  }).slice(0, 10); // Limit to 10 results

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            onNavigate(filteredItems[selectedIndex].url);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onNavigate, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setActiveFilter('all');
    }
  }, [isOpen]);

  const renderMetrics = () => (
    <div style={{
      padding: '1rem',
      backgroundColor: '#F9FAFB',
      borderRadius: '0.75rem',
      border: '1px solid #E5E7EB',
      marginBottom: '1rem'
    }}>
      <h4 style={{
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#374151',
        margin: '0 0 0.75rem 0',
        fontFamily: 'Space Grotesk, sans-serif'
      }}>
        Métricas Rápidas
      </h4>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#10B981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={16} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {patients.filter(p => p.status === 'active').length}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Pacientes Activos
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#6366F1',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={16} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {appointments.filter(a => a.dateTime > new Date()).length}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Citas Pendientes
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#F59E0B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={16} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {documents.filter(d => d.status === 'draft').length}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Docs. Pendientes
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #E5E7EB'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#EF4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={16} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1F2937',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              {patients.filter(p => p.riskLevel === 'high').length}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Alto Riesgo
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <div style={{
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      {filteredItems.length > 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            const isSelected = index === selectedIndex;

            return (
              <motion.div
                key={item.id}
                whileHover={{ backgroundColor: '#F3F4F6' }}
                onClick={() => {
                  onNavigate(item.url);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: isSelected ? '#EEF2FF' : 'transparent',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid #C7D2FE' : '1px solid transparent'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: `${item.color}20`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} color={item.color} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#1F2937',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}>
                      {item.title}
                    </span>
                    
                    {item.metadata?.isConfidential && (
                      <Shield size={12} color="#EF4444" />
                    )}
                    
                    {item.metadata?.riskLevel === 'high' && (
                      <AlertTriangle size={12} color="#EF4444" />
                    )}
                    
                    {item.isFavorite && (
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    )}
                  </div>

                  {item.subtitle && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#6B7280',
                      marginBottom: '0.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {item.subtitle}
                    </div>
                  )}

                  {item.description && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#9CA3AF',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {item.description}
                    </div>
                  )}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item);
                    }}
                    style={{
                      padding: '0.25rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}
                  >
                    {item.isFavorite ? (
                      <Bookmark size={14} color="#F59E0B" fill="#F59E0B" />
                    ) : (
                      <BookmarkPlus size={14} color="#9CA3AF" />
                    )}
                  </motion.button>

                  {isSelected && (
                    <ArrowRight size={14} color="#6B7280" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : query ? (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#6B7280'
        }}>
          <Search size={32} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
          <div style={{
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            No se encontraron resultados para &quot;{query}&quot;
          </div>
        </div>
      ) : (
        <div>
          {/* Recent Items */}
          {recentItems.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                margin: '0 0 0.75rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Recientes
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                {recentItems.slice(0, 5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ backgroundColor: '#F3F4F6' }}
                      onClick={() => {
                        onNavigate(item.url);
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: `${item.color}20`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={16} color={item.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#1F2937',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                      <History size={12} color="#9CA3AF" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Favorites */}
          {favorites.length > 0 && (
            <div>
              <h4 style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                margin: '0 0 0.75rem 0',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>
                Favoritos
              </h4>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                {favorites.slice(0, 5).map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ backgroundColor: '#F3F4F6' }}
                      onClick={() => {
                        onNavigate(item.url);
                        onClose();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: `${item.color}20`,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={16} color={item.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#1F2937',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6B7280',
                            fontFamily: 'Inter, sans-serif'
                          }}>
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '10vh'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            margin: '0 1rem'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid #E5E7EB'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <Search size={20} color="#6B7280" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  color: '#1F2937'
                }}
                placeholder="Buscar pacientes, citas, documentos..."
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#F3F4F6',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                <Command size={12} />
                <span>K</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  padding: '0.25rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                <X size={16} color="#6B7280" />
              </motion.button>
            </div>

            {/* Filters */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem'
            }}>
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <motion.button
                    key={filter.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveFilter(filter.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: activeFilter === filter.id ? '#EEF2FF' : '#F9FAFB',
                      color: activeFilter === filter.id ? '#4338CA' : '#6B7280',
                      border: `1px solid ${activeFilter === filter.id ? '#C7D2FE' : '#E5E7EB'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon size={14} />
                    {filter.label}
                  </motion.button>
                );
              })}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMetrics(!showMetrics)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: showMetrics ? '#F0FDF4' : '#F9FAFB',
                  color: showMetrics ? '#15803D' : '#6B7280',
                  border: `1px solid ${showMetrics ? '#BBF7D0' : '#E5E7EB'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap'
                }}
              >
                <TrendingUp size={14} />
                Métricas
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div style={{
            padding: '1rem',
            maxHeight: '60vh',
            overflowY: 'auto'
          }}>
            {showMetrics && renderMetrics()}
            {renderSearchResults()}
          </div>

          {/* Footer */}
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#F9FAFB',
            borderTop: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#6B7280',
            fontFamily: 'Inter, sans-serif'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <kbd style={{
                  padding: '0.125rem 0.25rem',
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.625rem'
                }}>
                  ↑↓
                </kbd>
                <span>navegar</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <kbd style={{
                  padding: '0.125rem 0.25rem',
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.625rem'
                }}>
                  ↵
                </kbd>
                <span>seleccionar</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <kbd style={{
                  padding: '0.125rem 0.25rem',
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.625rem'
                }}>
                  esc
                </kbd>
                <span>cerrar</span>
              </div>
            </div>
            <div>
              {filteredItems.length} resultado{filteredItems.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
