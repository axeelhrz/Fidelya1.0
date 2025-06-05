"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { RoleManager } from "@/components/admin/RoleManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  UserCheck,
  UserX
} from "lucide-react";

export default function UsuariosPage() {
  // Datos de ejemplo
  const usuarios = [
    { id: 1, nombre: "Juan Pérez", email: "juan@ejemplo.com", rol: "user", activo: true, estudiantes: 2 },
    { id: 2, nombre: "María González", email: "maria@ejemplo.com", rol: "admin", activo: true, estudiantes: 1 },
    { id: 3, nombre: "Carlos López", email: "carlos@ejemplo.com", rol: "user", activo: false, estudiantes: 3 },
    { id: 4, nombre: "Ana Martínez", email: "ana@ejemplo.com", rol: "user", activo: true, estudiantes: 1 },
  ];

  return (
    <AdminGuard requiredPermission="usuarios.read">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra usuarios y sus permisos</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Total</span>
              </div>
              <p className="text-2xl font-bold mt-2">156</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Activos</span>
              </div>
              <p className="text-2xl font-bold mt-2">142</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserX className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Inactivos</span>
              </div>
              <p className="text-2xl font-bold mt-2">14</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Admins</span>
              </div>
              <p className="text-2xl font-bold mt-2">3</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar usuarios..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>
              Todos los usuarios registrados en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{usuario.nombre}</h3>
                      <p className="text-sm text-gray-600">{usuario.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant={usuario.rol === 'admin' ? 'default' : 'secondary'}>
                      {usuario.rol}
                    </Badge>
                    <Badge variant={usuario.activo ? 'default' : 'destructive'}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {usuario.estudiantes} estudiante(s)
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}