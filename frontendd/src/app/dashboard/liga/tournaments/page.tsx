'use client';

import { useAuth } from '@/contexts/AuthContext';
import LeagueLayout from '@/components/leagues/LeagueLayout';
import { useEffect, useState } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { Tournament, Sport } from '@/types';
import axios from '@/lib/axios';

export default function LigaTournamentsPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get league ID from user data
  const getLeagueId = () => {
    console.log('🔍 Getting league ID from user:', user);
    
    // Try different possible sources for league ID
    if (user?.leagueEntity?.id) {
      console.log('✅ Found league ID in leagueEntity:', user.leagueEntity.id);
      return user.leagueEntity.id;
    }
    
    if (user?.league_entity?.id) {
      console.log('✅ Found league ID in league_entity:', user.league_entity.id);
      return user.league_entity.id;
    }
    
    if (user?.role_info?.entity?.id) {
      console.log('✅ Found league ID in role_info.entity:', user.role_info.entity.id);
      return user.role_info.entity.id;
    }
    
    console.log('❌ No league ID found');
    return null;
  };

  // Fetch tournaments and sports
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 User data:', user);
        console.log('🔍 User role:', user?.role);
        
        if (!user) {
          console.log('❌ No user found');
          setError('Usuario no autenticado');
          return;
        }
        
        if (user.role !== 'liga') {
          console.log('❌ User is not a league admin:', user.role);
          setError('Usuario no es administrador de liga');
          return;
        }
        
        const leagueId = getLeagueId();
        
        if (!leagueId) {
          console.log('❌ No league ID found for user');
          setError('No se encontró información de la liga para este usuario');
          return;
        }

        console.log('🚀 Fetching data for league ID:', leagueId);

        // Fetch tournaments for the current league
        console.log('📊 Fetching tournaments...');
        const tournamentsResponse = await axios.get(`/api/tournaments?league_id=${leagueId}`);
        console.log('✅ Tournaments response:', tournamentsResponse.data);
        setTournaments(Array.isArray(tournamentsResponse.data) ? tournamentsResponse.data : []);

        // Fetch sports
        console.log('🏃 Fetching sports...');
        const sportsResponse = await axios.get('/api/sports');
        console.log('✅ Sports response:', sportsResponse.data);
        setSports(Array.isArray(sportsResponse.data) ? sportsResponse.data : []);

      } catch (error: any) {
        console.error('❌ Error fetching data:', error);
        console.error('❌ Error response:', error.response?.data);
        setError(error.response?.data?.message || error.message || 'Error al cargar los datos');
        setTournaments([]);
        setSports([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <LeagueLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <span className="ml-3 text-gray-600">Cargando torneos...</span>
        </div>
      </LeagueLayout>
    );
  }

  if (error) {
    return (
      <LeagueLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <TrophyIcon className="mx-auto h-12 w-12 text-red-400" />
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

  const leagueId = getLeagueId();
  const leagueName = user?.leagueEntity?.name || user?.league_entity?.name || user?.role_info?.name || 'Liga';
  const leagueProvince = user?.leagueEntity?.province || user?.league_entity?.province || user?.role_info?.province || 'Provincia';

  return (
    <LeagueLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Torneos</h1>
            <p className="text-gray-600">
              {leagueName} - {leagueProvince}
            </p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Información de Debug:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>Usuario ID:</strong> {user?.id}</p>
              <p><strong>Usuario Role:</strong> {user?.role}</p>
              <p><strong>Usuario Name:</strong> {user?.name}</p>
            </div>
            <div>
              <p><strong>Liga ID:</strong> {leagueId || 'No encontrado'}</p>
              <p><strong>Liga Name:</strong> {leagueName}</p>
              <p><strong>Liga Province:</strong> {leagueProvince}</p>
            </div>
            <div>
              <p><strong>Torneos encontrados:</strong> {tournaments.length}</p>
              <p><strong>Deportes encontrados:</strong> {sports.length}</p>
            </div>
            <div>
              <p><strong>leagueEntity:</strong> {user?.leagueEntity ? 'SÍ' : 'NO'}</p>
              <p><strong>league_entity:</strong> {user?.league_entity ? 'SÍ' : 'NO'}</p>
              <p><strong>role_info.entity:</strong> {user?.role_info?.entity ? 'SÍ' : 'NO'}</p>
            </div>
          </div>
        </div>

        {/* Simple Tournament List */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Torneos ({tournaments.length})</h2>
          
          {tournaments.length === 0 ? (
            <div className="text-center py-8">
              <TrophyIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay torneos</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron torneos para esta liga.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{tournament.name}</h3>
                  <p className="text-sm text-gray-600">{tournament.description}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Estado: {tournament.status}</span>
                    <span>Deporte ID: {tournament.sport_id}</span>
                    <span>Participantes: {tournament.current_participants}/{tournament.max_participants}</span>
                    <span>Fecha: {new Date(tournament.start_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Simple Sports List */}
        <div className="bg-white rounded-lg shadow border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deportes ({sports.length})</h2>
          
          {sports.length === 0 ? (
            <p className="text-gray-500">No se encontraron deportes.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sports.map((sport) => (
                <div key={sport.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900">{sport.name}</h4>
                  <p className="text-sm text-gray-500">ID: {sport.id} | Code: {sport.code}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raw User Data for Debugging */}
        <details className="bg-gray-50 p-4 rounded-lg">
          <summary className="cursor-pointer font-medium text-gray-900 mb-2">
            Ver datos completos del usuario (Debug)
          </summary>
          <pre className="text-xs text-gray-600 overflow-auto max-h-64">
            {JSON.stringify(user, null, 2)}
          </pre>
        </details>
      </div>
    </LeagueLayout>
  );
}