import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin'; // Importamos directamente auth y db que ya están inicializados

export async function POST(request: NextRequest) {
  try {
    // Obtener token de autorización
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No se proporcionó un token de autorización válido' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verificar token
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Token de autorización inválido' },
        { status: 401 }
      );
    }
    
    // Verificar si el usuario existe
    const userRecord = await auth.getUser(userId);
    
    if (!userRecord) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // Fecha actual y fecha futura lejana (100 años)
    const now = new Date();
    const farFutureDate = new Date(now);
    farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);
    
    // Usar set con merge en lugar de update para el documento de usuario
    // Esto creará el documento si no existe o lo actualizará si ya existe
    await db.collection('users').doc(userId).set({
      plan: 'basic',
      planStatus: 'active',
      'subscription.status': 'active',
      'subscription.planId': 'basic',
      'subscription.plan': 'Básico',
      'subscription.currentPeriodStart': now,
      'subscription.currentPeriodEnd': farFutureDate,
      'subscription.cancelAtPeriodEnd': false,
      updatedAt: now
    }, { merge: true });
    
    // Crear o actualizar documento de suscripción
    const subscriptionRef = db.collection('subscriptions').doc(userId);
    const subscriptionDoc = await subscriptionRef.get();
    
    if (subscriptionDoc.exists) {
      await subscriptionRef.update({
        planId: 'basic',
        status: 'active',
        plan: 'Básico',
        currentPeriodStart: now,
        currentPeriodEnd: farFutureDate,
        cancelAtPeriodEnd: false,
        updatedAt: now
      });
    } else {
      await subscriptionRef.set({
        userId,
        planId: 'basic',
        status: 'active',
        plan: 'Básico',
        paypalSubscriptionId: null,
        paypalPlanId: null,
        orderId: null,
        createdAt: now,
        updatedAt: now,
        paymentProvider: 'none',
        period: 'month',
        currentPeriodStart: now,
        currentPeriodEnd: farFutureDate,
        cancelAtPeriodEnd: false
      });
    }
    
    return NextResponse.json(
      { success: true, message: 'Plan básico activado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al activar plan básico:', error);
    
    return NextResponse.json(
      { error: 'Error al activar el plan básico' },
      { status: 500 }
    );
  }
}