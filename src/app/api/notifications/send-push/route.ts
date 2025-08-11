import { NextRequest, NextResponse } from 'next/server';

// Esta es una implementación simplificada para push notifications
// En un entorno de producción, deberías usar Firebase Admin SDK
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, title, body: messageBody, data } = body;

    // Validar datos requeridos
    if (!token || !title || !messageBody) {
      return NextResponse.json(
        { error: 'Missing required fields: token, title, body' },
        { status: 400 }
      );
    }

    // Obtener la clave del servidor FCM desde las variables de entorno
    const serverKey = process.env.FCM_SERVER_KEY;
    
    if (!serverKey) {
      console.warn('⚠️ FCM_SERVER_KEY not configured, push notification will be skipped');
      return NextResponse.json(
        { success: false, error: 'FCM server key not configured' },
        { status: 200 }
      );
    }

    // Preparar el payload para FCM
    const fcmPayload = {
      to: token,
      notification: {
        title,
        body: messageBody,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        click_action: data?.actionUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        tag: data?.notificationId || 'fidelya-notification',
      },
      data: {
        ...data,
        timestamp: Date.now().toString(),
      },
      android: {
        notification: {
          sound: 'default',
          priority: 'high',
          channel_id: 'fidelya_notifications'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    // Enviar a FCM
    const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fcmPayload)
    });

    if (fcmResponse.ok) {
      const result = await fcmResponse.json();
      
      if (result.success === 1) {
        console.log('✅ Push notification sent successfully');
        return NextResponse.json({
          success: true,
          messageId: result.multicast_id?.toString()
        });
      } else {
        console.error('❌ FCM error:', result);
        return NextResponse.json({
          success: false,
          error: result.results?.[0]?.error || 'FCM send failed'
        });
      }
    } else {
      const errorText = await fcmResponse.text();
      console.error('❌ FCM HTTP error:', errorText);
      return NextResponse.json({
        success: false,
        error: `FCM error: ${fcmResponse.status}`
      });
    }

  } catch (error) {
    console.error('❌ Error in push notification API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}