import { useState, useCallback, useEffect, useMemo } from 'react';
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
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, TaskFilters, SubtaskItem } from '../types/tasks';
import { useAuth } from './use-auth';

export const useTasks = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
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
    setError(null);
    
    try {
      // Referencia a la colección de tareas del usuario
      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      const tasksQuery = query(tasksRef, orderBy('createdAt', 'desc'));
      
      // Suscripción en tiempo real a los cambios en las tareas
      const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
        const tasksData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        
        // Actualizar el estado con las tareas obtenidas
        setTasks(tasksData);
        setLoading(false);
      }, (err) => {
        console.error('Error al cargar tareas:', err);
        setError('Error al cargar las tareas');
        setLoading(false);
      });

      // Limpiar la suscripción cuando el componente se desmonte
      return () => unsubscribe();
    } catch (err) {
      console.error('Error al configurar la suscripción de tareas:', err);
      setError('Error al configurar la suscripción de tareas');
      setLoading(false);
    }
  }, [user, refreshTrigger]);

  // Filtrar tareas según los filtros aplicados
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filtro por estado
      if (filters.status !== 'todas' && task.status !== filters.status) {
        return false;
      }
      
      // Filtro por prioridad
      if (filters.priority !== 'todas' && task.priority !== filters.priority) {
        return false;
      }
      
      // Filtro por búsqueda (en título y descripción)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query) || false;
        
        if (!titleMatch && !descMatch) {
          return false;
        }
      }
      
      // Filtro por fecha
      if (filters.dateFilter !== 'todas' && task.dueDate) {
        const dueDate = task.dueDate instanceof Date 
          ? task.dueDate 
          : task.dueDate.toDate();
        
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

  // Agregar una nueva tarea
  const addTask = useCallback(
    async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return '';
      }

      try {
        // Preparar datos de la tarea
        const newTaskData = {
          ...taskData,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          // Asegurar que los subtasks sean un array si existen
          subtasks: taskData.subtasks || [],
          // Marcar como urgente si la prioridad es alta
          isUrgent: taskData.priority === 'alta'
        };
        
        // Agregar la tarea a Firestore
        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        const docRef = await addDoc(tasksRef, newTaskData);
        
        console.log('Tarea creada con ID:', docRef.id);
        
        return docRef.id;
      } catch (err) {
        console.error('Error al agregar tarea:', err);
        setError('Error al agregar la tarea');
        return '';
      }
    },
    [user]
  );

  // Actualizar una tarea existente
  const updateTask = useCallback(
    async (taskId: string, taskData: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        // Referencia al documento de la tarea
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
          // Actualizar isUrgent si se cambia la prioridad
          ...(taskData.priority && { isUrgent: taskData.priority === 'alta' })
        };
        
        // Actualizar la tarea en Firestore
        await updateDoc(taskRef, updatedData);
        
        console.log('Tarea actualizada con ID:', taskId);
        
        return true;
      } catch (err) {
        console.error('Error al actualizar tarea:', err);
        setError('Error al actualizar la tarea');
        return false;
      }
    },
    [user]
  );

  // Eliminar una tarea
  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        // Referencia al documento de la tarea
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        
        // Verificar si la tarea existe
        const taskDoc = await getDoc(taskRef);
        if (!taskDoc.exists()) {
          setError('La tarea no existe');
          return false;
        }
        
        // Eliminar la tarea de Firestore
        await deleteDoc(taskRef);
        
        console.log('Tarea eliminada con ID:', taskId);
        
        return true;
      } catch (err) {
        console.error('Error al eliminar tarea:', err);
        setError('Error al eliminar la tarea');
        return false;
      }
    },
    [user]
  );
  
  // Cambiar el estado de una tarea (completar/descompletar)
  const completeTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        // Referencia al documento de la tarea
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        
        // Obtener el estado actual de la tarea
        const taskDoc = await getDoc(taskRef);
        if (!taskDoc.exists()) {
          setError('La tarea no existe');
          return false;
        }
        
        const taskData = taskDoc.data() as Task;
        const newStatus = taskData.status === 'completada' ? 'pendiente' : 'completada';
        
        // Actualizar el estado de la tarea en Firestore
        await updateDoc(taskRef, {
          status: newStatus,
          updatedAt: serverTimestamp(),
          completedAt: newStatus === 'completada' ? serverTimestamp() : null
        });
        
        console.log('Estado de tarea actualizado con ID:', taskId);
        
        return true;
      } catch (err) {
        console.error('Error al cambiar estado de tarea:', err);
        setError('Error al cambiar el estado de la tarea');
        return false;
      }
    },
    [user]
  );

  // Actualizar subtareas
  const updateSubtasks = useCallback(
    async (taskId: string, subtasks: SubtaskItem[]) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        // Referencia al documento de la tarea
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        
        // Actualizar las subtareas
        await updateDoc(taskRef, {
          subtasks,
          hasSubtasks: subtasks.length > 0,
          updatedAt: serverTimestamp()
        });
        
        return true;
      } catch (err) {
        console.error('Error al actualizar subtareas:', err);
        setError('Error al actualizar las subtareas');
        return false;
      }
    },
    [user]
  );

  // Cambiar el estado de una tarea a "En Progreso"
  const startTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        // Referencia al documento de la tarea
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        
        // Actualizar el estado de la tarea en Firestore
        await updateDoc(taskRef, {
          status: 'en_progreso',
          updatedAt: serverTimestamp()
        });
        
        return true;
      } catch (err) {
        console.error('Error al iniciar tarea:', err);
        setError('Error al iniciar la tarea');
        return false;
      }
    },
    [user]
  );

  // Mover una tarea a otra columna (cambiar estado)
  const moveTask = useCallback(
    async (taskId: string, newStatus: 'pendiente' | 'en_progreso' | 'completada') => {
      if (!user?.uid) {
        setError('Usuario no autenticado');
        return false;
      }

      try {
        // Referencia al documento de la tarea
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        
        // Preparar datos para actualizar
        const updateData: {
          status: typeof newStatus;
          updatedAt: ReturnType<typeof serverTimestamp>;
          completedAt?: ReturnType<typeof serverTimestamp> | null;
        } = {
          status: newStatus,
          updatedAt: serverTimestamp()
        };
        
        // Si se completa la tarea, agregar fecha de completado
        if (newStatus === 'completada') {
          updateData.completedAt = serverTimestamp();
        } else {
          // Si se mueve de completada a otro estado, eliminar fecha de completado
          updateData.completedAt = null;
        }
        
        // Actualizar el estado de la tarea en Firestore
        await updateDoc(taskRef, updateData);
        
        return true;
      } catch (err) {
        console.error('Error al mover tarea:', err);
        setError('Error al mover la tarea');
        return false;
      }
    },
    [user]
  );

  // Eliminar múltiples tareas
  const deleteTasks = useCallback(
    async (taskIds: string[]) => {
      if (!user?.uid || taskIds.length === 0) {
        setError('Usuario no autenticado o no hay tareas para eliminar');
        return false;
      }

      try {
        const batch = writeBatch(db);
        
        // Agregar cada tarea al batch para eliminar
        taskIds.forEach(taskId => {
          const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
          batch.delete(taskRef);
        });
        
        // Ejecutar el batch
        await batch.commit();
        
        console.log(`${taskIds.length} tareas eliminadas`);
        
        return true;
      } catch (err) {
        console.error('Error al eliminar tareas:', err);
        setError('Error al eliminar las tareas');
        return false;
      }
    },
    [user]
  );

  // Completar múltiples tareas
  const completeTasks = useCallback(
    async (taskIds: string[]) => {
      if (!user?.uid || taskIds.length === 0) {
        setError('Usuario no autenticado o no hay tareas para completar');
        return false;
      }

      try {
        const batch = writeBatch(db);
        const now = serverTimestamp();
        
        // Agregar cada tarea al batch para actualizar
        taskIds.forEach(taskId => {
          const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
          batch.update(taskRef, {
            status: 'completada',
            updatedAt: now,
            completedAt: now
          });
        });
        
        // Ejecutar el batch
        await batch.commit();
        
        console.log(`${taskIds.length} tareas completadas`);
        
        return true;
      } catch (err) {
        console.error('Error al completar tareas:', err);
        setError('Error al completar las tareas');
        return false;
      }
    },
    [user]
  );

  // Calcular estadísticas de tareas
  const calculateStats = useMemo(() => {
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

  // Sugerir la próxima tarea a realizar
  const suggestNextTask = useCallback(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    // Primero buscar tareas vencidas con prioridad alta
    const overdueHighPriorityTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completada') return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      return dueDate < now && task.priority === 'alta';
    });
    
    if (overdueHighPriorityTasks.length > 0) {
      // Ordenar por fecha (más antiguas primero)
      return [...overdueHighPriorityTasks].sort((a, b) => {
        const dateA = a.dueDate instanceof Date ? a.dueDate : a.dueDate?.toDate();
        const dateB = b.dueDate instanceof Date ? b.dueDate : b.dueDate?.toDate();
        
        if (dateA && dateB) {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      })[0];
    }
    
    // Luego buscar otras tareas vencidas
    const otherOverdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completada' || task.priority === 'alta') return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      return dueDate < now;
    });
    
    if (otherOverdueTasks.length > 0) {
      // Ordenar por prioridad y fecha
      const sortedOverdue = [...otherOverdueTasks].sort((a, b) => {
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
    
    // Luego buscar tareas para hoy con prioridad alta
    const todayHighPriorityTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completada') return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return dueDate >= now && dueDate < tomorrow && task.priority === 'alta';
    });
    
    if (todayHighPriorityTasks.length > 0) {
      return todayHighPriorityTasks[0];
    }
    
    // Luego buscar tareas para hoy
    const todayTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completada') return false;
      const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return dueDate >= now && dueDate < tomorrow;
    });
    
    if (todayTasks.length > 0) {
      // Ordenar por prioridad
      const sortedToday = [...todayTasks].sort((a, b) => {
        const priorityOrder = { alta: 0, media: 1, baja: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      });
      
      return sortedToday[0];
    }
    
    // Si no hay tareas vencidas ni para hoy, buscar pendientes y ordenarlas
    const pendingTasks = tasks.filter(task => task.status === 'pendiente');
    
    if (pendingTasks.length > 0) {
      const sortedPending = [...pendingTasks].sort((a, b) => {
        // Primero por prioridad
        const priorityOrder = { alta: 0, media: 1, baja: 2 };
        const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        if (priorityDiff !== 0) return priorityDiff;
        
        // Luego por fecha (más cercanas primero)
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
    
    return null;
  }, [tasks]);

  // Exportar tareas
  const exportTasks = useCallback(async (format: 'pdf' | 'excel' = 'pdf', selectedTasks?: Task[]) => {
    try {
      const tasksToExport = selectedTasks || filteredTasks;
      
      // Aquí iría la lógica real de exportación
      console.log(`Exportando ${tasksToExport.length} tareas en formato ${format}`);
      
      // Simulación de exportación exitosa
      return {
        success: true,
        message: `${tasksToExport.length} tareas exportadas en formato ${format.toUpperCase()}`,
        data: tasksToExport
      };
    } catch (err) {
      console.error(`Error al exportar tareas en formato ${format}:`, err);
      return {
        success: false,
        message: `Error al exportar tareas en formato ${format.toUpperCase()}`,
        error: err
      };
    }
  }, [filteredTasks]);

  // Importar tareas
  const importTasks = useCallback(async (tasksData: Partial<Task>[]) => {
    if (!user?.uid) {
      setError('Usuario no autenticado');
      return {
        success: false,
        message: 'Usuario no autenticado',
        count: 0
      };
    }

    try {
      const batch = writeBatch(db);
      const tasksRef = collection(db, 'users', user.uid, 'tasks');
      let importCount = 0;
      
      for (const taskData of tasksData) {
        if (!taskData.title) continue; // Saltar tareas sin título
        
        const newTask = {
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority || 'media',
          status: taskData.status || 'pendiente',
          dueDate: taskData.dueDate || null,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isUrgent: taskData.priority === 'alta',
          subtasks: taskData.subtasks || [],
          hasSubtasks: (taskData.subtasks && taskData.subtasks.length > 0) || false
        };
        
        const newTaskRef = doc(tasksRef);
        batch.set(newTaskRef, newTask);
        importCount++;
      }
      
      if (importCount > 0) {
        await batch.commit();
        
        // Forzar actualización de la lista
        setRefreshTrigger(prev => prev + 1);
        
        return {
          success: true,
          message: `${importCount} tareas importadas correctamente`,
          count: importCount
        };
      } else {
        return {
          success: false,
          message: 'No se importaron tareas. Verifica el formato de los datos.',
          count: 0
        };
      }
    } catch (err) {
      console.error('Error al importar tareas:', err);
      setError('Error al importar las tareas');
      return {
        success: false,
        message: 'Error al importar las tareas',
        count: 0,
        error: err
      };
    }
  }, [user]);

  // Forzar actualización de datos
  const refreshTasks = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

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
    updateSubtasks,
    startTask,
    moveTask,
    deleteTasks,
    completeTasks,
    calculateStats,
    suggestNextTask,
    exportTasks,
    importTasks,
    refreshTasks
  };
};