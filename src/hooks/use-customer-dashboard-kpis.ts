import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, setDoc, Timestamp, collection, query, where, onSnapshot } from 'firebase/firestore';
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

// Cache time in minutes
const CACHE_EXPIRY_TIME = 30;

export const useDashboardCustomerKpis = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<CustomerKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use refs to store cached data and listeners
  const kpisCache = useRef<{data: CustomerKPIs | null, timestamp: number}>({
    data: null,
    timestamp: 0
  });
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  // Check if cache is valid
  const isCacheValid = useCallback(() => {
    if (!kpisCache.current.data) return false;
    
    const now = Date.now();
    const cacheAge = now - kpisCache.current.timestamp;
    return cacheAge < CACHE_EXPIRY_TIME * 60 * 1000; // Convert minutes to milliseconds
  }, []);

  // Generate KPIs from customers and policies data
  const calculateKpis = useCallback((customers: Customer[], policies: Policy[]): CustomerKPIs => {
    // Get current date and start of current and previous month
    const now = dayjs();
    const startOfCurrentMonth = now.startOf('month').toDate();
    const startOfPreviousMonth = now.subtract(1, 'month').startOf('month').toDate();
    const endOfPreviousMonth = now.startOf('month').subtract(1, 'day').endOf('day').toDate();
    const thirtyDaysFromNow = now.add(30, 'day').toDate();

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
    
    // Create KPIs object
    return {
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
  }, []);

  // Fetch KPIs from Firestore
  const fetchKpisFromFirestore = useCallback(async (userId: string): Promise<CustomerKPIs | null> => {
    try {
      const kpisDocRef = doc(db, `users/${userId}/dashboard/customerKpis`);
      const kpisDoc = await getDoc(kpisDocRef);
      
      if (kpisDoc.exists()) {
        return kpisDoc.data() as CustomerKPIs;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching KPIs from Firestore:', error);
      return null;
    }
  }, []);

  // Save KPIs to Firestore
  const saveKpisToFirestore = useCallback(async (userId: string, kpisData: CustomerKPIs): Promise<boolean> => {
    try {
      const kpisDocRef = doc(db, `users/${userId}/dashboard/customerKpis`);
      await setDoc(kpisDocRef, kpisData);
      return true;
    } catch (error) {
      console.error('Error saving KPIs to Firestore:', error);
      return false;
    }
  }, []);

  // Setup real-time listeners for customers and policies
  const setupRealtimeListeners = useCallback((userId: string, callback: (kpis: CustomerKPIs) => void) => {
    // Create queries for customers and policies
    const customersQuery = query(collection(db, 'customers'), where('userId', '==', userId));
    const policiesQuery = query(collection(db, 'policies'), where('userId', '==', userId));
    
    // Store customers and policies data
    let customers: Customer[] = [];
    let policies: Policy[] = [];
    let customersLoaded = false;
    let policiesLoaded = false;
    
    // Function to calculate KPIs when both data sets are loaded
    const calculateAndCallback = () => {
      if (customersLoaded && policiesLoaded) {
        const kpisData = calculateKpis(customers, policies);
        callback(kpisData);
        
        // Update cache
        kpisCache.current = {
          data: kpisData,
          timestamp: Date.now()
        };
        
        // Save to Firestore in the background
        saveKpisToFirestore(userId, kpisData).catch(err => 
          console.error('Error saving KPIs to Firestore:', err)
        );
      }
    };
    
    // Setup customers listener
    const unsubscribeCustomers = onSnapshot(customersQuery, (snapshot) => {
      customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
      customersLoaded = true;
      calculateAndCallback();
    }, (error) => {
      console.error('Error in customers listener:', error);
      setError('Error loading customer data');
    });
    
    // Setup policies listener
    const unsubscribePolicies = onSnapshot(policiesQuery, (snapshot) => {
      policies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Policy));
      policiesLoaded = true;
      calculateAndCallback();
    }, (error) => {
      console.error('Error in policies listener:', error);
      setError('Error loading policy data');
    });
    
    // Return combined unsubscribe function
    return () => {
      unsubscribeCustomers();
      unsubscribePolicies();
    };
  }, [calculateKpis, saveKpisToFirestore]);

  // Generate KPIs with optimized approach
  const generateKpis = useCallback(async (forceRefresh = false): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }
    
    try {
      setIsRefreshing(true);
      
      // Check cache first if not forcing refresh
      if (!forceRefresh && isCacheValid()) {
        setKpis(kpisCache.current.data);
        setLoading(false);
        setIsRefreshing(false);
        return true;
      }
      
      // If we're not already listening for real-time updates, set up listeners
      if (!unsubscribeRef.current) {
        const unsubscribe = setupRealtimeListeners(user.uid, (newKpis) => {
          setKpis(newKpis);
          setLoading(false);
          setIsRefreshing(false);
        });
        
        unsubscribeRef.current = unsubscribe;
      } else {
        // If we already have listeners, try to get from Firestore first
        const firestoreKpis = await fetchKpisFromFirestore(user.uid);
        
        if (firestoreKpis) {
          setKpis(firestoreKpis);
          
          // Update cache
          kpisCache.current = {
            data: firestoreKpis,
            timestamp: Date.now()
          };
        }
        
        setLoading(false);
        setIsRefreshing(false);
      }
      
      return true;
    } catch (error) {
      console.error('Error generating KPIs:', error);
      setError('Error generating customer KPIs');
      setLoading(false);
      setIsRefreshing(false);
      return false;
    }
  }, [user, isCacheValid, setupRealtimeListeners, fetchKpisFromFirestore]);

  // Public method to update KPIs
  const updateCustomerKpis = useCallback(async (): Promise<boolean> => {
    return generateKpis(true); // Force refresh
  }, [generateKpis]);

  // Initial load
  useEffect(() => {
    generateKpis();
    
    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [generateKpis]);

  return {
    kpis,
    loading,
    isRefreshing,
    error,
    updateCustomerKpis
  };
};