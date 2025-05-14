import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp, 
  onSnapshot,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { Customer } from '@/types/customer';

export type CustomerStatus = 'active' | 'inactive' | 'lead';
export type CustomerType = 'individual' | 'business' | 'family';

export type CustomerContact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
};

export type CustomerNote = {
  id: string;
  content: string;
  createdAt: Timestamp | Date;
  createdBy: string;
  createdByName?: string;
};

export type CustomerPolicy = {
  id: string;
  policyNumber: string;
  type?: CustomerType[];
  company: string;
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  premium: number;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
};

export type CustomerFilters = {
  search?: string;
  status?: CustomerStatus[];
  type?: CustomerType[];
  gender?: ('male' | 'female' | 'other')[];
  civilStatus?: ('single' | 'married' | 'divorced' | 'widowed')[];
  riskLevel?: ('low' | 'medium' | 'high')[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasPolicy?: boolean;
  tags?: string[];
};

export const useCustomers = () => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'createdAt',
    direction: 'desc'
  });
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  // Obtener clientes
  const fetchCustomers = useCallback(async () => {
    if (!user) {
      setCustomers([]);
      setFilteredCustomers([]);
      setLoading(false);
      return () => {};
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const customersRef = collection(db, 'customers');
      const q = query(
        customersRef,
        where('createdBy', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedCustomers: Customer[] = [];
        
        snapshot.forEach((doc) => {
          fetchedCustomers.push({
            id: doc.id,
            ...doc.data()
          } as Customer);
        });
        
        setCustomers(fetchedCustomers);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching customers:', err);
        setError('Error al cargar los clientes. Por favor, intenta de nuevo.');
        setLoading(false);
      });
      
      return unsubscribe;
    } catch (err) {
      console.error('Error setting up customers listener:', err);
      setError('Error al configurar el listener de clientes. Por favor, intenta de nuevo.');
      setLoading(false);
      return () => {};
    }
  }, [user]);
  
  // Cargar más clientes (paginación)
  const fetchMoreCustomers = useCallback(async (itemsPerPage: number = 20) => {
    if (!user || !hasMore || loading) return;
    
    try {
      setLoading(true);
      
      const customersRef = collection(db, 'customers');
      let q;
      
      if (lastVisible) {
        q = query(
          customersRef,
          where('createdBy', '==', user.uid),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(itemsPerPage)
        );
      } else {
        q = query(
          customersRef,
          where('createdBy', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(itemsPerPage)
        );
      }
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);
      
      const newCustomers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Customer));
      
      setCustomers(prev => [...prev, ...newCustomers]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching more customers:', err);
      setError('Error al cargar más clientes. Por favor, intenta de nuevo.');
      setLoading(false);
    }
  }, [user, hasMore, lastVisible, loading]);
  
  // Aplicar filtros
  useEffect(() => {
    if (!customers.length) {
      setFilteredCustomers([]);
      return;
    }
    
    let result = [...customers];
    
    // Filtro de búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(customer => 
        customer.fullName.toLowerCase().includes(searchTerm) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
        (customer.phone && customer.phone.toLowerCase().includes(searchTerm)) ||
        (customer.company && customer.company.toLowerCase().includes(searchTerm)) ||
        (customer.city && customer.city.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filtro de estado
    if (filters.status && filters.status.length > 0) {
      result = result.filter(customer => filters.status?.includes(customer.status));
    }
    
    // Filtro de tipo
    if (filters.type && filters.type.length > 0) {
      result = result.filter(customer => customer.type && filters.type?.includes(customer.type));
    }
    
    // Filtro de género
    if (filters.gender && filters.gender.length > 0) {
      result = result.filter(customer => customer.gender && filters.gender?.includes(customer.gender as 'male' | 'female' | 'other'));
    }
    
    // Filtro de estado civil
    if (filters.civilStatus && filters.civilStatus.length > 0) {
      result = result.filter(customer => customer.civilStatus && filters.civilStatus?.includes(customer.civilStatus as 'single' | 'married' | 'divorced' | 'widowed'));
    }
    
    // Filtro de nivel de riesgo
    if (filters.riskLevel && filters.riskLevel.length > 0) {
      result = result.filter(customer => customer.riskLevel && filters.riskLevel?.includes(customer.riskLevel as 'low' | 'medium' | 'high'));
    }
    
    // Filtro de rango de fechas
    if (filters.dateRange) {
      result = result.filter(customer => {
        if (!customer.registeredAt) return false;
        
        const registeredDate = customer.registeredAt.toDate();
        return registeredDate >= filters.dateRange!.start && registeredDate <= filters.dateRange!.end;
      });
    }
    
    // Filtro de clientes con pólizas
    if (filters.hasPolicy) {
      result = result.filter(customer => customer.policies && customer.policies.length > 0);
    }
    
    // Filtro de etiquetas
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter(customer =>
        customer.tags?.some(customerTag =>
          filters.tags?.includes(customerTag.id)
        )
      );
    }
    
    setFilteredCustomers(result);
  }, [customers, filters]);
  
  // Obtener cliente seleccionado
  useEffect(() => {
    if (selectedCustomerId) {
      const customer = customers.find(c => c.id === selectedCustomerId) || null;
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer(null);
    }
  }, [selectedCustomerId, customers]);
  // Iniciar la carga de clientes
  useEffect(() => {
    let unsubscribeFn: (() => void) | undefined;
    
    fetchCustomers().then(unsubscribe => {
      unsubscribeFn = unsubscribe;
    });
    
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [fetchCustomers]);
  
  // Crear cliente
  const createCustomer = useCallback(async (customerData: Omit<Customer, 'id' | 'createdAt' | 'createdBy'>) => {
    if (!user) return false;
    
    try {
      setError(null);
      
      const newCustomer = {
        ...customerData,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      };
      
      await addDoc(collection(db, 'customers'), newCustomer);
      return true;
    } catch (err) {
      console.error('Error creating customer:', err);
      setError('Error al crear el cliente. Por favor, intenta de nuevo.');
      return false;
    }
  }, [user]);
  
  // Actualizar cliente
  const updateCustomer = useCallback(async (customerId: string, customerData: Partial<Customer>) => {
    if (!user) return false;
    
    try {
      setError(null);
      
      const customerRef = doc(db, 'customers', customerId);
      await updateDoc(customerRef, {
        ...customerData,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      
      return true;
    } catch (err) {
      console.error('Error updating customer:', err);
      setError('Error al actualizar el cliente. Por favor, intenta de nuevo.');
      return false;
    }
  }, [user]);
  
  // Eliminar cliente
  const deleteCustomer = useCallback(async (customerId: string) => {
    if (!user) return false;
    
    try {
      setError(null);
      
      const customerRef = doc(db, 'customers', customerId);
      await deleteDoc(customerRef);
      
      return true;
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Error al eliminar el cliente. Por favor, intenta de nuevo.');
      return false;
    }
  }, [user]);
  
  // Cambiar estado del cliente
  const changeCustomerStatus = useCallback(async (customerId: string, status: CustomerStatus) => {
    return updateCustomer(customerId, { status });
  }, [updateCustomer]);
  
  // Refrescar clientes
  const refreshCustomers = useCallback(async () => {
    setLastVisible(null);
    setHasMore(true);
    return fetchCustomers();
  }, [fetchCustomers]);
  
  // Obtener cliente por ID
  const getCustomerById = useCallback(async (customerId: string) => {
    if (!user) return null;
    
    try {
      const customerRef = doc(db, 'customers', customerId);
      const customerDoc = await getDoc(customerRef);
      
      if (customerDoc.exists()) {
        return {
          id: customerDoc.id,
          ...customerDoc.data()
        } as Customer;
      }
      
      return null;
    } catch (err) {
      console.error('Error getting customer by ID:', err);
      setError('Error al obtener el cliente. Por favor, intenta de nuevo.');
      return null;
    }
  }, [user]);
  
  // Añadir póliza a cliente
  const addPolicyToCustomer = useCallback(async (customerId: string, policy: Omit<CustomerPolicy, 'id'>) => {
    if (!user) return false;
    
    try {
      const customerRef = doc(db, 'customers', customerId);
      const customerDoc = await getDoc(customerRef);
      
      if (!customerDoc.exists()) {
        setError('Cliente no encontrado.');
        return false;
      }
      
      const customerData = customerDoc.data();
      const policies = customerData.policies || [];
      
      const newPolicy = {
        ...policy,
        id: `policy_${Date.now()}`,
      };
      
      await updateDoc(customerRef, {
        policies: [...policies, newPolicy],
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      
      return true;
    } catch (err) {
      console.error('Error adding policy to customer:', err);
      setError('Error al añadir póliza al cliente. Por favor, intenta de nuevo.');
      return false;
    }
  }, [user]);
  
  return {
    customers,
    filteredCustomers,
    loading,
    error,
    filters,
    setFilters,
    selectedCustomer,
    setSelectedCustomerId,
    hasMore,
    fetchCustomers,
    fetchMoreCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    changeCustomerStatus,
    refreshCustomers,
    getCustomerById,
    addPolicyToCustomer,
    sortConfig,
    setSortConfig,
  };
};