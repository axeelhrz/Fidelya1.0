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

  // Try different upload strategies
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📤 Intento ${attempt} de ${retries} para subir imagen...`);
      
      // Strategy 1: Try resumable upload first
      if (attempt === 1) {
        return await uploadWithResumable(finalPath, processedFile, onProgress);
      }
      
      // Strategy 2: Try simple upload
      if (attempt === 2) {
        return await uploadWithSimple(finalPath, processedFile, onProgress);
      }
      
      // Strategy 3: Try with different path structure
      if (attempt === 3) {
        const fallbackPath = `uploads/${timestamp}_${randomId}.${extension}`;
        return await uploadWithSimple(fallbackPath, processedFile, onProgress);
      }
      
    } catch (error) {
      console.error(`❌ Error en intento ${attempt}:`, error);
      
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retry with exponential backoff
      const delay = Math.min(Math.pow(2, attempt) * 1000, 5000);
      console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('No se pudo subir la imagen después de todos los intentos');
};

// Resumable upload strategy
const uploadWithResumable = async (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);
  
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      method: 'resumable'
    }
  });

  return new Promise<string>((resolve, reject) => {
    uploadTask.on('state_changed',
      // Progress callback
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
        console.log(`📊 Progreso de subida: ${progress.toFixed(1)}%`);
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
          resolve(url);
        } catch (urlError) {
          console.error('❌ Error obteniendo URL:', urlError);
          reject(urlError);
        }
      }
    );
  });
};

// Simple upload strategy
const uploadWithSimple = async (
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const storageRef = ref(storage, path);
  
  onProgress?.(10);
  
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      method: 'simple'
    }
  });
  
  onProgress?.(90);
  
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  onProgress?.(100);
  
  console.log('✅ Upload simple exitoso:', downloadURL);
  return downloadURL;
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

// Check storage connection and permissions
export const checkStorageConnection = async (): Promise<{
  connected: boolean;
  canUpload: boolean;
  error?: string;
}> => {
  try {
    // Create a small test file
    const testFile = new File(['test'], 'connection-test.txt', { type: 'text/plain' });
    const testPath = `test/${Date.now()}_connection_test.txt`;
    const testRef = ref(storage, testPath);
    
    // Try to upload
    await uploadBytes(testRef, testFile);
    
    // Try to get download URL
    await getDownloadURL(testRef);
    
    // Clean up
    await deleteObject(testRef);
    
    console.log('✅ Conexión a Firebase Storage exitosa');
    return { connected: true, canUpload: true };
    
  } catch (error) {
    console.error('❌ Error de conexión a Firebase Storage:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return {
      connected: false,
      canUpload: false,
      error: errorMessage
    };
  }
};