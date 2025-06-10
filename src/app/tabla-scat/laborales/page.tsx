'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SCATLayout, ListItem } from '@/components/SCATLayout';

const FactoresLaborales: React.FC = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleNext = () => {
    // Aquí puedes navegar a la siguiente sección o mostrar un resumen
    console.log('Completar análisis SCAT');
  };

  const handlePrevious = () => {
    router.push('/tabla-scat/personales');
  };

  const handleItemSelect = (itemNumber: number) => {
    setSelectedItems(prev => 
      prev.includes(itemNumber) 
        ? prev.filter(n => n !== itemNumber)
        : [...prev, itemNumber]
    );
  };

  const factoresLaborales = [
    { 
      number: 6, 
      title: "Liderazgo y/o Supervisión Inadecuada", 
      subtitle: "Falta de dirección o supervisión deficiente" 
    },
    { 
      number: 7, 
      title: "Ingeniería Inadecuada", 
      subtitle: "Diseño deficiente de procesos o equipos" 
    },
    { 
      number: 8, 
      title: "Adquisiciones Inadecuadas", 
      subtitle: "Compra de equipos o materiales inadecuados" 
    },
    { 
      number: 9, 
      title: "Mantenimiento Inadecuado", 
      subtitle: "Programa de mantenimiento deficiente" 
    },
    { 
      number: 10, 
      title: "Herramientas y Equipos Inadecuados", 
      subtitle: "Herramientas inapropiadas para la tarea" 
    },
    { 
      number: 11, 
      title: "Estándares de Trabajo Inadecuados", 
      subtitle: "Procedimientos de trabajo deficientes" 
    },
    { 
      number: 12, 
      title: "Uso y Desgaste", 
      subtitle: "Deterioro normal por uso continuo" 
    }
  ];

  return (
    <SCATLayout
      currentStep={4}
      totalSteps={4}
      activeTitle="FACTORES LABORALES"
      inactiveTitle="FACTORES PERSONALES"
      isFirstActive={false}
      onPrevious={handlePrevious}
      onNext={handleNext}
      showPrevious={true}
      showNext={false}
    >
      <div className="space-y-4">
        <h3 className="text-white font-bold text-xl mb-6">
          Seleccione los factores laborales identificados:
        </h3>
        
        {/* Lista en una sola columna para mejor legibilidad */}
        <div className="space-y-4">
          {factoresLaborales.map((item) => (
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
        
        {/* Detalles expandidos para factores seleccionados */}
        {selectedItems.length > 0 && (
          <div className="mt-8 space-y-4">
            <h4 className="text-[#FFC107] font-semibold text-lg">
              Detalles de factores seleccionados:
            </h4>
            {selectedItems.map(num => {
              const factor = factoresLaborales.find(f => f.number === num);
              return factor ? (
                <div key={num} className="bg-[#2E2E2E] p-4 rounded-lg">
                  <h5 className="text-white font-medium mb-2">
                    {num}. {factor.title}
                  </h5>
                  <p className="text-gray-400 text-sm mb-3">{factor.subtitle}</p>
                  <textarea 
                    className="w-full h-20 bg-[#404040] border border-gray-600 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent"
                    placeholder={`Describa los detalles específicos del factor "${factor.title}"...`}
                  />
                </div>
              ) : null;
            })}
          </div>
        )}
        
        {/* Resumen de selección */}
        {selectedItems.length > 0 && (
          <div className="mt-6 p-4 bg-[#2E2E2E] rounded-lg">
            <h4 className="text-[#FFC107] font-semibold mb-2">
              Factores laborales seleccionados ({selectedItems.length}):
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
        
        {/* Botón de finalización */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleNext}
            className="bg-[#4CAF50] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#45A049] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
          >
            COMPLETAR ANÁLISIS SCAT
          </button>
        </div>
      </div>
    </SCATLayout>
  );
};

export default FactoresLaborales;
