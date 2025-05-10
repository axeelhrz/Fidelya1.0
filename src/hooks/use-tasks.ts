import { useState, useCallback, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  getDoc,
  query,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, TaskFilters } from '../types/tasks';
import { useAuth } from './use-auth';

export const useTasks = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'todas',
    priority: 'todas',
    dateFilter: 'todas',
    searchQuery: ''
  });

  // Cargar tareas del usuario
  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);
    const tasksRef = collection(db, 'users', user.uid, 'tasks');
    const tasksQuery = query(tasksRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      
      setTasks(tasksData);
      setLoading(false);
    }, (err) => {
      console.error('Error al cargar tareas:', err);
      setError('Error al cargar las tareas');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Filtrar tareas según los filtros aplicados
  const filteredTasks = useCallback(() => {
    return tasks.filter(task => {
      // Filtro por estado
      if (filters.status !== 'todas' && task.status !== filters.status) {
        return false;
      }
      
      // Filtro por prioridad
      if (filters.priority !== 'todas' && task.priority !== filters.priority) {
        return false;
      }
      
      // Filtro por búsqueda
      if (filters.searchQuery && !task.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filtro por fecha (implementación básica)
      if (filters.dateFilter !== 'todas' && task.dueDate) {
        const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        if (filters.dateFilter === 'hoy' && (dueDate < today || dueDate >= tomorrow)) {
          return false;
        }
        
        if (filters.dateFilter === 'esta_semana' && (dueDate < today || dueDate >= nextWeek)) {
          return false;
        }
        
        if (filters.dateFilter === 'vencidas' && dueDate >= today) {
          return false;
        }
      }
      
      return true;
    });
  }, [tasks, filters]);
  const addTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return '';
      }

      try {
        setLoading(true);
        setError(null);
        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        
        // Preparar datos de la tarea
        const newTaskData = {
          ...taskData,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        
        const docRef = await addDoc(tasksRef, newTaskData);
        return docRef.id;
      } catch (err) {
        console.error('Error al agregar tarea:', err);
        setError('Error al agregar la tarea');
        return '';
      } finally {
        setLoading(false);
      }
    },
    [user]
  );
  const updateTask = useCallback(
    async (taskId: string, taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        setLoading(true);
        setError(null);
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        
        // Verificar si la tarea existe
        const taskDoc = await getDoc(taskRef);
        if (!taskDoc.exists()) {
          setError('La tarea no existe');
          return false;
        }
        
        // Preparar datos actualizados
        const updatedData = {
          ...taskData,
          updatedAt: serverTimestamp(),
        };
        
        await updateDoc(taskRef, updatedData);
        return true;
      } catch (err) {
        console.error('Error al actualizar tarea:', err);
        setError('Error al actualizar la tarea');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );
  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        setLoading(true);
        setError(null);
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        
        // Verificar si la tarea existe
        const taskDoc = await getDoc(taskRef);
        if (!taskDoc.exists()) {
          setError('La tarea no existe');
          return false;
        }
        
        await deleteDoc(taskRef);
        return true;
      } catch (err) {
        console.error('Error al eliminar tarea:', err);
        setError('Error al eliminar la tarea');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );
  
  const completeTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        setLoading(true);
        setError(null);
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        
        // Obtener el estado actual de la tarea
        const taskDoc = await getDoc(taskRef);
        if (!taskDoc.exists()) {
          setError('La tarea no existe');
          return false;
        }
        
        const taskData = taskDoc.data();
        const newStatus = taskData.status === 'completada' ? 'pendiente' : 'completada';
        
        // Actualizar el estado
        await updateDoc(taskRef, {
          status: newStatus,
          updatedAt: serverTimestamp(),
          completedAt: newStatus === 'completada' ? serverTimestamp() : null
        });
        
        return true;
      } catch (err) {
        console.error('Error al cambiar estado de tarea:', err);
        setError('Error al cambiar el estado de la tarea');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Calcular estadísticas de tareas
  const calculateStats = useCallback(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completada').length,
      pending: tasks.filter(task => task.status === 'pendiente').length,
      inProgress: tasks.filter(task => task.status === 'en_progreso').length,
      urgent: tasks.filter(task => task.priority === 'alta').length,
      dueToday: tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
        return dueDate >= now && dueDate < tomorrow;
      }).length,
      dueThisWeek: tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
        return dueDate >= now && dueDate < nextWeek;
      }).length,
      overdue: tasks.filter(task => {
        if (!task.dueDate || task.status === 'completada') return false;
        const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
        return dueDate < now;
      }).length
    };
  }, [tasks]);
  const suggestNextTask = useCallback(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Primero buscar tareas vencidas
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completada') return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      return dueDate < now;
    });
    
    if (overdueTasks.length > 0) {
      // Ordenar por prioridad y fecha
      const sortedOverdue = [...overdueTasks].sort((a, b) => {
        // Primero por prioridad
        const priorityOrder = { alta: 0, media: 1, baja: 2 };
        const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Luego por fecha (más antiguas primero)
        const dateA = a.dueDate instanceof Date ? a.dueDate : a.dueDate?.toDate();
        const dateB = b.dueDate instanceof Date ? b.dueDate : b.dueDate?.toDate();
        
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      });
      
      return sortedOverdue[0];
    }
    
    // Si no hay tareas vencidas, buscar pendientes y ordenarlas
    const pendingTasks = tasks.filter(task => task.status === 'pendiente');
    
    if (pendingTasks.length > 0) {
      const sortedPending = [...pendingTasks].sort((a, b) => {
        // Primero por prioridad
        const priorityOrder = { alta: 0, media: 1, baja: 2 };
        const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Luego por fecha (más antiguas primero)
        const dateA = a.dueDate instanceof Date ? a.dueDate : a.dueDate?.toDate();
        const dateB = b.dueDate instanceof Date ? b.dueDate : b.dueDate?.toDate();
        
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        
        // Si una tiene fecha y la otra no, priorizar la que tiene fecha
        if (dateA) return -1;
        if (dateB) return 1;
        
        return 0;
      });
      
      return sortedPending[0];
    }
    
  }, [tasks]);
  return {
    tasks,
    filteredTasks,
    loading,
    error,
    filters,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    calculateStats,
    suggestNextTask
  };
};