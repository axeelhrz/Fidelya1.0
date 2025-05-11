'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  useTheme,
  alpha,
  styled,
  InputAdornment,
} from '@mui/material';
import {
  CaretDown,
  MagnifyingGlass,
  Lifebuoy,
  EnvelopeSimple,
  FileText,
  Users,
  Bell,
  Gear,
  CheckSquare,
  CaretRight,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';
import { AuthProvider } from '@/context/auth-context';


// Componentes estilizados
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  borderRadius: `${theme.shape.borderRadius * 2}px !important`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: `${theme.spacing(2)} 0`,
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 2,
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

const CategoryCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
    '& .category-icon': {
      transform: 'scale(1.1)',
      color: theme.palette.primary.main,
    },
  },
}));

// Datos de las categorías
const categories = [
  { icon: <FileText size={32} />, title: 'Gestión de Pólizas', description: 'Aprende a gestionar pólizas eficientemente' },
  { icon: <Users size={32} />, title: 'Clientes', description: 'Administra tu cartera de clientes' },
  { icon: <CheckSquare size={32} />, title: 'Tareas', description: 'Organiza tus actividades diarias' },
  { icon: <Bell size={32} />, title: 'Notificaciones', description: 'Configura tus alertas y avisos' },
  { icon: <Gear size={32} />, title: 'Configuración', description: 'Personaliza tu cuenta y preferencias' },
];

// Preguntas frecuentes
const faqs = [
  {
    question: '¿Cómo recuperar mi contraseña?',
    answer: 'Para recuperar tu contraseña, haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Ingresa tu correo electrónico y te enviaremos instrucciones para restablecerla.',
  },
  {
    question: '¿Cómo agregar una nueva póliza?',
    answer: 'Ve a la sección "Pólizas" en el menú principal, haz clic en el botón "Nueva Póliza" y completa el formulario con los datos requeridos. Puedes adjuntar documentos relevantes antes de guardar.',
  },
  {
    question: '¿Cómo invitar a otros corredores?',
    answer: 'Desde la configuración de tu cuenta, selecciona "Equipo" y haz clic en "Invitar Corredor". Ingresa el correo electrónico del corredor y establece sus permisos antes de enviar la invitación.',
  },
  {
    question: '¿Dónde puedo ver mis tareas pendientes?',
    answer: 'Encuentra todas tus tareas en el "Dashboard" o en la sección "Tareas". Puedes filtrarlas por estado, fecha o prioridad para una mejor organización.',
  },
  {
    question: '¿Cómo contacto al soporte técnico?',
    answer: 'Puedes contactarnos por correo a soporte@assuriva.com, a través del chat en vivo disponible 24/7, o programando una llamada con nuestro equipo de soporte.',
  },
];

export default function HelpCenterPage() {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  return (
    <AuthProvider>
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: theme.palette.mode === 'dark' 
        ? `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.8)}, ${alpha(theme.palette.background.default, 0.95)})`
        : `linear-gradient(to bottom, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.background.default, 0.95)})`
    }}>
      <Header />

      {/* Hero Section */}
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={6} alignItems="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Centro de Ayuda
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 800,
                  mx: 'auto',
                  lineHeight: 1.8,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                ¿Cómo podemos ayudarte hoy? Encuentra respuestas rápidas a tus preguntas
                y aprende a sacar el máximo provecho de Assuriva
              </Typography>
            </motion.div>

            <Box sx={{ width: '100%', maxWidth: 700 }}>
              <SearchField
                fullWidth
                placeholder="Buscar en la documentación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifyingGlass size={24} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Contenido Principal */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Stack spacing={8}>
          {/* Categorías */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700} textAlign="center">
              Explora por Categoría
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              flexWrap: 'wrap',
              gap: 3,
              justifyContent: 'center',
            }}>
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ flex: '1 1 250px', maxWidth: '300px' }}
                >
                  <CategoryCard>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      <Box 
                        className="category-icon"
                        sx={{ 
                          color: 'text.secondary',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {category.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Stack>
                  </CategoryCard>
                </motion.div>
              ))}
            </Box>
          </Stack>

          {/* FAQs */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700} textAlign="center">
              Preguntas Frecuentes
            </Typography>
            <Box>
              {faqs.map((faq, index) => (
                <StyledAccordion
                  key={index}
                  expanded={expandedFaq === `panel${index}`}
                  onChange={handleAccordionChange(`panel${index}`)}
                >
                  <AccordionSummary
                    expandIcon={<CaretDown />}
                    sx={{ 
                      '& .MuiAccordionSummary-content': { 
                        alignItems: 'center',
                      },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </StyledAccordion>
              ))}
            </Box>
          </Stack>

          {/* Sección de Contacto Directo */}
          <Box sx={{ 
            position: 'relative',
            mt: 8,
            p: 4,
            borderRadius: theme.shape.borderRadius * 2,
            background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.1)})`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}>
            <Stack 
              direction={{ xs: 'column', md: 'row' }} 
              spacing={4} 
              alignItems="center" 
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                >
                  <Lifebuoy size={32} weight="duotone" />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    ¿Aún necesitas ayuda?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Nuestro equipo de soporte está disponible 24/7 para ayudarte
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<EnvelopeSimple weight="bold" />}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderWidth: 2,
                  }}
                >
                  Enviar correo
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Lifebuoy weight="bold" />}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                  }}
                >
                  Chat en vivo
                </Button>
              </Stack>
            </Stack>
          </Box>

          {/* Recursos Adicionales */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700} textAlign="center">
              Recursos Adicionales
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
            }}>
              {[
                {
                  title: 'Guías y Tutoriales',
                  description: 'Aprende paso a paso cómo usar todas las funciones de Assuriva',
                  icon: <FileText size={24} weight="duotone" />,
                },
                {
                  title: 'Webinars',
                  description: 'Sesiones en vivo y grabadas sobre mejores prácticas',
                  icon: <Users size={24} weight="duotone" />,
                },
                {
                  title: 'Blog Técnico',
                  description: 'Artículos detallados y actualizaciones del sistema',
                  icon: <FileText size={24} weight="duotone" />,
                },
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ flex: 1 }}
                >
                  <CategoryCard sx={{ height: '100%' }}>
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '12px',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          width: 'fit-content',
                        }}
                      >
                        {resource.icon}
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {resource.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {resource.description}
                      </Typography>
                      <Button
                        endIcon={<CaretRight weight="bold" />}
                        sx={{
                          alignSelf: 'flex-start',
                          textTransform: 'none',
                          fontWeight: 600,
                          p: 0,
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        Explorar
                      </Button>
                    </Stack>
                  </CategoryCard>
                </motion.div>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Container>

      <Footer />
    </Box>
    </AuthProvider>
  );
}