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
  getCountFromServer
} from 'firebase/firestore';
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { Policy, Filter, PolicyStats, PolicyDocument, PolicyReminder } from '@/types/policy';
import { Customer } from '@/types/customer';
import { uploadBytes, getDownloadURL } from 'firebase/storage';


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
  const fetchPolicies = useCallback(async (loadMore = false) => {
    if (!user) {
      setPolicies([]);
      setLoading(false);
      setHasMore(false);
      return;
    }
  
    setLoading(true);
    console.log("Iniciando fetchPolicies, loadMore:", loadMore);
  
    try {
      // IMPORTANTE: Para la carga inicial, usar una consulta simple sin filtros
      // para obtener todas las pólizas del usuario
      let q = query(
        collection(db, 'policies'),
        where('userId', '==', user.uid)
      );
  
      // Solo aplicar filtros si no es la carga inicial
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
      
      // Log para depuración
      console.log('Pólizas obtenidas:', fetchedPolicies.length);
      if (fetchedPolicies.length > 0) {
        console.log('Primera póliza:', fetchedPolicies[0].policyNumber);
        console.log('Última póliza:', fetchedPolicies[fetchedPolicies.length - 1].policyNumber);
      }
      
    } catch (error) {
      console.error("Error al obtener pólizas: ", error);
    } finally {
      setLoading(false);
    }
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
      const review = nonArchivedPolicies.filter(p => p.status === 'review').length;
      const cancelled = nonArchivedPolicies.filter(p => p.status === 'cancelled').length;
      
      // Contar pólizas que vencen en los próximos 30 días
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const now = new Date();
      
      const expiringIn30Days = nonArchivedPolicies.filter(p => {
        if (p.status !== 'active') return false;
        const endDate = p.endDate.toDate();
        return endDate <= thirtyDaysFromNow && endDate >= now;
      }).length;
      
      // Actualizar estadísticas
      const newStats = {
        total: nonArchivedPolicies.length,
        active,
        expired,
        pending,
        review,
        cancelled,
        expiringIn30Days,
      };
      
      console.log("Estadísticas calculadas:", newStats);
      
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
  
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const expiringSoonSnapshot = await getCountFromServer(
          query(baseQuery, 
            where('status', '==', 'active'), 
            where('endDate', '<=', Timestamp.fromDate(thirtyDaysFromNow)),
            where('endDate', '>=', Timestamp.now()) // Que no estén ya vencidas
          )
        );
  
        const firebaseStats = {
          total: totalSnapshot.data().count,
          active: activeSnapshot.data().count,
          expired: expiredSnapshot.data().count,
          pending: pendingSnapshot.data().count,
          review: reviewSnapshot.data().count,
          cancelled: cancelledSnapshot.data().count,
          expiringIn30Days: expiringSoonSnapshot.data().count,
        };
        
        console.log("Estadísticas de Firebase:", firebaseStats);
        
        // Si hay diferencias entre las estadísticas calculadas y las de Firebase,
        // usar las de Firebase
        if (JSON.stringify(newStats) !== JSON.stringify(firebaseStats)) {
          console.log("Usando estadísticas de Firebase");
          setPolicyStats(firebaseStats);
        }
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

  useEffect(() => {
    // Cargar pólizas
    fetchPolicies(false);
    
    // Recalcular estadísticas
    calculateStats();
    
    // Log para depuración
    console.log("Efecto para cargar pólizas ejecutado con filtros:", filters);
  }, [fetchPolicies, calculateStats, filters, sortConfig]);
  
  // Efecto adicional para cargar pólizas cuando cambia el usuario
  useEffect(() => {
    if (user) {
      console.log("Usuario cambiado, cargando pólizas...");
      
      // Cargar pólizas sin filtros al iniciar
      const loadInitialPolicies = async () => {
        try {
          // Consulta simple para obtener todas las pólizas del usuario
          const q = query(
            collection(db, 'policies'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          
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
          
          // Log para depuración
          console.log('Pólizas iniciales cargadas:', fetchedPolicies.length);
        } catch (error) {
          console.error("Error al cargar pólizas iniciales:", error);
        }
      };
      
      loadInitialPolicies();
    }
  }, [user]);
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
    
        if (isEdit && policyId) {
          const policyRef = doc(db, 'policies', policyId);
          await updateDoc(policyRef, { 
            ...completePolicy, 
            updatedAt: Timestamp.now() 
          });
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
        }
        
        // IMPORTANTE: Forzar una actualización completa después de guardar
        console.log("Política guardada, actualizando datos...");
        
        // Resetear los filtros para forzar una recarga completa
        // No es necesario setLastDoc ya que no estamos usando ese estado
        
        // Forzar una recarga completa de las políticas sin filtros
        // Usar una consulta simple para obtener todas las pólizas del usuario
        const q = query(
          collection(db, 'policies'),
          where('userId', '==', user.uid)
        );
        
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
        
        // Actualizar el estado con todas las pólizas
        setPolicies(fetchedPolicies);
        
        // Log para depuración
        console.log('Pólizas obtenidas después de guardar:', fetchedPolicies.length);
        if (fetchedPolicies.length > 0) {
          console.log('Primera póliza:', fetchedPolicies[0].policyNumber);
          console.log('Última póliza:', fetchedPolicies[fetchedPolicies.length - 1].policyNumber);
        }
        
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
        // Opcional: eliminar documentos adjuntos de Firebase Storage
        const policyToDelete = policies.find(p => p.id === policyId);
        if (policyToDelete?.documents && policyToDelete.documents.length > 0) {
          policyToDelete.documents.forEach(docFile => {
            // Check if path exists as it might not be in the type definition
            if ('path' in docFile && docFile.path && typeof docFile.path === 'string') {
              const fileRef = ref(storage, docFile.path);
              deleteObject(fileRef).catch(err => console.error("Error deleting file from storage:", err)); // No bloquear si falla la eliminación del archivo
            }
          });
        }
    
        const policyRef = doc(db, 'policies', policyId);
        await deleteDoc(policyRef);
        setPolicies(prev => prev.filter(p => p.id !== policyId));
        
        // IMPORTANTE: Recalcular estadísticas después de eliminar
        await calculateStats();
        
        return true;
      } catch (error) {
        console.error("Error deleting policy: ", error);
        return false;
      }
    };
    
    const toggleArchivePolicy = async (policyId: string, archive: boolean): Promise<boolean> => {
      if (!user) return false;
      try {
        const policyRef = doc(db, 'policies', policyId);
        await updateDoc(policyRef, { isArchived: archive, updatedAt: Timestamp.now() });
        // Actualizar localmente o recargar
        setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, isArchived: archive, updatedAt: Timestamp.now() } : p));
        
        // IMPORTANTE: Recalcular estadísticas después de archivar/desarchivar
        await calculateStats();
        
        return true;
      } catch (error) {
        console.error("Error archiving policy: ", error);
        return false;
      }
    };
    
    const toggleStarPolicy = async (policyId: string, star: boolean): Promise<boolean> => {
      if (!user) return false;
      try {
        const policyRef = doc(db, 'policies', policyId);
        await updateDoc(policyRef, { isStarred: star, updatedAt: Timestamp.now() });
        setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, isStarred: star, updatedAt: Timestamp.now() } : p));
        
        // No es necesario recalcular stats por esto, a menos que las stats dependan de isStarred
        
        return true;
      } catch (error) {
        console.error("Error starring policy: ", error);
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
        await addDoc(collection(db, 'policies'), duplicatedPolicy);
        
        // Recargar pólizas
        await fetchPolicies(false);
        
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
      
      setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, documents: updatedDocuments, updatedAt: Timestamp.now() } : p));
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
      
      setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, documents: updatedDocuments, updatedAt: Timestamp.now() } : p));
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
      setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, reminders: updatedReminders, updatedAt: Timestamp.now() } : p));
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
      setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, reminders: updatedReminders, updatedAt: Timestamp.now() } : p));
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
      setPolicies(prev => prev.map(p => p.id === policyId ? { ...p, notes, updatedAt: Timestamp.now() } : p));
      return true;
    } catch (error) {
      console.error("Error updating notes: ", error);
      return false;
    }
  };


  return {
    policies, // Devuelve las pólizas originales sin filtrar por cliente para la tabla principal
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