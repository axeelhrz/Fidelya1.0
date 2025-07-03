import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Typography,
  Box,
  Alert,
  LinearProgress,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import {
  Download,
  TableChart,
  PictureAsPdf,
  Google,
  Close,
  CheckCircle,
} from '@mui/icons-material';
import { Session } from '../../../types/session';

interface SessionExportModalProps {
  open: boolean;
  onClose: () => void;
  sessions: Session[];
  selectedSessions?: string[];
}

type ExportFormat = 'csv' | 'pdf' | 'google-sheets';

interface ExportFields {
  patientName: boolean;
  date: boolean;
  time: boolean;
  duration: boolean;
  status: boolean;
  consultationReason: boolean;
  notes: boolean;
  summary: boolean;
  recommendation: boolean;
  emotionalStates: boolean;
  professionalId: boolean;
  createdAt: boolean;
}

const SessionExportModal: React.FC<SessionExportModalProps> = ({
  open,
  onClose,
  sessions,
  selectedSessions = [],
}) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [fields, setFields] = useState<ExportFields>({
    patientName: true,
    date: true,
    time: true,
    duration: true,
    status: true,
    consultationReason: true,
    notes: true,
    summary: true,
    recommendation: false,
    emotionalStates: true,
    professionalId: false,
    createdAt: false,
  });
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const sessionsToExport = selectedSessions.length > 0 
    ? sessions.filter(session => selectedSessions.includes(session.id))
    : sessions;

  const handleFieldChange = (field: keyof ExportFields) => {
    setFields(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const selectAllFields = () => {
    setFields({
      patientName: true,
      date: true,
      time: true,
      duration: true,
      status: true,
      consultationReason: true,
      notes: true,
      summary: true,
      recommendation: true,
      emotionalStates: true,
      professionalId: true,
      createdAt: true,
    });
  };

  const selectEssentialFields = () => {
    setFields({
      patientName: true,
      date: true,
      time: true,
      duration: true,
      status: true,
      consultationReason: true,
      notes: true,
      summary: false,
      recommendation: false,
      emotionalStates: true,
      professionalId: false,
      createdAt: false,
    });
  };

  const generateCSV = () => {
    const headers: string[] = [];
    const fieldLabels: Record<keyof ExportFields, string> = {
      patientName: 'Paciente',
      date: 'Fecha',
      time: 'Hora',
      duration: 'Duración (min)',
      status: 'Estado',
      consultationReason: 'Motivo de Consulta',
      notes: 'Notas Clínicas',
      summary: 'Resumen IA',
      recommendation: 'Recomendación IA',
      emotionalStates: 'Estados Emocionales',
      professionalId: 'ID Profesional',
      createdAt: 'Fecha de Creación',
    };

    // Construir headers
    Object.entries(fields).forEach(([field, included]) => {
      if (included) {
        headers.push(fieldLabels[field as keyof ExportFields]);
      }
    });

    // Construir filas
    const rows = sessionsToExport.map(session => {
      const row: string[] = [];
      
      if (fields.patientName) row.push(`"${session.patientName}"`);
      if (fields.date) row.push(session.date);
      if (fields.time) row.push(session.time);
      if (fields.duration) row.push(session.duration.toString());
      if (fields.status) row.push(session.status);
      if (fields.consultationReason) row.push(`"${session.consultationReason}"`);
      if (fields.notes) row.push(`"${session.notes || ''}"`);
      if (fields.summary) row.push(`"${session.summary || ''}"`);
      if (fields.recommendation) row.push(`"${session.recommendation || ''}"`);
      if (fields.emotionalStates) {
        const emotions = [session.emotionalTonePre, session.emotionalTonePost]
          .filter(Boolean)
          .join(' → ');
        row.push(`"${emotions}"`);
      }
      if (fields.professionalId) row.push(session.professionalId);
      if (fields.createdAt) row.push(session.createdAt.toISOString().split('T')[0]);

      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    return csvContent;
  };

  const downloadCSV = () => {
    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `historial-sesiones-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = async () => {
    // Aquí implementarías la generación de PDF
    // Por ahora, simularemos el proceso
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const exportToGoogleSheets = async () => {
    // Aquí implementarías la integración con Google Sheets API
    // Por ahora, simularemos el proceso
    return new Promise(resolve => setTimeout(resolve, 3000));
  };

  const handleExport = async () => {
    setExporting(true);
    setExportSuccess(false);

    try {
      switch (format) {
        case 'csv':
          downloadCSV();
          break;
        case 'pdf':
          await generatePDF();
          break;
        case 'google-sheets':
          await exportToGoogleSheets();
          break;
      }
      
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error exporting sessions:', error);
    } finally {
      setExporting(false);
    }
  };

  const selectedFieldsCount = Object.values(fields).filter(Boolean).length;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Download color="primary" />
            <Typography variant="h6">Exportar Historial de Sesiones</Typography>
          </Box>
          <Button
            onClick={onClose}
            size="small"
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <Close />
          </Button>
        </Box>
        
        <Box sx={{ mt: 1 }}>
          <Chip
            label={`${sessionsToExport.length} sesiones seleccionadas`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {exporting && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {format === 'csv' && 'Generando archivo CSV...'}
              {format === 'pdf' && 'Generando documento PDF...'}
              {format === 'google-sheets' && 'Sincronizando con Google Sheets...'}
            </Typography>
          </Box>
        )}

        {exportSuccess && (
          <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
            ¡Exportación completada exitosamente!
          </Alert>
        )}

        {/* Selección de formato */}
        <Box sx={{ mb: 3 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
              Formato de Exportación
            </FormLabel>
            <RadioGroup
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              row
            >
              <FormControlLabel
                value="csv"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TableChart color="success" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>CSV</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Compatible con Excel y Google Sheets
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="pdf"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PictureAsPdf color="error" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>PDF</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Documento profesional
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel
                value="google-sheets"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Google color="primary" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>Google Sheets</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sincronización directa
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Selección de campos */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <FormLabel component="legend" sx={{ fontWeight: 600 }}>
              Campos a Incluir ({selectedFieldsCount} seleccionados)
            </FormLabel>
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={selectEssentialFields} variant="outlined">
                Esenciales
              </Button>
              <Button size="small" onClick={selectAllFields} variant="outlined">
                Todos
              </Button>
            </Stack>
          </Box>

          <FormGroup>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.patientName}
                    onChange={() => handleFieldChange('patientName')}
                  />
                }
                label="Nombre del Paciente"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.date}
                    onChange={() => handleFieldChange('date')}
                  />
                }
                label="Fecha"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.time}
                    onChange={() => handleFieldChange('time')}
                  />
                }
                label="Hora"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.duration}
                    onChange={() => handleFieldChange('duration')}
                  />
                }
                label="Duración"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.status}
                    onChange={() => handleFieldChange('status')}
                  />
                }
                label="Estado de Sesión"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.consultationReason}
                    onChange={() => handleFieldChange('consultationReason')}
                  />
                }
                label="Motivo de Consulta"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.notes}
                    onChange={() => handleFieldChange('notes')}
                  />
                }
                label="Notas Clínicas"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.summary}
                    onChange={() => handleFieldChange('summary')}
                  />
                }
                label="Resumen IA"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.recommendation}
                    onChange={() => handleFieldChange('recommendation')}
                  />
                }
                label="Recomendación IA"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.emotionalStates}
                    onChange={() => handleFieldChange('emotionalStates')}
                  />
                }
                label="Estados Emocionales"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.professionalId}
                    onChange={() => handleFieldChange('professionalId')}
                  />
                }
                label="ID Profesional"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.createdAt}
                    onChange={() => handleFieldChange('createdAt')}
                  />
                }
                label="Fecha de Creación"
              />
            </Box>
          </FormGroup>
        </Box>

        {selectedFieldsCount === 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Debes seleccionar al menos un campo para exportar.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} disabled={exporting}>
          Cancelar
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={exporting || selectedFieldsCount === 0 || exportSuccess}
          startIcon={exporting ? null : <Download />}
          sx={{ minWidth: 120 }}
        >
          {exporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExportModal;
