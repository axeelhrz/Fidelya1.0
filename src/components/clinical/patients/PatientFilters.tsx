'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Filter,
  RotateCcw
} from 'lucide-react';
import { PatientFilters as PatientFiltersType } from '@/types/clinical';

interface PatientFiltersProps {
  filters: PatientFiltersType;
  onFiltersChange: (filters: PatientFiltersType) => void;
  onClose: () => void;
}

export function PatientFilters({ filters, onFiltersChange, onClose }: PatientFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PatientFiltersType>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: PatientFiltersType = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const updateFilter = (
    key: keyof PatientFiltersType,
    value: PatientFiltersType[keyof PatientFiltersType]
  ) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const removeFilter = (key: keyof PatientFiltersType) => {
    setLocalFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '1.5rem',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        borderBottom: '1px solid rgba(229, 231, 235, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            padding: '0.5rem',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            borderRadius: '0.5rem'
          }}>
            <Filter size={16} color="white" />
          </div>
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1F2937',
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif'
            }}>
              Filtros Avanzados
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0',
              fontFamily: 'Inter, sans-serif'
            }}>
              Refina tu búsqueda de pacientes
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#F3F4F6',
              color: '#6B7280',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <RotateCcw size={14} />
            Limpiar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              padding: '0.5rem',
              background: '#F3F4F6',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <X size={16} color="#6B7280" />
          </motion.button>
        </div>
      </div>

      {/* Filters Content */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Status Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Estado del Paciente
            </label>
            <select
              value={localFilters.status || ''}
              onChange={(e) => e.target.value 
                ? updateFilter('status', e.target.value as 'active' | 'inactive' | 'discharged' | 'pending')
                : removeFilter('status')
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none'
              }}
            >
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="discharged">Alta</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Género
            </label>
            <select
              value={localFilters.gender || ''}
              onChange={(e) => e.target.value 
                ? updateFilter('gender', e.target.value as 'male' | 'female' | 'other' | 'prefer-not-to-say')
                : removeFilter('gender')
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none'
              }}
            >
              <option value="">Todos los géneros</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
              <option value="prefer-not-to-say">Prefiere no decir</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Nivel de Riesgo
            </label>
            <select
              value={localFilters.riskLevel || ''}
              onChange={(e) => e.target.value 
                ? updateFilter('riskLevel', e.target.value as 'low' | 'medium' | 'high' | 'critical')
                : removeFilter('riskLevel')
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none'
              }}
            >
              <option value="">Todos los niveles</option>
              <option value="low">Bajo</option>
              <option value="medium">Medio</option>
              <option value="high">Alto</option>
              <option value="critical">Crítico</option>
            </select>
          </div>

          {/* Age Range Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Rango de Edad
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Min"
                value={localFilters.ageRange?.min || ''}
                onChange={(e) => {
                  const min = e.target.value ? parseInt(e.target.value) : undefined;
                  const max = localFilters.ageRange?.max;
                  if (min !== undefined && max !== undefined) {
                    updateFilter('ageRange', { min, max });
                  } else {
                    removeFilter('ageRange');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none'
                }}
              />
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.ageRange?.max || ''}
                onChange={(e) => {
                  const max = e.target.value ? parseInt(e.target.value) : undefined;
                  const min = localFilters.ageRange?.min;
                  if (min !== undefined && max !== undefined) {
                    updateFilter('ageRange', { min, max });
                  } else {
                    removeFilter('ageRange');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Fecha de Registro
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="date"
                value={localFilters.dateRange?.start ? localFilters.dateRange.start.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const start = e.target.value ? new Date(e.target.value) : undefined;
                  if (start !== undefined || localFilters.dateRange?.end !== undefined) {
                    updateFilter('dateRange', {
                      start,
                      end: localFilters.dateRange?.end
                    });
                  } else {
                    removeFilter('dateRange');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none'
                }}
              />
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>-</span>
              <input
                type="date"
                value={localFilters.dateRange?.end ? localFilters.dateRange.end.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const end = e.target.value ? new Date(e.target.value) : undefined;
                  if (end !== undefined || localFilters.dateRange?.start !== undefined) {
                    updateFilter('dateRange', {
                      start: localFilters.dateRange?.start,
                      end
                    });
                  } else {
                    removeFilter('dateRange');
                  }
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Assigned Therapist Filter (for multi-therapist centers) */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Terapeuta Asignado
            </label>
            <select
              value={localFilters.assignedTherapist || ''}
              onChange={(e) => e.target.value 
                ? updateFilter('assignedTherapist', e.target.value)
                : removeFilter('assignedTherapist')
              }
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #E5E7EB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none'
              }}
            >
              <option value="">Todos los terapeutas</option>
              <option value="Dra. Ana García">Dra. Ana García</option>
              <option value="Dr. Carlos López">Dr. Carlos López</option>
              <option value="Dra. María Rodríguez">Dra. María Rodríguez</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.keys(localFilters).length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.75rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Filtros Activos:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {Object.entries(localFilters).map(([key, value]) => {
                if (!value) return null;
                
                let displayValue = '';
                switch (key) {
                  case 'status':
                    displayValue = `Estado: ${value === 'active' ? 'Activo' : 
                                              value === 'inactive' ? 'Inactivo' : 
                                              value === 'discharged' ? 'Alta' : 'Pendiente'}`;
                    break;
                  case 'gender':
                    displayValue = `Género: ${value === 'male' ? 'Masculino' : 
                                              value === 'female' ? 'Femenino' : 
                                              value === 'other' ? 'Otro' : 'Prefiere no decir'}`;
                    break;
                  case 'riskLevel':
                    displayValue = `Riesgo: ${value === 'low' ? 'Bajo' : 
                                              value === 'medium' ? 'Medio' : 
                                              value === 'high' ? 'Alto' : 'Crítico'}`;
                    break;
                  case 'ageRange':
                    const ageRange = value as { min?: number; max?: number };
                    displayValue = `Edad: ${ageRange.min || 0}-${ageRange.max || '∞'}`;
                    break;
                  case 'dateRange':
                    const dateRange = value as { start?: Date; end?: Date };
                    displayValue = `Fecha: ${dateRange.start?.toLocaleDateString('es-ES') || '...'} - ${dateRange.end?.toLocaleDateString('es-ES') || '...'}`;
                    break;
                  case 'assignedTherapist':
                    displayValue = `Terapeuta: ${value}`;
                    break;
                  default:
                    displayValue = `${key}: ${value}`;
                }

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: '#EEF2FF',
                      color: '#4338CA',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    <span>{displayValue}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFilter(key as keyof PatientFiltersType)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={12} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '0.75rem',
        padding: '1.5rem',
        borderTop: '1px solid rgba(229, 231, 235, 0.4)',
        background: '#F9FAFB'
      }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#374151',
            border: '1px solid #E5E7EB',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Cancelar
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplyFilters}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Aplicar Filtros
        </motion.button>
      </div>
    </motion.div>
  );
}
