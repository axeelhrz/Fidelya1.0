import {
  doc,
  getDoc,
  updateDoc,
  Timestamp as FirestoreTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc,
} from 'firebase/firestore';
const Timestamp = FirestoreTimestamp;
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { handleFirebaseError } from '@/lib/firebase-errors';
import { 
  Socio, 
  SocioConfiguration, 
  SocioActivity, 
  SocioStats, 
  SocioAsociacion,
  SocioLevel,
  UpdateSocioProfileData,
  SocioActivityFilter,
  SocioDataExport
} from '@/types/socio';

export interface SocioProfileData {
  nombre: string;
  telefono?: string;
  dni?: string;
  direccion?: string;
  fechaNacimiento?: Date;
  configuracion?: Partial<SocioConfiguration>;
}

class SocioService {
  /**
   * Obtiene los datos completos del perfil de un socio
   */
  async getSocioProfile(socioId: string): Promise<Socio | null> {
    try {
      const socioRef = doc(db, COLLECTIONS.SOCIOS, socioId);
      const socioSnap = await getDoc(socioRef);
      
      if (socioSnap.exists()) {
        const data = socioSnap.data();
        return {
          uid: socioSnap.id,
          ...data,
          creadoEn: data.creadoEn || Timestamp.now(),
          fechaNacimiento: data.fechaNacimiento instanceof Timestamp
            ? data.fechaNacimiento
            : data.fechaNacimiento ? Timestamp.fromDate(new Date(data.fechaNacimiento)) : undefined,
          configuracion: this.getDefaultConfiguration(data.configuracion),
          nivel: this.getDefaultLevel(data.nivel),
        } as Socio;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting socio profile:', error);
      throw new Error(handleFirebaseError(error as Error));
    }
  }

  /**
   * Actualiza el perfil de un socio con validación completa
   */
  async updateSocioProfile(
    socioId: string, 
    profileData: UpdateSocioProfileData
  ): Promise<void> {
    try {
      // Validar datos antes de actualizar
      // Adapt fechaNacimiento to Date | undefined for validation
      let fechaNacimiento: Date | undefined = undefined;
      if (profileData.fechaNacimiento) {
        if (profileData.fechaNacimiento instanceof Date) {
          fechaNacimiento = profileData.fechaNacimiento;
        } else if (
          typeof profileData.fechaNacimiento === 'object' &&
          profileData.fechaNacimiento !== null &&
          typeof (profileData.fechaNacimiento as { toDate?: () => Date }).toDate === 'function'
        ) {
          fechaNacimiento = (profileData.fechaNacimiento as { toDate: () => Date }).toDate();
        } else if (typeof profileData.fechaNacimiento === 'string') {
          const d = new Date(profileData.fechaNacimiento);
          if (!isNaN(d.getTime())) {
            fechaNacimiento = d;
          }
        }
      }
      const dataForValidation = {
        ...profileData,
        fechaNacimiento,
      };
      const validationErrors = this.validateProfileData(dataForValidation);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const socioRef = doc(db, COLLECTIONS.SOCIOS, socioId);
      
      // Preparar datos para actualización
      const updateData: Partial<Socio> = {
        actualizadoEn: Timestamp.now()
      };

      // Solo incluir campos que tienen valor
      if (profileData.nombre !== undefined) {
        updateData.nombre = profileData.nombre.trim();
      }

      if (profileData.telefono !== undefined && profileData.telefono.trim()) {
        updateData.telefono = profileData.telefono.trim();
      }

      if (profileData.dni !== undefined && profileData.dni.trim()) {
        updateData.dni = profileData.dni.trim();
      }

      if (profileData.direccion !== undefined && profileData.direccion.trim()) {
        updateData.direccion = profileData.direccion.trim();
      }

      // Manejar fecha de nacimiento correctamente
      if (profileData.fechaNacimiento) {
        if (profileData.fechaNacimiento instanceof Date) {
          updateData.fechaNacimiento = Timestamp.fromDate(profileData.fechaNacimiento);
        } else if (profileData.fechaNacimiento instanceof Timestamp) {
          updateData.fechaNacimiento = profileData.fechaNacimiento;
        } else {
          // Si es string, convertir a Date primero
          const fecha = new Date(profileData.fechaNacimiento as string);
          if (!isNaN(fecha.getTime())) {
            updateData.fechaNacimiento = Timestamp.fromDate(fecha);
          }
        }
      }

      // Incluir configuración si se proporciona
      if (profileData.configuracion) {
        updateData.configuracion = this.getDefaultConfiguration(profileData.configuracion);
      }

      await updateDoc(socioRef, updateData);

      // Registrar actividad
      await this.logActivity(socioId, {
        tipo: 'actualizacion',
        titulo: 'Perfil actualizado',
        descripcion: 'Información del perfil modificada',
        metadata: {
          camposActualizados: Object.keys(profileData).join(', ')
        }
      });
    } catch (error) {
      console.error('Error updating socio profile:', error);
      throw new Error(handleFirebaseError(error as Error));
    }
  }

  /**
   * Sube y actualiza la imagen de perfil del socio
   */
  async uploadProfileImage(socioId: string, file: File): Promise<string> {
    try {
      // Validar archivo
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('La imagen no puede superar los 5MB');
      }

      // Eliminar imagen anterior si existe
      const currentSocio = await this.getSocioProfile(socioId);
      if (currentSocio?.avatar) {
        try {
          await this.deleteProfileImage(currentSocio.avatar);
        } catch (error) {
          console.warn('Error deleting previous avatar:', error);
        }
      }

      // Generar rutas para las imágenes
      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'jpg';
      const avatarPath = `socios/${socioId}/avatar_${timestamp}.${extension}`;
      const thumbnailPath = `socios/${socioId}/avatar_thumbnail_${timestamp}.${extension}`;

      // Comprimir y subir imagen principal
      const compressedFile = await this.compressImage(file, 0.8, 800);
      const avatarRef = ref(storage, avatarPath);
      await uploadBytes(avatarRef, compressedFile);
      const avatarURL = await getDownloadURL(avatarRef);

      // Crear y subir thumbnail
      const thumbnailFile = await this.compressImage(file, 0.7, 200);
      const thumbnailRef = ref(storage, thumbnailPath);
      await uploadBytes(thumbnailRef, thumbnailFile);
      const thumbnailURL = await getDownloadURL(thumbnailRef);

      // Actualizar perfil con las nuevas URLs
      await this.updateSocioProfile(socioId, {
        avatar: avatarURL
      });

      // Actualizar también el thumbnail en el documento
      const socioRef = doc(db, COLLECTIONS.SOCIOS, socioId);
      await updateDoc(socioRef, {
        avatarThumbnail: thumbnailURL
      });

      // Registrar actividad
      await this.logActivity(socioId, {
        tipo: 'actualizacion',
        titulo: 'Imagen de perfil actualizada',
        descripcion: 'Nueva imagen de perfil subida'
      });

      return avatarURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new Error(handleFirebaseError(error as Error));
    }
  }

