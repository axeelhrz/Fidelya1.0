'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SCATLayout, ListItem } from '@/components/SCATLayout';

const ActosSubestandar: React.FC = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleNext = () => {
    router.push('/tabla-scat/condiciones');
  };

  const handlePrevious = () => {
    router.push('/tabla-scat/contacto');
  };

  const handleItemSelect = (itemNumber: number) => {
    setSelectedItems(prev => 
      prev.includes(itemNumber) 
        ? prev.filter(n => n !== itemNumber)
        : [...prev, itemNumber]
    );
  };

  const actosItems = [
    { number: 1, title: "Operar equipo sin autorización", subtitle: "Usar equipos sin permiso o capacitación" },
    { number: 2, title: "Falla en asegurar adecuadamente", subtitle: "No aplicar medidas de seguridad" },
    { number: 3, title: "Operar a velocidad inadecuada", subtitle: "Velocidad muy alta o muy baja" },
    { number: 4, title: "Poner fuera de servicio dispositivos de seguridad", subtitle: "Desactivar sistemas de protección" },
    { number: 5, title: "Usar equipo defectuoso", subtitle: "Utilizar herramientas dañadas" },
    { number: 6, title: "Usar inadecuadamente el equipo", subtitle: "Uso incorrecto de herramientas" },
    { number: 7, title: "Falla en usar equipo de protección personal", subtitle: "No usar EPP requerido" },
    { number: 8, title: "Carga inadecuada", subtitle: "Sobrecarga o carga incorrecta" },
    { number: 9, title: "Ubicación inadecuada", subtitle: "Posicionamiento incorrecto" },
    { number: 10, title: "Levantamiento inadecuado", subtitle: "Técnica incorrecta de levantamiento" },
    { number: 11, title: "Posición inadecuada para la tarea", subtitle: "Postura incorrecta durante trabajo" },
    { number: 12, title: "Mantenimiento inadecuado", subtitle: "Mantenimiento deficiente o inexistente" },
    { number: 13, title: "Bromas pesadas", subtitle: "Comportamiento inapropiado en el trabajo" },
    { number: 14, title: "Bajo la influencia del alcohol y/o drogas", subtitle: "Estado alterado durante trabajo" },
    { number: 15, title: "Falla en seguir procedimientos", subtitle: "No cumplir con protocolos establecidos" }
  ];

  return (
    <SCATLayout
      currentStep={1}
      totalSteps={4}
      activeTitle="ACTOS SUBESTÁNDAR / INSEGUROS"
      inactiveTitle="CONDICIONES SUBESTÁNDAR / INSEGURAS"
      isFirstActive={true}
      onPrevious={handlePrevious}
      onNext={handleNext}
      showPrevious={true}
      showNext={true}
    >
      <div className="space-y-4">
        <h3 className="text-white font-bold text-xl mb-6">
          Seleccione los actos subestándar identificados:
        </h3>
        
        {/* Grid de dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Primera columna (1-8) */}
          <div className="space-y-3">
            {actosItems.slice(0, 8).map((item) => (
              <ListItem
                key={item.number}
                number={item.number}
                title={item.title}
                subtitle={item.subtitle}
                isSelected={selectedItems.includes(item.number)}
                onClick={() => handleItemSelect(item.number)}
              />
            ))}
          </div>
          
          {/* Segunda columna (9-15) */}
          <div className="space-y-3">
            {actosItems.slice(8).map((item) => (
              <ListItem
                key={item.number}
                number={item.number}
                title={item.title}
                subtitle={item.subtitle}
                isSelected={selectedItems.includes(item.number)}
                onClick={() => handleItemSelect(item.number)}
              />
            ))}
          </div>
        </div>
        
        {/* Resumen de selección */}
        {selectedItems.length > 0 && (
          <div className="mt-8 p-4 bg-[#2E2E2E] rounded-lg">
            <h4 className="text-[#FFC107] font-semibold mb-2">
              Actos seleccionados ({selectedItems.length}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedItems.map(num => (
                <span key={num} className="bg-[#FFC107] text-black px-2 py-1 rounded text-sm font-medium">
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </SCATLayout>
  );
};

export default ActosSubestandar;
