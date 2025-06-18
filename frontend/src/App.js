import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AnimatePresence } from 'framer-motion';
import { es } from 'date-fns/locale';

// Contextos
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

// Páginas
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/inventory';
import VentasPage from './pages/ventas';
import ComprasPage from './pages/compras';
import ClientesPage from './pages/clientes';
import ReportesPage from './pages/reportes/components/ReporteInventario';
import ReportesFinancierosPage from './pages/ReportesFinancieros';
import FacturacionPage from './pages/Facturacion';
import CierreCajaPage from './pages/CierreCaja';
import ConfiguracionPage from './pages/Configuracion';
import NotificacionesPage from './pages/Notificaciones';

// Tema
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider 
        dateAdapter={AdapterDateFns} 
        adapterLocale={es}
      >
        <AuthProvider>
          <InventoryProvider>
            <Router>
              <Box sx={{ display: 'flex', minHeight: '100vh' }}>
                <AnimatePresence mode="wait">
                  <Routes>
                    {/* Rutas públicas */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Rutas protegidas con layout */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }>
                      {/* Dashboard */}
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      
                      {/* Inventario */}
                      <Route path="inventory" element={<InventoryPage />} />
                      
                      {/* Ventas */}
                      <Route path="ventas" element={<VentasPage />} />
                      
                      {/* Compras */}
                      <Route path="compras" element={<ComprasPage />} />
                      
                      {/* Clientes */}
                      <Route path="clientes" element={<ClientesPage />} />
                      
                      {/* Reportes */}
                      <Route path="reportes" element={<ReportesPage />} />
                      <Route path="reportes-financieros" element={<ReportesFinancierosPage />} />
                      
                      {/* Facturación */}
                      <Route path="facturacion" element={<FacturacionPage />} />
                      
                      {/* Cierre de Caja */}
                      <Route path="cierre-caja" element={<CierreCajaPage />} />
                      
                      {/* Configuración */}
                      <Route path="configuracion" element={<ConfiguracionPage />} />
                      
                      {/* Notificaciones */}
                      <Route path="notificaciones" element={<NotificacionesPage />} />
                    </Route>
                    
                    {/* Ruta por defecto */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AnimatePresence>
              </Box>
            </Router>
          </InventoryProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;