import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import paypal from '@paypal/checkout-server-sdk';

// Configuración del entorno de PayPal
const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET!;
const environment = process.env.NODE_ENV === 'production'
  ? new paypal.core.LiveEnvironment(clientId, clientSecret)
  : new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Tipos
interface SubscriptionRequest {
  userId: string;
  subscriptionId: string;
  planId: 'basic' | 'pro' | 'enterprise';
}

interface UnvalidatedRequest {
  userId: unknown;
  subscriptionId: unknown;
  planId: unknown;
}

// Validación de la solicitud
const validateRequest = (data: UnvalidatedRequest): data is SubscriptionRequest => {
  return (
    typeof data.userId === 'string' &&
    typeof data.subscriptionId === 'string' &&
    typeof data.planId === 'string' &&
    ['basic', 'pro', 'enterprise'].includes(data.planId as string)
  );
};

export async function POST(request: Request) {
  try {
    const data: UnvalidatedRequest = await request.json();

    // Validar datos de entrada
    if (!validateRequest(data)) {
      return NextResponse.json(
        { error: 'Datos de suscripción inválidos' },
        { status: 400 }
      );
    }

    const { userId, subscriptionId, planId } = data;

    // Verificar si el usuario existe
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si ya existe una suscripción activa
    const subscriptionDoc = await getDoc(doc(db, 'subscriptions', userId));
    if (subscriptionDoc.exists() && subscriptionDoc.data().status === 'active') {
      return NextResponse.json(
        { error: 'Ya existe una suscripción activa' },
        { status: 400 }
      );
    }
    // Verificar suscripción en PayPal
    const paypalRequest = new paypal.orders.OrdersGetRequest(subscriptionId);
    const response = await client.execute(paypalRequest);
        
    if (response.result.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'La suscripción de PayPal no está activa' },
        { status: 400 }
      );
    }

    // Calcular fechas
    const startDate = new Date();
    const trialDays = planId === 'pro' ? 7 : 0;
    const trialEndDate = new Date(startDate);
    trialEndDate.setDate(trialEndDate.getDate() + trialDays);

    // Crear documento de suscripción
    await setDoc(doc(db, 'subscriptions', userId), {
      userId,
      planId,
      status: 'active',
      paypalSubscriptionId: subscriptionId,
      createdAt: serverTimestamp(),
      startDate: startDate,
      trialEndDate: trialDays > 0 ? trialEndDate : null,
      lastUpdated: serverTimestamp(),
      paymentProvider: 'paypal',
      planDetails: {
        name: planId === 'pro' ? 'Profesional' : 'Enterprise',
        price: planId === 'pro' ? 29.99 : 99.99,
        period: 'mes',
        trialDays,
      },
      paypalDetails: {
        subscriptionId,
        status: response.result.status,
        emailAddress: response.result.subscriber.email_address,
      }
    }, { merge: true });

    // Actualizar documento del usuario
    await setDoc(doc(db, 'users', userId), {
      subscription: {
        status: 'active',
        planId,
        updatedAt: serverTimestamp(),
      }
    }, { merge: true });

    // Registrar evento de suscripción
    await setDoc(doc(db, 'subscriptionEvents', `${userId}_${Date.now()}`), {
      userId,
      type: 'subscription_created',
      planId,
      subscriptionId,
      timestamp: serverTimestamp(),
      details: {
        provider: 'paypal',
        status: 'active',
        trialDays,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Suscripción activada correctamente',
      data: {
        subscriptionId,
        planId,
        status: 'active',
        startDate,
        trialEndDate: trialDays > 0 ? trialEndDate : null,
      }
    });

  } catch (error) {
    console.error('Error al procesar la suscripción:', error);



    // Error general
    return NextResponse.json({
      error: 'Error al procesar la suscripción',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
