import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}

class FirebaseAuthService {
  private currentUser: AuthUser | null = null;
  private authStateListeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // Escuchar cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAdmin: this.checkAdminStatus(user)
        };
      } else {
        this.currentUser = null;
      }
      
      // Notificar a todos los listeners
      this.authStateListeners.forEach(listener => listener(this.currentUser));
    });
  }

  private checkAdminStatus(user: User): boolean {
    // Por ahora, consideramos admin a cualquier usuario autenticado
    // En el futuro se puede implementar roles más complejos
    return true;
  }

  async signInWithPassword(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAdmin: this.checkAdminStatus(user)
      };
      
      this.currentUser = authUser;
      return authUser;
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      throw new Error('Credenciales incorrectas');
    }
  }

  async signInWithAdminPassword(password: string): Promise<AuthUser> {
    // Para compatibilidad con el sistema actual de contraseña simple
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      // Crear un usuario temporal para el admin
      const adminUser: AuthUser = {
        uid: 'admin-temp',
        email: 'admin@menuqr.com',
        displayName: 'Administrador',
        isAdmin: true
      };
      
      this.currentUser = adminUser;
      
      // Simular persistencia en localStorage para compatibilidad
      if (typeof window !== 'undefined') {
        localStorage.setItem('menuqr-admin-auth', JSON.stringify(adminUser));
      }
      
      return adminUser;
    } else {
      throw new Error('Contraseña de administrador incorrecta');
    }
  }

  async createAdminUser(email: string, password: string, displayName: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Actualizar perfil con nombre
      await updateProfile(user, { displayName });
      
      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        isAdmin: true
      };
      
      this.currentUser = authUser;
      return authUser;
    } catch (error) {
      console.error('Error creando usuario admin:', error);
      throw new Error('Error al crear usuario administrador');
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
      
      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('menuqr-admin-auth');
      }
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  getCurrentUser(): AuthUser | null {
    // Verificar localStorage para compatibilidad
    if (!this.currentUser && typeof window !== 'undefined') {
      const stored = localStorage.getItem('menuqr-admin-auth');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
        } catch (error) {
          console.error('Error parsing stored auth:', error);
          localStorage.removeItem('menuqr-admin-auth');
        }
      }
    }
    
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin || false;
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.push(callback);
    
    // Llamar inmediatamente con el estado actual
    callback(this.getCurrentUser());
    
    // Retornar función para desuscribirse
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Método para verificar si el usuario tiene permisos específicos
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.isAdmin) return false;
    
    // Por ahora, todos los admins tienen todos los permisos
    // En el futuro se puede implementar un sistema más granular
    return true;
  }

  // Método para refrescar el token (útil para sesiones largas)
  async refreshAuth(): Promise<void> {
    if (auth.currentUser) {
      await auth.currentUser.getIdToken(true);
    }
  }
}

// Instancia singleton
export const firebaseAuth = new FirebaseAuthService();
export default firebaseAuth;