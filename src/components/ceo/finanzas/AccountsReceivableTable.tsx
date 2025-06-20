'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Email,
  Person,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

// CEO Brand Colors
const ceoBrandColors = {
  primary: '#5D4FB0',
  secondary: '#A593F3', 
  accentBlue: '#A5CAE6',
  accentPink: '#D97DB7',
  background: '#F2EDEA',
  text: '#2E2E2E',
};

interface AccountsReceivableData {
  backlogMas30Dias: number;
  montoTotal: number;
  distribucionEdad: Record<string, number>;
}

interface AccountsReceivableTableProps {
  data: AccountsReceivableData;
}

// Sample accounts data
const sampleAccounts = [
  {
    id: 'acc-1',
    paciente: 'María González',
    monto: 2400,
    diasVencido: 45,
    ultimoContacto: '2024-02-15',
    estado: 'pendiente' as const,
  },
  {
    id: 'acc-2',
    paciente: 'Carlos Rodríguez',
    monto: 1800,
    diasVencido: 32,
    ultimoContacto: '2024-02-20',
    estado: 'contactado' as const,
  },
  {
    id: 'acc-3',
    paciente: 'Ana Martínez',
    monto: 3200,
    diasVencido: 67,
    ultimoContacto: '2024-01-28',
    estado: 'pendiente' as const,
  },
  {
    id: 'acc-4',
    paciente: 'Luis Silva',
    monto: 1600,
    diasVencido: 38,
    ultimoContacto: '2024-02-18',
    estado: 'en_proceso' as const,
  },
  {
    id: 'acc-5',
    paciente: 'Patricia López',
    monto: 2800,
    diasVencido: 52,
    ultimoContacto: '2024-02-10',
    estado: 'pendiente' as const,
  },
];

export default function AccountsReceivableTable({ data }: AccountsReceivableTableProps) {
  const theme = useTheme();
  const [accounts] = useState(sampleAccounts);

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return '#F44336';
      case 'contactado':
        return '#FF9800';
      case 'en_proceso':
        return '#2196F3';
      default:
        return '#4CAF50';
    }
  };

  const getStatusLabel = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'contactado':
        return 'Contactado';
      case 'en_proceso':
        return 'En Proceso';
      default:
        return 'Resuelto';
    }
  };

  const handleSendReminder = (accountId: string) => {
    console.log('Enviando recordatorio para cuenta:', accountId);
    // Implement reminder logic
  };

  const handleViewPatient = (accountId: string) => {
    console.log('Ver paciente para cuenta:', accountId);
    // Implement navigation to patient detail
  };

  return (
    <Paper
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 3,
        border: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}` }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600,
            color: ceoBrandColors.text,
            mb: 1,
          }}
        >
          Cuentas por Cobrar
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontFamily: '"Neris", sans-serif',
            color: alpha(ceoBrandColors.text, 0.7),
            mb: 2,
          }}
        >
          Cuentas pendientes > 30 días
        </Typography>

        {/* Summary */}
        <Box display="flex" gap={2}>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              background: alpha('#F44336', 0.1),
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#F44336',
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
              }}
            >
              Total: ${data.backlogMas30Dias?.toLocaleString() || '0'}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              background: alpha(ceoBrandColors.primary, 0.1),
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: ceoBrandColors.primary,
                fontFamily: '"Neris", sans-serif',
                fontWeight: 600,
              }}
            >
              {accounts.length} Cuentas
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                Paciente
              </TableCell>
              <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                Monto
              </TableCell>
              <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                Días
              </TableCell>
              <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontFamily: '"Neris", sans-serif', fontWeight: 600 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow 
                key={account.id}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(ceoBrandColors.primary, 0.05),
                  },
                }}
              >
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    {account.paciente}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      color: account.diasVencido > 60 ? '#F44336' : ceoBrandColors.text,
                    }}
                  >
                    ${account.monto.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {account.diasVencido > 60 && (
                      <Warning sx={{ fontSize: 16, color: '#F44336' }} />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: '"Neris", sans-serif',
                        color: account.diasVencido > 60 ? '#F44336' : ceoBrandColors.text,
                      }}
                    >
                      {account.diasVencido}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(account.estado)}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getStatusColor(account.estado), 0.1),
                      color: getStatusColor(account.estado),
                      fontFamily: '"Neris", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <Tooltip title="Enviar recordatorio">
                      <IconButton
                        size="small"
                        onClick={() => handleSendReminder(account.id)}
                        sx={{
                          color: ceoBrandColors.accentPink,
                          '&:hover': {
                            backgroundColor: alpha(ceoBrandColors.accentPink, 0.1),
                          },
                        }}
                      >
                        <Email sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver paciente">
                      <IconButton
                        size="small"
                        onClick={() => handleViewPatient(account.id)}
                        sx={{
                          color: ceoBrandColors.primary,
                          '&:hover': {
                            backgroundColor: alpha(ceoBrandColors.primary, 0.1),
                          },
                        }}
                      >
                        <Person sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Actions */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha(ceoBrandColors.primary, 0.1)}` }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<Email />}
          sx={{
            background: `linear-gradient(135deg, ${ceoBrandColors.accentPink} 0%, ${ceoBrandColors.secondary} 100%)`,
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600,
            mr: 1,
          }}
        >
          Enviar Recordatorios Masivos
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderColor: ceoBrandColors.primary,
            color: ceoBrandColors.primary,
            fontFamily: '"Neris", sans-serif',
            fontWeight: 600,
          }}
        >
          Exportar Lista
        </Button>
      </Box>
    </Paper>
  );
}
