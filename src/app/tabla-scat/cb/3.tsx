'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB3Screen: React.FC = () => {
  const subcauses = [
    { number: "3.1", text: "Lesión o enfermedad" },
    { number: "3.2", text: "Fatiga debido a la carga o duración de la tarea" },
    { number: "3.3", text: "Fatiga debido a la falta de descanso" },
    { number: "3.4", text: "Fatiga debido a sobrecarga sensorial" },
    { number: "3.5", text: "Exposición a riesgos contra la salud" },
    { number: "3.6", text: "Exposición a temperaturas extremas" },
    { number: "3.7", text: "Insuficiencia de oxígeno" },
    { number: "3.8", text: "Variaciones en la presión atmosférica" },
    { number: "3.9", text: "Vibración" },
    { number: "3.10", text: "Insuficiencia de azúcar en sangre" },
    { number: "3.11", text: "Ingestión de drogas" }
  ];

  return (
    <CBScreenLayout
      number={3}
      title="Tensión Física o Fisiológica"
      nacReferences="Ver NAC 6,9,12,15,18"
      subcauses={subcauses}
    />
  );
};

export default CB3Screen;
