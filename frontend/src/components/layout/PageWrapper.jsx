import React from 'react';
import { Box } from '@mui/material';
import PageHeader from './PageHeader';

const PageWrapper = ({ 
  children, 
  title, 
  subtitle, 
  breadcrumbs, 
  actions, 
  stats,
  ...headerProps 
}) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        actions={actions}
        stats={stats}
        {...headerProps}
      />
      
      <Box sx={{ flex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageWrapper;