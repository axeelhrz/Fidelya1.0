'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SCATLayout, ListItem } from '@/components/SCATLayout';

const CondicionesSubestandar: React.FC = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleNext = () => {
    router.push('/tabla-scat/personales');
  };

  const handlePrevious = () => {
    router.push('/tabla-scat/actos');
  };

  const handleItemSelect = (itemNumber: number) => {
    setSelectedItems(prev => 
      prev.includes(itemNumber) 
        ? prev.filter(n => n !== itemNumber)
        : [...prev, itemNumber]
    );
  };

  const condicionesItems = [
    { number: 16, title: "Protecciones y resguardos inadecuados", subtitle: "Barreras de seguridad deficientes" },
    { number: 17, title: "Equipo de protección personal inadecuado", subtitle: "EPP defectuoso o insuficiente" },
    { number: 18, title: "Herramientas, equipos o materiales defectuosos", subtitle: "Equipos en mal estado" },
    { number: 19, title: "Espacio limitado para desenvolverse", subtitle: "Área de trabajo reducida" },
    { number: 20, title: "Sistemas de advertencia inadecuados", subtitle: "Señalización deficiente" },
    { number: 21, title: "Peligro de incendio y explosión", subtitle: "Riesgo de combustión" },
    { number: 22, title: "Orden y limpieza deficientes", subtitle: "Área de trabajo desordenada" },
    { number: 23, title: "Condiciones ambientales peligrosas", subtitle: "Ambiente de trabajo riesgoso" },
    { number: 24, title: "Exposición a ruido", subtitle: "Niveles de ruido excesivos" },
    { number: 25, title: "Exposición a radiación", subtitle: "Radiación ionizante o no ionizante" },
    { number: 26, title: "Exposición a temperaturas extremas", subtitle: "Calor o frío excesivo" },
    { number: 27, title: "Iluminación inadecuada", subtitle: "Luz insuficiente o excesiva" },
    { number: 28, title: "Ventilación inadecuada", subtitle: "Circulación de aire deficiente" }
  ];

  return (
    <SCATLayout
      currentStep={2}
      totalSteps={4}
      activeTitle="CONDICIONES SUBESTÁNDAR / INSEGURAS"
      inactiveTitle="ACTOS SUBESTÁNDAR / INSEGUROS"
      isFirstActive={false}
      onPrevious={handlePrevious}
      onNext={handleNext}
      showPrevious={true}
      showNext={true}
    >
      <div className="space-y-4">
        <h3 className="text-white font-bold text-xl mb-6">
          Seleccione las condiciones subestándar identificadas:
        </h3>
        
        {/* Grid de tres columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Primera columna (16-20) */}
          <div className="space-y-3">
            {condicionesItems.slice(0, 5).map((item) => (
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
          
          {/* Segunda columna (21-23) */}
          <div className="space-y-3">
            {condicionesItems.slice(5, 8).map((item) => (
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
          
          {/* Tercera columna (24-28) */}
          <div className="space-y-3">
            {condicionesItems.slice(8).map((item) => (
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
              Condiciones seleccionadas ({selectedItems.length}):
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

export default CondicionesSubestandar;
