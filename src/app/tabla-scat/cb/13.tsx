'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB13Screen: React.FC = () => {
  const subcauses = [
    { number: "13.1", text: "Desarrollo inadecuado de estándares para inventario y evaluación de exposiciones y necesidades" },
    { number: "13.2", text: "Desarrollo inadecuado de estándares para coordinación con quienes diseñan el proceso" },
    { number: "13.3", text: "Desarrollo inadecuado de estándares para involucramiento del empleado" },
    { number: "13.4", text: "Desarrollo inadecuado de estándares para estándares/procedimientos/reglas de trabajo" },
    { number: "13.5", text: "Comunicación inadecuada de estándares para publicación" },
    { number: "13.6", text: "Comunicación inadecuada de estándares para distribución" },
    { number: "13.7", text: "Comunicación inadecuada de estándares para traducción a los idiomas apropiados" },
    { number: "13.8", text: "Comunicación inadecuada de estándares para entrenamiento" },
    { number: "13.9", text: "Comunicación inadecuada de estándares para reforzamiento mediante afiches, códigos de colores, etc." },
    { number: "13.10", text: "Mantenimiento inadecuado de estándares para seguimiento del desempeño" },
    { number: "13.11", text: "Mantenimiento inadecuado de estándares para actualización" },
    { number: "13.12", text: "Mantenimiento inadecuado de estándares para reforzamiento" }
  ];

  return (
    <CBScreenLayout
      number={13}
      title="Estándares de Trabajo Inadecuados"
      nacReferences="Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18"
      subcauses={subcauses}
    />
  );
};

export default CB13Screen;
