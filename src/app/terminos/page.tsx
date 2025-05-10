'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  Calendar,
  Scales,
  Shield,
  User,
  Lock,
  FileText,
  Warning,
  Info,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

// Componentes estilizados
const Section = styled(Box)(({ theme }) => ({
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

// Contenido de los términos
const terms = [
  {
    id: 1,
    title: 'Aceptación de los Términos',
    icon: <Scales size={24} weight="duotone" />,
    content: `Al acceder y utilizar la plataforma Assuriva, usted acepta estos términos y condiciones en su totalidad. 
    Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios. El uso continuado 
    de la plataforma constituye la aceptación de cualquier modificación futura de estos términos.`,
  },
  {
    id: 2,
    title: 'Definiciones',
    icon: <Info size={24} weight="duotone" />,
    content: `"Plataforma" se refiere a Assuriva y todos sus servicios asociados.
    "Usuario" hace referencia a cualquier corredor de seguros registrado en la plataforma.
    "Servicios" incluye todas las funcionalidades, herramientas y recursos proporcionados por Assuriva.
    "Contenido" abarca toda la información, datos y materiales gestionados a través de la plataforma.`,
  },
  {
    id: 3,
    title: 'Acceso al Sistema',
    icon: <Lock size={24} weight="duotone" />,
    content: `El acceso a Assuriva está restringido a usuarios registrados y verificados. Cada usuario es responsable 
    de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades realizadas bajo su cuenta. 
    Nos reservamos el derecho de suspender o terminar el acceso en caso de violación de estos términos.`,
  },
  {
    id: 4,
    title: 'Obligaciones del Usuario',
    icon: <User size={24} weight="duotone" />,
    content: `Los usuarios se comprometen a:
    - Proporcionar información precisa y actualizada
    - Mantener la confidencialidad de sus credenciales
    - Utilizar la plataforma de manera ética y legal
    - No realizar actividades que puedan comprometer la seguridad del sistema
    - Cumplir con todas las regulaciones aplicables al sector de seguros`,
  },
  {
    id: 5,
    title: 'Propiedad Intelectual',
    icon: <FileText size={24} weight="duotone" />,
    content: `Todos los derechos de propiedad intelectual relacionados con Assuriva, incluyendo pero no limitado a 
    software, diseños, logos, marcas comerciales y contenido, son propiedad exclusiva de Assuriva o sus licenciantes. 
    Los usuarios no pueden copiar, modificar o distribuir ningún contenido sin autorización expresa.`,
  },
  {
    id: 6,
    title: 'Protección de Datos y Privacidad',
    icon: <Shield size={24} weight="duotone" />,
    content: `Nos comprometemos a proteger la privacidad de nuestros usuarios según lo establecido en nuestra Política 
    de Privacidad. Todos los datos personales son procesados de acuerdo con las leyes de protección de datos aplicables. 
    Los usuarios son responsables de obtener el consentimiento necesario de sus clientes para el procesamiento de datos.`,
  },
  {
    id: 7,
    title: 'Seguridad',
    icon: <Lock size={24} weight="duotone" />,
    content: `Implementamos medidas de seguridad técnicas y organizativas para proteger la información. Los usuarios 
    deben cumplir con nuestras directrices de seguridad y reportar inmediatamente cualquier brecha de seguridad 
    detectada. Nos reservamos el derecho de actualizar nuestros protocolos de seguridad según sea necesario.`,
  },
  {
    id: 8,
    title: 'Modificaciones',
    icon: <Warning size={24} weight="duotone" />,
    content: `Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor 
    inmediatamente después de su publicación en la plataforma. El uso continuado de Assuriva después de cualquier 
    modificación constituye la aceptación de los nuevos términos.`,
  },
  {
    id: 9,
    title: 'Limitación de Responsabilidad',
    icon: <Warning size={24} weight="duotone" />,
    content: `Assuriva no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso o 
    la imposibilidad de usar la plataforma. Nuestra responsabilidad total está limitada al monto pagado por el 
    usuario por los servicios durante los últimos 12 meses.`,
  },
  {
    id: 10,
    title: 'Jurisdicción y Leyes Aplicables',
    icon: <Scales size={24} weight="duotone" />,
    content: `Estos términos se rigen por las leyes de España. Cualquier disputa relacionada con estos términos 
    será resuelta exclusivamente por los tribunales competentes de Madrid, España.`,
  },
  {
    id: 11,
    title: 'Contacto',
    icon: <Info size={24} weight="duotone" />,
    content: `Para cualquier consulta relacionada con estos términos y condiciones, puede contactarnos en:
    Email: legal@assuriva.com
    Dirección: Calle Principal 123, 28001 Madrid, España
    Teléfono: +34 900 123 456`,
  },
];

export default function TermsPage() {
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
              Términos y Condiciones de Uso
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Calendar size={20} />
              <Typography variant="subtitle1" color="text.secondary">
                Última actualización: 10 de abril de 2025
              </Typography>
            </Stack>
          </Stack>

          {/* Introducción */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Section>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              Bienvenido a Assuriva, la plataforma profesional para corredores de seguros. 
              Estos términos y condiciones establecen las reglas y regulaciones para el uso 
              de nuestros servicios. Al acceder a esta plataforma, asumimos que aceptas 
              estos términos en su totalidad.
            </Typography>
          </Section>
          </motion.div>

          {/* Términos */}
          <Stack spacing={4}>
            {terms.map((term, index) => (
              <motion.div
                key={term.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Section>
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <IconBox>
                        {term.icon}
                      </IconBox>
                      <Typography variant="h5" fontWeight={600}>
                        {term.title}
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
                      {term.content}
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