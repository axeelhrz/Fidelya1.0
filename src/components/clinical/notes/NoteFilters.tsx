'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';
import { NoteFilters } from '@/types/notes';

interface NoteFiltersProps {
  filters: NoteFilters;
  onFiltersChange: (filters: NoteFilters) => void;
  onClear: () => void;
}

export default function NoteFiltersComponent({ filters, onFiltersChange, onClear }: NoteFiltersProps) {
  const [localFilters, setLocalFilters] = useState<NoteFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof NoteFilters, value: NoteFilters[keyof NoteFilters]) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const dateRange = localFilters.dateRange || { start: new Date(), end: new Date() };
    const newDateRange = {
      ...dateRange,
      [type]: new Date(value)
    };
    handleFilterChange('dateRange', newDateRange);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.searchTerm) count++;
    if (localFilters.status) count++;
    if (localFilters.templateType) count++;
    if (localFilters.signed !== undefined) count++;
    if (localFilters.dateRange) count++;
    if (localFilters.riskLevel) count++;
    return count;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        borderRadius: '1rem',
        padding: '1.5rem',
        border: '1px solid rgba(229, 231, 235, 0.5)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#6B7280" />
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#374151',
            margin: 0
          }}>
            Filtros de Búsqueda
          </h3>
          {getActiveFiltersCount() > 0 && (
            <span style={{
              background: '#3B82F6',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {getActiveFiltersCount()}
            </span>
          )}
        </div>

        <motion.button
          onClick={handleClear}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.375rem 0.75rem',
            background: '#EF4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <X size={12} />
          Limpiar
        </motion.button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {/* Búsqueda por texto */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Buscar en contenido
          </label>
          <div style={{ position: 'relative' }}>
            <Search 
              size={16} 
              color="#9CA3AF" 
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type="text"
              placeholder="Buscar paciente, contenido..."
              value={localFilters.searchTerm || ''}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: 'white'
              }}
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Estado
          </label>
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              background: 'white'
            }}
          >
            <option value="">Todos los estados</option>
            <option value="draft">Borrador</option>
            <option value="pending">Pendiente</option>
            <option value="signed">Firmada</option>
            <option value="locked">Bloqueada</option>
          </select>
        </div>

        {/* Tipo de plantilla */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Tipo de Plantilla
          </label>
          <select
            value={localFilters.templateType || ''}
            onChange={(e) => handleFilterChange('templateType', e.target.value || undefined)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              background: 'white'
            }}
          >
            <option value="">Todas las plantillas</option>
            <option value="soap">SOAP</option>
            <option value="dap">DAP</option>
            <option value="free">Libre</option>
          </select>
        </div>

        {/* Estado de firma */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Estado de Firma
          </label>
          <select
            value={localFilters.signed === undefined ? '' : localFilters.signed.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('signed', value === '' ? undefined : value === 'true');
            }}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              background: 'white'
            }}
          >
            <option value="">Todas</option>
            <option value="true">Firmadas</option>
            <option value="false">Sin firmar</option>
          </select>
        </div>

        {/* Nivel de riesgo */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Nivel de Riesgo
          </label>
          <select
            value={localFilters.riskLevel || ''}
            onChange={(e) => handleFilterChange('riskLevel', e.target.value || undefined)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #D1D5DB',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              background: 'white'
            }}
          >
            <option value="">Todos los niveles</option>
            <option value="low">Bajo</option>
            <option value="medium">Medio</option>
            <option value="high">Alto</option>
            <option value="critical">Crítico</option>
          </select>
        </div>

        {/* Rango de fechas */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            Rango de Fechas
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="date"
              value={localFilters.dateRange?.start ? 
                localFilters.dateRange.start.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: 'white'
              }}
            />
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>hasta</span>
            <input
              type="date"
              value={localFilters.dateRange?.end ? 
                localFilters.dateRange.end.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem 0.75rem',
                border: '1px solid #D1D5DB',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                background: 'white'
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
