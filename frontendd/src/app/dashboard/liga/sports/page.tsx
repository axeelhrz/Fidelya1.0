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
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Sport, SportParameter } from '@/types';
import axios from '@/lib/axios';

interface SportParameterForm {
  param_key: string;
  param_value: string;
  param_type: 'text' | 'number' | 'boolean' | 'select';
  options?: string;
  description?: string;
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

  // Form state
  const [parameterForm, setParameterForm] = useState<SportParameterForm>({
    param_key: '',
    param_value: '',
    param_type: 'text',
    options: '',
    description: ''
  });

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
    
    try {
      setIsProcessing(true);
      
      // Create all parameters for this sport
      for (const config of autoConfigs) {
        await axios.post(`/api/sports/${selectedSport.id}/parameters`, config);
      }
      
      await fetchParameters(selectedSport.id);
      alert(`Configuración automática aplicada para ${selectedSport.name}`);
    } catch (error: any) {
      console.error('Error auto-configuring sport:', error);
      alert(error.response?.data?.message || 'Error en la configuración automática');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAutoConfiguration = (sportCode: string): SportParameterForm[] => {
    const configs: Record<string, SportParameterForm[]> = {
      tennis: [
        { param_key: 'court_type', param_value: 'clay', param_type: 'select', options: 'clay,grass,hard,synthetic', description: 'Tipo de superficie de la cancha' },
        { param_key: 'set_format', param_value: 'best_of_3', param_type: 'select', options: 'best_of_3,best_of_5', description: 'Formato de sets' },
        { param_key: 'tiebreak', param_value: 'true', param_type: 'boolean', description: 'Usar tiebreak' },
        { param_key: 'serve_clock', param_value: '25', param_type: 'number', description: 'Tiempo de saque en segundos' },
        { param_key: 'balls_per_set', param_value: '6', param_type: 'number', description: 'Pelotas nuevas por set' }
      ],
      table_tennis: [
        { param_key: 'ball_color', param_value: 'white', param_type: 'select', options: 'white,orange', description: 'Color de la pelota' },
        { param_key: 'table_size', param_value: '274x152.5', param_type: 'text', description: 'Tamaño de mesa (cm)' },
        { param_key: 'net_height', param_value: '15.25', param_type: 'number', description: 'Altura de la red (cm)' },
        { param_key: 'game_format', param_value: 'best_of_7', param_type: 'select', options: 'best_of_5,best_of_7', description: 'Formato del juego' },
        { param_key: 'points_per_set', param_value: '11', param_type: 'number', description: 'Puntos por set' }
      ],
      padel: [
        { param_key: 'court_size', param_value: '20x10', param_type: 'text', description: 'Tamaño de cancha (metros)' },
        { param_key: 'wall_height', param_value: '3', param_type: 'number', description: 'Altura de pared (metros)' },
        { param_key: 'ball_pressure', param_value: 'low', param_type: 'select', options: 'low,medium,high', description: 'Presión de la pelota' },
        { param_key: 'scoring_system', param_value: 'tennis', param_type: 'select', options: 'tennis,point', description: 'Sistema de puntuación' },
        { param_key: 'sets_per_match', param_value: '3', param_type: 'number', description: 'Sets por partido' }
      ],
      pickleball: [
        { param_key: 'court_size', param_value: '20x44', param_type: 'text', description: 'Tamaño de cancha (pies)' },
        { param_key: 'net_height', param_value: '36', param_type: 'number', description: 'Altura de red (pulgadas)' },
        { param_key: 'ball_type', param_value: 'plastic', param_type: 'select', options: 'plastic,composite', description: 'Tipo de pelota' },
        { param_key: 'serve_style', param_value: 'underhand', param_type: 'select', options: 'underhand,overhand', description: 'Estilo de saque' },
        { param_key: 'points_to_win', param_value: '11', param_type: 'number', description: 'Puntos para ganar' }
      ],
      badminton: [
        { param_key: 'court_size', param_value: '13.4x6.1', param_type: 'text', description: 'Tamaño de cancha (metros)' },
        { param_key: 'net_height', param_value: '1.55', param_type: 'number', description: 'Altura de red (metros)' },
        { param_key: 'shuttlecock_type', param_value: 'feather', param_type: 'select', options: 'feather,synthetic', description: 'Tipo de volante' },
        { param_key: 'scoring_system', param_value: 'rally_point', param_type: 'select', options: 'rally_point,traditional', description: 'Sistema de puntuación' },
        { param_key: 'sets_per_match', param_value: '3', param_type: 'number', description: 'Sets por partido' }
      ],
      handball: [
        { param_key: 'court_size', param_value: '40x20', param_type: 'text', description: 'Tamaño de cancha (metros)' },
        { param_key: 'goal_size', param_value: '3x2', param_type: 'text', description: 'Tamaño de portería (metros)' },
        { param_key: 'ball_size', param_value: '3', param_type: 'select', options: '1,2,3', description: 'Tamaño de pelota' },
        { param_key: 'match_duration', param_value: '60', param_type: 'number', description: 'Duración del partido (minutos)' },
        { param_key: 'players_per_team', param_value: '7', param_type: 'number', description: 'Jugadores por equipo' }
      ],
      racquetball: [
        { param_key: 'court_type', param_value: 'enclosed', param_type: 'select', options: 'enclosed,outdoor', description: 'Tipo de cancha' },
        { param_key: 'ball_type', param_value: 'blue', param_type: 'select', options: 'blue,red,green', description: 'Tipo de pelota' },
        { param_key: 'serve_style', param_value: 'drive', param_type: 'select', options: 'drive,lob,z', description: 'Estilo de saque' },
        { param_key: 'game_format', param_value: 'best_of_5', param_type: 'select', options: 'best_of_3,best_of_5', description: 'Formato del juego' },
        { param_key: 'points_to_win', param_value: '15', param_type: 'number', description: 'Puntos para ganar' }
      ]
    };

    return configs[sportCode] || [];
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditMode(false);
    setIsParameterModalOpen(true);
  };

  const openEditModal = (parameter: SportParameter) => {
    setParameterForm({
      param_key: parameter.param_key,
      param_value: parameter.param_value,
      param_type: parameter.param_type as any,
      options: parameter.options || '',
      description: parameter.description || ''
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
      description: ''
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
                  Gestiona los parámetros específicos de cada deporte
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
                      <CogIcon className="h-5 w-5 text-gray-400" />
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

        {/* Parameter Modal */}
        {isParameterModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditMode ? 'Editar Parámetro' : 'Nuevo Parámetro'}
                  </h3>
                  <button
                    onClick={() => setIsParameterModalOpen(false)}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clave del Parámetro *
                      </label>
                      <input
                        type="text"
                        value={parameterForm.param_key}
                        onChange={(e) => setParameterForm(prev => ({ ...prev, param_key: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="ej: court_type"
                        disabled={isProcessing}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Parámetro *
                      </label>
                      <select
                        value={parameterForm.param_type}
                        onChange={(e) => setParameterForm(prev => ({ ...prev, param_type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        disabled={isProcessing}
                      >
                        <option value="text">Texto</option>
                        <option value="number">Número</option>
                        <option value="boolean">Verdadero/Falso</option>
                        <option value="select">Selección</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor *
                    </label>
                    {parameterForm.param_type === 'boolean' ? (
                      <select
                        value={parameterForm.param_value}
                        onChange={(e) => setParameterForm(prev => ({ ...prev, param_value: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        disabled={isProcessing}
                      >
                        <option value="true">Verdadero</option>
                        <option value="false">Falso</option>
                      </select>
                    ) : (
                      <input
                        type={parameterForm.param_type === 'number' ? 'number' : 'text'}
                        value={parameterForm.param_value}
                        onChange={(e) => setParameterForm(prev => ({ ...prev, param_value: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Valor del parámetro"
                        disabled={isProcessing}
                      />
                    )}
                  </div>

                  {parameterForm.param_type === 'select' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opciones (separadas por comas)
                      </label>
                      <input
                        type="text"
                        value={parameterForm.options}
                        onChange={(e) => setParameterForm(prev => ({ ...prev, options: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="opcion1,opcion2,opcion3"
                        disabled={isProcessing}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={parameterForm.description}
                      onChange={(e) => setParameterForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Descripción del parámetro"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsParameterModalOpen(false)}
                    disabled={isProcessing}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={isEditMode ? handleUpdateParameter : handleCreateParameter}
                    disabled={isProcessing || !parameterForm.param_key || !parameterForm.param_value}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {isProcessing ? 'Procesando...' : (isEditMode ? 'Actualizar' : 'Crear')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

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