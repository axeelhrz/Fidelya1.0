'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB8Screen: React.FC = () => {
  const subcauses = [
    { number: "8.1", text: "Relaciones jerárquicas confusas o conflictivas" },
    { number: "8.2", text: "Asignación de responsabilidades confusas o conflictivas" },
    { number: "8.3", text: "Delegación inadecuada o insuficiente" },
    { number: "8.4", text: "Definición inadecuada de políticas" },
    { number: "8.5", text: "Formulación inadecuada de objetivos" },
    { number: "8.6", text: "Formulación inadecuada de estándares de trabajo" },
    { number: "8.7", text: "Formulación inadecuada de procedimientos de trabajo" },
    { number: "8.8", text: "Programación o planificación inadecuada del trabajo" },
    { number: "8.9", text: "Instrucciones de trabajo inadecuadas" },
    { number: "8.10", text: "Orientación y entrenamiento inadecuados" },
    { number: "8.11", text: "Provisión inadecuada de referencias, documentos y guías" },
    { number: "8.12", text: "Identificación y evaluación inadecuadas de exposiciones a pérdidas" },
    { number: "8.13", text: "Falta de conocimiento del trabajo por parte de la supervisión" },
    { number: "8.14", text: "Ubicación inadecuada del trabajador" },
    { number: "8.15", text: "Medición y evaluación inadecuadas del desempeño" },
    { number: "8.16", text: "Retroalimentación inadecuada o incorrecta" }
  ];

  return (
    <CBScreenLayout
      number={8}
      title="Liderazgo y/o Supervisión Inadecuados"
      nacReferences="Ver NAC 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18"
      subcauses={subcauses}
    />
  );
};

export default CB8Screen;
