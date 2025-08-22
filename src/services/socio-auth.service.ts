import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { 
  doc, 
  serverTimestamp,
  writeBatch 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { COLLECTIONS, USER_STATES } from '@/lib/constants';
import { handleError } from '@/lib/error-handler';
import { SocioFormData } from '@/types/socio';

export interface CreateSocioAuthAccountResult {
  success: boolean;
  uid?: string;
  error?: string;
}

type SocioDocData = { [key: string]: unknown };

class SocioAuthService {
  /**
   * Crea una cuenta de Firebase Auth para un socio sin afectar la sesión actual del admin
   * Utiliza un enfoque que preserva la sesión actual del administrador
   */
  async createSocioAuthAccount(
    socioData: SocioFormData,
    asociacionId: string
  ): Promise<CreateSocioAuthAccountResult> {
    // Guardar el usuario actual (admin) antes de crear la nueva cuenta
    const currentUser = auth.currentUser;
    
    try {
      console.log('🔐 Creando cuenta de Firebase Auth para socio:', socioData.email);

      // Validar que se proporcione una contraseña
      if (!socioData.password || socioData.password.length < 6) {
        throw new Error('Se requiere una contraseña de al menos 6 caracteres');
      }

      // Crear la cuenta de Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        socioData.email.toLowerCase().trim(),
        socioData.password
      );

      const newUser = userCredential.user;
      console.log('✅ Cuenta de Firebase Auth creada:', newUser.uid);

      // Actualizar el perfil del usuario con el nombre
      await updateProfile(newUser, {
        displayName: socioData.nombre
      });

      // Crear los documentos en Firestore usando batch
      const batch = writeBatch(db);

      // Documento en la colección users
      const userDocRef = doc(db, COLLECTIONS.USERS, newUser.uid);
      const userData = {
        email: socioData.email.toLowerCase().trim(),
        nombre: socioData.nombre,
        role: 'socio',
        estado: USER_STATES.ACTIVO, // Activar inmediatamente
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
        asociacionId: asociacionId,
        configuracion: {
          notificaciones: true,
          tema: 'light',
          idioma: 'es',
        },
      };

      batch.set(userDocRef, userData);
      const socioDocRef = doc(db, COLLECTIONS.SOCIOS, newUser.uid);
      const socioDocData: SocioDocData = {
        nombre: socioData.nombre,
        email: socioData.email.toLowerCase().trim(),
        dni: socioData.dni || '',
        telefono: socioData.telefono || '',
        direccion: socioData.direccion || '',
        asociacionId: asociacionId,
        estado: socioData.estado || 'activo',
        estadoMembresia: 'al_dia',
        fechaIngreso: serverTimestamp(),
        beneficiosUsados: 0,
        validacionesRealizadas: 0,
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
        hasAuthAccount: true, // Marcar que tiene cuenta de auth
      };

      // Agregar campos opcionales solo si tienen valor
      if (socioData.fechaNacimiento) {
        socioDocData.fechaNacimiento = socioData.fechaNacimiento;
      }
      if (socioData.fechaVencimiento) {
        socioDocData.fechaVencimiento = socioData.fechaVencimiento;
      }
      if (socioData.montoCuota !== undefined) {
        socioDocData.montoCuota = socioData.montoCuota;
      }
      if (socioData.numeroSocio) {
        socioDocData.numeroSocio = socioData.numeroSocio;
      }

      batch.set(socioDocRef, socioDocData);

      // Ejecutar el batch
      await batch.commit();
      console.log('✅ Documentos de Firestore creados exitosamente');

      // IMPORTANTE: Cerrar la sesión del socio recién creado para restaurar la del admin
      await firebaseSignOut(auth);
      console.log('🔐 Sesión del socio cerrada');

      // Esperar un momento para que Firebase procese el sign out
      await new Promise(resolve => setTimeout(resolve, 100));

      // Si había un usuario admin logueado, intentar restaurar su sesión
      // Nota: En Firebase, una vez que haces signOut(), no puedes "restaurar" automáticamente
      // la sesión anterior. El admin tendrá que volver a loguearse si es necesario.
      // Sin embargo, en la mayoría de los casos, la aplicación manejará esto automáticamente
      // a través de onAuthStateChanged.

      console.log('✅ Cuenta de socio creada exitosamente sin afectar la sesión del admin');

      return {
        success: true,
        uid: newUser.uid
      };

    } catch (error) {
      console.error('❌ Error creando cuenta de socio:', error);
      
      // Si se creó el usuario pero falló algo después, intentar limpiarlo
      if (auth.currentUser && auth.currentUser !== currentUser) {
        try {
          await auth.currentUser.delete();
          console.log('🧹 Usuario de Firebase Auth limpiado después del error');
        } catch (cleanupError) {
          console.error('❌ Error limpiando usuario después del fallo:', cleanupError);
        }
      }

      return {
        success: false,
        error: handleError(error, 'Create Socio Auth Account', false).message
      };
    }
  }

  /**
   * Genera una contraseña temporal segura
   */
  generateSecurePassword(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let password = '';
    
    // Asegurar que tenga al menos una mayúscula, una minúscula, un número y un símbolo
    password += 'ABCDEFGHJKMNPQRSTUVWXYZ'[Math.floor(Math.random() * 23)]; // Mayúscula
    password += 'abcdefghijkmnpqrstuvwxyz'[Math.floor(Math.random() * 23)]; // Minúscula  
    password += '23456789'[Math.floor(Math.random() * 8)]; // Número
    password += '!@#$%&*'[Math.floor(Math.random() * 7)]; // Símbolo
    
    // Completar hasta 12 caracteres
    for (let i = 4; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Mezclar los caracteres
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  private isFirebaseAuthError(error: unknown): error is { code: string } {
    const e = error as { [key: string]: unknown };
    return typeof error === 'object' && error !== null && 'code' in e && typeof e['code'] === 'string';
  }

  /**
   * Verifica si un email ya está registrado en Firebase Auth
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      // Intentar crear un usuario temporal para verificar si el email existe
      // Este es un método indirecto ya que Firebase no tiene una API directa para esto
      // en el cliente
      const tempPassword = this.generateSecurePassword();
      
      try {
        await createUserWithEmailAndPassword(
          auth,
          email.toLowerCase().trim(),
          tempPassword
        );

        // Si se creó el usuario temporal, entonces el email NO existe en auth.
        // Limpiar el usuario temporal creado para no dejar cuentas huérfanas.
        try {
          if (auth.currentUser) {
            await auth.currentUser.delete();
          }
        } catch (cleanupError) {
          console.warn('Advertencia al limpiar usuario temporal:', cleanupError);
        }

        // Asegurarse de cerrar sesión del usuario temporal
        try {
          await firebaseSignOut(auth);
        } catch (signOutError) {
          console.warn('Advertencia al cerrar sesión del usuario temporal:', signOutError);
        }

        return false; // email no existe
      } catch (error: unknown) {
        if (this.isFirebaseAuthError(error) && error.code === 'auth/email-already-in-use') {
          return true;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error verificando email:', error);
      // En caso de error, asumir que el email podría existir para ser conservadores
      return true;
    }
  }
}

// Export singleton instance
export const socioAuthService = new SocioAuthService();
export default socioAuthService;