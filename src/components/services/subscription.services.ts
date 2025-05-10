import { doc, getDoc, setDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-config';
import { Plan, PLAN_FEATURES, PLAN_DISPLAY_NAMES, planIncludesFeature, isPremiumPlan } from '@/lib/subscription';
import { Subscription, SubscriptionPeriod, SubscriptionDocument } from '@/types/subscription';

export class SubscriptionService {
  /**
   * Obtiene la suscripción de un usuario
   * @param userId ID del usuario
   * @returns Datos de la suscripción o null si no existe
   */
  static async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      // Intentar obtener la suscripción desde la colección 'subscriptions'
      const subscriptionDoc = await getDoc(doc(db, 'subscriptions', userId));
      
      if (subscriptionDoc.exists()) {
        const data = subscriptionDoc.data() as SubscriptionDocument;
        
        return {
          status: data.status,
          planId: data.planId,
          plan: data.plan || '',
          paypalSubscriptionId: data.paypalSubscriptionId || null,
          paypalPlanId: data.paypalPlanId || null,
          currentPeriodStart: data.currentPeriodStart,
          currentPeriodEnd: data.currentPeriodEnd,
          trialEnd: data.trialEnd || null,
          cancelAtPeriodEnd: data.cancelAtPeriodEnd || false
        };
      }
      
      // Si no existe, intentar obtener desde el documento del usuario
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.subscription) {
          return userData.subscription as Subscription;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener suscripción:', error);
      throw error;
    }
  }
  
  /**
   * Crea o actualiza una suscripción
   * @param userId ID del usuario
   * @param data Datos de la suscripción
   * @returns Datos de la suscripción creada o actualizada
   */
  static async createOrUpdateSubscription(
    userId: string, 
    data: Partial<Subscription>
  ): Promise<Subscription> {
    try {
      const now = new Date();
      const subscriptionRef = doc(db, 'subscriptions', userId);
      
      // Verificar si ya existe
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (subscriptionDoc.exists()) {
        // Actualizar suscripción existente
        await updateDoc(subscriptionRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
        
        const updatedDoc = await getDoc(subscriptionRef);
        const updatedData = updatedDoc.data() as SubscriptionDocument;
        
        return {
          status: updatedData.status,
          planId: updatedData.planId,
          plan: updatedData.plan || '',
          paypalSubscriptionId: updatedData.paypalSubscriptionId || null,
          paypalPlanId: updatedData.paypalPlanId || null,
          currentPeriodStart: updatedData.currentPeriodStart,
          currentPeriodEnd: updatedData.currentPeriodEnd,
          trialEnd: updatedData.trialEnd || null,
          cancelAtPeriodEnd: updatedData.cancelAtPeriodEnd || false
        };
      } else {
        // Crear nueva suscripción
        const planId = data.planId || 'basic';
        const period = 'month' as SubscriptionPeriod;
        
        // Calcular fecha de fin del período actual
        const currentPeriodEnd = new Date(now);
        if (period === 'month') {
          currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
        } else {
          currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
        }
        
        // Calcular fecha de fin de prueba si aplica
        let trialEnd = null;
        if (data.trialEnd) {
          trialEnd = data.trialEnd;
        } else if (planId !== 'basic') {
          // Período de prueba de 7 días para planes pagos
          trialEnd = new Date(now);
          trialEnd.setDate(trialEnd.getDate() + 7);
        }
        
        const subscriptionData: SubscriptionDocument = {
          userId,
          planId,
          status: data.status || 'active',
          plan: data.plan || PLAN_DISPLAY_NAMES[planId as keyof typeof PLAN_DISPLAY_NAMES] || '',
          paypalSubscriptionId: data.paypalSubscriptionId || null,
          paypalPlanId: data.paypalPlanId || null,
          orderId: null,
          createdAt: Timestamp.fromDate(now),
          updatedAt: Timestamp.fromDate(now),
          paymentProvider: 'none',
          period,
          currentPeriodStart: Timestamp.fromDate(now),
          currentPeriodEnd: Timestamp.fromDate(currentPeriodEnd),
          ...(trialEnd && { trialEnd: trialEnd instanceof Date ? Timestamp.fromDate(trialEnd) : trialEnd }),
          cancelAtPeriodEnd: data.cancelAtPeriodEnd || false
        };
        
        await setDoc(subscriptionRef, subscriptionData);
        
        // Actualizar también en el documento del usuario
        await updateDoc(doc(db, 'users', userId), {
          'subscription.status': subscriptionData.status,
          'subscription.planId': subscriptionData.planId,
          'subscription.plan': subscriptionData.plan,
          'subscription.currentPeriodStart': subscriptionData.currentPeriodStart,
          'subscription.currentPeriodEnd': subscriptionData.currentPeriodEnd,
          ...(trialEnd && { 'subscription.trialEnd': trialEnd instanceof Date ? Timestamp.fromDate(trialEnd) : trialEnd }),
          'subscription.cancelAtPeriodEnd': subscriptionData.cancelAtPeriodEnd,
          updatedAt: serverTimestamp()
        });
        
        return {
          status: subscriptionData.status,
          planId: subscriptionData.planId,
          plan: subscriptionData.plan,
          paypalSubscriptionId: subscriptionData.paypalSubscriptionId,
          paypalPlanId: subscriptionData.paypalPlanId,
          currentPeriodStart: subscriptionData.currentPeriodStart,
          currentPeriodEnd: subscriptionData.currentPeriodEnd,
          trialEnd: subscriptionData.trialEnd,
          cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd
        };
      }
    } catch (error) {
      console.error('Error al crear/actualizar suscripción:', error);
      throw error;
    }
  }
  
  /**
   * Cancela una suscripción
   * @param userId ID del usuario
   * @returns Datos de la suscripción cancelada
   */
  static async cancelSubscription(userId: string): Promise<Subscription | null> {
    try {
      const subscriptionRef = doc(db, 'subscriptions', userId);
      const subscriptionDoc = await getDoc(subscriptionRef);
      
      if (!subscriptionDoc.exists()) {
        return null;
      }
      
      await updateDoc(subscriptionRef, {
        status: 'canceled',
        cancelAtPeriodEnd: true,
        updatedAt: serverTimestamp()
      });
      
      // Actualizar también en el documento del usuario
      await updateDoc(doc(db, 'users', userId), {
        'subscription.status': 'canceled',
        'subscription.cancelAtPeriodEnd': true,
        updatedAt: serverTimestamp()
      });
      
      const updatedDoc = await getDoc(subscriptionRef);
      const data = updatedDoc.data() as SubscriptionDocument;
      
      return {
        status: data.status,
        planId: data.planId,
        plan: data.plan || '',
        paypalSubscriptionId: data.paypalSubscriptionId || null,
        paypalPlanId: data.paypalPlanId || null,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        trialEnd: data.trialEnd || null,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd || false
      };
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      throw error;
    }
  }
  
  /**
   * Activa el plan gratuito para un usuario
   * @param userId ID del usuario
   * @returns Datos de la suscripción creada
   */
  static async activateFreePlan(userId: string): Promise<Subscription> {
    try {
      const now = new Date();
      
      // Fecha de fin muy lejana para el plan gratuito
      const farFutureDate = new Date(now);
      farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);
      
      const subscriptionData: SubscriptionDocument = {
        userId,
        planId: 'basic',
        status: 'active',
        plan: PLAN_DISPLAY_NAMES['basic'],
        paypalSubscriptionId: null,
        paypalPlanId: null,
        orderId: null,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now),
        paymentProvider: 'none',
        period: 'month',
        currentPeriodStart: Timestamp.fromDate(now),
        currentPeriodEnd: Timestamp.fromDate(farFutureDate),
        cancelAtPeriodEnd: false
      };
      
      await setDoc(doc(db, 'subscriptions', userId), subscriptionData);
      
      // Actualizar también en el documento del usuario
      await updateDoc(doc(db, 'users', userId), {
        planStatus: 'active',
        'subscription.status': 'active',
        'subscription.planId': 'basic',
        'subscription.plan': PLAN_DISPLAY_NAMES['basic'],
        'subscription.currentPeriodStart': Timestamp.fromDate(now),
        'subscription.currentPeriodEnd': Timestamp.fromDate(farFutureDate),
        'subscription.cancelAtPeriodEnd': false,
        updatedAt: serverTimestamp()
      });
      
      return {
        status: subscriptionData.status,
        planId: subscriptionData.planId,
        plan: subscriptionData.plan,
        paypalSubscriptionId: null,
        paypalPlanId: null,
        currentPeriodStart: subscriptionData.currentPeriodStart,
        currentPeriodEnd: subscriptionData.currentPeriodEnd,
        cancelAtPeriodEnd: false
      };
    } catch (error) {
      console.error('Error al activar plan gratuito:', error);
      throw error;
    }
  }
  
  /**
   * Verifica si una característica está incluida en el plan actual
   * @param userId ID del usuario
   * @param feature Característica a verificar
   * @returns Booleano indicando si la característica está disponible
   */
  static async hasFeature(
    userId: string, 
    feature: keyof typeof PLAN_FEATURES[Plan]
  ): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(userId);
      
      if (!subscription) {
        return false;
      }
      
      // Si la suscripción no está activa, no tiene acceso a características premium
      if (subscription.status !== 'active' && !subscription.trialEnd) {
        return false;
      }
      
      // Si está en período de prueba, verificar
      if (subscription.trialEnd) {
        const trialEnd = subscription.trialEnd instanceof Date 
          ? subscription.trialEnd 
          : subscription.trialEnd.toDate();
          
        if (trialEnd < new Date()) {
          return false;
        }
      }
      
      return planIncludesFeature(subscription.planId as Plan, feature);
    } catch (error) {
      console.error('Error al verificar característica:', error);
      return false;
    }
  }
  
  /**
   * Verifica si el usuario tiene un plan premium
   * @param userId ID del usuario
   * @returns Booleano indicando si tiene plan premium
   */
  static async hasPremiumPlan(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(userId);
      
      if (!subscription) {
        return false;
      }
      
      // Si la suscripción no está activa, no tiene acceso premium
      if (subscription.status !== 'active' && !subscription.trialEnd) {
        return false;
      }
      
      // Si está en período de prueba, verificar
      if (subscription.trialEnd) {
        const trialEnd = subscription.trialEnd instanceof Date 
          ? subscription.trialEnd 
          : subscription.trialEnd.toDate();
          
        if (trialEnd < new Date()) {
          return false;
        }
      }
      
      return isPremiumPlan(subscription.planId as Plan);
    } catch (error) {
      console.error('Error al verificar plan premium:', error);
      return false;
    }
  }
}