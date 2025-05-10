import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    User,
  } from 'firebase/auth';
  import { doc, setDoc, updateDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import { auth, db, storage } from '@/lib/firebase-config';
  import { logger } from '@/lib/logger';
  
  // Tipos
  export type PlanStatus = 'active' | 'pending' | 'canceled' | 'trial' | 'expired';
  export type UserRole = 'user' | 'admin' | 'superadmin';
  
  export interface UserData {
    uid: string;
    email: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    photoURL?: string;
    emailVerified: boolean;
    plan: string;
    planStatus: PlanStatus;
    planExpiresAt?: Timestamp;
    trialEndsAt?: Timestamp;
    verified: boolean;
    role: UserRole;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastLoginAt?: Timestamp;
    phone?: string;
    company?: string;
    position?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    preferences?: {
      theme?: 'light' | 'dark' | 'system';
      language?: string;
    };
    metadata?: Record<string, unknown>;
  }
  
  export interface SignUpData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    photoURL?: string;
    plan?: string;
    planStatus?: PlanStatus;
  }
  
  export interface AuthError {
    code: string;
    message: string;
  }
  
  export interface AuthResponse {
    user: User | null;
    userData?: UserData | null;
    error?: AuthError | null;
  }
  
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
        if (data.displayName || data.photoURL) {
          await updateProfile(user, {
            displayName: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            photoURL: data.photoURL
          });
        }
  
        // Enviar email de verificación
        await sendEmailVerification(user);
  
        // Crear documento del usuario en Firestore
        const userData: Partial<UserData> = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          firstName: data.firstName || user.displayName?.split(' ')[0] || '',
          lastName: data.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
          photoURL: user.photoURL || '',
          emailVerified: user.emailVerified,
          plan: data.plan || 'free',
          planStatus: data.planStatus || 'trial',
          verified: false,
          role: 'user',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          preferences: {
            theme: 'system',
            language: 'es'
          }
        };
  
        await setDoc(doc(db, 'users', user.uid), userData);
  
        return { user, userData: userData as UserData, error: null };
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
          lastLoginAt: serverTimestamp()
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
  
        // Verificar si el usuario ya existe en Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
  
        let userData: UserData;
  
        if (userDoc.exists()) {
          // Actualizar último inicio de sesión
          await updateDoc(userDocRef, {
            lastLoginAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
  
          userData = userDoc.data() as UserData;
        } else {
          // Crear nuevo documento para el usuario
          userData = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            plan: 'free',
            planStatus: 'trial',
            verified: user.emailVerified,
            role: 'user',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            lastLoginAt: Timestamp.now(),
            notifications: {
              email: true,
              push: true,
              sms: false
            },
            preferences: {
              theme: 'system',
              language: 'es'
            }
          };
  
          await setDoc(userDocRef, userData);
        }
  
        return { user, userData, error: null };
      } catch (err) {
        const error = this.handleAuthError(err);
        return { user: null, userData: null, error };
      }
    }
  
    // Cerrar sesión
    async signOut(): Promise<void> {
      await signOut(auth);
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
        await updateProfile(user, {
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
        await updateEmail(user, newEmail);
  
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
        await updatePassword(user, newPassword);
  
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
  }
  
  export const authService = new AuthService();