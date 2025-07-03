import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Session, CreateSessionData, UpdateSessionData, EmotionalState } from '../../../types/session';
import { useSessionActions } from '../../../hooks/useSessionActions';
import { AIService } from '../../../lib/services/aiService';
import EmotionalStateIcon from '../../ui/EmotionalStateIcon';

interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  session?: Session;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  open,
  onClose,
  session,
  mode,
  onSuccess,
}) => {
  const { createSession, updateSession, analyzeSessionWithAI, loading, error } = useSessionActions();
  
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: new Date(),
    time: new Date(),
    duration: 60,
    consultationReason: '',
    notes: '',
    emotionalTonePre: '' as EmotionalState | '',
    emotionalTonePost: '' as EmotionalState | '',
  });

  type AIAnalysis = {
    summary: string;
    recommendation: string;
    keyInsights: string[];
    emotionalTone: EmotionalState;
  } | null;

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>(null);
  const [analyzingAI, setAnalyzingAI] = useState(false);

  useEffect(() => {
    if (session && mode === 'edit') {
      setFormData({
        patientId: session.patientId,
        patientName: session.patientName,
        date: new Date(session.date),
        time: new Date(`2000-01-01T${session.time}`),
        duration: session.duration,
        consultationReason: session.consultationReason,
        notes: session.notes || '',
        emotionalTonePre: session.emotionalTonePre || '',
        emotionalTonePost: session.emotionalTonePost || '',
      });
    }
  }, [session, mode]);

  const handleSubmit = async () => {
    try {
      if (mode === 'create') {
        const sessionData: CreateSessionData = {
          patientId: formData.patientId,
          date: formData.date.toISOString().split('T')[0],
          time: formData.time.toTimeString().slice(0, 5),
          duration: formData.duration,
          consultationReason: formData.consultationReason,
          emotionalTonePre: formData.emotionalTonePre || undefined,
        };

        await createSession(sessionData);
      } else if (session) {
        const updateData: UpdateSessionData = {
          notes: formData.notes,
          emotionalTonePost: formData.emotionalTonePost || undefined,
        };

        await updateSession(session.id, updateData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const handleAnalyzeWithAI = async () => {
    if (!formData.notes.trim()) return;

    setAnalyzingAI(true);
    try {
      const analysis = await analyzeSessionWithAI(formData.notes, formData.consultationReason);
      if (analysis) {
        setAiAnalysis(analysis);
        setFormData(prev => ({
          ...prev,
          emotionalTonePost: analysis.emotionalTone,
        }));
      }
    } catch (error) {
      console.error('Error analyzing with AI:', error);
    } finally {
      setAnalyzingAI(false);
    }
  };

  const emotionalStates: EmotionalState[] = [
    'muy_positivo',
    'positivo',
    'neutral',
    'ansioso',
    'triste',
    'irritado',
    'confundido',
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {mode === 'create' ? 'Registrar Nueva Sesión' : 'Editar Sesión'}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error">{error}</Alert>
            )}

            {mode === 'create' && (
              <>
                <TextField
                  label="Nombre del Paciente"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  fullWidth
                  required
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <DatePicker
                    label="Fecha"
                    value={formData.date}
                    onChange={(date) => date && setFormData(prev => ({ ...prev, date }))}
                    sx={{ flex: 1 }}
                  />
                  <TimePicker
                    label="Hora"
                    value={formData.time}
                    onChange={(time) => time && setFormData(prev => ({ ...prev, time }))}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <TextField
                  label="Duración (minutos)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  fullWidth
                />

                <TextField
                  label="Motivo de Consulta"
                  value={formData.consultationReason}
                  onChange={(e) => setFormData(prev => ({ ...prev, consultationReason: e.target.value }))}
                  multiline
                  rows={3}
                  fullWidth
                  required
                />

                <FormControl fullWidth>
                  <InputLabel>Estado Emocional Inicial</InputLabel>
                  <Select
                    value={formData.emotionalTonePre}
                    label="Estado Emocional Inicial"
                    onChange={(e) => setFormData(prev => ({ ...prev, emotionalTonePre: e.target.value as EmotionalState }))}
                  >
                    <MenuItem value="">Sin especificar</MenuItem>
                    {emotionalStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmotionalStateIcon state={state} size="small" />
                          {AIService.getEmotionalStateLabel(state)}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            <TextField
              label="Notas Clínicas"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              multiline
              rows={6}
              fullWidth
              placeholder="Registre aquí las observaciones, evolución y notas de la sesión..."
            />

            {formData.notes.trim() && (
              <Box>
                <Button
                  onClick={handleAnalyzeWithAI}
                  disabled={analyzingAI}
                  startIcon={analyzingAI ? <CircularProgress size={16} /> : null}
                  variant="outlined"
                  size="small"
                >
                  {analyzingAI ? 'Analizando...' : 'Analizar con IA'}
                </Button>
              </Box>
            )}

            {aiAnalysis && (
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Análisis IA:
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Resumen:
                    </Typography>
                    <Typography variant="body2">
                      {aiAnalysis.summary}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Recomendación:
                    </Typography>
                    <Typography variant="body2">
                      {aiAnalysis.recommendation}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Insights clave:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {aiAnalysis.keyInsights.map((insight: string, index: number) => (
                        <Chip key={index} label={insight} size="small" />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            )}

            <FormControl fullWidth>
              <InputLabel>Estado Emocional Final</InputLabel>
              <Select
                value={formData.emotionalTonePost}
                label="Estado Emocional Final"
                onChange={(e) => setFormData(prev => ({ ...prev, emotionalTonePost: e.target.value as EmotionalState }))}
              >
                <MenuItem value="">Sin especificar</MenuItem>
                {emotionalStates.map((state) => (
                  <MenuItem key={state} value={state}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmotionalStateIcon state={state} size="small" />
                      {AIService.getEmotionalStateLabel(state)}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? 'Guardando...' : mode === 'create' ? 'Crear Sesión' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default SessionModal;
