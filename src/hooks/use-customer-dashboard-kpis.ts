import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, setDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Customer } from '@/types/customer';
import { Policy } from '@/types/policy';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.locale('es');
dayjs.tz.setDefault('Europe/Madrid');

export interface CustomerKPIs {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  leadCustomers: number;
  newCustomersThisMonth: number;
  customersWithPolicies: number;
  customersWithActivePolicies: number;
  customersWithExpiredPolicies: number;
  customersWithRenewingPolicies: number;
  customersByType: Record<string, number>;
  customersByRiskLevel: Record<string, number>;
  customersByGender: Record<string, number>;
  customersByCivilStatus: Record<string, number>;
  monthlyChanges: {
    customers: number;
    active: number;
    leads: number;
  };
  lastUpdated: Timestamp;
}

export const useDashboardCustomerKpis = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<CustomerKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateCustomerKpis = useCallback(async (userId: string): Promise<CustomerKPIs | null> => {
    try {
      console.log(`Generating customer KPIs for user: ${userId}`);
      
      // Get current date and start of current and previous month
      const now = dayjs();
      const startOfCurrentMonth = now.startOf('month').toDate();
      const startOfPreviousMonth = now.subtract(1, 'month').startOf('month').toDate();
      const endOfPreviousMonth = now.startOf('month').subtract(1, 'day').endOf('day').toDate();
      const thirtyDaysFromNow = now.add(30, 'day').toDate();

      // 1. Get all customers
      const customersRef = collection(db, 'customers');
      const customersQuery = query(customersRef, where('userId', '==', userId));
      const customersSnapshot = await getDocs(customersQuery);
      
      const customers: Customer[] = [];
      customersSnapshot.forEach(doc => {
        customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
      console.log(`Customers retrieved for ${userId}: ${customers.length}`);

      // 2. Get all policies
      const policiesRef = collection(db, 'policies');
      const policiesQuery = query(policiesRef, where('userId', '==', userId));
      const policiesSnapshot = await getDocs(policiesQuery);
      
      const policies: Policy[] = [];
      policiesSnapshot.forEach(doc => {
        policies.push({ id: doc.id, ...doc.data() } as Policy);
      });
      console.log(`Policies retrieved for ${userId}: ${policies.length}`);

      // 3. Calculate KPIs
      
      // Basic customer counts
      const totalCustomers = customers.length;
      const activeCustomers = customers.filter(c => c.status === 'active').length;
      const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
      const leadCustomers = customers.filter(c => c.status === 'lead').length;
      
      // New customers this month
      const newCustomersThisMonth = customers.filter(customer => {
        const createdAt = customer.createdAt instanceof Timestamp 
          ? customer.createdAt.toDate() 
          : new Date(customer.createdAt || Date.now());
        return createdAt >= startOfCurrentMonth;
      }).length;
      
      // Customers with policies
      const customerPoliciesMap = new Map<string, Policy[]>();
      
      // Group policies by customer ID
      policies.forEach(policy => {
        if (policy.customerId) {
          const customerPolicies = customerPoliciesMap.get(policy.customerId) || [];
          customerPolicies.push(policy);
          customerPoliciesMap.set(policy.customerId, customerPolicies);
        }
      });
      
      const customersWithPolicies = customerPoliciesMap.size;
      
      // Customers with active, expired, or renewing policies
      let customersWithActivePolicies = 0;
      let customersWithExpiredPolicies = 0;
      let customersWithRenewingPolicies = 0;
      
      customerPoliciesMap.forEach((customerPolicies) => {
        const hasActivePolicies = customerPolicies.some(p => p.status === 'active');
        const hasExpiredPolicies = customerPolicies.some(p => p.status === 'expired');
        const hasRenewingPolicies = customerPolicies.some(p => {
          const endDate = p.endDate?.toDate();
          return p.status === 'active' && endDate && endDate <= thirtyDaysFromNow && endDate >= now.toDate();
        });
        
        if (hasActivePolicies) customersWithActivePolicies++;
        if (hasExpiredPolicies) customersWithExpiredPolicies++;
        if (hasRenewingPolicies) customersWithRenewingPolicies++;
      });
      
      // Customers by type, risk level, gender, and civil status
      const customersByType: Record<string, number> = {};
      const customersByRiskLevel: Record<string, number> = {};
      const customersByGender: Record<string, number> = {};
      const customersByCivilStatus: Record<string, number> = {};
      
      customers.forEach(customer => {
        // By type
        if (customer.type) {
          customersByType[customer.type] = (customersByType[customer.type] || 0) + 1;
        }
        
        // By risk level
        if (customer.riskLevel) {
          customersByRiskLevel[customer.riskLevel] = (customersByRiskLevel[customer.riskLevel] || 0) + 1;
        }
        
        // By gender
        if (customer.gender) {
          customersByGender[customer.gender] = (customersByGender[customer.gender] || 0) + 1;
        }
        
        // By civil status
        if (customer.civilStatus) {
          customersByCivilStatus[customer.civilStatus] = (customersByCivilStatus[customer.civilStatus] || 0) + 1;
        }
      });
      
      // Calculate monthly changes
      
      // Customers created in the previous month
      const customersLastMonth = customers.filter(customer => {
        const createdAt = customer.createdAt instanceof Timestamp 
          ? customer.createdAt.toDate() 
          : new Date(customer.createdAt || Date.now());
        return createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
      }).length;
      
      // Active customers last month
      const activeCustomersLastMonth = customers.filter(customer => {
        const createdAt = customer.createdAt instanceof Timestamp 
          ? customer.createdAt.toDate() 
          : new Date(customer.createdAt || Date.now());
        return customer.status === 'active' && createdAt <= endOfPreviousMonth;
      }).length;
      
      // Lead customers last month
      const leadCustomersLastMonth = customers.filter(customer => {
        const createdAt = customer.createdAt instanceof Timestamp 
          ? customer.createdAt.toDate() 
          : new Date(customer.createdAt || Date.now());
        return customer.status === 'lead' && createdAt <= endOfPreviousMonth;
      }).length;
      
      const monthlyChanges = {
        customers: newCustomersThisMonth - customersLastMonth,
        active: activeCustomers - activeCustomersLastMonth,
        leads: leadCustomers - leadCustomersLastMonth
      };
      
      // 4. Create KPIs object
      const customerKpis: CustomerKPIs = {
        totalCustomers,
        activeCustomers,
        inactiveCustomers,
        leadCustomers,
        newCustomersThisMonth,
        customersWithPolicies,
        customersWithActivePolicies,
        customersWithExpiredPolicies,
        customersWithRenewingPolicies,
        customersByType,
        customersByRiskLevel,
        customersByGender,
        customersByCivilStatus,
        monthlyChanges,
        lastUpdated: Timestamp.now()
      };
      
      // 5. Save KPIs to Firestore
      const kpisDocRef = doc(db, `users/${userId}/dashboard/customerKpis`);
      await setDoc(kpisDocRef, customerKpis);
      console.log(`Customer KPIs saved for user ${userId}`);
      
      return customerKpis;
    } catch (error) {
      console.error('Error generating customer KPIs:', error);
      return null;
    }
  }, []);

  const getCustomerKpis = useCallback(async (userId: string): Promise<CustomerKPIs | null> => {
    try {
      const kpisDocRef = doc(db, `users/${userId}/dashboard/customerKpis`);
      const kpisDoc = await getDoc(kpisDocRef);
      
      if (kpisDoc.exists()) {
        return kpisDoc.data() as CustomerKPIs;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting customer KPIs:', error);
      return null;
    }
  }, []);

  const shouldUpdateCustomerKpis = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const kpis = await getCustomerKpis(userId);
      
      if (!kpis) {
        return true; // If KPIs don't exist, they should be generated
      }
      
      const lastUpdated = kpis.lastUpdated.toDate();
      const now = new Date();
      const hoursSinceLastUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      
      return hoursSinceLastUpdate >= 24; // Update if more than 24 hours have passed
    } catch (error) {
      console.error('Error checking if customer KPIs should be updated:', error);
      return true; // In case of error, try to update
    }
  }, [getCustomerKpis]);

  const updateCustomerKpis = useCallback(async (): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate new KPIs
      const result = await generateCustomerKpis(user.uid);
      
      if (result) {
        setKpis(result);
        return true;
      }
      
      setError('Could not update customer KPIs');
      return false;
    } catch (err) {
      console.error('Error updating customer KPIs:', err);
      setError('Error updating customer KPIs');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, generateCustomerKpis]);

  // Load KPIs on component mount
  useEffect(() => {
    const loadKpis = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Check if KPIs exist and are up to date
        const shouldUpdate = await shouldUpdateCustomerKpis(user.uid);
        
        if (shouldUpdate) {
          // Generate new KPIs
          const newKpis = await generateCustomerKpis(user.uid);
          if (newKpis) {
            setKpis(newKpis);
          } else {
            setError('Could not generate customer KPIs');
          }
        } else {
          // Get existing KPIs
          const existingKpis = await getCustomerKpis(user.uid);
          if (existingKpis) {
            setKpis(existingKpis);
          } else {
            setError('Could not retrieve customer KPIs');
          }
        }
      } catch (err) {
        console.error('Error loading customer KPIs:', err);
        setError('Error loading customer KPIs');
      } finally {
        setLoading(false);
      }
    };

    loadKpis();
  }, [user, shouldUpdateCustomerKpis, generateCustomerKpis, getCustomerKpis]);

  return {
    kpis,
    loading,
    error,
    updateCustomerKpis
  };
};