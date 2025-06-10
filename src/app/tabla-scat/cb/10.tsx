'use client';

import React from 'react';
import { CBScreenLayout } from '../../../components/CBComponents';

const CB10Screen: React.FC = () => {
  const subcauses = [
    { number: "10.1", text: "Especificaciones inadecuadas en cuanto a los requerimientos" },
    { number: "10.2", text: "Investigación inadecuada acerca de materiales y equipos" },
    { number: "10.3", text: "Especificaciones inadecuadas para los vendedores" },
    { number: "10.4", text: "Modalidad o ruta de embarque inadecuada" },
    { number: "10.5", text: "Inspección y aceptación inadecuadas de los materiales" },
    { number: "10.6", text: "Manejo inadecuado de los materiales" },
    { number: "10.7", text: "Almacenamiento inadecuado de los materiales" },
    { number: "10.8", text: "Transporte inadecuado de los materiales" },
    { number: "10.9", text: "Identificación inadecuada de los ítems que implican riesgos" },
    { number: "10.10", text: "Disposición o eliminación inadecuada de materiales desechados" }
  ];

  return (
    <CBScreenLayout
      number={10}
      title="Compras Inadecuadas"
      nacReferences="Ver NAC 3,4,6,9,12,15,18"
      subcauses={subcauses}
    />
  );
};

export default CB10Screen;
