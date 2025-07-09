import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  updateProfile,
  User,
  UserCredential,
  reload,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserData } from '@/types/auth';
import { COLLECTIONS, USER_STATES, DASHBOARD_ROUTES } from '@/lib/constants';
import { handleError } from '@/lib/error-handler';
import { configService } from '@/lib/config';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  role: 'comercio' | 'socio' | 'asociacion';
  telefono?: string;
  additionalData?: Record<string, unknown>;
}

export interface AuthResponse {
  success: boolean;
  user?: UserData;
  error?: string;
  requiresEmailVerification?: boolean;
}

class AuthService {
  private readonly maxLoginAttempts = 5;
  private readonly lockoutDuration = 15 * 60 * 1000; // 15 minutes
  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

  /**
   * Sign in user with email and password
   */
  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;
      
      // Check rate limiting
      if (this.isRateLimited(email)) {
        throw new Error('Demasiados intentos de inicio de sesión. Intenta más tarde.');
      }

      // Validate inputs
      this.validateLoginInputs(email, password);

      console.log('🔐 Starting sign in process for:', email);
      
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth, 
        email.trim().toLowerCase(), 
        password
      );

      // Check email verification
      if (!userCredential.user.emailVerified) {
        console.warn('🔐 Email not verified for user:', email);
        await this.signOut();
        return {
          success: false,
          requiresEmailVerification: true,
          error: 'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
        };
      }

      const userData = await this.getUserData(userCredential.user.uid);
      
      if (!userData) {
        console.error('🔐 User data not found in Firestore');
        await this.signOut();
        throw new Error('Datos de usuario no encontrados. Contacta al administrador.');
      }

      // Check user status
      if (userData.estado !== USER_STATES.ACTIVO) {
        console.warn('🔐 User account is not active:', userData.estado);
        await this.signOut();
        throw new Error(this.getInactiveAccountMessage(userData.estado));
      }

      // Clear login attempts on successful login
      this.clearLoginAttempts(email);

      // Update last login
      await this.updateLastLogin(userCredential.user.uid);

      // Set remember me persistence
      if (credentials.rememberMe) {
        // Firebase handles persistence automatically
        console.log('🔐 Remember me enabled');
      }

      console.log('🔐 Sign in process completed successfully');

      return {
        success: true,
        user: userData
      };
    } catch (error) {
      this.recordFailedLogin(credentials.email);
      return {
        success: false,
        error: handleError(error, 'Sign In', false).message
      };
    }
  }

  /**
   * Register new user with email verification
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting registration process for:', data.email);
      
      const { email, password, nombre, role, telefono, additionalData } = data;

      // Validate inputs
      this.validateRegisterInputs(data);

      // Check if email already exists
      const existingUser = await this.checkEmailExists(email);
      if (existingUser) {
        throw new Error('Este email ya está registrado');
      }

      console.log('🔐 Creating Firebase Auth user...');

      // Create Firebase Auth user
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      console.log('🔐 Updating profile and sending verification email...');

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: nombre
      });

      // Send email verification
      await sendEmailVerification(userCredential.user, {
        url: `${configService.getAppUrl()}/auth/login?verified=true`,
        handleCodeInApp: false,
      });

      console.log('🔐 Creating user document in Firestore...');

      // Create user document in Firestore
      const userData: Omit<UserData, 'uid'> = {
        email: email.trim().toLowerCase(),
        nombre,
        role,
        estado: USER_STATES.PENDIENTE, // Pending until email verification
        telefono,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        configuracion: {
          notificaciones: true,
          tema: 'light',
          idioma: 'es',
        },
        ...additionalData
      };

      await setDoc(
        doc(db, COLLECTIONS.USERS, userCredential.user.uid),
        {
          ...userData,
          creadoEn: serverTimestamp(),
          actualizadoEn: serverTimestamp(),
        }
      );

      console.log('🔐 Creating role-specific document...');

      // Create role-specific document
      await this.createRoleDocument(userCredential.user.uid, role, {
        nombre,
        email: email.trim().toLowerCase(),
        telefono,
        ...additionalData
      });

      // Sign out user until email verification
      await this.signOut();

      console.log('🔐 Registration completed successfully');

      return {
        success: true,
        requiresEmailVerification: true,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: handleError(error, 'Registration', false).message
      };
    }
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(email: string): Promise<AuthResponse> {
    try {
      // First, try to sign in to get the user
      const tempCredential = await signInWithEmailAndPassword(auth, email, 'temp');
      
      if (tempCredential.user.emailVerified) {
        await this.signOut();
        return {
          success: false,
          error: 'El email ya está verificado'
        };
      }

      await sendEmailVerification(tempCredential.user, {
        url: `${configService.getAppUrl()}/auth/login?verified=true`,
        handleCodeInApp: false,
      });

      await this.signOut();

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: 'No se pudo reenviar el email de verificación'
      };
    }
  }

  /**
   * Complete email verification process
   */
  async completeEmailVerification(user: User): Promise<AuthResponse> {
    try {
      // Reload user to get updated emailVerified status
      await reload(user);

      if (!user.emailVerified) {
        return {
          success: false,
          error: 'Email aún no verificado'
        };
      }

      // Update user status to active
      await updateDoc(doc(db, COLLECTIONS.USERS, user.uid), {
        estado: USER_STATES.ACTIVO,
        actualizadoEn: serverTimestamp(),
      });

      const userData = await this.getUserData(user.uid);

      return {
        success: true,
        user: userData || undefined
      };
    } catch (error) {
      return {
        success: false,
        error: handleError(error, 'Email Verification', false).message
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
      handleError(error, 'Sign Out');
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

      await sendPasswordResetEmail(auth, email.trim().toLowerCase(), {
        url: `${configService.getAppUrl()}/auth/login?reset=true`,
        handleCodeInApp: false,
      });
      
      console.log('🔐 Password reset email sent successfully');
      
      return {
        success: true
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: handleError(error, 'Password Reset', false).message
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
      return {
        success: false,
        error: handleError(error, 'Password Update', false).message
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
        configuracion: data.configuracion || {
          notificaciones: true,
          tema: 'light',
          idioma: 'es',
        },
        metadata: data.metadata,
        asociacionId: data.asociacionId
      };

      console.log('🔐 User data retrieved successfully');
      return userData;
    } catch (error) {
      handleError(error, 'Get User Data');
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
      return {
        success: false,
        error: handleError(error, 'Update Profile', false).message
      };
    }
  }

  /**
   * Check if email already exists
   */
  private async checkEmailExists(email: string): Promise<boolean> {
    try {
      const usersRef = collection(db, COLLECTIONS.USERS);
      const q = query(usersRef, where('email', '==', email.trim().toLowerCase()));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.warn('Error checking email existence:', error);
      return false;
    }
  }

  /**
   * Rate limiting for login attempts
   */
  private isRateLimited(email: string): boolean {
    const attempts = this.loginAttempts.get(email);
    if (!attempts) return false;

    const now = Date.now();
    if (now - attempts.lastAttempt > this.lockoutDuration) {
      this.loginAttempts.delete(email);
      return false;
    }

    return attempts.count >= this.maxLoginAttempts;
  }

  private recordFailedLogin(email: string): void {
    const attempts = this.loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
    attempts.count += 1;
    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(email, attempts);
  }

  private clearLoginAttempts(email: string): void {
    this.loginAttempts.delete(email);
  }

  /**
   * Input validation
   */
  private validateLoginInputs(email: string, password: string): void {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    if (!email.includes('@')) {
      throw new Error('Formato de email inválido');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
  }

  private validateRegisterInputs(data: RegisterData): void {
    const { email, password, nombre, role } = data;

    if (!email || !password || !nombre || !role) {
      throw new Error('Todos los campos son requeridos');
    }

    if (!email.includes('@')) {
      throw new Error('Formato de email inválido');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    if (nombre.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
  }

  /**
   * Get inactive account message
   */
  private getInactiveAccountMessage(estado: string): string {
    switch (estado) {
      case USER_STATES.INACTIVO:
        return 'Tu cuenta está desactivada. Contacta al administrador.';
      case USER_STATES.PENDIENTE:
        return 'Tu cuenta está pendiente de verificación. Revisa tu email.';
      case USER_STATES.SUSPENDIDO:
        return 'Tu cuenta ha sido suspendida. Contacta al administrador.';
      default:
        return 'Tu cuenta no está activa. Contacta al administrador.';
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

      if (!collection) {
        console.log('🔐 Skipping role document creation for role:', role);
        return;
      }

      const roleData: Record<string, unknown> = {
        ...data,
        estado: USER_STATES.PENDIENTE, // Will be activated after email verification
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
      } else if (role === 'socio') {
        roleData.asociacionesVinculadas = [];
        roleData.estadoMembresia = 'pendiente';
      } else if (role === 'asociacion') {
        roleData.configuracion = {
          notificacionesEmail: true,
          notificacionesWhatsApp: false,
          autoAprobacionSocios: false,
          requiereAprobacionComercios: true
        };
      }

      await setDoc(doc(db, collection, uid), roleData);
    } catch (error) {
      handleError(error, 'Create Role Document');
      throw error;
    }
  }

  /**
   * Get dashboard route for user role
   */
  getDashboardRoute(role: string): string {
    return DASHBOARD_ROUTES[role as keyof typeof DASHBOARD_ROUTES] || '/dashboard';
  }

  /**
   * Check if user has specific role
   */
  async hasRole(uid: string, role: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(uid);
      return userData?.role === role;
    } catch (error) {
      handleError(error, 'Check Role');
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
      const config = configService.getFirebaseConfig();
      
      const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
      const missingKeys = requiredKeys.filter(key => !config[key as keyof typeof config]);

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