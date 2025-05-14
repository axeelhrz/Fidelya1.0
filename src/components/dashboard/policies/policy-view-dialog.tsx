'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  Stack,
  Chip,
  Divider,
  Tabs,
  Tab,
  alpha,
  useTheme,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  Tooltip,
  Paper,
  CircularProgress,
  InputAdornment // Added InputAdornment
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ContentCopy as ContentCopyIcon,
  Refresh as RefreshIcon,
  CalendarMonth as CalendarMonthIcon,
  AttachMoney as AttachMoneyIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Note as NoteIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Policy, PolicyReminder, PolicyDocument, } from '@/types/policy';
import { Customer } from '@/types/customer';
import { formatCurrency } from '@/lib/formatters';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Timestamp } from 'firebase/firestore';

interface PolicyViewDialogProps {
  open: boolean;
  onClose: () => void;
  policy: Policy | null;
  customers: Customer[];
  onEdit: (policy: Policy) => void;
  onDelete: (policy: Policy) => void;
  onToggleArchive: (id: string, archive: boolean) => Promise<void>;
  onToggleStar: (id: string, star: boolean) => Promise<void>;
  onDuplicate: (policy: Policy) => Promise<void>;
  onRenew: (policy: Policy) => void;
  onAddReminder: (policyId: string, reminder: Omit<PolicyReminder, "id">) => Promise<void>;
  onToggleReminder: (policyId: string, reminderId: string, completed: boolean) => Promise<void>;
  onDeleteReminder: (policyId: string, reminderId: string) => Promise<void>;
  onUploadDocument: (policyId: string, file: File) => Promise<PolicyDocument | null>;
  onDeleteDocument: (policyId: string, docId: string) => Promise<void>;
  onUpdateNotes: (policyId: string, notes: string) => Promise<void>;
}

