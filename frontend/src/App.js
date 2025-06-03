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

// Componente de ruta protegida
import ProtectedRoute from './components/ProtectedRoute';

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

      {/* Rutas protegidas */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/ventas" 
        element={
          <ProtectedRoute>
            <VentasPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/compras" 
        element={
          <ProtectedRoute>
            <ComprasPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/clientes" 
        element={
          <ProtectedRoute>
            <ClientesPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reportes" 
        element={
          <ProtectedRoute>
            <ReportesFinancierosPage />
          </ProtectedRoute>
        } 
      />

      {/* Ruta para Cierre de Caja */}
      <Route 
        path="/cierre-caja" 
        element={
          <ProtectedRoute requiredRoles={['admin', 'cajero']}>
            <CierreCajaPage />
          </ProtectedRoute>
        } 
      />

      {/* Ruta para Facturación */}
      <Route 
        path="/facturacion" 
        element={
          <ProtectedRoute requiredRoles={['admin', 'cajero', 'operador']}>
            <FacturacionPage />
          </ProtectedRoute>
        } 
      />
      
      {/* NUEVA RUTA PARA CONFIGURACIÓN */}
      <Route 
        path="/configuracion" 
        element={
          <ProtectedRoute requiredRoles={['admin']}>
            <ConfiguracionPage />
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
          <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <AppRoutes />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;