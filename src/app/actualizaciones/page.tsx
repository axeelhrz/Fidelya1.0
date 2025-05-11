'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  MagnifyingGlass,
  Star,
  Sparkle,
  Bug,
  CaretRight,
} from '@phosphor-icons/react';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos
type UpdateType = 'new' | 'improvement' | 'fix';

interface UpdateItem {
  title: string;
  description: string;
  type: UpdateType;
}

interface VersionRelease {
  version: string;
  date: string;
  highlights: string;
  updates: UpdateItem[];
  isNew?: boolean;
}

// Componentes estilizados
const StyledCard = styled(motion(Card))(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(8px)',
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const FilterChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(2, 1),
  height: 42,
  fontSize: '0.9rem',
  fontWeight: 500,
  '&.MuiChip-outlined': {
    borderWidth: '2px',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  },
  '&.MuiChip-filled': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderColor: 'transparent',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    backgroundColor: alpha(theme.palette.background.paper, 0.6),
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
    },
    '&.Mui-focused': {
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

// Datos de ejemplo
const UPDATES_DATA: VersionRelease[] = [
  {
    version: '2.1.0',
    date: '2024-01-15',
    highlights: 'Nuevas funcionalidades para gestión de pólizas y mejoras en el dashboard',
    isNew: true,
    updates: [
      {
        type: 'new',
        title: 'Sistema de recordatorios automáticos',
        description: 'Notificaciones automáticas para renovaciones de pólizas y pagos pendientes.'
      },
      {
        type: 'improvement',
        title: 'Dashboard mejorado',
        description: 'Nuevos widgets y gráficos interactivos para mejor visualización de datos.'
      },
      {
        type: 'fix',
        title: 'Corrección de errores en reportes',
        description: 'Se solucionaron problemas con la generación de reportes PDF.'
      }
    ]
  },
  {
    version: '2.0.0',
    date: '2023-12-20',
    highlights: 'Gran actualización con nuevo diseño y funcionalidades premium',
    updates: [
      {
        type: 'new',
        title: 'Nuevo diseño de interfaz',
        description: 'Interfaz completamente renovada con mejor experiencia de usuario.'
      },
      {
        type: 'improvement',
        title: 'Optimización de rendimiento',
        description: 'Mejoras significativas en la velocidad de carga y respuesta.'
      }
    ]
  }
];

export default function UpdatesPage() {
  const theme = useTheme();
  const [selectedFilters, setSelectedFilters] = useState<UpdateType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Filtrado de actualizaciones
  const filteredUpdates = UPDATES_DATA.filter(release =>
    (selectedFilters.length === 0 || release.updates.some(update => selectedFilters.includes(update.type))) &&
    (searchTerm === '' ||
      release.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.highlights.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFilterClick = (filter: UpdateType) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getUpdateIcon = (type: UpdateType) => {
    switch (type) {
      case 'new':
        return <Star weight="duotone" />;
      case 'improvement':
        return <Sparkle weight="duotone" />;
      case 'fix':
        return <Bug weight="duotone" />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <Container maxWidth="lg" sx={{ flex: 1, py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Actualizaciones del Sistema
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Mantente al día con las últimas mejoras y nuevas funcionalidades de Assuriva
          </Typography>

          <Box sx={{ mb: 4 }}>
            <SearchField
              fullWidth
              variant="outlined"
              placeholder="Buscar actualizaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass weight="duotone" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <FilterChip
                icon={<Star weight="duotone" />}
                label="Nuevas funciones"
                onClick={() => handleFilterClick('new')}
                variant={selectedFilters.includes('new') ? 'filled' : 'outlined'}
                color="primary"
              />
              <FilterChip
                icon={<Sparkle weight="duotone" />}
                label="Mejoras"
                onClick={() => handleFilterClick('improvement')}
                variant={selectedFilters.includes('improvement') ? 'filled' : 'outlined'}
                color="primary"
              />
              <FilterChip
                icon={<Bug weight="duotone" />}
                label="Correcciones"
                onClick={() => handleFilterClick('fix')}
                variant={selectedFilters.includes('fix') ? 'filled' : 'outlined'}
                color="primary"
              />
            </Box>
          </Box>

          <AnimatePresence>
            {filteredUpdates.map((release, index) => (
              <StyledCard
                key={release.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                sx={{ mb: 3 }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h5" component="h2" fontWeight="bold">
                          Versión {release.version}
                        </Typography>
                        {release.isNew && (
                          <Chip
                            label="Nueva"
                            color="primary"
                            size="small"
                            sx={{
                              borderRadius: '6px',
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Typography color="text.secondary">
                        {new Date(release.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    <CaretRight weight="bold" size={24} />
                  </Box>

                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    {release.highlights}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {release.updates.map((update, updateIndex) => (
                      <Box
                        key={updateIndex}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.paper, 0.4),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: '50%',
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          >
                            {getUpdateIcon(update.type)}
                          </Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {update.title}
                          </Typography>
                        </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ pl: 5 }}>
                            {update.description}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </StyledCard>
              ))}
          </AnimatePresence>

          {filteredUpdates.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 3,
                borderRadius: 4,
                bgcolor: alpha(theme.palette.background.paper, 0.4),
                border: `1px dashed ${alpha(theme.palette.divider, 0.2)}`,
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No se encontraron actualizaciones
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Intenta ajustar los filtros o términos de búsqueda
              </Typography>
            </Box>
          )}

          {/* Sección de Estadísticas */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Estadísticas de Actualizaciones
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 3,
                mt: 3,
              }}
            >
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                      }}
                    >
                      <Star weight="duotone" size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {UPDATES_DATA.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Versiones Publicadas
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>

              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                      }}
                    >
                      <Sparkle weight="duotone" size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {UPDATES_DATA.reduce((acc, release) => 
                          acc + release.updates.filter(u => u.type === 'new').length, 0
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nuevas Funciones
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>

              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: theme.palette.warning.main,
                      }}
                    >
                      <Bug weight="duotone" size={24} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {UPDATES_DATA.reduce((acc, release) => 
                          acc + release.updates.filter(u => u.type === 'fix').length, 0
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Correcciones
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </StyledCard>
            </Box>
          </Box>
        </motion.div>
      </Container>

      <Footer />

      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={() => setShowNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowNotification(false)}
          severity="info"
          sx={{
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.95),
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
          }}
        >
          Nueva actualización disponible
        </Alert>
      </Snackbar>
    </Box>
  );
}
