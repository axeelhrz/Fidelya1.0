import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { VideoCall, CreateVideoCallData, UpdateVideoCallData, VideoCallFilters, VideoPlatform } from '../../types/videocall';

interface VideoCallStats {
  total: number;
  programadas: number;
  confirmadas: number;
  enCurso: number;
  finalizadas: number;
  canceladas: number;
}

export class VideoCallService {
  private static getCollectionPath(centerId: string) {
    return `centers/${centerId}/videoCalls`;
  }

  // Generar enlace de videollamada según la plataforma
  static async generateVideoLink(platform: VideoPlatform, customLink?: string): Promise<string> {
    if (customLink) return customLink;

    const meetingId = Math.random().toString(36).substring(2, 15);
    
    switch (platform) {
      case 'zoom':
        // En producción, integrar con Zoom API
        return `https://zoom.us/j/${meetingId}`;
      case 'meet':
        // En producción, integrar con Google Meet API
        return `https://meet.google.com/${meetingId}`;
      case 'jitsi':
        return `https://meet.jit.si/CentroPsicologico-${meetingId}`;
      case 'daily':
        // En producción, integrar con Daily API
        return `https://daily.co/CentroPsicologico-${meetingId}`;
      default:
        return `https://meet.jit.si/CentroPsicologico-${meetingId}`;
    }
  }

  // Crear nueva videollamada
  static async createVideoCall(
    centerId: string, 
    professionalId: string,
    data: CreateVideoCallData
  ): Promise<string> {
    try {
      const videoLink = await this.generateVideoLink(data.platform, data.customLink);
      
      const videoCallData = {
        ...data,
        professionalId,
        centerId,
        status: 'programada' as const,
        videoLink,
        reminderSent: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: professionalId,
        endDateTime: Timestamp.fromDate(
          new Date(data.startDateTime.getTime() + data.duration * 60000)
        ),
        startDateTime: Timestamp.fromDate(data.startDateTime)
      };

      const docRef = await addDoc(
        collection(db, this.getCollectionPath(centerId)), 
        videoCallData
      );

      return docRef.id;
    } catch (error) {
      console.error('Error creating video call:', error);
      throw new Error('Error al crear la videollamada');
    }
  }

  // Obtener videollamadas con filtros
  static async getVideoCalls(
    centerId: string, 
    professionalId: string,
    filters?: VideoCallFilters
  ): Promise<VideoCall[]> {
    try {
      let q = query(
        collection(db, this.getCollectionPath(centerId)),
        where('professionalId', '==', professionalId),
        orderBy('startDateTime', 'desc')
      );

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters?.dateFrom) {
        q = query(q, where('startDateTime', '>=', Timestamp.fromDate(filters.dateFrom)));
      }

      if (filters?.dateTo) {
        q = query(q, where('startDateTime', '<=', Timestamp.fromDate(filters.dateTo)));
      }

      const snapshot = await getDocs(q);
      const videoCalls: VideoCall[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        videoCalls.push({
          id: doc.id,
          ...data,
          startDateTime: data.startDateTime.toDate(),
          endDateTime: data.endDateTime.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as VideoCall);
      });

      // Filtros adicionales en memoria
      let filteredCalls = videoCalls;

      if (filters?.patientName) {
        filteredCalls = filteredCalls.filter(call => 
          call.patientName.toLowerCase().includes(filters.patientName!.toLowerCase())
        );
      }

      if (filters?.motive) {
        filteredCalls = filteredCalls.filter(call => 
          call.motive.toLowerCase().includes(filters.motive!.toLowerCase())
        );
      }

      return filteredCalls;
    } catch (error) {
      console.error('Error fetching video calls:', error);
      throw new Error('Error al obtener las videollamadas');
    }
  }

  // Actualizar videollamada
  static async updateVideoCall(
    centerId: string, 
    videoCallId: string, 
    data: UpdateVideoCallData
  ): Promise<void> {
    try {
      const updateData: Partial<VideoCall> & { updatedAt: Date } = {
        ...data,
        updatedAt: Timestamp.now().toDate()
      };

      if (data.startDateTime) {
        updateData.startDateTime = data.startDateTime;
        if (data.duration) {
          updateData.endDateTime = new Date(data.startDateTime.getTime() + data.duration * 60000);
        }
      }

      await updateDoc(
        doc(db, this.getCollectionPath(centerId), videoCallId),
        updateData
      );
    } catch (error) {
      console.error('Error updating video call:', error);
      throw new Error('Error al actualizar la videollamada');
    }
  }

  // Obtener videollamada por ID
  static async getVideoCallById(centerId: string, videoCallId: string): Promise<VideoCall | null> {
    try {
      const docSnap = await getDoc(doc(db, this.getCollectionPath(centerId), videoCallId));
      
      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        startDateTime: data.startDateTime.toDate(),
        endDateTime: data.endDateTime.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as VideoCall;
    } catch (error) {
      console.error('Error fetching video call:', error);
      throw new Error('Error al obtener la videollamada');
    }
  }

  // Cancelar videollamada
  static async cancelVideoCall(centerId: string, videoCallId: string): Promise<void> {
    try {
      await updateDoc(
        doc(db, this.getCollectionPath(centerId), videoCallId),
        {
          status: 'cancelada',
          updatedAt: Timestamp.now()
        }
      );
    } catch (error) {
      console.error('Error canceling video call:', error);
      throw new Error('Error al cancelar la videollamada');
    }
  }

  // Obtener estadísticas de videollamadas
  static async getVideoCallStats(centerId: string, professionalId: string): Promise<VideoCallStats> {
    try {
      const videoCalls = await this.getVideoCalls(centerId, professionalId);
      
      return {
        total: videoCalls.length,
        programadas: videoCalls.filter(call => call.status === 'programada').length,
        confirmadas: videoCalls.filter(call => call.status === 'confirmada').length,
        enCurso: videoCalls.filter(call => call.status === 'en_curso').length,
        finalizadas: videoCalls.filter(call => call.status === 'finalizada').length,
        canceladas: videoCalls.filter(call => call.status === 'cancelada').length,
      };
    } catch (error) {
      console.error('Error fetching video call stats:', error);
      throw new Error('Error al obtener estadísticas');
    }
  }

  // Marcar recordatorio como enviado
  static async markReminderSent(centerId: string, videoCallId: string): Promise<void> {
    try {
      await updateDoc(
        doc(db, this.getCollectionPath(centerId), videoCallId),
        {
          reminderSent: true,
          updatedAt: Timestamp.now()
        }
      );
    } catch (error) {
      console.error('Error marking reminder as sent:', error);
      throw new Error('Error al marcar recordatorio');
    }
  }
}
