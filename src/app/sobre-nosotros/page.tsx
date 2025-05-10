'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
  alpha,
  styled,
  Button,
} from '@mui/material';
import {
  Trophy,
  Target,
  Rocket,
  Users,
  ShieldCheck,
  Lightbulb,
  ChartLine,
  Globe,
  Heart,
  ArrowRight,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

// Componentes estilizados
const StyledCard = styled(motion(Card))(({ theme }) => ({
  background: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(20px)',
  borderRadius: theme.shape.borderRadius * 3,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StatCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '16px',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const TeamMember = styled(motion.div)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

// Datos del equipo
const teamMembers = [
  {
    name: 'Axel Hernandez',
    role: 'CEO & Fundador',
    description: 'Programador independiente. Fue funcionario en el BSE y Sancor Seguros, por más de 2 años.',
    avatar: '/team/carlos.jpg',
  },
];

// Valores corporativos
const values = [
  {
    icon: <ShieldCheck size={28} weight="duotone" />,
    title: 'Seguridad',
    description: 'Máxima protección de datos y cumplimiento normativo como estándar.',
  },
  {
    icon: <Lightbulb size={28} weight="duotone" />,
    title: 'Innovación',
    description: 'Tecnología de vanguardia para impulsar tu negocio al siguiente nivel.',
  },
  {
    icon: <Heart size={28} weight="duotone" />,
    title: 'Compromiso',
    description: 'Dedicación total al éxito de nuestros usuarios y su crecimiento.',
  },
];

export default function AboutUsPage() {
  const theme = useTheme();

  return (
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
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={8} alignItems="center">
            {/* Título y Subtítulo */}
            <Stack 
              spacing={3} 
              alignItems="center" 
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center' }}
            >
              <Typography 
                variant="h1" 
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                El Futuro de la<br />
                Gestión de Seguros
              </Typography>
              
              <Typography 
                variant="h5" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 700,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  lineHeight: 1.8,
                  fontWeight: 400,
                  mb: 4,
                }}
              >
                Transformando la industria de seguros con tecnología inteligente
                y soluciones centradas en el corredor moderno
              </Typography>
            </Stack>

            {/* Estadísticas */}
            <Box 
              sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 4,
                width: '100%',
                maxWidth: 1000,
                mx: 'auto',
                px: { xs: 2, sm: 4 },
              }}
            >
              {[
                { icon: <Users size={32} weight="duotone" />, value: '500+', label: 'Corredores Activos' },
                { icon: <Globe size={32} weight="duotone" />, value: '10+', label: 'Países' },
                { icon: <ChartLine size={32} weight="duotone" />, value: '98%', label: 'Satisfacción' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <StatCard>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700,
                        background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="text.secondary"
                      sx={{ fontWeight: 500 }}
                    >
                      {stat.label}
                    </Typography>
                  </StatCard>
                </motion.div>
              ))}
            </Box>
          </Stack>
        </Container>

        {/* Efectos de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            zIndex: -1,
            opacity: 0.5,
            background: `radial-gradient(circle at center, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
          }}
        />
      </Box>

      {/* Contenido Principal */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={12}>
          {/* Quiénes Somos */}
          <Stack spacing={6}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography 
                variant="h2" 
                fontWeight="bold"
                sx={{
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 80,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              >
                Quiénes Somos
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' }, 
              gap: 6,
              alignItems: 'center' 
            }}>
              <Box flex={1}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
                  Una nueva era en la gestión de seguros está aquí.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8 }}
                >
                  Fundada en 2023, Assuriva nace de la visión de transformar la manera en que los corredores 
                  de seguros gestionan su negocio. Combinamos años de experiencia en el sector con tecnología 
                  de vanguardia para crear una solución que realmente marca la diferencia.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ color: 'text.secondary', lineHeight: 1.8 }}
                >
                  Nuestra plataforma no es solo un software más, es un aliado estratégico que potencia 
                  el crecimiento y la eficiencia de tu correduría, permitiéndote enfocarte en lo que realmente
                  importa: tus clientes.
                </Typography>
              </Box>
              <Box flex={1}>
                <StyledCard>
                  <CardContent sx={{ p: 4 }}>
                    <Stack spacing={3}>
                      <IconBox>
                        <Trophy size={28} weight="duotone" />
                      </IconBox>
                      <Typography variant="h5" gutterBottom fontWeight={600}>
                        Nuestra Misión
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        Empoderar a los corredores de seguros con herramientas tecnológicas innovadoras 
                        que simplifiquen su gestión diaria, mejoren la relación con sus clientes y 
                        potencien el crecimiento de su negocio en la era digital.
                      </Typography>
                    </Stack>
                  </CardContent>
                </StyledCard>
              </Box>
            </Box>
          </Stack>

          {/* Valores */}
          <Stack spacing={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Nuestros Valores
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}
              >
                Los principios que guían cada decisión y desarrollo en Assuriva
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 4,
            }}>
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <StyledCard sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={2}>
                        <IconBox>
                          {value.icon}
                        </IconBox>
                        <Typography variant="h5" fontWeight={600}>
                          {value.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                          {value.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </StyledCard>
                </motion.div>
              ))}
            </Box>
          </Stack>

          {/* Equipo */}
          <Stack spacing={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Nuestro Equipo
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}
              >
                Profesionales apasionados por la innovación y el sector asegurador
              </Typography>
            </Box>

            <Box   sx={{
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
  }}>
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <TeamMember>
                    <Avatar
                      src={member.avatar}
                      sx={{ 
                        width: 140, 
                        height: 140, 
                        mb: 3,
                        border: `4px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                      }}
                    />
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        mb: 2 
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {member.description}
                    </Typography>
                  </TeamMember>
                </motion.div>
              ))}
            </Box>
          </Stack>

          {/* Por Qué Elegirnos */}
          <Stack spacing={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Por Qué Elegirnos
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}
              >
                Ventajas que nos distinguen en el mercado
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 4,
            }}>
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <IconBox>
                      <Rocket size={28} weight="duotone" />
                    </IconBox>
                    <Typography variant="h5" fontWeight={600}>
                      Tecnología de Vanguardia
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      Implementamos las últimas tecnologías y mejores prácticas para garantizar 
                      una experiencia fluida, segura y eficiente en cada interacción.
                    </Typography>
                    <Box sx={{ pt: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        endIcon={<ArrowRight weight="bold" />}
                        sx={{ 
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Conoce más
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </StyledCard>

              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <IconBox>
                      <Target size={28} weight="duotone" />
                    </IconBox>
                    <Typography variant="h5" fontWeight={600}>
                      Solución Especializada
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      Diseñada específicamente para corredores de seguros, nuestra plataforma 
                      entiende y se adapta a las necesidades únicas de tu negocio.
                    </Typography>
                    <Box sx={{ pt: 2 }}>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        endIcon={<ArrowRight weight="bold" />}
                        sx={{ 
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Descubre cómo
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </StyledCard>
            </Box>
          </Stack>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
}