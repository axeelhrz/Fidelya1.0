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
  XCircleIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Sport, SportParameter, SportParameterForm } from '@/types';
import axios from '@/lib/axios';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';

export default function LigaSportsPage() {
  const { user } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [sportParameters, setSportParameters] = useState<SportParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [parametersLoading, setParametersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isParameterModalOpen, setIsParameterModalOpen] = useState(false);
  const [isEditParameterModalOpen, setIsEditParameterModalOpen] = useState(false);
  const [isDeleteParameterModalOpen, setIsDeleteParameterModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<SportParameter | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get league ID from user data
  const getLeagueId = () => {
    if (user?.leagueEntity?.id) return user.leagueEntity.id;
    if (user?.league_entity?.id) return user.league_entity.id;
    if (user?.role_info?.entity?.id) return user.role_info.entity.id;
    return null;
  };

  const leagueId = getLeagueId();
  const leagueName = user?.leagueEntity?.name || user?.league_entity?.name || user?.role_info?.name || 'Liga';
  const leagueProvince = user?.leagueEntity?.province || user?.league_entity?.province || user?.role_info?.province || 'Provincia';

  const [newParameter, setNewParameter] = useState<SportParameterForm>({
    sport_id: 0,
    parameter_name: '',
    parameter_value: '',
    parameter_type: 'string',
    options: ''
  });

  // Predefined sport configurations
  const sportConfigurations = {
    'Tenis': [
      { name: 'Tipo de Cancha', value: 'Arcilla', type: 'select', options: 'Arcilla,Césped,Dura,Sintética' },
      { name: 'Formato de Set', value: 'Mejor de 3', type: 'select', options: 'Mejor de 3,Mejor de 5' },
      { name: 'Tiebreak', value: 'Sí', type: 'select', options: 'Sí,No' },
      { name: 'Tiempo de Saque', value: '25 segundos', type: 'string' },
      { name: 'Pelotas por Set', value: '6', type: 'number' }
    ],
    'Tenis de Mesa': [
      { name: 'Color de Pelota', value: 'Naranja', type: 'select', options: 'Blanca,Naranja' },
      { name: 'Tamaño de Mesa', value: '2.74m x 1.525m', type: 'string' },
      { name: 'Altura de Red', value: '15.25cm', type: 'string' },
      { name: 'Formato de Juego', value: 'Mejor de 5', type: 'select', options: 'Mejor de 3,Mejor de 5,Mejor de 7' },
      { name: 'Puntos por Set', value: '11', type: 'number' }
    ],
    'Padel': [
      { name: 'Tamaño de Cancha', value: '20m x 10m', type: 'string' },
      { name: 'Altura de Pared', value: '3m', type: 'string' },
      { name: 'Presión de Pelota', value: 'Baja presión', type: 'select', options: 'Alta presión,Baja presión' },
      { name: 'Sistema de Puntuación', value: 'Tenis', type: 'select', options: 'Tenis,Por puntos' },
      { name: 'Sets por Partido', value: '3', type: 'number' }
    ],
    'Pickleball': [
      { name: 'Tamaño de Cancha', value: '20ft x 44ft', type: 'string' },
      { name: 'Altura de Red', value: '36 pulgadas', type: 'string' },
      { name: 'Tipo de Pelota', value: 'Perforada', type: 'select', options: 'Perforada,Sólida' },
      { name: 'Estilo de Saque', value: 'Por debajo', type: 'select', options: 'Por debajo,Por arriba' },
      { name: 'Puntos para Ganar', value: '11', type: 'number' }
    ],
    'Badminton': [
      { name: 'Tamaño de Cancha', value: '13.4m x 6.1m', type: 'string' },
      { name: 'Altura de Red', value: '1.55m', type: 'string' },
      { name: 'Tipo de Volante', value: 'Plumas', type: 'select', options: 'Plumas,Sintético' },
      { name: 'Sistema de Puntuación', value: '21 puntos', type: 'select', options: '15 puntos,21 puntos' },
      { name: 'Sets por Partido', value: '3', type: 'number' }
    ],
    'Handball': [
      { name: 'Tamaño de Cancha', value: '40m x 20m', type: 'string' },
      { name: 'Tamaño de Portería', value: '3m x 2m', type: 'string' },
      { name: 'Tamaño de Pelota', value: 'Estándar', type: 'select', options: 'Juvenil,Estándar,Senior' },
      { name: 'Duración del Partido', value: '60 minutos', type: 'string' },
      { name: 'Jugadores por Equipo', value: '7', type: 'number' }
    ],
    'Raquetball': [
      { name: 'Tipo de Cancha', value: 'Cerrada', type: 'select', options: 'Cerrada,Abierta' },
      { name: 'Tipo de Pelota', value: 'Azul', type: 'select', options: 'Azul,Roja,Verde' },
      { name: 'Estilo de Saque', value: 'Por debajo', type: 'select', options: 'Por debajo,Por arriba' },
      { name: 'Formato de Juego', value: 'Mejor de 3', type: 'select', options: 'Mejor de 3,Mejor de 5' },
      { name: 'Puntos para Ganar', value: '15', type: 'number' }
    ]
  };

  // Fetch sports
  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!user) {
          setError('Usuario no autenticado');
          return;
        }
        
        if (user.role !== 'liga') {
          setError('Usuario no es administrador de liga');
          return;
        }

        const sportsResponse = await axios.get('/api/sports');
        setSports(Array.isArray(sportsResponse.data) ? sportsResponse.data : []);

      } catch (error: any) {
        console.error('Error fetching sports:', error);
        setError(error.response?.data?.message || error.message || 'Error al cargar los deportes');
        setSports([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSports();
    }
  }, [user]);

  // Fetch sport parameters
  const fetchSportParameters = async (sportId: number) => {
    try {
      setParametersLoading(true);
      const response = await axios.get(`/api/sports/${sportId}/parameters`);
      setSportParameters(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error('Error fetching sport parameters:', error);
      setSportParameters([]);
    } finally {
      setParametersLoading(false);
    }
  };

  // Handle sport selection
  const handleSportSelect = (sport: Sport) => {
    setSelectedSport(sport);
    fetchSportParameters(sport.id);
  };

  // Handle create parameter
  const handleCreateParameter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSport) return;

    setIsProcessing(true);

    try {
      const parameterData = {
        ...newParameter,
        sport_id: selectedSport.id
      };

      const response = await axios.post(`/api/sports/${selectedSport.id}/parameters`, parameterData);
      console.log('Parameter created:', response.data);
      
      setSportParameters(prev => [...prev, response.data]);
      setIsParameterModalOpen(false);
      resetParameterForm();
    } catch (error: any) {
      console.error('Error creating parameter:', error);
      alert(error.response?.data?.message || 'Error al crear el parámetro');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle edit parameter
  const handleEditParameter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParameter || !selectedSport) return;

    setIsProcessing(true);

    try {
      const response = await axios.put(`/api/sports/${selectedSport.id}/parameters/${selectedParameter.id}`, newParameter);
      console.log('Parameter updated:', response.data);
      
      setSportParameters(prev => prev.map(p => p.id === selectedParameter.id ? response.data : p));
      setIsEditParameterModalOpen(false);
      setSelectedParameter(null);
      resetParameterForm();
    } catch (error: any) {
      console.error('Error updating parameter:', error);
      alert(error.response?.data?.message || 'Error al actualizar el parámetro');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle delete parameter
  const handleDeleteParameter = async () => {
    if (!selectedParameter || !selectedSport) return;

    setIsProcessing(true);

    try {
      await axios.delete(`/api/sports/${selectedSport.id}/parameters/${selectedParameter.id}`);
      console.log('Parameter deleted:', selectedParameter.id);
      
      setSportParameters(prev => prev.filter(p => p.id !== selectedParameter.id));
      setIsDeleteParameterModalOpen(false);
      setSelectedParameter(null);
    } catch (error: any) {
      console.error('Error deleting parameter:', error);
      alert(error.response?.data?.message || 'Error al eliminar el parámetro');
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-configure sport
  const handleAutoConfigureSport = async (sport: Sport) => {
    if (!sportConfigurations[sport.name as keyof typeof sportConfigurations]) {
      alert('No hay configuración predefinida para este deporte');
      return;
    }

    setIsProcessing(true);

    try {
      const config = sportConfigurations[sport.name as keyof typeof sportConfigurations];
      
      for (const param of config) {
        const parameterData = {
          sport_id: sport.id,
          parameter_name: param.name,
          parameter_value: param.value,
          parameter_type: param.type,
          options: param.options || ''
        };

        await axios.post(`/api/sports/${sport.id}/parameters`, parameterData);
      }

      // Refresh parameters
      fetchSportParameters(sport.id);
      alert(`Configuración automática aplicada para ${sport.name}`);
    } catch (error: any) {
      console.error('Error auto-configuring sport:', error);
      alert(error.response?.data?.message || 'Error al configurar automáticamente el deporte');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset parameter form
  const resetParameterForm = () => {
    setNewParameter({
      sport_id: selectedSport?.id || 0,
      parameter_name: '',
      parameter_value: '',
      parameter_type: 'string',
      options: ''
    });
  };

  // Open edit parameter modal
  const openEditParameterModal = (parameter: SportParameter) => {
    setSelectedParameter(parameter);
    setNewParameter({
      sport_id: parameter.sport_id,
      parameter_name: parameter.parameter_name,
      parameter_value: parameter.parameter_value,
      parameter_type: parameter.parameter_type,
      options: parameter.options || ''
    });
    setIsEditParameterModalOpen(true);
  };

  // Open delete parameter modal
  const openDeleteParameterModal = (parameter: SportParameter) => {
    setSelectedParameter(parameter);
    setIsDeleteParameterModalOpen(true);
  };

  // Filter sports
  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sport.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <LeagueLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <span className="ml-3 text-gray-600">Cargando deportes...</span>
        </div>
      </LeagueLayout>
    );
  }

  if (error) {
    return (
      <LeagueLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <CogIcon className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
            >
              Reintentar
            </button>
          </div>
        </div>
      </LeagueLayout>
    );
  }

  return (
    <LeagueLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración de Deportes</h1>
            <p className="text-gray-600">{leagueName} - {leagueProvince}</p>
          </div>
        </div>

        {/* League Info Banner */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CogIcon className="w-12 h-12 text-yellow-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Gestión de Deportes</h2>
                <p className="text-gray-600">Configura los parámetros específicos de cada deporte</p>
                <p className="text-sm text-gray-500">
                  {sports.length} deportes disponibles para configurar
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sports List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Deportes Disponibles</h3>
                
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar deportes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredSports.length === 0 ? (
                  <div className="p-6 text-center">
                    <CogIcon className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No se encontraron deportes</p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredSports.map((sport) => (
                      <button
                        key={sport.id}
                        onClick={() => handleSportSelect(sport)}
                        className={`w-full text-left p-4 rounded-lg transition-colors ${
                          selectedSport?.id === sport.id
                            ? 'bg-yellow-50 border-2 border-yellow-200'
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{sport.name}</h4>
                            <p className="text-sm text-gray-500">Código: {sport.code}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedSport?.id === sport.id && (
                              <CheckCircleIcon className="w-5 h-5 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sport Configuration */}
          <div className="lg:col-span-2">
            {!selectedSport ? (
              <div className="bg-white rounded-lg shadow border p-12 text-center">
                <CogIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Selecciona un Deporte</h3>
                <p className="mt-2 text-gray-500">
                  Elige un deporte de la lista para configurar sus parámetros específicos
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Configuración de {selectedSport.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Código: {selectedSport.code}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAutoConfigureSport(selectedSport)}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        <AdjustmentsHorizontalIcon className="w-4 h-4" />
                        Auto-configurar
                      </button>
                      <button
                        onClick={() => {
                          resetParameterForm();
                          setIsParameterModalOpen(true);
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Agregar Parámetro
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {parametersLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                      <span className="ml-3 text-gray-600">Cargando parámetros...</span>
                    </div>
                  ) : sportParameters.length === 0 ? (
                    <div className="text-center py-8">
                      <AdjustmentsHorizontalIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h4 className="mt-2 text-sm font-medium text-gray-900">No hay parámetros configurados</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Agrega parámetros específicos para este deporte o usa la configuración automática
                      </p>
                      <div className="mt-4 flex justify-center space-x-3">
                        <button
                          onClick={() => handleAutoConfigureSport(selectedSport)}
                          disabled={isProcessing}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                        >
                          Configuración Automática
                        </button>
                        <button
                          onClick={() => {
                            resetParameterForm();
                            setIsParameterModalOpen(true);
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Agregar Manualmente
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sportParameters.map((parameter) => (
                        <div key={parameter.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{parameter.parameter_name}</h5>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Valor:</span> {parameter.parameter_value}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>Tipo: {parameter.parameter_type}</span>
                                {parameter.options && (
                                  <span>Opciones: {parameter.options}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditParameterModal(parameter)}
                                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Editar parámetro"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteParameterModal(parameter)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar parámetro"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Parameter Modal */}
        {isParameterModalOpen && selectedSport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Agregar Parámetro - {selectedSport.name}
                  </h3>
                  <button
                    onClick={() => {
                      setIsParameterModalOpen(false);
                      resetParameterForm();
                    }}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateParameter} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Parámetro *
                      </label>
                      <input
                        type="text"
                        required
                        value={newParameter.parameter_name}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, parameter_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Ej: Tipo de Cancha"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Parámetro *
                      </label>
                      <select
                        required
                        value={newParameter.parameter_type}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, parameter_type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="string">Texto</option>
                        <option value="number">Número</option>
                        <option value="boolean">Verdadero/Falso</option>
                        <option value="select">Selección</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor del Parámetro *
                    </label>
                    <input
                      type={newParameter.parameter_type === 'number' ? 'number' : 'text'}
                      required
                      value={newParameter.parameter_value}
                      onChange={(e) => setNewParameter(prev => ({ ...prev, parameter_value: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Ej: Arcilla"
                    />
                  </div>

                  {newParameter.parameter_type === 'select' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opciones (separadas por comas)
                      </label>
                      <input
                        type="text"
                        value={newParameter.options}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, options: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Ej: Arcilla,Césped,Dura,Sintética"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsParameterModalOpen(false);
                        resetParameterForm();
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Creando...' : 'Crear Parámetro'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Parameter Modal */}
        {isEditParameterModalOpen && selectedParameter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Editar Parámetro
                  </h3>
                  <button
                    onClick={() => {
                      setIsEditParameterModalOpen(false);
                      setSelectedParameter(null);
                      resetParameterForm();
                    }}
                    disabled={isProcessing}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleEditParameter} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Parámetro *
                      </label>
                      <input
                        type="text"
                        required
                        value={newParameter.parameter_name}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, parameter_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Parámetro *
                      </label>
                      <select
                        required
                        value={newParameter.parameter_type}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, parameter_type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="string">Texto</option>
                        <option value="number">Número</option>
                        <option value="boolean">Verdadero/Falso</option>
                        <option value="select">Selección</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor del Parámetro *
                    </label>
                    <input
                      type={newParameter.parameter_type === 'number' ? 'number' : 'text'}
                      required
                      value={newParameter.parameter_value}
                      onChange={(e) => setNewParameter(prev => ({ ...prev, parameter_value: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>

                  {newParameter.parameter_type === 'select' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opciones (separadas por comas)
                      </label>
                      <input
                        type="text"
                        value={newParameter.options}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, options: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        placeholder="Ej: Arcilla,Césped,Dura,Sintética"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditParameterModalOpen(false);
                        setSelectedParameter(null);
                        resetParameterForm();
                      }}
                      disabled={isProcessing}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Parameter Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteParameterModalOpen}
          onClose={() => setIsDeleteParameterModalOpen(false)}
          onConfirm={handleDeleteParameter}
          title="Eliminar Parámetro"
          message={`¿Estás seguro de que deseas eliminar el parámetro "${selectedParameter?.parameter_name}"? Esta acción no se puede deshacer.`}
          isProcessing={isProcessing}
        />
      </div>
    </LeagueLayout>
  );
}