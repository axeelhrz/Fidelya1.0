import { db, storage } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit, 
  increment, 
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { 
  HelpArticle, 
  HelpRequest, 
  UserHelpStats, 
  SystemStatusItem 
} from '@/types/help-center';

// Colecciones
const articlesCollection = collection(db, 'help_articles');
const requestsCollection = collection(db, 'help_requests');
const systemStatusCollection = collection(db, 'help_system_status');

// Artículos de ayuda
export const getArticles = async (): Promise<HelpArticle[]> => {
  const snapshot = await getDocs(articlesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HelpArticle));
};

export const getPopularArticles = async (limit_count = 5): Promise<HelpArticle[]> => {
  const q = query(articlesCollection, orderBy('views', 'desc'), limit(limit_count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HelpArticle));
};

export const getMostLikedArticles = async (limit_count = 5): Promise<HelpArticle[]> => {
  const q = query(articlesCollection, orderBy('likes', 'desc'), limit(limit_count));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HelpArticle));
};

export const getRecentArticles = async (limit_count = 5): Promise<HelpArticle[]> => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const q = query(
    articlesCollection, 
    where('createdAt', '>=', Timestamp.fromDate(oneWeekAgo)),
    orderBy('createdAt', 'desc'),
    limit(limit_count)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HelpArticle));
};

export const getArticlesByTag = async (tag: string): Promise<HelpArticle[]> => {
  const q = query(articlesCollection, where('tags', 'array-contains', tag));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HelpArticle));
};

export const getArticleById = async (id: string): Promise<HelpArticle | null> => {
  const docRef = doc(db, 'help_articles', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as HelpArticle;
  }
  
  return null;
};

export const incrementArticleViews = async (articleId: string): Promise<void> => {
  const articleRef = doc(db, 'help_articles', articleId);
  await updateDoc(articleRef, {
    views: increment(1)
  });
};

export const likeArticle = async (articleId: string, userId: string, liked: boolean): Promise<void> => {
  // Actualizar contador de likes en el artículo
  const articleRef = doc(db, 'help_articles', articleId);
  await updateDoc(articleRef, {
    likes: increment(liked ? 1 : -1)
  });
  
  // Guardar feedback del usuario
  const feedbackRef = doc(db, 'help_feedback', `${userId}_${articleId}`);
  const feedbackSnap = await getDoc(feedbackRef);
  
  if (feedbackSnap.exists()) {
    await updateDoc(feedbackRef, {
      liked,
      timestamp: serverTimestamp()
    });
  } else {
    await updateDoc(feedbackRef, {
      userId,
      articleId,
      liked,
      timestamp: serverTimestamp()
    });
  }
};

// Solicitudes de soporte
export const createSupportRequest = async (
  userId: string, 
  title: string, 
  description: string, 
  category: string,
  screenshot?: File
): Promise<string> => {
  let screenshotUrl = '';
  
  if (screenshot) {
    const storageRef = ref(storage, `support_screenshots/${userId}/${uuidv4()}`);
    await uploadBytes(storageRef, screenshot);
    screenshotUrl = await getDownloadURL(storageRef);
  }
  
  const docRef = await addDoc(requestsCollection, {
    userId,
    title,
    description,
    category,
    screenshotUrl,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
};

export const getUserRequests = async (userId: string): Promise<HelpRequest[]> => {
  const q = query(
    requestsCollection, 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HelpRequest));
};

// Estadísticas de usuario
export const getUserHelpStats = async (userId: string): Promise<UserHelpStats> => {
  const docRef = doc(db, 'help_user_stats', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserHelpStats;
  }
  // Si no existe, crear estadísticas iniciales
  const initialStats: UserHelpStats = {
    articlesRead: 0,
    problemsSolved: 0,
    searchCount: 0,
    lastActivity: serverTimestamp() as Timestamp,
    satisfaction: 0
  };
  
  await setDoc(docRef, initialStats);
  return initialStats;
  return initialStats;
};

export const incrementUserStat = async (
  userId: string, 
  stat: 'articlesRead' | 'problemsSolved' | 'searchCount'
): Promise<void> => {
  const docRef = doc(db, 'help_user_stats', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    await updateDoc(docRef, {
      [stat]: increment(1),
      lastActivity: serverTimestamp()
    });
  } else {
    const initialStats: Partial<UserHelpStats> = {
      articlesRead: 0,
      problemsSolved: 0,
      searchCount: 0,
      satisfaction: 0
    };
    initialStats[stat] = 1;
    await setDoc(docRef, initialStats);
    await updateDoc(docRef, initialStats);
  }
};

export const updateUserSatisfaction = async (userId: string, satisfaction: number): Promise<void> => {
  const docRef = doc(db, 'help_user_stats', userId);
  await updateDoc(docRef, {
    satisfaction,
    lastActivity: serverTimestamp()
  });
};

// Estado del sistema
export const getSystemStatus = async (): Promise<SystemStatusItem[]> => {
  const snapshot = await getDocs(systemStatusCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as SystemStatusItem));
};

// Búsqueda
export const searchArticles = async (query: string): Promise<HelpArticle[]> => {
  // Implementación básica - en producción se usaría Algolia o una solución de búsqueda más robusta
  const snapshot = await getDocs(articlesCollection);
  const articles = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HelpArticle));
  
  // Búsqueda simple por título, contenido y tags
  return articles.filter(article => 
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.content.toLowerCase().includes(query.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
};

// Sugerencias inteligentes
export const getSuggestionsForSection = async (section: string): Promise<HelpArticle[]> => {
  const q = query(
    articlesCollection,
    where('relatedSections', 'array-contains', section),
    orderBy('views', 'desc'),
    limit(3)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as HelpArticle));
};