'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB11Screen: React.FC = () => {
  const subcauses = [
    { number: "11.1", text: "Aspectos preventivos inadecuados para evaluación de necesidades" },
    { number: "11.2", text: "Aspectos preventivos inadecuados para lubricación y servicio" },
    { number: "11.3", text: "Aspectos preventivos inadecuados para ajuste/ensamble" },
    { number: "11.4", text: "Aspectos preventivos inadecuados para limpieza o pulimiento" },
    { number: "11.5", text: "Aspectos correctivos inadecuados para comunicación de necesidades" },
    { number: "11.6", text: "Aspectos correctivos inadecuados para programación del trabajo" },
    { number: "11.7", text: "Aspectos correctivos inadecuados para revisión de las partes" },
    { number: "11.8", text: "Aspectos correctivos inadecuados para reemplazo de partes" }
  ];

  return (
    <CBScreenLayout
      number={11}
      title="Mantenimiento Inadecuado"
      nacReferences="Ver NAC 3,4,6,9,12,15,18"
      subcauses={subcauses}
    />
  );
};

export default CB11Screen;
