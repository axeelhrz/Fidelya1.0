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
  Chip,
} from '@mui/material';
import {
  Calendar,
  Cookie,
  Gear,
  Lock,
  Globe,
  CheckSquare,
  Info,
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

const CookieTypeChip = styled(Chip)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

// Tipos de cookies y su información
const cookieTypes = [
  {
    type: 'Esenciales',
    icon: <Lock size={20} />,
    description: 'Necesarias para el funcionamiento básico del sitio',
    examples: ['Sesión de usuario', 'Seguridad', 'Preferencias básicas'],
    duration: 'Sesión',
  },
  {
    type: 'Rendimiento',
    icon: <Gear size={20} />,
    description: 'Ayudan a mejorar el funcionamiento del sitio',
    examples: ['Google Analytics', 'Métricas de uso', 'Velocidad'],
    duration: '2 años',
  },
  {
    type: 'Funcionalidad',
    icon: <CheckSquare size={20} />,
    description: 'Mejoran la experiencia del usuario',
    examples: ['Idioma', 'Tema', 'Configuración personal'],
    duration: '1 año',
  },
  {
    type: 'Marketing',
    icon: <Globe size={20} />,
    description: 'Utilizadas para publicidad personalizada',
    examples: ['Publicidad', 'Redes sociales', 'Remarketing'],
    duration: '6 meses',
  },
];

// Instrucciones para navegadores
const browserInstructions = [
  {
    browser: 'Google Chrome',
    steps: 'Configuración > Privacidad y seguridad > Cookies y otros datos de sitios',
  },
  {
    browser: 'Mozilla Firefox',
    steps: 'Menú > Opciones > Privacidad & Seguridad > Cookies y datos del sitio',
  },
  {
    browser: 'Safari',
    steps: 'Preferencias > Privacidad > Cookies y datos del sitio web',
  },
  {
    browser: 'Microsoft Edge',
    steps: 'Configuración > Cookies y permisos del sitio > Administrar y eliminar cookies',
  },
];

export default function CookiePolicyPage() {
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
              Política de Cookies
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
                <Cookie size={28} weight="duotone" />
              </IconBox>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Las cookies son pequeños archivos de texto que los sitios web colocan en tu 
                dispositivo para mejorar tu experiencia de navegación. En Assuriva, utilizamos 
                cookies para optimizar nuestros servicios y proporcionarte una plataforma más 
                eficiente y segura.
              </Typography>
              <Alert 
                severity="info"
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.info.main, 0.1),
                }}
              >
                Al utilizar nuestra plataforma, aceptas el uso de cookies de acuerdo con 
                esta política.
              </Alert>
            </Stack>
          </Section>

          {/* Tipos de Cookies */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Tipos de Cookies que Utilizamos
            </Typography>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}>
              {cookieTypes.map((cookieType, index) => (
                <motion.div
                  key={cookieType.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Section>
                    <Stack spacing={3}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <CookieTypeChip
                          icon={cookieType.icon}
                          label={cookieType.type}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Duración: {cookieType.duration}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" color="text.secondary">
                        {cookieType.description}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}>
                        {cookieType.examples.map((example) => (
                          <Chip
                            key={example}
                            label={example}
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderRadius: 1,
                              borderColor: alpha(theme.palette.primary.main, 0.2),
                            }}
                          />
                        ))}
                      </Box>
                    </Stack>
                  </Section>
                </motion.div>
              ))}
            </Box>
          </Stack>

          {/* Gestión de Cookies */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Cómo Gestionar las Cookies
            </Typography>
            <Section>
              <Stack spacing={4}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Puedes gestionar las cookies a través de la configuración de tu navegador. 
                  Aquí te explicamos cómo hacerlo en los navegadores más populares:
                </Typography>
                <Stack spacing={2}>
                  {browserInstructions.map((browser) => (
                    <Box
                      key={browser.browser}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.4),
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {browser.browser}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {browser.steps}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Section>
          </Stack>

          {/* Impacto de Desactivación */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Impacto al Desactivar las Cookies
            </Typography>
            <Section>
              <Stack spacing={3}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  La desactivación de cookies puede afectar a la funcionalidad de la plataforma:
                </Typography>
                <Stack spacing={2}>
                  <Alert 
                    severity="warning"
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    }}
                  >
                    Las cookies esenciales no pueden ser desactivadas ya que son necesarias 
                    para el funcionamiento básico de la plataforma.
                  </Alert>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" component="ul" sx={{ lineHeight: 1.8 }}>
                      <li>Algunas funciones pueden no estar disponibles</li>
                      <li>La experiencia de usuario puede verse reducida</li>
                      <li>Las preferencias deberán configurarse en cada visita</li>
                      <li>Ciertas características personalizadas no funcionarán</li>
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Section>
          </Stack>

          {/* Contacto */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Contacto
            </Typography>
            <Section>
              <Stack spacing={3}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Si tienes alguna pregunta sobre nuestra política de cookies, puedes contactarnos a través de:
                </Typography>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}>
                  <Box sx={{ 
                    p: 3,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.background.paper, 0.4),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Info size={24} weight="duotone" />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Información de Contacto
                        </Typography>
                      </Stack>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          Email: privacidad@assuriva.com
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Teléfono: +34 900 123 456
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Dirección: Calle Principal 123, 28001 Madrid, España
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </Stack>
            </Section>
          </Stack>

          {/* Actualizaciones de la Política */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Actualizaciones de la Política
            </Typography>
            <Section>
              <Stack spacing={3}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Nos reservamos el derecho de modificar esta política de cookies en cualquier momento. 
                  Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.
                </Typography>
                <Stack spacing={2}>
                  <Alert 
                    severity="info"
                    sx={{ 
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                    }}
                  >
                    Te recomendamos revisar esta política periódicamente para estar informado 
                    sobre cómo protegemos tu información.
                  </Alert>
                  <Typography variant="body1" color="text.secondary">
                    Cuando realicemos cambios significativos en esta política:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body1" component="ul" sx={{ lineHeight: 1.8 }}>
                      <li>Te notificaremos a través de la plataforma</li>
                      <li>Actualizaremos la fecha de &ldquo;última actualización&rdquo;</li>
                      <li>Te proporcionaremos un resumen de los cambios importantes</li>
                      <li>Solicitaremos tu consentimiento si es necesario</li>
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Section>
          </Stack>

          {/* Resumen Final */}
          <Section>
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight={600}>
                Resumen de Puntos Importantes
              </Typography>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}>
                {[
                  {
                    icon: <CheckSquare size={20} />,
                    text: 'Usamos cookies para mejorar tu experiencia',
                  },
                  {
                    icon: <Lock size={20} />,
                    text: 'Las cookies esenciales son necesarias para el funcionamiento',
                  },
                  {
                    icon: <Gear size={20} />,
                    text: 'Puedes gestionar las cookies desde tu navegador',
                  },
                  {
                    icon: <Info size={20} />,
                    text: 'Actualizamos esta política regularmente',
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.paper, 0.4),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Box sx={{
                      color: theme.palette.primary.main,
                    }}>
                      {item.icon}
                    </Box>
                    <Typography variant="body1" color="text.secondary">
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Alert 
                severity="success"
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                }}
              >
                Al continuar usando nuestra plataforma, aceptas el uso de cookies según 
                lo descrito en esta política.
              </Alert>
            </Stack>
          </Section>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
}