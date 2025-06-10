'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB5Screen: React.FC = () => {
  const subcauses = [
    { number: "5.1", text: "Falta de experiencia" },
    { number: "5.2", text: "Orientación inadecuada" },
    { number: "5.3", text: "Entrenamiento inicial inadecuado" },
    { number: "5.4", text: "Reentrenamiento inadecuado" },
    { number: "5.5", text: "Instrucciones malentendidas" }
  ];

  return (
    <CBScreenLayout
      number={5}
      title="Falta de Conocimientos"
      nacReferences="Ver NAC 2,4,5,6"
      subcauses={subcauses}
    />
  );
};

export default CB5Screen;
