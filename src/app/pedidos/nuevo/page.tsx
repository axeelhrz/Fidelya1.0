"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WeekSelector } from '@/components/week-selector';
import { WeekView } from '@/components/week-view';
import { usePedidosForm } from './hooks/usePedidosForm';
import { OrderSummary } from './components/OrderSummary';
import { PaymentConfirmation } from './components/PaymentConfirmation';
import { 
  User, 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Sparkles,
  GraduationCap,
  ArrowRight,
  Info
} from 'lucide-react';

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

  // Estado local para mantener los acordeones abiertos
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  // Mantener un weekStart independiente para cada hijo
  const [weekStartByStudent, setWeekStartByStudent] = useState<{[studentId: string]: Date}>({});

  // Función para obtener el estado de completitud de un estudiante
  const getStudentCompletionStatus = (studentId: string) => {
    const selections = selectedOptionsByStudent[studentId] || {};
    const hasSelections = Object.keys(selections).length > 0;
    
    if (!hasSelections) return 'pending';
    
    // Verificar si tiene al menos una selección
    const hasAnySelection = Object.values(selections).some(daySelections => 
      daySelections.almuerzo || daySelections.colacion
    );
    
    return hasAnySelection ? 'completed' : 'pending';
  };

  // Calcular estadísticas de progreso
  const getProgressStats = () => {
    const total = selectedStudents.length;
    const completed = selectedStudents.filter(id => 
      getStudentCompletionStatus(id) === 'completed'
    ).length;
    
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const progressStats = getProgressStats();

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <motion.div
              className="w-16 h-16 border-4 border-blue-200 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-lg font-semibold text-gray-700">Cargando información...</p>
        </motion.div>
      </div>
    );
  }

  // Si no hay cliente, no mostrar nada
  if (!cliente) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl rounded-3xl overflow-hidden">
            {/* Header con gradiente */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
              
              <CardHeader className="relative z-10 text-white py-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold">
                      {currentStep === 'seleccion' && "Nuevo Pedido"}
                      {currentStep === 'resumen' && "Resumen del Pedido"}
                      {currentStep === 'confirmacion' && "Pedido Confirmado"}
                    </CardTitle>
                    {currentStep === 'seleccion' && (
                      <p className="text-blue-100 mt-1">Selecciona los menús para tus hijos</p>
                    )}
                  </div>
                </motion.div>

                {/* Barra de progreso */}
                {currentStep === 'seleccion' && selectedStudents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-100">
                        Progreso del pedido
                      </span>
                      <span className="text-sm font-bold text-white">
                        {progressStats.completed}/{progressStats.total} estudiantes
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressStats.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </motion.div>
                )}
              </CardHeader>
            </div>

            {currentStep === 'seleccion' && (
              <CardContent className="p-8 space-y-8">
                {/* Información introductoria */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">¿Cómo funciona?</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Selecciona los estudiantes para los que deseas hacer pedidos y luego abre cada panel 
                        para elegir sus opciones de almuerzo y colación para la semana.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Debug info mejorado */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <Badge variant="outline" className="text-sm font-medium">
                    {cliente.hijos && cliente.hijos.length > 0 ?
                      `${cliente.hijos.length} estudiantes encontrados` :
                      'No se encontraron estudiantes asociados a tu cuenta'}
                  </Badge>
                </motion.div>

                {/* Lista de estudiantes */}
                <div className="space-y-4">
                  {cliente.hijos && cliente.hijos.length > 0 ? (
                    cliente.hijos
                      .filter(hijo => hijo && hijo.id)
                      .map((hijo, index) => {
                        const isSelected = selectedStudents.includes(hijo.id);
                        const isOpen = openAccordions.includes(hijo.id);
                        const studentKey = hijo.id ? `student-${hijo.id}` : `student-index-${index}`;
                        const completionStatus = getStudentCompletionStatus(hijo.id);

                        return (
                          <motion.div
                            key={studentKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                          >
                            <Card className={`
                              transition-all duration-300 hover:shadow-xl border-2 rounded-2xl overflow-hidden
                              ${isSelected 
                                ? completionStatus === 'completed'
                                  ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50'
                                  : 'border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                              }
                            `}>
                              {/* Header del estudiante */}
                              <div
                                className="flex items-center justify-between p-6 cursor-pointer transition-all duration-200 hover:bg-white/50"
                                onClick={() => {
                                  toggleStudentSelection(hijo.id);
                                  if (isSelected) {
                                    setOpenAccordions(openAccordions.filter(id => id !== hijo.id));
                                  } else {
                                    setOpenAccordions([...openAccordions, hijo.id]);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-4">
                                  {/* Checkbox personalizado */}
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => toggleStudentSelection(hijo.id)}
                                      className="sr-only"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <motion.div
                                      className={`
                                        w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer
                                        ${isSelected 
                                          ? 'bg-blue-600 border-blue-600' 
                                          : 'border-gray-300 hover:border-blue-400'
                                        }
                                      `}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {isSelected && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <CheckCircle className="w-4 h-4 text-white" />
                                        </motion.div>
                                      )}
                                    </motion.div>
                                  </div>

                                  {/* Avatar del estudiante */}
                                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {hijo.nombre.charAt(0).toUpperCase()}
                                  </div>

                                  {/* Información del estudiante */}
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                      {hijo.nombre}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                      {hijo.curso}° {hijo.letra} • {hijo.nivel}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  {/* Badge de estado */}
                                  {isSelected && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.1 }}
                                    >
                                      <Badge 
                                        variant={completionStatus === 'completed' ? 'default' : 'secondary'}
                                        className={`
                                          flex items-center gap-1 font-medium
                                          ${completionStatus === 'completed' 
                                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                                            : 'bg-amber-100 text-amber-700 border-amber-200'
                                          }
                                        `}
                                      >
                                        {completionStatus === 'completed' ? (
                                          <>
                                            <CheckCircle className="w-3 h-3" />
                                            Completado
                                          </>
                                        ) : (
                                          <>
                                            <Clock className="w-3 h-3" />
                                            Pendiente
                                          </>
                                        )}
                                      </Badge>
                                    </motion.div>
                                  )}

                                  {/* Icono de expansión */}
                                  <motion.div
                                    animate={{ rotate: isSelected && isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-gray-400"
                                  >
                                    <ChevronDown className="w-5 h-5" />
                                  </motion.div>
                                </div>
                              </div>

                              {/* Contenido expandible */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-6 pt-0 border-t border-gray-100">
                                      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white/50">
                                        <WeekSelector
                                          currentWeekStart={weekStartByStudent[hijo.id] || selectedWeekStart}
                                          onSelectWeek={(date) => {
                                            setWeekStartByStudent(prev => ({
                                              ...prev,
                                              [hijo.id]: date
                                            }));
                                          }}
                                        />
                                        
                                        <div className="mt-6">
                                          {loadingMenu ? (
                                            <div className="text-center py-12">
                                              <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                                              />
                                              <p className="text-gray-600 font-medium">Cargando opciones de menú...</p>
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
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Card>
                          </motion.div>
                        );
                      })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay estudiantes registrados</h3>
                      <p className="text-gray-600">Por favor, contacta con administración para registrar estudiantes.</p>
                    </motion.div>
                  )}
                </div>

                {/* Botón de continuar */}
                {selectedStudents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center pt-8"
                  >
                    <Button 
                      onClick={goToResumen}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        Continuar al resumen
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            )}

            {currentStep === 'resumen' && (
              <CardContent className="p-8">
                <OrderSummary
                  isGuardando={guardando}
                  hijos={cliente.hijos}
                  selectedStudents={selectedStudents}
                  menuOptions={menuOptions}
                  selectedOptionsByStudent={selectedOptionsByStudent}
                  total={montoTotal}
                  onGoBack={() => setCurrentStep('seleccion')}
                  onSubmit={handleSubmit}
                />
              </CardContent>
            )}

            {currentStep === 'confirmacion' && pedidoCreado && (
              <CardContent className="p-8">
                <PaymentConfirmation
                  transactionId={transactionId}
                  montoTotal={montoTotal}
                  linkPago={linkPago}
                  addHiddenField={addHiddenField}
                />
              </CardContent>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}