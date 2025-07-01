import { BaseFirebaseService } from './firebaseService';
import { COLLECTIONS } from '@/lib/firebase';

// Define FirebaseDocument interface if not imported from elsewhere
export interface FirebaseDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}
export interface Session extends FirebaseDocument {
  patientId: string;
  therapistId: string;
  date: Date;
  duration: number;
  type: 'individual' | 'group' | 'family' | 'couple';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  cost: number;
  paid: boolean;
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'insurance';
  notes?: string;
  patientName?: string;
  therapistName?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Payment extends FirebaseDocument {
  sessionId?: string;
  patientId: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  method: 'cash' | 'card' | 'transfer' | 'insurance';
  reference?: string;
  notes?: string;
  patientName?: string;
  sessionType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense extends FirebaseDocument {
  category: string;
  subcategory?: string;
  amount: number;
  date: Date;
  description: string;
  vendor?: string;
  receipt?: string;
  approved: boolean;
  approvedBy?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  averageGrowth: number;
  pendingPayments: number;
  overduePayments: number;
  totalSessions: number;
  avgSessionValue: number;
  monthlyData: MonthlyFinancialData[];
  expensesBreakdown: ExpenseBreakdown[];
  paymentsData: Payment[];
}

export interface MonthlyFinancialData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  growth: number;
  sessions: number;
  avgSessionCost: number;
}

export interface ExpenseBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

// Servicios especializados
class SessionService extends BaseFirebaseService<Session> {
  constructor() {
    super(COLLECTIONS.SESSIONS);
  }

  async getCompletedSessions(centerId: string, startDate?: Date, endDate?: Date): Promise<Session[]> {
    const whereConditions: { field: string; operator: import('firebase/firestore').WhereFilterOp; value: unknown; }[] = [
      { field: 'status', operator: '==', value: 'completed' }
    ];
    
    if (startDate) {
      whereConditions.push({ field: 'date', operator: '>=', value: startDate.toISOString() });
    }
    
    if (endDate) {
      whereConditions.push({ field: 'date', operator: '<=', value: endDate.toISOString() });
    }

    return this.getAll(centerId, {
      where: whereConditions,
      orderBy: { field: 'date', direction: 'desc' },
      limit: 500
    });
  }

  async getSessionsByTherapist(centerId: string, therapistId: string): Promise<Session[]> {
    return this.getAll(centerId, {
      where: [{ field: 'therapistId', operator: '==', value: therapistId }],
      orderBy: { field: 'date', direction: 'desc' }
    });
  }

  async getSessionsByPatient(centerId: string, patientId: string): Promise<Session[]> {
    return this.getAll(centerId, {
      where: [{ field: 'patientId', operator: '==', value: patientId }],
      orderBy: { field: 'date', direction: 'desc' }
    });
  }
}

class PaymentService extends BaseFirebaseService<Payment> {
  constructor() {
    super(COLLECTIONS.PAYMENTS);
  }

  async getPendingPayments(centerId: string): Promise<Payment[]> {
    return this.getAll(centerId, {
      where: [{ field: 'status', operator: 'in', value: ['pending', 'overdue'] }],
      orderBy: { field: 'date', direction: 'desc' }
    });
  }

  async getPaymentsByStatus(centerId: string, status: Payment['status']): Promise<Payment[]> {
    return this.getAll(centerId, {
      where: [{ field: 'status', operator: '==', value: status }],
      orderBy: { field: 'date', direction: 'desc' }
    });
  }
}

class ExpenseService extends BaseFirebaseService<Expense> {
  constructor() {
    super(COLLECTIONS.EXPENSES);
  }

  async getExpensesByCategory(centerId: string, category: string): Promise<Expense[]> {
    return this.getAll(centerId, {
      where: [{ field: 'category', operator: '==', value: category }],
      orderBy: { field: 'date', direction: 'desc' }
    });
  }

  async getExpensesByDateRange(centerId: string, startDate: Date, endDate: Date): Promise<Expense[]> {
    return this.getAll(centerId, {
      where: [
        { field: 'date', operator: '>=', value: startDate },
        { field: 'date', operator: '<=', value: endDate }
      ],
      orderBy: { field: 'date', direction: 'desc' }
    });
  }
}

// Servicio principal para datos financieros
export class FinancialService {
  private sessionService = new SessionService();
  private paymentService = new PaymentService();
  private expenseService = new ExpenseService();

  async getFinancialSummary(centerId: string, months: number = 6): Promise<FinancialSummary> {
    try {
      // Calcular fechas
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      // Obtener datos en paralelo
      const [sessions, payments, expenses] = await Promise.all([
        this.sessionService.getCompletedSessions(centerId, startDate, endDate),
        this.paymentService.getAll(centerId, { 
          orderBy: { field: 'date', direction: 'desc' },
          limit: 200 
        }),
        this.expenseService.getExpensesByDateRange(centerId, startDate, endDate)
      ]);

      // Procesar datos
      const monthlyData = this.processMonthlyData(sessions, expenses);
      const expensesBreakdown = this.processExpensesBreakdown(expenses);
      const totalStats = this.calculateTotalStats(sessions, payments, expenses);

      return {
        ...totalStats,
        monthlyData,
        expensesBreakdown,
        paymentsData: payments
      };
    } catch (error) {
      console.error('Error getting financial summary:', error);
      throw error;
    }
  }

