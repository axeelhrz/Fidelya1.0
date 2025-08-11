'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Layout from '@/components/Layout';
import api from '@/lib/axios';
import { Sport, SportForm, PaginatedResponse } from '@/types';

const sportSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').max(10, 'Code must be at most 10 characters'),
});

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSport, setEditingSport] = useState<Sport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SportForm>({
    resolver: zodResolver(sportSchema),
  });

  const fetchSports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await api.get<PaginatedResponse<Sport>>(`/api/sports?${params}`);
      setSports(response.data.data.data);
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, [searchTerm]);

  const onSubmit = async (data: SportForm) => {
    try {
      if (editingSport) {
        await api.put(`/api/sports/${editingSport.id}`, data);
      } else {
        await api.post('/api/sports', data);
      }
      
      reset();
      setShowForm(false);
      setEditingSport(null);
      fetchSports();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error saving sport:', error.message);
      } else {
        console.error('Error saving sport:', error);
      }
    }
  };

  const handleEdit = (sport: Sport) => {
    setEditingSport(sport);
    reset({
      name: sport.name,
      code: sport.code,
    });
    setShowForm(true);
  };

  const handleDelete = async (sport: Sport) => {
    if (!confirm(`Are you sure you want to delete "${sport.name}"?`)) return;
    try {
      await api.delete(`/api/sports/${sport.id}`);
      fetchSports();
    } catch (error: unknown) {
      interface ApiError {
        response?: {
          data?: {
            message?: string;
          };
        };
      }

      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as ApiError).response?.data?.message === 'string'
      ) {
        alert((error as ApiError).response!.data!.message!);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Error deleting sport');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSport(null);
    reset();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sports</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage sports and their configuration parameters
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Sport
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or code..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingSport ? 'Edit Sport' : 'Add New Sport'}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="e.g., Football, Basketball"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Code</label>
                    <input
                      {...register('code')}
                      type="text"
                      placeholder="e.g., FUT, BASK"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm uppercase"
                      style={{ textTransform: 'uppercase' }}
                    />
                    {errors.code && (
                      <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Unique identifier for the sport (will be converted to uppercase)
                    </p>
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
                      {isSubmitting ? 'Saving...' : editingSport ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Sports Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading sports...</p>
            </div>
          ) : sports.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No sports found. Create your first sport to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sports.map((sport) => (
                <li key={sport.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{sport.name}</h3>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sport.code}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {sport.parameters_count || 0} parameters configured
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/sports/${sport.id}/parameters`}
                        className="text-green-600 hover:text-green-900 text-sm font-medium"
                      >
                        Parameters
                      </Link>
                      <button
                        onClick={() => handleEdit(sport)}
                        className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sport)}
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

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                About Sports Parameters
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Each sport can have custom parameters that define its rules and configuration. 
                  Click on &quot;Parameters&quot; next to any sport to manage its specific settings like 
                  points per win, match duration, number of players, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}