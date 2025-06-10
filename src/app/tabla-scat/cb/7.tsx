'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB7Screen: React.FC = () => {
  const subcauses = [
    { number: "7.1", text: "El desempeño incorrecto es premiado" },
    { number: "7.2", text: "El desempeño correcto no es premiado" },
    { number: "7.3", text: "El desempeño correcto es castigado" },
    { number: "7.4", text: "Falta de incentivos" },
    { number: "7.5", text: "Frustración excesiva" },
    { number: "7.6", text: "Agresión indebida" },
    { number: "7.7", text: "Intento indebido de ahorrar tiempo" },
    { number: "7.8", text: "Intento indebido de evitar esfuerzo" },
    { number: "7.9", text: "Intento indebido de evitar incomodidad" },
    { number: "7.10", text: "Intento indebido de llamar la atención" },
    { number: "7.11", text: "Presión indebida de los compañeros" },
    { number: "7.12", text: "Ejemplo personal deficiente por parte de la supervisión" },
    { number: "7.13", text: "Retroalimentación deficiente o incorrecta" },
    { number: "7.14", text: "Incentivos de producción incorrectos" }
  ];

  return (
    <CBScreenLayout
      number={7}
      title="Motivación Incorrecta"
      nacReferences="Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18"
      subcauses={subcauses}
    />
  );
};

export default CB7Screen;
