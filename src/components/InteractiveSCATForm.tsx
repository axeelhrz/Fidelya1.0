'use client';

import React from 'react';
import { SCATFormStepper } from './SCATFormStepper';

// Este componente ahora es un wrapper que puede extenderse
export const InteractiveSCATForm: React.FC = () => {
  return <SCATFormStepper />;
};

// Exportar también el componente principal
export { SCATFormStepper };