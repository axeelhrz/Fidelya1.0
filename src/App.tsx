import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Sales } from './pages/Sales';

type Page = 'dashboard' | 'inventory' | 'sales';
function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'sales':
        return <Sales />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Header 
          onMenuClick={handleMenuClick} 
          sidebarOpen={sidebarOpen} 
        />
        <Sidebar 
          open={sidebarOpen} 
          onClose={handleSidebarClose}
          onPageChange={handlePageChange}
          currentPage={currentPage}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 8, // Para el header fijo
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          {renderCurrentPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