  private processMonthlyData(sessions: Session[], expenses: Expense[]): MonthlyFinancialData[] {
    const monthlyMap = new Map<string, MonthlyFinancialData>();

    // Procesar sesiones por mes
    sessions.forEach(session => {
      const monthKey = `${session.date.getFullYear()}-${String(session.date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          period: monthKey,
          revenue: 0,
          expenses: 0,
          profit: 0,
          growth: 0,
          sessions: 0,
          avgSessionCost: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      monthData.revenue += session.cost || 0;
      monthData.sessions += 1;
    });

    // Procesar gastos por mes
    expenses.forEach(expense => {
      const monthKey = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          period: monthKey,
          revenue: 0,
          expenses: 0,
          profit: 0,
          growth: 0,
          sessions: 0,
          avgSessionCost: 0
        });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      monthData.expenses += expense.amount || 0;
    });

    // Calcular promedios y beneficios
    const result = Array.from(monthlyMap.values()).map(monthData => {
      monthData.avgSessionCost = monthData.sessions > 0 ? monthData.revenue / monthData.sessions : 0;
      monthData.profit = monthData.revenue - monthData.expenses;
      return monthData;
    });

    // Calcular crecimiento
    result.sort((a, b) => a.period.localeCompare(b.period));
    for (let i = 1; i < result.length; i++) {
      const current = result[i];
      const previous = result[i - 1];
      if (previous.revenue > 0) {
        current.growth = ((current.revenue - previous.revenue) / previous.revenue) * 100;
      }
    }

    return result;
  }

  private processExpensesBreakdown(expenses: Expense[]): ExpenseBreakdown[] {
    const categoryMap = new Map<string, number>();
    let totalExpenses = 0;

    expenses.forEach(expense => {
      const category = expense.category || 'Otros';
      const amount = expense.amount || 0;
      
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
      totalExpenses += amount;
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'];
    let colorIndex = 0;

    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      color: colors[colorIndex++ % colors.length]
    }));
  }

  private calculateTotalStats(sessions: Session[], payments: Payment[], expenses: Expense[]) {
    const totalRevenue = sessions.reduce((sum, session) => sum + (session.cost || 0), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const totalProfit = totalRevenue - totalExpenses;
    
    const pendingPayments = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const overduePayments = payments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Calcular crecimiento promedio
    const recentSessions = sessions.filter(session => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return session.date >= threeMonthsAgo;
    });

    const monthlyRevenues = new Map<string, number>();
    recentSessions.forEach(session => {
      const monthKey = `${session.date.getFullYear()}-${session.date.getMonth()}`;
      monthlyRevenues.set(monthKey, (monthlyRevenues.get(monthKey) || 0) + (session.cost || 0));
    });

    const revenueArray = Array.from(monthlyRevenues.values());
    let averageGrowth = 0;
    if (revenueArray.length > 1) {
      let totalGrowth = 0;
      for (let i = 1; i < revenueArray.length; i++) {
        if (revenueArray[i - 1] > 0) {
          totalGrowth += ((revenueArray[i] - revenueArray[i - 1]) / revenueArray[i - 1]) * 100;
        }
      }
      averageGrowth = totalGrowth / (revenueArray.length - 1);
    }
    
    return {
      totalRevenue,
      totalExpenses,
      totalProfit,
      averageGrowth,
      pendingPayments,
      overduePayments,
      totalSessions: sessions.length,
      avgSessionValue: sessions.length > 0 ? totalRevenue / sessions.length : 0
    };
  }

  // Métodos para suscripciones en tiempo real
  subscribeToSessions(centerId: string, callback: (sessions: Session[]) => void): () => void {
    return this.sessionService.subscribeToChanges(centerId, callback, {
      where: [{ field: 'status', operator: '==', value: 'completed' }],
      orderBy: { field: 'date', direction: 'desc' },
      limit: 100
    });
  }

  subscribeToPayments(centerId: string, callback: (payments: Payment[]) => void): () => void {
    return this.paymentService.subscribeToChanges(centerId, callback, {
      orderBy: { field: 'date', direction: 'desc' },
      limit: 50
    });
  }

  subscribeToExpenses(centerId: string, callback: (expenses: Expense[]) => void): () => void {
    return this.expenseService.subscribeToChanges(centerId, callback, {
      orderBy: { field: 'date', direction: 'desc' },
      limit: 50
    });
  }
}

// Exportar instancia del servicio
export const financialService = new FinancialService();
export { SessionService, PaymentService, ExpenseService };
