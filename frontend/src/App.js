import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Context
import { AuthProvider } from './context/AuthContext';

// Theme
import theme from './theme/theme';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/dashboard/index';
import InventoryPage from './pages/inventory/index';
import ComprasPage from './pages/compras/index';
import ClientesPage from './pages/clientes'; // Nueva página de clientes

// Estilos globales
import './App.css';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: 'background.default',
            fontFamily: '"Inter", "Roboto", sans-serif'
          }}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            {/* Rutas protegidas */}
                <Route path="/dashboard" element={
                <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard />
                    </motion.div>
                  </ProtectedRoute>
                } />
                
                <Route path="/inventario" element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <InventoryPage />
                    </motion.div>
                  </ProtectedRoute>
                } />
                
                <Route path="/compras" element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ComprasPage />
                    </motion.div>
                  </ProtectedRoute>
                } />

                {/* Nueva ruta de clientes */}
                <Route path="/clientes" element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ClientesPage />
                    </motion.div>
                  </ProtectedRoute>
                } />
                
                {/* Redirección por defecto */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Ruta 404 */}
                <Route path="*" element={
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '100vh',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h1>404 - Página no encontrada</h1>
                      <p>La página que buscas no existe.</p>
                    </motion.div>
                  </Box>
                } />
              </Routes>
            </AnimatePresence>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
