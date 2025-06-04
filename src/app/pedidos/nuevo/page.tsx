'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Calendar, User, ShoppingCart } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useAuth';
import { useUser } from '@/context/UserContext';
import { useProducts } from '@/hooks/useProducts';
import { useCreateOrder } from '@/hooks/useOrders';
import { usePayment } from '@/hooks/usePayment';
import { Navbar } from '@/components/navbar';
import { ProductSelector } from '@/components/products/ProductSelector';
import { OrderSummary } from '@/components/orders/OrderSummary';
import { format, addDays, isWeekend } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Step = 'student' | 'date' | 'products' | 'summary';
export default function NewOrderPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { students } = useUser();
  const router = useRouter();
  
  // Form state
  const [currentStep, setCurrentStep] = useState<Step>('student');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{ product_id: string; quantity: number }[]>([]);
  const [notes, setNotes] = useState('');

  // Hooks
  const { products, isLoading: productsLoading } = useProducts(selectedDate);
  const { createOrder, isCreating } = useCreateOrder();
  const { createPayment, isProcessing } = usePayment();

  // Get available dates (next 7 days, excluding weekends)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, "EEEE, d 'de' MMMM", { locale: es }),
      disabled: isWeekend(date)
    };
  }).filter(date => !date.disabled);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleProductSelect = (productId: string, quantity: number) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.product_id === productId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter(p => p.product_id !== productId);
        }
        return prev.map(p => 
          p.product_id === productId ? { ...p, quantity } : p
        );
      } else if (quantity > 0) {
        return [...prev, { product_id: productId, quantity }];
      }
      return prev;
    });
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'student':
        if (!selectedStudentId) {
          toast.error('Por favor selecciona un estudiante');
          return;
        }
        setCurrentStep('date');
        break;
      case 'date':
        if (!selectedDate) {
          toast.error('Por favor selecciona una fecha');
          return;
        }
        setCurrentStep('products');
        break;
      case 'products':
        if (selectedProducts.length === 0) {
          toast.error('Por favor selecciona al menos un producto');
          return;
        }
        setCurrentStep('summary');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'date':
        setCurrentStep('student');
        break;
      case 'products':
        setCurrentStep('date');
        break;
      case 'summary':
        setCurrentStep('products');
        break;
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedStudentId || !selectedDate || selectedProducts.length === 0) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      const order = await createOrder({
        student_id: selectedStudentId,
        delivery_date: selectedDate,
        products: selectedProducts,
        notes: notes.trim() || undefined,
      });

      // Redirect to payment
      await createPayment(order.id);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay estudiantes registrados</h3>
              <p className="text-muted-foreground mb-6">
                Primero debes agregar al menos un estudiante para poder realizar pedidos
              </p>
              <Button onClick={() => router.push('/perfil')}>
                Agregar Estudiante
              </Button>
          </CardContent>
      </Card>
    </div>
      </div>
  );
}

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Nuevo Pedido</h1>
          <p className="text-muted-foreground">
            Sigue los pasos para realizar un pedido para tus estudiantes
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { key: 'student', label: 'Estudiante', icon: User },
              { key: 'date', label: 'Fecha', icon: Calendar },
              { key: 'products', label: 'Productos', icon: ShoppingCart },
              { key: 'summary', label: 'Resumen', icon: ShoppingCart },
            ].map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = ['student', 'date', 'products', 'summary'].indexOf(currentStep) > index;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                      isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                      'border-muted-foreground text-muted-foreground'}
                  `}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'student' && (
              <Card>
                <CardHeader>
                  <CardTitle>Seleccionar Estudiante</CardTitle>
                  <CardDescription>
                    Elige para qué estudiante realizarás el pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {students.map((student) => (
                      <motion.div
                        key={student.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all ${
                            selectedStudentId === student.id 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedStudentId(student.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{student.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {student.grade} - {student.section}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'date' && (
              <Card>
                <CardHeader>
                  <CardTitle>Seleccionar Fecha de Entrega</CardTitle>
                  <CardDescription>
                    Elige cuándo quieres que se entregue el pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una fecha" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedDate && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Fecha seleccionada:</strong> {
                          availableDates.find(d => d.value === selectedDate)?.label
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 'products' && (
              <Card>
                <CardHeader>
                  <CardTitle>Seleccionar Productos</CardTitle>
                  <CardDescription>
                    Elige los productos para el pedido de {selectedStudent?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <ProductSelector
                      products={products}
                      selectedProducts={selectedProducts}
                      onProductSelect={handleProductSelect}
                    />
                  )}
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Instrucciones especiales, alergias, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'summary' && selectedStudent && (
              <OrderSummary
                student={selectedStudent}
                deliveryDate={selectedDate}
                selectedProducts={selectedProducts}
                products={products}
                notes={notes}
                onConfirm={handleConfirmOrder}
                onEdit={() => setCurrentStep('products')}
                isLoading={isCreating || isProcessing}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep !== 'summary' && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'student'}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <Button onClick={handleNext}>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}