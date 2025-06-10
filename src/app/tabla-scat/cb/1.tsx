'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB1Screen: React.FC = () => {
  const subcauses = [
    { number: "1.1", text: "Estatura, peso, fuerza inadecuados" },
    { number: "1.2", text: "Rango de movimiento corporal limitado" },
    { number: "1.3", text: "Capacidad limitada para mantener posiciones corporales" },
    { number: "1.4", text: "Sensibilidad a ciertas sustancias o alergias" },
    { number: "1.5", text: "Sensibilidad a extremos sensoriales" },
    { number: "1.6", text: "Defecto de visión" },
    { number: "1.7", text: "Defecto de audición" },
    { number: "1.8", text: "Otras deficiencias sensoriales" },
    { number: "1.9", text: "Incapacidad respiratoria" },
    { number: "1.10", text: "Otras incapacidades físicas permanentes" },
    { number: "1.11", text: "Incapacidades temporales" }
  ];

  return (
    <CBScreenLayout
      number={1}
      title="Capacidad Física / Fisiológica Inadecuada"
      nacReferences="Ver NAC 6,9,12,15,18"
      subcauses={subcauses}
    />
  );
};

export default CB1Screen;
