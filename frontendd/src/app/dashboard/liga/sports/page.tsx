'use client';

import { useAuth } from '@/contexts/AuthContext';
import LeagueLayout from '@/components/leagues/LeagueLayout';
import { useEffect, useState } from 'react';
import { CogIcon } from '@heroicons/react/24/outline';
import { Sport } from '@/types';
import axios from '@/lib/axios';

export default function LigaSportsPage() {
  const { user } = useAuth();
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      console.log('Fetching sports...');
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/sports');
      console.log('Sports API response:', response.data);
      
      if (response.data && response.data.data) {
        // Handle paginated response
        const sportsData = response.data.data.data || response.data.data;
        setSports(sportsData);
        console.log('Sports loaded:', sportsData);
      } else {
        console.error('Unexpected response structure:', response.data);
        setError('Estructura de respuesta inesperada');
      }
    } catch (error: any) {
      console.error('Error fetching sports:', error);
      setError(error.response?.data?.message || error.message || 'Error al cargar deportes');
    } finally {
      setLoading(false);
    }
  };

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
                  Gestiona los parámetros de cada deporte
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Información de Debug</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Usuario:</strong> {user?.name || 'No disponible'}</p>
            <p><strong>Role:</strong> {user?.role || 'No disponible'}</p>
            <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'Ninguno'}</p>
            <p><strong>Deportes cargados:</strong> {sports.length}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white shadow rounded-lg p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando deportes...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <CogIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar deportes</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchSports}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && sports.length === 0 && (
            <div className="text-center py-8">
              <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay deportes</h3>
              <p className="text-gray-600">No se encontraron deportes en el sistema.</p>
            </div>
          )}

          {!loading && !error && sports.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Deportes Disponibles ({sports.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sports.map((sport) => (
                  <div
                    key={sport.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{sport.name}</h4>
                        <p className="text-sm text-gray-500">Código: {sport.code}</p>
                      </div>
                      <CogIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      ID: {sport.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </LeagueLayout>
  );
}