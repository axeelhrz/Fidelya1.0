'use client';

import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { KPIMetric, Alert, Task, FinancialMetrics, ClinicalMetrics } from '@/types/dashboard';

export function useKPIMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<KPIMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.centerId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'centers', user.centerId, 'metrics', 'kpis'),
      (doc) => {
        if (doc.exists()) {
          setMetrics(doc.data().metrics || []);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.centerId]);

  return { metrics, loading };
}

export function useAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.centerId) return;

    const q = query(
      collection(db, 'centers', user.centerId, 'alerts'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Alert[];
      
      setAlerts(alertsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.centerId]);

  return { alerts, loading };
}

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.centerId) return;

    const q = query(
      collection(db, 'centers', user.centerId, 'tasks'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        dueDate: doc.data().dueDate.toDate(),
        createdAt: doc.data().createdAt.toDate()
      })) as Task[];
      
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.centerId]);

  return { tasks, loading };
}

export function useFinancialMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<FinancialMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.centerId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'centers', user.centerId, 'metrics', 'financial'),
      (doc) => {
        if (doc.exists()) {
          setMetrics(doc.data() as FinancialMetrics);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.centerId]);

  return { metrics, loading };
}

export function useClinicalMetrics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ClinicalMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.centerId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'centers', user.centerId, 'metrics', 'clinical'),
      (doc) => {
        if (doc.exists()) {
          setMetrics(doc.data() as ClinicalMetrics);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.centerId]);

  return { metrics, loading };
}
