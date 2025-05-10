import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Typography,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Divider,
  TablePagination,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { format, isBefore, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task, TaskPriority, TaskStatus } from '../../../types/tasks';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Estado para el menú de opciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Estado para la paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleEdit = (task: Task) => {
    handleCloseMenu();
    onEdit(task);
  };

  const handleDelete = (taskId: string) => {
    handleCloseMenu();
    onDelete(taskId);
  };

 

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Función para obtener el color según la prioridad
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'alta':
        return theme.palette.error.main;
      case 'media':
        return theme.palette.warning.main;
      case 'baja':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Función para obtener el color según el estado
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pendiente':
        return theme.palette.info.main;
      case 'en_progreso':
        return theme.palette.warning.main;
      case 'completada':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  // Función para obtener el texto de la prioridad
  const getPriorityText = (priority: TaskPriority) => {
    switch (priority) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return 'Normal';
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_progreso':
        return 'En Progreso';
      case 'completada':
        return 'Completada';
      default:
        return 'Pendiente';
    }
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return `Hoy, ${format(date, 'HH:mm')}`;
    }
    return format(date, "d 'de' MMMM, HH:mm", { locale: es });
  };

  // Verificar si una tarea está vencida
  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    
    const dueDate = 'toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate;
    return task.status !== 'completada' && isBefore(dueDate, new Date());
  };

  // Calcular tareas para la página actual
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;

  const visibleTasks = tasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{
          maxHeight: 'calc(100vh - 300px)',
          overflow: 'auto'
        }}
      >
        <Table stickyHeader aria-label="tabla de tareas">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    tasks.some((task) => task.status === 'completada') &&
                    !tasks.every((task) => task.status === 'completada')
                  }
                  checked={
                    tasks.length > 0 &&
                    tasks.every((task) => task.status === 'completada')
                  }
                  onChange={(event) => {
                    const newStatus = event.target.checked ? 'completada' : 'pendiente';
                    tasks.forEach((task) => {
                      if (task.id && task.status !== newStatus) {
                        onComplete(task.id);
                      }
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Título
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Fecha de vencimiento
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Prioridad
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Estado
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" fontWeight={600}>
                  Acciones
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleTasks.map((task) => (
              <TableRow
                key={task.id}
                hover
                onClick={() => onEdit(task)}
                sx={{
                  cursor: 'pointer',
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: isTaskOverdue(task)
                    ? alpha(theme.palette.error.main, 0.05)
                    : 'inherit',
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={task.status === 'completada'}
                    onChange={() => task.id && onComplete(task.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (task.id) onComplete(task.id);
                    }}
                  />
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    textDecoration:
                      task.status === 'completada' ? 'line-through' : 'none',
                    color:
                      task.status === 'completada'
                        ? 'text.secondary'
                        : 'text.primary',
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                      textDecoration:
                        task.status === 'completada' ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </Typography>
                  {task.description && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: 'block',
                        mt: 0.5,
                        textDecoration:
                          task.status === 'completada' ? 'line-through' : 'none',
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarTodayIcon
                        fontSize="small"
                        sx={{
                          fontSize: 16,
                          color: isTaskOverdue(task)
                            ? theme.palette.error.main
                            : theme.palette.text.secondary,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: isTaskOverdue(task)
                            ? theme.palette.error.main
                            : theme.palette.text.secondary,
                          fontWeight: isTaskOverdue(task) ? 600 : 400,
                        }}
                      >
                        {isTaskOverdue(task)
                          ? `Vencida: ${formatDate('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate)}`
                          : formatDate('toDate' in task.dueDate ? task.dueDate.toDate() : task.dueDate)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Sin fecha
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    icon={
                      <FlagIcon
                        fontSize="small"
                        sx={{ color: getPriorityColor(task.priority) }}
                      />
                    }
                    label={getPriorityText(task.priority)}
                    sx={{
                      borderRadius: '8px',
                      background: alpha(getPriorityColor(task.priority), 0.1),
                      color: getPriorityColor(task.priority),
                      fontWeight: 600,
                      border: `1px solid ${alpha(
                        getPriorityColor(task.priority),
                        0.2
                      )}`,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={getStatusText(task.status)}
                    sx={{
                      borderRadius: '8px',
                      background: alpha(getStatusColor(task.status), 0.1),
                      color: getStatusColor(task.status),
                      fontWeight: 600,
                      border: `1px solid ${alpha(
                        getStatusColor(task.status),
                        0.2
                      )}`,
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(e) => task.id && handleOpenMenu(e, task.id)}
                    sx={{
                      color: theme.palette.text.secondary,
                      '&:hover': {
                        color: theme.palette.text.primary,
                        background: isDark
                          ? 'rgba(255, 255, 255, 0.1)'
                          : 'rgba(0, 0, 0, 0.05)',
                      },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No hay tareas disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />

      {/* Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: '16px',
            minWidth: 180,
            overflow: 'hidden',
            mt: 1,
            '& .MuiList-root': {
              py: 1,
            },
            background: isDark
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${
              isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            }`,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            const task = tasks.find((t) => t.id === selectedTaskId);
            if (task) handleEdit(task);
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Ver detalles</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            const task = tasks.find((t) => t.id === selectedTaskId);
            if (task) handleEdit(task);
          }}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedTaskId) {
              const task = tasks.find((t) => t.id === selectedTaskId);
              if (task && task.status !== 'completada') {
                onComplete(selectedTaskId);
                handleCloseMenu();
              }
            }
          }}
          disabled={
            selectedTaskId
              ? tasks.find((t) => t.id === selectedTaskId)?.status ===
                'completada'
              : false
          }
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Completar</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => {
            if (selectedTaskId) handleDelete(selectedTaskId);
          }}
          sx={{ py: 1.5, color: theme.palette.error.main }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};