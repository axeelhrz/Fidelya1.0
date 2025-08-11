'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Layout from '@/components/Layout';
import api from '@/lib/axios';
import { Club, ClubForm, League, PaginatedResponse } from '@/types';

const clubSchema = z.object({
  league_id: z.number().min(1, 'Please select a league'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  city: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [leagueFilter, setLeagueFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClubForm>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      status: 'active',
    },
  });

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (leagueFilter) params.append('league_id', leagueFilter);
      if (statusFilter) params.append('status', statusFilter);
      
      const response = await api.get<PaginatedResponse<Club>>(`/api/clubs?${params}`);
      setClubs(response.data.data.data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeagues = async () => {
    try {
      const response = await api.get<PaginatedResponse<League>>('/api/leagues?status=active&per_page=100');
      setLeagues(response.data.data.data);
    } catch (error) {
      console.error('Error fetching leagues:', error);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [searchTerm, leagueFilter, statusFilter]);

  const onSubmit = async (data: ClubForm) => {
    try {
      if (editingClub) {
        await api.put(`/api/clubs/${editingClub.id}`, data);
      } else {
        await api.post('/api/clubs', data);
      }
      
      reset();
      setShowForm(false);
      setEditingClub(null);
      fetchClubs();
    } catch (error: any) {
      console.error('Error saving club:', error);
    }
  };

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    reset({
      league_id: club.league_id,
      name: club.name,
      city: club.city || '',
      status: club.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (club: Club) => {
    if (!confirm(`Are you sure you want to delete "${club.name}"?`)) return;
    
    try {
      await api.delete(`/api/clubs/${club.id}`);
      fetchClubs();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error deleting club');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClub(null);
    reset();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clubs</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage clubs and their league associations
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Club
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or city..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="league" className="block text-sm font-medium text-gray-700">
                League
              </label>
              <select
                id="league"
                value={leagueFilter}
                onChange={(e) => setLeagueFilter(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Leagues</option>
                {leagues.map((league) => (
                  <option key={league.id} value={league.id}>
                    {league.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingClub ? 'Edit Club' : 'Add New Club'}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">League</label>
                    <select
                      {...register('league_id', { valueAsNumber: true })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a league</option>
                      {leagues.map((league) => (
                        <option key={league.id} value={league.id}>
                          {league.name}
                        </option>
                      ))}
                    </select>
                    {errors.league_id && (
                      <p className="mt-1 text-sm text-red-600">{errors.league_id.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      {...register('name')}
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      {...register('city')}
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      {...register('status')}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : editingClub ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Clubs Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading clubs...</p>
            </div>
          ) : clubs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No clubs found. Create your first club to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {clubs.map((club) => (
                <li key={club.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{club.name}</h3>
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            club.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {club.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        League: {club.league?.name}
                      </p>
                      {club.city && (
                        <p className="mt-1 text-sm text-gray-600">City: {club.city}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        {club.members_count || 0} members
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(club)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(club)}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
}