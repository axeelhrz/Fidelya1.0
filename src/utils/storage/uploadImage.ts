import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface UploadImageOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  quality?: number;
  retries?: number;
}

export const uploadImage = async (
  file: File,
  path: string,
  options: UploadImageOptions = {}
): Promise<string> => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    quality = 0.8,
    retries = 3
  } = options;

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
  }

  // Validate file size
  if (file.size > maxSize) {
    throw new Error(`El archivo es demasiado grande. Tamaño máximo: ${maxSize / (1024 * 1024)}MB`);
  }

  // Compress image if needed
  const processedFile = await compressImage(file, quality);

  // Create storage reference
  const storageRef = ref(storage, path);

  // Retry logic for upload
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Intento ${attempt} de ${retries} para subir imagen...`);
      
      // Upload file with metadata
      const metadata = {
        contentType: processedFile.type,
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        }
      };

      const snapshot = await uploadBytes(storageRef, processedFile, metadata);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Imagen subida exitosamente:', downloadURL);
      return downloadURL;
      
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Error en intento ${attempt}:`, error);
      
      // If it's a CORS error, try alternative approach
      if (error instanceof Error && error.message.includes('CORS')) {
        console.log('🔄 Detectado error CORS, intentando método alternativo...');
        
        try {
          // Alternative upload method using different approach
          const alternativeResult = await uploadWithAlternativeMethod(processedFile, path);
          if (alternativeResult) {
            return alternativeResult;
          }
        } catch (altError) {
          console.error('❌ Método alternativo también falló:', altError);
        }
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // If all retries failed
  const errorMessage = lastError?.message || 'Error desconocido al subir la imagen';
  
  if (errorMessage.includes('CORS')) {
    throw new Error(
      'Error de configuración CORS. Por favor, contacta al administrador del sistema. ' +
      'Código de error: CORS_POLICY_BLOCKED'
    );
  }
  
  throw new Error(`Error al subir la imagen después de ${retries} intentos: ${errorMessage}`);
};

// Alternative upload method for CORS issues
const uploadWithAlternativeMethod = async (file: File, path: string): Promise<string | null> => {
  try {
    // Create a new storage reference with different configuration
    const alternativeRef = ref(storage, `temp/${Date.now()}_${path}`);
    
    // Try upload with minimal metadata
    const snapshot = await uploadBytes(alternativeRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Move to final location if needed
    const finalRef = ref(storage, path);
    const finalSnapshot = await uploadBytes(finalRef, file);
    const finalURL = await getDownloadURL(finalSnapshot.ref);
    
    // Clean up temporary file
    try {
      await deleteObject(alternativeRef);
    } catch (cleanupError) {
      console.warn('⚠️ No se pudo limpiar archivo temporal:', cleanupError);
    }
    
    return finalURL;
  } catch (error) {
    console.error('❌ Método alternativo falló:', error);
    return null;
  }
};

export const deleteImage = async (url: string): Promise<void> => {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
    console.log('✅ Imagen eliminada exitosamente');
  } catch (error) {
    console.error('⚠️ Error eliminando imagen:', error);
    // Don't throw error for delete operations as the image might not exist
  }
};

const compressImage = async (file: File, quality: number): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const maxWidth = 1200;
      const maxHeight = 1200;
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      console.warn('⚠️ Error comprimiendo imagen, usando archivo original');
      resolve(file);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const generateImagePath = (userId: string, type: 'logo' | 'portada'): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = 'jpg';
  return `comercios/${userId}/${type}_${timestamp}_${randomId}.${extension}`;
};

// Utility function to check if Firebase Storage is accessible
export const checkStorageConnection = async (): Promise<boolean> => {
  try {
    const testRef = ref(storage, 'test-connection.txt');
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    await uploadBytes(testRef, testFile);
    await deleteObject(testRef);
    
    console.log('✅ Conexión a Firebase Storage exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a Firebase Storage:', error);
    return false;
  }
};