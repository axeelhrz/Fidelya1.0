import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PaymentService } from '../lib/services/paymentService';
import { 
  Payment, 
  PaymentMethod, 
  Subscription, 
  PaymentSummary,
  PaymentFilters,
  PaymentProcessRequest,
  PaymentProcessResponse
} from '../types/payments';

export const usePatientPayments = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});

  const centerId = user?.centerId || 'center1';
  const patientId = user?.id || 'patient1';

  // ============================================================================
  // CARGAR DATOS INICIALES
  // ============================================================================
  const loadPaymentData = useCallback(async () => {
    if (!centerId || !patientId) return;

    try {
      setLoading(true);
      setError(null);

      // En desarrollo, usar datos mock
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (isDevelopment) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPayments = PaymentService.getMockPayments(patientId);
        const mockSubscription = PaymentService.getMockSubscription(patientId);
        
        setPayments(mockPayments);
        setSubscription(mockSubscription);
        
        // Calcular resumen mock
        const totalPaid = mockPayments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + p.amount, 0);
        
        const totalPending = mockPayments
          .filter(p => p.status === 'pending')
          .reduce((sum, p) => sum + p.amount, 0);
        
        const totalOverdue = mockPayments
          .filter(p => p.status === 'overdue')
          .reduce((sum, p) => sum + p.amount, 0);

        const nextPayment = mockPayments
          .filter(p => p.status === 'pending' && p.dueDate)
          .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))[0];

        setPaymentSummary({
          totalPaid,
          totalPending,
          totalOverdue,
          nextPaymentAmount: nextPayment?.amount || 0,
          nextPaymentDate: nextPayment?.dueDate,
          currentBalance: totalPending + totalOverdue,
          subscriptionStatus: mockSubscription.status
        });

        // Mock payment methods
        setPaymentMethods([
          {
            id: 'pm_1',
            patientId,
            type: 'card',
            isDefault: true,
            isActive: true,
            displayName: 'Visa terminada en 4242',
            lastFour: '4242',
            expiryMonth: 12,
            expiryYear: 2025,
            brand: 'visa',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'pm_2',
            patientId,
            type: 'paypal',
            isDefault: false,
            isActive: true,
            displayName: 'PayPal - usuario@email.com',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
      } else {
        // Producción: usar Firebase
        const [paymentsData, summaryData, methodsData, subscriptionData] = await Promise.all([
          PaymentService.getPatientPayments(centerId, patientId, filters),
          PaymentService.getPaymentSummary(centerId, patientId),
          PaymentService.getPaymentMethods(centerId, patientId),
          PaymentService.getActiveSubscription(centerId, patientId)
        ]);

        setPayments(paymentsData);
        setPaymentSummary(summaryData);
        setPaymentMethods(methodsData);
        setSubscription(subscriptionData);
      }
    } catch (err) {
      console.error('Error loading payment data:', err);
      setError('Error al cargar los datos de pagos');
    } finally {
      setLoading(false);
    }
  }, [centerId, patientId, filters]);

  // ============================================================================
  // PROCESAR PAGO
  // ============================================================================
  const processPayment = useCallback(async (request: PaymentProcessRequest): Promise<PaymentProcessResponse> => {
    if (!centerId || !patientId) {
      return {
        success: false,
        status: 'failed',
        message: 'Datos de usuario no disponibles'
      };
    }

    try {
      const response = await PaymentService.processPayment(centerId, patientId, request);
      
      if (response.success) {
        // Recargar datos después del pago exitoso
        await loadPaymentData();
      }
      
      return response;
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Error al procesar el pago'
      };
    }
  }, [centerId, patientId, loadPaymentData]);

  // ============================================================================
  // FILTROS
  // ============================================================================
  const updateFilters = useCallback((newFilters: Partial<PaymentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // ============================================================================
  // UTILIDADES
  // ============================================================================
  const getPaymentStatusColor = useCallback((status: Payment['status']) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'failed': return 'error';
      case 'cancelled': return 'default';
      case 'refunded': return 'info';
      default: return 'default';
    }
  }, []);

  const getPaymentStatusText = useCallback((status: Payment['status']) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'overdue': return 'Vencido';
      case 'failed': return 'Fallido';
      case 'cancelled': return 'Cancelado';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  }, []);

  const formatAmount = useCallback((amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }, []);

  const formatPaymentMethod = useCallback((method: PaymentMethod) => {
    switch (method.type) {
      case 'card':
        return `${method.brand?.toUpperCase()} •••• ${method.lastFour}`;
      case 'paypal':
        return 'PayPal';
      case 'mercadopago':
        return 'MercadoPago';
      case 'bank_transfer':
        return 'Transferencia bancaria';
      case 'cash':
        return 'Efectivo';
      default:
        return method.displayName || method.type;
    }
  }, []);

  // ============================================================================
  // EFECTOS
  // ============================================================================
  useEffect(() => {
    loadPaymentData();
  }, [loadPaymentData]);

  return {
    // Datos
    payments,
    paymentMethods,
    subscription,
    paymentSummary,
    
    // Estados
    loading,
    error,
    filters,
    
    // Acciones
    processPayment,
    updateFilters,
    clearFilters,
    refreshData: loadPaymentData,
    
    // Utilidades
    getPaymentStatusColor,
    getPaymentStatusText,
    formatAmount,
    formatPaymentMethod
  };
};
