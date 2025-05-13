import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { verifyPayPalSubscription } from '@/lib/paypal';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    // Verificar que la solicitud sea de PayPal (en producción, deberías verificar la firma)
    const payload = await request.json();
    
    // Verificar el tipo de evento
    const eventType = payload.event_type;
    
    // Solo procesar eventos de suscripción
    if (!eventType || !eventType.startsWith('BILLING.SUBSCRIPTION.')) {
      return NextResponse.json({ success: true, message: 'Evento ignorado' });
    }
    
    // Obtener ID de suscripción y recurso
    const subscriptionId = payload.resource?.id;
    if (!subscriptionId) {
      throw new Error('ID de suscripción no encontrado en el payload');
    }

    // Obtener detalles de la suscripción desde PayPal
    const subscription = await verifyPayPalSubscription(subscriptionId);
    
    // Obtener el ID de usuario desde el custom_id
    let userId;
    if (typeof subscription.custom === 'string') {
      try {
        const customObj = JSON.parse(subscription.custom);
        userId = customObj.id;
      } catch {
        // Si no se puede parsear, usar el valor como está
        userId = subscription.custom;
      }
    } else if (subscription.custom && typeof subscription.custom === 'object' && 'id' in subscription.custom) {
      userId = (subscription.custom as { id: string }).id;
    } else {
      userId = subscription.custom_id;
    }
    
    if (!userId) {
      throw new Error('ID de usuario no encontrado en la suscripción');
    }

    // Determinar el estado de la suscripción
    let status = 'active';
    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') {
      status = 'canceled';
    } else if (eventType === 'BILLING.SUBSCRIPTION.SUSPENDED') {
      status = 'suspended';
    } else if (eventType === 'BILLING.SUBSCRIPTION.EXPIRED') {
      status = 'expired';
    }
    
    // Determinar el plan basado en el plan_id de PayPal
    const paypalPlanId = subscription.plan_id;
    let planId = 'basic';
    let planName = 'Básico';
    
    if (paypalPlanId === process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID) {
      planId = 'professional';
      planName = 'Profesional';
    } else if (paypalPlanId === process.env.NEXT_PUBLIC_PAYPAL_ENTERPRISE_PLAN_ID) {
      planId = 'enterprise';
      planName = 'Empresarial';
    }
    
    // Calcular fechas de período
    const now = new Date();
    const currentPeriodStart = now;
    let currentPeriodEnd = now;
    let trialEnd = null;
    
    if (subscription.billing_info?.next_billing_time) {
      currentPeriodEnd = new Date(subscription.billing_info.next_billing_time);
    }
    
    // Si hay un período de prueba
    if (subscription.billing_info?.cycle_executions?.[0]?.tenure_type === 'TRIAL') {
      const trialDays = 7; // Asumimos 7 días de prueba
      trialEnd = new Date(now);
      trialEnd.setDate(trialEnd.getDate() + trialDays);
    }
    
    // Actualizar documento de usuario
    await db.collection('users').doc(userId).set({
      planStatus: status,
      plan: planId,
      planName: planName,
      'subscription.status': status,
      'subscription.planId': planId,
      'subscription.plan': planName,
      'subscription.paypalSubscriptionId': subscriptionId,
      'subscription.paypalPlanId': paypalPlanId,
      'subscription.currentPeriodStart': currentPeriodStart,
      'subscription.currentPeriodEnd': currentPeriodEnd,
      ...(trialEnd && { 'subscription.trialEnd': trialEnd }),
      updatedAt: Timestamp.now()
    }, { merge: true });
    
    // Actualizar documento de suscripción
    const subscriptionRef = db.collection('subscriptions').doc(userId);
    const subscriptionDoc = await subscriptionRef.get();
    
    if (subscriptionDoc.exists) {
      await subscriptionRef.update({
        status: status,
        planId: planId,
        plan: planName,
        paypalSubscriptionId: subscriptionId,
        paypalPlanId: paypalPlanId,
        currentPeriodStart: currentPeriodStart,
        currentPeriodEnd: currentPeriodEnd,
        ...(trialEnd && { trialEnd: trialEnd }),
        updatedAt: Timestamp.now()
      });
    } else {
      await subscriptionRef.set({
        userId: userId,
        status: status,
        planId: planId,
        plan: planName,
        paypalSubscriptionId: subscriptionId,
        paypalPlanId: paypalPlanId,
        paymentProvider: 'paypal',
        period: 'month', // Asumimos mensual por defecto
        currentPeriodStart: currentPeriodStart,
        currentPeriodEnd: currentPeriodEnd,
        ...(trialEnd && { trialEnd: trialEnd }),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        cancelAtPeriodEnd: false
      });
    }

      return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error procesando webhook de PayPal:', error);
    
    return NextResponse.json(
      { error: 'Error procesando webhook', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
