import { db, storage } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { ProfileData } from '@/types/profile';

export const profileService = {
  async getProfile(userId: string) {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as ProfileData : null;
  },

  subscribeToProfile(userId: string, callback: (profile: ProfileData | null) => void) {
    return onSnapshot(doc(db, 'profiles', userId), (doc) => {
      callback(doc.exists() ? doc.data() as ProfileData : null);
    });
  },

  async updateProfile(userId: string, data: Partial<ProfileData>) {
    const docRef = doc(db, 'profiles', userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  async uploadImage(userId: string, file: File, type: 'avatar' | 'cover') {
    const fileRef = ref(storage, `profiles/${userId}/${type}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  },

  async initializeProfile(userId: string, email: string, displayName: string) {
    const docRef = doc(db, 'profiles', userId);
    const initialData: ProfileData = {
      id: userId,
      name: displayName || '',
      firstName: displayName?.split(' ')[0] || '',
      lastName: displayName?.split(' ').slice(1).join(' ') || '',
      displayName: displayName || '',
      email: email || '',
      bio: '',
      location: '',
      company: '',
      website: '',
      avatarUrl: '',
      coverPhotoUrl: '/assets/default-cover.jpg',
      statistics: {
        totalClients: 0,
        activePolicies: 0,
        successRate: 0,
        totalRevenue: 0,
        lastMonthPolicies: 0,
        lastUpdated: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(docRef, initialData);
    return initialData;
  }
};
