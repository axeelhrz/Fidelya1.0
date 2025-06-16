'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import {
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
  Download,
  Refresh
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MetricsFilters } from '@/types/metrics';
import { EMOTIONAL_STATES } from '@/types/patient';
import { EMOTIONAL_TONES } from '@/types/session';
import { ALERT_TYPES } from '@/types/alert';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

interface FiltersToolbarProps {
  filters: MetricsFilters;
  onFiltersChange: (filters: MetricsFilters) => void;
  onExport?: (format: 'pdf' | 'excel' | 'notion') => void;
  onRefresh?: () =>
