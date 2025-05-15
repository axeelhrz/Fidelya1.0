// Correcciones para src/components/faq.tsx

// Cambiar Typography variant="h6" a variant="subtitle1" component="h3" para preguntas
<Typography 
  variant="subtitle1"
  component="h3"
  sx={{ 
    fontSize: '1.1rem',
    fontWeight: 600,
    color: expanded === item.id
      ? theme.palette.primary.main
      : theme.palette.text.primary,
  }}
>
  {item.question}
</Typography>

// Cambiar Typography variant="subtitle1" a variant="body1" para descripciones
<Typography
  variant="body1"
  sx={{
    fontFamily: 'var(--font-inter)',
    color: isDarkMode ? 'grey.300' : 'grey.800',
    maxWidth: 800,
    mx: 'auto',
    lineHeight: 1.6,
  }}
>
  Resolvemos tus dudas antes de comenzar
</Typography>
