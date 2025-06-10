'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB9Screen: React.FC = () => {
  const subcauses = [
    { number: "9.1", text: "Evaluación inadecuada de exposiciones a pérdidas" },
    { number: "9.2", text: "Preocupación inadecuada por los factores humanos/ergonómicos" },
    { number: "9.3", text: "Estándares, especificaciones y/o criterios de diseño inadecuados" },
    { number: "9.4", text: "Control e inspección inadecuados de las construcciones" },
    { number: "9.5", text: "Evaluación inadecuada para el comienzo de operaciones" },
    { number: "9.6", text: "Evaluación inadecuada de los cambios" },
    { number: "9.7", text: "Evaluación inadecuada de la condición para el uso continuo" }
  ];

  return (
    <CBScreenLayout
      number={9}
      title="Ingeniería Inadecuada"
      nacReferences="Ver NAC 3,4,6,9,12,15,18"
      subcauses={subcauses}
    />
  );
};

export default CB9Screen;
