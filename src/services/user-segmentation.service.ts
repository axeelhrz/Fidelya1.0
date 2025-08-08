import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserSegment {
  id?: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  userCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  tags: string[];
}

export interface SegmentCriteria {
  userType?: 'socio' | 'comercio' | 'asociacion';
  asociacionId?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  demographics?: {
    ageRange?: { min: number; max: number };
    gender?: string;
  };
  activity?: {
    lastLoginDays?: number;
    validationsCount?: { min: number; max: number };
    benefitsUsed?: { min: number; max: number };
  };
  membership?: {
    memberSince?: { months: number };
    membershipType?: string;
    isActive?: boolean;
  };
  engagement?: {
    notificationOpenRate?: { min: number; max: number };
    appUsageFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely';
  };
  customFields?: Record<string, any>;
}

export interface SegmentUser {
  userId: string;
  userType: 'socio' | 'comercio' | 'asociacion';
  name: string;
  email: string;
  phone?: string;
  lastActivity: Timestamp;
  metadata: Record<string, any>;
}

class UserSegmentationService {
  private readonly COLLECTION = 'user_segments';

  // Crear nuevo segmento
  async createSegment(segmentData: Omit<UserSegment, 'id' | 'createdAt' | 'updatedAt' | 'userCount'>): Promise<string> {
    try {
      const userCount = await this.calculateSegmentSize(segmentData.criteria);
      
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...segmentData,
        userCount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating segment:', error);
      throw error;
    }
  }

