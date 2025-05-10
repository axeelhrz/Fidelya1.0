'use client';

import React from 'react';
import Link from 'next/link';
import { Box, useTheme } from '@mui/material';

export default function Logo() {
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Link href="/" aria-label="Assuriva" style={{ display: 'inline-flex' }}>
      <Box
        component="img"
        src="/assets/Logotipo.svg"
        alt="Assuriva"
        sx={{
          width: '50px',
          height: '50px',
          transition: 'filter 0.3s ease-in-out',
          filter: isDarkMode ? 'invert(1)' : 'none',
        }}
      />
    </Link>
  );
}