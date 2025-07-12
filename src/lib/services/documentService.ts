import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  increment
} from 'firebase/firestore';
import { 
  ref, 
  getDownloadURL, 
} from 'firebase/storage';
import { db, storage } from '../firebase';
import { PatientDocument, DocumentFilter, DocumentStats, DocumentAction } from '../../types/documents';

const COLLECTIONS = {
  CENTERS: 'centers',
  PATIENTS: 'patients',
  DOCUMENTS: 'documents',
  DOCUMENT_ACTIONS: 'documentActions'
};

export class DocumentService {
  // ============================================================================
  // OBTENER DOCUMENTOS
  // ============================================================================
  
  static async getPatientDocuments(
    centerId: string, 
    patientId: string, 
    filters?: DocumentFilter
  ): Promise<PatientDocument[]> {
    try {
      let q = query(
        collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.DOCUMENTS),
        orderBy('createdAt', 'desc')
      );

      // Aplicar filtros
      if (filters?.type) {
        q = query(q, where('type', '==', filters.type));
      }
      
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }
      
      if (filters?.isRead !== undefined) {
        q = query(q, where('isRead', '==', filters.isRead));
      }

      if (filters?.uploadedBy) {
        q = query(q, where('uploadedBy', '==', filters.uploadedBy));
      }

      const snapshot = await getDocs(q);
      let documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        readAt: doc.data().readAt?.toDate(),
        lastDownloaded: doc.data().lastDownloaded?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate()
      })) as PatientDocument[];

      // Filtros adicionales en memoria
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        documents = documents.filter(doc => 
          doc.title.toLowerCase().includes(searchTerm) ||
          doc.description.toLowerCase().includes(searchTerm) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      if (filters?.dateRange) {
        documents = documents.filter(doc => 
          doc.createdAt >= filters.dateRange!.start &&
          doc.createdAt <= filters.dateRange!.end
        );
      }

      if (filters?.tags && filters.tags.length > 0) {
        documents = documents.filter(doc =>
          filters.tags!.some(tag => doc.tags.includes(tag))
        );
      }

      return documents;
    } catch (error) {
      console.error('Error getting patient documents:', error);
      throw error;
    }
  }

  static async getDocumentById(
    centerId: string, 
    patientId: string, 
    documentId: string
  ): Promise<PatientDocument | null> {
    try {
      const docRef = doc(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.DOCUMENTS, documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          readAt: data.readAt?.toDate(),
          lastDownloaded: data.lastDownloaded?.toDate(),
          expiresAt: data.expiresAt?.toDate()
        } as PatientDocument;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting document by ID:', error);
      throw error;
    }
  }

  // ============================================================================
  // ESTADÍSTICAS
  // ============================================================================
  
  static async getDocumentStats(
    centerId: string, 
    patientId: string
  ): Promise<DocumentStats> {
    try {
      const documents = await this.getPatientDocuments(centerId, patientId);
      
      const stats: DocumentStats = {
        total: documents.length,
        byType: {} as Record<string, number>,
        byCategory: {} as Record<string, number>,
        unread: documents.filter(doc => !doc.isRead).length,
        recentlyAdded: documents.filter(doc => {
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return doc.createdAt >= weekAgo;
        }).length,
        totalSize: documents.reduce((total, doc) => total + doc.fileSize, 0)
      };

      // Contar por tipo
      documents.forEach(doc => {
        stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
        stats.byCategory[doc.category] = (stats.byCategory[doc.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting document stats:', error);
      throw error;
    }
  }

  // ============================================================================
  // ACCIONES DE DOCUMENTOS
  // ============================================================================
  
  static async markAsRead(
    centerId: string, 
    patientId: string, 
    documentId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.DOCUMENTS, documentId);
      await updateDoc(docRef, {
        isRead: true,
        readAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Registrar acción
      await this.logDocumentAction(centerId, patientId, documentId, 'view');
    } catch (error) {
      console.error('Error marking document as read:', error);
      throw error;
    }
  }

  static async incrementDownloadCount(
    centerId: string, 
    patientId: string, 
    documentId: string
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.PATIENTS, patientId, COLLECTIONS.DOCUMENTS, documentId);
      await updateDoc(docRef, {
        downloadCount: increment(1),
        lastDownloaded: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Registrar acción
      await this.logDocumentAction(centerId, patientId, documentId, 'download');
    } catch (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
  }

  static async logDocumentAction(
    centerId: string,
    patientId: string,
    documentId: string,
    action: DocumentAction['action'],
    metadata?: Record<string, string | number | boolean>
  ): Promise<void> {
    try {
      const actionData: Omit<DocumentAction, 'id'> = {
        documentId,
        patientId,
        action,
        timestamp: new Date(),
        metadata
      };

      await addDoc(
        collection(db, COLLECTIONS.CENTERS, centerId, COLLECTIONS.DOCUMENT_ACTIONS),
        {
          ...actionData,
          timestamp: Timestamp.now()
        }
      );
    } catch (error) {
      console.error('Error logging document action:', error);
      // No lanzar error para no interrumpir la acción principal
    }
  }

  // ============================================================================
  // DESCARGA DE ARCHIVOS
  // ============================================================================
  
  static async getDownloadUrl(fileUrl: string): Promise<string> {
    try {
      const storageRef = ref(storage, fileUrl);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  static async downloadDocument(
    centerId: string,
    patientId: string,
    patientDocument: PatientDocument
  ): Promise<void> {
    try {
      const downloadUrl = await this.getDownloadUrl(patientDocument.fileUrl);
      
      // Crear enlace temporal para descarga
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = patientDocument.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Incrementar contador de descargas
      await this.incrementDownloadCount(centerId, patientId, patientDocument.id);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }
}
