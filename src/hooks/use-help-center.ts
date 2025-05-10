import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { 
  getPopularArticles,
  getMostLikedArticles,
  getRecentArticles,
  incrementArticleViews,
  likeArticle,
  getUserHelpStats,
  incrementUserStat,
  searchArticles,
  getSystemStatus,
  getSuggestionsForSection,
  createSupportRequest,
  getUserRequests
} from '@/lib/firebase/help-center';
import { 
  HelpArticle, 
  HelpRequest, 
  UserHelpStats, 
  SystemStatusItem,
  SearchResult,
  FAQItem
} from '@/types/help-center';

// Datos de FAQ para demostración
const faqData: FAQItem[] = [
  {
    id: '1',
    question: '¿Cómo puedo crear una nueva póliza?',
    answer: 'Para crear una nueva póliza, ve a la sección "Pólizas" en el dashboard y haz clic en el botón "Nueva Póliza". Completa el formulario con los datos requeridos y haz clic en "Guardar".',
    category: 'Pólizas',
    likes: 24,
    dislikes: 2
  },
  {
    id: '2',
    question: '¿Cómo puedo cambiar mi plan de suscripción?',
    answer: 'Para cambiar tu plan, ve a "Configuración > Suscripción" y selecciona "Cambiar Plan". Podrás ver las opciones disponibles y realizar el cambio desde allí.',
    category: 'Suscripción',
    likes: 18,
    dislikes: 1
  },
  {
    id: '3',
    question: '¿Cómo exporto mis datos de clientes?',
    answer: 'Para exportar datos de clientes, ve a la sección "Clientes", haz clic en el botón "Exportar" en la esquina superior derecha y selecciona el formato deseado (CSV, Excel, PDF).',
    category: 'Clientes',
    likes: 32,
    dislikes: 3
  },
  {
    id: '4',
    question: '¿Puedo personalizar las notificaciones que recibo?',
    answer: 'Sí, puedes personalizar tus notificaciones en "Configuración > Notificaciones". Allí podrás activar o desactivar diferentes tipos de alertas y establecer tu método preferido de recepción.',
    category: 'Configuración',
    likes: 15,
    dislikes: 0
  },
  {
    id: '5',
    question: '¿Cómo puedo contactar al soporte técnico?',
    answer: 'Puedes contactar al soporte técnico a través del formulario en la sección "Ayuda > Enviar Solicitud" o enviando un correo a soporte@assuriva.com.',
    category: 'Soporte',
    likes: 27,
    dislikes: 1
  }
];

