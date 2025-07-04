'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  Download, 
  AlertTriangle,
} from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { ClinicalNote, NoteFilters as NoteFiltersType, CreateNoteData, UpdateNoteData } from '@/types/notes';
import NoteModal from './NoteModal';
import NoteFilters from './NoteFilters';
import NotesList from './NotesList';
import SignatureModal from './SignatureModal';
import AIValidationPanel from './AIValidationPanel';

export default function NotesManager() {
  const [filters, setFilters] = useState<NoteFiltersType>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ClinicalNote | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showAIValidation, setShowAIValidation] = useState(false);
  const [noteToSign, setNoteToSign] = useState<ClinicalNote | null>(null);
  const [noteToValidate, setNoteToValidate] = useState<ClinicalNote | null>(null);

  const { 
    notes, 
    loading, 
    error, 
    createNote, 
    updateNote, 
    signNote, 
    deleteNote, 
    duplicateNote,
    refreshNotes 
  } = useNotes(filters);

  const handleCreateNote = useCallback(() => {
    setSelectedNote(null);
    setModalMode('create');
  }, []);

  const handleEditNote = useCallback((note: ClinicalNote) => {
    if (note.locked) {
      alert('Esta nota está bloqueada y no puede ser editada.');
      return;
    }
    setSelectedNote(note);
    setModalMode('edit');
  }, []);

  const handleViewNote = useCallback((note: ClinicalNote) => {
    setSelectedNote(note);
    setModalMode('view');
  }, []);

  const handleSignNote = useCallback((note: ClinicalNote) => {
    if (note.signed) {
      alert('Esta nota ya está firmada.');
      return;
    }
    setNoteToSign(note);
    setShowSignatureModal(true);
  }, []);

  const handleDeleteNote = useCallback(async (note: ClinicalNote) => {
    if (note.signed) {
      alert('No se puede eliminar una nota firmada.');
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la nota de ${note.patientName}?`
    );

    if (confirmed) {
      const success = await deleteNote(note.id);
      if (success) {
        alert('Nota eliminada exitosamente.');
      }
    }
  }, [deleteNote]);

  const handleDuplicateNote = useCallback(async (note: ClinicalNote) => {
    const newNoteId = await duplicateNote(note.id);
    if (newNoteId) {
      alert('Nota duplicada exitosamente.');
    }
  }, [duplicateNote]);

  const handleValidateNote = useCallback((note: ClinicalNote) => {
    setNoteToValidate(note);
    setShowAIValidation(true);
  }, []);

  const handleExportNote = useCallback(async (note: ClinicalNote) => {
    try {
      // Simular exportación
      alert(`Exportando nota de ${note.patientName}...`);
      // Aquí iría la lógica real de exportación
    } catch {
      alert('Error al exportar la nota.');
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalMode(null);
    setSelectedNote(null);
  }, []);

  const handleCloseSignatureModal = useCallback(() => {
    setShowSignatureModal(false);
    setNoteToSign(null);
  }, []);

  const handleCloseAIValidation = useCallback(() => {
    setShowAIValidation(false);
    setNoteToValidate(null);
  }, []);

  const handleSignatureComplete = useCallback(async (signatureData?: string) => {
    if (!noteToSign) return;

    const success = await signNote(noteToSign.id, signatureData);
    if (success) {
      alert('Nota firmada exitosamente.');
      handleCloseSignatureModal();
    }
  }, [noteToSign, signNote, handleCloseSignatureModal]);

  const renderToolbar = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '1.5rem',
        padding: '1.5rem',
        border: '1px solid rgba(229, 231, 235, 0.6)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        marginBottom: '1.5rem'
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.button
            onClick={handleCreateNote}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <Plus size={16} />
            Nueva Nota
          </motion.button>

          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: showFilters ? '#EFF6FF' : '#F8FAFC',
              color: showFilters ? '#3B82F6' : '#6B7280',
              border: `1px solid ${showFilters ? '#DBEAFE' : '#E2E8F0'}`,
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Filter size={16} />
            Filtros
          </motion.button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#F8FAFC',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#6B7280'
          }}>
            <span>{notes.length} notas encontradas</span>
          </div>

          <motion.button
            onClick={refreshNotes}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '0.5rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Actualizar lista"
          >
            <Download size={16} color="#6B7280" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden', marginTop: '1rem' }}
          >
            <NoteFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClear={() => setFilters({})}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(229, 231, 235, 0.6)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #E5E7EB',
                borderTop: '4px solid #3B82F6',
                borderRadius: '50%',
                margin: '0 auto 1rem'
              }}
            />
            <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Cargando notas clínicas...
            </p>
          </div>
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(229, 231, 235, 0.6)'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <AlertTriangle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#EF4444', margin: '0 0 0.5rem 0' }}>Error al cargar las notas</h3>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0 0 1rem 0' }}>
              {error}
            </p>
            <motion.button
              onClick={refreshNotes}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '0.5rem 1rem',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Reintentar
            </motion.button>
          </div>
        </motion.div>
      );
    }

    return (
      <NotesList
        notes={notes}
        onEdit={handleEditNote}
        onView={handleViewNote}
        onSign={handleSignNote}
        onDelete={handleDeleteNote}
        onDuplicate={handleDuplicateNote}
        onValidate={handleValidateNote}
        onExport={handleExportNote}
      />
    );
  };

  return (
    <div>
      {renderToolbar()}
      {renderContent()}

      {/* Modal de nota */}
      <AnimatePresence>
        {modalMode && (
          <NoteModal
            mode={modalMode}
            note={selectedNote}
            onClose={handleCloseModal}
            onSave={async (data) => {
              if (modalMode === 'create') {
                const noteId = await createNote(data as CreateNoteData);
                if (noteId) {
                  alert('Nota creada exitosamente.');
                  handleCloseModal();
                }
              } else if (modalMode === 'edit' && selectedNote) {
                const success = await updateNote(selectedNote.id, data as UpdateNoteData);
                if (success) {
                  alert('Nota actualizada exitosamente.');
                  handleCloseModal();
                }
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal de firma */}
      <AnimatePresence>
        {showSignatureModal && noteToSign && (
          <SignatureModal
            note={noteToSign}
            onClose={handleCloseSignatureModal}
            onSign={handleSignatureComplete}
          />
        )}
      </AnimatePresence>

      {/* Panel de validación IA */}
      <AnimatePresence>
        {showAIValidation && noteToValidate && (
          <AIValidationPanel
            note={noteToValidate}
            onClose={handleCloseAIValidation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
