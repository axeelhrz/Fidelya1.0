"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeekSelector } from '@/components/week-selector';
import { WeekView } from '@/components/week-view';
import { usePedidosForm } from './hooks/usePedidosForm';
import { OrderSummary } from './components/OrderSummary';
import { PaymentConfirmation } from './components/PaymentConfirmation';

export default function NuevoPedidoPage() {
  const {
    loading,
    loadingMenu,
    guardando,
    cliente,
    currentStep,
    pedidoCreado,
    transactionId,
    montoTotal,
    linkPago,
    selectedStudents,
    selectedWeekStart,
    menuOptions,
    selectedOptionsByStudent,
    setSelectedWeekStart,
    toggleStudentSelection,
    handleSelectAlmuerzo,
    handleSelectColacion,
    goToResumen,
    handleSubmit,
    addHiddenField,
    setCurrentStep
  } = usePedidosForm();
  
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [weekStartByStudent, setWeekStartByStudent] = useState<{[studentId: string]: Date}>({});

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Cargando información...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cliente) {
    return null;
  }

  const renderSeleccion = () => (
    <CardContent className="space-y-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Selecciona los menús para tus hijos:</h2>
        <p className="text-sm text-gray-500 mb-4">Abre el panel de cada hijo para seleccionar sus opciones de almuerzo y colación.</p>
        
        <div className="mb-2 text-sm text-gray-500">
          {cliente.hijos && cliente.hijos.length > 0 ? 
            `${cliente.hijos.length} estudiantes encontrados` : 
            'No se encontraron estudiantes asociados a tu cuenta'}
        </div>
        
        <div className="space-y-4">
          {cliente.hijos && cliente.hijos.length > 0 ? 
            cliente.hijos
              .filter(hijo => hijo && hijo.id)
              .map((hijo, index) => {
                const isSelected = selectedStudents.includes(hijo.id);
                const studentKey = hijo.id ? `student-${hijo.id}` : `student-index-${index}`;
                
                return (
                  <div key={studentKey} className="border rounded-md overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                      onClick={() => {
                        toggleStudentSelection(hijo.id);
                        if (isSelected) {
                          setOpenAccordions(openAccordions.filter(id => id !== hijo.id));
                        } else {
                          setOpenAccordions([...openAccordions, hijo.id]);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleStudentSelection(hijo.id)}
                          className="mr-3 h-4 w-4"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className="font-medium">
                          {hijo.nombre} - {hijo.curso}° {hijo.letra} ({hijo.nivel})
                        </span>
                      </div>
                      <div className={`transform transition-transform ${isSelected ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="p-4 border-t">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <WeekSelector
                            currentWeekStart={weekStartByStudent[hijo.id] || selectedWeekStart}
                            onSelectWeek={(date) => {
                              setWeekStartByStudent(prev => ({
                                ...prev,
                                [hijo.id]: date
                              }));
                            }}
                          />
                          
                          <div className="mt-4">
                            {loadingMenu ? (
                              <div className="text-center py-8">
                                <p>Cargando opciones de menú...</p>
                              </div>
                            ) : (
                              <WeekView
                                key={`week-view-${hijo.id}`}
                                startDate={weekStartByStudent[hijo.id] || selectedWeekStart}
                                menuOptions={menuOptions}
                                selectedOptions={selectedOptionsByStudent[hijo.id] || {}}
                                onSelectOption={(date: string, type: 'almuerzo' | 'colacion', optionId: string) => {
                                  if (type === 'almuerzo') {
                                    handleSelectAlmuerzo(hijo.id, date, optionId);
                                  } else if (type === 'colacion') {
                                    handleSelectColacion(hijo.id, date, optionId);
                                  }
                                }}
                                isDisabled={false}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            : (
              <div className="p-4 text-center border rounded-md bg-gray-50">
                <p className="text-gray-600">No hay estudiantes registrados. Por favor, contacta con administración.</p>
              </div>
            )
          }
        </div>
      </div>
      
      {selectedStudents.length > 0 && (
        <div className="flex justify-end pt-4">
          <Button onClick={goToResumen}>
            Continuar al resumen
          </Button>
        </div>
      )}
    </CardContent>
  );

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 'seleccion' && "Nuevo Pedido"}
            {currentStep === 'resumen' && "Resumen del Pedido"}
            {currentStep === 'confirmacion' && "Pedido Confirmado"}
          </CardTitle>
        </CardHeader>
        
        {currentStep === 'seleccion' && renderSeleccion()}
        
        {currentStep === 'resumen' && (
          <CardContent>
            <OrderSummary
              isGuardando={guardando}
              hijos={cliente.hijos}
              selectedStudents={selectedStudents}
              menuOptions={menuOptions}
              selectedOptionsByStudent={selectedOptionsByStudent}
              onGoBack={() => setCurrentStep('seleccion')}
              onSubmit={handleSubmit}
            />
          </CardContent>
        )}
        
        {currentStep === 'confirmacion' && pedidoCreado && (
          <CardContent>
            <PaymentConfirmation
              transactionId={transactionId}
              montoTotal={montoTotal}
              linkPago={linkPago}
              addHiddenField={addHiddenField}
            />
          </CardContent>
        )}
      </Card>
    </div>
  );
}
