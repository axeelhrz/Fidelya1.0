import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme/theme';

// Importar páginas
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/inventory';
import VentasPage from './pages/ventas';
import ComprasPage from './pages/compras';
import ClientesPage from './pages/clientes';
import ReportesFinancierosPage from './pages/ReportesFinancieros';
import CierreCajaPage from './pages/CierreCaja';
import FacturacionPage from './pages/Facturacion';
import ConfiguracionPage from './pages/Configuracion';
import NotificacionesPage from './pages/Notificaciones';

// Componente de ruta protegida
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Componente de carga
const LoadingScreen = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}
  >
    <CircularProgress size={60} />
  </Box>
);

// Configuración de títulos para cada página
const pageConfig = {
  '/dashboard': 'Dashboard',
  '/inventory': 'Gestión de Inventario',
  '/ventas': 'Gestión de Ventas',
  '/compras': 'Gestión de Compras',
  '/clientes': 'Gestión de Clientes',
  '/reportes': 'Reportes Financieros',
  '/cierre-caja': 'Cierre de Caja',
  '/facturacion': 'Facturación',
  '/configuracion': 'Configuración del Sistema',
  '/notificaciones': 'Centro de Notificaciones'
};

// Componente wrapper para páginas protegidas
const ProtectedPageWrapper = ({ children, title }) => {
  return (
    <MainLayout title={title}>
      {children}
    </MainLayout>
  );
};

// Componente principal de rutas
const AppRoutes = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Rutas protegidas con layout */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper title={pageConfig['/dashboard']}>
              <Dashboard />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper title={pageConfig['/inventory']}>
              <InventoryPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/ventas" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper title={pageConfig['/ventas']}>
              <VentasPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/compras" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper title={pageConfig['/compras']}>
              <ComprasPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/clientes" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper title={pageConfig['/clientes']}>
              <ClientesPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reportes" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper title={pageConfig['/reportes']}>
              <ReportesFinancierosPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/cierre-caja" 
        element={
          <ProtectedRoute requiredRoles={['admin', 'cajero']}>
            <ProtectedPageWrapper title={pageConfig['/cierre-caja']}>
              <CierreCajaPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/facturacion" 
        element={
          <ProtectedRoute requiredRoles={['admin', 'cajero', 'operador']}>
            <ProtectedPageWrapper title={pageConfig['/facturacion']}>
              <FacturacionPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/configuracion" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <ProtectedPageWrapper title={pageConfig['/configuracion']}>
              <ConfiguracionPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/notificaciones" 
        element={
          <ProtectedRoute>
            <ProtectedPageWrapper title={pageConfig['/notificaciones']}>
              <NotificacionesPage />
            </ProtectedPageWrapper>
          </ProtectedRoute>
        } 
      />
      
      {/* Redirecciones */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } 
      />
      
      {/* Ruta 404 */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

// Componente principal de la aplicación
function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh' }}>
            <AppRoutes />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;