'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB12Screen: React.FC = () => {
  const subcauses = [
    { number: "12.1", text: "Evaluación inadecuada de necesidades y riesgos" },
    { number: "12.2", text: "Preocupación inadecuada por los factores humanos/ergonómicos" },
    { number: "12.3", text: "Estándares o especificaciones inadecuadas" },
    { number: "12.4", text: "Disponibilidad inadecuada" },
    { number: "12.5", text: "Ajustes/reparación/mantenimiento inadecuados" },
    { number: "12.6", text: "Sistema inadecuado de reparación y recuperación" },
    { number: "12.7", text: "Remoción y reemplazo inadecuados" }
  ];

  return (
    <CBScreenLayout
      number={12}
      title="Herramientas y Equipos Inadecuados"
      nacReferences="Ver NAC 3,4,6,9,12,15,18"
      subcauses={subcauses}
    />
  );
};

export default CB12Screen;
