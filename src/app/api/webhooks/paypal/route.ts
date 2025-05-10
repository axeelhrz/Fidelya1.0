import { NextRequest, NextResponse } from 'next/server';
import { updateSubscriptionStatus } from '@/lib/paypal';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;
    const resource = body.resource;

    const subscriptionId = resource.id;
    const status = resource.status;
    const userId = resource.custom_id;

    if (!userId || !subscriptionId) {
      return NextResponse.json({ error: 'Faltan datos necesarios del webhook' }, { status: 400 });
    }

    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED') {
      console.log('✅ Suscripción activada:', subscriptionId);

      const planId = resource.plan_id;
      const period = 'month'; // 🔁 Cambia a 'year' si lo detectás desde resource o plan
      const trialDays = 7; // Si usás días de prueba, colócalo aquí dinámicamente si querés

      await updateSubscriptionStatus(userId, subscriptionId, status, planId, period, trialDays);

      return NextResponse.json({ success: true });
    }

    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') {
      console.log('⚠️ Suscripción cancelada:', subscriptionId);

      await updateDoc(doc(db, 'users', userId), {
        planStatus: 'cancelled',
        'subscription.status': 'cancelled',
        updatedAt: new Date()
      });

      return NextResponse.json({ success: true });
    }

    // Ignorar otros eventos por ahora
    return NextResponse.json({ message: 'Evento ignorado' });
  } catch (error) {
    console.error('❌ Error en webhook de PayPal:', error);
    return NextResponse.json({ error: 'Error en webhook' }, { status: 500 });
  }
}
