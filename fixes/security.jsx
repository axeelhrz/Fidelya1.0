// Correcciones para src/components/security.tsx

// Cambiar Typography variant="subtitle1" a variant="body1" para descripciones
<Typography
  variant="body1"
  sx={{
    fontFamily: 'var(--font-inter)',
    color: isDarkMode ? 'grey.300' : 'grey.800',
    maxWidth: 800,
    mx: 'auto',
    lineHeight: 1.6,
    fontSize: { xs: '1rem', md: '1.25rem' },
  }}
>
  Implementamos los más altos estándares de seguridad para proteger tus datos y los de tus clientes
</Typography>
