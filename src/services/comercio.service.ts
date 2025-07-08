import { 
  doc, 
  updateDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Comercio, ComercioFormData, ComercioStats, Validacion } from '@/types/comercio';
import { uploadImage, deleteImage, generateImagePath, validateImageFile } from '@/utils/storage/uploadImage';

export class ComercioService {
  // Update comercio profile with validation
  static async updateProfile(userId: string, data: ComercioFormData): Promise<void> {
    try {
      // Validate required fields
      if (!data.nombre?.trim()) {
        throw new Error('El nombre del responsable es requerido');
      }
      
      if (!data.nombreComercio?.trim()) {
        throw new Error('El nombre comercial es requerido');
      }
      
      if (!data.email?.trim()) {
        throw new Error('El email es requerido');
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('El formato del email no es válido');
      }

      const comercioRef = doc(db, 'comercios', userId);
      
      // Prepare update data with proper validation
      const updateData = {
        ...data,
        nombre: data.nombre.trim(),
        nombreComercio: data.nombreComercio.trim(),
        email: data.email.trim().toLowerCase(),
        telefono: data.telefono?.trim() || '',
        direccion: data.direccion?.trim() || '',
        descripcion: data.descripcion?.trim() || '',
        sitioWeb: data.sitioWeb?.trim() || '',
        razonSocial: data.razonSocial?.trim() || data.nombreComercio.trim(),
        cuit: data.cuit?.trim() || '',
        ubicacion: data.ubicacion?.trim() || data.direccion?.trim() || '',
        emailContacto: data.emailContacto?.trim() || data.email.trim().toLowerCase(),
        horario: data.horario?.trim() || '',
        categoria: data.categoria || '',
        visible: data.visible ?? true,
        redesSociales: {
          facebook: data.redesSociales?.facebook?.trim() || '',
          instagram: data.redesSociales?.instagram?.trim() || '',
          twitter: data.redesSociales?.twitter?.trim() || '',
        },
        actualizadoEn: Timestamp.now()
      };
      
      await updateDoc(comercioRef, updateData);
      console.log('✅ Perfil de comercio actualizado exitosamente');
      
    } catch (error) {
      console.error('❌ Error updating comercio profile:', error);
      
      if (error instanceof Error) {
        throw error; // Re-throw validation errors
      }
      
      throw new Error('Error al actualizar el perfil del comercio');
    }
  }

  // Enhanced image upload with progress tracking
  static async uploadComercioImage(
    userId: string, 
    file: File, 
    type: 'logo' | 'imagen',
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Validate file first
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      console.log(`📤 Iniciando subida de ${type} para comercio ${userId}`);
      
      // Generate unique path
      const imagePath = generateImagePath(userId, type === 'logo' ? 'logo' : 'portada');
      
      // Get current comercio data to manage old images
      const comercioRef = doc(db, 'comercios', userId);
      const comercioDoc = await getDoc(comercioRef);
      
      let oldImageUrl: string | undefined;
      
      if (comercioDoc.exists()) {
        const comercioData = comercioDoc.data() as Comercio;
        oldImageUrl = type === 'logo' ? comercioData.logoUrl : comercioData.imagenPrincipalUrl;
      }

      // Upload new image with progress tracking
      onProgress?.(5);
      
      const downloadURL = await uploadImage(file, imagePath, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        quality: type === 'logo' ? 0.9 : 0.8, // Higher quality for logos
        retries: 3,
        onProgress: (uploadProgress) => {
          // Map upload progress to 5-90% range
          const mappedProgress = 5 + (uploadProgress * 0.85);
          onProgress?.(mappedProgress);
        }
      });

      onProgress?.(95);

      // Update comercio document
      const updateData = {
        [type === 'logo' ? 'logoUrl' : 'imagenPrincipalUrl']: downloadURL,
        actualizadoEn: Timestamp.now()
      };

      await updateDoc(comercioRef, updateData);
      
      onProgress?.(98);

      // Delete old image after successful update (don't wait for it)
      if (oldImageUrl && oldImageUrl !== downloadURL) {
        deleteImage(oldImageUrl).catch(error => {
          console.warn('⚠️ No se pudo eliminar imagen anterior:', error);
        });
      }

      onProgress?.(100);
      
