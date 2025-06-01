import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Box,
  Skeleton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ClientesTable = ({ clientes, loading, onEdit, onDelete }) => {
  const formatearFecha = (fechaString) => {
    if (!fechaString) return 'N/A';
    try {
      const fecha = new Date(fechaString);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (loading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Registrado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                <TableCell><Skeleton variant="text" width="70%" /></TableCell>
                <TableCell><Skeleton variant="text" width="90%" /></TableCell>
                <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                <TableCell><Skeleton variant="text" width="50%" /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton variant="circular" width={32} height={32} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (clientes.length === 0) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center'
      }}>
        <PersonIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay clientes registrados
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Comienza agregando tu primer cliente
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
              Cliente
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
              Contacto
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
              Dirección
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
              Notas
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
              Registrado
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((cliente, index) => (
            <motion.tr
              key={cliente.id}
              component={TableRow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'scale(1.01)',
                },
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {cliente.nombre}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ID: {cliente.id}
                  </Typography>
                </Box>
              </TableCell>
              
              <TableCell>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {cliente.correo && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {truncateText(cliente.correo, 25)}
                      </Typography>
                    </Box>
                  )}
                  {cliente.telefono && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: 'success.main' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {cliente.telefono}
                      </Typography>
                    </Box>
                  )}
                  {!cliente.correo && !cliente.telefono && (
                    <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                      Sin contacto
                    </Typography>
                  )}
                </Box>
              </TableCell>
              
              <TableCell>
                {cliente.direccion ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Tooltip title={cliente.direccion} arrow>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {truncateText(cliente.direccion, 30)}
                      </Typography>
                    </Tooltip>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                    Sin dirección
                  </Typography>
                )}
              </TableCell>
              
              <TableCell>
                {cliente.notas ? (
                  <Tooltip title={cliente.notas} arrow>
                    <Chip
                      label={truncateText(cliente.notas, 20)}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        height: 24,
                        borderRadius: 2
                      }}
                    />
                  </Tooltip>
                ) : (
                  <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                    Sin notas
                  </Typography>
                )}
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {formatearFecha(cliente.creado)}
                </Typography>
              </TableCell>
              
              <TableCell align="center">
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <Tooltip title="Editar cliente" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(cliente);
                      }}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Eliminar cliente" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(cliente);
                      }}
                      sx={{
                        color: 'error.main',
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'white',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientesTable;