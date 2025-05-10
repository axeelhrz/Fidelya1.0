import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { Subscription, SubscriptionDocument } from '@/types/subscription';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Obtener suscripción inicial
    const getInitialSubscription = async () => {
      try {
        const docRef = doc(db, 'subscriptions', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
                  const data = docSnap.data() as SubscriptionDocument;
                  setSubscription({
                    status: data.status,
                    planId: data.planId,
                    plan: data.plan || '',
                    paypalSubscriptionId: data.paypalSubscriptionId || null,
                    paypalPlanId: data.paypalPlanId || null,
                    currentPeriodStart: data.currentPeriodStart,
                    currentPeriodEnd: data.currentPeriodEnd,
                    trialEnd: data.trialEnd || null,
                    cancelAtPeriodEnd: data.cancelAtPeriodEnd || false
                  });
        } else {
          // Si no existe documento de suscripción, verificar en el usuario
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.subscription) {
              setSubscription(userData.subscription as Subscription);
            } else {
              setSubscription(null);
            }
          } else {
            setSubscription(null);
          }
        }
      } catch (err) {
        console.error('Error al obtener suscripción:', err);
        setError('Error al cargar la información de suscripción');
      } finally {
        setLoading(false);
      }
    };

    getInitialSubscription();

    // Suscribirse a cambios en tiempo real
    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SubscriptionDocument;
          setSubscription({
            status: data.status,
            planId: data.planId,
            plan: data.plan || '',
            paypalSubscriptionId: data.paypalSubscriptionId || null,
            paypalPlanId: data.paypalPlanId || null,
            currentPeriodStart: data.currentPeriodStart,
            currentPeriodEnd: data.currentPeriodEnd,
            trialEnd: data.trialEnd || null,
            cancelAtPeriodEnd: data.cancelAtPeriodEnd || false
          });
        } else {
          setSubscription(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error en la suscripción en tiempo real:', err);
        setError('Error al actualizar la información de suscripción');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Verificar si la suscripción está activa
  const isActive = subscription?.status === 'active';
  
  // Verificar si está en período de prueba
  const isInTrialPeriod = () => {
    if (!subscription?.trialEnd) return false;
    const trialEnd = subscription.trialEnd instanceof Date 
      ? subscription.trialEnd 
      : subscription.trialEnd.toDate();
    return trialEnd > new Date();
  };
  
  // Obtener días restantes de prueba
  const getRemainingTrialDays = () => {
    if (!subscription?.trialEnd) return 0;
    const trialEnd = subscription.trialEnd instanceof Date 
      ? subscription.trialEnd 
      : subscription.trialEnd.toDate();
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Verificar si la suscripción está por expirar (7 días o menos)
  const isExpiringSoon = () => {
    if (!subscription?.currentPeriodEnd) return false;
    const endDate = subscription.currentPeriodEnd instanceof Date 
      ? subscription.currentPeriodEnd 
      : subscription.currentPeriodEnd.toDate();
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };
  
  // Obtener fecha de renovación formateada
  const getFormattedRenewalDate = () => {
    if (!subscription?.currentPeriodEnd) return '';
    const endDate = subscription.currentPeriodEnd instanceof Date 
      ? subscription.currentPeriodEnd 
      : subscription.currentPeriodEnd.toDate();
    return endDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return {
    subscription,
    loading,
    error,
    isActive,
    isInTrialPeriod,
    getRemainingTrialDays,
    isExpiringSoon,
    getFormattedRenewalDate
  };
}