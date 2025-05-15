'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { ErrorScreen } from './errorScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualizar el estado para que el siguiente renderizado muestre la UI de fallback.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error("Uncaught error:", error, errorInfo);
    // Aquí podrías enviar el error a Sentry, LogRocket, etc.
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
    // Podrías intentar recargar la página o una parte específica de la UI
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI de fallback personalizada
      return (
        <ErrorScreen
          title="¡Ups! Algo salió mal"
          message="Hemos encontrado un error inesperado. Por favor, intenta recargar la página o vuelve más tarde."
          error={this.state.error}
          onRetry={this.handleRetry}
          showHomeButton={true}
          showRefreshButton={true}
          fullScreen={true}
        />
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;