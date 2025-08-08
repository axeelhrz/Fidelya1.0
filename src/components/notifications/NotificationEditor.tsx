'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Stack,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Badge,
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Preview,
  Send,
  Schedule,
  Image,
  Link,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatColorText,
  FormatSize,
  Palette,
  DragIndicator,
  ExpandMore,
  Visibility,
  VisibilityOff,
  Code,
  SmartButton,
  Email,
  Sms,
  NotificationsActive,
  PhoneAndroid,
  Group,
  Person,
  Business,
  LocationOn,
  AccessTime,
  TrendingUp,
  AttachMoney,
  Star,
  Warning,
  CheckCircle,
  Info,
  Error
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { NotificationTemplatesService } from '../../services/notification-templates.service';

interface NotificationElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'divider' | 'variable' | 'conditional';
  content: any;
  style: ElementStyle;
  position: number;
}

interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  textAlign?: 'left' | 'center' | 'right';
  borderRadius?: string;
  border?: string;
}

interface NotificationPreview {
  channel: 'email' | 'sms' | 'push' | 'app';
  subject?: string;
  content: string;
  variables: Record<string, any>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`editor-tabpanel-${index}`}
      aria-labelledby={`editor-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export default function NotificationEditor() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [elements, setElements] = useState<NotificationElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewChannel, setPreviewChannel] = useState<'email' | 'sms' | 'push' | 'app'>('email');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('general');
  const [templateChannels, setTemplateChannels] = useState<string[]>(['email']);
  const [variables, setVariables] = useState<Record<string, any>>({
    nombre: 'Juan Pérez',
    asociacion: 'Mi Asociación',
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
    beneficio: 'Descuento 20%',
    comercio: 'Restaurante El Buen Sabor'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [showVariables, setShowVariables] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Elementos disponibles para arrastrar
  const availableElements = [
    {
      type: 'text',
      label: 'Texto',
      icon: <FormatSize />,
      description: 'Párrafo de texto editable'
    },
    {
      type: 'image',
      label: 'Imagen',
      icon: <Image />,
      description: 'Imagen con URL personalizable'
    },
    {
      type: 'button',
      label: 'Botón',
      icon: <SmartButton />,
      description: 'Botón de acción con enlace'
    },
    {
      type: 'divider',
      label: 'Separador',
      icon: <Divider />,
      description: 'Línea divisoria'
    },
    {
      type: 'variable',
      label: 'Variable',
      icon: <Code />,
      description: 'Variable dinámica'
    },
    {
      type: 'conditional',
      label: 'Condicional',
      icon: <Warning />,
      description: 'Contenido condicional'
    }
  ];

  // Variables disponibles
  const availableVariables = [
    { key: 'nombre', label: 'Nombre del usuario', example: 'Juan Pérez' },
    { key: 'asociacion', label: 'Nombre de la asociación', example: 'Mi Asociación' },
    { key: 'fecha', label: 'Fecha actual', example: new Date().toLocaleDateString() },
    { key: 'hora', label: 'Hora actual', example: new Date().toLocaleTimeString() },
    { key: 'beneficio', label: 'Nombre del beneficio', example: 'Descuento 20%' },
    { key: 'comercio', label: 'Nombre del comercio', example: 'Restaurante El Buen Sabor' },
    { key: 'ubicacion', label: 'Ubicación', example: 'Ciudad de México' },
    { key: 'telefono', label: 'Teléfono', example: '+52 55 1234 5678' },
    { key: 'email', label: 'Email', example: 'usuario@email.com' },
    { key: 'codigo', label: 'Código de descuento', example: 'DESC20' }
  ];

  useEffect(() => {
    // Cargar plantilla inicial si existe
    loadInitialTemplate();
  }, []);

  const loadInitialTemplate = () => {
    // Plantilla de ejemplo inicial
    const initialElements: NotificationElement[] = [
      {
        id: '1',
        type: 'text',
        content: {
          text: '¡Hola {{nombre}}!'
        },
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1976d2',
          textAlign: 'center',
          margin: '0 0 20px 0'
        },
        position: 0
      },
      {
        id: '2',
        type: 'text',
        content: {
          text: 'Tienes un nuevo beneficio disponible en {{comercio}}.'
        },
        style: {
          fontSize: '16px',
          color: '#333',
          textAlign: 'left',
          margin: '0 0 15px 0'
        },
        position: 1
      },
      {
        id: '3',
        type: 'button',
        content: {
          text: 'Ver Beneficio',
          url: 'https://app.asociacion.com/beneficios',
          color: '#fff',
          backgroundColor: '#1976d2'
        },
        style: {
          textAlign: 'center',
          margin: '20px 0'
        },
        position: 2
      }
    ];

    setElements(initialElements);
    setTemplateName('Notificación de Beneficio');
    setTemplateDescription('Plantilla para notificar nuevos beneficios disponibles');
  };

  const handleDragStart = (elementType: string) => {
    setDraggedElement(elementType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedElement) return;

    const newElement: NotificationElement = {
      id: Date.now().toString(),
      type: draggedElement as any,
      content: getDefaultContent(draggedElement),
      style: getDefaultStyle(draggedElement),
      position: elements.length
    };

    setElements(prev => [...prev, newElement]);
    setDraggedElement(null);
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'text':
        return { text: 'Nuevo texto' };
      case 'image':
        return { url: 'https://via.placeholder.com/300x200', alt: 'Imagen' };
      case 'button':
        return { text: 'Botón', url: '#', color: '#fff', backgroundColor: '#1976d2' };
      case 'divider':
        return { color: '#ddd', height: '1px' };
      case 'variable':
        return { variable: 'nombre' };
      case 'conditional':
        return { condition: 'user.type === "premium"', content: 'Contenido para usuarios premium' };
      default:
        return {};
    }
  };

  const getDefaultStyle = (type: string): ElementStyle => {
    switch (type) {
      case 'text':
        return { fontSize: '16px', color: '#333', textAlign: 'left', margin: '10px 0' };
      case 'image':
        return { textAlign: 'center', margin: '15px 0' };
      case 'button':
        return { textAlign: 'center', margin: '20px 0' };
      case 'divider':
        return { margin: '20px 0' };
      case 'variable':
        return { fontSize: '16px', color: '#1976d2', fontWeight: 'bold' };
      case 'conditional':
        return { fontSize: '14px', color: '#666', fontStyle: 'italic' };
      default:
        return {};
    }
  };

  const handleElementClick = (elementId: string) => {
    setSelectedElement(elementId);
  };

  const handleElementUpdate = (elementId: string, updates: Partial<NotificationElement>) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const handleElementDelete = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  const moveElement = (elementId: string, direction: 'up' | 'down') => {
    const elementIndex = elements.findIndex(el => el.id === elementId);
    if (elementIndex === -1) return;

    const newElements = [...elements];
    const targetIndex = direction === 'up' ? elementIndex - 1 : elementIndex + 1;

    if (targetIndex < 0 || targetIndex >= newElements.length) return;

    // Intercambiar elementos
    [newElements[elementIndex], newElements[targetIndex]] = [newElements[targetIndex], newElements[elementIndex]];
    
    // Actualizar posiciones
    newElements.forEach((el, index) => {
      el.position = index;
    });

    setElements(newElements);
  };

  const generatePreview = (): NotificationPreview => {
    let content = '';
    
    elements
      .sort((a, b) => a.position - b.position)
      .forEach(element => {
        switch (element.type) {
          case 'text':
            content += replaceVariables(element.content.text) + '\n\n';
            break;
          case 'image':
            if (previewChannel === 'email') {
              content += `[Imagen: ${element.content.alt}]\n\n`;
            }
            break;
          case 'button':
            content += `[${element.content.text}: ${element.content.url}]\n\n`;
            break;
          case 'divider':
            content += '---\n\n';
            break;
          case 'variable':
            content += replaceVariables(`{{${element.content.variable}}}`) + '\n\n';
            break;
          case 'conditional':
            content += `[Condicional: ${element.content.condition}]\n${element.content.content}\n\n`;
            break;
        }
      });

    return {
      channel: previewChannel,
      subject: replaceVariables(templateName),
      content: content.trim(),
      variables
    };
  };

  const replaceVariables = (text: string): string => {
    let result = text;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    });
    return result;
  };

  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      const template = {
        name: templateName,
        description: templateDescription,
        category: templateCategory,
        channels: templateChannels,
        elements,
        variables: Object.keys(variables),
        createdBy: user?.uid || 'unknown',
        createdAt: new Date()
      };

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Plantilla guardada exitosamente');
      setSaveDialogOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Error al guardar la plantilla');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    try {
      setLoading(true);
      setError(null);

      const preview = generatePreview();
      
      // Simular envío de prueba
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(`Notificación de prueba enviada por ${preview.channel.toUpperCase()}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error sending test:', err);
      setError('Error al enviar la notificación de prueba');
    } finally {
      setLoading(false);
    }
  };

  const renderElement = (element: NotificationElement) => {
    const isSelected = selectedElement === element.id;
    
    return (
      <motion.div
        key={element.id}
        layout
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleElementClick(element.id)}
        style={{
          border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
          borderRadius: '8px',
          padding: '12px',
          margin: '8px 0',
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: isSelected ? '#f3f7ff' : '#fff'
        }}
      >
        {/* Controles del elemento */}
        <Box sx={{ 
          position: 'absolute', 
          top: -10, 
          right: -10, 
          display: 'flex', 
          gap: 0.5,
          opacity: isSelected ? 1 : 0,
          transition: 'opacity 0.2s'
        }}>
          <IconButton 
            size="small" 
            onClick={(e) => { e.stopPropagation(); moveElement(element.id, 'up'); }}
            sx={{ backgroundColor: '#fff', boxShadow: 1 }}
          >
            <DragIndicator />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={(e) => { e.stopPropagation(); handleElementDelete(element.id); }}
            sx={{ backgroundColor: '#fff', boxShadow: 1 }}
          >
            <Delete />
          </IconButton>
        </Box>

        {/* Contenido del elemento */}
        {element.type === 'text' && (
          <Typography 
            style={element.style}
            dangerouslySetInnerHTML={{ 
              __html: replaceVariables(element.content.text) 
            }}
          />
        )}

        {element.type === 'image' && (
          <Box sx={{ textAlign: element.style.textAlign || 'center' }}>
            <img 
              src={element.content.url} 
              alt={element.content.alt}
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                borderRadius: element.style.borderRadius || '4px'
              }}
            />
          </Box>
        )}

        {element.type === 'button' && (
          <Box sx={{ textAlign: element.style.textAlign || 'center' }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: element.content.backgroundColor,
                color: element.content.color,
                borderRadius: element.style.borderRadius || '4px'
              }}
            >
              {replaceVariables(element.content.text)}
            </Button>
          </Box>
        )}

        {element.type === 'divider' && (
          <Divider 
            style={{
              backgroundColor: element.content.color,
              height: element.content.height,
              margin: element.style.margin
            }}
          />
        )}

        {element.type === 'variable' && (
          <Chip
            label={`{{${element.content.variable}}}`}
            color="primary"
            variant="outlined"
            style={element.style}
          />
        )}

        {element.type === 'conditional' && (
          <Alert severity="info" style={element.style}>
            <Typography variant="caption" display="block">
              Condición: {element.content.condition}
            </Typography>
            <Typography variant="body2">
              {replaceVariables(element.content.content)}
            </Typography>
          </Alert>
        )}
      </motion.div>
    );
  };

  const renderElementEditor = () => {
    const element = elements.find(el => el.id === selectedElement);
    if (!element) return null;

    return (
      <Card>
        <CardHeader
          title={`Editar ${element.type}`}
          action={
            <IconButton onClick={() => setSelectedElement(null)}>
              <VisibilityOff />
            </IconButton>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            {element.type === 'text' && (
              <>
                <TextField
                  label="Texto"
                  multiline
                  rows={3}
                  value={element.content.text}
                  onChange={(e) => handleElementUpdate(element.id, {
                    content: { ...element.content, text: e.target.value }
                  })}
                  fullWidth
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <TextField
                    label="Tamaño de fuente"
                    value={element.style.fontSize || '16px'}
                    onChange={(e) => handleElementUpdate(element.id, {
                      style: { ...element.style, fontSize: e.target.value }
                    })}
                  />
                  <TextField
                    label="Color"
                    type="color"
                    value={element.style.color || '#333333'}
                    onChange={(e) => handleElementUpdate(element.id, {
                      style: { ...element.style, color: e.target.value }
                    })}
                  />
                </Box>
                <FormControl fullWidth>
                  <InputLabel>Alineación</InputLabel>
                  <Select
                    value={element.style.textAlign || 'left'}
                    onChange={(e) => handleElementUpdate(element.id, {
                      style: { ...element.style, textAlign: e.target.value as any }
                    })}
                  >
                    <MenuItem value="left">Izquierda</MenuItem>
                    <MenuItem value="center">Centro</MenuItem>
                    <MenuItem value="right">Derecha</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {element.type === 'button' && (
              <>
                <TextField
                  label="Texto del botón"
                  value={element.content.text}
                  onChange={(e) => handleElementUpdate(element.id, {
                    content: { ...element.content, text: e.target.value }
                  })}
                  fullWidth
                />
                <TextField
                  label="URL"
                  value={element.content.url}
                  onChange={(e) => handleElementUpdate(element.id, {
                    content: { ...element.content, url: e.target.value }
                  })}
                  fullWidth
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <TextField
                    label="Color del texto"
                    type="color"
                    value={element.content.color || '#ffffff'}
                    onChange={(e) => handleElementUpdate(element.id, {
                      content: { ...element.content, color: e.target.value }
                    })}
                  />
                  <TextField
                    label="Color de fondo"
                    type="color"
                    value={element.content.backgroundColor || '#1976d2'}
                    onChange={(e) => handleElementUpdate(element.id, {
                      content: { ...element.content, backgroundColor: e.target.value }
                    })}
                  />
                </Box>
              </>
            )}

            {element.type === 'image' && (
              <>
                <TextField
                  label="URL de la imagen"
                  value={element.content.url}
                  onChange={(e) => handleElementUpdate(element.id, {
                    content: { ...element.content, url: e.target.value }
                  })}
                  fullWidth
                />
                <TextField
                  label="Texto alternativo"
                  value={element.content.alt}
                  onChange={(e) => handleElementUpdate(element.id, {
                    content: { ...element.content, alt: e.target.value }
                  })}
                  fullWidth
                />
              </>
            )}

            {element.type === 'variable' && (
              <FormControl fullWidth>
                <InputLabel>Variable</InputLabel>
                <Select
                  value={element.content.variable}
                  onChange={(e) => handleElementUpdate(element.id, {
                    content: { ...element.content, variable: e.target.value }
                  })}
                >
                  {availableVariables.map((variable) => (
                    <MenuItem key={variable.key} value={variable.key}>
                      {variable.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editor Visual de Notificaciones
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Crea y personaliza notificaciones con nuestro editor drag & drop
        </Typography>
      </Box>

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Nombre de la plantilla"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Canal</InputLabel>
            <Select
              value={previewChannel}
              onChange={(e) => setPreviewChannel(e.target.value as any)}
            >
              <MenuItem value="email">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email fontSize="small" />
                  Email
                </Box>
              </MenuItem>
              <MenuItem value="sms">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Sms fontSize="small" />
                  SMS
                </Box>
              </MenuItem>
              <MenuItem value="push">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsActive fontSize="small" />
                  Push
                </Box>
              </MenuItem>
              <MenuItem value="app">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneAndroid fontSize="small" />
                  App
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="outlined"
            startIcon={<Preview />}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Editor' : 'Vista Previa'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<Send />}
            onClick={handleSendTest}
            disabled={loading}
          >
            Enviar Prueba
          </Button>

          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={() => setSaveDialogOpen(true)}
            disabled={loading}
          >
            Guardar
          </Button>
        </Stack>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '250px 1fr 300px' }, gap: 3 }}>
        {/* Elementos disponibles */}
        {!previewMode && (
          <Paper sx={{ p: 2, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom>
              Elementos
            </Typography>
            <Stack spacing={1}>
              {availableElements.map((element) => (
                <motion.div
                  key={element.type}
                  draggable
                  onDragStart={() => handleDragStart(element.type)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    sx={{ 
                      cursor: 'grab',
                      '&:active': { cursor: 'grabbing' }
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {element.icon}
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {element.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {element.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Editor/Preview */}
        <Paper 
          sx={{ 
            p: 3, 
            minHeight: '600px',
            backgroundColor: previewMode ? '#f5f5f5' : '#fff'
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          ref={editorRef}
        >
          {previewMode ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Vista Previa - {previewChannel.toUpperCase()}
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {previewChannel === 'email' && (
                <Box sx={{ 
                  backgroundColor: '#fff', 
                  p: 3, 
                  borderRadius: 2, 
                  boxShadow: 1,
                  maxWidth: 600,
                  mx: 'auto'
                }}>
                  <Typography variant="h6" gutterBottom>
                    {replaceVariables(templateName)}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {elements
                    .sort((a, b) => a.position - b.position)
                    .map(renderElement)}
                </Box>
              )}

              {previewChannel === 'sms' && (
                <Box sx={{ 
                  backgroundColor: '#e3f2fd', 
                  p: 2, 
                  borderRadius: 2,
                  maxWidth: 300,
                  mx: 'auto'
                }}>
                  <Typography variant="body2">
                    {generatePreview().content}
                  </Typography>
                </Box>
              )}

              {(previewChannel === 'push' || previewChannel === 'app') && (
                <Box sx={{ 
                  backgroundColor: '#fff', 
                  p: 2, 
                  borderRadius: 2, 
                  boxShadow: 2,
                  maxWidth: 400,
                  mx: 'auto',
                  border: '1px solid #ddd'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, backgroundColor: '#1976d2' }}>
                      <NotificationsActive fontSize="small" />
                    </Avatar>
                    <Typography variant="body2" fontWeight="bold">
                      {variables.asociacion}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {generatePreview().content.substring(0, 100)}...
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Arrastra elementos aquí para construir tu notificación
              </Typography>
              
              {elements.length === 0 ? (
                <Box sx={{ 
                  border: '2px dashed #ddd', 
                  borderRadius: 2, 
                  p: 4, 
                  textAlign: 'center',
                  color: 'text.secondary'
                }}>
                  <Typography variant="body1">
                    Arrastra elementos desde el panel izquierdo para comenzar
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {elements
                    .sort((a, b) => a.position - b.position)
                    .map(renderElement)}
                </Box>
              )}
            </Box>
          )}
        </Paper>

        {/* Panel lateral */}
        {!previewMode && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Variables */}
            <Accordion expanded={showVariables} onChange={() => setShowVariables(!showVariables)}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Variables</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={1}>
                  {availableVariables.map((variable) => (
                    <Box key={variable.key}>
                      <Typography variant="body2" fontWeight="bold">
                        {`{{${variable.key}}}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {variable.label}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ fontStyle: 'italic' }}>
                        Ej: {variable.example}
                      </Typography>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Editor de elemento seleccionado */}
            {selectedElement && renderElementEditor()}
          </Box>
        )}
      </Box>

      {/* Dialog para guardar plantilla */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Guardar Plantilla</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Nombre de la plantilla"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Descripción"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value)}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="marketing">Marketing</MenuItem>
                <MenuItem value="transactional">Transaccional</MenuItem>
                <MenuItem value="system">Sistema</MenuItem>
              </Select>
            </FormControl>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Canales compatibles
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {['email', 'sms', 'push', 'app'].map((channel) => (
                  <FormControlLabel
                    key={channel}
                    control={
                      <Checkbox
                        checked={templateChannels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTemplateChannels(prev => [...prev, channel]);
                          } else {
                            setTemplateChannels(prev => prev.filter(c => c !== channel));
                          }
                        }}
                      />
                    }
                    label={channel.toUpperCase()}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveTemplate} 
            variant="contained"
            disabled={loading || !templateName.trim()}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading overlay */}
      {loading && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 9999,
          backgroundColor: 'rgba(255,255,255,0.8)'
        }}>
          <LinearProgress />
        </Box>
      )}
    </Container>
  );
}