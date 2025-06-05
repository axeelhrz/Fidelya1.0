"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Users, 
  Edit, 
  Trash2, 
  Plus,
  Check,
  X,
  Crown,
  Eye,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth, UserRole } from "@/hooks/useAuth";

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

interface RolePermission {
  role_name: UserRole;
  permission_id: string;
  permission: Permission;
}

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { canManageRoles } = useAuth();

  useEffect(() => {
    if (canManageRoles()) {
      loadRolesData();
    }
  }, [canManageRoles]);

  const loadRolesData = async () => {
    try {
      setLoading(true);

      // Cargar roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      // Cargar permisos
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('*')
        .order('module, action');

      // Cargar relaciones rol-permiso
      const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
        .from('role_permissions')
        .select(`
          role_name,
          permission_id,
          permissions (*)
        `);

      // Contar usuarios por rol
      const { data: userCounts, error: userCountsError } = await supabase
        .from('clientes')
        .select('role')
        .eq('is_active', true);

      if (rolesError) throw rolesError;
      if (permissionsError) throw permissionsError;
      if (rolePermissionsError) throw rolePermissionsError;

      // Procesar conteo de usuarios
      const counts = userCounts?.reduce((acc: any, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {}) || {};

      // Agregar conteo a roles
      const rolesWithCounts = rolesData?.map(role => ({
        ...role,
        userCount: counts[role.name] || 0
      })) || [];

      setRoles(rolesWithCounts);
      setPermissions(permissionsData || []);
      setRolePermissions(rolePermissionsData || []);

    } catch (error: any) {
      console.error('Error loading roles data:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar datos",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRolePermissions = async (roleName: UserRole, permissionIds: string[]) => {
    try {
      // Eliminar permisos existentes
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_name', roleName);

      // Agregar nuevos permisos
      if (permissionIds.length > 0) {
        const newRolePermissions = permissionIds.map(permissionId => ({
          role_name: roleName,
          permission_id: permissionId
        }));

        const { error } = await supabase
          .from('role_permissions')
          .insert(newRolePermissions);

        if (error) throw error;
      }

      toast({
        title: "Permisos actualizados",
        description: `Los permisos del rol ${roleName} han sido actualizados`,
      });

      loadRolesData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar permisos",
        description: error.message,
      });
    }
  };

  const getRoleIcon = (roleName: UserRole) => {
    switch (roleName) {
      case 'super_admin': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'moderator': return <Settings className="h-4 w-4" />;
      case 'viewer': return <Eye className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: Role) => {
    return (
      <Badge 
        style={{ backgroundColor: role.color + '20', color: role.color, borderColor: role.color }}
        className="flex items-center space-x-1"
      >
        {getRoleIcon(role.name)}
        <span>{role.display_name}</span>
      </Badge>
    );
  };

  const getPermissionsByRole = (roleName: UserRole) => {
    return rolePermissions
      .filter(rp => rp.role_name === roleName)
      .map(rp => rp.permission_id);
  };

  const getPermissionsByModule = () => {
    const grouped = permissions.reduce((acc: any, permission) => {
      if (!acc[permission.module]) {
        acc[permission.module] = [];
      }
      acc[permission.module].push(permission);
      return acc;
    }, {});
    return grouped;
  };

  const RolePermissionsEditor = ({ role }: { role: Role }) => {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
      getPermissionsByRole(role.name)
    );
    const [saving, setSaving] = useState(false);

    const handlePermissionToggle = (permissionId: string) => {
      setSelectedPermissions(prev => 
        prev.includes(permissionId)
          ? prev.filter(id => id !== permissionId)
          : [...prev, permissionId]
      );
    };

    const handleSave = async () => {
      setSaving(true);
      await updateRolePermissions(role.name, selectedPermissions);
      setSaving(false);
      setIsEditDialogOpen(false);
    };

    const permissionsByModule = getPermissionsByModule();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getRoleBadge(role)}
            <div>
              <h3 className="font-semibold">{role.display_name}</h3>
              <p className="text-sm text-slate-500">{role.description}</p>
            </div>
          </div>
          <Badge variant="secondary">
            {role.userCount} usuarios
          </Badge>
        </div>

        <div className="space-y-4">
          {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
            <Card key={module} className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium capitalize">
                  {module}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-3">
                  {(modulePermissions as Permission[]).map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor={permission.id} className="text-sm font-medium">
                          {permission.description}
                        </Label>
                        <p className="text-xs text-slate-500">
                          {permission.name}
                        </p>
                      </div>
                      <Switch
                        id={permission.id}
                        checked={selectedPermissions.includes(permission.id)}
                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => setIsEditDialogOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    );
  };

  if (!canManageRoles()) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Acceso Restringido
            </h3>
            <p className="text-slate-600">
              No tienes permisos para gestionar roles del sistema.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Gestión de Roles
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Administra roles y permisos del sistema
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {getRoleBadge(role)}
                  <Badge variant="secondary">
                    {role.userCount} usuarios
                  </Badge>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {role.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: role.color }}
                    ></div>
                    <span className="text-xs text-slate-500">
                      {getPermissionsByRole(role.name).length} permisos
                    </span>
                  </div>
                  
                  <Dialog open={isEditDialogOpen && selectedRole?.name === role.name} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedRole(role)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Permisos del Rol</DialogTitle>
                        <DialogDescription>
                          Configura los permisos para el rol seleccionado
                        </DialogDescription>
                      </DialogHeader>
                      {selectedRole && <RolePermissionsEditor role={selectedRole} />}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
