'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  useTheme,
  alpha,
  styled,
  Alert,
} from '@mui/material';
import {
  Calendar,
  Database,
  Shield,
  Lock,
  Eye,
  Cookie,
  Bell,
  EnvelopeSimple,
  UserCircle,
  Share,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

// Componentes estilizados
const Section = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.1)}`,
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '12px',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  marginBottom: theme.spacing(2),
}));

// Contenido de la política de privacidad
const privacySections = [
  {
    id: 1,
    title: 'Información que Recopilamos',
    icon: <Database size={24} weight="duotone" />,
    content: `Recopilamos la siguiente información:

• Datos de identificación personal (nombre, correo electrónico, teléfono)
• Información profesional como corredor de seguros
• Datos de tus clientes (con su consentimiento)
• Información de uso de la plataforma
• Registros de actividad y preferencias

Toda la información se recopila con tu consentimiento explícito y siguiendo las normativas de protección de datos aplicables.`,
  },
  {
    id: 2,
    title: 'Cómo Usamos la Información',
    icon: <Eye size={24} weight="duotone" />,
    content: `Utilizamos tu información para:

• Proporcionar y mejorar nuestros servicios
• Personalizar tu experiencia en la plataforma
• Procesar tus transacciones
• Enviar notificaciones importantes
• Mejorar la seguridad de la plataforma
• Cumplir con obligaciones legales

Nos comprometemos a usar tu información de manera responsable y transparente.`,
  },
  {
    id: 3,
    title: 'Compartición de Datos',
    icon: <Share size={24} weight="duotone" />,
    content: `Compartimos información únicamente:

• Con tu consentimiento explícito
• Con proveedores de servicios necesarios para la operación
• Cuando sea requerido por ley
• Para proteger nuestros derechos legales

No vendemos ni alquilamos tu información personal a terceros.`,
  },
  {
    id: 4,
    title: 'Seguridad de la Información',
    icon: <Shield size={24} weight="duotone" />,
    content: `Protegemos tu información mediante:

• Cifrado de datos de extremo a extremo
• Sistemas de seguridad avanzados
• Monitoreo continuo
• Copias de seguridad regulares
• Protocolos de acceso estrictos

Implementamos las mejores prácticas de la industria en materia de seguridad.`,
  },
  {
    id: 5,
    title: 'Acceso y Control de tu Información',
    icon: <UserCircle size={24} weight="duotone" />,
    content: `Tienes derecho a:

• Acceder a tus datos personales
• Corregir información inexacta
• Solicitar la eliminación de datos
• Limitar el procesamiento
• Exportar tus datos
• Retirar tu consentimiento

Facilitamos el ejercicio de tus derechos a través de la plataforma.`,
  },
  {
    id: 6,
    title: 'Cookies y Tecnologías Similares',
    icon: <Cookie size={24} weight="duotone" />,
    content: `Utilizamos cookies y tecnologías similares para:

• Mantener tu sesión activa
• Recordar tus preferencias
• Analizar el uso de la plataforma
• Mejorar nuestros servicios
• Personalizar tu experiencia

Puedes controlar las cookies a través de la configuración de tu navegador.`,
  },
  {
    id: 7,
    title: 'Cambios en esta Política',
    icon: <Bell size={24} weight="duotone" />,
    content: `Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos mediante:

• Notificaciones en la plataforma
• Correo electrónico
• Avisos destacados en nuestra web

Te recomendamos revisar esta política periódicamente.`,
  },
  {
    id: 8,
    title: 'Contacto',
    icon: <EnvelopeSimple size={24} weight="duotone" />,
    content: `Para cualquier consulta sobre privacidad:

Email: privacidad@assuriva.com
Teléfono: +34 900 123 456
Dirección: Calle Principal 123, 28001 Madrid, España

Nuestro Delegado de Protección de Datos está disponible para atender tus consultas.`,
  },
];

export default function PrivacyPolicyPage() {
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

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, flex: 1 }}>
        <Stack spacing={6}>
          {/* Encabezado */}
          <Stack spacing={2} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Typography variant="h2" fontWeight={700}>
              Política de Privacidad
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Calendar size={20} />
              <Typography variant="subtitle1" color="text.secondary">
                Última actualización: 10 de abril de 2025
              </Typography>
            </Stack>
          </Stack>

          {/* Introducción */}
          <Section>
            <Stack spacing={3}>
              <IconBox>
                <Lock size={28} weight="duotone" />
              </IconBox>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                En Assuriva, la privacidad y seguridad de tu información es nuestra máxima prioridad. 
                Esta política describe cómo recopilamos, usamos y protegemos tus datos personales, 
                asegurando el cumplimiento de todas las regulaciones de protección de datos aplicables.
              </Typography>
              <Alert 
                severity="info"
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                }}
              >
                Nos comprometemos a mantener la confidencialidad y seguridad de tu información 
                mientras utilizas nuestra plataforma.
              </Alert>
            </Stack>
          </Section>

          {/* Secciones de Privacidad */}
          <Stack spacing={4}>
            {privacySections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Section>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <IconBox>
                        {section.icon}
                      </IconBox>
                      <Typography variant="h5" fontWeight={600}>
                        {section.title}
                      </Typography>
                    </Stack>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.8,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {section.content}
                    </Typography>
                  </Stack>
                </Section>
              </motion.div>
            ))}
          </Stack>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
}