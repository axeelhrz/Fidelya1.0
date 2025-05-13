import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebaseAdmin';
import { createPayPalSubscription, PayPalSubscriptionResponse } from '@/lib/paypal';

// Define the link structure if not already defined in PayPalSubscriptionResponse
interface PayPalLink {
  href: string;
  rel: string;
  method?: string;
}

// Extend PayPalSubscriptionResponse if needed locally
interface ExtendedPayPalSubscriptionResponse extends PayPalSubscriptionResponse {
  links?: PayPalLink[];
}

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
    
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();
    const { planId } = body;
    
    if (!planId) {
      return NextResponse.json(
        { error: 'ID de plan no proporcionado' },
        { status: 400 }
      );
    }
    
    // Obtener información del usuario
    const userRecord = await auth.getUser(userId);
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Usuario no encontrado en la base de datos' },
        { status: 404 }
      );
    }
    
    const userData = userDoc.data();
    const userEmail = userRecord.email || userData?.email;
    const userName = userRecord.displayName || 
                    `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 
                    'Usuario';
    
    // Determinar el ID del plan de PayPal según el plan seleccionado
    let paypalPlanId: string;
    if (planId === 'professional') {
      paypalPlanId = process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID || '';
    } else if (planId === 'enterprise') {
      paypalPlanId = process.env.NEXT_PUBLIC_PAYPAL_ENTERPRISE_PLAN_ID || '';
    } else {
      return NextResponse.json(
        { error: 'Plan ID inválido' },
        { status: 400 }
      );
    }
    
    if (!paypalPlanId) {
      return NextResponse.json(
        { error: 'ID de plan de PayPal no configurado' },
        { status: 500 }
      );
    }
    
    // Crear suscripción en PayPal
    const subscription = await createPayPalSubscription(
      paypalPlanId,
      userId,
      userEmail,
      userName
    ) as ExtendedPayPalSubscriptionResponse;
    
    // Encontrar la URL de aprobación
    const approvalUrl = subscription.links?.find((link: PayPalLink) => link.rel === 'approve')?.href;
    
    if (!approvalUrl) {
      return NextResponse.json(
        { error: 'No se pudo obtener la URL de aprobación de PayPal' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      approvalUrl: approvalUrl
    });
  } catch (error) {
    console.error('Error al crear suscripción para actualización:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la actualización de suscripción',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}