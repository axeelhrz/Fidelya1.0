'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Divider,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  AlertTitle,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Forum as ForumIcon,
  Subscriptions as SubscriptionsIcon,
  Notifications as NotificationsIcon,
  ContactMail as ContactMailIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Email as EmailIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  Send as SendIcon,
  Download as DownloadIcon,
  PersonAdd as PersonAddIcon,
  SupervisorAccount as SupervisorAccountIcon,
  ExitToApp as ExitToAppIcon,
  PlayArrow as PlayArrowIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc, 
  orderBy, 
  limit, 
  Timestamp, 
  addDoc, 
  deleteDoc, 
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Define types for our data structures
interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  chatEnabled: boolean;
  notificationsEnabled: boolean;
}

// Interfaces
interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  plan: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  emailVerified: boolean;
  active: boolean;
  paypalSubscriptionId?: string;
  photoURL?: string;
}

interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  plan: string;
  startDate: Timestamp;
  endDate: Timestamp;
  paypalSubscriptionId?: string;
  status: string;
  amount: number;
}

interface Chat {
  id: string;
  messages: {
    sender: 'user' | 'bot' | 'admin';
    text: string;
    timestamp: Timestamp | Date;
  }[];
  email?: string;
  name?: string;
  userId?: string;
  resolved: boolean;
  needsHumanResponse?: boolean;
  createdAt: Timestamp;
  lastUpdatedAt: Timestamp;
}

interface ContactRequest {
  id: string;
  fromUserId: string;
  fromUserEmail: string;
  fromUserName: string;
  toUserId: string;
  toUserEmail: string;
  toUserName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Timestamp;
  createdAt: Timestamp;
  createdBy: string;
}

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  userEmail: string;
  details: Record<string, unknown>;
  timestamp: Timestamp;
  ipAddress?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'professional' | 'enterprise';
  scheduledFor: Timestamp | null;
  createdAt: Timestamp;
  createdBy: string;
  active: boolean;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  timestamp: Timestamp;
  resolved: boolean;
}