  /**
   * Elimina la imagen de perfil del socio
   */
  async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting profile image:', error);
      // No lanzar error para operaciones de eliminación
    }
  }

  /**
   * Actualiza la configuración del socio
   */
  async updateSocioConfiguration(
    socioId: string, 
    configuration: Partial<SocioConfiguration>
  ): Promise<void> {
    try {
      const socioRef = doc(db, COLLECTIONS.SOCIOS, socioId);
      
      await updateDoc(socioRef, {
        configuracion: configuration,
        actualizadoEn: Timestamp.now()
      });

      // Registrar actividad
      await this.logActivity(socioId, {
        tipo: 'configuracion',
        titulo: 'Configuración actualizada',
        descripcion: 'Preferencias de cuenta modificadas',
        metadata: {
          configuracionActualizada: Object.keys(configuration).join(', ')
        }
      });
    } catch (error) {
      console.error('Error updating socio configuration:', error);
      throw new Error(handleFirebaseError(error as Error));
    }
  }

  /**
   * Obtiene las estadísticas completas de un socio
   */
  async getSocioStats(socioId: string): Promise<SocioStats> {
    try {
      // Obtener validaciones del socio
      const validacionesRef = collection(db, COLLECTIONS.VALIDACIONES);
      const validacionesQuery = query(
        validacionesRef,
        where('socioId', '==', socioId),
        orderBy('fecha', 'desc')
      );
      
      const validacionesSnapshot = await getDocs(validacionesQuery);
      const validaciones = validacionesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Array<{ id: string; estado?: string; montoDescuento?: number; fecha?: FirestoreTimestamp | Date | undefined; comercioId?: string; categoria?: string; comercioNombre?: string; }>;

      // Calcular estadísticas básicas
      const totalValidaciones = validaciones.length;
      const validacionesExitosas = validaciones.filter(v => v.estado === 'exitosa').length;
      const ahorroTotal = validaciones.reduce((total, validacion) => 
        total + (validacion.montoDescuento || 0), 0
      );

      // Validaciones de este mes
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);
      
      const validacionesEsteMes = validaciones.filter(validacion => {
        const fecha = validacion.fecha
          ? (validacion.fecha instanceof Timestamp
              ? validacion.fecha.toDate()
              : validacion.fecha)
          : undefined;
        return fecha && fecha >= inicioMes;
      }).length;

      const ahorroEsteMes = validaciones
        .filter(validacion => {
          const fecha = validacion.fecha
            ? (validacion.fecha instanceof Timestamp
                ? validacion.fecha.toDate()
                : validacion.fecha)
            : undefined;
          return fecha && fecha >= inicioMes;
        })
        .reduce((total, validacion) => total + (validacion.montoDescuento || 0), 0);

      // Obtener información del socio para calcular tiempo como socio
      const socio = await this.getSocioProfile(socioId);
      const tiempoComoSocio = socio ? 
        Math.floor((new Date().getTime() - socio.creadoEn.toDate().getTime()) / (1000 * 60 * 60 * 24)) : 0;

      // Calcular racha (días consecutivos con actividad)
      const racha = this.calculateStreak(validaciones);

      // Comercios únicos visitados
      const comerciosUnicos = new Set(validaciones.map(v => v.comercioId)).size;

      // Descuento promedio
      const descuentoPromedio = totalValidaciones > 0 ? 
        Math.round(ahorroTotal / totalValidaciones) : 0;

      // Estadísticas por categoría
      const beneficiosPorCategoria: { [categoria: string]: number } = {};
      validaciones.forEach(validacion => {
        const categoria = validacion.categoria || 'Sin categoría';
        beneficiosPorCategoria[categoria] = (beneficiosPorCategoria[categoria] || 0) + 1;
      });

      // Comercios más visitados
      type ComercioVisita = {
        id: string;
        nombre: string;
        visitas: number;
        ultimaVisita: FirestoreTimestamp | Date | undefined;
      };
      const comerciosVisitas: { [comercioId: string]: ComercioVisita } = {};
      validaciones.forEach(validacion => {
        if (validacion.comercioId) {
          if (!comerciosVisitas[validacion.comercioId]) {
            comerciosVisitas[validacion.comercioId] = {
              id: validacion.comercioId,
              nombre: validacion.comercioNombre || 'Comercio',
              visitas: 0,
              ultimaVisita: validacion.fecha
            };
          }
          comerciosVisitas[validacion.comercioId].visitas++;
          if (
            validacion.fecha &&
            comerciosVisitas[validacion.comercioId].ultimaVisita &&
            validacion.fecha !== undefined &&
            comerciosVisitas[validacion.comercioId].ultimaVisita !== undefined &&
            validacion.fecha != null &&
            comerciosVisitas[validacion.comercioId].ultimaVisita != null &&
            (validacion.fecha ?? 0) > (comerciosVisitas[validacion.comercioId].ultimaVisita ?? 0)
          ) {
            comerciosVisitas[validacion.comercioId].ultimaVisita = validacion.fecha;
          }
        }
      });

      const comerciosMasVisitados = Object.values(comerciosVisitas)
        .sort((a: ComercioVisita, b: ComercioVisita) => b.visitas - a.visitas)
        .slice(0, 5)
        .map((comercio) => ({
          ...comercio,
          ultimaVisita: (() => {
            if (comercio.ultimaVisita instanceof Timestamp) {
              return comercio.ultimaVisita;
            }
            if (comercio.ultimaVisita instanceof Date) {
            }
            // Si es undefined, usar Timestamp.now() o un valor por defecto
            return Timestamp.now();
          })()
        }));

      // Actividad por mes (últimos 12 meses)
      const actividadPorMes: { [mes: string]: number } = {};
      const ahora = new Date();
      for (let i = 11; i >= 0; i--) {
        const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
        const mesKey = fecha.toISOString().slice(0, 7); // YYYY-MM
        actividadPorMes[mesKey] = 0;
      }

      validaciones.forEach(validacion => {
        let fecha: Date | undefined;
        if (validacion.fecha instanceof Timestamp) {
          fecha = validacion.fecha.toDate();
        } else if (validacion.fecha instanceof Date) {
          fecha = validacion.fecha;
        }
        if (fecha) {
          const mesKey = fecha.toISOString().slice(0, 7);
          if (actividadPorMes.hasOwnProperty(mesKey)) {
            actividadPorMes[mesKey]++;
          }
        }
      });

      return {
        total: 0, // Para compatibilidad
        activos: 0, // Para compatibilidad
        vencidos: 0, // Para compatibilidad
        inactivos: 0, // Para compatibilidad
        
        // Estadísticas del perfil individual
        beneficiosUsados: totalValidaciones,
        ahorroTotal,
        beneficiosEsteMes: validacionesEsteMes,
        asociacionesActivas: socio?.asociacionId ? 1 : 0,
        racha,
        comerciosVisitados: comerciosUnicos,
        validacionesExitosas: Math.round((validacionesExitosas / totalValidaciones) * 100) || 0,
        descuentoPromedio,
        ahorroEsteMes,
        beneficiosFavoritos: Object.keys(beneficiosPorCategoria).length,
        tiempoComoSocio,
        
        // Estadísticas avanzadas
        actividadPorMes,
        beneficiosPorCategoria,
        comerciosMasVisitados,
        beneficiosMasUsados: [] // Se puede implementar más adelante
      };
    } catch (error) {
      console.error('Error getting socio stats:', error);
      // Retornar estadísticas por defecto en caso de error
      return {
        total: 0,
        activos: 0,
        vencidos: 0,
        inactivos: 0,
        beneficiosUsados: 0,
        ahorroTotal: 0,
        beneficiosEsteMes: 0,
        asociacionesActivas: 0,
        racha: 0,
        comerciosVisitados: 0,
        validacionesExitosas: 0,
        descuentoPromedio: 0,
        ahorroEsteMes: 0,
        beneficiosFavoritos: 0,
        tiempoComoSocio: 0
      };
    }
  }

  /**
   * Obtiene las asociaciones de un socio con información detallada
   */
  async getSocioAsociaciones(socioId: string): Promise<SocioAsociacion[]> {
    try {
      const socio = await this.getSocioProfile(socioId);
      if (!socio?.asociacionId) {
        return [];
      }

      const asociacionRef = doc(db, COLLECTIONS.ASOCIACIONES, socio.asociacionId);
      const asociacionSnap = await getDoc(asociacionRef);
      
      if (asociacionSnap.exists()) {
        const asociacionData = asociacionSnap.data();
        
        // Calcular fecha de vencimiento basada en el tipo de membresía
        const fechaVencimiento = this.calculateExpirationDate(
          socio.creadoEn.toDate(),
          asociacionData.tipoMembresia || 'anual'
        );

        return [{
          id: asociacionSnap.id,
          nombre: asociacionData.nombre || 'Asociación',
          descripcion: asociacionData.descripcion,
          logo: asociacionData.logo,
          estado: socio.estado === 'inactivo' ? 'suspendido' : socio.estado,
          fechaInicio: socio.creadoEn,
          fechaVencimiento: Timestamp.fromDate(fechaVencimiento),
          tipo: asociacionData.tipoMembresia || 'anual',
          beneficiosIncluidos: asociacionData.beneficiosIncluidos || 0,
          descuentoMaximo: asociacionData.descuentoMaximo || 0,
          comerciosAfiliados: asociacionData.comerciosAfiliados || 0
        }];
      }

      return [];
    } catch (error) {
      console.error('Error getting socio asociaciones:', error);
      return [];
    }
  }

  /**
   * Obtiene la actividad reciente del socio
   */
  async getSocioActivity(
    socioId: string, 
    filter: SocioActivityFilter = {}
  ): Promise<SocioActivity[]> {
    try {
      const activitiesRef = collection(db, COLLECTIONS.ACTIVITIES);
      let activityQuery = query(
        activitiesRef,
        where('socioId', '==', socioId),
        orderBy('fecha', 'desc')
      );

      if (filter.limit) {
        activityQuery = query(activityQuery, limit(filter.limit));
      }

      const activitiesSnapshot = await getDocs(activityQuery);
      return activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SocioActivity[];
    } catch (error) {
      console.error('Error getting socio activity:', error);
      return [];
    }
  }

  /**
   * Registra una nueva actividad del socio
   */
  async logActivity(
    socioId: string, 
    activity: Omit<SocioActivity, 'id' | 'fecha'>
  ): Promise<void> {
    try {
      const activitiesRef = collection(db, COLLECTIONS.ACTIVITIES);
      await addDoc(activitiesRef, {
        ...activity,
        socioId,
        fecha: Timestamp.now()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
      // No lanzar error para logging de actividad
    }
  }

  /**
   * Exporta todos los datos del socio
   */
  async exportSocioData(socioId: string): Promise<SocioDataExport> {
    try {
      const [socio, estadisticas, asociaciones, actividad] = await Promise.all([
        this.getSocioProfile(socioId),
        this.getSocioStats(socioId),
        this.getSocioAsociaciones(socioId),
        this.getSocioActivity(socioId, { limit: 1000 })
      ]);

      if (!socio) {
        throw new Error('Socio no encontrado');
      }

      return {
        perfil: socio,
        estadisticas,
        asociaciones,
        actividad,
        configuracion: socio.configuracion || this.getDefaultConfiguration(),
        fechaExportacion: Timestamp.now()
      };
    } catch (error) {
      console.error('Error exporting socio data:', error);
      throw new Error(handleFirebaseError(error as Error));
    }
  }

  /**
   * Valida los datos del perfil antes de actualizar
   */
  validateProfileData(data: Partial<SocioProfileData>): string[] {
    const errors: string[] = [];

    if (data.nombre !== undefined && data.nombre.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (data.telefono !== undefined && data.telefono.trim() && data.telefono.trim().length < 8) {
      errors.push('El teléfono debe tener al menos 8 dígitos');
    }

    if (data.dni !== undefined && data.dni.trim() && data.dni.trim().length < 7) {
      errors.push('El DNI debe tener al menos 7 caracteres');
    }

    if (data.fechaNacimiento) {
      const fecha = data.fechaNacimiento instanceof Date 
        ? data.fechaNacimiento 
        : new Date(data.fechaNacimiento);
      
      if (isNaN(fecha.getTime())) {
        errors.push('La fecha de nacimiento no es válida');
      } else {
        const edad = new Date().getFullYear() - fecha.getFullYear();
        if (edad < 16 || edad > 120) {
          errors.push('La fecha de nacimiento no es válida (edad debe estar entre 16 y 120 años)');
        }
      }
    }

    return errors;
  }

  /**
   * Actualiza el último acceso del socio
   */
  async updateLastAccess(socioId: string): Promise<void> {
    try {
      const socioRef = doc(db, COLLECTIONS.SOCIOS, socioId);
      await updateDoc(socioRef, {
        ultimoAcceso: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating last access:', error);
      // No lanzar error para actualización de último acceso
    }
  }

  // Métodos privados auxiliares

  /**
   * Obtiene la configuración por defecto para un socio
   */
  public getDefaultConfiguration(existing?: Partial<SocioConfiguration>): SocioConfiguration {
    return {
      // Notificaciones
      notificaciones: true,
      notificacionesPush: true,
      notificacionesEmail: true,
      notificacionesSMS: false,
      
      // Apariencia
      tema: 'light',
      idioma: 'es',
      moneda: 'ARS',
      timezone: 'America/Argentina/Buenos_Aires',
      
      // Privacidad
      perfilPublico: false,
      mostrarEstadisticas: true,
      mostrarActividad: true,
      compartirDatos: false,
      
      // Preferencias
      beneficiosFavoritos: [],
      comerciosFavoritos: [],
      categoriasFavoritas: [],
      
      ...existing
    };
  }

  /**
   * Obtiene el nivel por defecto para un socio
   */
  private getDefaultLevel(existing?: Partial<SocioLevel>): SocioLevel {
    return {
      nivel: 'Bronze',
      puntos: 0,
      puntosParaProximoNivel: 1000,
      proximoNivel: 'Silver',
      beneficiosDesbloqueados: [],
      descuentoAdicional: 0,
      ...existing
    };
  }

  /**
   * Comprime una imagen
   */
  private async compressImage(file: File, quality: number, maxSize: number): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo aspecto
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar y comprimir
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

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Calcula la racha de días consecutivos con actividad
   */
  private calculateStreak(validaciones: { fecha?: FirestoreTimestamp | Date }[]): number {
    if (validaciones.length === 0) return 0;

    const fechas = validaciones
      .map(v => {
        if (!v.fecha) return undefined;
        if (v.fecha instanceof Timestamp) {
          return v.fecha.toDate();
        }
        return v.fecha;
      })
      .filter(fecha => fecha)
      .map(fecha => fecha!.toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const fechasUnicas = [...new Set(fechas)];
    
    let racha = 0;
    let fechaActual = new Date();

    for (const fecha of fechasUnicas) {
      const fechaValidacion = new Date(fecha);
      const diferenciaDias = Math.floor(
        (fechaActual.getTime() - fechaValidacion.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diferenciaDias <= 1) {
        racha++;
        fechaActual = fechaValidacion;
      } else {
        break;
      }
    }

    return racha;
  }

  /**
   * Calcula la fecha de vencimiento basada en el tipo de membresía
   */
  private calculateExpirationDate(fechaInicio: Date, tipo: string): Date {
    const fecha = new Date(fechaInicio);
    
    switch (tipo) {
      case 'mensual':
        fecha.setMonth(fecha.getMonth() + 1);
        break;
      case 'anual':
        fecha.setFullYear(fecha.getFullYear() + 1);
        break;
      case 'vitalicia':
        fecha.setFullYear(fecha.getFullYear() + 100); // Fecha muy lejana
        break;
      default:
        fecha.setFullYear(fecha.getFullYear() + 1);
    }
    
    return fecha;
  }
}

// Export singleton instance
export const socioService = new SocioService();
export default socioService;
            
