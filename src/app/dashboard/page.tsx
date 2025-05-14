'use client';

import { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import PageLayout from '@/components/layout/PageLayout';
import VideoCreationForm from '@/components/video/VideoCreationForm';
import VideoGallery from '@/components/video/VideoGallery';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <Box
        component="section"
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 4,
            }}
          >
            Dashboard
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 3,
                },
              }}
            >
              <Tab label="Crear Video" />
              <Tab label="Mis Videos" />
            </Tabs>
          </Box>

          <Box sx={{ mt: 4 }}>
            {activeTab === 0 ? (
              <VideoCreationForm />
            ) : (
              <VideoGallery />
            )}
          </Box>
        </Container>
      </Box>
    </PageLayout>
    </ProtectedRoute>
  );
}