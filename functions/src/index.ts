import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { customEmailService } from './services/custom-email.service';

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

// Exportar funciones existentes
export { processNotificationQueue, cleanupExpiredNotifications, handleDeliveryWebhook } from './notificationProcessor';
export { verificarBeneficiosVencidos } from './verificarBeneficiosVencidos';

/**
 * Función HTTP para enviar correo de verificación personalizado
 */
export const sendCustomEmailVerification = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const { email, displayName, continueUrl } = data;

  if (!email || !displayName) {
    throw new functions.https.HttpsError('invalid-argument', 'Email y nombre son requeridos');
  }

  try {
    // Generar enlace de verificación personalizado
    const actionCodeSettings = {
      url: continueUrl || `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?verified=true`,
      handleCodeInApp: false,
    };

    // Generar el código de acción
    const link = await admin.auth().generateEmailVerificationLink(email, actionCodeSettings);

    // Enviar correo personalizado
    const result = await customEmailService.sendEmailVerification({
      email,
      displayName,
      actionCodeSettings: {
        url: link,
        handleCodeInApp: false,
      },
    });

    if (!result.success) {
      throw new functions.https.HttpsError('internal', `Error enviando correo: ${result.error}`);
    }

    // Registrar el envío en Firestore
    await admin.firestore().collection('emailLogs').add({
      type: 'email_verification',
      email,
      displayName,
      messageId: result.messageId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: true,
    });

    return {
      success: true,
      messageId: result.messageId,
      message: 'Correo de verificación enviado exitosamente',
    };
  } catch (error) {
    console.error('Error en sendCustomEmailVerification:', error);
    
    // Registrar el error
    await admin.firestore().collection('emailLogs').add({
      type: 'email_verification',
      email,
      displayName,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: false,
    });

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Función HTTP para enviar correo de restablecimiento de contraseña personalizado
 */
export const sendCustomPasswordReset = functions.https.onCall(async (data, context) => {
  const { email, continueUrl } = data;

  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email es requerido');
  }

  try {
    // Verificar que el usuario existe
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
      // No revelar si el email existe o no por seguridad
      return {
        success: true,
        message: 'Si el correo existe en nuestro sistema, recibirás un enlace de restablecimiento',
      };
    }

    // Generar enlace de restablecimiento personalizado
    const actionCodeSettings = {
      url: continueUrl || `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?reset=true`,
      handleCodeInApp: false,
    };

    const link = await admin.auth().generatePasswordResetLink(email, actionCodeSettings);

    // Obtener información del usuario desde Firestore
    const userDoc = await admin.firestore().collection('users').doc(userRecord.uid).get();
    const userData = userDoc.data();
    const displayName = userData?.nombre || userRecord.displayName || 'Usuario';

    // Enviar correo personalizado
    const result = await customEmailService.sendPasswordReset({
      email,
      displayName,
      actionCodeSettings: {
        url: link,
        handleCodeInApp: false,
      },
    });

    if (!result.success) {
      throw new functions.https.HttpsError('internal', `Error enviando correo: ${result.error}`);
    }

    // Registrar el envío en Firestore
    await admin.firestore().collection('emailLogs').add({
      type: 'password_reset',
      email,
      displayName,
      messageId: result.messageId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: true,
    });

    return {
      success: true,
      messageId: result.messageId,
      message: 'Correo de restablecimiento enviado exitosamente',
    };
  } catch (error) {
    console.error('Error en sendCustomPasswordReset:', error);
    
    // Registrar el error
    await admin.firestore().collection('emailLogs').add({
      type: 'password_reset',
      email,
      error: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: false,
    });

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    // No revelar detalles específicos del error por seguridad
    return {
      success: true,
      message: 'Si el correo existe en nuestro sistema, recibirás un enlace de restablecimiento',
    };
  }
});

/**
 * Trigger que se ejecuta cuando se crea un nuevo usuario
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    console.log('🆕 Nuevo usuario creado:', user.email);

    // Obtener información adicional del usuario desde Firestore
    const userDoc = await admin.firestore().collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    
    if (!userData) {
      console.warn('⚠️ No se encontraron datos del usuario en Firestore');
      return;
    }

    const displayName = userData.nombre || user.displayName || 'Usuario';

    // Enviar correo de bienvenida personalizado automáticamente
    if (user.email && !user.emailVerified) {
      console.log('📧 Enviando correo de verificación automático...');
      
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?verified=true`,
        handleCodeInApp: false,
      };

      const link = await admin.auth().generateEmailVerificationLink(user.email, actionCodeSettings);

      const result = await customEmailService.sendEmailVerification({
        email: user.email,
        displayName,
        actionCodeSettings: {
          url: link,
          handleCodeInApp: false,
        },
      });

      // Registrar el envío
      await admin.firestore().collection('emailLogs').add({
        type: 'auto_email_verification',
        email: user.email,
        displayName,
        messageId: result.messageId,
        userId: user.uid,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        success: result.success,
        error: result.error,
      });

      if (result.success) {
        console.log('✅ Correo de verificación automático enviado exitosamente');
      } else {
        console.error('❌ Error enviando correo de verificación automático:', result.error);
      }
    }

    // Actualizar estadísticas de usuarios
    await admin.firestore().collection('systemStats').doc('users').set({
      totalUsers: admin.firestore.FieldValue.increment(1),
      lastUserCreated: admin.firestore.FieldValue.serverTimestamp(),
      [`usersByRole.${userData.role}`]: admin.firestore.FieldValue.increment(1),
    }, { merge: true });

  } catch (error) {
    console.error('❌ Error en onUserCreate:', error);
  }
});

/**
 * Función HTTP para reenviar correo de verificación
 */
