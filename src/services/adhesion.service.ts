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
  serverTimestamp,
  writeBatch,
  Timestamp,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/constants';
import { handleError } from '@/lib/error-handler';

export interface ComercioDisponible {
  id: string;
  nombreComercio: string;
  nombre: string;
  email: string;
  categoria: string;
  direccion?: string;
  telefono?: string;
  horario?: string;
  logoUrl?: string;
  imagenPrincipalUrl?: string;
  descripcion?: string;
  sitioWeb?: string;
  razonSocial?: string;
  cuit?: string;
  emailContacto?: string;
  redesSociales?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  estado: 'activo' | 'inactivo' | 'pendiente' | 'suspendido' | 'pendiente_aprobacion';
  estadoVinculacion?: 'pendiente' | 'aprobado' | 'rechazado'; // Nuevo campo para estado de vinculación
  asociacionesVinculadas: string[];
  asociacionesPendientes?: string[]; // Nuevo campo para asociaciones pendientes de aprobación
  creadoEn: Timestamp;
  actualizadoEn?: Timestamp;
  verificado: boolean;
  puntuacion: number;
  totalReviews: number;
  configuracion?: {
    notificacionesEmail: boolean;
    notificacionesWhatsApp: boolean;
    autoValidacion: boolean;
    requiereAprobacion: boolean;
  };
  qrCode?: string;
  qrCodeUrl?: string;
  beneficiosActivos: number;
  validacionesRealizadas: number;
  clientesAtendidos: number;
  ingresosMensuales: number;
  rating: number;
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
  visible: boolean;
  // Nuevos campos para control de permisos
  creadoPorAsociacion?: string; // ID de la asociación que creó el comercio
  aprobadoPorComercio?: boolean; // Si el comercio aprobó la vinculación
  fechaAprobacion?: Timestamp; // Fecha de aprobación
}

export interface SolicitudAdhesion {
  id: string;
  asociacionId: string;
  nombreComercio: string;
  nombre: string;
  email: string;
  telefono?: string;
  categoria: string;
  direccion?: string;
  mensaje: string;
  documentos: string[];
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaSolicitud: Timestamp;
  fechaRespuesta?: Timestamp;
  motivoRechazo?: string;
  comercioData?: {
    cuit?: string;
    sitioWeb?: string;
    horario?: string;
    descripcion?: string;
    logoUrl?: string;
  };
  creadoEn: Timestamp;
  actualizadoEn?: Timestamp;
}

// Nueva interfaz para invitaciones de comercios
export interface InvitacionComercio {
  id: string;
  asociacionId: string;
  asociacionNombre: string;
  comercioId: string;
  comercioEmail: string;
  comercioNombre: string;
  mensaje?: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  fechaInvitacion: Timestamp;
  fechaRespuesta?: Timestamp;
  motivoRechazo?: string;
  creadoEn: Timestamp;
  actualizadoEn?: Timestamp;
}

export interface AdhesionStats {
  totalComercios: number;
  comerciosActivos: number;
  comerciosPendientesAprobacion: number; // Nuevo campo
  solicitudesPendientes: number;
  adhesionesEsteMes: number;
  categorias: Record<string, number>;
  valiacionesHoy: number;
  validacionesMes: number;
  clientesUnicos: number;
  beneficiosActivos: number;
  validacionesHoy: number;
}

class AdhesionService {
  private readonly comerciosCollection = COLLECTIONS.COMERCIOS;
  private readonly asociacionesCollection = COLLECTIONS.ASOCIACIONES;
  private readonly solicitudesCollection = 'solicitudes_adhesion';
  private readonly invitacionesCollection = 'invitaciones_comercio'; // Nueva colección

