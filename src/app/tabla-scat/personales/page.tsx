'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SCATLayout, ListItem } from '@/components/SCATLayout';

const FactoresPersonales: React.FC = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleNext = () => {
    router.push('/tabla-scat/laborales');
  };

  const handlePrevious = () => {
    router.push('/tabla-scat/condiciones');
  };

  const handleItemSelect = (itemNumber: number) => {
    setSelectedItems(prev => 
      prev.includes(itemNumber) 
        ? prev.filter(n => n !== itemNumber)
        : [...prev, itemNumber]
    );
  };

  const factoresPersonales = [
    { 
      number: 1, 
      title: "Capacidad Física/Fisiológica Inadecuada", 
      subtitle: "Limitaciones físicas que afectan el desempeño laboral" 
    },
    { 
      number: 2, 
      title: "Capacidad Mental/Psicológica Inadecuada", 
      subtitle: "Limitaciones mentales o psicológicas" 
    },
    { 
      number: 3, 
      title: "Tensión Física o Fisiológica", 
      subtitle: "Estrés físico o fatiga que compromete la seguridad" 
    },
    { 
      number: 4, 
      title: "Tensión Mental o Psicológica", 
      subtitle: "Estrés mental, ansiedad o presión psicológica" 
    },
    { 
      number: 5, 
      title: "Falta de Conocimiento", 
      subtitle: "Desconocimiento de procedimientos o riesgos" 
    }
  ];

  return (
    <SCATLayout
      currentStep={3}
      totalSteps={4}
      activeTitle="FACTORES PERSONALES"
      inactiveTitle="FACTORES LABORALES"
      isFirstActive={true}
      onPrevious={handlePrevious}
      onNext={handleNext}
      showPrevious={true}
      showNext={true}
    >
      <div className="space-y-4">
        <h3 className="text-white font-bold text-xl mb-6">
          Seleccione los factores personales identificados:
        </h3>
        
        {/* Lista en una sola columna para mejor legibilidad */}
        <div className="space-y-4">
          {factoresPersonales.map((item) => (
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
              const factor = factoresPersonales.find(f => f.number === num);
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
              Factores personales seleccionados ({selectedItems.length}):
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

export default FactoresPersonales;