// Componente principal
const AdminPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Estados para las diferentes secciones
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCorredores: 0,
    totalPolicies: 0,
    totalCustomers: 0,
    tasksInProgress: 0,
    tasksCompleted: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userPlanFilter, setUserPlanFilter] = useState('all');
  const [userPage, setUserPage] = useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [chatSearch, setChatSearch] = useState('');
  const [chatStatusFilter, setChatStatusFilter] = useState('all');
  const [chatPage, setChatPage] = useState(0);
  const [chatRowsPerPage, setChatRowsPerPage] = useState(10);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [subscriptionSearch, setSubscriptionSearch] = useState('');
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState('all');
  const [subscriptionPage, setSubscriptionPage] = useState(0);
  const [subscriptionRowsPerPage, setSubscriptionRowsPerPage] = useState(10);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [newNotification, setNewNotification] = useState<Omit<Notification, 'id' | 'createdAt' | 'createdBy'>>({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    targetAudience: 'all',
    scheduledFor: null,
    active: true
  });
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [filteredContactRequests, setFilteredContactRequests] = useState<ContactRequest[]>([]);
  const [contactRequestSearch, setContactRequestSearch] = useState('');
  const [contactRequestStatusFilter, setContactRequestStatusFilter] = useState('all');
  const [contactRequestPage, setContactRequestPage] = useState(0);
  const [contactRequestRowsPerPage, setContactRequestRowsPerPage] = useState(10);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [taskSearch, setTaskSearch] = useState('');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');
  const [taskPage, setTaskPage] = useState(0);
  const [taskRowsPerPage, setTaskRowsPerPage] = useState(10);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt' | 'createdBy'>>({
    title: '',
    description: '',
    assignedTo: '',
    assignedToName: '',
    status: 'pending',
    priority: 'medium',
    dueDate: Timestamp.now()
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredAuditLogs, setFilteredAuditLogs] = useState<AuditLog[]>([]);
  const [auditLogSearch, setAuditLogSearch] = useState('');
  const [auditLogActionFilter, setAuditLogActionFilter] = useState('all');
  const [auditLogPage, setAuditLogPage] = useState(0);
  const [auditLogRowsPerPage, setAuditLogRowsPerPage] = useState(10);

  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', subject: '', message: '' });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    chatEnabled: true,
    notificationsEnabled: true
  });

  // Función para cargar datos iniciales
  const fetchInitialData = useCallback(async () => {
    try {
      await Promise.all([
        fetchStats(),
        fetchRecentUsers(),
        fetchUsers(),
        fetchChats(),
        fetchSubscriptions(),
        fetchNotifications(),
        fetchContactRequests(),
        fetchTasks(),
        fetchAuditLogs(),
        fetchSystemAlerts(),
        fetchSystemSettings()
      ]);
      
      setSnackbar({
        open: true,
        message: 'Datos cargados correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      setSnackbar({
        open: true,
        message: 'Error al cargar datos',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Funciones para cargar datos específicos
  const fetchStats = async () => {
    try {
      // Contar usuarios
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;
      
      // Contar corredores activos (usuarios con plan diferente a 'free')
      const activeBrokersQuery = query(collection(db, 'users'), where('plan', '!=', 'free'));
      const activeBrokersSnapshot = await getDocs(activeBrokersQuery);
      const activeCorredores = activeBrokersSnapshot.size;
      
      // Contar pólizas
      const policiesQuery = query(collection(db, 'policies'));
      const policiesSnapshot = await getDocs(policiesQuery);
      const totalPolicies = policiesSnapshot.size;
      
      // Contar clientes
      const customersQuery = query(collection(db, 'customers'));
      const customersSnapshot = await getDocs(customersQuery);
      const totalCustomers = customersSnapshot.size;
      
      // Contar tareas en progreso
      const tasksInProgressQuery = query(collection(db, 'tasks'), where('status', '==', 'in-progress'));
      const tasksInProgressSnapshot = await getDocs(tasksInProgressQuery);
      const tasksInProgress = tasksInProgressSnapshot.size;
      
      // Contar tareas completadas
      const tasksCompletedQuery = query(collection(db, 'tasks'), where('status', '==', 'completed'));
      const tasksCompletedSnapshot = await getDocs(tasksCompletedQuery);
      const tasksCompleted = tasksCompletedSnapshot.size;
      
      // Contar suscripciones activas
      const activeSubscriptionsQuery = query(
        collection(db, 'users'), 
        where('plan', '!=', 'free'),
        where('paypalSubscriptionId', '!=', null)
      );
      const activeSubscriptionsSnapshot = await getDocs(activeSubscriptionsQuery);
      const activeSubscriptions = activeSubscriptionsSnapshot.size;
      
      // Calcular ingresos (estimación basada en planes)
      let monthlyRevenue = 0;
      activeSubscriptionsSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.plan === 'professional') {
          monthlyRevenue += 29;
        } else if (userData.plan === 'enterprise') {
          monthlyRevenue += 49;
        }
      });
      
      const yearlyRevenue = monthlyRevenue * 12;
      
      setStats({
        totalUsers,
        activeCorredores,
        totalPolicies,
        totalCustomers,
        tasksInProgress,
        tasksCompleted,
        activeSubscriptions,
        monthlyRevenue,
        yearlyRevenue
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const recentUsersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(recentUsersQuery);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setRecentUsers(users);
    } catch (error) {
      console.error('Error al cargar usuarios recientes:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(usersQuery);
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const chatsQuery = query(collection(db, 'chats'), orderBy('lastUpdatedAt', 'desc'));
      const snapshot = await getDocs(chatsQuery);
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Chat));
      setChats(chats);
      setFilteredChats(chats);
    } catch (error) {
      console.error('Error al cargar chats:', error);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      // En un caso real, probablemente tendrías una colección de suscripciones
      // Aquí simulamos obtener datos de suscripción basados en usuarios
      const usersQuery = query(
        collection(db, 'users'),
        where('plan', '!=', 'free')
      );
      const snapshot = await getDocs(usersQuery);
      
      const subscriptions: Subscription[] = [];
      snapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.plan !== 'free') {
          // Crear una suscripción simulada basada en datos de usuario
          const subscription: Subscription = {
            id: doc.id + '_subscription',
            userId: doc.id,
            userEmail: userData.email || '',
            userName: userData.displayName || '',
            plan: userData.plan || 'professional',
            startDate: userData.planStartDate || Timestamp.now(),
            endDate: userData.planEndDate || Timestamp.now(),
            paypalSubscriptionId: userData.paypalSubscriptionId || '',
            status: userData.paypalSubscriptionId ? 'active' : 'inactive',
            amount: userData.plan === 'professional' ? 29 : 49
          };
          subscriptions.push(subscription);
        }
      });
      
      setSubscriptions(subscriptions);
      setFilteredSubscriptions(subscriptions);
    } catch (error) {
      console.error('Error al cargar suscripciones:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(notificationsQuery);
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      setNotifications(notifications);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const fetchContactRequests = async () => {
    try {
      const contactRequestsQuery = query(
        collection(db, 'contactRequests'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(contactRequestsQuery);
      const contactRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ContactRequest));
      setContactRequests(contactRequests);
      setFilteredContactRequests(contactRequests);
    } catch (error) {
      console.error('Error al cargar solicitudes de contacto:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(tasksQuery);
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      setTasks(tasks);
      setFilteredTasks(tasks);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const auditLogsQuery = query(
        collection(db, 'auditLogs'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(auditLogsQuery);
      const auditLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AuditLog));
      setAuditLogs(auditLogs);
      setFilteredAuditLogs(auditLogs);
    } catch (error) {
      console.error('Error al cargar logs de auditoría:', error);
    }
  };

  const fetchSystemAlerts = async () => {
    try {
      const systemAlertsQuery = query(
        collection(db, 'systemAlerts'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(systemAlertsQuery);
      const systemAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SystemAlert));
      setSystemAlerts(systemAlerts);
      
      // Simular usuarios en línea
      setOnlineUsers(Math.floor(Math.random() * 20) + 5);
    } catch (error) {
      console.error('Error al cargar alertas del sistema:', error);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'system'));
      if (settingsDoc.exists()) {
        setSystemSettings(settingsDoc.data() as SystemSettings);
      }
    } catch (error) {
      console.error('Error al cargar configuraciones del sistema:', error);
    }
  };

  // Funciones para filtrar datos
  const filterUsers = useCallback(() => {
    let filtered = [...users];
    
    // Filtrar por búsqueda
    if (userSearch) {
      const searchLower = userSearch.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchLower) ||
        (user.displayName && user.displayName.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrar por rol
    if (userRoleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === userRoleFilter);
    }
    
    // Filtrar por plan
    if (userPlanFilter !== 'all') {
      filtered = filtered.filter(user => user.plan === userPlanFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, userSearch, userRoleFilter, userPlanFilter]);
  // Function has been moved to useCallback above

  const filterChats = () => {
    let filtered = [...chats];
    
    // Filtrar por búsqueda
    if (chatSearch) {
      const searchLower = chatSearch.toLowerCase();
      filtered = filtered.filter(chat => 
        (chat.email && chat.email.toLowerCase().includes(searchLower)) ||
        (chat.name && chat.name.toLowerCase().includes(searchLower)) ||
        (chat.messages && chat.messages.some(msg => msg.text.toLowerCase().includes(searchLower)))
      );
    }
    
    // Filtrar por estado
    if (chatStatusFilter === 'resolved') {
      filtered = filtered.filter(chat => chat.resolved);
    } else if (chatStatusFilter === 'unresolved') {
      filtered = filtered.filter(chat => !chat.resolved);
    } else if (chatStatusFilter === 'needsResponse') {
      filtered = filtered.filter(chat => chat.needsHumanResponse);
    }
    
    setFilteredChats(filtered);
  };

  const filterSubscriptions = () => {
    let filtered = [...subscriptions];
    
    // Filtrar por búsqueda
    if (subscriptionSearch) {
      const searchLower = subscriptionSearch.toLowerCase();
      filtered = filtered.filter(subscription => 
        subscription.userEmail.toLowerCase().includes(searchLower) ||
        subscription.userName.toLowerCase().includes(searchLower) ||
        (subscription.paypalSubscriptionId && subscription.paypalSubscriptionId.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrar por estado
    if (subscriptionStatusFilter !== 'all') {
      filtered = filtered.filter(subscription => subscription.status === subscriptionStatusFilter);
    }
    
    setFilteredSubscriptions(filtered);
  };

  const filterContactRequests = () => {
    let filtered = [...contactRequests];
    
    // Filtrar por búsqueda
    if (contactRequestSearch) {
      const searchLower = contactRequestSearch.toLowerCase();
      filtered = filtered.filter(request => 
        request.fromUserEmail.toLowerCase().includes(searchLower) ||
        request.fromUserName.toLowerCase().includes(searchLower) ||
        request.toUserEmail.toLowerCase().includes(searchLower) ||
        request.toUserName.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por estado
    if (contactRequestStatusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === contactRequestStatusFilter);
    }
    
    setFilteredContactRequests(filtered);
  };

  const filterTasks = () => {
    let filtered = [...tasks];
    
    // Filtrar por búsqueda
    if (taskSearch) {
      const searchLower = taskSearch.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.assignedToName.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrar por estado
    if (taskStatusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === taskStatusFilter);
    }
    
    // Filtrar por prioridad
    if (taskPriorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === taskPriorityFilter);
    }
    
    setFilteredTasks(filtered);
  };

  const filterAuditLogs = () => {
    let filtered = [...auditLogs];
    
    // Filtrar por búsqueda
    if (auditLogSearch) {
      const searchLower = auditLogSearch.toLowerCase();
      filtered = filtered.filter(log => 
        log.userEmail.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        (log.details && JSON.stringify(log.details).toLowerCase().includes(searchLower))
      );
    }
    
    // Filtrar por acción
    if (auditLogActionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === auditLogActionFilter);
    }
    
    setFilteredAuditLogs(filtered);
  };

  // Funciones para manejar acciones
  const handleChangeUserRole = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });
      
      // Actualizar estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'change_user_role',
        userId: user?.uid,
        userEmail: user?.email,
        details: { targetUserId: userId, newRole },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      setSnackbar({
        open: true,
        message: 'Rol de usuario actualizado correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al cambiar rol de usuario:', error);
      setSnackbar({
        open: true,
        message: 'Error al cambiar rol de usuario',
        severity: 'error'
      });
    }
  };

  const handleToggleUserActive = async (userId: string, currentActive: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { active: !currentActive });
      
      // Actualizar estado local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, active: !currentActive } : user
        )
      );
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: currentActive ? 'deactivate_user' : 'activate_user',
        userId: user?.uid,
        userEmail: user?.email,
        details: { targetUserId: userId },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      setSnackbar({
        open: true,
        message: `Usuario ${currentActive ? 'desactivado' : 'activado'} correctamente`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al cambiar estado de usuario:', error);
      setSnackbar({
        open: true,
        message: 'Error al cambiar estado de usuario',
        severity: 'error'
      });
    }
  };

  const handleForceLogout = async (userId: string) => {
    try {
      // En un caso real, esto podría invalidar tokens o actualizar un campo en el usuario
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        forceLogout: true,
        lastForceLogout: serverTimestamp()
      });
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'force_logout',
        userId: user?.uid,
        userEmail: user?.email,
        details: { targetUserId: userId },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      setSnackbar({
        open: true,
        message: 'Cierre de sesión forzado correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al forzar cierre de sesión:', error);
      setSnackbar({
        open: true,
        message: 'Error al forzar cierre de sesión',
        severity: 'error'
      });
    }
  };

  const handleSendAdminChatMessage = async (chatId: string, message: string) => {
    if (!message.trim()) return;
    
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatDoc = await getDoc(chatRef);
      
      if (chatDoc.exists()) {
        const chatData = chatDoc.data();
        const messages = chatData.messages || [];
        
        // Añadir nuevo mensaje
        const newMessage = {
          sender: 'admin',
          text: message,
          timestamp: new Date() // Usar Date en lugar de serverTimestamp para arrays
        };
        
        await updateDoc(chatRef, {
          messages: [...messages, newMessage],
          lastUpdatedAt: serverTimestamp(),
          needsHumanResponse: false
        });
        
        // Limpiar campo de mensaje
        setChatMessage('');
        
        // Registrar en auditoría
        await addDoc(collection(db, 'auditLogs'), {
          action: 'send_admin_chat_message',
          userId: user?.uid,
          userEmail: user?.email,
          details: { chatId, message },
          timestamp: serverTimestamp(),
          ipAddress: 'client-side'
        });
        
        setSnackbar({
          open: true,
          message: 'Mensaje enviado correctamente',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error al enviar mensaje de chat:', error);
      setSnackbar({
        open: true,
        message: 'Error al enviar mensaje de chat',
        severity: 'error'
      });
    }
  };

  const handleResolveChat = async (chatId: string) => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, { 
        resolved: true,
        lastUpdatedAt: serverTimestamp()
      });
      
      // Actualizar estado local
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId ? { ...chat, resolved: true } : chat
        )
      );
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'resolve_chat',
        userId: user?.uid,
        userEmail: user?.email,
        details: { chatId },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      setSnackbar({
        open: true,
        message: 'Chat marcado como resuelto',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al resolver chat:', error);
      setSnackbar({
        open: true,
        message: 'Error al resolver chat',
        severity: 'error'
      });
    }
  };

  const handleManageSubscription = async (subscriptionId: string, action: 'cancel' | 'reactivate') => {
    try {
      // Encontrar la suscripción
      const subscription = subscriptions.find(s => s.id === subscriptionId);
      if (!subscription) return;
      
      // En un caso real, aquí se conectaría con la API de PayPal
      // Para este ejemplo, simplemente actualizamos el estado
      const userRef = doc(db, 'users', subscription.userId);
      
      if (action === 'cancel') {
        await updateDoc(userRef, { 
          plan: 'free',
          paypalSubscriptionId: null
        });
      } else {
        await updateDoc(userRef, { 
          plan: subscription.plan,
          paypalSubscriptionId: 'reactivated_' + Date.now()
        });
      }
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: action === 'cancel' ? 'cancel_subscription' : 'reactivate_subscription',
        userId: user?.uid,
        userEmail: user?.email,
        details: { subscriptionId, targetUserId: subscription.userId },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      // Recargar suscripciones
      fetchSubscriptions();
      
      setSnackbar({
        open: true,
        message: `Suscripción ${action === 'cancel' ? 'cancelada' : 'reactivada'} correctamente`,
        severity: 'success'
      });
    } catch (error) {
      console.error(`Error al ${action === 'cancel' ? 'cancelar' : 'reactivar'} suscripción:`, error);
      setSnackbar({
        open: true,
        message: `Error al ${action === 'cancel' ? 'cancelar' : 'reactivar'} suscripción`,
        severity: 'error'
      });
    }
  };

  const handleCreateNotification = async () => {
    try {
      // Validar campos
      if (!newNotification.title || !newNotification.message) {
        setSnackbar({
          open: true,
          message: 'Por favor completa los campos requeridos',
          severity: 'warning'
        });
        return;
      }
      
      // Crear notificación
      await addDoc(collection(db, 'notifications'), {
        ...newNotification,
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'create_notification',
        userId: user?.uid,
        userEmail: user?.email,
        details: { notification: newNotification },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      // Limpiar formulario y cerrar diálogo
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        targetAudience: 'all',
        scheduledFor: null,
        active: true
      });
      setNotificationDialogOpen(false);
      
      // Recargar notificaciones
      fetchNotifications();
      
      setSnackbar({
        open: true,
        message: 'Notificación creada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al crear notificación:', error);
      setSnackbar({
        open: true,
        message: 'Error al crear notificación',
        severity: 'error'
      });
    }
  };

  const handleManageContactRequest = async (requestId: string, action: 'accept' | 'reject' | 'delete') => {
    try {
      const requestRef = doc(db, 'contactRequests', requestId);
      
      if (action === 'delete') {
        await deleteDoc(requestRef);
      } else {
        await updateDoc(requestRef, { 
          status: action === 'accept' ? 'accepted' : 'rejected',
          updatedAt: serverTimestamp()
        });
      }
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: `${action}_contact_request`,
        userId: user?.uid,
        userEmail: user?.email,
        details: { requestId },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      // Actualizar estado local
      if (action === 'delete') {
        setContactRequests(prevRequests => 
          prevRequests.filter(request => request.id !== requestId)
        );
      } else {
        setContactRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId ? { ...request, status: action === 'accept' ? 'accepted' : 'rejected' } : request
          )
        );
      }
      
      setSnackbar({
        open: true,
        message: `Solicitud de contacto ${action === 'accept' ? 'aceptada' : action === 'reject' ? 'rechazada' : 'eliminada'} correctamente`,
        severity: 'success'
      });
    } catch (error) {
      console.error(`Error al ${action} solicitud de contacto:`, error);
      setSnackbar({
        open: true,
        message: `Error al ${action === 'accept' ? 'aceptar' : action === 'reject' ? 'rechazar' : 'eliminar'} solicitud de contacto`,
        severity: 'error'
      });
    }
  };

  const handleCreateTask = async () => {
    try {
      // Validar campos
      if (!newTask.title || !newTask.description || !newTask.assignedTo) {
        setSnackbar({
          open: true,
          message: 'Por favor completa los campos requeridos',
          severity: 'warning'
        });
        return;
      }
      
      // Obtener nombre del asignado
      let assignedToName = '';
      const userDoc = await getDoc(doc(db, 'users', newTask.assignedTo));
      if (userDoc.exists()) {
        assignedToName = userDoc.data().displayName || userDoc.data().email;
      }
      
      // Crear tarea
      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        assignedToName,
        createdAt: serverTimestamp(),
        createdBy: user?.uid
      });
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'create_task',
        userId: user?.uid,
        userEmail: user?.email,
        details: { task: newTask },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      // Limpiar formulario y cerrar diálogo
      setNewTask({
        title: '',
        description: '',
        assignedTo: '',
        assignedToName: '',
        status: 'pending',
        priority: 'medium',
        dueDate: Timestamp.now()
      });
      setTaskDialogOpen(false);
      
      // Recargar tareas
      fetchTasks();
      
      setSnackbar({
        open: true,
        message: 'Tarea creada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al crear tarea:', error);
      setSnackbar({
        open: true,
        message: 'Error al crear tarea',
        severity: 'error'
      });
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // Actualizar estado local
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'update_task_status',
        userId: user?.uid,
        userEmail: user?.email,
        details: { taskId, newStatus },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      setSnackbar({
        open: true,
        message: 'Estado de tarea actualizado correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al actualizar estado de tarea:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar estado de tarea',
        severity: 'error'
      });
    }
  };

  const handleExportAuditLogs = () => {
    try {
      // Convertir logs a formato CSV
      const headers = ['ID', 'Acción', 'Usuario', 'Email', 'Detalles', 'Fecha', 'IP'];
      const csvContent = [
        headers.join(','),
        ...filteredAuditLogs.map(log => [
          log.id,
          log.action,
          log.userId,
          log.userEmail,
          JSON.stringify(log.details).replace(/,/g, ';'),
          log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : '',
          log.ipAddress || ''
        ].join(','))
      ].join('\n');
      
      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSnackbar({
        open: true,
        message: 'Logs exportados correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al exportar logs:', error);
      setSnackbar({
        open: true,
        message: 'Error al exportar logs',
        severity: 'error'
      });
    }
  };

  const handleResolveSystemAlert = async (alertId: string) => {
    try {
      const alertRef = doc(db, 'systemAlerts', alertId);
      await updateDoc(alertRef, { 
        resolved: true,
        resolvedAt: serverTimestamp(),
        resolvedBy: user?.uid
      });
      
      // Actualizar estado local
      setSystemAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId ? { ...alert, resolved: true } : alert
        )
      );
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'resolve_system_alert',
        userId: user?.uid,
        userEmail: user?.email,
        details: { alertId },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      setSnackbar({
        open: true,
        message: 'Alerta resuelta correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al resolver alerta:', error);
      setSnackbar({
        open: true,
        message: 'Error al resolver alerta',
        severity: 'error'
      });
    }
  };

  const handleForceSyncData = async () => {
    try {
      setSnackbar({
        open: true,
        message: 'Sincronización forzada iniciada',
        severity: 'info'
      });
      
      // Simular sincronización
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recargar todos los datos
      await fetchInitialData();
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'force_sync_data',
        userId: user?.uid,
        userEmail: user?.email,
        details: { timestamp: new Date().toISOString() },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      setSnackbar({
        open: true,
        message: 'Sincronización completada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al forzar sincronización:', error);
      setSnackbar({
        open: true,
        message: 'Error al forzar sincronización',
        severity: 'error'
      });
    }
  };

  const handleSendDirectEmail = async () => {
    try {
      // Validar campos
      if (!emailData.to || !emailData.subject || !emailData.message) {
        setSnackbar({
          open: true,
          message: 'Por favor completa todos los campos del email',
          severity: 'warning'
        });
        return;
      }
      
      // En un caso real, aquí se enviaría el email usando EmailJS o una API
      // Para este ejemplo, simulamos el envío
      setSnackbar({
        open: true,
        message: 'Enviando email...',
        severity: 'info'
      });
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'send_direct_email',
        userId: user?.uid,
        userEmail: user?.email,
        details: { to: emailData.to, subject: emailData.subject },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      // Limpiar formulario y cerrar diálogo
      setEmailData({ to: '', subject: '', message: '' });
      setEmailDialogOpen(false);
      
      setSnackbar({
        open: true,
        message: 'Email enviado correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al enviar email:', error);
      setSnackbar({
        open: true,
        message: 'Error al enviar email',
        severity: 'error'
      });
    }
  };

  const handleUpdateSystemSettings = async () => {
    try {
      // Actualizar configuraciones en Firestore
      const settingsRef = doc(db, 'settings', 'system');
      await updateDoc(settingsRef, { ...systemSettings });
      
      // Registrar en auditoría
      await addDoc(collection(db, 'auditLogs'), {
        action: 'update_system_settings',
        userId: user?.uid,
        userEmail: user?.email,
        details: { settings: systemSettings },
        timestamp: serverTimestamp(),
        ipAddress: 'client-side'
      });
      
      setSnackbar({
        open: true,
        message: 'Configuraciones actualizadas correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al actualizar configuraciones:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar configuraciones',
        severity: 'error'
      });
    }
  };
  
  // Efecto para cargar los datos iniciales
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Formatear fechas
  const formatDate = (timestamp: Timestamp | Date | null | undefined) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp instanceof Timestamp 
      ? new Date(timestamp.seconds * 1000) 
      : timestamp instanceof Date 
        ? timestamp 
        : new Date();
    
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Datos para gráficos
  const subscriptionChartData = [
    { name: 'Ene', professional: 12, enterprise: 5 },
    { name: 'Feb', professional: 15, enterprise: 6 },
    { name: 'Mar', professional: 18, enterprise: 8 },
    { name: 'Abr', professional: 22, enterprise: 10 },
    { name: 'May', professional: 25, enterprise: 12 },
    { name: 'Jun', professional: 28, enterprise: 15 },
  ];

  const userPlanDistribution = [
    { name: 'Free', value: users.filter(u => u.plan === 'free').length },
    { name: 'Professional', value: users.filter(u => u.plan === 'professional').length },
    { name: 'Enterprise', value: users.filter(u => u.plan === 'enterprise').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Panel de Administración
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona todos los aspectos de la plataforma Assuriva desde un solo lugar.
        </Typography>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              py: 2
            }
          }}
        >
          <Tab 
            label="Dashboard" 
            icon={<DashboardIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Usuarios" 
            icon={<PeopleIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Chats" 
            icon={<ForumIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Suscripciones" 
            icon={<SubscriptionsIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Notificaciones" 
            icon={<NotificationsIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Contactos" 
            icon={<ContactMailIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Tareas" 
            icon={<AssignmentIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Auditoría" 
            icon={<HistoryIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="Sistema" 
            icon={<SettingsIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      
      {/* Dashboard */}
      {activeTab === 0 && (
        <Box>
          <Stack spacing={3}>
            {/* Estadísticas principales */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Usuarios Registrados
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.totalUsers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.activeCorredores} corredores activos
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Pólizas Registradas
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.totalPolicies}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.totalCustomers} clientes
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Tareas
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.tasksInProgress + stats.tasksCompleted}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stats.tasksInProgress} en progreso, {stats.tasksCompleted} completadas
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Ingresos Mensuales
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    ${stats.monthlyRevenue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${stats.yearlyRevenue} anuales estimados
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
            
            {/* Gráficos y datos adicionales */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 2, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Evolución de Suscripciones
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subscriptionChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="professional" name="Plan Profesional" fill="#3f51b5" />
                      <Bar dataKey="enterprise" name="Plan Enterprise" fill="#f50057" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
              
              <Card sx={{ flex: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Distribución de Planes
                </Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userPlanDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {userPlanDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Stack>
            
            {/* Usuarios recientes y alertas del sistema */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Card sx={{ flex: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Usuarios Recientes
                </Typography>
                <List>
                  {recentUsers.map(user => (
                    <ListItemButton key={user.id} sx={{ borderRadius: 1 }}>
                      <ListItemAvatar>
                        <Avatar src={user.photoURL}>
                          {user.displayName ? user.displayName[0] : user.email[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.displayName || user.email}
                        secondary={`Registrado: ${formatDate(user.createdAt)}`}
                      />
                      <Chip 
                        label={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)} 
                        color={user.plan === 'free' ? 'default' : user.plan === 'professional' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </ListItemButton>
                  ))}
                </List>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setActiveTab(1)}
                    startIcon={<PeopleIcon />}
                  >
                    Ver todos los usuarios
                  </Button>
                </Box>
              </Card>
              
              <Card sx={{ flex: 1, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Alertas del Sistema
                </Typography>
                <List>
                  {systemAlerts.slice(0, 5).map(alert => (
                    <ListItemButton key={alert.id} sx={{ borderRadius: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: alert.type === 'error' 
                            ? 'error.main' 
                            : alert.type === 'warning' 
                              ? 'warning.main' 
                              : 'info.main' 
                        }}>
                          <WarningIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={alert.message}
                        secondary={`${alert.source} - ${formatDate(alert.timestamp)}`}
                      />
                      {!alert.resolved && (
                        <IconButton 
                          color="success" 
                          onClick={() => handleResolveSystemAlert(alert.id)}
                          size="small"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      )}
                    </ListItemButton>
                  ))}
                </List>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    variant="outlined" 
                    onClick={() => setActiveTab(8)}
                    startIcon={<WarningIcon />}
                  >
                    Ver todas las alertas
                  </Button>
                </Box>
              </Card>
            </Stack>
            
            {/* Acciones rápidas */}
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Acciones Rápidas
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<RefreshIcon />}
                  onClick={handleForceSyncData}
                  sx={{ flex: 1 }}
                >
                  Sincronizar Datos
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<NotificationsIcon />}
                  onClick={() => setNotificationDialogOpen(true)}
                  sx={{ flex: 1 }}
                >
                  Nueva Notificación
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<AssignmentIcon />}
                  onClick={() => setTaskDialogOpen(true)}
                  sx={{ flex: 1 }}
                >
                  Nueva Tarea
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<EmailIcon />}
                  onClick={() => setEmailDialogOpen(true)}
                  sx={{ flex: 1 }}
                >
                  Enviar Email
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Box>
      )}
      
      {/* Gestión de Usuarios */}
      {activeTab === 1 && (
        <Box>
          <Card sx={{ mb: 3, p: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Buscar usuarios..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ flex: 1 }}
                size="small"
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="user-role-filter-label">Rol</InputLabel>
                <Select
                  labelId="user-role-filter-label"
                  value={userRoleFilter}
                  label="Rol"
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="support">Soporte</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="user-plan-filter-label">Plan</InputLabel>
                <Select
                  labelId="user-plan-filter-label"
                  value={userPlanFilter}
                  label="Plan"
                  onChange={(e) => setUserPlanFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                startIcon={<FilterListIcon />}
                onClick={filterUsers}
              >
                Filtrar
              </Button>
            </Stack>
          </Card>
          
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Registro</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={user.photoURL}>
                              {user.displayName ? user.displayName[0] : user.email[0]}
                            </Avatar>
                            <Typography variant="body2">
                              {user.displayName || 'Sin nombre'}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={
                              user.role === 'admin' 
                                ? 'error' 
                                : user.role === 'support' 
                                  ? 'warning' 
                                  : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.plan} 
                            color={
                              user.plan === 'enterprise' 
                                ? 'secondary' 
                                : user.plan === 'professional' 
                                  ? 'primary' 
                                  : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.active ? 'Activo' : 'Inactivo'} 
                            color={user.active ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Cambiar rol">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUserDialogOpen(true);
                                }}
                              >
                                <SupervisorAccountIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={user.active ? 'Desactivar' : 'Activar'}>
                              <IconButton 
                                size="small" 
                                color={user.active ? 'error' : 'success'}
                                onClick={() => handleToggleUserActive(user.id, user.active)}
                              >
                                {user.active ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Forzar logout">
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => handleForceLogout(user.id)}
                              >
                                <ExitToAppIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Enviar email">
                              <IconButton 
                                size="small" 
                                color="info"
                                onClick={() => {
                                  setEmailData({ ...emailData, to: user.email });
                                  setEmailDialogOpen(true);
                                }}
                              >
                                <EmailIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={userRowsPerPage}
              page={userPage}
              onPageChange={(_, newPage) => setUserPage(newPage)}
              onRowsPerPageChange={(e) => {
                setUserRowsPerPage(parseInt(e.target.value, 10));
                setUserPage(0);
              }}
            />
          </Card>
        </Box>
      )}
      
      {/* Moderación de Chats */}
      {activeTab === 2 && (
        <Box>
          <Card sx={{ mb: 3, p: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Buscar chats..."
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ flex: 1 }}
                size="small"
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="chat-status-filter-label">Estado</InputLabel>
                <Select
                  labelId="chat-status-filter-label"
                  value={chatStatusFilter}
                  label="Estado"
                  onChange={(e) => setChatStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="resolved">Resueltos</MenuItem>
                  <MenuItem value="unresolved">No resueltos</MenuItem>
                  <MenuItem value="needsResponse">Requieren respuesta</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                startIcon={<FilterListIcon />}
                onClick={filterChats}
              >
                Filtrar
              </Button>
            </Stack>
          </Card>
          
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Último mensaje</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha de inicio</TableCell>
                    <TableCell>Última actualización</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredChats
                    .slice(chatPage * chatRowsPerPage, chatPage * chatRowsPerPage + chatRowsPerPage)
                    .map((chat) => (
                      <TableRow key={chat.id}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar>
                              {chat.name ? chat.name[0] : chat.email ? chat.email[0] : 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">
                                {chat.name || 'Usuario anónimo'}
                              </Typography>
                              {chat.email && (
                                <Typography variant="caption" color="text.secondary">
                                  {chat.email}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {chat.messages && chat.messages.length > 0 
                            ? chat.messages[chat.messages.length - 1].text.substring(0, 50) + '...'
                            : 'Sin mensajes'}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Chip 
                              label={chat.resolved ? 'Resuelto' : 'Activo'} 
                              color={chat.resolved ? 'success' : 'primary'}
                              size="small"
                            />
                            {chat.needsHumanResponse && (
                              <Chip 
                                label="Requiere atención" 
                                color="error"
                                size="small"
                              />
                            )}
                          </Stack>
                        </TableCell>
                        <TableCell>{formatDate(chat.createdAt)}</TableCell>
                        <TableCell>{formatDate(chat.lastUpdatedAt)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Ver chat">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => {
                                  setSelectedChat(chat);
                                  setChatDialogOpen(true);
                                }}
                              >
                                <ForumIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {!chat.resolved && (
                              <Tooltip title="Marcar como resuelto">
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleResolveChat(chat.id)}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredChats.length}
              rowsPerPage={chatRowsPerPage}
              page={chatPage}
              onPageChange={(_, newPage) => setChatPage(newPage)}
              onRowsPerPageChange={(e) => {
                setChatRowsPerPage(parseInt(e.target.value, 10));
                setChatPage(0);
              }}
            />
          </Card>
        </Box>
      )}
      
      {/* Control de Suscripciones */}
      {activeTab === 3 && (
        <Box>
          <Stack spacing={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resumen de Ingresos
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={subscriptionChartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="professional" name="Plan Profesional ($29/mes)" fill="#3f51b5" />
                    <Bar dataKey="enterprise" name="Plan Enterprise ($49/mes)" fill="#f50057" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Card>
            
            <Card sx={{ mb: 3, p: 2 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <TextField
                  placeholder="Buscar suscripciones..."
                  value={subscriptionSearch}
                  onChange={(e) => setSubscriptionSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ flex: 1 }}
                  size="small"
                />
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="subscription-status-filter-label">Estado</InputLabel>
                  <Select
                    labelId="subscription-status-filter-label"
                    value={subscriptionStatusFilter}
                    label="Estado"
                    onChange={(e) => setSubscriptionStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="active">Activas</MenuItem>
                    <MenuItem value="inactive">Inactivas</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  variant="contained" 
                  startIcon={<FilterListIcon />}
                  onClick={filterSubscriptions}
                >
                  Filtrar
                </Button>
              </Stack>
            </Card>
            
            <Card>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Plan</TableCell>
                      <TableCell>Monto</TableCell>
                      <TableCell>Fecha de inicio</TableCell>
                      <TableCell>Fecha de fin</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>ID de PayPal</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSubscriptions
                      .slice(subscriptionPage * subscriptionRowsPerPage, subscriptionPage * subscriptionRowsPerPage + subscriptionRowsPerPage)
                      .map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar>
                                {subscription.userName ? subscription.userName[0] : subscription.userEmail[0]}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">
                                  {subscription.userName || 'Sin nombre'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {subscription.userEmail}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={subscription.plan} 
                              color={subscription.plan === 'enterprise' ? 'secondary' : 'primary'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>${subscription.amount}/mes</TableCell>
                          <TableCell>{formatDate(subscription.startDate)}</TableCell>
                          <TableCell>{formatDate(subscription.endDate)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={subscription.status === 'active' ? 'Activa' : 'Inactiva'} 
                              color={subscription.status === 'active' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {subscription.paypalSubscriptionId || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              {subscription.status === 'active' ? (
                                <Tooltip title="Cancelar suscripción">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleManageSubscription(subscription.id, 'cancel')}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Reactivar suscripción">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleManageSubscription(subscription.id, 'reactivate')}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Enviar email">
                                <IconButton 
                                  size="small" 
                                  color="info"
                                  onClick={() => {
                                    setEmailData({ ...emailData, to: subscription.userEmail });
                                    setEmailDialogOpen(true);
                                  }}
                                >
                                  <EmailIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredSubscriptions.length}
                rowsPerPage={subscriptionRowsPerPage}
                page={subscriptionPage}
                onPageChange={(_, newPage) => setSubscriptionPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setSubscriptionRowsPerPage(parseInt(e.target.value, 10));
                  setSubscriptionPage(0);
                }}
              />
            </Card>
          </Stack>
        </Box>
      )}
      
      {/* Notificaciones Globales */}
      {activeTab === 4 && (
        <Box>
          <Stack spacing={3}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Notificaciones Globales
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => setNotificationDialogOpen(true)}
                >
                  Nueva Notificación
                </Button>
              </Stack>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Título</TableCell>
                      <TableCell>Mensaje</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Prioridad</TableCell>
                      <TableCell>Audiencia</TableCell>
                      <TableCell>Programada para</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Creada</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell>{notification.title}</TableCell>
                        <TableCell>{notification.message.substring(0, 50)}...</TableCell>
                        <TableCell>
                          <Chip 
                            label={notification.type}
                            color={
                              notification.type === 'error' 
                                ? 'error' 
                                : notification.type === 'warning' 
                                  ? 'warning' 
                                  : notification.type === 'success'
                                    ? 'success'
                                    : 'info'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={notification.priority} 
                            color={
                              notification.priority === 'high' 
                                ? 'error' 
                                : notification.priority === 'medium' 
                                  ? 'warning' 
                                  : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              notification.targetAudience === 'all' 
                                ? 'Todos' 
                                : notification.targetAudience === 'professional' 
                                  ? 'Profesional' 
                                  : 'Enterprise'
                            } 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {notification.scheduledFor ? formatDate(notification.scheduledFor) : 'Inmediata'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={notification.active ? 'Activa' : 'Inactiva'} 
                            color={notification.active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(notification.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
            
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Vista Previa de Notificación
              </Typography>
              <Box sx={{ mt: 2, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                <Stack spacing={2}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    bgcolor: 'background.paper',
                    boxShadow: 3
                  }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Notificación de tipo &quot;info&quot;
                    </Typography>
                    <Alert severity="info" sx={{ mb: 1 }}>
                      Esta es una notificación informativa para todos los usuarios.
                    </Alert>
                    <Typography variant="caption" color="text.secondary">
                      Enviada: Hace 2 días
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    bgcolor: 'background.paper',
                    boxShadow: 3
                  }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Notificación de tipo &quot;warning&quot;
                    </Typography>
                    <Alert severity="warning" sx={{ mb: 1 }}>
                      Advertencia: El sistema estará en mantenimiento el próximo domingo.
                    </Alert>
                    <Typography variant="caption" color="text.secondary">
                      Enviada: Hace 1 día
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    bgcolor: 'background.paper',
                    boxShadow: 3
                  }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Notificación de tipo &quot;error&quot;
                    </Typography>
                    <Alert severity="error" sx={{ mb: 1 }}>
                      Error: Se ha detectado un problema con el servicio de pagos.
                    </Alert>
                    <Typography variant="caption" color="text.secondary">
                      Enviada: Hace 3 horas
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Card>
          </Stack>
        </Box>
      )}
      
      {/* Solicitudes de Contacto */}
      {activeTab === 5 && (
        <Box>
          <Card sx={{ mb: 3, p: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Buscar solicitudes..."
                value={contactRequestSearch}
                onChange={(e) => setContactRequestSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ flex: 1 }}
                size="small"
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="contact-request-status-filter-label">Estado</InputLabel>
                <Select
                  labelId="contact-request-status-filter-label"
                  value={contactRequestStatusFilter}
                  label="Estado"
                  onChange={(e) => setContactRequestStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="pending">Pendientes</MenuItem>
                  <MenuItem value="accepted">Aceptadas</MenuItem>
                  <MenuItem value="rejected">Rechazadas</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                startIcon={<FilterListIcon />}
                onClick={filterContactRequests}
              >
                Filtrar
              </Button>
            </Stack>
          </Card>
          
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>De</TableCell>
                    <TableCell>Para</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredContactRequests
                    .slice(contactRequestPage * contactRequestRowsPerPage, contactRequestPage * contactRequestRowsPerPage + contactRequestRowsPerPage)
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar>
                              {request.fromUserName ? request.fromUserName[0] : request.fromUserEmail[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">
                                {request.fromUserName || 'Sin nombre'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {request.fromUserEmail}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar>
                              {request.toUserName ? request.toUserName[0] : request.toUserEmail[0]}
                            </Avatar>
                            <Box>
                              <Typography variant="body2">
                                {request.toUserName || 'Sin nombre'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {request.toUserEmail}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={
                              request.status === 'pending' 
                                ? 'Pendiente' 
                                : request.status === 'accepted' 
                                  ? 'Aceptada' 
                                  : 'Rechazada'
                            } 
                            color={
                              request.status === 'pending' 
                                ? 'warning' 
                                : request.status === 'accepted' 
                                  ? 'success' 
                                  : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(request.createdAt)}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            {request.status === 'pending' && (
                              <>
                                <Tooltip title="Aceptar">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleManageContactRequest(request.id, 'accept')}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Rechazar">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleManageContactRequest(request.id, 'reject')}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            <Tooltip title="Eliminar">
                              <IconButton 
                                size="small" 
                                color="default"
                                onClick={() => handleManageContactRequest(request.id, 'delete')}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredContactRequests.length}
              rowsPerPage={contactRequestRowsPerPage}
              page={contactRequestPage}
              onPageChange={(_, newPage) => setContactRequestPage(newPage)}
              onRowsPerPageChange={(e) => {
                setContactRequestRowsPerPage(parseInt(e.target.value, 10));
                setContactRequestPage(0);
              }}
            />
          </Card>
        </Box>
      )}
      
      {/* Seguimiento de Tareas */}
      {activeTab === 6 && (
        <Box>
          <Stack spacing={3}>
            <Card sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">
                  Tareas Administrativas
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => setTaskDialogOpen(true)}
                >
                  Nueva Tarea
                </Button>
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <TextField
                  placeholder="Buscar tareas..."
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ flex: 1 }}
                  size="small"
                />
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="task-status-filter-label">Estado</InputLabel>
                  <Select
                    labelId="task-status-filter-label"
                    value={taskStatusFilter}
                    label="Estado"
                    onChange={(e) => setTaskStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">Todos</MenuItem>
                    <MenuItem value="pending">Pendientes</MenuItem>
                    <MenuItem value="in-progress">En progreso</MenuItem>
                    <MenuItem value="completed">Completadas</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="task-priority-filter-label">Prioridad</InputLabel>
                  <Select
                    labelId="task-priority-filter-label"
                    value={taskPriorityFilter}
                    label="Prioridad"
                    onChange={(e) => setTaskPriorityFilter(e.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="low">Baja</MenuItem>
                    <MenuItem value="medium">Media</MenuItem>
                    <MenuItem value="high">Alta</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  variant="contained" 
                  startIcon={<FilterListIcon />}
                  onClick={filterTasks}
                >
                  Filtrar
                </Button>
              </Stack>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Título</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Asignada a</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Prioridad</TableCell>
                      <TableCell>Fecha límite</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTasks
                      .slice(taskPage * taskRowsPerPage, taskPage * taskRowsPerPage + taskRowsPerPage)
                      .map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>{task.description.substring(0, 50)}...</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar sx={{ width: 24, height: 24 }}>
                                {task.assignedToName ? task.assignedToName[0] : 'U'}
                              </Avatar>
                              <Typography variant="body2">
                                {task.assignedToName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={
                                task.status === 'pending' 
                                  ? 'Pendiente' 
                                  : task.status === 'in-progress' 
                                    ? 'En progreso' 
                                    : 'Completada'
                              } 
                              color={
                                task.status === 'pending' 
                                  ? 'default' 
                                  : task.status === 'in-progress' 
                                    ? 'primary' 
                                    : 'success'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={
                                task.priority === 'low' 
                                  ? 'Baja' 
                                  : task.priority === 'medium' 
                                    ? 'Media' 
                                    : 'Alta'
                              } 
                              color={
                                task.priority === 'low' 
                                  ? 'default' 
                                  : task.priority === 'medium' 
                                    ? 'warning' 
                                    : 'error'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(task.dueDate)}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              {task.status === 'pending' && (
                                <Tooltip title="Iniciar">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                                  >
                                    <PlayArrowIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {task.status === 'in-progress' && (
                                <Tooltip title="Completar">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {task.status === 'completed' && (
                                <Tooltip title="Reabrir">
                                  <IconButton 
                                    size="small" 
                                    color="warning"
                                    onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                                  >
                                    <RestoreIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredTasks.length}
                rowsPerPage={taskRowsPerPage}
                page={taskPage}
                onPageChange={(_, newPage) => setTaskPage(newPage)}
                onRowsPerPageChange={(e) => {
                  setTaskRowsPerPage(parseInt(e.target.value, 10));
                  setTaskPage(0);
                }}
              />
            </Card>
            
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Resumen de Tareas
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
                <Box sx={{ flex: 1, p: 2, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Pendientes
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    {tasks.filter(t => t.status === 'pending').length}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    En Progreso
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, p: 2, borderRadius: 1, bgcolor: 'background.paper', boxShadow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Completadas
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {tasks.filter(t => t.status === 'completed').length}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Box>
      )}
      
      {/* Auditoría y Logs */}
      {activeTab === 7 && (
        <Box>
          <Card sx={{ mb: 3, p: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" sx={{ flex: 1 }}>
                <TextField
                  placeholder="Buscar logs..."
                  value={auditLogSearch}
                  onChange={(e) => setAuditLogSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ flex: 1 }}
                  size="small"
                />
                
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="audit-log-action-filter-label">Acción</InputLabel>
                  <Select
                    labelId="audit-log-action-filter-label"
                    value={auditLogActionFilter}
                    label="Acción"
                    onChange={(e) => setAuditLogActionFilter(e.target.value)}
                  >
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="change_user_role">Cambio de rol</MenuItem>
                    <MenuItem value="deactivate_user">Desactivar usuario</MenuItem>
                    <MenuItem value="activate_user">Activar usuario</MenuItem>
                    <MenuItem value="force_logout">Forzar logout</MenuItem>
                    <MenuItem value="send_admin_chat_message">Mensaje de chat</MenuItem>
                    <MenuItem value="resolve_chat">Resolver chat</MenuItem>
                    <MenuItem value="cancel_subscription">Cancelar suscripción</MenuItem>
                    <MenuItem value="reactivate_subscription">Reactivar suscripción</MenuItem>
                    <MenuItem value="create_notification">Crear notificación</MenuItem>
                    <MenuItem value="create_task">Crear tarea</MenuItem>
                    <MenuItem value="update_task_status">Actualizar tarea</MenuItem>
                    <MenuItem value="force_sync_data">Sincronizar datos</MenuItem>
                    <MenuItem value="send_direct_email">Enviar email</MenuItem>
                    <MenuItem value="update_system_settings">Actualizar configuración</MenuItem>
                  </Select>
                </FormControl>
                
                <Button 
                  variant="contained" 
                  startIcon={<FilterListIcon />}
                  onClick={filterAuditLogs}
                >
                  Filtrar
                </Button>
              </Stack>
              
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                onClick={handleExportAuditLogs}
              >
                Exportar CSV
              </Button>
            </Stack>
          </Card>
          
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Acción</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Detalles</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>IP</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAuditLogs
                    .slice(auditLogPage * auditLogRowsPerPage, auditLogPage * auditLogRowsPerPage + auditLogRowsPerPage)
                    .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Chip 
                            label={log.action.replace(/_/g, ' ')} 
                            size="small"
                            color={
                              log.action.includes('delete') || log.action.includes('deactivate') || log.action.includes('cancel')
                                ? 'error'
                                : log.action.includes('create') || log.action.includes('activate') || log.action.includes('reactivate')
                                  ? 'success'
                                  : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Avatar sx={{ width: 24, height: 24 }}>
                              {log.userEmail ? log.userEmail[0] : 'U'}
                            </Avatar>
                            <Typography variant="body2">
                              {log.userEmail}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={JSON.stringify(log.details, null, 2)}>
                            <Typography variant="body2" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {JSON.stringify(log.details)}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{formatDate(log.timestamp)}</TableCell>
                        <TableCell>{log.ipAddress || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredAuditLogs.length}
              rowsPerPage={auditLogRowsPerPage}
              page={auditLogPage}
              onPageChange={(_, newPage) => setAuditLogPage(newPage)}
              onRowsPerPageChange={(e) => {
                setAuditLogRowsPerPage(parseInt(e.target.value, 10));
                setAuditLogPage(0);
              }}
            />
          </Card>
        </Box>
      )}
      
      {/* Sistema */}
      {activeTab === 8 && (
        <Box>
          <Stack spacing={3}>
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Alertas del Sistema
              </Typography>
              <List>
                {systemAlerts.map((alert) => (
                  <ListItemButton key={alert.id} sx={{ borderRadius: 1, mb: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: alert.type === 'error' 
                          ? 'error.main' 
                          : alert.type === 'warning' 
                            ? 'warning.main' 
                            : 'info.main' 
                      }}>
                        <WarningIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={alert.message}
                      secondary={`${alert.source} - ${formatDate(alert.timestamp)}`}
                    />
                    {!alert.resolved && (
                      <IconButton 
                        color="success" 
                        onClick={() => handleResolveSystemAlert(alert.id)}
                        size="small"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Card>
            
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tráfico en Tiempo Real
              </Typography>
              <Box sx={{ mt: 2, p: 3, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Typography variant="h3" color="primary">
                      {onlineUsers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usuarios en línea
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 2, height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { time: '10:00', users: 12 },
                          { time: '11:00', users: 15 },
                          { time: '12:00', users: 18 },
                          { time: '13:00', users: 22 },
                          { time: '14:00', users: 25 },
                          { time: '15:00', users: 28 },
                          { time: '16:00', users: onlineUsers },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Stack>
              </Box>
            </Card>
            
            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Configuraciones del Sistema
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={systemSettings.maintenanceMode} 
                        onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                      />
                    }
                    label="Modo Mantenimiento"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={systemSettings.registrationEnabled} 
                        onChange={(e) => setSystemSettings({ ...systemSettings, registrationEnabled: e.target.checked })}
                      />
                    }
                    label="Registro de Usuarios Habilitado"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={systemSettings.chatEnabled} 
                        onChange={(e) => setSystemSettings({ ...systemSettings, chatEnabled: e.target.checked })}
                      />
                    }
                    label="Chat en Vivo Habilitado"
                  />
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={systemSettings.notificationsEnabled} 
                        onChange={(e) => setSystemSettings({ ...systemSettings, notificationsEnabled: e.target.checked })}
                      />
                    }
                    label="Notificaciones Habilitadas"
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleUpdateSystemSettings}
                    startIcon={<SaveIcon />}
                  >
                    Guardar Configuraciones
                  </Button>
                </Stack>
              </Box>
            </Card>

            <Card sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Herramientas Administrativas
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Sincronización Forzada</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Fuerza una sincronización completa de datos entre Firestore y la aplicación. Útil cuando se detectan inconsistencias.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<RefreshIcon />}
                      onClick={handleForceSyncData}
                    >
                      Iniciar Sincronización
                    </Button>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Zona de Pruebas (Sandbox)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Permite simular eventos del sistema como nuevos registros, pagos o notificaciones sin afectar datos reales.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button 
                        variant="outlined" 
                        startIcon={<PersonAddIcon />}
                      >
                        Simular Registro
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<SubscriptionsIcon />}
                      >
                        Simular Pago
                      </Button>
                      <Button 
                        variant="outlined" 
                        startIcon={<NotificationsIcon />}
                      >
                        Simular Notificación
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Email Directo</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Envía un email directo a cualquier usuario desde el panel de administración.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<EmailIcon />}
                      onClick={() => setEmailDialogOpen(true)}
                    >
                      Enviar Email
                    </Button>
                  </AccordionDetails>
                </Accordion>
                
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Reinicio de Emergencia</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Reinicia todos los servicios del sistema en caso de emergencia. Usar solo en caso necesario.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="error"
                      startIcon={<WarningIcon />}
                    >
                      Reinicio de Emergencia
                    </Button>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Card>
          </Stack>
        </Box>
      )}
      
      {/* Diálogos */}
      
      {/* Diálogo de usuario */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)}>
        <DialogTitle>Cambiar Rol de Usuario</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Avatar src={selectedUser.photoURL} sx={{ width: 56, height: 56 }}>
                  {selectedUser.displayName ? selectedUser.displayName[0] : selectedUser.email[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedUser.displayName || 'Sin nombre'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Stack>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="change-role-label">Rol</InputLabel>
                <Select
                  labelId="change-role-label"
                  value={selectedUser.role}
                  label="Rol"
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="support">Soporte</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary">
                Cambiar el rol de un usuario afectará sus permisos y acceso a funcionalidades del sistema.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (selectedUser) {
                handleChangeUserRole(selectedUser.id, selectedUser.role);
                setUserDialogOpen(false);
              }
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de chat */}
      <Dialog 
        open={chatDialogOpen} 
        onClose={() => setChatDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Chat con {selectedChat?.name || selectedChat?.email || 'Usuario anónimo'}
            </Typography>
            {selectedChat && !selectedChat.resolved && (
              <Button 
                variant="outlined" 
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => {
                  if (selectedChat) {
                    handleResolveChat(selectedChat.id);
                    setChatDialogOpen(false);
                  }
                }}
                size="small"
              >
                Marcar como resuelto
              </Button>
            )}
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedChat && (
            <Box sx={{ pt: 1 }}>
              <Box sx={{ 
                mb: 2, 
                p: 1, 
                borderRadius: 1, 
                bgcolor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.5)' 
              }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email:
                    </Typography>
                    <Typography variant="body2">
                      {selectedChat.email || 'No proporcionado'}
                    </Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Inicio de conversación:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedChat.createdAt)}
                    </Typography>
                  </Box>
                  {selectedChat.userId && (
                    <>
                      <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Usuario registrado:
                        </Typography>
                        <Typography variant="body2">
                          Sí
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </Box>
              
              <Box sx={{ 
                height: 400, 
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                mb: 2,
                p: 2,
                borderRadius: 1,
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(241, 245, 249, 0.5)'
              }}>
                {selectedChat.messages && selectedChat.messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      alignSelf: message.sender === 'admin' ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: '16px',
                        borderTopLeftRadius: message.sender === 'admin' ? '16px' : 0,
                        borderTopRightRadius: message.sender === 'admin' ? 0 : '16px',
                        background: message.sender === 'admin' 
                          ? (isDark ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.8)')
                          : message.sender === 'user'
                            ? (isDark ? 'rgba(37, 99, 235, 0.8)' : 'rgba(59, 130, 246, 0.8)')
                            : (isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(241, 245, 249, 0.8)'),
                        color: message.sender === 'admin' || message.sender === 'user'
                          ? 'white' 
                          : 'inherit',
                      }}
                    >
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, mb: 0.5 }}>
                        {message.sender === 'admin' 
                          ? 'Agente de Soporte' 
                          : message.sender === 'user' 
                            ? (selectedChat.name || 'Usuario') 
                            : 'Bot Assuriva'}
                      </Typography>
                      <Typography variant="body2">{message.text}</Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          textAlign: message.sender === 'admin' ? 'right' : 'left',
                          mt: 0.5,
                          opacity: 0.7,
                        }}
                      >
                        {formatDate(message.timestamp)}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              
              {!selectedChat.resolved && (
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    placeholder="Escribe tu respuesta..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    multiline
                    maxRows={3}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (selectedChat && chatMessage.trim()) {
                        handleSendAdminChatMessage(selectedChat.id, chatMessage);
                      }
                    }}
                    disabled={!chatMessage.trim()}
                  >
                    Enviar
                  </Button>
                </Stack>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChatDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de notificación */}
      <Dialog 
        open={notificationDialogOpen} 
        onClose={() => setNotificationDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Nueva Notificación Global</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Título"
                fullWidth
                value={newNotification.title}
                onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                required
              />
              
              <TextField
                label="Mensaje"
                fullWidth
                multiline
                rows={4}
                value={newNotification.message}
                onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                required
              />
              
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={newNotification.type}
                  label="Tipo"
                  onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as 'info' | 'warning' | 'error' | 'success' })}
                >
                  <MenuItem value="info">Información</MenuItem>
                  <MenuItem value="warning">Advertencia</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                  <MenuItem value="success">Éxito</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={newNotification.priority}
                  label="Prioridad"
                  onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value as 'low' | 'medium' | 'high' })}
                >
                  <MenuItem value="low">Baja</MenuItem>
                  <MenuItem value="medium">Media</MenuItem>
                  <MenuItem value="high">Alta</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Audiencia</InputLabel>
                <Select
                  value={newNotification.targetAudience}
                  label="Audiencia"
                  onChange={(e) => setNewNotification({ ...newNotification, targetAudience: e.target.value as 'all' | 'professional' | 'enterprise' })}
                >
                  <MenuItem value="all">Todos los usuarios</MenuItem>
                  <MenuItem value="professional">Solo plan Profesional</MenuItem>
                  <MenuItem value="enterprise">Solo plan Enterprise</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={newNotification.active} 
                    onChange={(e) => setNewNotification({ ...newNotification, active: e.target.checked })}
                  />
                }
                label="Activa"
              />
              
              <Typography variant="subtitle2" gutterBottom>
                Vista previa:
              </Typography>
              
              <Alert severity={newNotification.type as 'error' | 'info' | 'success' | 'warning'}>
                <AlertTitle>{newNotification.title || 'Título de la notificación'}</AlertTitle>
                {newNotification.message || 'Contenido de la notificación...'}
              </Alert>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialogOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateNotification}
            disabled={!newNotification.title || !newNotification.message}
          >
            Crear Notificación
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de tarea */}
      <Dialog 
        open={taskDialogOpen} 
        onClose={() => setTaskDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Nueva Tarea Administrativa</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Título"
                fullWidth
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
              
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={4}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                required
              />
              
              <FormControl fullWidth>
                <InputLabel>Asignar a</InputLabel>
                <Select
                  value={newTask.assignedTo}
                  label="Asignar a"
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  required
                >
                  {users
                    .filter(u => u.role === 'admin' || u.role === 'support')
                    .map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.displayName || user.email}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={newTask.status}
                  label="Estado"
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as 'pending' | 'in-progress' | 'completed' })}
                >
                  <MenuItem value="pending">Pendiente</MenuItem>
                  <MenuItem value="in-progress">En progreso</MenuItem>
                  <MenuItem value="completed">Completada</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Prioridad</InputLabel>
                <Select
                  value={newTask.priority}
                  label="Prioridad"
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                >
                  <MenuItem value="low">Baja</MenuItem>
                  <MenuItem value="medium">Media</MenuItem>
                  <MenuItem value="high">Alta</MenuItem>
                </Select>
              </FormControl>
              
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DatePicker
                  label="Fecha límite"
                  value={new Date(newTask.dueDate.seconds * 1000)}
                  onChange={(newDate) => {
                    if (newDate) {
                      setNewTask({ 
                        ...newTask, 
                        dueDate: Timestamp.fromDate(newDate) 
                      });
                    }
                  }}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialogOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateTask}
            disabled={!newTask.title || !newTask.description || !newTask.assignedTo}
          >
            Crear Tarea
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Diálogo de email */}
      <Dialog 
        open={emailDialogOpen} 
        onClose={() => setEmailDialogOpen(false)}
        fullWidth
      >
        <DialogTitle>Enviar Email Directo</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <TextField
                label="Para"
                fullWidth
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                required
                type="email"
              />
              
              <TextField
                label="Asunto"
                fullWidth
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                required
              />
              
              <TextField
                label="Mensaje"
                fullWidth
                multiline
                rows={6}
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                required
              />
              
              <Typography variant="body2" color="text.secondary">
                Este email será enviado desde la cuenta oficial de Assuriva y quedará registrado en el sistema.
              </Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailDialogOpen(false)}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleSendDirectEmail}
            disabled={!emailData.to || !emailData.subject || !emailData.message}
            startIcon={<SendIcon />}
          >
            Enviar Email
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;