import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export interface UploadImageOptions {
  maxSize?: number;
  allowedTypes?: string[];
  quality?: number;
  retries?: number;
  onProgress?: (progress: number) => void;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
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
    retries = 3,
    onProgress
  } = options;

  // Validate file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
  }

  // Validate file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    throw new Error(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`);
  }

  // Compress image if needed
  const processedFile = await compressImage(file, quality);

  // Create storage reference with timestamp to avoid conflicts
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = processedFile.name.split('.').pop() || 'jpg';
  const finalPath = `${path}.${extension}`;
  
  console.log('📤 Subiendo imagen a:', finalPath);

  // Enhanced upload strategy with better CORS handling
  const uploadStrategies = [
    { name: 'Simple Upload', method: uploadWithSimple },
    { name: 'Resumable Upload', method: uploadWithResumable },
    { name: 'CORS Workaround', method: uploadWithCorsWorkaround }
  ];

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    for (const strategy of uploadStrategies) {
      try {
        console.log(`📤 Intento ${attempt}/${retries} - Estrategia: ${strategy.name}`);
        
        // Use different path for each strategy to avoid conflicts
        const strategyPath = attempt === 1 ? finalPath : `${path}_${attempt}_${randomId}.${extension}`;
        
        const result = await strategy.method(strategyPath, processedFile, onProgress);
        console.log(`✅ Upload exitoso con ${strategy.name}:`, result);
        return result;
        
      } catch (error) {
        console.error(`❌ Error con ${strategy.name} (intento ${attempt}):`, error);
        lastError = error as Error;
        
        // Check if it's a CORS error
        const isCorsError = error instanceof Error && (
          error.message.includes('CORS') ||
          error.message.includes('cors') ||
          error.message.includes('preflight') ||
          error.message.includes('Access-Control-Allow-Origin') ||
          error.message.includes('ERR_FAILED')
        );
        
        if (isCorsError) {
          console.warn(`🚫 Error CORS detectado con ${strategy.name}, probando siguiente estrategia...`);
          continue; // Try next strategy
        }
        
        // For non-CORS errors, wait before retry
        if (attempt < retries) {
          const delay = Math.min(Math.pow(2, attempt) * 1000, 3000);
          console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          break; // Break strategy loop to retry with same strategy
        }
      }
    }
  }

  // If all strategies failed, provide helpful error message
  if (lastError) {
    const errorMessage = handleStorageError(lastError);
    throw new Error(errorMessage);
  }

  throw new Error('No se pudo subir la imagen después de todos los intentos');
};

// Simple upload strategy (most reliable for CORS)
const uploadWithSimple = async (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  console.log('📤 Usando estrategia de upload simple...');
  const storageRef = ref(storage, path);
  
  // Simulate progress for better UX
  onProgress?.(10);
  
  const metadata = {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      method: 'simple',
      size: file.size.toString()
    }
  };
  
  onProgress?.(30);
  
  try {
    const snapshot = await uploadBytes(storageRef, file, metadata);
    onProgress?.(80);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    onProgress?.(100);
    
    console.log('✅ Upload simple exitoso:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error en upload simple:', error);
    throw error;
  }
};

// Resumable upload strategy with real progress tracking
const uploadWithResumable = async (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  console.log('📤 Usando estrategia de upload resumable...');
  const storageRef = ref(storage, path);
  
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      method: 'resumable',
      size: file.size.toString()
    }
  });

  return new Promise<string>((resolve, reject) => {
    uploadTask.on('state_changed',
      // Progress callback
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress?.(progress);
        console.log(`📊 Progreso resumable: ${progress}% (${snapshot.bytesTransferred}/${snapshot.totalBytes} bytes)`);
      },
      // Error callback
      (error) => {
        console.error('❌ Error en upload resumable:', error);
        reject(error);
      },
      // Success callback
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('✅ Upload resumable exitoso:', url);
          onProgress?.(100);
          resolve(url);
        } catch (urlError) {
          console.error('❌ Error obteniendo URL:', urlError);
          reject(urlError);
        }
      }
    );
  });
};

