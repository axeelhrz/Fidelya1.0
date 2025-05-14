'use client';

import * as React from 'react';
import Box from '@mui/material/Box';

const DEFAULT_HEIGHT = 60;
const DEFAULT_WIDTH = 60;

type Color = 'dark' | 'light';

export interface LogoProps {
  color?: Color;            // Define si usa versión clara u oscura
  emblem?: boolean;         // Si debe mostrar el logo tipo emblema
  height?: number;          // Altura del logo (por defecto: 60)
  width?: number;           // Ancho del logo (por defecto: 60)
}

/**
 * Logo principal configurable.
 * Puedes usar `color="light"` o `color="dark"` para definir qué versión cargar.
 */
export function Logo({
  color = 'dark',
  emblem = false,
  height = DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
}: LogoProps): React.JSX.Element {
  let imageUrl: string;

  if (emblem) {
    imageUrl =
      color === 'light'
        ? '/assets/logo-emblem.svg'
        : '/assets/logo-emblem--dark.svg';
  } else {
    imageUrl =
      color === 'light'
        ? '/assets/logo.svg'
        : '/assets/logo--dark.svg';
  }

  return (
    <Box
      component="img"
      src={imageUrl}
      alt="Logo"
      height={height}
      width={width}
      sx={{ objectFit: 'contain' }}
    />
  );
}
