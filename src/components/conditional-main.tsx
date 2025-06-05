"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/app/context/UserContext';
import { Loader2 } from 'lucide-react';

// Routes where main wrapper should be hidden or have different behavior
const HIDDEN_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/check-email',
  '/auth/callback',
  '/auth/forgot-password',
  '/auth/reset-password',
];

// Routes that should have full-width layout (no container)
const FULL_WIDTH_ROUTES = [
  '/dashboard',
  '/menu',
  '/payment/test',
  '/payment/result',
];

// Routes that should have special padding/spacing
const SPECIAL_LAYOUT_ROUTES = [
  '/pedidos/nuevo',
  '/pedidos/reagendar',
  '/perfil',
];

// Loading Component
const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 mx-auto mb-4"
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Cargando...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Preparando tu experiencia
        </p>
      </motion.div>
    </div>
  );
};

// Error Boundary Component
const ErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Algo salió mal
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={resetError}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Intentar nuevamente
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Ir al Dashboard
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-sm text-gray-500 cursor-pointer">
                Detalles del error (desarrollo)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Main Content Wrapper
const MainWrapper: React.FC<{ 
  children: React.ReactNode;
  pathname: string;
}> = ({ children, pathname }) => {
  const isFullWidth = FULL_WIDTH_ROUTES.includes(pathname);
  const isSpecialLayout = SPECIAL_LAYOUT_ROUTES.includes(pathname);

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.4
  };

  if (isFullWidth) {
    return (
      <motion.main
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen bg-background"
      >
        {children}
      </motion.main>
    );
  }

  if (isSpecialLayout) {
    return (
      <motion.main
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {children}
        </div>
      </motion.main>
    );
  }

  // Default layout
  return (
    <motion.main
      key={pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-background"
    >
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </motion.main>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  const pathname = usePathname();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated (except for auth routes)
  if (!isAuthenticated && !HIDDEN_ROUTES.includes(pathname)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

// Error Boundary Hook
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ComponentType<{ error: Error; resetError: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ComponentType<{ error: Error; resetError: () => void }> }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          resetError={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

// Main ConditionalMain Component
export const ConditionalMain: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const shouldWrapContent = !HIDDEN_ROUTES.includes(pathname);

  // For auth routes, render children directly without any wrapper
  if (!shouldWrapContent) {
    return (
      <ErrorBoundary fallback={ErrorFallback}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </ErrorBoundary>
    );
  }

  // For protected routes, wrap with authentication and layout
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <ProtectedRoute>
        <MainWrapper pathname={pathname}>
          {children}
        </MainWrapper>
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

// Additional utility components for specific layouts
export const PageHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const PageContainer: React.FC<{
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}> = ({ children, maxWidth = 'lg' }) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={`mx-auto px-4 py-8 ${maxWidthClasses[maxWidth]}`}>
      {children}
    </div>
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}> = ({ children, className = '', padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white dark:bg-gray-800 
        border border-gray-200 dark:border-gray-700 
        rounded-xl shadow-sm hover:shadow-md 
        transition-shadow duration-200
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default ConditionalMain;