// Enhanced CORS workaround strategy
const uploadWithCorsWorkaround = async (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  console.log('📤 Usando workaround avanzado para CORS...');
  
  onProgress?.(5);
  
  try {
    // Method 1: Try with different content type
    const storageRef = ref(storage, path);
    
    onProgress?.(15);
    
    // Create a new blob with explicit content type
    const blob = new Blob([file], { type: 'application/octet-stream' });
    
    onProgress?.(25);
    
    const metadata = {
      contentType: file.type, // Keep original type in metadata
      customMetadata: {
        originalName: file.name,
        originalType: file.type,
        uploadedAt: new Date().toISOString(),
        method: 'cors-workaround',
        size: file.size.toString()
      }
    };
    
    onProgress?.(40);
    
    const snapshot = await uploadBytes(storageRef, blob, metadata);
    
    onProgress?.(80);
    
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    onProgress?.(100);
    
    console.log('✅ Upload con workaround CORS exitoso:', downloadURL);
    return downloadURL;
    
  } catch (error) {
    console.error('❌ Error en workaround CORS:', error);
    
    // Method 2: Try with base64 conversion
    try {
      console.log('📤 Intentando método base64...');
      onProgress?.(20);
      
      const base64Data = await fileToBase64(file);
      onProgress?.(40);
      
      const response = await fetch(base64Data);
      const blob = await response.blob();
      onProgress?.(60);
      
      const storageRef = ref(storage, `base64_${path}`);
      const snapshot = await uploadBytes(storageRef, blob, {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          method: 'base64-workaround',
          size: file.size.toString()
        }
      });
      
      onProgress?.(90);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      onProgress?.(100);
      
      console.log('✅ Upload base64 exitoso:', downloadURL);
      return downloadURL;
      
    } catch (base64Error) {
      console.error('❌ Error en método base64:', base64Error);
      throw error; // Throw original error
    }
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const deleteImage = async (url: string): Promise<void> => {
  if (!url) return;
  
  try {
    // Extract path from URL if it's a full Firebase Storage URL
    let imagePath = url;
    if (url.includes('firebasestorage.googleapis.com')) {
      const urlParts = url.split('/o/')[1];
      if (urlParts) {
        imagePath = decodeURIComponent(urlParts.split('?')[0]);
      }
    }
    
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log('✅ Imagen eliminada exitosamente');
  } catch (error) {
    console.warn('⚠️ Error eliminando imagen (puede que no exista):', error);
    // Don't throw error for delete operations as the image might not exist
  }
};

const compressImage = async (file: File, quality: number): Promise<File> => {
  return new Promise((resolve) => {
    // Skip compression for small files
    if (file.size < 500 * 1024) { // Less than 500KB
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate optimal dimensions
        const maxWidth = 1920;
        const maxHeight = 1920;
        let { width, height } = img;

        // Maintain aspect ratio while resizing
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

        // Enable image smoothing for better quality
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              // Only use compressed version if it's actually smaller
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              console.log(`📦 Imagen comprimida: ${file.size} → ${blob.size} bytes`);
              resolve(compressedFile);
            } else {
              console.log('📦 Usando imagen original (compresión no efectiva)');
              resolve(file);
            }
          },
          file.type,
          quality
        );
      } catch (error) {
        console.warn('⚠️ Error comprimiendo imagen, usando archivo original:', error);
        resolve(file);
      }
    };

    img.onerror = () => {
      console.warn('⚠️ Error cargando imagen para compresión, usando archivo original');
      resolve(file);
    };

    img.src = URL.createObjectURL(file);
  });
};

export const generateImagePath = (userId: string, type: 'profile' | 'logo' | 'portada'): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  return `users/${userId}/${type}/${timestamp}_${randomId}`;
};

// Utility to validate image file
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no válido. Solo se permiten: ${allowedTypes.join(', ')}`
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Archivo demasiado grande. Máximo: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`
    };
  }

  return { valid: true };
};

