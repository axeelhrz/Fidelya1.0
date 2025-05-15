'use client';

import { useEffect } from 'react';
import { ErrorScreen } from '@/components/core/errorScreen';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registrar el error en un servicio de análisis o monitoreo
    console.error('Application error:', error);
  }, [error]);

  return (
    <ErrorScreen
      message="Ha ocurrido un error al cargar la página. Por favor, intenta nuevamente."
      error={error}
      fullScreen={true}
      showHomeButton={true}
      showRefreshButton={true}
      onRetry={reset}
    />
  );
}