export function useHelpCenter() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [popularArticles, setPopularArticles] = useState<HelpArticle[]>([]);
  const [likedArticles, setLikedArticles] = useState<HelpArticle[]>([]);
  const [recentArticles, setRecentArticles] = useState<HelpArticle[]>([]);
  const [userStats, setUserStats] = useState<UserHelpStats | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatusItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult>({
    articles: [],
    loading: false,
    query: ''
  });
  const [faq, setFaq] = useState<FAQItem[]>(faqData);
  const [userRequests, setUserRequests] = useState<HelpRequest[]>([]);
  const [suggestions, setSuggestions] = useState<HelpArticle[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('');

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Cargar artículos populares
        const popular = await getPopularArticles();
        setPopularArticles(popular);
        
        // Cargar artículos más votados
        const liked = await getMostLikedArticles();
        setLikedArticles(liked);
        
        // Cargar artículos recientes
        const recent = await getRecentArticles();
        setRecentArticles(recent);
        
        // Cargar estadísticas del usuario
        const stats = await getUserHelpStats(user.uid);
        setUserStats(stats);
        
        // Cargar estado del sistema
        const status = await getSystemStatus();
        setSystemStatus(status);
        
        // Cargar solicitudes del usuario
        const requests = await getUserRequests(user.uid);
        setUserRequests(requests);
        
        // Detectar sección actual para sugerencias
        const path = window.location.pathname;
        let section = '';
        
        if (path.includes('/policies')) section = 'policies';
        else if (path.includes('/customers')) section = 'customers';
        else if (path.includes('/tasks')) section = 'tasks';
        else if (path.includes('/analisis')) section = 'analytics';
        else if (path.includes('/contactos')) section = 'contacts';
        
        setCurrentSection(section);
        
        if (section) {
          const sectionSuggestions = await getSuggestionsForSection(section);
          setSuggestions(sectionSuggestions);
        }
      } catch (error) {
        console.error('Error loading help center data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, [user]);

  // Buscar artículos
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim() || !user) return;
    
    try {
      setSearchResults({
        ...searchResults,
        loading: true,
        query
      });
      
      // Incrementar contador de búsquedas
      await incrementUserStat(user.uid, 'searchCount');
      
      // Realizar búsqueda
      const results = await searchArticles(query);
      
      setSearchResults({
        articles: results,
        loading: false,
        query
      });
      
      // Actualizar estadísticas
      const stats = await getUserHelpStats(user.uid);
      setUserStats(stats);
      
      // Si hay 3 búsquedas consecutivas sin resultados, sugerir crear ticket
      if (results.length === 0 && stats.searchCount % 3 === 0) {
        // Lógica para sugerir ticket
      }
    } catch (error) {
      console.error('Error searching articles:', error);
      setSearchResults({
        ...searchResults,
        loading: false
      });
    }
  }, [searchResults, user]);

  // Incrementar vistas de artículo
  const incrementArticleView = useCallback(async (articleId: string) => {
    if (!user) return;
    
    try {
      await incrementArticleViews(articleId);
      await incrementUserStat(user.uid, 'articlesRead');
      
      // Actualizar estadísticas
      const stats = await getUserHelpStats(user.uid);
      setUserStats(stats);
    } catch (error) {
      console.error('Error incrementing article view:', error);
    }
  }, [user]);

  // Dar like a un artículo
  const handleLikeArticle = useCallback(async (articleId: string, liked: boolean) => {
    if (!user) return;
    
    try {
      await likeArticle(articleId, user.uid, liked);
      
      // Actualizar artículos más votados
      const updatedLiked = await getMostLikedArticles();
      setLikedArticles(updatedLiked);
    } catch (error) {
      console.error('Error liking article:', error);
    }
  }, [user]);

  // Dar like/dislike a una pregunta FAQ
  const handleFaqVote = useCallback((faqId: string, isLike: boolean) => {
    setFaq(prevFaq => 
      prevFaq.map(item => {
        if (item.id === faqId) {
          if (isLike) {
            return { ...item, likes: item.likes + 1 };
          } else {
            return { ...item, dislikes: item.dislikes + 1 };
          }
        }
        return item;
      })
    );
  }, []);

  // Crear solicitud de soporte
  const createRequest = useCallback(async (
    title: string,
    description: string,
    category: string,
    screenshot?: File
  ) => {
    if (!user) return '';
    
    try {
      const requestId = await createSupportRequest(
        user.uid,
        title,
        description,
        category,
        screenshot
      );
      
      // Actualizar solicitudes del usuario
      const requests = await getUserRequests(user.uid);
      setUserRequests(requests);
      
      return requestId;
    } catch (error) {
      console.error('Error creating support request:', error);
      return '';
    }
  }, [user]);

  // Marcar problema como resuelto
  const markProblemSolved = useCallback(async () => {
    if (!user) return;
    
    try {
      await incrementUserStat(user.uid, 'problemsSolved');
      
      // Actualizar estadísticas
      const stats = await getUserHelpStats(user.uid);
      setUserStats(stats);
    } catch (error) {
      console.error('Error marking problem as solved:', error);
    }
  }, [user]);

  return {
    loading,
    popularArticles,
    likedArticles,
    recentArticles,
    userStats,
    systemStatus,
    searchResults,
    faq,
    userRequests,
    suggestions,
    currentSection,
    handleSearch,
    incrementArticleView,
    handleLikeArticle,
    handleFaqVote,
    createRequest,
    markProblemSolved
  };
}