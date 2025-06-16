'use client';

import { useState, useEffect } from 'react';
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
  Grid,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import {
  ClinicalAlert,
  AlertFormData,
  AlertType,
  AlertTrigger,
  AlertUrgency,
  ALERT_TYPES,
  ALERT_TRIGGERS,
  ALERT_URGENCIES,
  ALERT_TYPE_LABELS,
  ALERT_TRIGGER_LABELS,
  ALERT_URGENCY_LABELS,
} from '@/types/alert';
import { Patient } from '@/types/patient
