import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, setDoc, Timestamp, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Task, TaskStats } from '@/types/tasks';
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

export interface TaskKPIs extends TaskStats {
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  tasksByRecurrence: Record<string, number>;
  tasksCreatedThisMonth: number;
  tasksCompletedThisMonth: number;
  averageCompletionTime: number; // in hours
  monthlyChanges: {
    tasks: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  lastUpdated: Timestamp;
}

export const useDashboardTaskKpis = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState<TaskKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateTaskKpis = useCallback(async (userId: string): Promise<TaskKPIs | null> => {
    try {
      console.log(`Generating task KPIs for user: ${userId}`);
      
      // Get current date and start of current and previous month
      const now = dayjs();
      const startOfCurrentMonth = now.startOf('month').toDate();
      const startOfPreviousMonth = now.subtract(1, 'month').startOf('month').toDate();
      const endOfPreviousMonth = now.startOf('month').subtract(1, 'day').endOf('day').toDate();
      
      const tomorrow = now.add(1, 'day').startOf('day').toDate();
      const nextWeek = now.add(7, 'day').startOf('day').toDate();

      // 1. Get all tasks
      const tasksRef = collection(db, 'users', userId, 'tasks');
      const tasksSnapshot = await getDocs(tasksRef);
      
      const tasks: Task[] = [];
      tasksSnapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() } as Task);
      });
      console.log(`Tasks retrieved for ${userId}: ${tasks.length}`);

      // 2. Calculate basic task stats
      const total = tasks.length;
      const completed = tasks.filter(task => task.status === 'completada').length;
      const pending = tasks.filter(task => task.status === 'pendiente').length;
      const inProgress = tasks.filter(task => task.status === 'en_progreso').length;
      const urgent = tasks.filter(task => task.priority === 'alta').length;
      
      // Due today tasks
      const dueToday = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
        return dueDate >= now.toDate() && dueDate < tomorrow;
      }).length;
      
      // Due this week tasks
      const dueThisWeek = tasks.filter(task => {
        if (!task.dueDate) return false;
        const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
        return dueDate >= now.toDate() && dueDate < nextWeek;
      }).length;
      
      // Overdue tasks
      const overdue = tasks.filter(task => {
        if (!task.dueDate || task.status === 'completada') return false;
        const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
        return dueDate < now.toDate();
      }).length;

      // 3. Calculate additional KPIs
      
      // Tasks by priority
      const tasksByPriority: Record<string, number> = {
        alta: 0,
        media: 0,
        baja: 0
      };
      
      tasks.forEach(task => {
        if (task.priority) {
          tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1;
        }
      });
      
      // Tasks by status
      const tasksByStatus: Record<string, number> = {
        pendiente: 0,
        en_progreso: 0,
        completada: 0
      };
      
      tasks.forEach(task => {
        if (task.status) {
          tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1;
        }
      });
      
      // Tasks by recurrence
      const tasksByRecurrence: Record<string, number> = {
        ninguna: 0,
        diaria: 0,
        semanal: 0,
        mensual: 0
      };
      
      tasks.forEach(task => {
        if (task.recurrence) {
          tasksByRecurrence[task.recurrence] = (tasksByRecurrence[task.recurrence] || 0) + 1;
        } else {
          tasksByRecurrence['ninguna'] = (tasksByRecurrence['ninguna'] || 0) + 1;
        }
      });
      
      // Tasks created this month
      const tasksCreatedThisMonth = tasks.filter(task => {
        let createdAt: Date;
        if (task.createdAt instanceof Timestamp) {
          createdAt = task.createdAt.toDate();
        } else if (typeof task.createdAt === 'number' || typeof task.createdAt === 'string') {
          createdAt = new Date(task.createdAt);
        } else {
          createdAt = new Date();
        }
        return createdAt >= startOfCurrentMonth;
      }).length;
      
      // Tasks completed this month
      const tasksCompletedThisMonth = tasks.filter(task => {
        if (task.status !== 'completada' || !task.completedAt) return false;
        const completedAt = task.completedAt instanceof Date ? task.completedAt : task.completedAt.toDate();
        return completedAt >= startOfCurrentMonth;
      }).length;
      
      // Average completion time (for tasks completed with both creation and completion timestamps)
      let totalCompletionTime = 0;
      let completedTasksWithTimestamps = 0;
      
      tasks.forEach(task => {
        if (task.status === 'completada' && task.completedAt && task.createdAt) {
          const completedAt = task.completedAt instanceof Date ? task.completedAt : task.completedAt.toDate();
          let createdAt: Date;
          
          if (task.createdAt instanceof Timestamp) {
            createdAt = task.createdAt.toDate();
          } else if (typeof task.createdAt === 'number' || typeof task.createdAt === 'string') {
            createdAt = new Date(task.createdAt);
          } else {
            return; // Skip if createdAt is not valid
          }
          
          const completionTimeHours = (completedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
          totalCompletionTime += completionTimeHours;
          completedTasksWithTimestamps++;
        }
      });
      
      const averageCompletionTime = completedTasksWithTimestamps > 0 
        ? totalCompletionTime / completedTasksWithTimestamps 
        : 0;
      
      // 4. Calculate monthly changes
      
      // Tasks created in the previous month
      const tasksCreatedLastMonth = tasks.filter(task => {
        let createdAt: Date;
        if (task.createdAt instanceof Timestamp) {
          createdAt = task.createdAt.toDate();
        } else if (typeof task.createdAt === 'number' || typeof task.createdAt === 'string') {
          createdAt = new Date(task.createdAt);
        } else {
          createdAt = new Date();
        }
        return createdAt >= startOfPreviousMonth && createdAt <= endOfPreviousMonth;
      }).length;
      
      // Tasks completed in the previous month
      const tasksCompletedLastMonth = tasks.filter(task => {
        if (task.status !== 'completada' || !task.completedAt) return false;
        const completedAt = task.completedAt instanceof Date ? task.completedAt : task.completedAt.toDate();
        return completedAt >= startOfPreviousMonth && completedAt <= endOfPreviousMonth;
      }).length;
      
      // Pending tasks last month
      const pendingTasksLastMonth = tasks.filter(task => {
        let createdAt: Date;
        if (task.createdAt instanceof Timestamp) {
          createdAt = task.createdAt.toDate();
        } else if (typeof task.createdAt === 'number' || typeof task.createdAt === 'string') {
          createdAt = new Date(task.createdAt);
        } else {
          createdAt = new Date();
        }
        return task.status !== 'completada' && createdAt <= endOfPreviousMonth;
      }).length;
      
      // Overdue tasks last month
      const overdueTasksLastMonth = tasks.filter(task => {
        if (!task.dueDate || task.status === 'completada') return false;
        const dueDate = task.dueDate instanceof Date ? task.dueDate : task.dueDate.toDate();
        return dueDate < endOfPreviousMonth && dueDate >= startOfPreviousMonth;
      }).length;
      
      const monthlyChanges = {
        tasks: tasksCreatedThisMonth - tasksCreatedLastMonth,
        completed: tasksCompletedThisMonth - tasksCompletedLastMonth,
        pending: pending - pendingTasksLastMonth,
        overdue: overdue - overdueTasksLastMonth
      };
      
      // 5. Create KPIs object
      const taskKpis: TaskKPIs = {
        total,
        completed,
        pending,
        inProgress,
        urgent,
        dueToday,
        dueThisWeek,
        overdue,
        tasksByPriority,
        tasksByStatus,
        tasksByRecurrence,
        tasksCreatedThisMonth,
        tasksCompletedThisMonth,
        averageCompletionTime,
        monthlyChanges,
        lastUpdated: Timestamp.now()
      };
      
      // 6. Save KPIs to Firestore
      const kpisDocRef = doc(db, `users/${userId}/dashboard/taskKpis`);
      await setDoc(kpisDocRef, taskKpis);
      console.log(`Task KPIs saved for user ${userId}`);
      
      return taskKpis;
    } catch (error) {
      console.error('Error generating task KPIs:', error);
      return null;
    }
  }, []);

  const getTaskKpis = useCallback(async (userId: string): Promise<TaskKPIs | null> => {
    try {
      const kpisDocRef = doc(db, `users/${userId}/dashboard/taskKpis`);
      const kpisDoc = await getDoc(kpisDocRef);
      
      if (kpisDoc.exists()) {
        return kpisDoc.data() as TaskKPIs;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting task KPIs:', error);
      return null;
    }
  }, []);

  const shouldUpdateTaskKpis = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const kpis = await getTaskKpis(userId);
      
      if (!kpis) {
        return true; // If KPIs don't exist, they should be generated
      }
      
      const lastUpdated = kpis.lastUpdated.toDate();
      const now = new Date();
      const hoursSinceLastUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
      
      return hoursSinceLastUpdate >= 24; // Update if more than 24 hours have passed
    } catch (error) {
      console.error('Error checking if task KPIs should be updated:', error);
      return true; // In case of error, try to update
    }
  }, [getTaskKpis]);

  const updateTaskKpis = useCallback(async (): Promise<boolean> => {
    if (!user?.uid) {
      setError('User not authenticated');
      return false;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate new KPIs
      const result = await generateTaskKpis(user.uid);
      
      if (result) {
        setKpis(result);
        return true;
      }
      
      setError('Could not update task KPIs');
      return false;
    } catch (err) {
      console.error('Error updating task KPIs:', err);
      setError('Error updating task KPIs');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, generateTaskKpis]);

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
        const shouldUpdate = await shouldUpdateTaskKpis(user.uid);
        
        if (shouldUpdate) {
          // Generate new KPIs
          const newKpis = await generateTaskKpis(user.uid);
          if (newKpis) {
            setKpis(newKpis);
          } else {
            setError('Could not generate task KPIs');
          }
        } else {
          // Get existing KPIs
          const existingKpis = await getTaskKpis(user.uid);
          if (existingKpis) {
            setKpis(existingKpis);
          } else {
            setError('Could not retrieve task KPIs');
          }
        }
      } catch (err) {
        console.error('Error loading task KPIs:', err);
        setError('Error loading task KPIs');
      } finally {
        setLoading(false);
      }
    };

    loadKpis();
  }, [user, shouldUpdateTaskKpis, generateTaskKpis, getTaskKpis]);

  return {
    kpis,
    loading,
    error,
    updateTaskKpis
  };
};