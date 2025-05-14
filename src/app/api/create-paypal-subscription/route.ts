import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import admin from '@/lib/firebaseAdmin'; // Import Firebase Admin SDK
import { createPayPalSubscription, PayPalSubscriptionResponse } from '@/lib/paypal';
import { doc, getDoc } from 'firebase/firestore';

// Define the PayPal link interface
interface PayPalLink {
  href: string;
  rel: string;
  method?: string;
}

// Extend the PayPalSubscriptionResponse interface if needed
interface ExtendedPayPalSubscriptionResponse extends PayPalSubscriptionResponse {
  links?: PayPalLink[];
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();
    const { paypalPlanId } = body;
    
    if (!paypalPlanId) {
      return NextResponse.json({ error: 'ID de plan de PayPal no proporcionado' }, { status: 400 });
    }
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    const userData = userDoc.data();
    if (!userData) {
      return NextResponse.json({ error: 'Datos de usuario no encontrados' }, { status: 404 });
    }
    
    const userEmail = userData.email;
    if (!userEmail) {
      return NextResponse.json({ error: 'Email de usuario no encontrado' }, { status: 400 });
    }
    
    const userName = userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
    
    // Crear suscripción en PayPal
    const subscription: ExtendedPayPalSubscriptionResponse = await createPayPalSubscription(paypalPlanId, userId, userEmail, userName);
    
    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      approvalUrl: subscription.links?.find((link: PayPalLink) => link.rel === 'approve')?.href
    });
  } catch (error) {
    console.error('Error al crear suscripción en PayPal:', error);
    return NextResponse.json(
      { error: 'Error al crear suscripción en PayPal', details: (error as Error).message },
      { status: 500 }
    );
  }
}