  /**
   * Obtener comercios disponibles para vinculación
   */
  async getComerciossDisponibles(
    asociacionId: string,
    filtros: {
      categoria?: string;
      busqueda?: string;
      soloNoVinculados?: boolean;
    } = {}
  ): Promise<ComercioDisponible[]> {
    try {
      let q = query(
        collection(db, this.comerciosCollection),
        where('estado', '==', 'activo'),
        orderBy('nombreComercio', 'asc')
      );

      if (filtros.categoria) {
        q = query(q, where('categoria', '==', filtros.categoria));
      }

      const snapshot = await getDocs(q);
      let comercios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];

      // Filtrar por búsqueda con validaciones de seguridad
      if (filtros.busqueda) {
        const searchTerm = filtros.busqueda.toLowerCase();
        comercios = comercios.filter(comercio => {
          const nombreComercio = comercio.nombreComercio || '';
          const nombre = comercio.nombre || '';
          const email = comercio.email || '';
          
          return (
            nombreComercio.toLowerCase().includes(searchTerm) ||
            nombre.toLowerCase().includes(searchTerm) ||
            email.toLowerCase().includes(searchTerm)
          );
        });
      }

      // Filtrar solo no vinculados (incluyendo pendientes)
      if (filtros.soloNoVinculados) {
        comercios = comercios.filter(comercio => {
          const yaVinculado = comercio.asociacionesVinculadas.includes(asociacionId);
          const pendienteAprobacion = comercio.asociacionesPendientes?.includes(asociacionId);
          return !yaVinculado && !pendienteAprobacion;
        });
      }

      return comercios;
    } catch (error) {
      handleError(error, 'Get Comercios Disponibles');
      return [];
    }
  }

  /**
   * Obtener comercios vinculados a una asociación (solo aprobados)
   */
  async getComerciossVinculados(asociacionId: string): Promise<ComercioDisponible[]> {
    try {
      const q = query(
        collection(db, this.comerciosCollection),
        where('asociacionesVinculadas', 'array-contains', asociacionId),
        orderBy('nombreComercio', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];
    } catch (error) {
      handleError(error, 'Get Comercios Vinculados');
      return [];
    }
  }

  /**
   * Obtener comercios pendientes de aprobación para una asociación
   */
  async getComerciosssPendientesAprobacion(asociacionId: string): Promise<ComercioDisponible[]> {
    try {
      const q = query(
        collection(db, this.comerciosCollection),
        where('asociacionesPendientes', 'array-contains', asociacionId),
        orderBy('creadoEn', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];
    } catch (error) {
      handleError(error, 'Get Comercios Pendientes Aprobacion');
      return [];
    }
  }

  /**
   * Crear comercio con estado pendiente de aprobación
   */
  async crearComercioConAprobacion(
    comercioData: Omit<ComercioDisponible, 'id' | 'creadoEn' | 'actualizadoEn'>,
    asociacionId: string,
    mensaje?: string
  ): Promise<string | null> {
    try {
      // Verificar si ya existe un comercio con este email
      const existingQuery = query(
        collection(db, this.comerciosCollection),
        where('email', '==', comercioData.email)
      );
      const existingSnapshot = await getDocs(existingQuery);
      
      if (!existingSnapshot.empty) {
        throw new Error('Ya existe un comercio con este email');
      }

      const batch = writeBatch(db);

      // Crear comercio con estado pendiente de aprobación
      const comercioRef = doc(collection(db, this.comerciosCollection));
      const nuevoComercio: Omit<ComercioDisponible, 'id'> = {
        ...comercioData,
        estado: 'pendiente_aprobacion',
        estadoVinculacion: 'pendiente',
        asociacionesVinculadas: [], // Vacío hasta que se apruebe
        asociacionesPendientes: [asociacionId], // Asociación pendiente
        creadoPorAsociacion: asociacionId,
        aprobadoPorComercio: false,
        creadoEn: serverTimestamp() as Timestamp,
        actualizadoEn: serverTimestamp() as Timestamp,
      };

      batch.set(comercioRef, nuevoComercio);

      // Crear invitación
      const invitacionRef = doc(collection(db, this.invitacionesCollection));
      const invitacion: Omit<InvitacionComercio, 'id'> = {
        asociacionId,
        asociacionNombre: await this.getAsociacionNombre(asociacionId),
        comercioId: comercioRef.id,
        comercioEmail: comercioData.email,
        comercioNombre: comercioData.nombreComercio,
        mensaje: mensaje || `Te invitamos a formar parte de nuestra asociación`,
        estado: 'pendiente',
        fechaInvitacion: serverTimestamp() as Timestamp,
        creadoEn: serverTimestamp() as Timestamp,
        actualizadoEn: serverTimestamp() as Timestamp,
      };

      batch.set(invitacionRef, invitacion);

      await batch.commit();

      // TODO: Enviar notificación por email al comercio
      console.log('✅ Comercio creado y invitación enviada exitosamente');
      return comercioRef.id;
    } catch (error) {
      handleError(error, 'Crear Comercio Con Aprobacion');
      return null;
    }
  }

  /**
   * Enviar invitación a comercio existente
   */
  async enviarInvitacionComercio(
    comercioId: string,
    asociacionId: string,
    mensaje?: string
  ): Promise<boolean> {
    try {
      // Verificar que el comercio existe y está activo
      const comercioDoc = await getDoc(doc(db, this.comerciosCollection, comercioId));
      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data() as ComercioDisponible;
      
      if (comercioData.estado !== 'activo') {
        throw new Error('El comercio no está activo');
      }

      // Verificar que no esté ya vinculado o pendiente
      if (comercioData.asociacionesVinculadas.includes(asociacionId)) {
        throw new Error('El comercio ya está vinculado a esta asociación');
      }

      if (comercioData.asociacionesPendientes?.includes(asociacionId)) {
        throw new Error('Ya existe una invitación pendiente para este comercio');
      }

      const batch = writeBatch(db);

      // Actualizar comercio agregando asociación pendiente
      const comercioRef = doc(db, this.comerciosCollection, comercioId);
      const asociacionesPendientes = comercioData.asociacionesPendientes || [];
      asociacionesPendientes.push(asociacionId);

      batch.update(comercioRef, {
        asociacionesPendientes,
        actualizadoEn: serverTimestamp(),
      });

      // Crear invitación
      const invitacionRef = doc(collection(db, this.invitacionesCollection));
      const invitacion: Omit<InvitacionComercio, 'id'> = {
        asociacionId,
        asociacionNombre: await this.getAsociacionNombre(asociacionId),
        comercioId,
        comercioEmail: comercioData.email,
        comercioNombre: comercioData.nombreComercio,
        mensaje: mensaje || `Te invitamos a formar parte de nuestra asociación`,
        estado: 'pendiente',
        fechaInvitacion: serverTimestamp() as Timestamp,
        creadoEn: serverTimestamp() as Timestamp,
        actualizadoEn: serverTimestamp() as Timestamp,
      };

      batch.set(invitacionRef, invitacion);

      await batch.commit();

      // TODO: Enviar notificación por email al comercio
      console.log('✅ Invitación enviada exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Enviar Invitacion Comercio');
      return false;
    }
  }

  /**
   * Aprobar vinculación por parte del comercio
   */
  async aprobarVinculacionComercio(
    invitacionId: string,
    comercioId: string
  ): Promise<boolean> {
    try {
      const batch = writeBatch(db);

      // Obtener invitación
      const invitacionDoc = await getDoc(doc(db, this.invitacionesCollection, invitacionId));
      if (!invitacionDoc.exists()) {
        throw new Error('Invitación no encontrada');
      }

      const invitacionData = invitacionDoc.data() as InvitacionComercio;
      
      if (invitacionData.estado !== 'pendiente') {
        throw new Error('La invitación ya fue procesada');
      }

      // Obtener comercio
      const comercioDoc = await getDoc(doc(db, this.comerciosCollection, comercioId));
      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data() as ComercioDisponible;

      // Actualizar comercio
      const comercioRef = doc(db, this.comerciosCollection, comercioId);
      const asociacionesVinculadas = comercioData.asociacionesVinculadas || [];
      const asociacionesPendientes = comercioData.asociacionesPendientes || [];

      // Mover de pendientes a vinculadas
      asociacionesVinculadas.push(invitacionData.asociacionId);
      const nuevasAsociacionesPendientes = asociacionesPendientes.filter(
        id => id !== invitacionData.asociacionId
      );

      batch.update(comercioRef, {
        estado: 'activo', // Activar comercio si estaba pendiente
        estadoVinculacion: 'aprobado',
        asociacionesVinculadas,
        asociacionesPendientes: nuevasAsociacionesPendientes,
        aprobadoPorComercio: true,
        fechaAprobacion: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      });

      // Actualizar invitación
      const invitacionRef = doc(db, this.invitacionesCollection, invitacionId);
      batch.update(invitacionRef, {
        estado: 'aprobada',
        fechaRespuesta: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      });

      // Actualizar estadísticas de la asociación
      const asociacionRef = doc(db, this.asociacionesCollection, invitacionData.asociacionId);
      const asociacionDoc = await getDoc(asociacionRef);

      if (asociacionDoc.exists()) {
        const asociacionData = asociacionDoc.data();
        const comerciosVinculados = (asociacionData.comerciosVinculados || 0) + 1;

        batch.update(asociacionRef, {
          comerciosVinculados,
          actualizadoEn: serverTimestamp(),
        });
      }

      await batch.commit();

      console.log('✅ Vinculación aprobada exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Aprobar Vinculacion Comercio');
      return false;
    }
  }

  /**
   * Rechazar vinculación por parte del comercio
   */
  async rechazarVinculacionComercio(
    invitacionId: string,
    comercioId: string,
    motivo?: string
  ): Promise<boolean> {
    try {
      const batch = writeBatch(db);

      // Obtener invitación
      const invitacionDoc = await getDoc(doc(db, this.invitacionesCollection, invitacionId));
      if (!invitacionDoc.exists()) {
        throw new Error('Invitación no encontrada');
      }

      const invitacionData = invitacionDoc.data() as InvitacionComercio;

      // Obtener comercio
      const comercioDoc = await getDoc(doc(db, this.comerciosCollection, comercioId));
      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data() as ComercioDisponible;

      // Actualizar comercio removiendo asociación pendiente
      const comercioRef = doc(db, this.comerciosCollection, comercioId);
      const asociacionesPendientes = comercioData.asociacionesPendientes || [];
      const nuevasAsociacionesPendientes = asociacionesPendientes.filter(
        id => id !== invitacionData.asociacionId
      );

      const updateData: Partial<ComercioDisponible> = {
        asociacionesPendientes: nuevasAsociacionesPendientes,
        actualizadoEn: serverTimestamp() as Timestamp,
      };

      // Si el comercio fue creado por esta asociación y la rechaza, desactivarlo
      if (comercioData.creadoPorAsociacion === invitacionData.asociacionId) {
        updateData.estado = 'inactivo';
        updateData.estadoVinculacion = 'rechazado';
      }

      batch.update(comercioRef, updateData);

      // Actualizar invitación
      const invitacionRef = doc(db, this.invitacionesCollection, invitacionId);
      batch.update(invitacionRef, {
        estado: 'rechazada',
        motivoRechazo: motivo || 'Rechazado por el comercio',
        fechaRespuesta: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      });

      await batch.commit();

      console.log('✅ Vinculación rechazada exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Rechazar Vinculacion Comercio');
      return false;
    }
  }

  /**
   * Verificar permisos de asociación sobre comercio
   */
  async verificarPermisosAsociacion(
    comercioId: string,
    asociacionId: string
  ): Promise<{
    puedeVer: boolean;
    puedeEditar: boolean;
    puedeEliminar: boolean;
    puedeDesvincular: boolean;
    motivo?: string;
  }> {
    try {
      const comercioDoc = await getDoc(doc(db, this.comerciosCollection, comercioId));
      if (!comercioDoc.exists()) {
        return {
          puedeVer: false,
          puedeEditar: false,
          puedeEliminar: false,
          puedeDesvincular: false,
          motivo: 'Comercio no encontrado'
        };
      }

      const comercioData = comercioDoc.data() as ComercioDisponible;

      // Verificar si la asociación está vinculada
      const estaVinculada = comercioData.asociacionesVinculadas.includes(asociacionId);
      
      if (!estaVinculada) {
        return {
          puedeVer: false,
          puedeEditar: false,
          puedeEliminar: false,
          puedeDesvincular: false,
          motivo: 'Asociación no vinculada al comercio'
        };
      }

      // Verificar si el comercio fue aprobado
      const fueAprobado = comercioData.aprobadoPorComercio === true;

      return {
        puedeVer: true, // Siempre puede ver si está vinculada
        puedeEditar: !fueAprobado, // Solo puede editar si no fue aprobado aún
        puedeEliminar: !fueAprobado, // Solo puede eliminar si no fue aprobado aún
        puedeDesvincular: true, // Siempre puede desvincular
        motivo: fueAprobado ? 'Comercio aprobado - control transferido al comercio' : undefined
      };
    } catch (error) {
      handleError(error, 'Verificar Permisos Asociacion');
      return {
        puedeVer: false,
        puedeEditar: false,
        puedeEliminar: false,
        puedeDesvincular: false,
        motivo: 'Error al verificar permisos'
      };
    }
  }

  /**
   * Desvincular comercio de asociación (solo permitido)
   */
  async desvincularComercio(comercioId: string, asociacionId: string): Promise<boolean> {
    try {
      // Verificar permisos
      const permisos = await this.verificarPermisosAsociacion(comercioId, asociacionId);
      if (!permisos.puedeDesvincular) {
        throw new Error(permisos.motivo || 'No tienes permisos para desvincular este comercio');
      }

      const batch = writeBatch(db);

      // Actualizar comercio
      const comercioRef = doc(db, this.comerciosCollection, comercioId);
      const comercioDoc = await getDoc(comercioRef);

      if (!comercioDoc.exists()) {
        throw new Error('Comercio no encontrado');
      }

      const comercioData = comercioDoc.data();
      const asociacionesVinculadas = comercioData.asociacionesVinculadas || [];

      const updatedAsociaciones = asociacionesVinculadas.filter(
        (id: string) => id !== asociacionId
      );

      batch.update(comercioRef, {
        asociacionesVinculadas: updatedAsociaciones,
        actualizadoEn: serverTimestamp(),
      });

      // Actualizar estadísticas de la asociación
      const asociacionRef = doc(db, this.asociacionesCollection, asociacionId);
      const asociacionDoc = await getDoc(asociacionRef);

      if (asociacionDoc.exists()) {
        const asociacionData = asociacionDoc.data();
        const comerciosVinculados = Math.max((asociacionData.comerciosVinculados || 1) - 1, 0);

        batch.update(asociacionRef, {
          comerciosVinculados,
          actualizadoEn: serverTimestamp(),
        });
      }

      await batch.commit();

      console.log('✅ Comercio desvinculado exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Desvincular Comercio');
      return false;
    }
  }

  /**
   * Obtener estadísticas de adhesiones actualizadas
   */
  async getAdhesionStats(asociacionId: string): Promise<AdhesionStats> {
    try {
      const [comerciosVinculados, comerciosPendientes, solicitudesPendientes] = await Promise.all([
        this.getComerciossVinculados(asociacionId),
        this.getComerciosssPendientesAprobacion(asociacionId),
        this.getSolicitudesPendientes(asociacionId)
      ]);
      
      const stats: AdhesionStats = {
        totalComercios: comerciosVinculados.length,
        comerciosActivos: comerciosVinculados.filter(c => c.estado === 'activo').length,
        comerciosPendientesAprobacion: comerciosPendientes.length,
        solicitudesPendientes: solicitudesPendientes.length,
        adhesionesEsteMes: 0,
        categorias: {},
        valiacionesHoy: 0,
        validacionesMes: 0,
        clientesUnicos: 0,
        beneficiosActivos: 0,
        validacionesHoy: 0
      };

      // Contar por categorías
      comerciosVinculados.forEach(comercio => {
        stats.categorias[comercio.categoria] = (stats.categorias[comercio.categoria] || 0) + 1;
      });

      // Calcular adhesiones este mes
      const inicioMes = new Date();
      inicioMes.setDate(1);
      inicioMes.setHours(0, 0, 0, 0);

      stats.adhesionesEsteMes = comerciosVinculados.filter(comercio => {
        const fechaCreacion = comercio.creadoEn.toDate();
        return fechaCreacion >= inicioMes;
      }).length;

      return stats;
    } catch (error) {
      handleError(error, 'Get Adhesion Stats');
      return {
        totalComercios: 0,
        comerciosActivos: 0,
        comerciosPendientesAprobacion: 0,
        solicitudesPendientes: 0,
        adhesionesEsteMes: 0,
        categorias: {},
        valiacionesHoy: 0,
        validacionesMes: 0,
        clientesUnicos: 0,
        beneficiosActivos: 0,
        validacionesHoy: 0
      };
    }
  }

  // ... resto de métodos existentes sin cambios ...

  /**
   * Obtener solicitudes de adhesión pendientes
   */
  async getSolicitudesPendientes(asociacionId: string): Promise<SolicitudAdhesion[]> {
    try {
      const q = query(
        collection(db, this.solicitudesCollection),
        where('asociacionId', '==', asociacionId),
        where('estado', '==', 'pendiente'),
        orderBy('fechaSolicitud', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SolicitudAdhesion[];
    } catch (error) {
      handleError(error, 'Get Solicitudes Pendientes');
      return [];
    }
  }

  /**
   * Crear nueva solicitud de adhesión
   */
  async crearSolicitudAdhesion(solicitudData: Omit<SolicitudAdhesion, 'id' | 'creadoEn' | 'actualizadoEn'>): Promise<string | null> {
    try {
      const docRef = await addDoc(collection(db, this.solicitudesCollection), {
        ...solicitudData,
        creadoEn: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Solicitud de adhesión creada exitosamente');
      return docRef.id;
    } catch (error) {
      handleError(error, 'Crear Solicitud Adhesion');
      return null;
    }
  }

  /**
   * Aprobar solicitud de adhesión
   */
  async aprobarSolicitud(solicitudId: string): Promise<boolean> {
    try {
      const solicitudRef = doc(db, this.solicitudesCollection, solicitudId);
      const solicitudDoc = await getDoc(solicitudRef);

      if (!solicitudDoc.exists()) {
        throw new Error('Solicitud no encontrada');
      }

      const solicitudData = solicitudDoc.data() as SolicitudAdhesion;

      // Crear el comercio en la colección de comercios
      const comercioData: Omit<ComercioDisponible, 'id'> = {
        nombreComercio: solicitudData.nombreComercio,
        nombre: solicitudData.nombre,
        email: solicitudData.email,
        telefono: solicitudData.telefono,
        categoria: solicitudData.categoria,
        direccion: solicitudData.direccion,
        descripcion: solicitudData.comercioData?.descripcion || '',
        sitioWeb: solicitudData.comercioData?.sitioWeb || '',
        horario: solicitudData.comercioData?.horario || '',
        logoUrl: solicitudData.comercioData?.logoUrl || '',
        cuit: solicitudData.comercioData?.cuit || '',
        estado: 'activo',
        asociacionesVinculadas: [solicitudData.asociacionId],
        creadoEn: serverTimestamp() as Timestamp,
        actualizadoEn: serverTimestamp() as Timestamp,
        verificado: false,
        puntuacion: 0,
        totalReviews: 0,
        beneficiosActivos: 0,
        validacionesRealizadas: 0,
        clientesAtendidos: 0,
        ingresosMensuales: 0,
        rating: 0,
        visible: true,
        configuracion: {
          notificacionesEmail: true,
          notificacionesWhatsApp: false,
          autoValidacion: false,
          requiereAprobacion: true,
        }
      };

      const batch = writeBatch(db);

      // Crear comercio
      const comercioRef = doc(collection(db, this.comerciosCollection));
      batch.set(comercioRef, comercioData);

      // Actualizar solicitud
      batch.update(solicitudRef, {
        estado: 'aprobada',
        fechaRespuesta: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      });

      // Actualizar estadísticas de la asociación
      const asociacionRef = doc(db, this.asociacionesCollection, solicitudData.asociacionId);
      const asociacionDoc = await getDoc(asociacionRef);

      if (asociacionDoc.exists()) {
        const asociacionData = asociacionDoc.data();
        const comerciosVinculados = (asociacionData.comerciosVinculados || 0) + 1;

        batch.update(asociacionRef, {
          comerciosVinculados,
          actualizadoEn: serverTimestamp(),
        });
      }

      await batch.commit();

      console.log('✅ Solicitud aprobada y comercio creado exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Aprobar Solicitud');
      return false;
    }
  }

  /**
   * Rechazar solicitud de adhesión
   */
  async rechazarSolicitud(solicitudId: string, motivoRechazo: string): Promise<boolean> {
    try {
      const solicitudRef = doc(db, this.solicitudesCollection, solicitudId);
      
      await updateDoc(solicitudRef, {
        estado: 'rechazada',
        fechaRespuesta: serverTimestamp(),
        motivoRechazo,
        actualizadoEn: serverTimestamp(),
      });

      console.log('✅ Solicitud rechazada exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Rechazar Solicitud');
      return false;
    }
  }

  /**
   * Eliminar solicitud de adhesión
   */
  async eliminarSolicitud(solicitudId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, this.solicitudesCollection, solicitudId));
      console.log('✅ Solicitud eliminada exitosamente');
      return true;
    } catch (error) {
      handleError(error, 'Eliminar Solicitud');
      return false;
    }
  }

  /**
   * Buscar comercios por término
   */
  async buscarComercios(
    termino: string,
    asociacionId: string,
    limite: number = 20
  ): Promise<ComercioDisponible[]> {
    try {
      const q = query(
        collection(db, this.comerciosCollection),
        where('estado', '==', 'activo'),
        limit(limite)
      );

      const snapshot = await getDocs(q);
      let comercios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];

      // Filtrar por término de búsqueda con validaciones de seguridad
      const searchTerm = termino.toLowerCase();
      comercios = comercios.filter(comercio => {
        const nombreComercio = comercio.nombreComercio || '';
        const nombre = comercio.nombre || '';
        const email = comercio.email || '';
        const categoria = comercio.categoria || '';
        
        return (
          nombreComercio.toLowerCase().includes(searchTerm) ||
          nombre.toLowerCase().includes(searchTerm) ||
          email.toLowerCase().includes(searchTerm) ||
          categoria.toLowerCase().includes(searchTerm)
        );
      });

      return comercios;
    } catch (error) {
      handleError(error, 'Buscar Comercios');
      return [];
    }
  }

  /**
   * Validar si un comercio puede ser vinculado
   */
  async validarVinculacion(comercioId: string, asociacionId: string): Promise<{
    valido: boolean;
    motivo?: string;
  }> {
    try {
      const comercioDoc = await getDoc(doc(db, this.comerciosCollection, comercioId));
      
      if (!comercioDoc.exists()) {
        return { valido: false, motivo: 'Comercio no encontrado' };
      }

      const comercioData = comercioDoc.data();

      if (comercioData.estado !== 'activo') {
        return { valido: false, motivo: 'El comercio no está activo' };
      }

      if (comercioData.asociacionesVinculadas?.includes(asociacionId)) {
        return { valido: false, motivo: 'El comercio ya está vinculado a esta asociación' };
      }

      if (comercioData.asociacionesPendientes?.includes(asociacionId)) {
        return { valido: false, motivo: 'Ya existe una invitación pendiente para este comercio' };
      }

      return { valido: true };
    } catch (error) {
      handleError(error, 'Validar Vinculacion');
      return { valido: false, motivo: 'Error al validar la vinculación' };
    }
  }

  /**
   * Listener en tiempo real para solicitudes pendientes
   */
  onSolicitudesPendientesChange(
    asociacionId: string,
    callback: (solicitudes: SolicitudAdhesion[]) => void
  ): () => void {
    const q = query(
      collection(db, this.solicitudesCollection),
      where('asociacionId', '==', asociacionId),
      where('estado', '==', 'pendiente'),
      orderBy('fechaSolicitud', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const solicitudes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SolicitudAdhesion[];
      
      callback(solicitudes);
    }, (error) => {
      handleError(error, 'Solicitudes Pendientes Listener');
      callback([]);
    });
  }

  /**
   * Listener en tiempo real para comercios vinculados
   */
  onComerciosVinculadosChange(
    asociacionId: string,
    callback: (comercios: ComercioDisponible[]) => void
  ): () => void {
    const q = query(
      collection(db, this.comerciosCollection),
      where('asociacionesVinculadas', 'array-contains', asociacionId),
      orderBy('nombreComercio', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const comercios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];
      
      callback(comercios);
    }, (error) => {
      handleError(error, 'Comercios Vinculados Listener');
      callback([]);
    });
  }

  /**
   * Listener en tiempo real para comercios pendientes de aprobación
   */
  onComerciosPendientesChange(
    asociacionId: string,
    callback: (comercios: ComercioDisponible[]) => void
  ): () => void {
    const q = query(
      collection(db, this.comerciosCollection),
      where('asociacionesPendientes', 'array-contains', asociacionId),
      orderBy('creadoEn', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const comercios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ComercioDisponible[];
      
      callback(comercios);
    }, (error) => {
      handleError(error, 'Comercios Pendientes Listener');
      callback([]);
    });
  }

  /**
   * Método auxiliar para obtener nombre de asociación
   */
  private async getAsociacionNombre(asociacionId: string): Promise<string> {
    try {
      const asociacionDoc = await getDoc(doc(db, this.asociacionesCollection, asociacionId));
      if (asociacionDoc.exists()) {
        const data = asociacionDoc.data();
        return data.nombre || data.nombreAsociacion || 'Asociación';
      }
      return 'Asociación';
    } catch (error) {
      console.warn('Error obteniendo nombre de asociación:', error);
      return 'Asociación';
    }
  }
}

// Export singleton instance
export const adhesionService = new AdhesionService();
export default adhesionService;
