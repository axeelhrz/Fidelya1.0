import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Stack,
  Box,
  useTheme,
  alpha,
  Divider,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Notes as NotesIcon,
  Warning as WarningIcon,
  Policy as PolicyIcon,
} from '@mui/icons-material';
import { Customer } from '@/types/customer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CustomerViewDialogProps {
  open: boolean;
  onClose: () => void;
  customer?: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onEmailCustomer: (customer: Customer) => void;
}

const CustomerViewDialog: React.FC<CustomerViewDialogProps> = ({
  open,
  onClose,
  customer,
  onEdit,
  onDelete,
  onEmailCustomer,
}) => {
  const theme = useTheme();
  
  if (!customer) return null;
  
  // Función para formatear fechas
  const formatDate = (dateValue: string | Date | { toDate: () => Date } | null | undefined) => {
    if (!dateValue) return 'N/A';
    
    try {
      const date = typeof dateValue === 'string' 
        ? new Date(dateValue) 
        : dateValue instanceof Date 
          ? dateValue 
          : dateValue.toDate();
      
      return format(date, 'dd MMMM yyyy', { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };
  
  // Función para obtener el color del chip según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: alpha(theme.palette.success.main, 0.2),
          color: theme.palette.success.main,
          text: 'Activo'
        };
      case 'inactive':
        return {
          bg: alpha(theme.palette.warning.main, 0.2),
          color: theme.palette.warning.main,
          text: 'Inactivo'
        };
      case 'lead':
        return {
          bg: alpha(theme.palette.info.main, 0.2),
          color: theme.palette.info.main,
          text: 'Lead'
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.2),
          color: theme.palette.grey[500],
          text: status
        };
    }
  };
  
  // Función para obtener el color del chip según el nivel de riesgo
  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return {
          bg: alpha(theme.palette.success.main, 0.2),
          color: theme.palette.success.main,
          text: 'Bajo'
        };
      case 'medium':
        return {
          bg: alpha(theme.palette.warning.main, 0.2),
          color: theme.palette.warning.main,
          text: 'Medio'
        };
      case 'high':
        return {
          bg: alpha(theme.palette.error.main, 0.2),
          color: theme.palette.error.main,
          text: 'Alto'
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.2),
          color: theme.palette.grey[500],
          text: riskLevel
        };
    }
  };
  
  // Función para obtener el texto del género
  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male':
        return 'Masculino';
      case 'female':
        return 'Femenino';
      case 'other':
        return 'Otro';
      default:
        return 'No especificado';
    }
  };
  
  // Función para obtener el texto del estado civil
  const getCivilStatusText = (civilStatus: string) => {
    switch (civilStatus) {
      case 'single':
        return 'Soltero/a';
      case 'married':
        return 'Casado/a';
      case 'divorced':
        return 'Divorciado/a';
      case 'widowed':
        return 'Viudo/a';
      default:
        return 'No especificado';
    }
  };
  
  const statusColor = getStatusColor(customer.status || 'inactive');
  const riskLevelColor = getRiskLevelColor(customer.riskLevel || 'medium');
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 3, 
        fontFamily: "'Sora', sans-serif",
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        Detalles del cliente
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            bgcolor: alpha(theme.palette.text.secondary, 0.1),
            '&:hover': {
              bgcolor: alpha(theme.palette.text.secondary, 0.2),
            }
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Cabecera con información básica */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              background: theme.palette.mode === 'dark' 
                ? alpha(theme.palette.background.default, 0.6)
                : alpha(theme.palette.background.default, 0.6),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
              <Avatar 
                src={customer.photoURL || undefined}
                alt={customer.name || 'Cliente'}
                sx={{ 
                  width: 80, 
                  height: 80,
                  bgcolor: !customer.photoURL 
                    ? `${theme.palette.primary.main}` 
                    : undefined,
                  fontSize: 32,
                }}
              >
                {!customer.photoURL && (customer.name?.charAt(0) || 'C')}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={{ xs: 1, sm: 2 }} 
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  mb={1}
                >
                  <Typography 
                    variant="h5" 
                    fontWeight={700}
                    fontFamily="'Sora', sans-serif"
                  >
                    {customer.name || 'Sin nombre'}
                  </Typography>
                  
                  <Chip
                    label={statusColor.text}
                    size="small"
                    sx={{
                      bgcolor: statusColor.bg,
                      color: statusColor.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                      borderRadius: '6px',
                    }}
                  />
                  
                  <Chip
                    label={riskLevelColor.text}
                    size="small"
                    icon={<WarningIcon fontSize="small" />}
                    sx={{
                      bgcolor: riskLevelColor.bg,
                      color: riskLevelColor.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      fontFamily: "'Sora', sans-serif",
                      borderRadius: '6px',
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      }
                    }}
                  />
                </Stack>
                
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  fontFamily="'Sora', sans-serif"
                  gutterBottom
                >
                  Cliente desde {formatDate(customer.createdAt)}
                </Typography>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2}
                  mt={2}
                >
                  {customer.email && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EmailIcon />}
                      onClick={() => onEmailCustomer(customer)}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        fontFamily: "'Sora', sans-serif",
                      }}
                    >
                      Enviar email
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(customer)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    Editar
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => onDelete(customer)}
                    color="error"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      fontFamily: "'Sora', sans-serif",
                    }}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>
          
          {/* Secciones de información - Fila 1 */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Información de contacto */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600}
                fontFamily="'Sora', sans-serif"
                gutterBottom
              >
                Información de contacto
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={2}>
                {customer.email && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <EmailIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Email
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {customer.email}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {customer.phone && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                      }}
                    >
                      <PhoneIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Teléfono
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {customer.phone}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {customer.address && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                      }}
                    >
                      <LocationOnIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Dirección
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {customer.address}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Paper>
            
            {/* Información personal */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600}
                fontFamily="'Sora', sans-serif"
                gutterBottom
              >
                Información personal
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={2}>
                {customer.gender && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                      }}
                    >
                      <WcIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Género
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {getGenderText(customer.gender)}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {customer.birthDate && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                      }}
                    >
                      <CakeIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Fecha de nacimiento
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {formatDate(customer.birthDate)}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {customer.civilStatus && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: theme.palette.error.main,
                      }}
                    >
                      <FamilyRestroomIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Estado civil
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {getCivilStatusText(customer.civilStatus)}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Paper>
          </Stack>
          
          {/* Secciones de información - Fila 2 */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Información profesional */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                flex: 1,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography 
                variant="h6" 
                fontWeight={600}
                fontFamily="'Sora', sans-serif"
                gutterBottom
              >
                Información profesional
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Stack spacing={2}>
                {customer.occupation && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <WorkIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Ocupación
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {customer.occupation}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {customer.company && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                      }}
                    >
                      <BusinessIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Empresa
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {customer.company}
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {customer.policies && customer.policies.length > 0 && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                      }}
                    >
                      <PolicyIcon />
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontFamily="'Sora', sans-serif"
                      >
                        Pólizas
                      </Typography>
                      <Typography 
                        variant="body1"
                        fontWeight={500}
                        fontFamily="'Sora', sans-serif"
                      >
                        {customer.policies.length} pólizas activas
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Paper>
            
            {/* Notas */}
            {customer.notes ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  flex: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                    }}
                  >
                    <NotesIcon />
                  </Box>
                  <Typography 
                    variant="h6" 
                    fontWeight={600}
                    fontFamily="'Sora', sans-serif"
                  >
                    Notas
                  </Typography>
                </Stack>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography 
                  variant="body1"
                  fontFamily="'Sora', sans-serif"
                  sx={{ 
                    whiteSpace: 'pre-wrap',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.background.default, 0.6)
                      : alpha(theme.palette.background.default, 0.6),
                  }}
                >
                  {customer.notes}
                </Typography>
              </Paper>
            ) : (
              // Placeholder para mantener el layout cuando no hay notas
              <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
            )}
          </Stack>
        </Stack>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            fontFamily: "'Sora', sans-serif",
            px: 3,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerViewDialog;