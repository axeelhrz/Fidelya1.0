import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion } from 'framer-motion';

// Preguntas frecuentes
const faqs = [
  {
    question: "¿Puedo cambiar de plan más adelante?",
    answer: "Sí, puedes cambiar de plan en cualquier momento. Si cambias a un plan superior, se te cobrará la diferencia prorrateada. Si cambias a un plan inferior, el cambio se aplicará en el siguiente ciclo de facturación."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos las principales tarjetas de crédito (Visa, Mastercard, American Express) y PayPal. Para planes Enterprise, también ofrecemos opciones de transferencia bancaria."
  },
  {
    question: "¿Hay algún contrato de permanencia?",
    answer: "No, no hay contratos de permanencia. Puedes cancelar tu suscripción en cualquier momento. Si eliges un plan anual, la suscripción es por 12 meses, pero puedes cancelarla para que no se renueve automáticamente."
  },
  {
    question: "¿Ofrecen descuentos para ONGs o instituciones educativas?",
    answer: "Sí, ofrecemos descuentos especiales para organizaciones sin fines de lucro e instituciones educativas. Por favor, contáctanos para más información."
  },
  {
    question: "¿Cómo funciona el soporte técnico?",
    answer: "El soporte técnico varía según el plan. El plan Básico incluye soporte por email. El plan Profesional ofrece soporte prioritario 24/7 por email, chat y teléfono. El plan Enterprise incluye un gestor de cuenta dedicado y soporte personalizado."
  },
  {
    question: "¿Mis datos están seguros con Assuriva?",
    answer: "Absolutamente. La seguridad de tus datos es nuestra máxima prioridad. Utilizamos encriptación avanzada, copias de seguridad diarias y cumplimos con normativas como GDPR, ISO 27001 y LOPD. Puedes consultar nuestra política de privacidad para más detalles."
  }
];

const FAQSection: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ mb: 10 }}
    >
      <Typography
        variant="h3"
        component="h2"
        sx={{
          mb: 4,
          textAlign: 'center',
          fontWeight: 700,
          fontSize: { xs: '1.75rem', md: '2.5rem' },
          background: isDark
            ? 'linear-gradient(90deg, #93C5FD 0%, #60A5FA 100%)'
            : 'linear-gradient(90deg, #1E40AF 0%, #3B82F6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Preguntas Frecuentes
      </Typography>
      
      <Box
        sx={{
          maxWidth: '800px',
          mx: 'auto',
        }}
      >
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            elevation={0}
            sx={{
              mb: 1.5,
              borderRadius: '12px !important', // !important para sobreescribir estilos de MUI
              background: isDark
                ? 'rgba(30, 41, 59, 0.7)'
                : 'rgba(248, 250, 252, 0.8)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`,
              '&:before': {
                display: 'none', // Eliminar línea divisoria por defecto de Accordion
              },
              transition: 'all 0.3s ease',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: isDark ? '#93C5FD' : '#3B82F6' }} />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
              sx={{
                py: 1,
                '& .MuiAccordionSummary-content': {
                  alignItems: 'center',
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQSection;