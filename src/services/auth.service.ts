import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  User,
  UserCredential,
  AuthError
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserData } from '@/types/auth';
import { COLLECTIONS } from '@/lib/constants';
import { handleFirebaseError } from '@/lib/firebase-errors';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  role: 'comercio' | 'socio' | 'asociacion';
  additionalData?: Record<string, any>;
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
      const { email, password } = credentials;
      
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );

      const userData = await this.getUserData(userCredential.user.uid);
      
      if (!userData) {
        throw new Error('Datos de usuario no encontrados');
      }

      // Check if user is active
      if (userData.estado === 'inactivo') {
        await this.signOut();
        throw new Error('Tu cuenta está desactivada. Contacta al administrador.');
      }

      // Update last login
      await this.updateLastLogin(userCredential.user.uid);

      return {
        success: true,
        user: userData
      };
    } catch (error: any) {
      return {
        success: false,
        error: handleFirebaseError(error)
      };
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const { email, password, nombre, role, additionalData } = data;

      // Create Firebase Auth user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: nombre
      });

      // Create user document in Firestore
      const userData: Omit<UserData, 'uid'> = {
        email,
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

      // Create role-specific document
      await this.createRoleDocument(userCredential.user.uid, role, {
        nombre,
        email,
        ...additionalData
      });

      const fullUserData: UserData = {
        uid: userCredential.user.uid,
        ...userData
      };

      return {
        success: true,
        user: fullUserData
      };
    } catch (error: any) {
      return {
        success: false,
        error: handleFirebaseError(error)
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: handleFirebaseError(error)
      };
    }
  }

  /**
   * Update user password
   */
  async updateUserPassword(newPassword: string): Promise<AuthResponse> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No hay usuario autenticado');
      }

      await updatePassword(user, newPassword);
      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: handleFirebaseError(error)
      };
    }
  }

  /**
   * Get user data from Firestore
   */
  async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        uid: userDoc.id,
        email: data.email,
        nombre: data.nombre,
        role: data.role,
        estado: data.estado,
        creadoEn: data.creadoEn?.toDate() || new Date(),
        actualizadoEn: data.actualizadoEn?.toDate() || new Date(),
        ultimoAcceso: data.ultimoAcceso?.toDate() || new Date()
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(uid: string, updates: Partial<UserData>): Promise<AuthResponse> {
    try {
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

      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: handleFirebaseError(error)
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
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Create role-specific document
   */
  private async createRoleDocument(
    uid: string, 
    role: string, 
    data: Record<string, any>
  ): Promise<void> {
    try {
      const collection = role === 'comercio' ? COLLECTIONS.COMERCIOS :
                        role === 'socio' ? COLLECTIONS.SOCIOS :
                        COLLECTIONS.ASOCIACIONES;

      const roleData = {
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
      console.error('Error creating role document:', error);
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
      console.error('Error checking user role:', error);
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
}

// Export singleton instance
export const authService = new AuthService();
export default authService;