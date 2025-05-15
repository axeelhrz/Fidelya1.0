import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  getCountFromServer,
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { Policy, PolicyStats, PolicyDocument, PolicyReminder } from '@/types/policy';
import { Customer, CustomerPolicyLink } from '@/types/customer';
import { uploadBytes, getDownloadURL } from 'firebase/storage';

// Define the Filter type locally since it's not exported from '@/types/policy'
interface Filter {
  status: string[];
  type: string[];
  company: string[];
  search: string;
  startDate: Date | null;
  endDate: Date | null;
  minPremium: number | null;
  maxPremium: number | null;
  onlyStarred: boolean;
  isArchived: boolean;
  isStarred: boolean;
  dateRange: { start: Date | null; end: Date | null };
  premium: { min: number | null; max: number | null };
  searchTerm: string;
}

// This function was causing a naming conflict with the exported usePolicies
// Commented out to avoid the "Individual declarations in merged declaration" error

export function usePolicies() {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  // Removing unused state variable
  const [filters, setFilters] = useState<Filter>({
    status: [],
    type: [],
    company: [],
    search: '',
    startDate: null,
    endDate: null,
    minPremium: null,
    maxPremium: null,
    onlyStarred: false,
    isArchived: false, // Por defecto no mostrar archivadas
    isStarred: false, // Añadiendo la propiedad requerida
    dateRange: { start: null, end: null },
    premium: { min: null, max: null },
    searchTerm: '',
  });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({
    key: 'endDate', // Ordenar por fecha de vencimiento por defecto
    direction: 'asc',
  });
  const [policyStats, setPolicyStats] = useState<PolicyStats>({
    total: 0,
    active: 0,
    expired: 0,
    pending: 0,
    review: 0,
    cancelled: 0,
    expiringIn30Days: 0,
    // The following properties are also required by PolicyStats type
    totalPolicies: 0,
    activePolicies: 0,
    pendingPolicies: 0,
    expiredPolicies: 0,
    cancelledPolicies: 0,
    reviewPolicies: 0,
    renewingPolicies: 0,
    totalPremium: 0,
    averagePremium: 0,
    policiesByType: [],
    policiesByCompany: [],
    status: 'active' // Adding the required status property
  });

  const fetchCustomers = useCallback(async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'customers'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedCustomers: Customer[] = [];
      querySnapshot.forEach((doc) => {
        fetchedCustomers.push({ id: doc.id, ...doc.data() } as Customer);
      });
      setCustomers(fetchedCustomers);
    } catch (error) {
      console.error("Error fetching customers: ", error);
    }
  }, [user]);
  
  // Modificado para usar onSnapshot y mantener datos en tiempo real
  const setupPoliciesListener = useCallback(() => {
    if (!user) {
      setPolicies([]);
      setLoading(false);
      setHasMore(false);
      return () => {}; // Retornar una función de limpieza vacía
    }
  
    setLoading(true);
    console.log("Configurando listener de pólizas en tiempo real");
  
    // Crear la consulta base
    let q = query(
      collection(db, 'policies'),
      where('userId', '==', user.uid)
    );
          
    // Aplicar filtros si existen
    if (filters.status.length > 0) {
      q = query(q, where('status', 'in', filters.status));
          }
    
    // Aplicar ordenamiento
    if (sortConfig.key) {
      const firestoreSortKey = sortConfig.key === 'customerName' ? 'customerName' : 
                              sortConfig.key === 'policyNumber' ? 'policyNumber' :
                              sortConfig.key === 'type' ? 'type' :
                              sortConfig.key === 'status' ? 'status' :
                              sortConfig.key === 'company' ? 'company' :
                              sortConfig.key === 'premium' ? 'premium' :
                              sortConfig.key === 'startDate' ? 'startDate' :
                              sortConfig.key === 'endDate' ? 'endDate' : 'endDate';
      q = query(q, orderBy(firestoreSortKey, sortConfig.direction));
      } else {
      // Si no hay ordenamiento, ordenar por fecha de creación descendente
      q = query(q, orderBy('createdAt', 'desc'));
      }
      
    // Configurar el listener en tiempo real
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPolicies: Policy[] = [];
      
      querySnapshot.forEach((doc) => {
        const policyData = doc.data();
      // Asegurarse de que todos los campos requeridos estén presentes
        const policy: Policy = {
          id: doc.id,
          ...policyData,
          errors: policyData.errors || [],
          customerId: policyData.customerId || '',
          coverage: policyData.coverage || 0,
          paymentFrequency: policyData.paymentFrequency || 'annual',
        } as Policy;
        
        fetchedPolicies.push(policy);
      });
  
      // Actualizar estado con todas las pólizas
      setPolicies(fetchedPolicies);
      setLoading(false);
      
      // Log para depuración
      console.log('Pólizas actualizadas en tiempo real:', fetchedPolicies.length);
    }, (error) => {
      console.error("Error en el listener de pólizas:", error);
      setLoading(false);
    });
  
    // Retornar la función de limpieza para desuscribirse cuando el componente se desmonte
    return unsubscribe;
  }, [user, filters, sortConfig]);

  const calculateStats = useCallback(async () => {
    if (!user) return;
    try {
      console.log("Calculando estadísticas...");
      
      // Calcular estadísticas directamente de las pólizas en memoria
      // Esto es más rápido que hacer consultas a Firebase
      const allPolicies = [...policies];
      
      // Filtrar pólizas no archivadas
      const nonArchivedPolicies = allPolicies.filter(p => !p.isArchived);
      
      // Contar pólizas por estado
      const active = nonArchivedPolicies.filter(p => p.status === 'active').length;
      const expired = nonArchivedPolicies.filter(p => p.status === 'expired').length;
      const pending = nonArchivedPolicies.filter(p => p.status === 'pending').length;
      // Use string type for 'review' status
      const review = nonArchivedPolicies.filter(p => p.status === 'review' as string).length;
      const cancelled = nonArchivedPolicies.filter(p => p.status === 'cancelled').length;
      
      // Contar pólizas que vencen en los próximos 30 días
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const now = new Date();
      
      // Calculate policies expiring in 30 days
      const expiringIn30Days = nonArchivedPolicies.filter(p => {
        if (p.endDate && typeof p.endDate.toDate === 'function') {
          const endDate = p.endDate.toDate();
          return endDate > now && endDate <= thirtyDaysFromNow;
        }
      return false;
      }).length;
      
      const newStats: PolicyStats = {
        total: nonArchivedPolicies.length,
        active,
        expired,
        pending,
        review,
        cancelled,
        expiringIn30Days,
        // Add required properties
        totalPolicies: nonArchivedPolicies.length,
        activePolicies: active,
        pendingPolicies: pending,
        expiredPolicies: expired,
        reviewPolicies: review,
        cancelledPolicies: cancelled,
        renewingPolicies: 0,
        totalPremium: 0,
        averagePremium: 0,
        policiesByType: [],
        policiesByCompany: [],
        status: 'active' // Adding the required status property
      };
      
      setPolicyStats(newStats);
      
      // Si no hay pólizas en memoria o queremos verificar con Firebase,
      // también podemos hacer las consultas a Firebase
      if (allPolicies.length === 0) {
        const policiesRef = collection(db, 'policies');
        const baseQuery = query(policiesRef, where('userId', '==', user.uid), where('isArchived', '!=', true));
        
        const totalSnapshot = await getCountFromServer(baseQuery);
        const activeSnapshot = await getCountFromServer(query(baseQuery, where('status', '==', 'active')));
        const expiredSnapshot = await getCountFromServer(query(baseQuery, where('status', '==', 'expired')));
        const pendingSnapshot = await getCountFromServer(query(baseQuery, where('status', '==', 'pending')));
        const reviewSnapshot = await getCountFromServer(query(baseQuery, where('status', '==', 'review')));
        const cancelledSnapshot = await getCountFromServer(query(baseQuery, where('status', '==', 'cancelled')));
        
        // Query for policies expiring in 30 days
        const now = new Date();
        const thirtyDaysFromNow = new Date(now);
        thirtyDaysFromNow.setDate(now.getDate() + 30);
        
        const expiringSoonSnapshot = await getCountFromServer(
          query(
            baseQuery,
            where('endDate', '>', Timestamp.fromDate(now)),
            where('endDate', '<=', Timestamp.fromDate(thirtyDaysFromNow))
        )
      );
      
        const firebaseStats: PolicyStats = {
          total: totalSnapshot.data().count,
          active: activeSnapshot.data().count,
          expired: expiredSnapshot.data().count,
          pending: pendingSnapshot.data().count,
          review: reviewSnapshot.data().count,
          cancelled: cancelledSnapshot.data().count,
          expiringIn30Days: expiringSoonSnapshot.data().count,
          totalPolicies: totalSnapshot.data().count,
          activePolicies: activeSnapshot.data().count,
          pendingPolicies: pendingSnapshot.data().count,
          expiredPolicies: expiredSnapshot.data().count,
          reviewPolicies: reviewSnapshot.data().count,
          cancelledPolicies: cancelledSnapshot.data().count,
          renewingPolicies: 0,
          totalPremium: 0,
          averagePremium: 0,
          policiesByType: [],
          policiesByCompany: [],
          status: 'active' // Adding the required status property
  };

        console.log("Usando estadísticas de Firebase");
        setPolicyStats(firebaseStats);
      }
    } catch (error) {
      console.error("Error calculating stats: ", error);
    }
  }, [user, policies]);
      
  useEffect(() => {
    if (user && policies.length > 0) {
      calculateStats();
    }
  }, [policies, calculateStats, user]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Efecto para configurar el listener de pólizas en tiempo real
  useEffect(() => {
    const unsubscribe = setupPoliciesListener();
    
    // Limpiar el listener cuando el componente se desmonte o cambien las dependencias
    return () => {
      unsubscribe();
  };
  }, [setupPoliciesListener]);

  // Efecto para búsqueda y ordenamiento en el cliente (si no se hace en backend)
  const filteredPolicies = policies
    .filter(policy => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      if (!searchTermLower) return true;
      return (
        policy.policyNumber.toLowerCase().includes(searchTermLower) ||
        (policy.customerName && policy.customerName.toLowerCase().includes(searchTermLower)) ||
        policy.company.toLowerCase().includes(searchTermLower)
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      // @ts-expect-error - Dynamic property access based on sortConfig.key
      const valA = a[sortConfig.key];
      // @ts-expect-error - Dynamic property access based on sortConfig.key
      const valB = b[sortConfig.key];
      
      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }
      return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });

  // Función para recargar manualmente las pólizas
  const fetchPolicies = useCallback(async (loadMore = false) => {
    if (!user) {
      setPolicies([]);
      setLoading(false);
      setHasMore(false);
      return;
    }
  
    setLoading(true);
    console.log("Iniciando fetchPolicies manual, loadMore:", loadMore);
    try {
      // Consulta simple para obtener todas las pólizas del usuario
      let q = query(
        collection(db, 'policies'),
        where('userId', '==', user.uid)
      );
  
      // Aplicar filtros si existen
      if (filters.status.length > 0) {
        q = query(q, where('status', 'in', filters.status));
      }
      
      // Aplicar ordenamiento
      if (sortConfig.key) {
        const firestoreSortKey = sortConfig.key === 'customerName' ? 'customerName' : 
                                sortConfig.key === 'policyNumber' ? 'policyNumber' :
                                sortConfig.key === 'type' ? 'type' :
                                sortConfig.key === 'status' ? 'status' :
                                sortConfig.key === 'company' ? 'company' :
                                sortConfig.key === 'premium' ? 'premium' :
                                sortConfig.key === 'startDate' ? 'startDate' :
                                sortConfig.key === 'endDate' ? 'endDate' : 'endDate';
        q = query(q, orderBy(firestoreSortKey, sortConfig.direction));
      } else {
        // Si no hay ordenamiento, ordenar por fecha de creación descendente
        q = query(q, orderBy('createdAt', 'desc'));
      }
  
      // Ejecutar la consulta sin límite para obtener todas las pólizas
      const querySnapshot = await getDocs(q);
      const fetchedPolicies: Policy[] = [];
      
      querySnapshot.forEach((doc) => {
        const policyData = doc.data();
        // Asegurarse de que todos los campos requeridos estén presentes
        const policy: Policy = {
          id: doc.id,
          ...policyData,
          errors: policyData.errors || [],
          customerId: policyData.customerId || '',
          coverage: policyData.coverage || 0,
          paymentFrequency: policyData.paymentFrequency || 'annual',
        } as Policy;
        
        fetchedPolicies.push(policy);
      });
  
      // Actualizar estado con todas las pólizas
      setPolicies(fetchedPolicies);
      setLoading(false);
      
      // Log para depuración
      console.log('Pólizas obtenidas manualmente:', fetchedPolicies.length);
    } catch (error) {
      console.error("Error al obtener pólizas manualmente: ", error);
      setLoading(false);
    }
  }, [user, filters, sortConfig]);

  // Función para actualizar la información de la póliza en el cliente
  const updatePolicyInCustomer = async (policyData: Partial<Policy>, policyId: string, isNew: boolean = false): Promise<boolean> => {
    if (!user || !policyData.customerId) return false;
    try {
      // Obtener el documento del cliente
      const customerRef = doc(db, 'customers', policyData.customerId);
      const customerDoc = await getDoc(customerRef);
      
      if (!customerDoc.exists()) {
        console.error("Cliente no encontrado:", policyData.customerId);
      return false;
    }
      
      const customerData = customerDoc.data() as Customer;
      
      // Crear el objeto de enlace de póliza para el cliente
      const policyLink: CustomerPolicyLink = {
        policyId: policyId,
        policyNumber: policyData.policyNumber || '',
        type: policyData.type || '',
        company: policyData.company || '',
        status: policyData.status || 'active',
        startDate: policyData.startDate || Timestamp.now(),
        endDate: policyData.endDate || Timestamp.now()
  };

      // Actualizar la lista de pólizas del cliente
      let updatedPolicies: CustomerPolicyLink[] = [];
      
      if (customerData.policies && customerData.policies.length > 0) {
        if (isNew) {
          // Si es una nueva póliza, añadirla a la lista
          updatedPolicies = [...customerData.policies, policyLink];
        } else {
          // Si es una actualización, reemplazar la existente
          updatedPolicies = customerData.policies.map(p => 
            p.policyId === policyId ? policyLink : p
          );
          
          // Si no existe en la lista, añadirla
          if (!updatedPolicies.some(p => p.policyId === policyId)) {
            updatedPolicies.push(policyLink);
          }
        }
      } else {
        // Si no hay pólizas, crear una nueva lista
        updatedPolicies = [policyLink];
      }
      
      // Actualizar el documento del cliente
      await updateDoc(customerRef, {
        policies: updatedPolicies,
        updatedAt: Timestamp.now()
      });
      
      return true;
    } catch (error) {
      console.error("Error al actualizar la póliza en el cliente:", error);
      return false;
    }
  };
  
  // Función para eliminar la póliza del cliente
  const removePolicyFromCustomer = async (policyId: string, customerId: string): Promise<boolean> => {
    if (!user || !customerId) return false;
    
    try {
      // Obtener el documento del cliente
      const customerRef = doc(db, 'customers', customerId);
      const customerDoc = await getDoc(customerRef);
      
      if (!customerDoc.exists()) {
        console.error("Cliente no encontrado:", customerId);
        return false;
}
      
      const customerData = customerDoc.data() as Customer;
      
      // Si el cliente no tiene pólizas, no hay nada que hacer
      if (!customerData.policies || customerData.policies.length === 0) {
        return true;
      }
      
      // Filtrar la póliza a eliminar
      const updatedPolicies = customerData.policies.filter(p => p.policyId !== policyId);
      
      // Actualizar el documento del cliente
      await updateDoc(customerRef, {
        policies: updatedPolicies,
        updatedAt: Timestamp.now()
      });
      
      return true;
    } catch (error) {
      console.error("Error al eliminar la póliza del cliente:", error);
      return false;
    }
  };

  const savePolicy = async (policyData: Partial<Policy>, isEdit: boolean, policyId?: string): Promise<boolean> => {
    if (!user) return false;
    try {
      // Asegurarse de que todos los campos requeridos estén presentes
      const completePolicy = {
        ...policyData,
        userId: user.uid,
        errors: policyData.errors || [], // Campo requerido
        customerId: policyData.customerId || '', // Asegurarse de que exista
        coverage: policyData.coverage || 0, // Asegurarse de que exista
        paymentFrequency: policyData.paymentFrequency || 'annual', // Asegurarse de que exista
      };
  
      console.log("Guardando póliza completa:", completePolicy);
      
      let savedPolicyId = policyId || '';
      
      if (isEdit && policyId) {
        const policyRef = doc(db, 'policies', policyId);
        await updateDoc(policyRef, { 
          ...completePolicy, 
          updatedAt: Timestamp.now() 
        });
        savedPolicyId = policyId;
      } else {
        // Crear una nueva póliza con todos los campos requeridos
        const newPolicy = {
          ...completePolicy,
          userId: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          errors: completePolicy.errors || [],
          customerId: completePolicy.customerId || '',
          coverage: completePolicy.coverage || 0,
          paymentFrequency: completePolicy.paymentFrequency || 'annual',
          isArchived: false, // Asegurarse de que no esté archivada
        };
        
        // Guardar la nueva póliza en Firebase
        const docRef = await addDoc(collection(db, 'policies'), newPolicy);
        console.log("Nueva póliza creada con ID:", docRef.id);
        savedPolicyId = docRef.id;
      }
      
      // Actualizar la información de la póliza en el cliente
      if (completePolicy.customerId) {
        await updatePolicyInCustomer(completePolicy, savedPolicyId, !isEdit);
      }
      
      // No es necesario recargar manualmente las pólizas ya que el listener onSnapshot
      // detectará los cambios y actualizará el estado automáticamente
      
      // IMPORTANTE: Recalcular estadísticas después de guardar
      await calculateStats();
      
      return true;
    } catch (error) {
      console.error("Error saving policy:", error);
      return false;
    }
  };

  const deletePolicy = async (policyId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      // Obtener la póliza antes de eliminarla para tener el customerId
      const policyToDelete = policies.find(p => p.id === policyId);
      if (!policyToDelete) return false;
      
      // Actualizar el estado local inmediatamente para una respuesta instantánea en la UI
      setPolicies(prevPolicies => prevPolicies.filter(p => p.id !== policyId));
      
      // Opcional: eliminar documentos adjuntos de Firebase Storage
      if (policyToDelete?.documents && policyToDelete.documents.length > 0) {
        policyToDelete.documents.forEach(docFile => {
          // Check if path exists as it might not be in the type definition
          if ('path' in docFile && docFile.path && typeof docFile.path === 'string') {
            const fileRef = ref(storage, docFile.path);
            deleteObject(fileRef).catch(err => console.error("Error deleting file from storage:", err)); // No bloquear si falla la eliminación del archivo
          }
        });
      }
      
      // Eliminar la póliza del cliente si existe
      if (policyToDelete && policyToDelete.customerId) {
        await removePolicyFromCustomer(policyId, policyToDelete.customerId);
      }
  
      // Eliminar la póliza de Firebase
      const policyRef = doc(db, 'policies', policyId);
      await deleteDoc(policyRef);
      
      // IMPORTANTE: Recalcular estadísticas después de eliminar
      await calculateStats();

      return true;
    } catch (error) {
      console.error("Error deleting policy: ", error);
      
      // Si falla la eliminación en Firebase, restaurar la póliza en el estado local
      const policyToRestore = policies.find(p => p.id === policyId);
      if (policyToRestore) {
        setPolicies(prevPolicies => [...prevPolicies, policyToRestore]);
      }
      return false;
    }
  };

  const toggleArchivePolicy = async (policyId: string, archive: boolean): Promise<boolean> => {
    if (!user) return false;
    try {
      // Actualizar el estado local inmediatamente para una respuesta instant��nea en la UI
      setPolicies(prevPolicies => 
        prevPolicies.map(policy => 
          policy.id === policyId ? { ...policy, isArchived: archive } : policy
        )
      );
      
      // Luego actualizar en Firebase
      const policyRef = doc(db, 'policies', policyId);
      await updateDoc(policyRef, { isArchived: archive, updatedAt: Timestamp.now() });
      
      // Recalcular estadísticas
      await calculateStats();
      return true;
    } catch (error) {
      console.error("Error archiving policy: ", error);
      
      // Revertir el cambio en el estado local si falla la actualización en Firebase
      setPolicies(prevPolicies => 
        prevPolicies.map(policy => 
          policy.id === policyId ? { ...policy, isArchived: !archive } : policy
        )
      );
      
      return false;
    }
  };

  const toggleStarPolicy = async (policyId: string, star: boolean): Promise<boolean> => {
    if (!user) return false;
    try {
      // Actualizar el estado local inmediatamente para una respuesta instantánea en la UI
      setPolicies(prevPolicies => 
        prevPolicies.map(policy => 
          policy.id === policyId ? { ...policy, isStarred: star } : policy
        )
      );
      
      // Luego actualizar en Firebase
      const policyRef = doc(db, 'policies', policyId);
      await updateDoc(policyRef, { isStarred: star, updatedAt: Timestamp.now() });
      return true;
    } catch (error) {
      console.error("Error starring policy: ", error);
      
      // Revertir el cambio en el estado local si falla la actualización en Firebase
      setPolicies(prevPolicies => 
        prevPolicies.map(policy => 
          policy.id === policyId ? { ...policy, isStarred: !star } : policy
        )
      );
      
      return false;
    }
  };

  const duplicatePolicy = async (policyToDuplicate: Policy): Promise<boolean> => {
    if (!user) return false;
    try {
      const { ...newPolicyData } = policyToDuplicate;
      const duplicatedPolicy = {
        ...newPolicyData,
        policyNumber: `${newPolicyData.policyNumber}-COPIA`, // Marcar como copia
        isStarred: false, // No duplicar estado de destacado
        isArchived: false, // No duplicar estado de archivado
        documents: [], // No duplicar documentos por defecto
        reminders: [], // No duplicar recordatorios por defecto
        userId: user.uid,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
  };

      // Guardar la póliza duplicada
      const docRef = await addDoc(collection(db, 'policies'), duplicatedPolicy);
      
      // Actualizar la información de la póliza en el cliente
      if (duplicatedPolicy.customerId) {
        await updatePolicyInCustomer(duplicatedPolicy, docRef.id, true);
}
      
      // No es necesario recargar manualmente las pólizas ya que el listener onSnapshot
      // detectará el cambio y actualizará el estado automáticamente
      
      // IMPORTANTE: Recalcular estadísticas después de duplicar
      await calculateStats();
      
      return true;
    } catch (error) {
      console.error("Error duplicating policy: ", error);
      return false;
    }
  };
  
  // Funciones para Documentos
  const uploadDocument = async (policyId: string, file: File): Promise<PolicyDocument | null> => {
    if (!user) return null;
    try {
      const filePath = `users/${user.uid}/policies/${policyId}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      const newDocument: PolicyDocument = {
        id: doc(collection(db, 'temp')).id, // Generar un ID único para el documento
        name: file.name,
        url: downloadURL,
        path: filePath,
        uploadedAt: Timestamp.now(),
      };

      const policyRef = doc(db, 'policies', policyId);
      const currentPolicy = policies.find(p => p.id === policyId);
      const updatedDocuments = [...(currentPolicy?.documents || []), newDocument];
      await updateDoc(policyRef, { documents: updatedDocuments, updatedAt: Timestamp.now() });
      
      // No es necesario actualizar manualmente el estado ya que el listener onSnapshot
      // detectará el cambio y actualizará el estado automáticamente
      
      return newDocument;
    } catch (error) {
      console.error("Error uploading document: ", error);
      return null;
}
  };

  const deleteDocument = async (policyId: string, docId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const policyRef = doc(db, 'policies', policyId);
      const currentPolicy = policies.find(p => p.id === policyId);
      if (!currentPolicy || !currentPolicy.documents) return false;
      
      const docToDelete = currentPolicy.documents.find(d => d.id === docId || d.name === docId); // Compatibilidad por si no hay ID
      if (!docToDelete) return false;

      if ('path' in docToDelete && docToDelete.path && typeof docToDelete.path === 'string') {
        const fileRef = ref(storage, docToDelete.path);
        await deleteObject(fileRef);
      }

      const updatedDocuments = currentPolicy.documents.filter(d => (d.id || d.name) !== (docToDelete.id || docToDelete.name) );
      await updateDoc(policyRef, { documents: updatedDocuments, updatedAt: Timestamp.now() });
      
      // No es necesario actualizar manualmente el estado ya que el listener onSnapshot
      // detectará el cambio y actualizará el estado automáticamente
      
      return true;
    } catch (error) {
      console.error("Error deleting document: ", error);
      return false;
    }
  };

  // Funciones para Recordatorios
  const addReminder = async (policyId: string, reminderData: Omit<PolicyReminder, 'id'>): Promise<boolean> => {
    if (!user) return false;
    try {
      const policyRef = doc(db, 'policies', policyId);
      const currentPolicy = policies.find(p => p.id === policyId);
      const newReminder: PolicyReminder = { ...reminderData, id: doc(collection(db, 'temp')).id }; // Generar ID único
      const updatedReminders = [...(currentPolicy?.reminders || []), newReminder];
      
      await updateDoc(policyRef, { reminders: updatedReminders, updatedAt: Timestamp.now() });
      
      // No es necesario actualizar manualmente el estado ya que el listener onSnapshot
      // detectará el cambio y actualizará el estado automáticamente
      
      return true;
    } catch (error) {
      console.error("Error adding reminder: ", error);
      return false;
    }
  };

  const toggleReminder = async (policyId: string, reminderId: string, completed: boolean): Promise<boolean> => {
    if (!user) return false;
    try {
      const policyRef = doc(db, 'policies', policyId);
      const currentPolicy = policies.find(p => p.id === policyId);
      if (!currentPolicy || !currentPolicy.reminders) return false;

      const updatedReminders = currentPolicy.reminders.map(r => 
        r.id === reminderId ? { ...r, completed, completedAt: completed ? Timestamp.now() : null } : r
      );
      
      await updateDoc(policyRef, { reminders: updatedReminders, updatedAt: Timestamp.now() });
      
      // No es necesario actualizar manualmente el estado ya que el listener onSnapshot
      // detectará el cambio y actualizará el estado automáticamente
      
      return true;
    } catch (error) {
      console.error("Error toggling reminder: ", error);
      return false;
    }
  };

  const deleteReminder = async (policyId: string, reminderId: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const policyRef = doc(db, 'policies', policyId);
      const currentPolicy = policies.find(p => p.id === policyId);
      if (!currentPolicy || !currentPolicy.reminders) return false;

      const updatedReminders = currentPolicy.reminders.filter(r => r.id !== reminderId);
      
      await updateDoc(policyRef, { reminders: updatedReminders, updatedAt: Timestamp.now() });
      
      // No es necesario actualizar manualmente el estado ya que el listener onSnapshot
      // detectará el cambio y actualizará el estado automáticamente
      
      return true;
    } catch (error) {
      console.error("Error deleting reminder: ", error);
      return false;
    }
  };

  // Función para Notas
  const updateNotes = async (policyId: string, notes: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const policyRef = doc(db, 'policies', policyId);
      await updateDoc(policyRef, { notes, updatedAt: Timestamp.now() });
      
      // No es necesario actualizar manualmente el estado ya que el listener onSnapshot
      // detectará el cambio y actualizará el estado automáticamente
      
      return true;
    } catch (error) {
      console.error("Error updating notes: ", error);
      return false;
    }
  };

  return {
    policies, // Devuelve las pólizas originales sin filtrar por cliente para la tabla
    filteredPolicies, // Devuelve las pólizas filtradas por término de búsqueda y ordenadas
    customers,
    loading,
    hasMore,
    fetchPolicies, // Para cargar más
    policyStats,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    savePolicy,
    deletePolicy,
    toggleArchivePolicy,
    toggleStarPolicy,
    duplicatePolicy,
    addReminder,
    toggleReminder,
    deleteReminder,
    uploadDocument,
    deleteDocument,
    updateNotes
  };
}