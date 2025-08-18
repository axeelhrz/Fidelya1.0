'use client';

import { useAuth } from '@/contexts/AuthContext';
import LeagueLayout from '@/components/leagues/LeagueLayout';
import { useEffect, useState } from 'react';
import {
  CogIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  SparklesIcon,
  LightBulbIcon,
  TagIcon,
  ClockIcon,
  ArrowsPointingOutIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { Sport, SportParameter } from '@/types';
import axios from '@/lib/axios';

interface SportParameterForm {
  param_key: string;
  param_value: string;
  param_type: 'text' | 'number' | 'boolean' | 'select';
  options?: string;
  description?: string;
  unit?: string;
  category?: string;
}

interface ParameterSuggestion {
  key: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  defaultValue: string;
  options?: string;
  unit?: string;
  category: 'dimensions' | 'equipment' | 'rules' | 'timing' | 'scoring';
  icon: string;
  validationRange?: { min: number; max: number };
}

export default function LigaSportsPage() {
  const { user } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [parameters, setParameters] = useState<SportParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [parametersLoading, setParametersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isParameterModalOpen, setIsParameterModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingParameter, setEditingParameter] = useState<SportParameter | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [parameterToDelete, setParameterToDelete] = useState<SportParameter | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'custom'>('suggestions');
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form state
  const [parameterForm, setParameterForm] = useState<SportParameterForm>({
    param_key: '',
    param_value: '',
    param_type: 'text',
    options: '',
    description: '',
    unit: '',
    category: ''
  });

  // Sugerencias inteligentes por deporte
  const getSportSuggestions = (sportCode: string): ParameterSuggestion[] => {
    const suggestions: Record<string, ParameterSuggestion[]> = {
      tennis: [
        // Dimensiones
        { key: 'court_length', name: 'Longitud de Cancha', description: 'Longitud total de la cancha de tenis', type: 'number', defaultValue: '23.77', unit: 'metros', category: 'dimensions', icon: '📏', validationRange: { min: 20, max: 30 } },
        { key: 'court_width_singles', name: 'Ancho Individual', description: 'Ancho de cancha para individuales', type: 'number', defaultValue: '8.23', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'court_width_doubles', name: 'Ancho Dobles', description: 'Ancho de cancha para dobles', type: 'number', defaultValue: '10.97', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'net_height', name: 'Altura de Red', description: 'Altura de la red en el centro', type: 'number', defaultValue: '91.4', unit: 'cm', category: 'dimensions', icon: '📏' },
        
        // Superficie y Equipamiento
        { key: 'surface_type', name: 'Tipo de Superficie', description: 'Material de la superficie de juego', type: 'select', defaultValue: 'clay', options: 'clay,grass,hard,synthetic', category: 'equipment', icon: '🏟️' },
        { key: 'ball_type', name: 'Tipo de Pelota', description: 'Tipo de pelota utilizada', type: 'select', defaultValue: 'pressurized', options: 'pressurized,pressureless,low_pressure', category: 'equipment', icon: '🎾' },
        { key: 'ball_color', name: 'Color de Pelota', description: 'Color oficial de las pelotas', type: 'select', defaultValue: 'yellow', options: 'yellow,white,orange', category: 'equipment', icon: '🎾' },
        
        // Reglas y Puntuación
        { key: 'set_format', name: 'Formato de Sets', description: 'Número de sets para ganar el partido', type: 'select', defaultValue: 'best_of_3', options: 'best_of_3,best_of_5', category: 'scoring', icon: '🏆' },
        { key: 'tiebreak_enabled', name: 'Tiebreak Activado', description: 'Si se usa tiebreak en sets empatados', type: 'boolean', defaultValue: 'true', category: 'rules', icon: '⚖️' },
        { key: 'tiebreak_points', name: 'Puntos de Tiebreak', description: 'Puntos necesarios para ganar tiebreak', type: 'number', defaultValue: '7', category: 'scoring', icon: '🎯' },
        
        // Tiempo
        { key: 'serve_clock', name: 'Tiempo de Saque', description: 'Tiempo máximo entre puntos', type: 'number', defaultValue: '25', unit: 'segundos', category: 'timing', icon: '⏱️' },
        { key: 'changeover_time', name: 'Tiempo de Cambio', description: 'Tiempo de descanso en cambios de lado', type: 'number', defaultValue: '90', unit: 'segundos', category: 'timing', icon: '⏱️' }
      ],

      table_tennis: [
        // Dimensiones
        { key: 'table_length', name: 'Longitud de Mesa', description: 'Longitud oficial de la mesa', type: 'number', defaultValue: '274', unit: 'cm', category: 'dimensions', icon: '📏' },
        { key: 'table_width', name: 'Ancho de Mesa', description: 'Ancho oficial de la mesa', type: 'number', defaultValue: '152.5', unit: 'cm', category: 'dimensions', icon: '📏' },
        { key: 'table_height', name: 'Altura de Mesa', description: 'Altura desde el suelo', type: 'number', defaultValue: '76', unit: 'cm', category: 'dimensions', icon: '📏' },
        { key: 'net_height', name: 'Altura de Red', description: 'Altura de la red', type: 'number', defaultValue: '15.25', unit: 'cm', category: 'dimensions', icon: '📏' },
        { key: 'net_length', name: 'Longitud de Red', description: 'Longitud total de la red', type: 'number', defaultValue: '183', unit: 'cm', category: 'dimensions', icon: '📏' },
        
        // Equipamiento
        { key: 'ball_diameter', name: 'Diámetro de Pelota', description: 'Diámetro oficial de la pelota', type: 'number', defaultValue: '40', unit: 'mm', category: 'equipment', icon: '🏓' },
        { key: 'ball_weight', name: 'Peso de Pelota', description: 'Peso oficial de la pelota', type: 'number', defaultValue: '2.7', unit: 'gramos', category: 'equipment', icon: '🏓' },
        { key: 'ball_color', name: 'Color de Pelota', description: 'Color oficial de las pelotas', type: 'select', defaultValue: 'white', options: 'white,orange', category: 'equipment', icon: '🏓' },
        { key: 'ball_material', name: 'Material de Pelota', description: 'Material de fabricación', type: 'select', defaultValue: 'celluloid', options: 'celluloid,plastic', category: 'equipment', icon: '🏓' },
        
        // Puntuación y Reglas
        { key: 'points_per_game', name: 'Puntos por Juego', description: 'Puntos necesarios para ganar un juego', type: 'number', defaultValue: '11', category: 'scoring', icon: '🎯' },
        { key: 'games_per_match', name: 'Juegos por Partido', description: 'Formato del partido', type: 'select', defaultValue: 'best_of_7', options: 'best_of_3,best_of_5,best_of_7', category: 'scoring', icon: '🏆' },
        { key: 'deuce_rule', name: 'Regla de Deuce', description: 'Diferencia mínima para ganar en empate', type: 'number', defaultValue: '2', category: 'rules', icon: '⚖️' },
        
        // Tiempo
        { key: 'timeout_duration', name: 'Duración de Timeout', description: 'Tiempo de timeout por jugador', type: 'number', defaultValue: '60', unit: 'segundos', category: 'timing', icon: '⏱️' },
        { key: 'interval_between_games', name: 'Intervalo entre Juegos', description: 'Descanso entre juegos', type: 'number', defaultValue: '60', unit: 'segundos', category: 'timing', icon: '⏱️' }
      ],

      padel: [
        // Dimensiones
        { key: 'court_length', name: 'Longitud de Cancha', description: 'Longitud total de la cancha', type: 'number', defaultValue: '20', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'court_width', name: 'Ancho de Cancha', description: 'Ancho total de la cancha', type: 'number', defaultValue: '10', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'back_wall_height', name: 'Altura Pared Fondo', description: 'Altura de las paredes de fondo', type: 'number', defaultValue: '4', unit: 'metros', category: 'dimensions', icon: '🧱' },
        { key: 'side_wall_height', name: 'Altura Pared Lateral', description: 'Altura de las paredes laterales', type: 'number', defaultValue: '3', unit: 'metros', category: 'dimensions', icon: '🧱' },
        { key: 'net_height_center', name: 'Altura Red Centro', description: 'Altura de la red en el centro', type: 'number', defaultValue: '88', unit: 'cm', category: 'dimensions', icon: '📏' },
        { key: 'net_height_posts', name: 'Altura Red Postes', description: 'Altura de la red en los postes', type: 'number', defaultValue: '92', unit: 'cm', category: 'dimensions', icon: '📏' },
        
        // Superficie y Equipamiento
        { key: 'surface_type', name: 'Tipo de Superficie', description: 'Material de la superficie', type: 'select', defaultValue: 'artificial_grass', options: 'artificial_grass,concrete,synthetic', category: 'equipment', icon: '🏟️' },
        { key: 'ball_pressure', name: 'Presión de Pelota', description: 'Nivel de presión de las pelotas', type: 'select', defaultValue: 'low_pressure', options: 'low_pressure,medium_pressure,depressurized', category: 'equipment', icon: '🎾' },
        { key: 'wall_material', name: 'Material de Paredes', description: 'Material de construcción de paredes', type: 'select', defaultValue: 'glass', options: 'glass,concrete,mesh', category: 'equipment', icon: '🧱' },
        
        // Reglas
        { key: 'scoring_system', name: 'Sistema de Puntuación', description: 'Sistema de puntuación utilizado', type: 'select', defaultValue: 'tennis_scoring', options: 'tennis_scoring,point_scoring', category: 'scoring', icon: '🎯' },
        { key: 'sets_per_match', name: 'Sets por Partido', description: 'Número de sets para ganar', type: 'select', defaultValue: 'best_of_3', options: 'best_of_3,best_of_5', category: 'scoring', icon: '🏆' },
        { key: 'golden_point', name: 'Punto de Oro', description: 'Uso del punto de oro en deuce', type: 'boolean', defaultValue: 'true', category: 'rules', icon: '🥇' }
      ],

      pickleball: [
        // Dimensiones
        { key: 'court_length', name: 'Longitud de Cancha', description: 'Longitud total en pies', type: 'number', defaultValue: '44', unit: 'pies', category: 'dimensions', icon: '📏' },
        { key: 'court_width', name: 'Ancho de Cancha', description: 'Ancho total en pies', type: 'number', defaultValue: '20', unit: 'pies', category: 'dimensions', icon: '📏' },
        { key: 'net_height_center', name: 'Altura Red Centro', description: 'Altura en el centro', type: 'number', defaultValue: '34', unit: 'pulgadas', category: 'dimensions', icon: '📏' },
        { key: 'net_height_posts', name: 'Altura Red Postes', description: 'Altura en los postes', type: 'number', defaultValue: '36', unit: 'pulgadas', category: 'dimensions', icon: '📏' },
        { key: 'non_volley_zone', name: 'Zona de No-Volea', description: 'Distancia desde la red', type: 'number', defaultValue: '7', unit: 'pies', category: 'dimensions', icon: '📏' },
        
        // Equipamiento
        { key: 'ball_type', name: 'Tipo de Pelota', description: 'Material de la pelota', type: 'select', defaultValue: 'plastic', options: 'plastic,composite', category: 'equipment', icon: '🏓' },
        { key: 'ball_holes', name: 'Agujeros en Pelota', description: 'Número de agujeros', type: 'select', defaultValue: '26', options: '26,32,40', category: 'equipment', icon: '🏓' },
        { key: 'ball_diameter', name: 'Diámetro de Pelota', description: 'Diámetro en pulgadas', type: 'number', defaultValue: '2.87', unit: 'pulgadas', category: 'equipment', icon: '🏓' },
        { key: 'paddle_material', name: 'Material de Pala', description: 'Material permitido para palas', type: 'select', defaultValue: 'composite', options: 'wood,composite,graphite', category: 'equipment', icon: '🏓' },
        
        // Reglas y Puntuación
        { key: 'points_to_win', name: 'Puntos para Ganar', description: 'Puntos necesarios para ganar', type: 'select', defaultValue: '11', options: '11,15,21', category: 'scoring', icon: '🎯' },
        { key: 'win_by_margin', name: 'Margen de Victoria', description: 'Diferencia mínima para ganar', type: 'number', defaultValue: '2', category: 'scoring', icon: '🎯' },
        { key: 'serve_style', name: 'Estilo de Saque', description: 'Tipo de saque permitido', type: 'select', defaultValue: 'underhand', options: 'underhand,overhand', category: 'rules', icon: '🏓' },
        { key: 'double_bounce_rule', name: 'Regla Doble Rebote', description: 'Aplicar regla de doble rebote', type: 'boolean', defaultValue: 'true', category: 'rules', icon: '⚖️' }
      ],

      badminton: [
        // Dimensiones
        { key: 'court_length', name: 'Longitud de Cancha', description: 'Longitud total', type: 'number', defaultValue: '13.4', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'court_width_singles', name: 'Ancho Individual', description: 'Ancho para individuales', type: 'number', defaultValue: '5.18', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'court_width_doubles', name: 'Ancho Dobles', description: 'Ancho para dobles', type: 'number', defaultValue: '6.1', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'net_height', name: 'Altura de Red', description: 'Altura en el centro', type: 'number', defaultValue: '1.524', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'service_court_length', name: 'Longitud Área Saque', description: 'Longitud del área de saque', type: 'number', defaultValue: '3.96', unit: 'metros', category: 'dimensions', icon: '📏' },
        
        // Equipamiento
        { key: 'shuttlecock_type', name: 'Tipo de Volante', description: 'Material del volante', type: 'select', defaultValue: 'feather', options: 'feather,synthetic,plastic', category: 'equipment', icon: '🏸' },
        { key: 'shuttlecock_speed', name: 'Velocidad de Volante', description: 'Clasificación de velocidad', type: 'select', defaultValue: 'medium', options: 'slow,medium,fast', category: 'equipment', icon: '🏸' },
        { key: 'shuttlecock_weight', name: 'Peso de Volante', description: 'Peso en gramos', type: 'number', defaultValue: '5.1', unit: 'gramos', category: 'equipment', icon: '🏸' },
        
        // Puntuación y Reglas
        { key: 'points_per_game', name: 'Puntos por Juego', description: 'Puntos para ganar un juego', type: 'number', defaultValue: '21', category: 'scoring', icon: '🎯' },
        { key: 'games_per_match', name: 'Juegos por Partido', description: 'Formato del partido', type: 'select', defaultValue: 'best_of_3', options: 'best_of_3,best_of_5', category: 'scoring', icon: '🏆' },
        { key: 'scoring_system', name: 'Sistema de Puntuación', description: 'Tipo de sistema de puntos', type: 'select', defaultValue: 'rally_point', options: 'rally_point,traditional', category: 'scoring', icon: '🎯' },
        { key: 'deuce_points', name: 'Puntos de Deuce', description: 'Puntos donde aplica deuce', type: 'number', defaultValue: '20', category: 'rules', icon: '⚖️' }
      ],

      handball: [
        // Dimensiones
        { key: 'court_length', name: 'Longitud de Cancha', description: 'Longitud total de la cancha', type: 'number', defaultValue: '40', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'court_width', name: 'Ancho de Cancha', description: 'Ancho total de la cancha', type: 'number', defaultValue: '20', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'goal_width', name: 'Ancho de Portería', description: 'Ancho interno de la portería', type: 'number', defaultValue: '3', unit: 'metros', category: 'dimensions', icon: '🥅' },
        { key: 'goal_height', name: 'Altura de Portería', description: 'Altura interna de la portería', type: 'number', defaultValue: '2', unit: 'metros', category: 'dimensions', icon: '🥅' },
        { key: 'goal_area_radius', name: 'Radio Área Portería', description: 'Radio del área de portería', type: 'number', defaultValue: '6', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'free_throw_line', name: 'Línea Tiro Libre', description: 'Distancia línea de tiro libre', type: 'number', defaultValue: '9', unit: 'metros', category: 'dimensions', icon: '📏' },
        { key: 'penalty_line', name: 'Línea de Penalti', description: 'Distancia línea de 7 metros', type: 'number', defaultValue: '7', unit: 'metros', category: 'dimensions', icon: '📏' },
        
        // Equipamiento
        { key: 'ball_size', name: 'Tamaño de Pelota', description: 'Categoría de tamaño', type: 'select', defaultValue: '3', options: '0,1,2,3', category: 'equipment', icon: '🤾' },
        { key: 'ball_circumference', name: 'Circunferencia Pelota', description: 'Circunferencia en cm', type: 'number', defaultValue: '58', unit: 'cm', category: 'equipment', icon: '🤾' },
        { key: 'ball_weight', name: 'Peso de Pelota', description: 'Peso en gramos', type: 'number', defaultValue: '425', unit: 'gramos', category: 'equipment', icon: '🤾' },
        
        // Reglas y Tiempo
        { key: 'players_per_team', name: 'Jugadores por Equipo', description: 'Número de jugadores en cancha', type: 'number', defaultValue: '7', category: 'rules', icon: '👥' },
        { key: 'match_duration', name: 'Duración del Partido', description: 'Tiempo total en minutos', type: 'number', defaultValue: '60', unit: 'minutos', category: 'timing', icon: '⏱️' },
        { key: 'half_time_duration', name: 'Duración Medio Tiempo', description: 'Tiempo de cada mitad', type: 'number', defaultValue: '30', unit: 'minutos', category: 'timing', icon: '⏱️' },
        { key: 'timeout_per_team', name: 'Timeouts por Equipo', description: 'Número de timeouts permitidos', type: 'number', defaultValue: '3', category: 'rules', icon: '⏸️' },
        { key: 'timeout_duration', name: 'Duración Timeout', description: 'Duración de cada timeout', type: 'number', defaultValue: '60', unit: 'segundos', category: 'timing', icon: '⏱️' }
      ],

      racquetball: [
        // Dimensiones
        { key: 'court_length', name: 'Longitud de Cancha', description: 'Longitud total', type: 'number', defaultValue: '40', unit: 'pies', category: 'dimensions', icon: '📏' },
        { key: 'court_width', name: 'Ancho de Cancha', description: 'Ancho total', type: 'number', defaultValue: '20', unit: 'pies', category: 'dimensions', icon: '📏' },
        { key: 'court_height', name: 'Altura de Cancha', description: 'Altura del techo', type: 'number', defaultValue: '20', unit: 'pies', category: 'dimensions', icon: '📏' },
        { key: 'service_line', name: 'Línea de Saque', description: 'Distancia línea de saque', type: 'number', defaultValue: '15', unit: 'pies', category: 'dimensions', icon: '📏' },
        { key: 'short_line', name: 'Línea Corta', description: 'Línea corta de saque', type: 'number', defaultValue: '20', unit: 'pies', category: 'dimensions', icon: '📏' },
        { key: 'safety_zone', name: 'Zona de Seguridad', description: 'Zona de seguridad tras saque', type: 'number', defaultValue: '5', unit: 'pies', category: 'dimensions', icon: '📏' },
        
        // Equipamiento
        { key: 'ball_type', name: 'Tipo de Pelota', description: 'Clasificación de velocidad', type: 'select', defaultValue: 'blue', options: 'blue,red,green,black', category: 'equipment', icon: '🎾' },
        { key: 'ball_diameter', name: 'Diámetro de Pelota', description: 'Diámetro en pulgadas', type: 'number', defaultValue: '2.25', unit: 'pulgadas', category: 'equipment', icon: '🎾' },
        { key: 'ball_bounce_height', name: 'Altura de Rebote', description: 'Altura de rebote desde 100 pulgadas', type: 'number', defaultValue: '68', unit: 'pulgadas', category: 'equipment', icon: '🎾' },
        { key: 'racquet_length_max', name: 'Longitud Máx. Raqueta', description: 'Longitud máxima permitida', type: 'number', defaultValue: '22', unit: 'pulgadas', category: 'equipment', icon: '🎾' },
        
        // Puntuación y Reglas
        { key: 'points_to_win', name: 'Puntos para Ganar', description: 'Puntos necesarios para ganar', type: 'select', defaultValue: '15', options: '11,15,21', category: 'scoring', icon: '🎯' },
        { key: 'games_per_match', name: 'Juegos por Partido', description: 'Formato del partido', type: 'select', defaultValue: 'best_of_3', options: 'best_of_3,best_of_5', category: 'scoring', icon: '🏆' },
        { key: 'serve_style', name: 'Estilo de Saque', description: 'Tipo de saque permitido', type: 'select', defaultValue: 'drive', options: 'drive,lob,z_serve,jam', category: 'rules', icon: '🎾' },
        { key: 'timeout_per_game', name: 'Timeouts por Juego', description: 'Número de timeouts permitidos', type: 'number', defaultValue: '3', category: 'rules', icon: '⏸️' }
      ]
    };

    return suggestions[sportCode] || [];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dimensions': return <ArrowsPointingOutIcon className="h-4 w-4" />;
      case 'equipment': return <CubeIcon className="h-4 w-4" />;
      case 'rules': return <TagIcon className="h-4 w-4" />;
      case 'timing': return <ClockIcon className="h-4 w-4" />;
      case 'scoring': return <span className="text-sm">🎯</span>;
      default: return <CogIcon className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'dimensions': return 'Dimensiones';
      case 'equipment': return 'Equipamiento';
      case 'rules': return 'Reglas';
      case 'timing': return 'Tiempo';
      case 'scoring': return 'Puntuación';
      default: return 'General';
    }
  };

  // ... (resto de las funciones existentes como fetchSports, fetchParameters, etc.)

  const openCreateModal = () => {
    resetForm();
    setIsEditMode(false);
    setActiveTab('suggestions');
    setSuggestionSearch('');
    setSelectedCategory('all');
    setIsParameterModalOpen(true);
  };

  const selectSuggestion = (suggestion: ParameterSuggestion) => {
    setParameterForm({
      param_key: suggestion.key,
      param_value: suggestion.defaultValue,
      param_type: suggestion.type,
      options: suggestion.options || '',
      description: suggestion.description,
      unit: suggestion.unit || '',
      category: suggestion.category
    });
    setActiveTab('custom');
  };

  const filteredSuggestions = selectedSport ? getSportSuggestions(selectedSport.code).filter(suggestion => {
    const matchesSearch = suggestion.name.toLowerCase().includes(suggestionSearch.toLowerCase()) ||
                         suggestion.description.toLowerCase().includes(suggestionSearch.toLowerCase()) ||
                         suggestion.key.toLowerCase().includes(suggestionSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory;
    
    // Filtrar sugerencias que ya están configuradas
    const alreadyConfigured = parameters.some(param => param.param_key === suggestion.key);
    
    return matchesSearch && matchesCategory && !alreadyConfigured;
  }) : [];

  const categories = ['all', 'dimensions', 'equipment', 'rules', 'timing', 'scoring'];

  // ... (resto del JSX con las mejoras del modal)

// (Bloque de return duplicado eliminado; las funciones y el único return permanecen más abajo)

// ... (continuación del código anterior)

  useEffect(() => {
    fetchSports();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      fetchParameters(selectedSport.id);
    }
  }, [selectedSport]);

  const fetchSports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/sports');
      
      if (response.data && response.data.data) {
        const sportsData = response.data.data.data || response.data.data;
        setSports(sportsData);
        
        // Auto-select first sport if none selected
        if (sportsData.length > 0 && !selectedSport) {
          setSelectedSport(sportsData[0]);
        }
      }
    } catch (error: any) {
      console.error('Error fetching sports:', error);
      setError(error.response?.data?.message || 'Error al cargar deportes');
    } finally {
      setLoading(false);
    }
  };

  const fetchParameters = async (sportId: number) => {
    try {
      setParametersLoading(true);
      const response = await axios.get(`/api/sports/${sportId}/parameters`);
      
      if (response.data && response.data.data) {
        setParameters(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching parameters:', error);
      setParameters([]);
    } finally {
      setParametersLoading(false);
    }
  };

  const handleCreateParameter = async () => {
    if (!selectedSport) return;
    
    try {
      setIsProcessing(true);
      
      const response = await axios.post(`/api/sports/${selectedSport.id}/parameters`, parameterForm);
      
      if (response.data) {
        await fetchParameters(selectedSport.id);
        setIsParameterModalOpen(false);
        resetForm();
        alert('Parámetro creado exitosamente');
      }
    } catch (error: any) {
      console.error('Error creating parameter:', error);
      alert(error.response?.data?.message || 'Error al crear parámetro');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateParameter = async () => {
    if (!selectedSport || !editingParameter) return;
    
    try {
      setIsProcessing(true);
      
      const response = await axios.put(`/api/sports/${selectedSport.id}/parameters/${editingParameter.id}`, parameterForm);
      
      if (response.data) {
        await fetchParameters(selectedSport.id);
        setIsParameterModalOpen(false);
        setIsEditMode(false);
        setEditingParameter(null);
        resetForm();
        alert('Parámetro actualizado exitosamente');
      }
    } catch (error: any) {
      console.error('Error updating parameter:', error);
      alert(error.response?.data?.message || 'Error al actualizar parámetro');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteParameter = async () => {
    if (!selectedSport || !parameterToDelete) return;
    
    try {
      setIsProcessing(true);
      
      await axios.delete(`/api/sports/${selectedSport.id}/parameters/${parameterToDelete.id}`);
      
      await fetchParameters(selectedSport.id);
      setIsDeleteModalOpen(false);
      setParameterToDelete(null);
      alert('Parámetro eliminado exitosamente');
    } catch (error: any) {
      console.error('Error deleting parameter:', error);
      alert(error.response?.data?.message || 'Error al eliminar parámetro');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoConfigureSport = async () => {
    if (!selectedSport) return;
    
    const autoConfigs = getAutoConfiguration(selectedSport.code);
    
    if (autoConfigs.length === 0) {
      alert('No hay configuración automática disponible para este deporte');
      return;
    }
    
    try {
      setIsProcessing(true);
      
      let successCount = 0;
      let errorCount = 0;
      
      // Create all parameters for this sport
      for (const config of autoConfigs) {
        try {
          await axios.post(`/api/sports/${selectedSport.id}/parameters`, config);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error('Error creating parameter:', config.param_key, error);
        }
      }
      
      await fetchParameters(selectedSport.id);
      
      if (errorCount === 0) {
        alert(`Configuración automática aplicada exitosamente para ${selectedSport.name}. ${successCount} parámetros configurados.`);
      } else {
        alert(`Configuración parcialmente aplicada: ${successCount} parámetros configurados, ${errorCount} errores.`);
      }
    } catch (error: any) {
      console.error('Error auto-configuring sport:', error);
      alert('Error en la configuración automática');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAutoConfiguration = (sportCode: string): SportParameterForm[] => {
    // Configuración básica para auto-configurar (versión simplificada)
    const configs: Record<string, SportParameterForm[]> = {
      tennis: [
        { param_key: 'court_length', param_value: '23.77', param_type: 'number', description: 'Longitud total de la cancha', unit: 'metros', category: 'dimensions' },
        { param_key: 'court_width_singles', param_value: '8.23', param_type: 'number', description: 'Ancho para individuales', unit: 'metros', category: 'dimensions' },
        { param_key: 'net_height', param_value: '91.4', param_type: 'number', description: 'Altura de la red en el centro', unit: 'cm', category: 'dimensions' },
        { param_key: 'surface_type', param_value: 'clay', param_type: 'select', options: 'clay,grass,hard,synthetic', description: 'Tipo de superficie', category: 'equipment' },
        { param_key: 'set_format', param_value: 'best_of_3', param_type: 'select', options: 'best_of_3,best_of_5', description: 'Formato de sets', category: 'scoring' }
      ],
      table_tennis: [
        { param_key: 'table_length', param_value: '274', param_type: 'number', description: 'Longitud de la mesa', unit: 'cm', category: 'dimensions' },
        { param_key: 'table_width', param_value: '152.5', param_type: 'number', description: 'Ancho de la mesa', unit: 'cm', category: 'dimensions' },
        { param_key: 'net_height', param_value: '15.25', param_type: 'number', description: 'Altura de la red', unit: 'cm', category: 'dimensions' },
        { param_key: 'ball_color', param_value: 'white', param_type: 'select', options: 'white,orange', description: 'Color de la pelota', category: 'equipment' },
        { param_key: 'points_per_game', param_value: '11', param_type: 'number', description: 'Puntos por juego', category: 'scoring' }
      ],
      padel: [
        { param_key: 'court_length', param_value: '20', param_type: 'number', description: 'Longitud de la cancha', unit: 'metros', category: 'dimensions' },
        { param_key: 'court_width', param_value: '10', param_type: 'number', description: 'Ancho de la cancha', unit: 'metros', category: 'dimensions' },
        { param_key: 'back_wall_height', param_value: '4', param_type: 'number', description: 'Altura pared de fondo', unit: 'metros', category: 'dimensions' },
        { param_key: 'ball_pressure', param_value: 'low_pressure', param_type: 'select', options: 'low_pressure,medium_pressure', description: 'Presión de pelota', category: 'equipment' },
        { param_key: 'scoring_system', param_value: 'tennis_scoring', param_type: 'select', options: 'tennis_scoring,point_scoring', description: 'Sistema de puntuación', category: 'scoring' }
      ],
      pickleball: [
        { param_key: 'court_length', param_value: '44', param_type: 'number', description: 'Longitud de cancha', unit: 'pies', category: 'dimensions' },
        { param_key: 'court_width', param_value: '20', param_type: 'number', description: 'Ancho de cancha', unit: 'pies', category: 'dimensions' },
        { param_key: 'net_height_center', param_value: '34', param_type: 'number', description: 'Altura red en centro', unit: 'pulgadas', category: 'dimensions' },
        { param_key: 'non_volley_zone', param_value: '7', param_type: 'number', description: 'Zona de no-volea', unit: 'pies', category: 'dimensions' },
        { param_key: 'points_to_win', param_value: '11', param_type: 'select', options: '11,15,21', description: 'Puntos para ganar', category: 'scoring' }
      ],
      badminton: [
        { param_key: 'court_length', param_value: '13.4', param_type: 'number', description: 'Longitud de cancha', unit: 'metros', category: 'dimensions' },
        { param_key: 'court_width_singles', param_value: '5.18', param_type: 'number', description: 'Ancho individuales', unit: 'metros', category: 'dimensions' },
        { param_key: 'net_height', param_value: '1.524', param_type: 'number', description: 'Altura de red', unit: 'metros', category: 'dimensions' },
        { param_key: 'shuttlecock_type', param_value: 'feather', param_type: 'select', options: 'feather,synthetic', description: 'Tipo de volante', category: 'equipment' },
        { param_key: 'points_per_game', param_value: '21', param_type: 'number', description: 'Puntos por juego', category: 'scoring' }
      ],
      handball: [
        { param_key: 'court_length', param_value: '40', param_type: 'number', description: 'Longitud de cancha', unit: 'metros', category: 'dimensions' },
        { param_key: 'court_width', param_value: '20', param_type: 'number', description: 'Ancho de cancha', unit: 'metros', category: 'dimensions' },
        { param_key: 'goal_width', param_value: '3', param_type: 'number', description: 'Ancho de portería', unit: 'metros', category: 'dimensions' },
        { param_key: 'goal_height', param_value: '2', param_type: 'number', description: 'Altura de portería', unit: 'metros', category: 'dimensions' },
        { param_key: 'players_per_team', param_value: '7', param_type: 'number', description: 'Jugadores por equipo', category: 'rules' },
        { param_key: 'match_duration', param_value: '60', param_type: 'number', description: 'Duración del partido', unit: 'minutos', category: 'timing' }
      ],
      racquetball: [
        { param_key: 'court_length', param_value: '40', param_type: 'number', description: 'Longitud de cancha', unit: 'pies', category: 'dimensions' },
        { param_key: 'court_width', param_value: '20', param_type: 'number', description: 'Ancho de cancha', unit: 'pies', category: 'dimensions' },
        { param_key: 'court_height', param_value: '20', param_type: 'number', description: 'Altura de cancha', unit: 'pies', category: 'dimensions' },
        { param_key: 'ball_type', param_value: 'blue', param_type: 'select', options: 'blue,red,green,black', description: 'Tipo de pelota', category: 'equipment' },
        { param_key: 'points_to_win', param_value: '15', param_type: 'select', options: '11,15,21', description: 'Puntos para ganar', category: 'scoring' }
      ]
    };

    return configs[sportCode] || [];
  };

  const openEditModal = (parameter: SportParameter) => {
    setParameterForm({
      param_key: parameter.param_key,
      param_value: parameter.param_value,
      param_type: parameter.param_type as any,
      options: parameter.options || '',
      description: parameter.description || '',
      unit: parameter.unit || '',
      category: parameter.category || ''
    });
    setEditingParameter(parameter);
    setIsEditMode(true);
    setIsParameterModalOpen(true);
  };

  const openDeleteModal = (parameter: SportParameter) => {
    setParameterToDelete(parameter);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setParameterForm({
      param_key: '',
      param_value: '',
      param_type: 'text',
      options: '',
      description: '',
      unit: '',
      category: ''
    });
  };

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sport.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <LeagueLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
        </div>
      </LeagueLayout>
    );
  }

  return (
    <LeagueLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CogIcon className="h-8 w-8 text-yellow-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Configuración de Deportes
                </h1>
                <p className="text-gray-600">
                  Gestiona los parámetros específicos de cada deporte con sugerencias inteligentes
                </p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sports List Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Deportes</h2>
                <span className="text-sm text-gray-500">{sports.length} deportes</span>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar deportes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              {/* Sports List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredSports.map((sport) => (
                  <div
                    key={sport.id}
                    onClick={() => setSelectedSport(sport)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSport?.id === sport.id
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{sport.name}</h3>
                        <p className="text-sm text-gray-500">Código: {sport.code}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {parameters.length > 0 && selectedSport?.id === sport.id && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {parameters.length} parámetros
                          </span>
                        )}
                        <CogIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Parameters Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              {selectedSport ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        Parámetros de {selectedSport.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Configura los parámetros específicos para este deporte
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAutoConfigureSport}
                        disabled={isProcessing}
                        className="inline-flex items-center px-3 py-2 border border-yellow-300 text-sm font-medium rounded-lg text-yellow-700 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-50"
                      >
                        <SparklesIcon className="h-4 w-4 mr-2" />
                        Auto-configurar
                      </button>
                      <button
                        onClick={openCreateModal}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Agregar Parámetro
                      </button>
                    </div>
                  </div>

                  {parametersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Cargando parámetros...</p>
                    </div>
                  ) : parameters.length === 0 ? (
                    <div className="text-center py-8">
                      <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Sin parámetros configurados
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Este deporte no tiene parámetros configurados aún.
                      </p>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={handleAutoConfigureSport}
                          disabled={isProcessing}
                          className="inline-flex items-center px-4 py-2 border border-yellow-300 text-sm font-medium rounded-lg text-yellow-700 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-50"
                        >
                          <SparklesIcon className="h-4 w-4 mr-2" />
                          Auto-configurar
                        </button>
                        <button
                          onClick={openCreateModal}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Agregar Manualmente
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {parameters.map((parameter) => (
                        <div
                          key={parameter.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-medium text-gray-900">
                                  {parameter.param_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </h4>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  parameter.param_type === 'text' ? 'bg-blue-100 text-blue-800' :
                                  parameter.param_type === 'number' ? 'bg-green-100 text-green-800' :
                                  parameter.param_type === 'boolean' ? 'bg-purple-100 text-purple-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {parameter.param_type}
                                </span>
                                {parameter.unit && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {parameter.unit}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-900 mb-1">
                                <strong>Valor:</strong> {parameter.param_value}
                              </p>
                              {parameter.options && (
                                <p className="text-sm text-gray-600 mb-1">
                                  <strong>Opciones:</strong> {parameter.options}
                                </p>
                              )}
                              {parameter.description && (
                                <p className="text-sm text-gray-600">
                                  {parameter.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => openEditModal(parameter)}
                                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(parameter)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un deporte
                  </h3>
                  <p className="text-gray-600">
                    Elige un deporte de la lista para configurar sus parámetros.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal mejorado con pestañas - ya incluido en el código anterior */}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && parameterToDelete && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Eliminar Parámetro
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  ¿Estás seguro de que deseas eliminar el parámetro "{parameterToDelete.param_key}"? 
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    disabled={isProcessing}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteParameter}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isProcessing ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LeagueLayout>
  );
}
