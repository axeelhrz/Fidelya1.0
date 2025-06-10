'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB14Screen: React.FC = () => {
  const subcauses = [
    { number: "14.1", text: "Planificación inadecuada del uso" },
    { number: "14.2", text: "Prolongación excesiva de la vida útil de elementos" },
    { number: "14.3", text: "Inspección y/o control inadecuados" },
    { number: "14.4", text: "Sobrecarga o sobrevelocidad" },
    { number: "14.5", text: "Mantenimiento inadecuado" },
    { number: "14.6", text: "Uso por personal no calificado o sin entrenamiento" },
    { number: "14.7", text: "Uso para propósitos no previstos" }
  ];

  return (
    <CBScreenLayout
      number={14}
      title="Desgaste Excesivo"
      nacReferences="Ver NAC 3,4,6,9,12,15,18"
      subcauses={subcauses}
    />
  );
};

export default CB14Screen;
