import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  User,
  UserCredential,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserData } from '@/types/auth';
import { COLLECTIONS } from '@/lib/constants';
import { handleFirebaseError, logAuthError } from '@/lib/firebase-errors';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  role: 'comercio' | 'socio' | 'asociacion' | 'admin';
  additionalData?: Record<string, unknown>;
}

export interface AuthResponse {
  success: boolean;
  user?: UserData;
  error?: string;
}

class AuthService {
  /**
   * Sign in user with email and password
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting sign in process for:', credentials.email);
      
      const { email, password } = credentials;
      
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }

      if (!email.includes('@')) {
        throw new Error('Formato de email inválido');
      }

      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      console.log('🔐 Attempting Firebase authentication...');
      
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth, 
        email.trim().toLowerCase(), 
        password
      );

      console.log('🔐 Firebase authentication successful, fetching user data...');

      const userData = await this.getUserData(userCredential.user.uid);
      
      if (!userData) {
        console.error('🔐 User data not found in Firestore');
        throw new Error('Datos de usuario no encontrados. Contacta al administrador.');
      }

      console.log('🔐 User data retrieved:', { uid: userData.uid, role: userData.role, estado: userData.estado });

      // Check if user is active
      if (userData.estado === 'inactivo') {
        console.warn('🔐 User account is inactive');
        await this.signOut();
        throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
      }

      // Update last login
      console.log('🔐 Updating last login timestamp...');
      await this.updateLastLogin(userCredential.user.uid);

      console.log('🔐 Sign in process completed successfully');

      return {
        success: true,
        user: userData
      };
    } catch (error) {
      logAuthError(error, 'Sign In');
      
      return {
        success: false,
        error: handleFirebaseError(error as Error)
      };
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting registration process for:', data.email);
      
      const { email, password, nombre, role, additionalData } = data;

      // Validate inputs
      if (!email || !password || !nombre || !role) {
        throw new Error('Todos los campos son requeridos');
      }

      console.log('🔐 Creating Firebase Auth user...');

      // Create Firebase Auth user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      console.log('🔐 Firebase user created, updating profile...');

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: nombre
      });

      console.log('🔐 Creating user document in Firestore...');

      // Create user document in Firestore
      const userData: Omit<UserData, 'uid'> = {
        email: email.trim().toLowerCase(),
        nombre,
        role,
        estado: 'activo',
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        ultimoAcceso: new Date(),
        ...additionalData
      };

      await setDoc(
        doc(db, COLLECTIONS.USERS, userCredential.user.uid),
        {
          ...userData,
          creadoEn: serverTimestamp(),
          actualizadoEn: serverTimestamp(),
          ultimoAcceso: serverTimestamp()
        }
      );

      console.log('🔐 Creating role-specific document...');

      // Create role-specific document (skip for admin role)
      if (role !== 'admin') {
        await this.createRoleDocument(userCredential.user.uid, role, {
          nombre,
          email: email.trim().toLowerCase(),
          ...additionalData
        });
      }

      const fullUserData: UserData = {
        uid: userCredential.user.uid,
        ...userData
      };

      console.log('🔐 Registration completed successfully');

      return {
        success: true,
        user: fullUserData
      };
    } catch (error: unknown) {
      logAuthError(error, 'Registration');
      
      return {
        success: false,
        error: handleFirebaseError(error as Error)
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      console.log('🔐 Signing out user...');
      await signOut(auth);
      console.log('🔐 Sign out successful');
    } catch (error) {
      logAuthError(error, 'Sign Out');
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Sending password reset email to:', email);
      
      if (!email || !email.includes('@')) {
        throw new Error('Email válido es requerido');
      }

      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      
      console.log('🔐 Password reset email sent successfully');
      
      return {
        success: true
      };
    } catch (error: unknown) {
      logAuthError(error, 'Password Reset');
      
      return {
        success: false,
        error: handleFirebaseError(error as Error)
      };
    }
  }

  /**
   * Update user password
   */
  async updateUserPassword(newPassword: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Updating user password...');
      
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      if (!newPassword || newPassword.length < 6) {
        throw new Error('La nueva contraseña debe tener al menos 6 caracteres');
      }

      await updatePassword(user, newPassword);
      
      console.log('🔐 Password updated successfully');
      
      return {
        success: true
      };
    } catch (error: unknown) {
      logAuthError(error, 'Password Update');
      
      return {
        success: false,
        error: handleFirebaseError(error as Error)
      };
    }
  }

  /**
   * Get user data from Firestore
   */
  async getUserData(uid: string): Promise<UserData | null> {
    try {
      console.log('🔐 Fetching user data for UID:', uid);
      
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
      
      if (!userDoc.exists()) {
        console.warn('🔐 User document does not exist in Firestore');
        return null;
      }

      const data = userDoc.data();
      const userData: UserData = {
        uid: userDoc.id,
        email: data.email,
        nombre: data.nombre,
        role: data.role,
        estado: data.estado,
        creadoEn: data.creadoEn?.toDate() || new Date(),
        actualizadoEn: data.actualizadoEn?.toDate() || new Date(),
        ultimoAcceso: data.ultimoAcceso?.toDate() || new Date(),
        telefono: data.telefono,
        avatar: data.avatar,
        configuracion: data.configuracion,
        metadata: data.metadata,
        asociacionId: data.asociacionId
      };

      console.log('🔐 User data retrieved successfully');
      return userData;
    } catch (error) {
      logAuthError(error, 'Get User Data');
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(uid: string, updates: Partial<UserData>): Promise<AuthResponse> {
    try {
      console.log('🔐 Updating user profile for UID:', uid);
      
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      
      await updateDoc(userRef, {
        ...updates,
        actualizadoEn: serverTimestamp()
      });

      // Update Firebase Auth profile if name changed
      if (updates.nombre && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: updates.nombre
        });
      }

      console.log('🔐 User profile updated successfully');

      return {
        success: true
      };
    } catch (error: unknown) {
      logAuthError(error, 'Update Profile');
      
      return {
        success: false,
        error: handleFirebaseError(error as Error)
      };
    }
  }

  /**
   * Update last login timestamp
   */
  private async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        ultimoAcceso: serverTimestamp()
      });
    } catch (error) {
      // Don't throw error for last login update failure
      console.warn('🔐 Failed to update last login:', error);
    }
  }

  /**
   * Create role-specific document
   */
  private async createRoleDocument(
    uid: string, 
    role: string, 
    data: Record<string, unknown>
  ): Promise<void> {
    try {
      const collection = role === 'comercio' ? COLLECTIONS.COMERCIOS :
                        role === 'socio' ? COLLECTIONS.SOCIOS :
                        role === 'asociacion' ? COLLECTIONS.ASOCIACIONES :
                        null;

      // Skip role document creation for admin or unknown roles
      if (!collection) {
        console.log('🔐 Skipping role document creation for role:', role);
        return;
      }

      const roleData: Record<string, unknown> = {
        ...data,
        estado: 'activo',
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp()
      };

      // Add role-specific defaults
      if (role === 'comercio') {
        roleData.asociacionesVinculadas = [];
        roleData.visible = true;
        roleData.configuracion = {
          notificacionesEmail: true,
          notificacionesWhatsApp: false,
          autoValidacion: false
        };
      }

      await setDoc(doc(db, collection, uid), roleData);
    } catch (error) {
      logAuthError(error, 'Create Role Document');
      throw error;
    }
  }

  /**
   * Check if user has specific role
   */
  async hasRole(uid: string, role: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(uid);
      return userData?.role === role;
    } catch (error) {
      logAuthError(error, 'Check Role');
      return false;
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Validate Firebase configuration
   */
  validateFirebaseConfig(): boolean {
    try {
      const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      };

      const missingKeys = Object.entries(config)
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missingKeys.length > 0) {
        console.error('🔐 Missing Firebase configuration keys:', missingKeys);
        return false;
      }

      console.log('🔐 Firebase configuration is valid');
      return true;
    } catch (error) {
      console.error('🔐 Error validating Firebase configuration:', error);
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;