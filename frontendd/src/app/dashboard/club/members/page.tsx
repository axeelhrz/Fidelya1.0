'use client';

import { useAuth } from '@/contexts/AuthContext';
import ClubLayout from '@/components/clubs/ClubLayout';
import { useEffect, useState } from 'react';
import { 
  UsersIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  IdentificationIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import axios from '@/lib/axios';
import type { Member, Club, ApiResponse, MemberForm } from '@/types';
import MemberModal from '@/components/members/MemberModal';
import DeleteConfirmationModal from '@/components/ui/DeleteConfirmationModal';

interface MemberStats {
  total: number;
  active: number;
  inactive: number;
  male: number;
  female: number;
}

export default function ClubMembersPage() {
  const { user, loading } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [currentClub, setCurrentClub] = useState<Club | null>(null);
  const [stats, setStats] = useState<MemberStats>({ total: 0, active: 0, inactive: 0, male: 0, female: 0 });
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  useEffect(() => {
    if (user && (user.role === 'club' || user.role === 'super_admin')) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoadingData(true);
      
      // Get current club information first
      let clubId = null;
      let clubData = null;

      if (user?.role === 'club') {
        // For club users, get their club information
        const clubsResponse = await axios.get<ApiResponse<Club[]>>('/api/clubs');
        const allClubs = clubsResponse.data.data || [];
        
        // Find the club that belongs to this user
        clubData = allClubs.find(club => club.user_id === user.id);
        clubId = clubData?.id;
      }

      if (!clubId && user?.role !== 'super_admin') {
        console.error('No club found for user');
        return;
      }

      setCurrentClub(clubData);

      // Fetch members - filter by club if not super admin
      const membersResponse = await axios.get<ApiResponse<Member[]>>('/api/members');
      let membersData = membersResponse.data.data || [];

      // Filter members by current club if user is not super admin
      if (user?.role === 'club' && clubId) {
        membersData = membersData.filter(member => member.club_id === clubId);
      }

      setMembers(membersData);

      // Calculate stats
      const memberStats: MemberStats = {
        total: membersData.length,
        active: membersData.filter(m => m.status === 'active').length,
        inactive: membersData.filter(m => m.status === 'inactive').length,
        male: membersData.filter(m => m.gender === 'male').length,
        female: membersData.filter(m => m.gender === 'female').length,
      };
      setStats(memberStats);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreateMember = async (data: MemberForm) => {
    try {
      setIsSubmitting(true);
      
      console.log('Creating member with data:', data);
      console.log('Current club:', currentClub);
      
      // Ensure the member is created for the current club
      const memberData = {
        ...data,
        club_id: currentClub?.id || data.club_id
      };

      console.log('Final member data to send:', memberData);

      const response = await axios.post('/api/members', memberData);
      console.log('Member created successfully:', response.data);
      
      await fetchData();
      setIsModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error creating member:', error);
      
      // Log more detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      
      // Show user-friendly error message
      alert('Error al crear el miembro. Por favor, revisa los datos e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMember = async (data: MemberForm) => {
    if (!selectedMember) return;
    
    try {
      setIsSubmitting(true);
      
      // Ensure the member stays in the current club
      const memberData = {
        ...data,
        club_id: currentClub?.id || data.club_id
      };

      await axios.put(`/api/members/${selectedMember.id}`, memberData);
      await fetchData();
      setIsModalOpen(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error updating member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      await axios.delete(`/api/members/${memberToDelete.id}`);
      await fetchData();
      setIsDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const openEditModal = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const openDeleteModal = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const openCreateModal = () => {
    console.log('Opening create modal...');
    console.log('Current club:', currentClub);
    console.log('Clubs available:', currentClub ? [currentClub] : []);
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.doc_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesGender = genderFilter === 'all' || member.gender === genderFilter;

    return matchesSearch && matchesStatus && matchesGender;
  });

  if (loading || loadingData) {
    return (
      <ClubLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </ClubLayout>
    );
  }

  if (!user || (user.role !== 'club' && user.role !== 'super_admin')) {
    return (
      <ClubLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-800">Acceso Denegado</h1>
          <p className="text-red-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </ClubLayout>
    );
  }

  const clubName = user?.club_name || currentClub?.name || user?.role_info?.name || 'Mi Club';

  return (
    <ClubLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Miembros de {clubName}</h1>
            <p className="mt-2 text-gray-600">
              Administra los miembros de tu club deportivo
              {currentClub?.city && ` • ${currentClub.city}`}
              {currentClub?.league?.name && ` • Liga: ${currentClub.league.name}`}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Miembro
          </button>
        </div>

        {/* Club Info Banner */}
        {currentClub && (
          <div className="bg-gradient-to-r from-green-100 to-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-green-900">{currentClub.name}</h3>
                <p className="text-green-700">
                  {currentClub.city && `${currentClub.city}`}
                  {currentClub.address && ` • ${currentClub.address}`}
                  {currentClub.league?.name && ` • Liga: ${currentClub.league.name}`}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm text-green-600">Total de miembros</p>
                <p className="text-2xl font-bold text-green-900">{stats.total}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inactivos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hombres</p>
                <p className="text-2xl font-bold text-gray-900">{stats.male}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mujeres</p>
                <p className="text-2xl font-bold text-gray-900">{stats.female}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar miembros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>

              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
              >
                <option value="all">Todos los géneros</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredMembers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Miembro
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Información
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <UserCircleIcon className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.full_name}</div>
                            {member.doc_id && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <IdentificationIcon className="h-4 w-4 mr-1" />
                                {member.doc_id}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {member.email && (
                            <div className="text-sm text-gray-900 flex items-center">
                              <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {member.gender && (
                            <div className="text-sm text-gray-900">
                              {member.gender === 'male' ? 'Masculino' : member.gender === 'female' ? 'Femenino' : 'Otro'}
                            </div>
                          )}
                          {member.birthdate && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {new Date(member.birthdate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.status === 'active' ? (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Activo
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="h-4 w-4 mr-1" />
                              Inactivo
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(member)}
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-all duration-200"
                            title="Editar miembro"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(member)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                            title="Eliminar miembro"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm || statusFilter !== 'all' || genderFilter !== 'all' 
                  ? 'No se encontraron miembros' 
                  : 'No hay miembros registrados'
                }
              </h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || statusFilter !== 'all' || genderFilter !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : `Comienza agregando el primer miembro de ${clubName}`
                }
              </p>
              {!searchTerm && statusFilter === 'all' && genderFilter === 'all' && (
                <div className="mt-6">
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Agregar Primer Miembro
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={selectedMember ? handleUpdateMember : handleCreateMember}
        member={selectedMember}
        clubs={currentClub ? [currentClub] : []} // Only pass current club
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDeleteMember}
        title="Eliminar Miembro"
        message={`¿Estás seguro de que deseas eliminar a ${memberToDelete?.full_name}? Esta acción no se puede deshacer.`}
      />
    </ClubLayout>
  );
}