  // Obtener todos los segmentos
  async getSegments(asociacionId: string): Promise<UserSegment[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('criteria.asociacionId', '==', asociacionId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserSegment));
    } catch (error) {
      console.error('Error getting segments:', error);
      throw error;
    }
  }

  // Actualizar segmento
  async updateSegment(segmentId: string, updates: Partial<UserSegment>): Promise<void> {
    try {
      const segmentRef = doc(db, this.COLLECTION, segmentId);
      
      if (updates.criteria) {
        updates.userCount = await this.calculateSegmentSize(updates.criteria);
      }

      await updateDoc(segmentRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating segment:', error);
      throw error;
    }
  }

  // Eliminar segmento
  async deleteSegment(segmentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, segmentId));
    } catch (error) {
      console.error('Error deleting segment:', error);
      throw error;
    }
  }

  // Calcular tamaño del segmento
  async calculateSegmentSize(criteria: SegmentCriteria): Promise<number> {
    try {
      const users = await this.getUsersBySegment(criteria);
      return users.length;
    } catch (error) {
      console.error('Error calculating segment size:', error);
      return 0;
    }
  }

  // Obtener usuarios por segmento
  async getUsersBySegment(criteria: SegmentCriteria, limitCount?: number): Promise<SegmentUser[]> {
    try {
      let users: SegmentUser[] = [];

      // Obtener usuarios según el tipo
      if (criteria.userType === 'socio') {
        users = await this.getSociosBySegment(criteria, limitCount);
      } else if (criteria.userType === 'comercio') {
        users = await this.getComerciosBySegment(criteria, limitCount);
      } else if (criteria.userType === 'asociacion') {
        users = await this.getAsociacionesBySegment(criteria, limitCount);
      } else {
        // Si no se especifica tipo, obtener todos
        const socios = await this.getSociosBySegment(criteria, limitCount);
        const comercios = await this.getComerciosBySegment(criteria, limitCount);
        const asociaciones = await this.getAsociacionesBySegment(criteria, limitCount);
        users = [...socios, ...comercios, ...asociaciones];
      }

      return users;
    } catch (error) {
      console.error('Error getting users by segment:', error);
      throw error;
    }
  }

  // Obtener socios por segmento
  private async getSociosBySegment(criteria: SegmentCriteria, limitCount?: number): Promise<SegmentUser[]> {
    try {
      let q = query(collection(db, 'socios'));

      // Aplicar filtros básicos
      if (criteria.asociacionId) {
        q = query(q, where('asociacionId', '==', criteria.asociacionId));
      }

      if (criteria.membership?.isActive !== undefined) {
        q = query(q, where('isActive', '==', criteria.membership.isActive));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      const socios = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          userId: doc.id,
          userType: 'socio' as const,
          name: `${data.nombre} ${data.apellido}`,
          email: data.email,
          phone: data.telefono,
          lastActivity: data.lastActivity || data.createdAt,
          metadata: data
        };
      });

      // Aplicar filtros avanzados en memoria
      return this.applyAdvancedFilters(socios, criteria);
    } catch (error) {
      console.error('Error getting socios by segment:', error);
      return [];
    }
  }

  // Obtener comercios por segmento
  private async getComerciosBySegment(criteria: SegmentCriteria, limitCount?: number): Promise<SegmentUser[]> {
    try {
      let q = query(collection(db, 'comercios'));

      if (criteria.asociacionId) {
        q = query(q, where('asociacionId', '==', criteria.asociacionId));
      }

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      const comercios = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          userId: doc.id,
          userType: 'comercio' as const,
          name: data.nombre,
          email: data.email,
          phone: data.telefono,
          lastActivity: data.lastActivity || data.createdAt,
          metadata: data
        };
      });

      return this.applyAdvancedFilters(comercios, criteria);
    } catch (error) {
      console.error('Error getting comercios by segment:', error);
      return [];
    }
  }

  // Obtener asociaciones por segmento
  private async getAsociacionesBySegment(criteria: SegmentCriteria, limitCount?: number): Promise<SegmentUser[]> {
    try {
      let q = query(collection(db, 'asociaciones'));

      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const snapshot = await getDocs(q);
      const asociaciones = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          userId: doc.id,
          userType: 'asociacion' as const,
          name: data.nombre,
          email: data.email,
          phone: data.telefono,
          lastActivity: data.lastActivity || data.createdAt,
          metadata: data
        };
      });

      return this.applyAdvancedFilters(asociaciones, criteria);
    } catch (error) {
      console.error('Error getting asociaciones by segment:', error);
      return [];
    }
  }

  // Aplicar filtros avanzados
  private applyAdvancedFilters(users: SegmentUser[], criteria: SegmentCriteria): SegmentUser[] {
    return users.filter(user => {
      // Filtro por ubicación
      if (criteria.location) {
        const userLocation = user.metadata.ubicacion || {};
        if (criteria.location.city && userLocation.ciudad !== criteria.location.city) return false;
        if (criteria.location.state && userLocation.estado !== criteria.location.state) return false;
        if (criteria.location.country && userLocation.pais !== criteria.location.country) return false;
      }

      // Filtro por actividad reciente
      if (criteria.activity?.lastLoginDays) {
        const daysSinceLastActivity = this.getDaysSince(user.lastActivity);
        if (daysSinceLastActivity > criteria.activity.lastLoginDays) return false;
      }

      // Filtro por rango de validaciones
      if (criteria.activity?.validationsCount) {
        const validationsCount = user.metadata.validacionesCount || 0;
        if (validationsCount < criteria.activity.validationsCount.min || 
            validationsCount > criteria.activity.validationsCount.max) return false;
      }

      // Filtro por beneficios usados
      if (criteria.activity?.benefitsUsed) {
        const benefitsUsed = user.metadata.beneficiosUsados || 0;
        if (benefitsUsed < criteria.activity.benefitsUsed.min || 
            benefitsUsed > criteria.activity.benefitsUsed.max) return false;
      }

      // Filtro por tiempo de membresía
      if (criteria.membership?.memberSince) {
        const monthsSinceMember = this.getMonthsSince(user.metadata.createdAt);
        if (monthsSinceMember < criteria.membership.memberSince.months) return false;
      }

      // Filtros personalizados
      if (criteria.customFields) {
        for (const [field, value] of Object.entries(criteria.customFields)) {
          if (user.metadata[field] !== value) return false;
        }
      }

      return true;
    });
  }

  // Obtener segmentos predefinidos
  getPreDefinedSegments(): Partial<UserSegment>[] {
    return [
      {
        name: 'Usuarios Activos',
        description: 'Usuarios que han iniciado sesión en los últimos 7 días',
        criteria: {
          activity: { lastLoginDays: 7 }
        },
        tags: ['activos', 'engagement']
      },
      {
        name: 'Nuevos Miembros',
        description: 'Usuarios registrados en el último mes',
        criteria: {
          membership: { memberSince: { months: 1 } }
        },
        tags: ['nuevos', 'onboarding']
      },
      {
        name: 'Usuarios Inactivos',
        description: 'Usuarios sin actividad en los últimos 30 días',
        criteria: {
          activity: { lastLoginDays: 30 }
        },
        tags: ['inactivos', 'reactivacion']
      },
      {
        name: 'Super Usuarios',
        description: 'Usuarios con alta actividad de validaciones',
        criteria: {
          activity: { 
            validationsCount: { min: 10, max: 1000 },
            lastLoginDays: 7
          }
        },
        tags: ['super-usuarios', 'alta-actividad']
      },
      {
        name: 'Comercios Nuevos',
        description: 'Comercios registrados en los últimos 2 meses',
        criteria: {
          userType: 'comercio',
          membership: { memberSince: { months: 2 } }
        },
        tags: ['comercios', 'nuevos']
      }
    ];
  }

  // Utilidades
  private getDaysSince(timestamp: Timestamp): number {
    const now = new Date();
    const date = timestamp.toDate();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private getMonthsSince(timestamp: Timestamp): number {
    const now = new Date();
    const date = timestamp.toDate();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
  }

  // Exportar usuarios de un segmento
  async exportSegmentUsers(segmentId: string, format: 'csv' | 'json' = 'csv'): Promise<string> {
    try {
      const segmentDoc = await getDocs(query(
        collection(db, this.COLLECTION),
        where('__name__', '==', segmentId)
      ));

      if (segmentDoc.empty) {
        throw new Error('Segment not found');
      }

      const segment = segmentDoc.docs[0].data() as UserSegment;
      const users = await this.getUsersBySegment(segment.criteria);

      if (format === 'json') {
        return JSON.stringify(users, null, 2);
      } else {
        // Formato CSV
        const headers = ['ID', 'Tipo', 'Nombre', 'Email', 'Teléfono', 'Última Actividad'];
        const csvRows = [
          headers.join(','),
          ...users.map(user => [
            user.userId,
            user.userType,
            `"${user.name}"`,
            user.email,
            user.phone || '',
            user.lastActivity.toDate().toISOString()
          ].join(','))
        ];
        return csvRows.join('\n');
      }
    } catch (error) {
      console.error('Error exporting segment users:', error);
      throw error;
    }
  }
}

export const userSegmentationService = new UserSegmentationService();