// Enhanced connection check with multiple test methods
export const checkStorageConnection = async (): Promise<{
  connected: boolean;
  canUpload: boolean;
  corsConfigured: boolean;
  error?: string;
  details?: string;
}> => {
  try {
    console.log('🔍 Verificando conexión a Firebase Storage...');
    
    // Create a minimal test file
    const testContent = new Blob(['test-connection'], { type: 'text/plain' });
    const testFile = new File([testContent], 'connection-test.txt', { type: 'text/plain' });
    const testPath = `connection-tests/${Date.now()}_test.txt`;
    const testRef = ref(storage, testPath);
    
    // Test 1: Try simple upload
    try {
      console.log('🧪 Test 1: Upload simple...');
      await uploadBytes(testRef, testFile);
      
      // Test 2: Try to get download URL
      console.log('🧪 Test 2: Obtener URL de descarga...');
      await getDownloadURL(testRef);
      
      // Test 3: Clean up
      console.log('🧪 Test 3: Limpiar archivo de prueba...');
      await deleteObject(testRef);
      
      console.log('✅ Todas las pruebas de conexión exitosas');
      return { 
        connected: true, 
        canUpload: true, 
        corsConfigured: true,
        details: 'Conexión completa verificada'
      };
      
    } catch (uploadError) {
      console.error('❌ Error en pruebas de upload:', uploadError);
      
      const errorMessage = uploadError instanceof Error ? uploadError.message : 'Error desconocido';
      
      // Check if it's a CORS error
      const isCorsError = errorMessage.includes('CORS') || 
                         errorMessage.includes('cors') || 
                         errorMessage.includes('preflight') ||
                         errorMessage.includes('ERR_FAILED');
      
      if (isCorsError) {
        return {
          connected: true,
          canUpload: false,
          corsConfigured: false,
          error: 'Error de configuración CORS detectado',
          details: 'Firebase Storage no está configurado para permitir solicitudes desde localhost:3001. Ejecuta el script de configuración CORS.'
        };
      }
      
      // Check for permission errors
      const isPermissionError = errorMessage.includes('permission') || 
                               errorMessage.includes('unauthorized') ||
                               errorMessage.includes('403');
      
      if (isPermissionError) {
        return {
          connected: true,
          canUpload: false,
          corsConfigured: true,
          error: 'Error de permisos',
          details: 'No tienes permisos para subir archivos a Firebase Storage.'
        };
      }
      
      return {
        connected: false,
        canUpload: false,
        corsConfigured: false,
        error: errorMessage,
        details: 'Error de conexión general con Firebase Storage'
      };
    }
    
  } catch (error) {
    console.error('❌ Error crítico en verificación de conexión:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return {
      connected: false,
      canUpload: false,
      corsConfigured: false,
      error: errorMessage,
      details: 'No se pudo establecer conexión con Firebase Storage'
    };
  }
};

// Enhanced error handling for Firebase Storage errors
export const handleStorageError = (error: unknown): string => {
  if (!error) return 'Error desconocido';
  
  const errorMessage =
    typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
  
  console.error('🔍 Analizando error de storage:', errorMessage);
  
  // CORS errors (most common in development)
  if (errorMessage.includes('CORS') || 
      errorMessage.includes('cors') || 
      errorMessage.includes('preflight') ||
      errorMessage.includes('ERR_FAILED') ||
      errorMessage.includes('Access-Control-Allow-Origin')) {
    return 'Error de configuración CORS. Firebase Storage no está configurado para tu dominio local. Por favor, ejecuta el comando "npm run setup-cors" o contacta al administrador.';
  }
  
  // Network errors
  if (errorMessage.includes('network') || 
      errorMessage.includes('ERR_NETWORK') ||
      errorMessage.includes('ERR_INTERNET_DISCONNECTED')) {
    return 'Error de conexión a internet. Verifica tu conexión e intenta de nuevo.';
  }
  
  // Permission errors
  if (errorMessage.includes('permission') || 
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('403') ||
      errorMessage.includes('Forbidden')) {
    return 'No tienes permisos para realizar esta acción. Contacta al administrador del sistema.';
  }
  
  // File size errors
  if (errorMessage.includes('size') || 
      errorMessage.includes('large') ||
      errorMessage.includes('413') ||
      errorMessage.includes('too big')) {
    return 'El archivo es demasiado grande. Reduce el tamaño de la imagen e intenta de nuevo.';
  }
  
  // Quota errors
  if (errorMessage.includes('quota') || 
      errorMessage.includes('limit') ||
      errorMessage.includes('exceeded') ||
      errorMessage.includes('429')) {
    return 'Se ha alcanzado el límite de almacenamiento o solicitudes. Contacta al administrador.';
  }
  
  // Authentication errors
  if (errorMessage.includes('auth') || 
      errorMessage.includes('token') ||
      errorMessage.includes('401') ||
      errorMessage.includes('Unauthorized')) {
    return 'Error de autenticación. Por favor, inicia sesión nuevamente.';
  }
  
  // Generic Firebase errors
  if (errorMessage.includes('firebase') || 
      errorMessage.includes('storage') ||
      errorMessage.includes('firebasestorage')) {
    return 'Error del servicio de almacenamiento. Intenta de nuevo en unos momentos.';
  }
  
  // Timeout errors
  if (errorMessage.includes('timeout') || 
      errorMessage.includes('TIMEOUT')) {
    return 'La operación tardó demasiado tiempo. Verifica tu conexión e intenta con una imagen más pequeña.';
  }
  
  return `Error al procesar la imagen: ${errorMessage}. Si el problema persiste, contacta al soporte técnico.`;
};