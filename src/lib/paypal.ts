import { db } from './firebase';
import { doc, updateDoc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getSiteUrl } from './get-site-url';

// Configuración de PayPal
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_API_URL = process.env.NEXT_PUBLIC_PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

// Interfaces para PayPal
export interface PayPalSubscriptionResponse {
  id: string;
  status: string;
  create_time: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  subscriber: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
  billing_info: {
    outstanding_balance: {
      value: string;
      currency_code: string;
    };
    cycle_executions: Array<{
      tenure_type: string;
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
      current_pricing_scheme_version: number;
    }>;
    last_payment: {
      amount: {
        value: string;
        currency_code: string;
      };
      time: string;
    };
    next_billing_time: string;
    failed_payments_count: number;
  };
}

// Función para obtener token de acceso de PayPal
export async function getPayPalAccessToken(): Promise<string> {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo token de PayPal: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error al obtener token de PayPal:', error);
    throw error;
  }
}

// Función para crear una suscripción en PayPal
export async function createPayPalSubscription(
  planId: string,
  userId: string,
  userEmail: string,
  userName: string
): Promise<PayPalSubscriptionResponse> {
  try {
    const accessToken = await getPayPalAccessToken();
    const siteUrl = getSiteUrl();

    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
body: JSON.stringify({
  plan_id: planId,
  custom_id: userId, // ✅ esto permite al webhook identificar al usuario
  subscriber: {
    name: {
      given_name: userName.split(' ')[0],
      surname: userName.split(' ').slice(1).join(' ') || ''
    },
    email_address: userEmail
  },
  application_context: {
    brand_name: 'Assuriva',
    locale: 'es-ES',
    shipping_preference: 'NO_SHIPPING',
    user_action: 'SUBSCRIBE_NOW',
    payment_method: {
      payer_selected: 'PAYPAL',
      payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
    },
    return_url: `${siteUrl}/auth/after-checkout?success=true&userId=${userId}`,
    cancel_url: `${siteUrl}/subscribe?canceled=true&userId=${userId}`
  }
})
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error creando suscripción en PayPal: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al crear suscripción en PayPal:', error);
    throw error;
  }
}

// Función para verificar el estado de una suscripción en PayPal
export async function verifyPayPalSubscription(subscriptionId: string): Promise<PayPalSubscriptionResponse> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error verificando suscripción en PayPal: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al verificar suscripción en PayPal:', error);
    throw error;
  }
}

// Función para actualizar el estado de la suscripción en Firestore
export async function updateSubscriptionStatus(
  userId: string, 
  paypalSubscriptionId: string, 
  status: string,
  planId: string,
  period: 'month' | 'year',
  trialDays: number = 0
) {
  try {
    const now = new Date();
    
    // Calcular fecha de fin del período actual
    const currentPeriodEnd = new Date(now);
    if (period === 'month') {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }
    
    // Calcular fecha de fin de prueba si aplica
    let trialEnd = null;
    if (trialDays > 0) {
      trialEnd = new Date(now);
      trialEnd.setDate(trialEnd.getDate() + trialDays);
    }
    
    // Actualizar documento del usuario
    await updateDoc(doc(db, 'users', userId), {
      paypalSubscriptionId,
      planStatus: 'active',
      'subscription.status': 'active',
      'subscription.paypalSubscriptionId': paypalSubscriptionId,
      'subscription.currentPeriodStart': now,
      'subscription.currentPeriodEnd': currentPeriodEnd,
      ...(trialEnd && { 'subscription.trialEnd': trialEnd }),
      updatedAt: serverTimestamp()
    });
    
    // Crear documento en la colección subscriptions
    await setDoc(doc(db, 'subscriptions', userId), {
      userId,
      planId,
      status: 'active',
      paypalSubscriptionId,
      orderId: null, // PayPal no proporciona orderId para suscripciones
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      paymentProvider: 'paypal',
      period,
      currentPeriodStart: now,
      currentPeriodEnd: currentPeriodEnd,
      ...(trialEnd && { trialEnd }),
      cancelAtPeriodEnd: false
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar estado de suscripción:', error);
    throw error;
  }
}

// Función para cancelar una suscripción en PayPal
export async function cancelPayPalSubscription(subscriptionId: string, reason: string = 'Cancelación solicitada por el usuario'): Promise<boolean> {
  try {
    const accessToken = await getPayPalAccessToken();
    
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        reason
      })
    });

    if (!response.ok) {
      throw new Error(`Error cancelando suscripción en PayPal: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error al cancelar suscripción en PayPal:', error);
    throw error;
  }
}

// Función para activar el plan gratuito
export async function activateFreePlan(userId: string) {
  try {
    const now = new Date();
    const currentPeriodEnd = new Date(now);
    currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 100); // Plan básico "para siempre"
    
    // Verificar si el documento del usuario existe
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    // Si el documento existe, actualizarlo; si no, crearlo
    if (userDoc.exists()) {
      // Actualizar documento del usuario
      await updateDoc(userDocRef, {
        planStatus: 'active',
        planName: 'Básico',
        plan: 'basic',
        'subscription.status': 'active',
        'subscription.planId': 'basic',
        'subscription.plan': 'Básico',
        'subscription.currentPeriodStart': now,
        'subscription.currentPeriodEnd': currentPeriodEnd,
        updatedAt: serverTimestamp()
      });
    } else {
      // Crear un nuevo documento de usuario con datos básicos
      await setDoc(userDocRef, {
        uid: userId,
        email: '',  // Se actualizará cuando tengamos la información del usuario
        displayName: '',
        emailVerified: false,
        planStatus: 'active',
        planName: 'Básico',
        plan: 'basic',
        verified: false,
        role: 'user',
        subscription: {
          status: 'active',
          planId: 'basic',
          plan: 'Básico',
          currentPeriodStart: now,
          currentPeriodEnd: currentPeriodEnd,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Crear documento en la colección subscriptions
    await setDoc(doc(db, 'subscriptions', userId), {
      userId,
      planId: 'basic',
      plan: 'Básico',
      status: 'active',
      paypalSubscriptionId: null,
      orderId: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      paymentProvider: 'none',
      period: 'month',
      currentPeriodStart: now,
      currentPeriodEnd: currentPeriodEnd,
      cancelAtPeriodEnd: false
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error al activar plan gratuito:', error);
    throw error;
  }
}