'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB6Screen: React.FC = () => {
  const subcauses = [
    { number: "6.1", text: "Instrucción inicial inadecuada" },
    { number: "6.2", text: "Práctica inadecuada" },
    { number: "6.3", text: "Operación esporádica" },
    { number: "6.4", text: "Falta de preparación" },
    { number: "6.5", text: "Falta de habilidades de liderazgo" }
  ];

  return (
    <CBScreenLayout
      number={6}
      title="Falta de Habilidad"
      nacReferences="Ver NAC 2,4,5,6"
      subcauses={subcauses}
    />
  );
};

export default CB6Screen;
