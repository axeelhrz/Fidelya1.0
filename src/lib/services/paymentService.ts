import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Payment, 
  PaymentMethod, 
  Subscription, 
  Invoice, 
  PaymentSummary,
  PaymentFilters,
  PaymentProcessRequest,
  PaymentProcessResponse,
  PaymentStatus
} from '../../types/payments';

const COLLECTIONS = {
  CENTERS: 'centers',
  PATIENTS: 'patients',
  PAYMENTS: 'payments',
  PAYMENT_METHODS: 'paymentMethods',
  SUBSCRIPTIONS: 'subscriptions',
  INVOICES: 'invoices'
};

export class PaymentService {
  // ============================================================================
  // OBTENER HISTORIAL DE PAGOS
  // ============================================================================
  static async getPatientPayments(
    centerId: string, 
    patientId: string, 
    filters?: PaymentFilters
  ): Promise<Payment[]> {
    try {
      let q = query(
        collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.PAYMENTS),
        orderBy('createdAt', 'desc')
      );

      if (filters?.status && filters.status.length > 0) {
        q = query(q, where('status', 'in', filters.status));
      }

      if (filters?.paymentMethod && filters.paymentMethod.length > 0) {
        q = query(q, where('paymentMethod', 'in', filters.paymentMethod));
      }

      const snapshot = await getDocs(q);
      const payments: Payment[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        payments.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate(),
          paidDate: data.paidDate?.toDate()
        } as Payment);
      });

      return payments;
    } catch (error) {
      console.error('Error getting patient payments:', error);
      throw error;
    }
  }

  // ============================================================================
  // OBTENER RESUMEN DE PAGOS
  // ============================================================================
  static async getPaymentSummary(centerId: string, patientId: string): Promise<PaymentSummary> {
    try {
      const payments = await this.getPatientPayments(centerId, patientId);
      const subscription = await this.getActiveSubscription(centerId, patientId);

      const totalPaid = payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0);

      const totalPending = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);

      const totalOverdue = payments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);

      const nextPayment = payments
        .filter(p => p.status === 'pending' && p.dueDate)
        .sort((a, b) => (a.dueDate!.getTime() - b.dueDate!.getTime()))[0];

      return {
        totalPaid,
        totalPending,
        totalOverdue,
        nextPaymentAmount: nextPayment?.amount || 0,
        nextPaymentDate: nextPayment?.dueDate,
        currentBalance: totalPending + totalOverdue,
        subscriptionStatus: subscription?.status
      };
    } catch (error) {
      console.error('Error getting payment summary:', error);
      throw error;
    }
  }

  // ============================================================================
  // MÉTODOS DE PAGO
  // ============================================================================
  static async getPaymentMethods(centerId: string, patientId: string): Promise<PaymentMethod[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.PAYMENT_METHODS),
        where('isActive', '==', true),
        orderBy('isDefault', 'desc')
      );

      const snapshot = await getDocs(q);
      const methods: PaymentMethod[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        methods.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as PaymentMethod);
      });

      return methods;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  // ============================================================================
  // SUSCRIPCIONES
  // ============================================================================
  static async getActiveSubscription(centerId: string, patientId: string): Promise<Subscription | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.SUBSCRIPTIONS),
        where('status', 'in', ['active', 'trialing']),
        limit(1)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;

      const doc = snapshot.docs[0];
      const data = doc.data() as DocumentData;

      return {
        id: doc.id,
        ...data,
        currentPeriodStart: data.currentPeriodStart?.toDate() || new Date(),
        currentPeriodEnd: data.currentPeriodEnd?.toDate() || new Date(),
        nextBillingDate: data.nextBillingDate?.toDate() || new Date(),
        trialEnd: data.trialEnd?.toDate(),
        cancelledAt: data.cancelledAt?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Subscription;
    } catch (error) {
      console.error('Error getting active subscription:', error);
      throw error;
    }
  }

  // ============================================================================
  // PROCESAR PAGO
  // ============================================================================
  static async processPayment(
    centerId: string, 
    patientId: string, 
    request: PaymentProcessRequest
  ): Promise<PaymentProcessResponse> {
    try {
      // Simular procesamiento de pago (en producción integrar con Stripe/PayPal/etc.)
      const paymentData = {
        patientId,
        centerId,
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        status: 'pending' as PaymentStatus,
        paymentMethod: 'card' as const,
        transactionId: `txn_${Date.now()}`,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        metadata: request.metadata || {}
      };

      const docRef = await addDoc(
        collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.PAYMENTS),
        paymentData
      );

      // Simular éxito del pago
      await updateDoc(docRef, {
        status: 'paid',
        paidDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return {
        success: true,
        paymentId: docRef.id,
        transactionId: paymentData.transactionId,
        status: 'paid',
        message: 'Pago procesado exitosamente'
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Error al procesar el pago'
      };
    }
  }

  // ============================================================================
  // FACTURAS
  // ============================================================================
  static async getInvoice(centerId: string, patientId: string, invoiceId: string): Promise<Invoice | null> {
    try {
      const docRef = doc(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.INVOICES, invoiceId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data() as DocumentData;
      return {
        id: docSnap.id,
        ...data,
        issueDate: data.issueDate?.toDate() || new Date(),
        dueDate: data.dueDate?.toDate() || new Date(),
        paidDate: data.paidDate?.toDate(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as Invoice;
    } catch (error) {
      console.error('Error getting invoice:', error);
      throw error;
    }
  }

  // ============================================================================
  // DATOS MOCK PARA DESARROLLO
  // ============================================================================
  static getMockPayments(patientId: string): Payment[] {
    const now = new Date();
    return [
      {
        id: 'pay_1',
        patientId,
        centerId: 'center1',
        amount: 80,
        currency: 'EUR',
        description: 'Sesión individual - Terapia cognitiva',
        status: 'paid',
        paymentMethod: 'card',
        transactionId: 'txn_123456789',
        invoiceNumber: 'INV-2024-001',
        invoiceUrl: '/invoices/inv-2024-001.pdf',
        sessionId: 'session_1',
        paidDate: new Date(now.getTime() - 86400000 * 5),
        createdAt: new Date(now.getTime() - 86400000 * 5),
        updatedAt: new Date(now.getTime() - 86400000 * 5)
      },
      {
        id: 'pay_2',
        patientId,
        centerId: 'center1',
        amount: 120,
        currency: 'EUR',
        description: 'Mensualidad - Plan Premium',
        status: 'pending',
        paymentMethod: 'paypal',
        dueDate: new Date(now.getTime() + 86400000 * 3),
        createdAt: new Date(now.getTime() - 86400000 * 25),
        updatedAt: new Date(now.getTime() - 86400000 * 25)
      },
      {
        id: 'pay_3',
        patientId,
        centerId: 'center1',
        amount: 80,
        currency: 'EUR',
        description: 'Sesión individual - Seguimiento',
        status: 'overdue',
        paymentMethod: 'card',
        dueDate: new Date(now.getTime() - 86400000 * 2),
        createdAt: new Date(now.getTime() - 86400000 * 12),
        updatedAt: new Date(now.getTime() - 86400000 * 12)
      }
    ];
  }

  static getMockSubscription(patientId: string): Subscription {
    const now = new Date();
    return {
      id: 'sub_1',
      patientId,
      centerId: 'center1',
      planName: 'Plan Premium',
      planDescription: 'Acceso completo a terapia individual y recursos',
      status: 'active',
      amount: 120,
      currency: 'EUR',
      interval: 'monthly',
      currentPeriodStart: new Date(now.getFullYear(), now.getMonth(), 1),
      currentPeriodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      nextBillingDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      paymentMethodId: 'pm_1',
      cancelAtPeriodEnd: false,
      createdAt: new Date(now.getTime() - 86400000 * 30),
      updatedAt: new Date(now.getTime() - 86400000 * 1)
    };
  }
}
