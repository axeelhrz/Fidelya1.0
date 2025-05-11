'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { Subscription } from '@/types/subscription';
import { SubscriptionService } from '@/components/services/subscription.services';
import { PLAN_FEATURES, Plan } from '@/lib/subscription';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar suscripción
  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const subscriptionData = await SubscriptionService.getSubscription(user.uid);
        setSubscription(subscriptionData);
      } catch (err) {
        console.error('Error al cargar suscripción:', err);
        setError('Error al cargar la información de suscripción');
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [user]);

  // Verificar si la suscripción está activa
  const isActive = subscription?.status === 'active';
  
  // Verificar si está en período de prueba
  const isInTrialPeriod = useCallback(() => {
    if (!subscription?.trialEnd) return false;
    
    const trialEnd = subscription.trialEnd instanceof Date 
      ? subscription.trialEnd 
      : subscription.trialEnd.toDate();
      
    return trialEnd > new Date();
  }, [subscription]);
  
  // Obtener días restantes de prueba
  const getRemainingTrialDays = useCallback(() => {
    if (!subscription?.trialEnd) return 0;
    
    const trialEnd = subscription.trialEnd instanceof Date 
      ? subscription.trialEnd 
      : subscription.trialEnd.toDate();
      
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [subscription]);
  
  // Verificar si la suscripción está por expirar (7 días o menos)
  const isExpiringSoon = useCallback(() => {
    if (!subscription?.currentPeriodEnd) return false;
    
    const endDate = subscription.currentPeriodEnd instanceof Date 
      ? subscription.currentPeriodEnd 
      : subscription.currentPeriodEnd.toDate();
      
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 7 && diffDays > 0;
  }, [subscription]);
  
  // Obtener fecha de renovación formateada
  const getFormattedRenewalDate = useCallback(() => {
    if (!subscription?.currentPeriodEnd) return '';
    
    const endDate = subscription.currentPeriodEnd instanceof Date 
      ? subscription.currentPeriodEnd 
      : subscription.currentPeriodEnd.toDate();
      
    return endDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [subscription]);

  // Verificar si una característica está incluida en el plan actual
  const hasFeature = useCallback(async (feature: keyof typeof PLAN_FEATURES[Plan]) => {
    if (!user || !subscription) return false;
    
    // Si la suscripción no está activa, no tiene acceso a características premium
    if (subscription.status !== 'active' && !isInTrialPeriod()) {
      return false;
    }
    
    return SubscriptionService.hasFeature(user.uid, feature);
  }, [subscription, isInTrialPeriod, user]);

  // Cancelar suscripción
  const cancelSubscription = async (): Promise<boolean> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const canceledSubscription = await SubscriptionService.cancelSubscription(user.uid);
      
      if (canceledSubscription) {
        setSubscription(canceledSubscription);
      }
      
      return true;
    } catch (err) {
      console.error('Error al cancelar suscripción:', err);
      setError('Error al cancelar la suscripción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Activar plan gratuito
  const activateFreePlan = async (): Promise<boolean> => {
    if (!user) {
      setError('No hay usuario autenticado');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamar a la API para activar el plan gratuito
      const token = await user.getIdToken();
      const response = await fetch('/api/activate-free-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al activar el plan gratuito');
      }
      
      // Recargar la suscripción
      const freeSubscription = await SubscriptionService.getSubscription(user.uid);
      setSubscription(freeSubscription);
      
      return true;
    } catch (err) {
      console.error('Error al activar plan gratuito:', err);
      setError(err instanceof Error ? err.message : 'Error al activar el plan gratuito');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verificar si el usuario tiene un plan premium
  const hasPremiumPlan = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    return SubscriptionService.hasPremiumPlan(user.uid);
  }, [user]);

  return {
    subscription,
    loading,
    error,
    isActive,
    isInTrialPeriod,
    getRemainingTrialDays,
    isExpiringSoon,
    getFormattedRenewalDate,
    hasFeature,
    hasPremiumPlan,
    cancelSubscription,
    activateFreePlan
  };
}