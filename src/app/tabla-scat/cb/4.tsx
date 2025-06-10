'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB4Screen: React.FC = () => {
  const subcauses = [
    { number: "4.1", text: "Sobrecarga emocional" },
    { number: "4.2", text: "Fatiga debido a la carga o duración de la tarea mental" },
    { number: "4.3", text: "Problemas financieros extremos" },
    { number: "4.4", text: "Problemas familiares" },
    { number: "4.5", text: "Problemas emocionales" },
    { number: "4.6", text: "Enfermedad en la familia" },
    { number: "4.7", text: "Muerte en la familia" },
    { number: "4.8", text: "Problemas maritales" },
    { number: "4.9", text: "Frustración" },
    { number: "4.10", text: "Conflictos de personalidad" },
    { number: "4.11", text: "Enfermedad mental" }
  ];

  return (
    <CBScreenLayout
      number={4}
      title="Tensión Mental o Psicológica"
      nacReferences="Ver NAC 2,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18"
      subcauses={subcauses}
    />
  );
};

export default CB4Screen;
