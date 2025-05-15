// Correcciones para src/components/testimonials.tsx

// Cambiar Typography variant="h5" a variant="h3" component="h3" para CTA
<Typography
  variant="h3"
  component="h3"
  sx={{
    fontFamily: 'var(--font-plus-jakarta)',
    fontWeight: 700,
    textAlign: 'center',
    maxWidth: 600,
    fontSize: { xs: '1.5rem', md: '1.75rem' },
  }}
>
  Unite a +500 corredores que ya transformaron su gestión
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
    fontSize: { xs: '1rem', md: '1.125rem' },
  }}
>
  Descubrí cómo corredores de toda Latinoamérica transformaron su gestión
</Typography>
