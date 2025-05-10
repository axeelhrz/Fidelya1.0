import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebaseAdmin'; // Import from admin SDK
import { verifyPayPalSubscription, updateSubscriptionStatus } from '@/lib/paypal';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();
    const { subscriptionId } = body;
    
    if (!subscriptionId) {
      return NextResponse.json({ error: 'ID de suscripción no proporcionado' }, { status: 400 });
    }
    
    // Verificar suscripción en PayPal
    const subscription = await verifyPayPalSubscription(subscriptionId);
    
    if (subscription.status !== 'ACTIVE' && subscription.status !== 'APPROVED') {
      return NextResponse.json({ 
        success: false, 
        status: subscription.status,
        message: 'La suscripción no está activa' 
      });
    }
    
    // Obtener datos del usuario para determinar el plan y período
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    const userData = userDoc.data();
    const planId = userData.subscription?.planId || 'pro';
    const period = userData.subscription?.planDetails?.period || 'month';
    const trialDays = userData.subscription?.planDetails?.trialDays || 0;
    
    // Actualizar estado de suscripción en Firestore
    await updateSubscriptionStatus(userId, subscriptionId, subscription.status, planId, period, trialDays);
    
    return NextResponse.json({
      success: true,
      status: subscription.status,
      message: 'Suscripción verificada y actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al verificar sesión de PayPal:', error);
    return NextResponse.json(
      { error: 'Error al verificar sesión de PayPal', details: (error as Error).message },
      { status: 500 }
    );
  }
}