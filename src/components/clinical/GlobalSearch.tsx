'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  Calendar, 
  FileText, 
  Activity, 
  History,
  X,
  Command
} from 'lucide-react';
import { useGlobalSearch } from '@/hooks/useClinicalData';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (url: string) => void;
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchResults, searchHistory, loading, globalSearch } = useGlobalSearch();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (query.trim()) {
      const debounceTimer = setTimeout(() => {
        globalSearch(query);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [query, globalSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            Math.min(prev + 1, (query ? searchResults.length : searchHistory.length) - 1)
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (query && searchResults.length > 0) {
            const selectedResult = searchResults[selectedIndex];
            if (selectedResult) {
              onNavigate(selectedResult.url);
              onClose();
            }
          } else if (!query && searchHistory.length > 0) {
            setQuery(searchHistory[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchResults, searchHistory, query, onNavigate, onClose]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'patient': return <User size={16} color="#2563EB" />;
      case 'appointment': return <Calendar size={16} color="#10B981" />;
      case 'note': return <FileText size={16} color="#F59E0B" />;
      case 'assessment': return <Activity size={16} color="#7C3AED" />;
      default: return <Search size={16} color="#6B7280" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'patient': return 'Paciente';
      case 'appointment': return 'Cita';
      case 'note': return 'Nota';
      case 'assessment': return 'Evaluación';
      default: return type;
    }
  };

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
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 1rem',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}
        >
          {/* Search Input */}
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Search size={20} color="#6B7280" />
            
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar pacientes, citas, notas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '1.125rem',
                color: '#1F2937',
                fontFamily: 'Inter, sans-serif'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
              
              <button
                onClick={onClose}
                style={{
                  padding: '0.25rem',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  borderRadius: '0.25rem'
                }}
              >
                <X size={16} color="#6B7280" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6B7280'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #E5E7EB',
                  borderTop: '2px solid #2563EB',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 0.5rem'
                }} />
                <span style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
                  Buscando...
                </span>
              </div>
            )}

            {!loading && query && searchResults.length === 0 && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6B7280'
              }}>
                <Search size={24} color="#D1D5DB" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
                  No se encontraron resultados para &quot;{query}&quot;
                </div>
              </div>
            )}

            {!loading && query && searchResults.length > 0 && (
              <div>
                <div style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  backgroundColor: '#F9FAFB',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  RESULTADOS ({searchResults.length})
                </div>
                
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onNavigate(result.url);
                      onClose();
                    }}
                    style={{
                      padding: '1rem 1.5rem',
                      borderBottom: index < searchResults.length - 1 ? '1px solid #F3F4F6' : 'none',
                      backgroundColor: selectedIndex === index ? '#EFF6FF' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        backgroundColor: selectedIndex === index ? '#DBEAFE' : '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {getResultIcon(result.type)}
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h4 style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#1F2937',
                            margin: 0,
                            fontFamily: 'Inter, sans-serif',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {result.title}
                          </h4>
                          
                          <span style={{
                            padding: '0.125rem 0.5rem',
                            backgroundColor: '#F3F4F6',
                            color: '#6B7280',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontFamily: 'Inter, sans-serif',
                            flexShrink: 0
                          }}>
                            {getResultTypeLabel(result.type)}
                          </span>
                        </div>
                        
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6B7280',
                          marginBottom: '0.25rem',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {result.subtitle}
                        </div>
                        
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#9CA3AF',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          {result.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!query && searchHistory.length > 0 && (
              <div>
                <div style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  backgroundColor: '#F9FAFB',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  BÚSQUEDAS RECIENTES
                </div>
                
                {searchHistory.slice(0, 5).map((historyItem, index) => (
                  <div
                    key={index}
                    onClick={() => setQuery(historyItem)}
                    style={{
                      padding: '1rem 1.5rem',
                      borderBottom: index < Math.min(searchHistory.length, 5) - 1 ? '1px solid #F3F4F6' : 'none',
                      backgroundColor: selectedIndex === index ? '#EFF6FF' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.1s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <History size={16} color="#6B7280" />
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        {historyItem}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!query && searchHistory.length === 0 && (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6B7280'
              }}>
                <Search size={24} color="#D1D5DB" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '0.875rem', fontFamily: 'Inter, sans-serif' }}>
                  Comienza a escribir para buscar
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#9CA3AF', 
                  marginTop: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Busca pacientes, citas, notas y más
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '0.75rem 1.5rem',
            borderTop: '1px solid #E5E7EB',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  padding: '0.125rem 0.25rem',
                  backgroundColor: '#E5E7EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  ↑↓
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  navegar
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  padding: '0.125rem 0.25rem',
                  backgroundColor: '#E5E7EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  ↵
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  seleccionar
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  padding: '0.125rem 0.25rem',
                  backgroundColor: '#E5E7EB',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  esc
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  cerrar
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook para usar la búsqueda global con atajo de teclado
export function useGlobalSearchShortcut() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    openSearch: () => setIsOpen(true),
    closeSearch: () => setIsOpen(false)
  };
}
