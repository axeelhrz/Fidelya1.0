"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import type { 
  MenuItem, 
  WeeklyMenuSelection, 
  OrderSummaryItem,
} from '@/lib/supabase/types';

interface MenuOptionsByStudent {
  [studentId: string]: WeeklyMenuSelection;
}

export function usePedidosForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: guardian, students, loading: userLoading } = useUser();
  
  const [loading, setLoading] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [currentStep, setCurrentStep] = useState<'seleccion' | 'resumen' | 'confirmacion'>('seleccion');
  
  // Estados del pedido
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(getNextMonday());
  const [menuOptions, setMenuOptions] = useState<MenuItem[]>([]);
  const [selectedOptionsByStudent, setSelectedOptionsByStudent] = useState<MenuOptionsByStudent>({});
  
  // Estados del resultado
  const [pedidoCreado, setPedidoCreado] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [montoTotal, setMontoTotal] = useState<number>(0);
  const [linkPago, setLinkPago] = useState<string>('');

  useEffect(() => {
    if (!userLoading) {
      if (!guardian) {
        router.push('/auth/login');
      } else {
        setLoading(false);
      }
    }
  }, [guardian, userLoading, router]);

  useEffect(() => {
    if (selectedWeekStart) {
      loadMenuForWeek(selectedWeekStart);
    }
  }, [selectedWeekStart]);

  function getNextMonday(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // Si es domingo, 1 día; sino, días hasta el próximo lunes
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    return nextMonday;
  }

  const loadMenuForWeek = async (weekStart: Date) => {
    try {
      setLoadingMenu(true);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .gte('available_date', weekStart.toISOString().split('T')[0])
        .lte('available_date', weekEnd.toISOString().split('T')[0])
        .eq('is_available', true)
        .order('available_date')
        .order('category');

      if (error) throw error;

      setMenuOptions(data || []);
    } catch (error: unknown) {
      console.error('Error loading menu:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar menú",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingMenu(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        // Remover estudiante y limpiar sus selecciones
        const newSelected = prev.filter(id => id !== studentId);
        setSelectedOptionsByStudent(prevOptions => {
          const newOptions = { ...prevOptions };
          delete newOptions[studentId];
          return newOptions;
        });
        return newSelected;
      } else {
        // Agregar estudiante
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAlmuerzo = (studentId: string, date: string, optionId: string) => {
    setSelectedOptionsByStudent(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: {
          ...prev[studentId]?.[date],
          almuerzo: optionId
        }
      }
    }));
  };

  const handleSelectColacion = (studentId: string, date: string, optionId: string) => {
    setSelectedOptionsByStudent(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: {
          ...prev[studentId]?.[date],
          colacion: optionId
        }
      }
    }));
  };

  const calculateTotal = (): number => {
    let total = 0;
    
    selectedStudents.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      const selections = selectedOptionsByStudent[studentId] || {};
      
      Object.values(selections).forEach(daySelection => {
        if (daySelection.almuerzo) {
          const menuItem = menuOptions.find(m => m.id === daySelection.almuerzo);
          if (menuItem) {
            total += student?.user_type === 'funcionario' 
              ? menuItem.price_staff 
              : menuItem.price_student;
          }
        }
        
        if (daySelection.colacion) {
          const menuItem = menuOptions.find(m => m.id === daySelection.colacion);
          if (menuItem) {
            total += student?.user_type === 'funcionario' 
              ? menuItem.price_staff 
              : menuItem.price_student;
          }
        }
      });
    });
    
    return total;
  };

  const goToResumen = () => {
    const total = calculateTotal();
    setMontoTotal(total);
    setCurrentStep('resumen');
  };

  const handleSubmit = async () => {
    if (!guardian) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se encontró información del usuario",
      });
      return;
    }

    try {
      setGuardando(true);

      // Generar ID de transacción único
      const newTransactionId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Preparar datos de pedidos
      const ordersToCreate: {
        guardian_id: string;
        student_id: string;
        menu_item_id: string;
        delivery_date: string;
        quantity: number;
        unit_price: number;
        total_amount: number;
        status: string;
        payment_status: string;
        transaction_id: string;
      }[] = [];
      const orderSummary: OrderSummaryItem[] = [];

      selectedStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const selections = selectedOptionsByStudent[studentId] || {};
        
        Object.entries(selections).forEach(([date, daySelection]) => {
          if (daySelection.almuerzo) {
            const menuItem = menuOptions.find(m => m.id === daySelection.almuerzo);
            if (menuItem) {
              const unitPrice = student.user_type === 'funcionario' 
                ? menuItem.price_staff 
                : menuItem.price_student;
              
              ordersToCreate.push({
                guardian_id: guardian.id,
                student_id: studentId,
                menu_item_id: daySelection.almuerzo,
                delivery_date: date,
                quantity: 1,
                unit_price: unitPrice,
                total_amount: unitPrice,
                status: 'pending',
                payment_status: 'pending',
                transaction_id: newTransactionId,
              });

              orderSummary.push({
                studentId,
                studentName: student.name,
                date,
                menuType: 'almuerzo',
                menuItem: { ...menuItem, code: menuItem.code ?? undefined, max_orders: menuItem.max_orders ?? undefined },
                quantity: 1,
                unitPrice,
                totalPrice: unitPrice,
              });
            }
          }

          if (daySelection.colacion) {
            const menuItem = menuOptions.find(m => m.id === daySelection.colacion);
            if (menuItem) {
              const unitPrice = student.user_type === 'funcionario' 
                ? menuItem.price_staff 
                : menuItem.price_student;
              
              ordersToCreate.push({
                guardian_id: guardian.id,
                student_id: studentId,
                menu_item_id: daySelection.colacion,
                delivery_date: date,
                quantity: 1,
                unit_price: unitPrice,
                total_amount: unitPrice,
                status: 'pending',
                payment_status: 'pending',
                transaction_id: newTransactionId,
              });

              orderSummary.push({
                studentId,
                studentName: student.name,
                date,
                menuType: 'colacion',
                menuItem: { ...menuItem, code: menuItem.code ?? undefined, max_orders: menuItem.max_orders ?? undefined },
                quantity: 1,
                unitPrice,
                totalPrice: unitPrice,
              });
            }
          }
        });
      });

      if (ordersToCreate.length === 0) {
        throw new Error('No hay pedidos para procesar');
      }

      // Crear transacción de pago
      const { data: transactionData, error: transactionError } = await supabase
        .from('payment_transactions')
        .insert({
          transaction_id: newTransactionId,
          guardian_id: guardian.id,
          total_amount: montoTotal,
          currency: 'CLP',
          payment_status: 'pending',
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutos
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Crear pedidos
      const { error: ordersError } = await supabase
        .from('orders')
        .insert(ordersToCreate);

      if (ordersError) throw ordersError;

      // Crear relaciones pedido-transacción
      const { data: createdOrders } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('transaction_id', newTransactionId);

      if (createdOrders) {
        const orderTransactions = createdOrders.map(order => ({
          order_id: order.id,
          transaction_id: transactionData.id,
          amount: order.total_amount,
        }));

        await supabase
          .from('order_transactions')
          .insert(orderTransactions);
      }

      // Crear enlace de pago con GetNet
      const paymentResponse = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: newTransactionId,
          montoTotal,
          orderData: orderSummary,
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || 'Error al crear enlace de pago');
      }

      // Actualizar transacción con URL de pago
      await supabase
        .from('payment_transactions')
        .update({ 
          payment_url: paymentResult.processUrl,
          gateway_transaction_id: paymentResult.requestId 
        })
        .eq('id', transactionData.id);

      setTransactionId(newTransactionId);
      setLinkPago(paymentResult.processUrl);
      setPedidoCreado(true);
      setCurrentStep('confirmacion');

      toast({
        title: "Pedido creado exitosamente",
        description: "Procede al pago para confirmar tu pedido",
      });

    } catch (error: unknown) {
      console.error('Error creating order:', error);
      toast({
        variant: "destructive",
        title: "Error al crear pedido",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setGuardando(false);
    }
  };

  const addHiddenField = (name: string, value: string) => {
    // Función para agregar campos ocultos al formulario de pago
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
    return form;
  };

  return {
    // Estados
    loading: loading || userLoading,
    loadingMenu,
    guardando,
    cliente: guardian,
    currentStep,
    pedidoCreado,
    transactionId,
    montoTotal,
    linkPago,
    
    // Datos
    selectedStudents,
    selectedWeekStart,
    menuOptions,
    selectedOptionsByStudent,
    
    // Funciones
    setSelectedWeekStart,
    toggleStudentSelection,
    handleSelectAlmuerzo,
    handleSelectColacion,
    goToResumen,
    handleSubmit,
    addHiddenField,
    setCurrentStep,
    calculateTotal,
  };
}