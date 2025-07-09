import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { COLLECTIONS, QR_CONFIG } from '@/lib/constants';
import { handleError } from '@/lib/error-handler';
import QRCode from 'qrcode';

export interface Comercio {
  id: string;
  nombreComercio: string;
  categoria: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email: string;
  sitioWeb?: string;
  horario?: string;
  cuit?: string;
  logo?: string;
  banner?: string;
  estado: 'activo' | 'inactivo' | 'pendiente' | 'suspendido';
  visible: boolean;
  asociacionesVinculadas: string[];
  qrCode?: string;
  qrCodeUrl?: string;
  beneficiosActivos: number;
  validacionesRealizadas: number;
  clientesAtendidos: number;
  ingresosMensuales: number;
  rating: number;
  configuracion: {
    notificacionesEmail: boolean;
    notificacionesWhatsApp: boolean;
    autoValidacion: boolean;
    requiereAprobacion: boolean;
  };
  creadoEn: Date;
  actualizadoEn: Date;
  metadata?: Record<string, unknown>;
}

export interface ComercioFormData {
  nombreComercio: string;
  categoria: string;
  descripcion?: string;
  direccion?: string;
  telefono?: string;
  email: string;
  sitioWeb?: string;
  horario?: string;
  cuit?: string;
  configuracion?: {
    notificacionesEmail: boolean;
    notificacionesWhatsApp: boolean;
    autoValidacion: boolean;
    requiereAprobacion: boolean;
  };
}

export interface ComercioStats {
  totalBeneficios: number;
  beneficiosActivos: number;
  validacionesHoy: number;
  validacionesMes: number;
  clientesUnicos: number;
  ingresosMensuales: number;
  promedioValidacionesDiarias: number;
  crecimientoMensual: number;
}

export interface ValidationData {
  id: string;
  socioId: string;
  socioNombre: string;
  beneficioId: string;
  beneficioTitulo: string;
  fechaValidacion: Date;
  montoDescuento: number;
  estado: 'exitosa' | 'fallida' | 'pendiente';
  metodoPago?: string;
  notas?: string;
}

export interface QRCodeData {
  comercioId: string;
  beneficioId?: string;
  timestamp: number;
  version: string;
}

class ComercioService {
  private readonly collection = COLLECTIONS.COMERCIOS;
  private readonly validacionesCollection = COLLECTIONS.VALIDACIONES;
  private readonly beneficiosCollection = COLLECTIONS.BENEFICIOS;

