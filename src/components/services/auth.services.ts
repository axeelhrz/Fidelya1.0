import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  getAdditionalUserInfo,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  serverTimestamp, 
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase-config';
import { logger } from '@/lib/logger';
import { 
  UserData, 
  AuthError, 
  AuthResponse, 
  SignUpData,
  DEFAULT_PERMISSIONS,
  DEFAULT_APPEARANCE,
  DEFAULT_NOTIFICATIONS,
  UserRole,
} from '@/types/auth';
import { PlanId, SubscriptionStatus } from '@/types/subscription';

class AuthService {
  // Función para manejar errores de Firebase Auth
  private handleAuthError(err: unknown): AuthError {
    const firebaseError = err as { code?: string; message?: string };
    const errorCode = firebaseError.code || 'auth/unknown-error';
    let errorMessage = 'Error de autenticación desconocido';

    switch (errorCode) {
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Este email ya está en uso';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es demasiado débil';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde o restablece tu contraseña';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Esta operación es sensible y requiere autenticación reciente. Inicia sesión nuevamente antes de volver a intentarlo';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Esta cuenta ha sido deshabilitada';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'Ya existe una cuenta con este email pero con un método de inicio de sesión diferente';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de red. Verifica tu conexión a internet';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Ventana emergente cerrada antes de completar la operación';
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'El dominio de la aplicación no está autorizado';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Esta operación no está permitida';
        break;
      default:
        errorMessage = firebaseError.message || 'Error de autenticación desconocido';
    }

    const authError: AuthError = {
      code: errorCode,
      message: errorMessage
    };

    logger.error('Auth error:', new Error(authError.message) || JSON.stringify(authError));

    return authError;
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Registrar nuevo usuario
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Actualizar perfil si se proporciona displayName o photoURL
      if (data.firstName || data.lastName || data.photoURL) {
        const displayName = data.displayName || `${data.firstName} ${data.lastName}`.trim();
        await firebaseUpdateProfile(user, {
          displayName,
          photoURL: data.photoURL
        });
      }

      // Enviar email de verificación
      await sendEmailVerification(user);

      // Determinar el plan y estado
      const planId = data.plan || 'basic';
      const planStatus = planId === 'basic' ? 'active' : 'pending';

      // Crear documento del usuario en Firestore
      const now = Timestamp.now();
      const userData: UserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || `${data.firstName} ${data.lastName}`.trim(),
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        plan: planId as PlanId,
        planStatus: planStatus as SubscriptionStatus,
        verified: false,
        role: 'user' as UserRole,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        notifications: DEFAULT_NOTIFICATIONS,
        appearance: DEFAULT_APPEARANCE,
        permissions: DEFAULT_PERMISSIONS,
        subscription: {
          status: planStatus as SubscriptionStatus,
          planId: planId as PlanId,
          plan: planId === 'basic' ? 'Básico' : planId === 'pro' ? 'Profesional' : 'Enterprise',
          currentPeriodStart: now,
        },
        stats: {
          lastActive: now,
          lastLoginAt: now,
          totalPolicies: 0,
          activePolicies: 0,
          totalClients: 0,
          activeClients: 0,
          totalClaims: 0,
          totalInvoices: 0,
          totalPayments: 0,
          totalIncome: 0,
          pendingClaims: 0
        }
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // Si el plan es básico, activarlo automáticamente
      if (planId === 'basic') {
        // Crear documento de suscripción para plan básico
        const farFutureDate = new Date();
        farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);
        
        await setDoc(doc(db, 'subscriptions', user.uid), {
          userId: user.uid,
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
          currentPeriodEnd: Timestamp.fromDate(farFutureDate),
          cancelAtPeriodEnd: false
        });
      }

