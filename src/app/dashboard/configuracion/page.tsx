'use client';


import dynamic from 'next/dynamic';

// ⚠️ Importar de forma dinámica para evitar el prerender
const ConfiguracionPage = dynamic(() => import('./ConfigurationPage'), {
  ssr: false,
});

export default ConfiguracionPage;
