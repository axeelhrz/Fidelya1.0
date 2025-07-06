import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Validacion, ValidacionRequest, ValidacionResponse, QRData } from '@/types/validacion';
import { BeneficiosService } from './beneficios.service';

export class ValidacionesService {
  private static readonly COLLECTION = 'validaciones';

  static async validarAcceso(request: ValidacionRequest): Promise<ValidacionResponse> {
    try {
      console.log('🔍 Iniciando validación de acceso:', request);

      // 1. Verificar datos del socio
      const socioDoc = await getDoc(doc(db, 'users', request.socioId));
      if (!socioDoc.exists()) {
        throw new Error('Socio no encontrado');
      }

      const socioData = socioDoc.data();
      console.log('👤 Datos del socio:', { nombre: socioData.nombre, estado: socioData.estado });
      
      // 2. Verificar estado del socio
      if (socioData.estado !== 'activo') {
        const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Socio no activo');
        return {
          resultado: 'no_habilitado',
          motivo: 'Tu cuenta no está activa. Contacta a tu asociación.',
          socio: {
            nombre: socioData.nombre,
            estado: socioData.estado,
            asociacion: socioData.asociacionId
          },
          validacionId
        };
      }

      // 3. Verificar comercio
      const comercioDoc = await getDoc(doc(db, 'users', request.comercioId));
      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data();
      console.log('🏪 Datos del comercio:', { nombre: comercioData.nombre, estado: comercioData.estado });

      if (comercioData.estado !== 'activo') {
        const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Comercio no activo');
        return {
          resultado: 'no_habilitado',
          motivo: 'El comercio no está disponible en este momento.',
          socio: {
            nombre: socioData.nombre,
            estado: socioData.estado,
            asociacion: socioData.asociacionId
          },
          validacionId
        };
      }

      // 4. Verificar asociación
      const asociacionId = socioData.asociacionId;
      if (!asociacionId) {
        const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Socio sin asociación');
        return {
          resultado: 'no_habilitado',
          motivo: 'No tienes una asociación asignada.',
          socio: {
            nombre: socioData.nombre,
            estado: socioData.estado,
            asociacion: asociacionId
          },
          validacionId
        };
      }

      // 5. Si hay beneficio específico, verificarlo
      let beneficio = null;
      if (request.beneficioId) {
        console.log('🎁 Verificando beneficio:', request.beneficioId);
        beneficio = await BeneficiosService.getBeneficioById(request.beneficioId);
        
        if (!beneficio) {
          const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Beneficio no encontrado');
          return {
            resultado: 'no_habilitado',
            motivo: 'El beneficio solicitado no existe.',
            socio: {
              nombre: socioData.nombre,
              estado: socioData.estado,
              asociacion: asociacionId
            },
            validacionId
          };
        }

        if (beneficio.estado !== 'activo') {
          const validacionId = await this.crearValidacion(request, 'vencido', 'Beneficio no disponible');
          return {
            resultado: 'vencido',
            motivo: 'Este beneficio ya no está disponible.',
            socio: {
              nombre: socioData.nombre,
              estado: socioData.estado,
              asociacion: asociacionId
            },
            validacionId
          };
        }

        // Verificar si el beneficio está disponible para la asociación del socio
        if (!beneficio.asociacionesDisponibles?.includes(asociacionId)) {
          const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Beneficio no disponible para tu asociación');
          return {
            resultado: 'no_habilitado',
            motivo: 'Este beneficio no está disponible para tu asociación.',
            socio: {
              nombre: socioData.nombre,
              estado: socioData.estado,
              asociacion: asociacionId
            },
            validacionId
          };
        }

        // Verificar fecha de vigencia
        if (beneficio.fechaFin) {
          const fechaFin = beneficio.fechaFin instanceof Date 
            ? beneficio.fechaFin 
            : beneficio.fechaFin.toDate();
          
          if (fechaFin < new Date()) {
            const validacionId = await this.crearValidacion(request, 'vencido', 'Beneficio vencido');
            return {
              resultado: 'vencido',
              motivo: 'Este beneficio ha expirado.',
              socio: {
                nombre: socioData.nombre,
                estado: socioData.estado,
                asociacion: asociacionId
              },
              validacionId
            };
          }
        }

        // Verificar límites de uso si existen
        if (beneficio.limitePorSocio) {
          const usosActuales = await this.getUsosCount(request.beneficioId, request.socioId);
          if (usosActuales >= beneficio.limitePorSocio) {
            const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Límite de usos alcanzado');
            return {
              resultado: 'no_habilitado',
              motivo: `Has alcanzado el límite de ${beneficio.limitePorSocio} usos para este beneficio.`,
              socio: {
                nombre: socioData.nombre,
                estado: socioData.estado,
                asociacion: asociacionId
              },
              validacionId
            };
          }
        }
      }

      // 6. Verificar que el comercio esté vinculado a la asociación del socio
      const comercioAsociaciones = comercioData.asociacionesVinculadas || [];
      if (!comercioAsociaciones.includes(asociacionId)) {
        const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Comercio no vinculado a tu asociación');
        return {
          resultado: 'no_habilitado',
          motivo: 'Este comercio no está vinculado a tu asociación.',
          socio: {
            nombre: socioData.nombre,
            estado: socioData.estado,
            asociacion: asociacionId
          },
          validacionId
        };
      }

      // 7. Todo OK - crear validación exitosa
      console.log('✅ Validación exitosa');
      const validacionId = await this.crearValidacion(request, 'habilitado', 'Acceso autorizado');

      return {
        resultado: 'habilitado',
        motivo: 'Validación exitosa',
        beneficio: beneficio ? {
          id: beneficio.id,
          titulo: beneficio.titulo,
          descuento: beneficio.descuento,
          tipo: beneficio.tipo,
          comercioNombre: beneficio.comercioNombre || comercioData.nombre,
          descripcion: beneficio.descripcion,
          fechaFin: beneficio.fechaFin
            ? (beneficio.fechaFin instanceof Date
                ? beneficio.fechaFin
                : (typeof beneficio.fechaFin.toDate === 'function'
                    ? beneficio.fechaFin.toDate()
                    : undefined))
            : undefined
        } : undefined,
        socio: {
          nombre: socioData.nombre,
          estado: socioData.estado,
          asociacion: asociacionId
        },
        validacionId
      };

    } catch (error) {
      console.error('❌ Error en validación:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al procesar validación');
    }
  }

