// Correcciones para src/components/benefits.tsx

// Cambiar Typography variant="h6" a variant="body1" para métricas
<Typography
  variant="body1"
  sx={{
    fontSize: '1.5rem',
    fontWeight: 700,
    fontFamily: 'Plus Jakarta Sans',
  }}
>
  {benefit.metric.value}
</Typography>

// Cambiar Typography variant="h5" a variant="h3" component="h3" para CTA
<Typography
  variant="h3"
  component="h3"
  sx={{
    fontWeight: 700,
    textAlign: 'center',
    maxWidth: 600,
    color: isDarkMode ? 'grey.100' : 'grey.900',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: { xs: '1.5rem', md: '1.75rem' },
  }}
>
  ¿Querés todos estos beneficios para tu negocio?
</Typography>
