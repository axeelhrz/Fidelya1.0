'use client';

import React from 'react';
import { Box, Button, Container, Paper, Stack, Typography, alpha } from '@mui/material';
import { House, ArrowClockwise, WarningCircle } from '@phosphor-icons/react';
import Link from 'next/link';
interface ErrorScreenProps {
  title?: string;
  message: string;
  error?: Error & { digest?: string };
  onRetry?: () => void;
  fullScreen?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
}

export function ErrorScreen({
  title = 'Error Inesperado',
  message,
  error,
  onRetry,
  fullScreen = false,
  showHomeButton = false,
  showRefreshButton = false,
}: ErrorScreenProps) {
  const containerStyles = fullScreen
    ? {
        minHeight: '100vh',
          display: 'flex',
        flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        p: 3,
      }
    : { p: 3 };
  return (
    <Container maxWidth="sm" sx={containerStyles}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          borderRadius: '16px',
          border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
          backgroundColor: (theme) => alpha(theme.palette.error.light, 0.05),
        }}
      >
        <Stack spacing={3} alignItems="center">
          <WarningCircle size={64} color="var(--mui-palette-error-main)" weight="duotone" />
          <Typography variant="h4" component="h1" fontWeight="bold" color="error.dark">
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
          {error && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: '8px',
                backgroundColor: (theme) => alpha(theme.palette.grey[500], 0.1),
                maxHeight: '150px',
                overflowY: 'auto',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                <strong>Detalles del error:</strong>
                {error.digest && `\nDigest: ${error.digest}`}
                {`\nName: ${error.name}`}
                {`\nMessage: ${error.message}`}
                {error.stack && `\nStack: ${error.stack.substring(0, 300)}...`}
              </Typography>
            </Box>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ width: '100%', mt: 2 }}>
            {showHomeButton && (
              <Link href="/" passHref legacyBehavior>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<House />}
                  sx={{ borderRadius: '8px', textTransform: 'none' }}
                >
                  Ir al Inicio
                </Button>
              </Link>
            )}
            {showRefreshButton && onRetry && (
              <Button
                variant="contained"
                color="primary"
                onClick={onRetry}
                startIcon={<ArrowClockwise />}
                sx={{ borderRadius: '8px', textTransform: 'none' }}
              >
                Intentar de Nuevo
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
