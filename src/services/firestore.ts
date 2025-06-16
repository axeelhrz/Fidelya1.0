import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User, SignUpData } from '@/types/auth';
import { CenterSettings } from '@/types/center';
import { Patient, PatientFormData, PatientFilters, PatientStats } from '@/types/patient';

export class FirestoreService {
  // Usuarios
  static async createUser(uid: string, userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  static async getUser(uid: string): Promise<User | null> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        uid,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
      } as User;
    }
    
    return null;
  }

  static async updateUser(uid: string, data: Partial<User>) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async updateLastLogin(uid: string) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }

  // Centros
  static async getCenterSettings(centerId: string): Promise<CenterSettings | null> {
    const centerRef = doc(db, 'centers', centerId);
    const centerSnap = await getDoc(centerRef);
    
    if (centerSnap.exists()) {
      const data = centerSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        subscription: {
          ...data.subscription,
          expiresAt: data.subscription.expiresAt?.toDate(),
        },
      } as CenterSettings;
    }
    
    return null;
  }

  static async updateCenterSettings(centerId: string, settings: Partial<CenterSettings>) {
    const centerRef = doc(db, 'centers', centerId);
    await updateDoc(centerRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    });
  }

  // Verificar si el usuario tiene acceso al centro
  static async verifyUserCenterAccess(uid: string, centerId: string): Promise<boolean> {
    const user = await this.getUser(uid);
    return user?.centerId === centerId && user?.isActive;
  }

  // Obtener usuarios de un centro
  static async getCenterUsers(centerId: string) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('centerId', '==', centerId), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as User[];
  }

  // ==================== PACIENTES ====================

  // Crear paciente
  static async createPatient(centerId: string, patientData: PatientFormData, createdBy: string): Promise<string> {
    const patientsRef = collection(db, 'centers', centerId, 'patients');
    
    // Calcular edad automáticamente
    const birthDate = new Date(patientData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear() - 
      (today.getMonth() < birthDate.getMonth() || 
       (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);

    const docRef = await addDoc(patientsRef, {
      ...patientData,
      age,
      centerId,
      createdBy,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  }

  // Obtener paciente por ID
  static async getPatient(centerId: string, patientId: string): Promise<Patient | null> {
    const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
    const patientSnap = await getDoc(patientRef);
    
    if (patientSnap.exists()) {
      const data = patientSnap.data();
      return {
        id: patientSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Patient;
    }
    
    return null;
  }

  // Actualizar paciente
  static async updatePatient(centerId: string, patientId: string, patientData: Partial<PatientFormData>): Promise<void> {
    const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
    
    const updateData: any = {
      ...patientData,
      updatedAt: serverTimestamp(),
    };

    // Recalcular edad si se actualiza la fecha de nacimiento
    if (patientData.birthDate) {
      const birthDate = new Date(patientData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear() - 
        (today.getMonth() < birthDate.getMonth() || 
         (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
      updateData.age = age;
    }

    await updateDoc(patientRef, updateData);
  }

  // Eliminar paciente (soft delete)
  static async deletePatient(centerId: string, patientId: string): Promise<void> {
    const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
    await updateDoc(patientRef, {
      status: 'inactive',
      updatedAt: serverTimestamp(),
    });
  }

  // Eliminar paciente permanentemente
  static async permanentDeletePatient(centerId: string, patientId: string): Promise<void> {
    const patientRef = doc(db, 'centers', centerId, 'patients', patientId);
    await deleteDoc(patientRef);
  }

  // Obtener pacientes con filtros
  static async getPatients(
    centerId: string, 
    filters?: PatientFilters,
    pageSize: number = 50,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ patients: Patient[], lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    const patientsRef = collection(db, 'centers', centerId, 'patients');
    let q = query(patientsRef, orderBy('createdAt', 'desc'));

    // Aplicar filtros
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    } else {
      // Por defecto, solo mostrar pacientes activos
      q = query(q, where('status', '==', 'active'));
    }

    if (filters?.gender) {
      q = query(q, where('gender', '==', filters.gender));
    }

    if (filters?.emotionalState) {
      q = query(q, where('emotionalState', '==', filters.emotionalState));
    }

    if (filters?.assignedPsychologist) {
      q = query(q, where('assignedPsychologist', '==', filters.assignedPsychologist));
    }

    // Paginación
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }
    q = query(q, limit(pageSize));

    const querySnapshot = await getDocs(q);
    const patients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Patient[];

    // Aplicar filtros del lado del cliente para campos que no se pueden filtrar en Firestore
    let filteredPatients = patients;

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPatients = filteredPatients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm) ||
        patient.motivoConsulta.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.ageRange) {
      filteredPatients = filteredPatients.filter(patient => {
        if (filters.ageRange?.min && patient.age && patient.age < filters.ageRange.min) return false;
        if (filters.ageRange?.max && patient.age && patient.age > filters.ageRange.max) return false;
        return true;
      });
    }

    return {
      patients: filteredPatients,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1]
    };
  }

  // Obtener estadísticas de pacientes
  static async getPatientStats(centerId: string): Promise<PatientStats> {
    const patientsRef = collection(db, 'centers', centerId, 'patients');
    const querySnapshot = await getDocs(patientsRef);
    
    const patients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Patient[];

    const stats: PatientStats = {
      total: patients.length,
      active: patients.filter(p => p.status === 'active').length,
      inactive: patients.filter(p => p.status === 'inactive').length,
      discharged: patients.filter(p => p.status === 'discharged').length,
      byGender: { M: 0, F: 0, Otro: 0 },
      byEmotionalState: {
        'Estable': 0,
        'Ansioso/a': 0,
        'Deprimido/a': 0,
        'Irritable': 0,
        'Eufórico/a': 0,
        'Confundido/a': 0,
        'Agresivo/a': 0,
        'Retraído/a': 0
      },
      averageAge: 0
    };

    let totalAge = 0;
    let ageCount = 0;

    patients.forEach(patient => {
      // Contar por género
      stats.byGender[patient.gender]++;
      
      // Contar por estado emocional
      stats.byEmotionalState[patient.emotionalState]++;
      
      // Calcular edad promedio
      if (patient.age) {
        totalAge += patient.age;
        ageCount++;
      }
    });

    stats.averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 0;

    return stats;
  }

  // Buscar pacientes por nombre
  static async searchPatients(centerId: string, searchTerm: string): Promise<Patient[]> {
    const { patients } = await this.getPatients(centerId);
    
    const searchLower = searchTerm.toLowerCase();
    return patients.filter(patient =>
      patient.fullName.toLowerCase().includes(searchLower) ||
      patient.motivoConsulta.toLowerCase().includes(searchLower)
    );
  }

  // Obtener pacientes asignados a un psicólogo
  static async getPsychologistPatients(centerId: string, psychologistId: string): Promise<Patient[]> {
    const { patients } = await this.getPatients(centerId, {
      assignedPsychologist: psychologistId,
      status: 'active'
    });
    
    return patients;
  }
}