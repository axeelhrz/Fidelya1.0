'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB15Screen: React.FC = () => {
  const subcauses = [
    { number: "15.1", text: "Uso por personal no calificado o sin entrenamiento" },
    { number: "15.2", text: "Uso para propósitos no previstos" },
    { number: "15.3", text: "Uso inadecuado o incorrecto" },
    { number: "15.4", text: "Mantenimiento inadecuado" },
    { number: "15.5", text: "Uso sin permiso" }
  ];

  return (
    <CBScreenLayout
      number={15}
      title="Abuso o Mal Uso"
      nacReferences="Ver NAC 3,4,6,9,12,15,18"
      subcauses={subcauses}
    />
  );
};

export default CB15Screen;
