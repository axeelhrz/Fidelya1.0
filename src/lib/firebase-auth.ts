import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}

export class FirebaseAuth {
  // Admin email for role checking
  private static ADMIN_EMAIL = 'admin@menuqr.com';

  static async signInWithPassword(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.mapUserToAuthUser(userCredential.user);
    } catch (error: unknown) {
      console.error('Error signing in:', error);
      throw new Error(this.getAuthErrorMessage((error as { code?: string })?.code || 'unknown'));
    }
  }
      
  static async createAccount(email: string, password: string, displayName?: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return this.mapUserToAuthUser(userCredential.user);
    } catch (error: unknown) {
      console.error('Error creating account:', error);
      const errorCode = (error as { code?: string })?.code || 'unknown';
      throw new Error(this.getAuthErrorMessage(errorCode));
    }
  }

  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  }

  static async resetPassword(email: string): Promise<void> {
        try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      console.error('Error sending password reset:', error);
      throw new Error(this.getAuthErrorMessage((error as { code?: string })?.code || 'unknown'));
        }
      }

  static onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback(this.mapUserToAuthUser(user));
      } else {
        callback(null);
    }
    });
  }

  static getCurrentUser(): AuthUser | null {
    const user = auth.currentUser;
    return user ? this.mapUserToAuthUser(user) : null;
  }

  private static mapUserToAuthUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      isAdmin: user.email === this.ADMIN_EMAIL
    };
  }

  private static getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'Authentication failed. Please try again';
    }
  }
}