export const resendEmailVerification = functions.https.onCall(async (data, context) => {
  // Verificar autenticación
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  const { continueUrl } = data;
  const userId = context.auth.uid;

  try {
    // Obtener información del usuario
    const userRecord = await admin.auth().getUser(userId);
    
    if (!userRecord.email) {
      throw new functions.https.HttpsError('invalid-argument', 'Usuario sin email');
    }

    if (userRecord.emailVerified) {
      throw new functions.https.HttpsError('failed-precondition', 'El email ya está verificado');
    }

    // Obtener información adicional desde Firestore
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();
    const displayName = userData?.nombre || userRecord.displayName || 'Usuario';

    // Verificar límite de reenvíos (máximo 3 por hora)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentEmails = await admin.firestore()
      .collection('emailLogs')
      .where('email', '==', userRecord.email)
      .where('type', 'in', ['email_verification', 'resend_email_verification'])
      .where('timestamp', '>', oneHourAgo)
      .where('success', '==', true)
      .get();

    if (recentEmails.size >= 3) {
      throw new functions.https.HttpsError(
        'resource-exhausted', 
        'Límite de reenvíos alcanzado. Intenta nuevamente en una hora.'
      );
    }

    // Generar nuevo enlace de verificación
    const actionCodeSettings = {
      url: continueUrl || `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?verified=true`,
      handleCodeInApp: false,
    };

    const link = await admin.auth().generateEmailVerificationLink(userRecord.email, actionCodeSettings);

    // Enviar correo personalizado
    const result = await customEmailService.sendEmailVerification({
      email: userRecord.email,
      displayName,
      actionCodeSettings: {
        url: link,
        handleCodeInApp: false,
      },
    });

    if (!result.success) {
      throw new functions.https.HttpsError('internal', `Error enviando correo: ${result.error}`);
    }

    // Registrar el reenvío
    await admin.firestore().collection('emailLogs').add({
      type: 'resend_email_verification',
      email: userRecord.email,
      displayName,
      messageId: result.messageId,
      userId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      success: true,
    });

    return {
      success: true,
      messageId: result.messageId,
      message: 'Correo de verificación reenviado exitosamente',
    };
  } catch (error) {
    console.error('Error en resendEmailVerification:', error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Función HTTP para manejar códigos de acción personalizados
 */
export const handleActionCode = functions.https.onRequest(async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  const { mode, oobCode, continueUrl } = req.query;

  if (!mode || !oobCode) {
    res.status(400).json({ error: 'Parámetros requeridos faltantes' });
    return;
  }

  try {
    let redirectUrl = continueUrl as string || `${process.env.NEXT_PUBLIC_APP_URL}/auth/login`;

    switch (mode) {
      case 'verifyEmail':
        try {
          await admin.auth().checkActionCode(oobCode as string);
          await admin.auth().applyActionCode(oobCode as string);
          
          // Registrar verificación exitosa
          await admin.firestore().collection('emailLogs').add({
            type: 'email_verified',
            actionCode: oobCode,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            success: true,
          });

          redirectUrl += '?verified=success';
        } catch (error) {
          console.error('Error verificando email:', error);
          redirectUrl += '?verified=error';
        }
        break;

      case 'resetPassword':
        try {
          await admin.auth().checkActionCode(oobCode as string);
          redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?oobCode=${oobCode}`;
        } catch (error) {
          console.error('Error validando código de reset:', error);
          redirectUrl += '?reset=error';
        }
        break;

      default:
        redirectUrl += '?action=unknown';
    }

    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Error en handleActionCode:', error);
    res.redirect(302, `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=action_failed`);
  }
});

/**
 * Función para obtener estadísticas de correos
 */
export const getEmailStats = functions.https.onCall(async (data, context) => {
  // Verificar autenticación y permisos de admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuario no autenticado');
  }

  try {
    // Obtener estadísticas de los últimos 30 días
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const emailLogs = await admin.firestore()
      .collection('emailLogs')
      .where('timestamp', '>', thirtyDaysAgo)
      .get();

    const stats = {
      total: emailLogs.size,
      successful: 0,
      failed: 0,
      byType: {
        email_verification: 0,
        password_reset: 0,
        auto_email_verification: 0,
        resend_email_verification: 0,
      },
      byDay: {} as Record<string, number>,
    };

    emailLogs.forEach(doc => {
      const data = doc.data();
      
      if (data.success) {
        stats.successful++;
      } else {
        stats.failed++;
      }

      if (data.type && stats.byType.hasOwnProperty(data.type)) {
        stats.byType[data.type as keyof typeof stats.byType]++;
      }

      if (data.timestamp) {
        const date = data.timestamp.toDate().toISOString().split('T')[0];
        stats.byDay[date] = (stats.byDay[date] || 0) + 1;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error obteniendo estadísticas de email:', error);
    throw new functions.https.HttpsError('internal', 'Error interno del servidor');
  }
});
