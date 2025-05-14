import * as admin from 'firebase-admin';
import { getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Configuración de Firebase Admin
interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
  storageBucket?: string;
}

// Obtener configuración desde variables de entorno
const getFirebaseAdminConfig = (): FirebaseAdminConfig => {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    throw new Error(
      'Firebase Admin SDK no está configurado correctamente. Verifica las variables de entorno: ' +
      'FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
    );
  }

  return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  };
};

// Inicializar Firebase Admin
const initializeFirebaseAdmin = () => {
  const apps = getApps();
  
  if (apps.length === 0) {
    try {
      const config = getFirebaseAdminConfig();
      
      admin.initializeApp({
        credential: cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail,
          privateKey: config.privateKey
        }),
        storageBucket: config.storageBucket
      });
      
      console.log('Firebase Admin SDK inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar Firebase Admin SDK:', error);
      throw error;
    }
  }
  
  return admin;
};

// Inicializar Firebase Admin
const firebaseAdmin = initializeFirebaseAdmin();

// Exportar servicios
export const auth = getAuth(firebaseAdmin.app());
export const db = getFirestore(firebaseAdmin.app());
export const storage = getStorage(firebaseAdmin.app());

// Funciones de utilidad para Firebase Admin

/**
 * Verifica un token de ID de Firebase
 * @param token Token de ID de Firebase
 * @returns Datos decodificados del token
 */
export const verifyIdToken = async (token: string) => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error al verificar token:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su UID
 * @param uid UID del usuario
 * @returns Datos del usuario
 */
export const getUserByUid = async (uid: string) => {
  try {
    const userRecord = await auth.getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Error al obtener usuario por UID:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario por su email
 * @param email Email del usuario
 * @returns Datos del usuario
 */
export const getUserByEmail = async (email: string) => {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    throw error;
  }
};

/**
 * Actualiza los claims personalizados de un usuario
 * @param uid UID del usuario
 * @param claims Claims personalizados
 */
export const setCustomUserClaims = async (uid: string, claims: object) => {
  try {
    await auth.setCustomUserClaims(uid, claims);
    return true;
  } catch (error) {
    console.error('Error al establecer claims personalizados:', error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario en Firebase Auth
 * @param userData Datos del usuario a crear
 * @returns Registro del usuario creado
 */
export const createUser = async (userData: admin.auth.CreateRequest) => {
  try {
    const userRecord = await auth.createUser(userData);
    return userRecord;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Actualiza un usuario en Firebase Auth
 * @param uid UID del usuario
 * @param userData Datos del usuario a actualizar
 * @returns Registro del usuario actualizado
 */
export const updateUser = async (uid: string, userData: admin.auth.UpdateRequest) => {
  try {
    const userRecord = await auth.updateUser(uid, userData);
    return userRecord;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Elimina un usuario de Firebase Auth
 * @param uid UID del usuario a eliminar
 */
export const deleteUser = async (uid: string) => {
  try {
    await auth.deleteUser(uid);
    return true;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

/**
 * Genera un enlace de autenticación personalizado
 * @param email Email del usuario
 * @param settings Configuración adicional
 * @returns URL del enlace generado
 */
export const generateEmailVerificationLink = async (
  email: string,
  settings?: admin.auth.ActionCodeSettings
) => {
  try {
    const link = await auth.generateEmailVerificationLink(email, settings);
    return link;
  } catch (error) {
    console.error('Error al generar enlace de verificación de email:', error);
    throw error;
  }
};

/**
 * Genera un enlace para restablecer contraseña
 * @param email Email del usuario
 * @param settings Configuración adicional
 * @returns URL del enlace generado
 */
export const generatePasswordResetLink = async (
  email: string,
  settings?: admin.auth.ActionCodeSettings
) => {
  try {
    const link = await auth.generatePasswordResetLink(email, settings);
    return link;
  } catch (error) {
    console.error('Error al generar enlace de restablecimiento de contraseña:', error);
    throw error;
  }
};

/**
 * Revoca todos los tokens de actualización emitidos para un usuario
 * @param uid UID del usuario
 */
export const revokeRefreshTokens = async (uid: string) => {
  try {
    await auth.revokeRefreshTokens(uid);
    return true;
  } catch (error) {
    console.error('Error al revocar tokens de actualización:', error);
    throw error;
  }
};

/**
 * Verifica si un usuario existe por su email
 * @param email Email del usuario
 * @returns true si el usuario existe, false en caso contrario
 */
interface FirebaseAuthError extends Error {
  code: string;
  message: string;
}

export const userExistsByEmail = async (email: string) => {
  try {
    await auth.getUserByEmail(email);
    return true;
  } catch (error) {
    if ((error as FirebaseAuthError).code === 'auth/user-not-found') {
      return false;
    }
    throw error;
  }
};

/**
 * Obtiene una lista de usuarios
 * @param maxResults Número máximo de resultados (máximo 1000)
 * @param pageToken Token de paginación para obtener la siguiente página
 * @returns Lista de usuarios y token de paginación para la siguiente página
 */
export const listUsers = async (maxResults: number = 1000, pageToken?: string) => {
  try {
    const listUsersResult = await auth.listUsers(maxResults, pageToken);
    return {
      users: listUsersResult.users,
      pageToken: listUsersResult.pageToken
    };
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    throw error;
  }
};

/**
 * Importa usuarios a Firebase Auth
 * @param users Lista de usuarios a importar
 * @param options Opciones de importación
 * @returns Resultado de la importación
 */
export const importUsers = async (
  users: admin.auth.UserImportRecord[],
  options?: admin.auth.UserImportOptions
) => {
  try {
    const userImportResult = await auth.importUsers(users, options);
    return userImportResult;
  } catch (error) {
    console.error('Error al importar usuarios:', error);
    throw error;
  }
};

// Exportar el módulo completo para casos de uso avanzados
export default firebaseAdmin;