'use client';

import {
  Box,
  Container,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  Calendar,
  CaretDown,
  FileText,
  Code,
  Copyright,
  Scales,
  EnvelopeSimple,
  Globe,
} from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import Footer from '@/components/ui/footer';

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

// Datos de licencias
const softwareLicenses = [
  {
    name: 'React',
    version: '19.0.0',
    license: 'MIT',
    link: 'https://github.com/facebook/react/blob/main/LICENSE',
    description: 'Biblioteca para construir interfaces de usuario.',
  },
  {
    name: 'Next.js',
    version: '15.2.4',
    license: 'MIT',
    link: 'https://github.com/vercel/next.js/blob/canary/license.md',
    description: 'Framework de React para producción.',
  },
  {
    name: 'Material UI',
    version: '7.0.1',
    license: 'MIT',
    link: 'https://github.com/mui/material-ui/blob/master/LICENSE',
    description: 'Biblioteca de componentes de React.',
  },
  {
    name: 'Firebase',
    version: '11.4.0',
    license: 'Apache-2.0',
    link: 'https://github.com/firebase/firebase-js-sdk/blob/master/LICENSE',
    description: 'Plataforma de desarrollo de aplicaciones.',
  },
  {
    name: 'Stripe',
    version: '8.0.416',
    license: 'MIT',
    link: 'https://github.com/stripe/stripe-node/blob/master/LICENSE',
    description: 'Infraestructura de pagos para internet.',
  },
];

const assetLicenses = [
  {
    name: 'Phosphor Icons',
    type: 'Iconos',
    license: 'MIT',
    link: 'https://github.com/phosphor-icons/phosphor-icons/blob/master/LICENSE',
    attribution: 'Phosphor Icons - Iconografía moderna y flexible',
  },
  {
    name: 'Inter',
    type: 'Fuente',
    license: 'OFL-1.1',
    link: 'https://github.com/rsms/inter/blob/master/LICENSE.txt',
    attribution: 'Inter - Familia tipográfica diseñada para pantallas',
  },
];

