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
      // 1. Verificar datos del socio
      const socioDoc = await getDoc(doc(db, 'users', request.socioId));
      if (!socioDoc.exists()) {
        throw new Error('Socio no encontrado');
      }

      const socioData = socioDoc.data();
      
      // 2. Verificar estado del socio
      if (socioData.estado !== 'activo') {
        const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Socio no activo');
        return {
          resultado: 'no_habilitado',
          socio: {
            nombre: socioData.nombre,
            estado: socioData.estado,
            asociacion: socioData.asociacionId
          },
          validacionId,
          beneficio: undefined
        };
      }

      // 3. Verificar comercio
      const comercioDoc = await getDoc(doc(db, 'users', request.comercioId));
      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data();
      if (comercioData.estado !== 'activo') {
        const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Comercio no activo');
        return {
          resultado: 'no_habilitado',
          socio: {
            nombre: socioData.nombre,
            estado: socioData.estado,
            asociacion: socioData.asociacionId
          },
          validacionId,
          beneficio: undefined
        };
      }

      // 4. Verificar asociación
      const asociacionId = socioData.asociacionId;
      if (!asociacionId) {
        const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Socio sin asociación');
        return {
          resultado: 'no_habilitado',
          socio: {
            nombre: socioData.nombre,
            estado: socioData.estado,
            asociacion: asociacionId
          },
          validacionId,
          beneficio: undefined
        };
      }

      // 5. Si hay beneficio específico, verificarlo
      let beneficio = null;
      if (request.beneficioId) {
        beneficio = await BeneficiosService.getBeneficioById(request.beneficioId);
        if (!beneficio) {
          const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Beneficio no encontrado');
          return {
            resultado: 'no_habilitado',
            socio: {
              nombre: socioData.nombre,
              estado: socioData.estado,
              asociacion: asociacionId
            },
            validacionId,
            beneficio: undefined
          };
        }

        if (beneficio.estado !== 'activo') {
          const validacionId = await this.crearValidacion(request, 'vencido', 'Beneficio no disponible');
          return {
            resultado: 'vencido',
            socio: {
              nombre: socioData.nombre,
              estado: socioData.estado,
              asociacion: asociacionId
            },
            validacionId,
            beneficio: undefined
          };
        }

        if (!beneficio.asociacionesDisponibles.includes(asociacionId)) {
          const validacionId = await this.crearValidacion(request, 'no_habilitado', 'Beneficio no disponible para tu asociación');
          return {
            resultado: 'no_habilitado',
            socio: {
              nombre: socioData.nombre,
              estado: socioData.estado,
              asociacion: asociacionId
            },
            validacionId,
            beneficio: undefined
          };
        }
      }

      // 6. Todo OK - crear validación exitosa
      const validacionId = await this.crearValidacion(request, 'habilitado', 'Acceso autorizado');

      return {
        resultado: 'habilitado',
        beneficio: beneficio ? {
          id: beneficio.id,
          titulo: beneficio.titulo,
          descuento: beneficio.descuento,
          tipo: beneficio.tipo
        } : undefined,
        socio: {
          nombre: socioData.nombre,
          estado: socioData.estado,
          asociacion: asociacionId
        },
        validacionId
      };

    } catch (error) {
      console.error('Error en validación:', error);
      throw new Error('Error al procesar validación');
    }
  }

  static async getHistorialValidaciones(socioId: string): Promise<Validacion[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('socioId', '==', socioId),
        orderBy('fechaHora', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Validacion));
    } catch (error) {
      console.error('Error fetching historial validaciones:', error);
      throw new Error('Error al cargar historial de validaciones');
    }
  }

  static parseQRData(qrString: string): QRData | null {
    try {
      // Esperamos un formato como: fidelita://comercio/{comercioId}?beneficio={beneficioId}&t={timestamp}
      const url = new URL(qrString);
      
      if (url.protocol !== 'fidelita:' || !url.pathname.startsWith('//comercio/')) {
        return null;
      }

      const comercioId = url.pathname.split('/')[3];
      const beneficioId = url.searchParams.get('beneficio') || undefined;
      const timestamp = parseInt(url.searchParams.get('t') || '0');

      if (!comercioId || !timestamp) {
        return null;
      }

      // Verificar que el QR no sea muy antiguo (ej: 5 minutos)
      const now = Date.now();
      if (now - timestamp > 5 * 60 * 1000) {
        throw new Error('Código QR expirado');
      }

      return {
        comercioId,
        beneficioId,
        timestamp
      };
    } catch (error) {
      console.error('Error parsing QR data:', error);
      return null;
    }
  }

  private static async crearValidacion(
    request: ValidacionRequest, 
    resultado: ValidacionResponse['resultado'], 
    motivo?: string
  ): Promise<string> {
    try {
      const validacionData = {
        socioId: request.socioId,
        comercioId: request.comercioId,
        beneficioId: request.beneficioId,
        fechaHora: Timestamp.now(),
        resultado,
        motivo,
        metadata: {
          ubicacion: request.ubicacion,
          dispositivo: 'web', // Se puede detectar
          ip: 'unknown' // Se puede obtener del servidor
        }
      };

      const docRef = await addDoc(collection(db, this.COLLECTION), validacionData);
      return docRef.id;
    } catch (error) {
      console.error('Error creando validación:', error);
      throw new Error('Error al registrar validación');
    }
  }
}