      console.log(`✅ ${type} subida exitosamente:`, downloadURL);
      return downloadURL;
      
    } catch (error) {
      console.error(`❌ Error uploading comercio ${type}:`, error);
      
      if (error instanceof Error) {
        // Provide user-friendly error messages
        if (error.message.includes('CORS')) {
          throw new Error('Error de configuración del servidor. Por favor, contacta al soporte técnico.');
        }
        
        if (error.message.includes('permission') || error.message.includes('unauthorized')) {
          throw new Error('No tienes permisos para subir imágenes. Verifica tu sesión.');
        }
        
        if (error.message.includes('network') || error.message.includes('timeout')) {
          throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
        }
        
        throw error;
      }
      
      throw new Error(`Error al subir ${type === 'logo' ? 'el logo' : 'la imagen'}`);
    }
  }

  // Get comercio statistics with better error handling
  static async getComercioStats(userId: string): Promise<ComercioStats> {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get validaciones with error handling
      const validacionesRef = collection(db, 'validaciones');
      
      // Use Promise.allSettled to handle partial failures
      const [
        totalResult,
        todayResult,
        monthResult,
        beneficiosResult,
        comercioResult
      ] = await Promise.allSettled([
        // Total validaciones
        getDocs(query(validacionesRef, where('comercioId', '==', userId))),
        
        // Validaciones hoy
        getDocs(query(
          validacionesRef, 
          where('comercioId', '==', userId),
          where('fechaHora', '>=', Timestamp.fromDate(startOfDay))
        )),
        
        // Validaciones este mes
        getDocs(query(
          validacionesRef, 
          where('comercioId', '==', userId),
          where('fechaHora', '>=', Timestamp.fromDate(startOfMonth))
        )),
        
        // Beneficios activos
        getDocs(query(
          collection(db, 'beneficios'), 
          where('comercioId', '==', userId),
          where('estado', '==', 'activo')
        )),
        
        // Comercio data
        getDoc(doc(db, 'comercios', userId))
      ]);

      // Extract results with fallbacks
      const totalValidaciones = totalResult.status === 'fulfilled' ? totalResult.value.size : 0;
      const validacionesHoy = todayResult.status === 'fulfilled' ? todayResult.value.size : 0;
      const validacionesMes = monthResult.status === 'fulfilled' ? monthResult.value.size : 0;
      const beneficiosActivos = beneficiosResult.status === 'fulfilled' ? beneficiosResult.value.size : 0;
      
      let asociacionesVinculadas = 0;
      if (comercioResult.status === 'fulfilled' && comercioResult.value.exists()) {
        const comercioData = comercioResult.value.data() as Comercio;
        asociacionesVinculadas = comercioData?.asociacionesVinculadas?.length || 0;
      }

      // Calculate success rate
      let validacionesExitosas = 0;
      if (totalResult.status === 'fulfilled') {
        validacionesExitosas = totalResult.value.docs.filter(
          doc => doc.data().resultado === 'habilitado'
        ).length;
      }

      const tasaConversion = totalValidaciones > 0 
        ? (validacionesExitosas / totalValidaciones) * 100 
        : 0;

      // Get most used benefit
      const beneficioMasUsado = await this.getMostUsedBenefit(userId);

      return {
        totalValidaciones,
        validacionesHoy,
        validacionesMes,
        beneficiosActivos,
        beneficiosVencidos: 0, // Would need additional query
        asociacionesVinculadas,
        sociosAlcanzados: validacionesExitosas, // Unique socios who used benefits
        ingresosPotenciales: 0, // Would need transaction data
        tasaConversion: Math.round(tasaConversion * 100) / 100, // Round to 2 decimals
        beneficioMasUsado
      };
      
    } catch (error) {
      console.error('❌ Error getting comercio stats:', error);
      
      // Return default stats instead of throwing
      return {
        totalValidaciones: 0,
        validacionesHoy: 0,
        validacionesMes: 0,
        beneficiosActivos: 0,
        beneficiosVencidos: 0,
        asociacionesVinculadas: 0,
        sociosAlcanzados: 0,
        ingresosPotenciales: 0,
        tasaConversion: 0,
        beneficioMasUsado: undefined
      };
    }
  }

  // Get most used benefit with improved error handling
  private static async getMostUsedBenefit(userId: string) {
    try {
      const validacionesRef = collection(db, 'validaciones');
      const query_ = query(
        validacionesRef,
        where('comercioId', '==', userId),
        where('resultado', '==', 'habilitado'),
        orderBy('fechaHora', 'desc'),
        limit(100)
      );
      
      const snapshot = await getDocs(query_);
      
      if (snapshot.empty) {
        return undefined;
      }

      const beneficioCount: Record<string, number> = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const beneficioId = data.beneficioId;
        if (beneficioId) {
          beneficioCount[beneficioId] = (beneficioCount[beneficioId] || 0) + 1;
        }
      });

      const beneficioIds = Object.keys(beneficioCount);
      if (beneficioIds.length === 0) {
        return undefined;
      }

      const mostUsedId = beneficioIds.reduce((a, b) => 
        beneficioCount[a] > beneficioCount[b] ? a : b
      );

      if (mostUsedId) {
        const beneficioRef = doc(db, 'beneficios', mostUsedId);
        const beneficioDoc = await getDoc(beneficioRef);
        
        if (beneficioDoc.exists()) {
          const beneficioData = beneficioDoc.data();
          return {
            id: mostUsedId,
            titulo: beneficioData.titulo || 'Beneficio sin título',
            usos: beneficioCount[mostUsedId]
          };
        }
      }

      return undefined;
    } catch (error) {
      console.error('❌ Error getting most used benefit:', error);
      return undefined;
    }
  }

  // Generate QR validation URL
  static generateQRValidationURL(comercioId: string, beneficioId?: string): string {
    const timestamp = Date.now();
    const baseUrl = `fidelya://comercio/${comercioId}?t=${timestamp}`;
    return beneficioId ? `${baseUrl}&beneficio=${beneficioId}` : baseUrl;
  }

  // Generate web validation URL for fallback
  static generateWebValidationURL(comercioId: string, beneficioId?: string): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({ comercio: comercioId });
    if (beneficioId) {
      params.append('beneficio', beneficioId);
    }
    return `${baseUrl}/validar-beneficio?${params.toString()}`;
  }

  // Validate comercio exists and is active
  static async validateComercio(comercioId: string): Promise<boolean> {
    try {
      const comercioRef = doc(db, 'comercios', comercioId);
      const comercioDoc = await getDoc(comercioRef);
      
      if (!comercioDoc.exists()) {
        return false;
      }

      const comercioData = comercioDoc.data() as Comercio;
      return comercioData.estado === 'activo';
    } catch (error) {
      console.error('❌ Error validating comercio:', error);
      return false;
    }
  }

  // Get recent validaciones with pagination
  static async getRecentValidaciones(
    userId: string, 
    limit_: number = 10,
    lastDoc?: any
  ): Promise<{ validaciones: Validacion[]; hasMore: boolean }> {
    try {
      const validacionesRef = collection(db, 'validaciones');
      let query_ = query(
        validacionesRef,
        where('comercioId', '==', userId),
        orderBy('fechaHora', 'desc'),
        limit(limit_)
      );

      if (lastDoc) {
        query_ = query(
          validacionesRef,
          where('comercioId', '==', userId),
          orderBy('fechaHora', 'desc'),
          limit(limit_),
          // startAfter(lastDoc) // Uncomment if you want pagination
        );
      }

      const snapshot = await getDocs(query_);
      const validaciones = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Validacion[];

      return {
        validaciones,
        hasMore: snapshot.docs.length === limit_
      };
    } catch (error) {
      console.error('❌ Error getting recent validaciones:', error);
      return { validaciones: [], hasMore: false };
    }
  }

  // Update comercio visibility
  static async updateVisibility(userId: string, visible: boolean): Promise<void> {
    try {
      const comercioRef = doc(db, 'comercios', userId);
      await updateDoc(comercioRef, {
        visible,
        actualizadoEn: Timestamp.now()
      });
      
      console.log(`✅ Visibilidad actualizada: ${visible ? 'visible' : 'oculto'}`);
    } catch (error) {
      console.error('❌ Error updating comercio visibility:', error);
      throw new Error('Error al actualizar la visibilidad del comercio');
    }
  }

  // Batch update comercio data
  static async batchUpdateComercio(userId: string, updates: Partial<Comercio>): Promise<void> {
    try {
      const batch = writeBatch(db);
      const comercioRef = doc(db, 'comercios', userId);
      
      batch.update(comercioRef, {
        ...updates,
        actualizadoEn: Timestamp.now()
      });

      await batch.commit();
      console.log('✅ Actualización por lotes completada');
    } catch (error) {
      console.error('❌ Error batch updating comercio:', error);
      throw new Error('Error al actualizar los datos del comercio');
    }
  }

  // Health check for comercio service
  static async healthCheck(): Promise<{ status: 'ok' | 'error'; message: string }> {
    try {
      // Try to read from comercios collection
      const testQuery = query(collection(db, 'comercios'), limit(1));
      await getDocs(testQuery);
      
      return { status: 'ok', message: 'Servicio de comercios funcionando correctamente' };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { 
        status: 'error', 
        message: 'Error en el servicio de comercios' 
      };
    }
  }
}