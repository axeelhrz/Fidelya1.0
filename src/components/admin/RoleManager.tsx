"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Users, 
  Edit, 
  X,
  Crown,
  Eye,
  Settings,
  UserCheck,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type UserRole = 'super_admin' | 'admin' | 'moderator' | 'viewer' | 'user';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  last_login?: string | null;
  login_count?: number;
  created_at: string;
  role_assigned_at?: string | null;
}

interface UserWithRole extends User {
  roleInfo?: {
    displayName: string;
    color: string;
  };
}

interface Role {
  name: UserRole;
  display_name: string;
  description: string;
  color: string;
  is_active: boolean;
  userCount?: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: string;
}



export function RoleManager() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar usuarios con información de roles
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          roles!inner(display_name, color)
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Cargar roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (rolesError) throw rolesError;

      // Cargar permisos
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('*')
        .order('module', { ascending: true });

      if (permissionsError) throw permissionsError;

      // Mapear usuarios con información de roles
      const mappedUsers = usersData?.map(user => ({
        ...user,
        roleInfo: {
          displayName: user.roles?.display_name || user.role,
          color: user.roles?.color || '#6b7280'
        }
      })) || [];

      setUsers(mappedUsers);
      setRoles(rolesData || []);
      setPermissions(permissionsData || []);
    } catch (error: unknown) {
      console.error('Error loading data:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar datos",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          role: newRole,
          role_assigned_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado exitosamente.",
      });

      await loadData();
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error: unknown) {
      console.error('Error updating user role:', error);
      toast({
        variant: "destructive",
        title: "Error al actualizar rol",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Usuario desactivado" : "Usuario activado",
        description: `El usuario ha sido ${currentStatus ? 'desactivado' : 'activado'} exitosamente.`,
      });

      await loadData();
    } catch (error: unknown) {
      console.error('Error toggling user status:', error);
      toast({
        variant: "destructive",
        title: "Error al cambiar estado",
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return <Crown className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'moderator': return <Settings className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'admin': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderator': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.module]) {
      acc[permission.module] = [];
    }
    acc[permission.module].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestión de Roles</h2>
          <p className="text-gray-600 mt-1">
            Administra roles y permisos de usuarios del sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {users.length} usuarios totales
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar usuarios</Label>
              <Input
                id="search"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-filter">Filtrar por rol</Label>
              <Select value={filterRole} onValueChange={(value) => setFilterRole(value as UserRole | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                !user.is_active ? 'opacity-60' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: user.roleInfo?.color || '#6b7280' }}
                      >
                        {user.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 truncate">
                          {user.full_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {user.is_active ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rol actual:</span>
                      <Badge 
                        className={`${getRoleColor(user.role)} flex items-center gap-1`}
                      >
                        {getRoleIcon(user.role)}
                        {user.roleInfo?.displayName || user.role}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Último acceso:</span>
                      <span className="text-sm text-gray-900">
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleDateString('es-CL')
                          : 'Nunca'
                        }
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Inicios de sesión:</span>
                      <span className="text-sm text-gray-900">
                        {user.login_count || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Dialog 
                      open={isEditDialogOpen && selectedUser?.id === user.id} 
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (!open) setSelectedUser(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Editar Usuario</DialogTitle>
                          <DialogDescription>
                            Modifica el rol y estado del usuario
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedUser && (
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                style={{ backgroundColor: selectedUser.roleInfo?.color || '#6b7280' }}
                              >
                                {selectedUser.full_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{selectedUser.full_name}</p>
                                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Nuevo rol</Label>
                              <Select 
                                defaultValue={selectedUser.role}
                                onValueChange={(value) => updateUserRole(selectedUser.id, value as UserRole)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role.name} value={role.name}>
                                      <div className="flex items-center gap-2">
                                        {getRoleIcon(role.name)}
                                        {role.display_name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant={user.is_active ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                    >
                      {user.is_active ? (
                        <>
                          <X className="w-4 h-4 mr-1" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          Activar
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron usuarios
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      )}

      {/* Información de permisos por módulo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permisos por Módulo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
              <div key={module} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                  {module}
                </h4>
                <div className="space-y-1">
                  {modulePermissions.map((permission) => (
                    <div key={permission.id} className="text-sm text-gray-600">
                      <span className="font-medium">{permission.action}</span>
                      {permission.description && (
                        <span className="text-gray-500"> - {permission.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}