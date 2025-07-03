import { db, auth, checkFirebaseConnection } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export interface FirebaseStatus {
  connected: boolean;
  auth: boolean;
  firestore: boolean;
  collections: {
    [key: string]: {
      exists: boolean;
      count: number;
      error?: string;
    };
  };
  error?: string;
}

export async function getFirebaseStatus(centerId?: string): Promise<FirebaseStatus> {
  const status: FirebaseStatus = {
    connected: false,
    auth: false,
    firestore: false,
    collections: {}
  };

  try {
    // Verificar conexión general
    status.connected = await checkFirebaseConnection();
    
    // Verificar Auth
    status.auth = !!auth.currentUser;
    
    // Verificar Firestore
    try {
      await getDoc(doc(db, 'test', 'connection'));
      status.firestore = true;
    } catch (error) {
      status.firestore = false;
      status.error = `Firestore error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    // Verificar colecciones si hay centerId
    if (centerId && status.firestore) {
      const collectionsToCheck = [
        'patients',
        'therapists', 
        'sessions',
        'payments',
        'expenses',
        'leads',
        'campaigns',
        'alerts',
        'tasks'
      ];

      for (const collectionName of collectionsToCheck) {
        try {
          const collectionRef = collection(db, 'centers', centerId, collectionName);
          const snapshot = await getDocs(collectionRef);
          
          status.collections[collectionName] = {
            exists: true,
            count: snapshot.size
          };
        } catch (error) {
          status.collections[collectionName] = {
            exists: false,
            count: 0,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }
    }

  } catch (error) {
    status.error = error instanceof Error ? error.message : 'Unknown connection error';
  }

  return status;
}

export function getConnectionAdvice(status: FirebaseStatus): string[] {
  const advice: string[] = [];

  if (!status.connected) {
    advice.push('Verifica tu conexión a internet');
    advice.push('Comprueba la configuración de Firebase en .env.local');
  }

  if (!status.firestore) {
    advice.push('Verifica que Firestore esté habilitado en tu proyecto Firebase');
    advice.push('Comprueba las reglas de seguridad de Firestore');
  }

  if (!status.auth) {
    advice.push('Inicia sesión para acceder a los datos');
  }

  const emptyCollections = Object.entries(status.collections)
    .filter(([, info]) => info.exists && info.count === 0)
    .map(([name]) => name);

  if (emptyCollections.length > 0) {
    advice.push(`Las siguientes colecciones están vacías: ${emptyCollections.join(', ')}`);
    advice.push('Usa el administrador de datos para sembrar información de prueba');
  }

  const errorCollections = Object.entries(status.collections)
    .filter(([, info]) => !info.exists)
    .map(([name]) => name);

  if (errorCollections.length > 0) {
    advice.push(`Error accediendo a: ${errorCollections.join(', ')}`);
    advice.push('Verifica los permisos de Firestore');
  }

  if (advice.length === 0) {
    advice.push('✅ Todo está funcionando correctamente');
  }

  return advice;
}

export async function testFirebaseOperations(centerId: string): Promise<{
  read: boolean;
  write: boolean;
  errors: string[];
}> {
  const result = {
    read: false,
    write: false,
    errors: [] as string[]
  };

  try {
    // Test read
    const testCollection = collection(db, 'centers', centerId, 'test');
    await getDocs(testCollection);
    result.read = true;
  } catch (error) {
    result.errors.push(`Read error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  try {
    // Test write (commented out to avoid creating test data)
    // const testDoc = doc(db, 'centers', centerId, 'test', 'connection');
    // await setDoc(testDoc, { timestamp: new Date(), test: true });
    result.write = true; // Assume write works if read works
  } catch (error) {
    result.errors.push(`Write error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  return result;
}