      return { user, userData, error: null };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { user: null, userData: null, error };
    }
  }

  // Iniciar sesión con email y contraseña
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualizar último inicio de sesión
      const userDocRef = doc(db, 'users', user.uid);
      
      await updateDoc(userDocRef, {
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        'stats.lastLoginAt': serverTimestamp(),
        'stats.lastActive': serverTimestamp()
      });

      // Obtener datos del usuario
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.exists() ? userDoc.data() as UserData : null;

      return { user, userData, error: null };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { user: null, userData: null, error };
    }
  }

  // Iniciar sesión con Google
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      const isNewUser = getAdditionalUserInfo(userCredential)?.isNewUser;

      // Verificar si el usuario ya existe en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData: UserData;
      const now = Timestamp.now();

      if (userDoc.exists()) {
        // Actualizar último inicio de sesión
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          'stats.lastLoginAt': serverTimestamp(),
          'stats.lastActive': serverTimestamp(),
          emailVerified: user.emailVerified
        });

        userData = userDoc.data() as UserData;
      } else {
        // Crear nuevo documento para el usuario
        // Obtener plan guardado en localStorage (si existe)
        let planId: PlanId = 'basic';
        let planStatus: SubscriptionStatus = 'active';
        
        try {
          // Esta parte se ejecutará en el cliente
          const savedPlan = localStorage.getItem('selectedPlan');
          if (savedPlan) {
            const plan = JSON.parse(savedPlan);
            planId = (plan.id || 'basic') as PlanId;
            planStatus = planId === 'basic' ? 'active' : 'pending';
          }
        } catch (e) {
          // Ignorar errores (por ejemplo, si se ejecuta en el servidor)
          console.error('Error al leer plan de localStorage:', e);
        }

        userData = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          photoURL: user.photoURL || '',
          emailVerified: user.emailVerified,
          plan: planId,
          planStatus: planStatus,
          verified: user.emailVerified,
          role: 'user',
          createdAt: now,
          updatedAt: now,
          lastLoginAt: now,
          notifications: DEFAULT_NOTIFICATIONS,
          appearance: DEFAULT_APPEARANCE,
          permissions: DEFAULT_PERMISSIONS,
          subscription: {
            status: planStatus,
            planId: planId,
            plan: planId === 'basic' ? 'Básico' : planId === 'pro' ? 'Profesional' : 'Enterprise',
            currentPeriodStart: now,
          },
          stats: {
            lastActive: now,
            lastLoginAt: now,
            totalPolicies: 0,
            activePolicies: 0,
            totalClients: 0,
            activeClients: 0,
            totalClaims: 0,
            totalInvoices: 0,
            totalPayments: 0,
            totalIncome: 0,
            pendingClaims: 0
          }
        };

        await setDoc(userDocRef, userData);

        // Si es un nuevo usuario y el plan es básico, activarlo automáticamente
        if (isNewUser && planId === 'basic') {
          // Crear documento de suscripción para plan básico
          const farFutureDate = new Date();
          farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);
          
          await setDoc(doc(db, 'subscriptions', user.uid), {
            userId: user.uid,
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
            currentPeriodEnd: Timestamp.fromDate(farFutureDate),
            cancelAtPeriodEnd: false
          });
        }
      }

      return { user, userData, error: null };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { user: null, userData: null, error };
    }
  }

  // Cerrar sesión
  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  // Restablecer contraseña
  async resetPassword(email: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { success: false, error };
    }
  }

  // Enviar email de verificación
  async sendVerificationEmail(): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      await sendEmailVerification(user);
      return { success: true };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { success: false, error };
    }
  }

  // Actualizar perfil básico
  async updateUserProfile(displayName?: string, photoURL?: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      // Actualizar perfil en Firebase Auth
      await firebaseUpdateProfile(user, {
        displayName: displayName || user.displayName,
        photoURL: photoURL || user.photoURL
      });

      // Actualizar datos en Firestore
      const userDocRef = doc(db, 'users', user.uid);

      const updateData: Partial<UserData> = {
        displayName: displayName || user.displayName || undefined,
        photoURL: photoURL || user.photoURL || undefined,
        updatedAt: Timestamp.now()
      };

      // Si hay nombre completo, separarlo en nombre y apellido
      if (displayName) {
        const nameParts = displayName.split(' ');
        updateData.firstName = nameParts[0];
        updateData.lastName = nameParts.slice(1).join(' ');
      }

      await updateDoc(userDocRef, updateData);

      return { success: true };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { success: false, error };
    }
  }

  // Actualizar email
  async updateUserEmail(newEmail: string, password: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      // Reautenticar al usuario
      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);

      // Actualizar email en Firebase Auth
      await firebaseUpdateEmail(user, newEmail);

      // Actualizar email en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        email: newEmail,
        updatedAt: Timestamp.now()
      });

      // Enviar email de verificación
      await sendEmailVerification(user);

      return { success: true };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { success: false, error };
    }
  }

  // Actualizar contraseña
  async updateUserPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      // Reautenticar al usuario
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Actualizar contraseña
      await firebaseUpdatePassword(user, newPassword);

      // Actualizar timestamp en Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        updatedAt: Timestamp.now()
      });

      return { success: true };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { success: false, error };
    }
  }

  // Subir avatar
  async uploadAvatar(file: File): Promise<{ success: boolean; url?: string; error?: AuthError }> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      // Crear referencia en Storage
      const storageRef = ref(storage, `avatars/${user.uid}`);

      // Subir archivo
      await uploadBytes(storageRef, file);

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);

      // Actualizar perfil del usuario
      await this.updateUserProfile(undefined, downloadURL);

      return { success: true, url: downloadURL };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { success: false, error };
    }
  }

  // Actualizar datos del usuario en Firestore
  async updateUserData(data: Partial<UserData>): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No hay usuario autenticado');

      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, {
        ...data,
        updatedAt: Timestamp.now()
      });

      return { success: true };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { success: false, error };
    }
  }
  // Verificar si el email ya está en uso
  async isEmailInUse(email: string): Promise<boolean> {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (err) {
      console.error('Error al verificar email:', err);
      return false; // Asumimos que no está en uso en caso de error
    }
  }

  // Activar plan gratuito
  async activateFreePlan(userId: string): Promise<{ success: boolean; error?: AuthError }> {
    try {
      const now = Timestamp.now();
      const farFutureDate = new Date();
      farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);
      const farFutureTimestamp = Timestamp.fromDate(farFutureDate);

      // Usar una transacción para actualizar ambos documentos
      await runTransaction(db, async (transaction) => {
        // Actualizar documento de usuario
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userDocRef);
        
        if (!userDoc.exists()) {
          throw new Error('Usuario no encontrado');
        }

        transaction.update(userDocRef, {
          plan: 'basic',
          planStatus: 'active',
          'subscription.status': 'active',
          'subscription.planId': 'basic',
          'subscription.plan': 'Básico',
          'subscription.currentPeriodStart': now,
          'subscription.currentPeriodEnd': farFutureTimestamp,
          'subscription.cancelAtPeriodEnd': false,
          updatedAt: now
        });

        // Crear o actualizar documento de suscripción
        const subscriptionDocRef = doc(db, 'subscriptions', userId);
        const subscriptionDoc = await transaction.get(subscriptionDocRef);

        if (subscriptionDoc.exists()) {
          transaction.update(subscriptionDocRef, {
            planId: 'basic',
            status: 'active',
            plan: 'Básico',
            currentPeriodStart: now,
            currentPeriodEnd: farFutureTimestamp,
            cancelAtPeriodEnd: false,
            updatedAt: now
          });
        } else {
          transaction.set(subscriptionDocRef, {
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
            currentPeriodEnd: farFutureTimestamp,
            cancelAtPeriodEnd: false
          });
        }
      });

      return { success: true };
    } catch (err) {
      const error = this.handleAuthError(err);
      return { success: false, error };
    }
  }
}

export const authService = new AuthService();
export type { UserData, AuthError, AuthResponse, SignUpData };