export default function LicensesPage() {
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
              Licencias y Uso de Software
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Calendar size={20} />
              <Typography variant="subtitle1" color="text.secondary">
                Última revisión: 10 de abril de 2025
              </Typography>
            </Stack>
          </Stack>

          {/* Introducción */}
          <Section>
            <Stack spacing={3}>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                En Assuriva, nos comprometemos con la transparencia y el uso legal del software. 
                Esta página detalla todas las licencias de las tecnologías y recursos utilizados 
                en nuestra plataforma, garantizando el cumplimiento de los derechos de propiedad 
                intelectual y las normativas aplicables.
              </Typography>
            </Stack>
          </Section>

          {/* Licencia de la Plataforma */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Licencia de Assuriva
            </Typography>
            <Section>
              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Copyright size={24} weight="duotone" />
                  <Typography variant="h6" fontWeight={600}>
                    Derechos Reservados
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  © 2025 Assuriva. Todos los derechos reservados. El software, diseño, 
                  contenido y código fuente de Assuriva están protegidos por leyes de 
                  propiedad intelectual y son propiedad exclusiva de Assuriva.
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography component="ul" sx={{ lineHeight: 1.8 }}>
                    <li>Uso comercial bajo términos de suscripción</li>
                    <li>Prohibida la redistribución o modificación</li>
                    <li>Marca registrada en trámite</li>
                    <li>Contenido y diseño protegidos</li>
                  </Typography>
                </Box>
              </Stack>
            </Section>
          </Stack>

          {/* Software de Terceros */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Software de Terceros
            </Typography>
            <Stack spacing={2}>
              {softwareLicenses.map((software, index) => (
                <motion.div
                  key={software.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StyledAccordion>
                    <AccordionSummary
                      expandIcon={<CaretDown />}
                      sx={{ 
                        '& .MuiAccordionSummary-content': { 
                          alignItems: 'center',
                        },
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Code size={24} weight="duotone" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {software.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Versión {software.version}
                          </Typography>
                        </Box>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={2}>
                        <Typography variant="body1" color="text.secondary">
                          {software.description}
                        </Typography>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: alpha(theme.palette.background.paper, 0.4),
                        }}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Licencia {software.license}
                            </Typography>
                            <Link 
                              href={software.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ 
                                color: theme.palette.primary.main,
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                              Ver licencia completa
                            </Link>
                          </Stack>
                        </Box>
                      </Stack>
                    </AccordionDetails>
                  </StyledAccordion>
                </motion.div>
              ))}
            </Stack>
          </Stack>

          {/* Recursos y Atribuciones */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Recursos y Atribuciones
            </Typography>
            <Section>
              <Stack spacing={3}>
                {assetLicenses.map((asset) => (
                  <Box key={asset.name}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Globe size={24} weight="duotone" />
                      <Typography variant="h6" fontWeight={600}>
                        {asset.name}
                      </Typography>
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      {asset.attribution}
                    </Typography>
                    <Link 
                      href={asset.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                        color: theme.palette.primary.main,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Licencia {asset.license}
                    </Link>
                  </Box>
                ))}
              </Stack>
            </Section>
          </Stack>

          {/* Cambios en la Política */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Cambios en esta Política
            </Typography>
            <Section>
              <Stack spacing={3}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Nos reservamos el derecho de actualizar esta política de licencias para reflejar:
                </Typography>
                <Box sx={{ pl: 2 }}>
                  <Typography component="ul" sx={{ lineHeight: 1.8 }}>
                    <li>Cambios en las versiones de software utilizadas</li>
                    <li>Incorporación de nuevas tecnologías</li>
                    <li>Actualizaciones en términos de licencias</li>
                    <li>Modificaciones en atribuciones requeridas</li>
                  </Typography>
                </Box>
                <Box sx={{ 
                  p: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <FileText size={24} weight="duotone" />
                    <Typography variant="body1" color="text.secondary">
                      Los cambios significativos serán notificados a través de la plataforma
                      y actualizando la fecha de última revisión en esta página.
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Section>
          </Stack>

          {/* Contacto Legal */}
          <Stack spacing={4}>
            <Typography variant="h4" fontWeight={700}>
              Contacto Legal
            </Typography>
            <Section>
              <Stack spacing={3}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Para cualquier consulta relacionada con licencias, propiedad intelectual 
                  o aspectos legales de la plataforma, puede contactar a nuestro departamento legal:
                </Typography>
                <Box sx={{ 
                  p: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.paper, 0.4),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <EnvelopeSimple size={24} weight="duotone" />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Departamento Legal
                        </Typography>
                        <Link
                          href="mailto:legal@assuriva.com"
                          sx={{ 
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                        >
                          legal@assuriva.com
                        </Link>
                      </Box>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Horario de atención: Lunes a Viernes, 9:00 - 18:00 (GMT+1)
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Section>
          </Stack>

          {/* Nota Final */}
          <Section>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Scales size={24} weight="duotone" />
                <Typography variant="h6" fontWeight={600}>
                  Cumplimiento Legal
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                Assuriva se compromete a mantener el más alto nivel de cumplimiento legal 
                y respeto por la propiedad intelectual. Todas las licencias y permisos 
                necesarios para la operación de nuestra plataforma están debidamente 
                adquiridos y actualizados.
              </Typography>
              <Box sx={{ 
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.success.main, 0.1),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}>
                <Typography variant="body1" color="success.main" sx={{ fontWeight: 500 }}>
                  Assuriva es una marca registrada. Todos los derechos de propiedad intelectual 
                  están protegidos por las leyes aplicables.
                </Typography>
              </Box>
            </Stack>
          </Section>
        </Stack>
      </Container>

      <Footer />
    </Box>
  );
}