  static async getHistorialValidaciones(socioId: string): Promise<Validacion[]> {
    try {
      console.log('📋 Obteniendo historial de validaciones para:', socioId);
      
      const q = query(
        collection(db, this.COLLECTION),
        where('socioId', '==', socioId),
        orderBy('fechaHora', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      const validaciones = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Validacion));

      console.log(`📋 Se encontraron ${validaciones.length} validaciones`);
      return validaciones;
    } catch (error) {
      console.error('❌ Error fetching historial validaciones:', error);
      throw new Error('Error al cargar historial de validaciones');
    }
  }

  static parseQRData(qrString: string): QRData | null {
    try {
      console.log('🔍 Parseando QR:', qrString);

      // Verificar si es una URL válida de fidelya
      if (!qrString.startsWith('fidelya://')) {
        console.warn('❌ QR no es una URL de fidelya');
        return null;
      }

      const url = new URL(qrString);
      
      if (url.protocol !== 'fidelya:' || !url.pathname.startsWith('//comercio/')) {
        console.warn('❌ Formato de QR inválido');
        return null;
      }

      const pathParts = url.pathname.split('/');
      const comercioId = pathParts[3];
      const beneficioId = url.searchParams.get('beneficio') || undefined;
      const timestamp = parseInt(url.searchParams.get('t') || '0');

      if (!comercioId || !timestamp) {
        console.warn('❌ Datos faltantes en QR');
        return null;
      }

      // Verificar que el QR no sea muy antiguo (ej: 5 minutos)
      const now = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutos
      if (now - timestamp > maxAge) {
        throw new Error('Código QR expirado. Solicita uno nuevo al comercio.');
      }

      const qrData = {
        comercioId,
        beneficioId,
        timestamp
      };

      console.log('✅ QR parseado exitosamente:', qrData);
      return qrData;
    } catch (error) {
      console.error('❌ Error parsing QR data:', error);
      throw error;
    }
  }

  private static async crearValidacion(
    request: ValidacionRequest, 
    resultado: ValidacionResponse['resultado'], 
    motivo?: string
  ): Promise<string> {
    try {
      console.log('💾 Creando validación:', { resultado, motivo });

      const validacionData = {
        socioId: request.socioId,
        comercioId: request.comercioId,
        beneficioId: request.beneficioId,
        fechaHora: Timestamp.now(),
        resultado,
        motivo,
        metadata: {
          ubicacion: request.ubicacion,
          dispositivo: typeof window !== 'undefined' ? 'web' : 'server',
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
          timestamp: Date.now()
        }
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), validacionData);
      console.log('✅ Validación creada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creando validación:', error);
      throw new Error('Error al registrar validación');
    }
  }

  private static async getUsosCount(beneficioId: string, socioId: string): Promise<number> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('beneficioId', '==', beneficioId),
        where('socioId', '==', socioId),
        where('resultado', '==', 'habilitado')
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting usos count:', error);
      return 0;
    }
  }

  // Método para generar QR de demo (útil para testing)
  static generateDemoQR(comercioId: string = 'demo123', beneficioId?: string): string {
    const timestamp = Date.now();
    const baseUrl = `fidelya://comercio/${comercioId}?t=${timestamp}`;
    return beneficioId ? `${baseUrl}&beneficio=${beneficioId}` : baseUrl;
  }

  // Método para validar formato de QR
  static isValidQRFormat(qrString: string): boolean {
    try {
      const parsed = this.parseQRData(qrString);
      return parsed !== null;
    } catch {
      return false;
    }
  }
}