const PolicyViewDialog: React.FC<PolicyViewDialogProps> = ({
  open,
  onClose,
  policy,
  customers,
  onEdit,
  onDelete,
  onToggleArchive,
  onToggleStar,
  onDuplicate,
  onRenew,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
  onUploadDocument,
  onDeleteDocument,
  onUpdateNotes
}) => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState<{
    date: Date | null;
    description: string;
  }>({
    date: null,
    description: ''
  });
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (policy) {
      setNotes(policy.notes || '');
    }
  }, [policy]);

  if (!policy) return null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleToggleArchive = async () => {
    setLoading('archive');
    try {
      await onToggleArchive(policy.id, !policy.isArchived);
    } finally {
      setLoading(null);
    }
  };

  const handleToggleStar = async () => {
    setLoading('star');
    try {
      await onToggleStar(policy.id, !policy.isStarred);
    } finally {
      setLoading(null);
    }
  };

  const handleDuplicate = async () => {
    setLoading('duplicate');
    try {
      await onDuplicate(policy);
    } finally {
      setLoading(null);
    }
  };

  const handleAddReminder = async () => {
    if (!newReminder.date || !newReminder.description.trim()) return;
    setLoading('addReminder');
    try {
      await onAddReminder(policy.id, {
        title: newReminder.description, // Add the required title field
        description: newReminder.description,
        date: Timestamp.fromDate(newReminder.date!),
        dueDate: Timestamp.fromDate(newReminder.date!),
        completed: false,
        completedAt: null,
        createdAt: Timestamp.now()
      });
      setNewReminder({ date: null, description: '' });
    } finally {
      setLoading(null);
    }
  };

  const handleToggleReminder = async (reminderId: string, completed: boolean) => {
    setLoading(`toggleReminder-${reminderId}`);
    try {
      await onToggleReminder(policy.id, reminderId, completed);
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    setLoading(`deleteReminder-${reminderId}`);
    try {
      await onDeleteReminder(policy.id, reminderId);
    } finally {
      setLoading(null);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setLoading('uploadDocument');
    try {
      await onUploadDocument(policy.id, file);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    setLoading(`deleteDocument-${docId}`);
    try {
      await onDeleteDocument(policy.id, docId);
    } finally {
      setLoading(null);
    }
  };

  const handleSaveNotes = async () => {
    setLoading('updateNotes');
    try {
      await onUpdateNotes(policy.id, notes);
      setEditingNotes(false);
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.palette.success.main;
      case 'expired': return theme.palette.error.main;
      case 'pending': return theme.palette.warning.main;
      case 'review': return theme.palette.info.main;
      case 'cancelled': return theme.palette.grey[500];
      default: return theme.palette.grey[500];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'expired': return 'Vencida';
      case 'pending': return 'Pendiente';
      case 'review': return 'En revisión';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getExpirationStatus = () => {
    const daysToExpiration = differenceInDays(policy.endDate.toDate(), new Date());
    if (daysToExpiration < 0) {
      return { color: theme.palette.error.main, text: `Vencida hace ${Math.abs(daysToExpiration)} días` };
    } else if (daysToExpiration === 0) {
      return { color: theme.palette.error.main, text: 'Vence hoy' };
    } else if (daysToExpiration <= 30) {
      return { color: theme.palette.warning.main, text: `Vence en ${daysToExpiration} días` };
    } else {
      return { color: theme.palette.success.main, text: `Vence en ${daysToExpiration} días` };
    }
  };

  const expirationStatus = getExpirationStatus();
  const customer = customers.find(c => c.name === policy.customerName);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '16px',
          background: theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.9)
            : alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{
        p: 3,
        fontFamily: 'Sora, sans-serif',
        fontWeight: 700,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" component="span" fontFamily="Sora, sans-serif" fontWeight={700}>
            Póliza {policy.policyNumber}
          </Typography>
          <Chip
            label={getStatusLabel(policy.status)}
            size="small"
            sx={{
              backgroundColor: alpha(getStatusColor(policy.status), 0.1),
              color: getStatusColor(policy.status),
              fontWeight: 600,
              fontSize: '0.75rem',
              fontFamily: 'Sora, sans-serif',
              borderRadius: '8px',
            }}
          />
          {policy.isArchived && (
            <Chip
              label="Archivada"
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
                color: theme.palette.grey[500],
                fontWeight: 600,
                fontSize: '0.75rem',
                fontFamily: 'Sora, sans-serif',
                borderRadius: '8px',
              }}
            />
          )}
        </Stack>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ opacity: 0.6 }} />
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="policy tabs"
            sx={{
              px: 3,
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTabs-scrollButtons': {
                color: theme.palette.text.secondary,
              }
            }}
          >
            <Tab
              label="Detalles"
              sx={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              label="Recordatorios"
              sx={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              label="Documentos"
              sx={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
            <Tab
              label="Notas"
              sx={{
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                minHeight: 48,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          <AnimatePresence mode="wait">
            {currentTab === 0 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  {/* Información básica */}
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        fontFamily="Sora, sans-serif"
                        sx={{ mb: 2 }}
                      >
                        Información Básica
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          >
                            <DescriptionIcon />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontFamily="Inter, sans-serif"
                            >
                              Número de Póliza
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              fontFamily="Sora, sans-serif"
                            >
                              {policy.policyNumber}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                            }}
                          >
                            <PersonIcon />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontFamily="Inter, sans-serif"
                            >
                              Cliente
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              fontFamily="Sora, sans-serif"
                            >
                              {policy.customerName}
                            </Typography>
                            {customer && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontFamily="Inter, sans-serif"
                              >
                                {customer.email} • {customer.phone}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                            }}
                          >
                            <BusinessIcon />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontFamily="Inter, sans-serif"
                            >
                              Compañía y Tipo
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              fontFamily="Sora, sans-serif"
                            >
                              {policy.company} - {policy.type}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Box>
                  {/* Detalles financieros */}
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.background.paper, 0.4)
                          : alpha(theme.palette.background.paper, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        height: '100%',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        fontFamily="Sora, sans-serif"
                        sx={{ mb: 2 }}
                      >
                        Detalles Financieros
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.main,
                            }}
                          >
                            <AttachMoneyIcon />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontFamily="Inter, sans-serif"
                            >
                              Prima Anual
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              fontFamily="Sora, sans-serif"
                              sx={{ color: theme.palette.success.main }}
                            >
                              {formatCurrency(policy.premium)}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: alpha(expirationStatus.color, 0.1),
                              color: expirationStatus.color,
                            }}
                          >
                            <CalendarMonthIcon />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              fontFamily="Inter, sans-serif"
                            >
                              Vigencia
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              fontFamily="Sora, sans-serif"
                            >
                              {format(policy.startDate.toDate(), 'dd MMM yyyy', { locale: es })} - {format(policy.endDate.toDate(), 'dd MMM yyyy', { locale: es })}
                            </Typography>
                            <Typography
                              variant="caption"
                              fontFamily="Inter, sans-serif"
                              sx={{ color: expirationStatus.color }}
                            >
                              {expirationStatus.text}
                            </Typography>
                          </Box>
                        </Stack>
                        {policy.isRenewal && (
                          <Chip
                            label="Póliza Renovada"
                            size="small"
                            icon={<RefreshIcon fontSize="small" />}
                            sx={{
                              backgroundColor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              fontFamily: 'Sora, sans-serif',
                              borderRadius: '8px',
                              alignSelf: 'flex-start',
                              '& .MuiChip-icon': {
                                color: theme.palette.info.main,
                              }
                            }}
                          />
                        )}
                      </Stack>
                    </Paper>
                  </Box>
                </Stack>
              </motion.div>
            )}
            {currentTab === 1 && (
              <motion.div
                key="reminders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.4)
                      : alpha(theme.palette.background.paper, 0.7),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    mb: 3
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontFamily="Sora, sans-serif"
                    sx={{ mb: 2 }}
                  >
                    Agregar Recordatorio
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <Stack spacing={2}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <DatePicker
                            label="Fecha del Recordatorio"
                            value={newReminder.date}
                            onChange={(date) => setNewReminder(prev => ({ ...prev, date }))}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                required: true,
                                variant: "outlined",
                                InputProps: {
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CalendarMonthIcon />
                                    </InputAdornment>
                                  ),
                                  sx: {
                                    borderRadius: '12px',
                                    fontFamily: 'Inter, sans-serif',
                                  }
                                },
                                InputLabelProps: {
                                  sx: {
                                    fontFamily: 'Inter, sans-serif',
                                  }
                                }
                              }
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <TextField
                            label="Descripción"
                            value={newReminder.description}
                            onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                            fullWidth
                            required
                            variant="outlined"
                            InputProps={{
                              sx: {
                                borderRadius: '12px',
                                fontFamily: 'Inter, sans-serif',
                              }
                            }}
                            InputLabelProps={{
                              sx: {
                                fontFamily: 'Inter, sans-serif',
                              }
                            }}
                          />
                        </Box>
                      </Stack>
                      <Box>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={loading === 'addReminder' ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                          onClick={handleAddReminder}
                          disabled={!newReminder.date || !newReminder.description.trim() || loading === 'addReminder'}
                          sx={{
                            borderRadius: '999px',
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          {loading === 'addReminder' ? 'Agregando...' : 'Agregar Recordatorio'}
                        </Button>
                      </Box>
                    </Stack>
                  </LocalizationProvider>
                </Paper>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  fontFamily="Sora, sans-serif"
                  sx={{ mb: 2 }}
                >
                  Recordatorios
                </Typography>
                {policy.reminders && policy.reminders.length > 0 ? (
                  <List sx={{
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.4)
                      : alpha(theme.palette.background.paper, 0.7),
                    borderRadius: '12px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    overflow: 'hidden',
                  }}>
                    {policy.reminders.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime()).map((reminder) => {
                      const isPast = reminder.date.toDate() < new Date() && new Date().toDateString() !== reminder.date.toDate().toDateString();
                      const isToday = new Date().toDateString() === reminder.date.toDate().toDateString();
                      return (
                        <ListItem
                          key={reminder.id}
                          sx={{
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            backgroundColor: reminder.completed
                              ? alpha(theme.palette.success.main, 0.05)
                              : isPast && !isToday
                                ? alpha(theme.palette.error.main, 0.05)
                                : isToday
                                  ? alpha(theme.palette.warning.main, 0.05)
                                  : 'transparent',
                            '&:last-child': {
                              borderBottom: 'none',
                            }
                          }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={reminder.completed}
                              onChange={() => handleToggleReminder(reminder.id, !reminder.completed)}
                              disabled={loading === `toggleReminder-${reminder.id}`}
                              sx={{
                                color: reminder.completed
                                  ? theme.palette.success.main
                                  : isPast && !isToday
                                    ? theme.palette.error.main
                                    : isToday
                                      ? theme.palette.warning.main
                                      : theme.palette.primary.main,
                                '&.Mui-checked': {
                                  color: theme.palette.success.main,
                                },
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                fontFamily="Sora, sans-serif"
                                sx={{
                                  textDecoration: reminder.completed ? 'line-through' : 'none',
                                  color: reminder.completed
                                    ? alpha(theme.palette.text.primary, 0.6)
                                    : theme.palette.text.primary
                                }}
                              >
                                {reminder.description}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                fontFamily="Inter, sans-serif"
                                sx={{
                                  color: reminder.completed
                                    ? alpha(theme.palette.text.secondary, 0.6)
                                    : isPast && !isToday
                                      ? theme.palette.error.main
                                      : isToday
                                        ? theme.palette.warning.main
                                        : theme.palette.text.secondary
                                }}
                              >
                                {format(reminder.date.toDate(), 'dd MMM yyyy', { locale: es })}
                                {isPast && !isToday && !reminder.completed && ' (Vencido)'}
                                {isToday && !reminder.completed && ' (Hoy)'}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            {loading === `toggleReminder-${reminder.id}` ? (
                              <CircularProgress size={20} />
                            ) : loading === `deleteReminder-${reminder.id}` ? (
                              <CircularProgress size={20} />
                            ) : (
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleDeleteReminder(reminder.id)}
                                size="small"
                                sx={{
                                  color: theme.palette.error.main,
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                  }
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
                  </List>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      textAlign: 'center',
                    }}
                  >
                    <NotificationsIcon
                      sx={{
                        fontSize: 48,
                        color: alpha(theme.palette.text.secondary, 0.3),
                        mb: 1
                      }}
                    />
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      fontFamily="Sora, sans-serif"
                      sx={{ mb: 1 }}
                    >
                      No hay recordatorios
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontFamily="Inter, sans-serif"
                    >
                      Agrega recordatorios para esta póliza para recibir notificaciones importantes.
                    </Typography>
                  </Paper>
                )}
              </motion.div>
            )}
            {currentTab === 2 && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.4)
                      : alpha(theme.palette.background.paper, 0.7),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    mb: 3
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    fontFamily="Sora, sans-serif"
                    sx={{ mb: 2 }}
                  >
                    Subir Documento
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={loading === 'uploadDocument' ? <CircularProgress size={20} color="inherit" /> : <FileUploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading === 'uploadDocument'}
                      sx={{
                        borderRadius: '999px',
                        fontFamily: 'Sora, sans-serif',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      {loading === 'uploadDocument' ? 'Subiendo...' : 'Seleccionar Archivo'}
                    </Button>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontFamily="Inter, sans-serif"
                    >
                      Formatos soportados: PDF, JPG, PNG, DOCX
                    </Typography>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                  </Stack>
                </Paper>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  fontFamily="Sora, sans-serif"
                  sx={{ mb: 2 }}
                >
                  Documentos
                </Typography>
                {policy.documents && policy.documents.length > 0 ? (
                  <List sx={{
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.4)
                      : alpha(theme.palette.background.paper, 0.7),
                    borderRadius: '12px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    overflow: 'hidden',
                  }}>
                    {policy.documents.map((document: PolicyDocument) => (
                      <ListItem
                        key={document.id}
                        sx={{
                          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          '&:last-child': {
                            borderBottom: 'none',
                          }
                        }}
                      >
                        <ListItemIcon>
                          <InsertDriveFileIcon sx={{ color: theme.palette.primary.main }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              fontFamily="Sora, sans-serif"
                            >
                              {document.name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              fontFamily="Inter, sans-serif"
                              color="text.secondary"
                            >
                              Subido el {format(document.uploadedAt.toDate(), 'dd MMM yyyy', { locale: es })}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Descargar">
                              <IconButton
                                edge="end"
                                aria-label="download"
                                href={document.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                sx={{
                                  color: theme.palette.primary.main,
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  }
                                }}
                              >
                                <FileDownloadIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {loading === `deleteDocument-${document.id}` ? (
                              <CircularProgress size={20} />
                            ) : (
                              <Tooltip title="Eliminar">
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDeleteDocument(document.id)}
                                  size="small"
                                  sx={{
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      background: theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.4)
                        : alpha(theme.palette.background.paper, 0.7),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      textAlign: 'center',
                    }}
                  >
                    <InsertDriveFileIcon
                      sx={{
                        fontSize: 48,
                        color: alpha(theme.palette.text.secondary, 0.3),
                        mb: 1
                      }}
                    />
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      fontFamily="Sora, sans-serif"
                      sx={{ mb: 1 }}
                    >
                      No hay documentos
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontFamily="Inter, sans-serif"
                    >
                      Sube documentos relacionados con esta póliza para tenerlos siempre a mano.
                    </Typography>
                  </Paper>
                )}
              </motion.div>
            )}
            {currentTab === 3 && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '12px',
                    background: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.4)
                      : alpha(theme.palette.background.paper, 0.7),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      fontFamily="Sora, sans-serif"
                    >
                      Notas
                    </Typography>
                    {!editingNotes ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => setEditingNotes(true)}
                        sx={{
                          borderRadius: '999px',
                          fontFamily: 'Sora, sans-serif',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          }
                        }}
                      >
                        Editar
                      </Button>
                    ) : (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setEditingNotes(false);
                            setNotes(policy.notes || '');
                          }}
                          disabled={loading === 'updateNotes'}
                          sx={{
                            borderRadius: '999px',
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={loading === 'updateNotes' ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                          onClick={handleSaveNotes}
                          disabled={loading === 'updateNotes'}
                          sx={{
                            borderRadius: '999px',
                            fontFamily: 'Sora, sans-serif',
                            fontWeight: 600,
                            textTransform: 'none',
                          }}
                        >
                          {loading === 'updateNotes' ? 'Guardando...' : 'Guardar'}
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                  {editingNotes ? (
                    <TextField
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      fullWidth
                      multiline
                      rows={8}
                      variant="outlined"
                      placeholder="Escribe notas adicionales sobre esta póliza..."
                      disabled={loading === 'updateNotes'}
                      InputProps={{
                        sx: {
                          borderRadius: '12px',
                          fontFamily: 'Inter, sans-serif',
                        }
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        minHeight: 150,
                        fontFamily: 'Inter, sans-serif',
                        whiteSpace: 'pre-wrap', // Ensures newlines in notes are respected
                      }}
                    >
                      {policy.notes ? (
                        <Typography
                          variant="body2"
                          fontFamily="Inter, sans-serif"
                          sx={{ whiteSpace: 'pre-wrap' }} // Ensures newlines in notes are respected
                        >
                          {policy.notes}
                        </Typography>
                      ) : (
                        <Stack
                          direction="column"
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                          sx={{ height: '100%', minHeight: 150 }}
                        >
                          <NoteIcon
                            sx={{
                              fontSize: 48,
                              color: alpha(theme.palette.text.secondary, 0.3),
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontFamily="Inter, sans-serif"
                            align="center"
                          >
                            No hay notas para esta póliza.
                            <br />
                            Haz clic en &quot;Editar&quot; para agregar información adicional.
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  )}
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </DialogContent>
      <Divider sx={{ opacity: 0.6 }} />
      <DialogActions sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }} alignItems="center">
          <Stack direction="row" spacing={1} sx={{ mr: 'auto' }}>
            <Tooltip title={policy.isStarred ? "Quitar destacado" : "Destacar"}>
              <IconButton
                color={policy.isStarred ? "warning" : "default"}
                onClick={handleToggleStar}
                disabled={loading === 'star'}
                sx={{
                  borderRadius: '12px',
                  border: `1px solid ${alpha(policy.isStarred ? theme.palette.warning.main : theme.palette.divider, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(policy.isStarred ? theme.palette.warning.main : theme.palette.primary.main, 0.05),
                  }
                }}
              >
                {loading === 'star' ? (
                  <CircularProgress size={24} color="inherit" />
                ) : policy.isStarred ? (
                  <StarIcon />
                ) : (
                  <StarBorderIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title={policy.isArchived ? "Desarchivar" : "Archivar"}>
              <IconButton
                color="default"
                onClick={handleToggleArchive}
                disabled={loading === 'archive'}
                sx={{
                  borderRadius: '12px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                {loading === 'archive' ? (
                  <CircularProgress size={24} color="inherit" />
                ) : policy.isArchived ? (
                  <UnarchiveIcon />
                ) : (
                  <ArchiveIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Duplicar">
              <IconButton
                color="default"
                onClick={handleDuplicate}
                disabled={loading === 'duplicate'}
                sx={{
                  borderRadius: '12px',
                  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  }
                }}
              >
                {loading === 'duplicate' ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <ContentCopyIcon />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
          <Button
            onClick={onClose}
            color="inherit"
            sx={{
              borderRadius: '999px',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Cerrar
          </Button>
          {policy.status === 'expired' && (
            <Button
              onClick={() => onRenew(policy)}
              color="warning"
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: '999px',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                borderColor: alpha(theme.palette.warning.main, 0.5),
                '&:hover': {
                  borderColor: theme.palette.warning.main,
                  backgroundColor: alpha(theme.palette.warning.main, 0.05),
                }
              }}
            >
              Renovar
            </Button>
          )}
          <Button
            onClick={() => onEdit(policy)}
            color="primary"
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{
              borderRadius: '999px',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: alpha(theme.palette.primary.main, 0.5),
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }
            }}
          >
            Editar
          </Button>
          <Button
            onClick={() => onDelete(policy)}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{
              borderRadius: '999px',
              fontFamily: 'Sora, sans-serif',
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: theme.palette.error.main,
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              }
            }}
          >
            Eliminar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default PolicyViewDialog;