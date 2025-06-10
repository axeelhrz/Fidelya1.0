'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB2Screen: React.FC = () => {
  const subcauses = [
    { number: "2.1", text: "Miedos y fobias" },
    { number: "2.2", text: "Problemas emocionales" },
    { number: "2.3", text: "Enfermedad mental" },
    { number: "2.4", text: "Nivel de inteligencia" },
    { number: "2.5", text: "Incapacidad de comprensión" },
    { number: "2.6", text: "Falta de juicio" },
    { number: "2.7", text: "Coordinación deficiente" },
    { number: "2.8", text: "Tiempo de reacción lento" },
    { number: "2.9", text: "Aptitud mecánica deficiente" },
    { number: "2.10", text: "Incapacidad de aprendizaje" },
    { number: "2.11", text: "Problemas de memoria" }
  ];

  return (
    <CBScreenLayout
      number={2}
      title="Capacidad Mental/Psicológica Inadecuada"
      nacReferences="Ver NAC 2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18"
      subcauses={subcauses}
    />
  );
};

export default CB2Screen;
