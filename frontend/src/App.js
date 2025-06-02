import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import theme from './theme/theme';

// Páginas de autenticación
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Páginas principales
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/inventory';
import ClientesPage from './pages/clientes';
import ComprasPage from './pages/compras';
import VentasPage from './pages/ventas';
import ReportesFinancieros from './pages/ReportesFinancieros';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
    
            <Route path="/inventario" element={
              <ProtectedRoute>
                <InventoryPage />
              </ProtectedRoute>
            } />
            
            <Route path="/clientes" element={
              <ProtectedRoute>
                <ClientesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/compras" element={
              <ProtectedRoute>
                <ComprasPage />
              </ProtectedRoute>
            } />
        
            <Route path="/ventas" element={
              <ProtectedRoute>
                <VentasPage />
              </ProtectedRoute>
            } />

            <Route path="/reportes" element={
              <ProtectedRoute>
                <ReportesFinancieros />
              </ProtectedRoute>
            } />
        
            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
            {/* Ruta 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;