  /**
   * Create new comercio
   */
  async createComercio(data: ComercioFormData, asociacionId: string): Promise<string | null> {
    try {
      // Validate required fields
      if (!data.nombreComercio || !data.email || !data.categoria) {
        throw new Error('Faltan campos obligatorios');
      }

      // Check if email already exists
      const existingQuery = query(
        collection(db, this.collection),
        where('email', '==', data.email)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        throw new Error('Ya existe un comercio con este email');
      }

      const comercioData = {
        ...data,
        estado: 'pendiente' as const,
        visible: true,
        asociacionesVinculadas: [asociacionId],
        beneficiosActivos: 0,
        validacionesRealizadas: 0,
        clientesAtendidos: 0,
        ingresosMensuales: 0,
        rating: 0,
        configuracion: data.configuracion || {
          notificacionesEmail: true,
          notificacionesWhatsApp: false,
          autoValidacion: false,
          requiereAprobacion: true,
        },
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, this.collection), comercioData);
      
      console.log('✅ Comercio created successfully:', docRef.id);
      return docRef.id;
    } catch (error) {
      handleError(error, 'Create Comercio');
      return null;
    }
  }

  /**
   * Get comercio by ID
   */
  async getComercioById(id: string): Promise<Comercio | null> {
    try {
      const comercioDoc = await getDoc(doc(db, this.collection, id));
      
      if (!comercioDoc.exists()) {
        return null;
      }

      const data = comercioDoc.data();
      return {
        id: comercioDoc.id,
        ...data,
        creadoEn: data.creadoEn?.toDate() || new Date(),
        actualizadoEn: data.actualizadoEn?.toDate() || new Date(),
      } as Comercio;
    } catch (error) {
      handleError(error, 'Get Comercio By ID');
      return null;
    }
  }

  /**
   * Get comercios by association with filters
   */
  async getComerciosByAsociacion(
    asociacionId: string,
    filters: {
      estado?: string;
      categoria?: string;
      busqueda?: string;
      soloActivos?: boolean;
    } = {},
    pageSize = 20,
    lastDoc?: import('firebase/firestore').QueryDocumentSnapshot<import('firebase/firestore').DocumentData> | null
  ): Promise<{
    comercios: Comercio[];
    hasMore: boolean;
    lastDoc: import('firebase/firestore').QueryDocumentSnapshot<import('firebase/firestore').DocumentData> | null;
  }> {
    try {
      let q = query(
        collection(db, this.collection),
        where('asociacionesVinculadas', 'array-contains', asociacionId),
        orderBy('creadoEn', 'desc')
      );

      // Apply filters
      if (filters.estado) {
        q = query(q, where('estado', '==', filters.estado));
      }

      if (filters.categoria) {
        q = query(q, where('categoria', '==', filters.categoria));
      }

      if (filters.soloActivos) {
        q = query(q, where('estado', '==', 'activo'));
      }

      // Add pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(pageSize + 1));

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;
      const hasMore = docs.length > pageSize;

      if (hasMore) {
        docs.pop();
      }

      let comercios = docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          creadoEn: data.creadoEn?.toDate() || new Date(),
          actualizadoEn: data.actualizadoEn?.toDate() || new Date(),
        } as Comercio;
      });

      // Apply client-side search filter
      if (filters.busqueda) {
        const searchTerm = filters.busqueda.toLowerCase();
        comercios = comercios.filter(comercio =>
          comercio.nombreComercio.toLowerCase().includes(searchTerm) ||
          comercio.email.toLowerCase().includes(searchTerm) ||
          comercio.categoria.toLowerCase().includes(searchTerm) ||
          (comercio.direccion && comercio.direccion.toLowerCase().includes(searchTerm))
        );
      }

      return {
        comercios,
        hasMore,
        lastDoc: docs.length > 0 ? docs[docs.length - 1] : null
      };
    } catch (error) {
      handleError(error, 'Get Comercios By Asociacion');
      return { comercios: [], hasMore: false, lastDoc: null };
    }
  }

  /**
   * Update comercio profile
   */
  async updateComercio(id: string, data: Partial<ComercioFormData>): Promise<boolean> {
    try {
      const updateData: Partial<ComercioFormData> & { actualizadoEn: unknown } = {
        ...data,
        actualizadoEn: serverTimestamp(),
      };

      await updateDoc(doc(db, this.collection, id), updateData);

      console.log('✅ Comercio updated successfully:', id);
      return true;
    } catch (error) {
      handleError(error, 'Update Comercio');
      return false;
    }
  }

  /**
   * Delete comercio (logical delete)
   */
  async deleteComercio(id: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        estado: 'inactivo',
        visible: false,
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Comercio deleted successfully:', id);
      return true;
    } catch (error) {
      handleError(error, 'Delete Comercio');
      return false;
    }
  }

  /**
   * Change comercio status
   */
  async changeComercioStatus(id: string, estado: 'activo' | 'inactivo' | 'suspendido'): Promise<boolean> {
    try {
      await updateDoc(doc(db, this.collection, id), {
        estado,
        visible: estado === 'activo',
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Comercio status changed successfully:', id, estado);
      return true;
    } catch (error) {
      handleError(error, 'Change Comercio Status');
      return false;
    }
  }

  /**
   * Get active benefits for comercio
   */
  async getActiveBenefits(comercioId: string): Promise<Array<{
    id: string;
    titulo: string;
    descripcion: string;
    descuento: number;
    tipo: string;
    fechaFin: Date;
    usosActuales: number;
    limiteTotal?: number;
  }>> {
    try {
      const q = query(
        collection(db, this.beneficiosCollection),
        where('comercioId', '==', comercioId),
        where('estado', '==', 'activo'),
        orderBy('creadoEn', 'desc')
      );

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
          descuento: data.descuento,
          tipo: data.tipo,
          fechaFin: data.fechaFin?.toDate() || new Date(),
          usosActuales: data.usosActuales || 0,
          limiteTotal: data.limiteTotal,
        };
      });
    } catch (error) {
      handleError(error, 'Get Active Benefits');
      return [];
    }
  }

  /**
   * Upload comercio logo
   */
  async uploadLogo(comercioId: string, file: File): Promise<string | null> {
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, `comercios/${comercioId}/${fileName}`);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update comercio with logo URL
      await updateDoc(doc(db, this.collection, comercioId), {
        logo: downloadURL,
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Logo uploaded successfully');
      return downloadURL;
    } catch (error) {
      handleError(error, 'Upload Logo');
      return null;
    }
  }

  /**
   * Generate QR Code for comercio
   */
  async generateQRCode(comercioId: string, beneficioId?: string): Promise<string | null> {
    try {
      // Create validation URL
      const baseUrl = QR_CONFIG.baseUrl;
      const validationUrl = `${baseUrl}${QR_CONFIG.validationPath}?comercio=${comercioId}${beneficioId ? `&beneficio=${beneficioId}` : ''}`;

      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(validationUrl, {
        width: QR_CONFIG.size,
        margin: QR_CONFIG.margin,
        color: QR_CONFIG.color,
        errorCorrectionLevel: QR_CONFIG.errorCorrectionLevel,
      });

      // Convert data URL to blob and upload to storage
      const response = await fetch(qrCodeDataURL);
      const blob = await response.blob();
      
      const fileName = `qr_${comercioId}_${Date.now()}.png`;
      const storageRef = ref(storage, `qr-codes/${comercioId}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update comercio with QR code URL
      await updateDoc(doc(db, this.collection, comercioId), {
        qrCode: qrCodeDataURL,
        qrCodeUrl: downloadURL,
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ QR Code generated successfully');
      return qrCodeDataURL;
    } catch (error) {
      handleError(error, 'Generate QR Code');
      return null;
    }
  }

  /**
   * Generate multiple QR codes for batch download
   */
  async generateBatchQRCodes(comercioIds: string[]): Promise<Array<{
    comercioId: string;
    nombreComercio: string;
    qrCodeDataURL: string;
  }>> {
    try {
      const results = [];

      for (const comercioId of comercioIds) {
        const comercio = await this.getComercioById(comercioId);
        if (!comercio) continue;

        const qrCodeDataURL = await this.generateQRCode(comercioId);
        if (qrCodeDataURL) {
          results.push({
            comercioId,
            nombreComercio: comercio.nombreComercio,
            qrCodeDataURL,
          });
        }
      }

      console.log('✅ Batch QR codes generated successfully');
      return results;
    } catch (error) {
      handleError(error, 'Generate Batch QR Codes');
      return [];
    }
  }

  /**
   * Generate QR validation URL
   */
  generateQRValidationURL(comercioId: string, beneficioId?: string): string {
    const baseUrl = QR_CONFIG.baseUrl;
    return `${baseUrl}${QR_CONFIG.validationPath}?comercio=${comercioId}${beneficioId ? `&beneficio=${beneficioId}` : ''}`;
  }

  /**
   * Validate comercio exists and is active
   */
  async validateComercio(comercioId: string): Promise<boolean> {
    try {
      const comercio = await this.getComercioById(comercioId);
      return comercio !== null && comercio.estado === 'activo';
    } catch (error) {
      handleError(error, 'Validate Comercio');
      return false;
    }
  }

  /**
   * Get comercio statistics
   */
  async getComercioStats(comercioId: string): Promise<ComercioStats> {
    try {
      const comercio = await this.getComercioById(comercioId);
      if (!comercio) {
        throw new Error('Comercio no encontrado');
      }

      // Get validations for this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const validacionesQuery = query(
        collection(db, this.validacionesCollection),
        where('comercioId', '==', comercioId),
        where('fechaValidacion', '>=', Timestamp.fromDate(startOfMonth))
      );

      const validacionesSnapshot = await getDocs(validacionesQuery);
      const validaciones = validacionesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          socioId: data.socioId,
          fechaValidacion: data.fechaValidacion?.toDate() || new Date(),
          montoDescuento: data.montoDescuento ?? 0,
        };
      });

      // Calculate stats
      const validacionesHoy = validaciones.filter(v => 
        v.fechaValidacion >= startOfDay
      ).length;

      const validacionesMes = validaciones.length;

      const clientesUnicos = new Set(validaciones.map(v => v.socioId)).size;

      const ingresosMensuales = validaciones.reduce((total, v) => 
        total + (v.montoDescuento || 0), 0
      );

      // Calculate daily average
      const daysInMonth = now.getDate();
      const promedioValidacionesDiarias = daysInMonth > 0 ? validacionesMes / daysInMonth : 0;

      // Get previous month for growth calculation
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const prevMonthQuery = query(
        collection(db, this.validacionesCollection),
        where('comercioId', '==', comercioId),
        where('fechaValidacion', '>=', Timestamp.fromDate(startOfPrevMonth)),
        where('fechaValidacion', '<=', Timestamp.fromDate(endOfPrevMonth))
      );

      const prevMonthSnapshot = await getDocs(prevMonthQuery);
      const validacionesPrevMes = prevMonthSnapshot.size;

      const crecimientoMensual = validacionesPrevMes > 0 
        ? ((validacionesMes - validacionesPrevMes) / validacionesPrevMes) * 100 
        : 0;

      return {
        totalBeneficios: comercio.beneficiosActivos || 0,
        beneficiosActivos: comercio.beneficiosActivos || 0,
        validacionesHoy,
        validacionesMes,
        clientesUnicos,
        ingresosMensuales,
        promedioValidacionesDiarias,
        crecimientoMensual,
      };
    } catch (error) {
      handleError(error, 'Get Comercio Stats');
      return {
        totalBeneficios: 0,
        beneficiosActivos: 0,
        validacionesHoy: 0,
        validacionesMes: 0,
        clientesUnicos: 0,
        ingresosMensuales: 0,
        promedioValidacionesDiarias: 0,
        crecimientoMensual: 0,
      };
    }
  }

  /**
   * Get recent validations
   */
  async getRecentValidations(
    comercioId: string,
    limitCount: number = 10
  ): Promise<ValidationData[]> {
    try {
      const q = query(
        collection(db, this.validacionesCollection),
        where('comercioId', '==', comercioId),
        orderBy('fechaValidacion', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fechaValidacion: data.fechaValidacion?.toDate() || new Date(),
        } as ValidationData;
      });
    } catch (error) {
      handleError(error, 'Get Recent Validations');
      return [];
    }
  }

  /**
   * Get validations with filters and pagination
   */
  async getValidations(
    comercioId: string,
    filters: {
      fechaDesde?: Date;
      fechaHasta?: Date;
      estado?: string;
      beneficioId?: string;
    } = {},
    pageSize = 20,
    lastDoc?: import('firebase/firestore').QueryDocumentSnapshot<import('firebase/firestore').DocumentData> | null
  ): Promise<{ validaciones: ValidationData[]; hasMore: boolean; lastDoc: import('firebase/firestore').QueryDocumentSnapshot<import('firebase/firestore').DocumentData> | null }> {
    try {
      let q = query(
        collection(db, this.validacionesCollection),
        where('comercioId', '==', comercioId),
        orderBy('fechaValidacion', 'desc')
      );

      // Apply filters
      if (filters.fechaDesde) {
        q = query(q, where('fechaValidacion', '>=', Timestamp.fromDate(filters.fechaDesde)));
      }

      if (filters.fechaHasta) {
        q = query(q, where('fechaValidacion', '<=', Timestamp.fromDate(filters.fechaHasta)));
      }

      if (filters.estado) {
        q = query(q, where('estado', '==', filters.estado));
      }

      if (filters.beneficioId) {
        q = query(q, where('beneficioId', '==', filters.beneficioId));
      }

      // Add pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(pageSize + 1)); // Get one extra to check if there are more

      const snapshot = await getDocs(q);
      const docs = snapshot.docs;
      const hasMore = docs.length > pageSize;

      if (hasMore) {
        docs.pop(); // Remove the extra document
      }

      const validaciones = docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          fechaValidacion: data.fechaValidacion?.toDate() || new Date(),
        } as ValidationData;
      });

      return {
        validaciones,
        hasMore,
        lastDoc: docs.length > 0 ? docs[docs.length - 1] : null
      };
    } catch (error) {
      handleError(error, 'Get Validations');
      return { validaciones: [], hasMore: false, lastDoc: null };
    }
  }

  /**
   * Get analytics data for charts
   */
  async getAnalyticsData(
    comercioId: string,
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<{
    validacionesPorDia: Array<{ fecha: string; validaciones: number; ingresos: number }>;
    beneficiosMasUsados: Array<{ beneficioId: string; titulo: string; usos: number }>;
    clientesPorAsociacion: Array<{ asociacionId: string; nombre: string; clientes: number }>;
    horariosActividad: Array<{ hora: number; validaciones: number }>;
  }> {
    try {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default: // month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const q = query(
        collection(db, this.validacionesCollection),
        where('comercioId', '==', comercioId),
        where('fechaValidacion', '>=', Timestamp.fromDate(startDate)),
        where('estado', '==', 'exitosa')
      );

      const snapshot = await getDocs(q);
      const validaciones = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          socioId: data.socioId,
          socioNombre: data.socioNombre,
          beneficioId: data.beneficioId,
          beneficioTitulo: data.beneficioTitulo,
          fechaValidacion: data.fechaValidacion?.toDate() || new Date(),
          montoDescuento: data.montoDescuento ?? 0,
          estado: data.estado,
          metodoPago: data.metodoPago,
          notas: data.notas,
          asociacionId: data.asociacionId,
          asociacionNombre: data.asociacionNombre,
        } as ValidationData & { asociacionId?: string; asociacionNombre?: string };
      });

      // Process data for charts
      const validacionesPorDia = this.processValidacionesPorDia(validaciones, startDate, now);
      const beneficiosMasUsados = this.processBeneficiosMasUsados(validaciones);
      const clientesPorAsociacion = this.processClientesPorAsociacion(validaciones);
      const horariosActividad = this.processHorariosActividad(validaciones);

      return {
        validacionesPorDia,
        beneficiosMasUsados,
        clientesPorAsociacion,
        horariosActividad,
      };
    } catch (error) {
      handleError(error, 'Get Analytics Data');
      return {
        validacionesPorDia: [],
        beneficiosMasUsados: [],
        clientesPorAsociacion: [],
        horariosActividad: [],
      };
    }
  }

  /**
   * Update comercio configuration
   */
  async updateConfiguration(
    comercioId: string,
    configuracion: Partial<Comercio['configuracion']>
  ): Promise<boolean> {
    try {
      await updateDoc(doc(db, this.collection, comercioId), {
        configuracion,
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Configuration updated successfully');
      return true;
    } catch (error) {
      handleError(error, 'Update Configuration');
      return false;
    }
  }

  /**
   * Link comercio to association
   */
  async linkToAssociation(comercioId: string, asociacionId: string): Promise<boolean> {
    try {
      const comercioRef = doc(db, this.collection, comercioId);
      const comercioDoc = await getDoc(comercioRef);

      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data();
      const asociacionesVinculadas = comercioData.asociacionesVinculadas || [];

      if (!asociacionesVinculadas.includes(asociacionId)) {
        asociacionesVinculadas.push(asociacionId);

        await updateDoc(comercioRef, {
          asociacionesVinculadas,
          actualizadoEn: serverTimestamp(),
        });

        console.log('✅ Comercio linked to association successfully');
      }

      return true;
    } catch (error) {
      handleError(error, 'Link To Association');
      return false;
    }
  }

  /**
   * Unlink comercio from association
   */
  async unlinkFromAssociation(comercioId: string, asociacionId: string): Promise<boolean> {
    try {
      const comercioRef = doc(db, this.collection, comercioId);
      const comercioDoc = await getDoc(comercioRef);

      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data();
      const asociacionesVinculadas = comercioData.asociacionesVinculadas || [];

      const updatedAsociaciones = asociacionesVinculadas.filter(
        (id: string) => id !== asociacionId
      );

      await updateDoc(comercioRef, {
        asociacionesVinculadas: updatedAsociaciones,
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Comercio unlinked from association successfully');
      return true;
    } catch (error) {
      handleError(error, 'Unlink From Association');
      return false;
    }
  }

  /**
   * Private helper methods for analytics
   */
  private processValidacionesPorDia(
    validaciones: ValidationData[],
    startDate: Date,
    endDate: Date
  ): Array<{ fecha: string; validaciones: number; ingresos: number }> {
    const result: { [key: string]: { validaciones: number; ingresos: number } } = {};

    // Initialize all dates in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      result[dateKey] = { validaciones: 0, ingresos: 0 };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Process validaciones
    validaciones.forEach(validacion => {
      const dateKey = validacion.fechaValidacion.toISOString().split('T')[0];
      if (result[dateKey]) {
        result[dateKey].validaciones++;
        result[dateKey].ingresos += validacion.montoDescuento || 0;
      }
    });

    return Object.entries(result).map(([fecha, data]) => ({
      fecha,
      ...data,
    }));
  }

  private processBeneficiosMasUsados(validaciones: ValidationData[]): Array<{ beneficioId: string; titulo: string; usos: number }> {
    const beneficiosCount: { [key: string]: { titulo: string; usos: number } } = {};

    validaciones.forEach(validacion => {
      const beneficioId = validacion.beneficioId;
      if (beneficiosCount[beneficioId]) {
        beneficiosCount[beneficioId].usos++;
      } else {
        beneficiosCount[beneficioId] = {
          titulo: validacion.beneficioTitulo || 'Beneficio sin título',
          usos: 1,
        };
      }
    });

    return Object.entries(beneficiosCount)
      .map(([beneficioId, data]) => ({
        beneficioId,
        ...data,
      }))
      .sort((a, b) => b.usos - a.usos)
      .slice(0, 10);
  }

  private processClientesPorAsociacion(
    validaciones: Array<ValidationData & { asociacionId?: string; asociacionNombre?: string }>
  ): Array<{ asociacionId: string; nombre: string; clientes: number }> {
    const asociacionesCount: { [key: string]: { nombre: string; clientes: Set<string> } } = {};

    validaciones.forEach(validacion => {
      const asociacionId = validacion.asociacionId;
      if (asociacionId) {
        if (asociacionesCount[asociacionId]) {
          asociacionesCount[asociacionId].clientes.add(validacion.socioId);
        } else {
          asociacionesCount[asociacionId] = {
            nombre: validacion.asociacionNombre || 'Asociación sin nombre',
            clientes: new Set([validacion.socioId]),
          };
        }
      }
    });

    return Object.entries(asociacionesCount).map(([asociacionId, data]) => ({
      asociacionId,
      nombre: data.nombre,
      clientes: data.clientes.size,
    }));
  }

  private processHorariosActividad(validaciones: ValidationData[]): Array<{ hora: number; validaciones: number }> {
    const horariosCount: { [key: number]: number } = {};

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      horariosCount[i] = 0;
    }

    validaciones.forEach(validacion => {
      const hora = validacion.fechaValidacion.getHours();
      horariosCount[hora]++;
    });

    return Object.entries(horariosCount).map(([hora, validaciones]) => ({
      hora: parseInt(hora),
      validaciones,
    }));
  }
}

// Export singleton instance
export const comercioService = new ComercioService();
export default comercioService;
