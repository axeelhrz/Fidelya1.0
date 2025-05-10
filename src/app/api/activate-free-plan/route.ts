import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { activateFreePlan } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const adminAuth = getAuth();
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    // Activar plan gratuito
    await activateFreePlan(userId);
    
    return NextResponse.json({ success: true, message: 'Plan básico activado correctamente' });
  } catch (error) {
    console.error('Error al activar plan básico:', error);
    return NextResponse.json(
      { error: 'Error al activar plan básico', details: (error as Error).message },
      { status: 500 }
    );
  }
}